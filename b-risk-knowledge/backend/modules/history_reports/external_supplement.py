"""Centrally accepted external review data, bound to original report assets.

No submitted ZIP is consumed here. The coordinator validates and normalizes a
frozen acceptance file before placing it in managed storage. Cross-report
evidence retains the actual source document, rather than borrowing a page ID.
"""
import copy, hashlib, json, re, zipfile
from xml.etree import ElementTree as ET
from ...storage import asset_path
from ..report_parsing.fields import FIELDS
from ..report_parsing.parser import W, text_of

def supplement_path(sha):
    assert re.fullmatch('[0-9a-f]{64}',sha)
    return asset_path(f'history/external-reviews/{sha}.json')

def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def norm(s):return re.sub(r'\s+','',s)

def readback_quote(path,loc):
    with zipfile.ZipFile(path) as z:body=ET.fromstring(z.read('word/document.xml')).find(W+'body')
    if loc['kind']=='docx_paragraph':return text_of(body.findall(W+'p')[loc['paragraph']-1])
    table=list(body.iter(W+'tbl'))[loc['table']-1]
    return text_of(table.findall(W+'tr')[loc['row']-1].findall(W+'tc')[loc['cell']-1])

def validate_data(data,item):
    assert data['schema_version']==1 and data['source_sha256']==item['sha256']
    assert data['review_method']=='central_original_readback' and data['user_confirmation'] is False
    assert data['acceptance']['decision_sha256'] and (data['acceptance'].get('archive_sha256') or data['acceptance'].get('input_sha256'))
    sources=data['sources'];checked=set();known=set()
    assert item['sha256'] in {s['sha256'] for s in sources.values()}
    def source(did):
        s=sources[did];p=asset_path(s['storage_key'])
        if did not in checked:assert sha(p)==s['sha256'],'Evidence original changed';checked.add(did)
        return s,p
    additions=data.get('field_additions',[])
    addition_keys=set()
    for a in additions:
        assert a['source_key'] not in addition_keys;addition_keys.add(a['source_key'])
        assert a['values'] and set(a['values'])<=set(FIELDS)-{'source_category','hazard_category'}
        assert a['expected_fields']=={k:None for k in a['values']},'Only previously empty fields may be supplemented'
        assert all(isinstance(v,str) and v.strip() for v in a['values'].values())
        assert a['reason'] and a['central_decision']=='accepted'
    for r in data['records']:
        assert r['key'] not in known;known.add(r['key'])
        assert set(r['values'])==set(FIELDS) and r['values']['problem_description']
        assert r['values']['hazard_category'] is None
        assert r['locator']['physical_page'] in data['reviewed_pages']
        assert r['external_record_id'] and r['central_decision']=='accepted'
    # Both complete rows and sparse additions require full original-evidence coverage.
    for r in data['records']+additions:
        coverage={}
        for e in r['evidence']:
            field=e['field_key'];assert field in FIELDS
            d=e['details'];s,p=source(d['source_document_id'])
            assert d['source_sha256']==s['sha256'] and d['user_confirmation'] is False
            assert d['external_package_id']==data['acceptance']['package_id']
            v=r['values'][field];a,b=d['value_span'];assert isinstance(v,str)
            segment=d['value_segment'];assert v[a:b]==segment and 0<=a<b<=len(v)
            assert norm(segment) in norm(e['quote'])
            assert e['value']==e['quote'][slice(*d['span'])]
            coverage.setdefault(field,set()).update(range(a,b))
            if e['source_kind']=='report':
                assert sha(asset_path(d['preview_storage_key']))==d['preview_sha256']
                loc=e['locator'];assert loc['document_id']==d['source_document_id']
                if p.suffix.lower()=='.docx':
                    assert loc['part']=='word/document.xml'
                    assert norm(e['quote']) in norm(readback_quote(p,loc)),'Quote absent from original DOCX location'
                else:
                    assert p.suffix.lower()=='.pdf'
                    pn=loc['physical_page'];w,h=s['page_dimensions_pt'][str(pn)]
                    x0,y0,x1,y1=loc['bbox'];assert 0<=x0<x1<=w+.1 and 0<=y0<y1<=h+.1
                    assert loc['units']=='pt' and loc['origin']=='top_left'
            elif e['source_kind']=='directory':
                assert field=='project_name' and e['quote'] in s['origin_relative_paths']
            elif e['source_kind']=='filename':
                assert field=='inspection_date' and e['quote']==s['original_name'] and d['date_role_reason']
            else:
                assert e['source_kind']=='file_metadata' and field=='inspection_date'
                assert re.fullmatch(r'20\d{2}年?',v) and e['quote'] in s['original_mtime_iso'] and d['date_role_reason']
            if field=='source_category':assert d.get('scope'),'Category boundary is required'
        for k,v in r['values'].items():
            if v is not None:assert all(i in coverage.get(k,set()) for i,c in enumerate(v) if not c.isspace()),('Uncovered value',k)
    link_keys=set()
    for link in data.get('evidence_additions',[]):
        assert link['source_key'] not in link_keys;link_keys.add(link['source_key'])
        assert link['action']=='attach_additional_original_source' and link['central_decision']=='accepted'
        assert set(link['expected_fields'])=={'problem_description'} and link['expected_fields']['problem_description']
        assert link['evidence'] and link['reason']
        for e in link['evidence']:
            assert e['field_key']=='problem_description' and e['source_kind']=='report' and e['quote'].strip()
            d=e['details'];s,p=source(d['source_document_id']);loc=e['locator']
            assert loc['document_id']==d['source_document_id'] and d['source_sha256']==s['sha256'] and d['user_confirmation'] is False
            assert d['external_package_id']==data['acceptance']['package_id']
            assert sha(asset_path(d['preview_storage_key']))==d['preview_sha256']
            assert e['value']==e['quote'][slice(*d['span'])]
            if p.suffix.lower()=='.docx':assert norm(e['quote']) in norm(readback_quote(p,loc))
            else:
                assert p.suffix.lower()=='.pdf';w,h=s['page_dimensions_pt'][str(loc['physical_page'])]
                x0,y0,x1,y1=loc['bbox'];assert 0<=x0<x1<=w+.1 and 0<=y0<y1<=h+.1
                assert loc['units']=='pt' and loc['origin']=='top_left'
    assert set(data['fully_reviewed_pages'])<=set(data['reviewed_pages'])
    for p in data['page_acceptances']:
        assert p['physical_page'] in data['reviewed_pages'] and p['central_decision']=='accepted'
        assert sha(asset_path(p['preview_storage_key']))==p['preview_sha256']
    assert set(data['fully_reviewed_pages'])<={p['physical_page'] for p in data['page_acceptances']}
    scope=data.get('scope_exclusion')
    if scope:
        # User-confirmed document scope is not a claim of page-by-page OCR review.
        assert scope['decision']=='exclude_from_hazard_review'
        assert scope['decision_source']=='current_user_confirmation' and scope['user_confirmation'] is True
        assert scope['document_kind'] in ('contract','agreement') and scope['user_statement'].strip()
        assert scope['source_sha256']==item['sha256']
        assert not data['records'] and not additions and not data.get('evidence_additions') and not data['fully_reviewed_pages'] and not data['page_acceptances']
        from pypdf import PdfReader
        s,p=source(scope['document_id']);assert s['sha256']==item['sha256'] and p.suffix.lower()=='.pdf'
        assert scope['pages']==list(range(1,len(PdfReader(p).pages)+1)),'Exclusion must bind the complete identified document'

def augment(result,path,item,context):
    target=supplement_path(item['sha256'])
    if not target.exists():
        assert not context.get('external_supplement_sha256'),'Accepted external review missing'
        return result
    assert sha(target)==context.get('external_supplement_sha256')
    data=json.loads(target.read_text(encoding='utf-8'));validate_data(data,item)
    known={r['key'] for r in result['records']}
    for spec in data['records']:
        assert spec['key'] not in known,'Accepted external record conflicts with existing original position'
        r=copy.deepcopy(spec);r['review_state']='ai_external_checked'
        result['records'].append(r);known.add(r['key'])
    indexed={r['key']:r for r in result['records']}
    for spec in data.get('field_additions',[]):
        assert spec['source_key'] in indexed,'Supplement target no longer exists'
        r=indexed[spec['source_key']]
        for k,v in spec['values'].items():
            assert r['values'].get(k) is None,'Supplement would overwrite an existing value'
            r['values'][k]=v
        r['evidence'].extend(copy.deepcopy(spec['evidence']))
    for spec in data.get('evidence_additions',[]):
        assert spec['source_key'] in indexed,'Additional original-source target missing'
        r=indexed[spec['source_key']]
        assert all(r['values'].get(k)==v for k,v in spec['expected_fields'].items()),'Additional-source target changed'
        r['evidence'].extend(copy.deepcopy(e) for e in spec['evidence'] if e not in r['evidence'])
    scope=data.get('scope_exclusion')
    if scope:assert not result['records'],'Cannot exclude a document containing parsed findings'
    closed=set(data['fully_reviewed_pages'])|set(scope['pages'] if scope else [])
    result['issues']=[i for i in result['issues'] if not(i['code']=='PAGE_NEEDS_OCR' and i.get('locator',{}).get('physical_page') in closed) and not(i['code']=='NO_ELIGIBLE_PROBLEM_ROWS' and result['records'])]
    result['issues'].extend(copy.deepcopy(data.get('review_issues',[])))
    if scope:
        result['issues']=[i for i in result['issues'] if i['code']!='NO_ELIGIBLE_PROBLEM_ROWS']
        result['issues'].append(dict(kind='scope_exclusion',code='NON_INSPECTION_DOCUMENT',reason=scope['user_statement'],locator={'document_id':scope['document_id']},details=copy.deepcopy(scope)))
    result['counts']['findings']=len(result['records']);result['counts']['issues']=len(result['issues'])
    result['status']='partial' if result['issues'] else 'extracted'
    return result

def validate_prepared(result,path,item,context):
    if not context.get('external_supplement_sha256'):return
    from .engine import hash_json,parse_original
    assert hash_json(result)==hash_json(parse_original(path,item,context)),'Prepared parse does not match accepted external review'
