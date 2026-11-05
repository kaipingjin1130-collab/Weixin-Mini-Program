"""Explicit current-run visual transcriptions. Raw OCR alone never becomes a fact."""
import hashlib,json,re,datetime
from pathlib import Path
from ...storage import asset_path

def supplement_path(sha):
    if len(sha)!=64 or any(c not in '0123456789abcdef' for c in sha):raise ValueError('Invalid source hash')
    return asset_path(f'history/visual-transcriptions/{sha}.json')

def validate_filename_date(e,item,record_key=None):
    """Only an explicitly reviewed inspection date, grounded in this source name."""
    assert e['source_kind']=='filename' and e['field_key']=='inspection_date'
    assert e['method']=='reviewed_filename_date'
    name=item.get('original_name');assert name and e['quote']==name
    assert e['locator']=={'kind':'original_filename','filename':name}
    d=e.get('details',{});span=d.get('span')
    assert isinstance(span,list) and len(span)==2 and all(type(x) is int for x in span)
    assert 0<=span[0]<span[1]<=len(name) and name[span[0]:span[1]]==e['value']
    assert not (span[0] and name[span[0]-1].isdigit())
    assert span[1]==len(name) or not name[span[1]].isdigit()
    assert d.get('role')=='inspection_date' and d.get('role_reviewed') is True and d.get('role_reason')
    # Replies/rechecks/exports need separate report evidence; a filename alone
    # must not turn their dates into the original inspection date.
    requires_report_role=bool(re.search(r'整改回复|回复单|复查|复验|导出|上传|打印',name))
    value=e['value']
    if d.get('precision')=='year':
        assert re.fullmatch(r'(?:19|20)\d{2}',value)
    else:
        assert d.get('precision')=='day'
        m=re.fullmatch(r'((?:19|20)\d{2})(\d{2})(\d{2})',value)
        if not m:m=re.fullmatch(r'((?:19|20)\d{2})[.年/-](\d{1,2})[.月/-](\d{1,2})日?',value)
        assert m,'Unrecognized filename date'
        parsed=datetime.date(*(int(v) for v in m.groups()))
    if requires_report_role:
        # A reply's name alone stays forbidden. A source-verified printed reference
        # may explicitly identify the original inspection, for these reviewed rows only.
        assert not re.search(r'复查|复验|导出|上传|打印',name) and d.get('precision')=='day'
        proof=d.get('report_role_evidence',{})
        assert proof.get('source_kind')=='report' and proof.get('source_sha256')==item['sha256']
        assert proof.get('review_method')=='assistant_visual_readback'
        assert proof.get('semantic_role')=='explicit_original_inspection_reference'
        assert type(proof.get('physical_page')) is int and proof['physical_page']>0
        assert record_key and record_key in proof.get('source_keys',[])
        quote=re.sub(r'\s+','',proof.get('quote',''))
        anchor=re.search(r'接到(\d{1,2})月(\d{1,2})日检查整改单后',quote)
        assert anchor and (int(anchor[1]),int(anchor[2]))==(parsed.month,parsed.day)
        preview=Path(proof['preview_path'])
        assert preview.suffix.lower()=='.png' and preview.is_file()
        assert hashlib.sha256(preview.read_bytes()).hexdigest()==proof.get('preview_sha256')

def augment(result,item,context):
    path=supplement_path(item['sha256'])
    if not path.is_file():return result
    raw=path.read_bytes();data=json.loads(raw.decode('utf-8'))
    assert hashlib.sha256(raw).hexdigest()==context.get('visual_supplement_sha256')
    assert data['source_sha256']==item['sha256'] and data['review_method']=='assistant_visual_readback'
    fully=set(data.get('fully_reviewed_pages',data['reviewed_pages']))
    assert fully<=set(data['reviewed_pages'])
    known={r['key'] for r in result['records']}
    for r in data['records']:
        assert r['key'] not in known,'Duplicate problem source key'
        for e in r['evidence']:
            if e['source_kind']=='filename':
                validate_filename_date(e,item,r['key'])
                assert r['values'].get('inspection_date')==e['value']
                assert not any(x['field_key']=='inspection_date' and x['source_kind']=='report' for x in r['evidence']),'Prefer report date evidence'
            else:
                assert e['source_kind']=='report' and e['method']=='visual_transcription' and e['locator'].get('physical_page') in data['reviewed_pages']
        parent=context.get('parent')
        if parent:
            r['values']['project_name']=parent['value'];r['evidence'].append({**parent,'field_key':'project_name'})
        r['values']['hazard_category']=None;r['review_state']='ai_visual_checked';result['records'].append(r);known.add(r['key'])
    result['issues']=[i for i in result['issues'] if not (i['code']=='PAGE_NEEDS_OCR' and i.get('locator',{}).get('physical_page') in fully) and not (i['code']=='NO_ELIGIBLE_PROBLEM_ROWS' and result['records'])]
    # Partly readable pages retain OCR alerts; source ambiguities stay visible.
    for issue in data.get('review_issues',[]):
        assert issue.get('locator',{}).get('physical_page') in data['reviewed_pages']
        code={'HANDWRITING_UNCLEAR':'HANDWRITING_UNRESOLVED','SOURCE_DATE_CONFLICT':'SOURCE_DATE_CONTRADICTION'}.get(issue['code'],issue['code'])
        if code=='PAGE_NEEDS_OCR':
            page=issue['locator']['physical_page'];assert page not in fully
            existing=next((i for i in result['issues'] if i['code']==code and i.get('locator',{}).get('physical_page')==page),None)
            if existing is not None:
                existing['reason']+='；原图核验：'+issue['reason']
                continue
        result['issues'].append({'kind':issue.get('kind',issue.get('issue_type','semantic')),
          'code':code,'reason':issue['reason'],'locator':issue['locator'],
          'quote':issue.get('quote',issue.get('excerpt')),'source_label':issue.get('source_label'),
          'target_field':issue.get('target_field',issue.get('field_key'))})
    result['counts']['findings']=len(result['records']);result['counts']['issues']=len(result['issues'])
    result['status']='partial' if result['issues'] else 'extracted'
    return result
