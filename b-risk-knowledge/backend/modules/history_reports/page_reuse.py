"""Explicit, source-verified checklist-page reuse, separate from visual transcription."""
import hashlib,json
from pathlib import Path
from ...storage import asset_path
from .visual_supplement import supplement_path

def review_path(sha):
    assert len(sha)==64 and all(c in '0123456789abcdef' for c in sha)
    return asset_path(f'history/page-review-reuse/{sha}.json')

def context_hash(sha):
    p=review_path(sha)
    if not p.exists():return None
    data=json.loads(p.read_text(encoding='utf-8'));assert data['source_sha256']==sha
    dependencies={}
    for r in data['pages']:
        ref=r['representative']['source_sha256'];path=supplement_path(ref)
        dependencies[ref]=hashlib.sha256(path.read_bytes()).hexdigest()
    return hashlib.sha256(json.dumps({'proof_sha':hashlib.sha256(p.read_bytes()).hexdigest(),'dependencies':dependencies},sort_keys=True).encode()).hexdigest()

def apply(result,item,context):
    p=review_path(item['sha256'])
    if not p.exists():return result
    assert context_hash(item['sha256'])==context.get('page_review_reuse_sha256')
    data=json.loads(p.read_text(encoding='utf-8'));closed=set()
    for r in data['pages']:
        assert r['review_method']=='rule_reuse' and r['page_role']=='checklist_criteria' and r['add_records'] is False
        a=r['representative'];b=r['duplicate'];assert b['source_sha256']==item['sha256']
        assert a['render_pixels_sha256']==b['render_pixels_sha256']==r['pixel_identity_evidence']['render_pixels_sha256']
        actual=json.loads(supplement_path(a['source_sha256']).read_text(encoding='utf-8'))
        assert a['physical_page'] in actual['fully_reviewed_pages']
        scope=r['source_scope'];ev=scope['evidence']
        for field,value in [('engineering_project_name',scope['project_name']),('inspection_date',scope['inspection_date']),('listed_problem_count',str(scope['listed_problem_count']))]:
            for sha in (a['source_sha256'],b['source_sha256']):
                assert any(e['source_sha256']==sha and e['field_key']==field and e['value']==value for e in ev)
        closed.add(b['physical_page'])
    result['issues']=[i for i in result['issues'] if not (i['code']=='PAGE_NEEDS_OCR' and i['locator'].get('physical_page') in closed)]
    result['counts']['issues']=len(result['issues']);result['counts']['rule_reused_checklist_pages']=len(closed)
    result['status']='partial' if result['issues'] else 'extracted'
    return result
