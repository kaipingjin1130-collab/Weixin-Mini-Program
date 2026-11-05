"""Expose actual review stages; OCR availability is not semantic acceptance."""
import gzip,json,collections
from sqlalchemy import select
from ...storage import asset_path
from .models import HistoryFinding,HistoryIssue
def scan_stage(sha,page):
    assert len(sha)==64 and all(c in '0123456789abcdef' for c in sha) and type(page) is int and page>0
    p=asset_path(f'history/ocr/rapidocr-grid-20261102-v1/{sha}/{page}.json.gz')
    if not p.is_file():return 'not_ocr'
    try:
        with gzip.open(p,'rt',encoding='utf-8') as f:data=json.load(f)
        assert data['source_sha256']==sha and data['physical_page']==page
        assert data['version']=='rapidocr-grid-20261102-v1'
        return 'ocr_ready_for_structure_review' if data['lines'] else 'no_text_needs_page_type_check'
    except (OSError,ValueError,KeyError,AssertionError,TypeError):return 'ocr_cache_invalid'

def identity_review(sha):
    p=asset_path(f'history/content-reviews/{sha}.json')
    if not p.is_file():return None
    data=json.loads(p.read_text(encoding='utf-8'));assert data['source_sha256']==sha
    return data

def record_dispositions(sha):
    """Source-verified non-problem rows, kept as source records, not hazards."""
    assert len(sha)==64 and all(c in '0123456789abcdef' for c in sha)
    p=asset_path(f'history/record-dispositions/{sha}.json')
    if not p.is_file():return {}
    data=json.loads(p.read_text(encoding='utf-8'));assert data['source_sha256']==sha
    result={}
    for r in data['records']:
        assert r['decision']=='non_problem_section_heading' and r['analysis_include'] is False
        assert r['evidence']['source_sha256']==sha and r['evidence']['quote'].strip()
        assert r['source_key'] not in result
        result[r['source_key']]=r
    return result

def effective_fields(fields,source_key,identity):
    """Apply explicit source-backed judgments to a view; raw fields stay intact."""
    import datetime
    result=dict(fields);reviews=[]
    for review in (identity or {}).get('field_resolutions',[]):
        if review['source_key']!=source_key:continue
        assert review['field']=='inspection_date' and review['status']=='confirmed'
        assert review['evidence'] and review['reason']
        datetime.date.fromisoformat(review['resolved_value'])
        row=dict(review);row['applicable']=fields.get(review['field'])==review['original_value']
        if row['applicable']:result[review['field']]=review['resolved_value']
        reviews.append(row)
    return result,reviews

def status(db,doc,run):
    if run is None:return {'import_id':None,'scan_pages':[],'site_scope':{},'content_review':identity_review(doc.sha256)}
    from .lifecycle import deletion_info
    removed=deletion_info(run)
    if removed:return {'import_id':run.id,'scan_pages':[],'scan_counts':{},
        'site_scope':{'missing_findings':0,'registered_issues':0,'missing_alert_findings':[],
          'actionable_missing_findings':0,'stage_counts':{},'records':[]},'deletion':removed,
        'content_review':identity_review(doc.sha256),'ocr_is_semantic_acceptance':False}
    issues=list(db.scalars(select(HistoryIssue).where(HistoryIssue.import_id==run.id)))
    rows=list(db.scalars(select(HistoryFinding).where(HistoryFinding.import_id==run.id)))
    missing=[f for f in rows if f.engineering_project_name is None]
    flagged={i.finding_id for i in issues if i.code=='SITE_SCOPE_UNRESOLVED'}
    pages=sorted({i.locator['physical_page'] for i in issues if i.code=='PAGE_NEEDS_OCR'})
    scans=[{'physical_page':p,'stage':scan_stage(doc.sha256,p)} for p in pages]
    decision_path=asset_path(f'history/scope-review-decisions/{doc.sha256}.json');decisions={}
    if decision_path.is_file():
        decision=json.loads(decision_path.read_text(encoding='utf-8'));assert decision['source_sha256']==doc.sha256
        decisions={x['source_key']:x for x in decision['records']}
    site_rows=[{'source_key':f.source_key,'stage':decisions.get(f.source_key,{}).get('stage','unreviewed_scope_gap'),
                'reason':decisions.get(f.source_key,{}).get('reason'),'actionable':decisions.get(f.source_key,{}).get('actionable',True)} for f in missing]
    dispositions=record_dispositions(doc.sha256)
    for row in site_rows:
        if row['source_key'] in dispositions:
            row.update(stage='non_problem_section_heading',actionable=False,reason=dispositions[row['source_key']]['reason'])
    printed_review=[];document_scope=None
    if (run.context or {}).get('external_supplement_sha256'):
        from .external_supplement import supplement_path,sha
        p=supplement_path(doc.sha256)
        if p.is_file() and sha(p)==run.context['external_supplement_sha256']:
            accepted=json.loads(p.read_text(encoding='utf-8'))
            document_scope=accepted.get('scope_exclusion')
            printed_review=[{k:x[k] for k in ('physical_page','text_review','business_status','reason') if k in x}
                            for x in accepted.get('page_acceptances',[]) if x.get('acceptance_scope')=='printed_text_only']
    return {'import_id':run.id,'scan_pages':scans,'scan_counts':dict(collections.Counter(x['stage'] for x in scans)),
       'document_scope_review':document_scope,
       'printed_text_review':printed_review,'business_pending_pages':[p for p in printed_review if p.get('business_status')=='unresolved'],
       'site_scope':{'missing_findings':len(missing),'registered_issues':len(flagged),
                     'missing_alert_findings':[f.id for f in missing if f.id not in flagged],
                     'stage_counts':dict(collections.Counter(x['stage'] for x in site_rows)),
                     'actionable_missing_findings':sum(x['actionable'] for x in site_rows),'records':site_rows},
       'content_review':identity_review(doc.sha256),'ocr_is_semantic_acceptance':False}
