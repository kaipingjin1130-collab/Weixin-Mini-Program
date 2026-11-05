"""Source-specific additions from reviewed original DOCX text, never database values."""
import copy, hashlib, json, re, zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
from ...storage import asset_path
from ..report_parsing.parser import W, text_of
from ..report_parsing.fields import FIELDS

def supplement_path(sha):
    assert re.fullmatch('[0-9a-f]{64}',sha)
    return asset_path(f'history/native-transcriptions/{sha}.json')

def original_quote(body,loc):
    if loc['kind']=='docx_paragraph':
        index=loc['body_paragraph'];assert type(index) is int and index>0
        return text_of(body.findall(W+'p')[index-1])
    assert loc['kind']=='docx_cell' and loc['part']=='word/document.xml'
    assert all(type(loc[k]) is int and loc[k]>0 for k in ('table','row','cell'))
    table=list(body.iter(W+'tbl'))[loc['table']-1]
    return text_of(table.findall(W+'tr')[loc['row']-1].findall(W+'tc')[loc['cell']-1])

def augment(result,path,item,context):
    from .engine import hash_json
    source=supplement_path(item['sha256'])
    if not source.exists():
        assert not context.get('native_supplement_sha256'),'Reviewed native source supplement is missing'
        return result
    raw=source.read_bytes();assert hashlib.sha256(raw).hexdigest()==context.get('native_supplement_sha256')
    data=json.loads(raw.decode('utf-8'));assert data['source_sha256']==item['sha256']
    assert data['review_method']=='assistant_original_native_readback' and data['schema_version']==1
    path=Path(path);assert path.suffix.lower()=='.docx' and hashlib.sha256(path.read_bytes()).hexdigest()==item['sha256']
    with zipfile.ZipFile(path) as z:body=ET.fromstring(z.read('word/document.xml')).find(W+'body')
    known={r['key'] for r in result['records']};staged=[]
    norm=lambda s:re.sub(r'[\s。；;]+','',s or '')
    identity=lambda v:tuple(norm(v.get(k)) for k in ('problem_description','engineering_project_name','inspection_date','inspection_location'))
    descriptions={identity(r['values']) for r in result['records']}
    for spec in data['records']:
        r=copy.deepcopy(spec);values=r['values'];evidence=r['evidence']
        assert set(values)<=set(FIELDS) and values.get('problem_description') and values.get('engineering_project_name')
        assert values.get('hazard_category') is None and 'project_name' not in values
        assert r['key']==hash_json(r['locator']) and r['key'] not in known
        assert r['locator']['kind']=='reviewed_native_problem'
        assert identity(values) not in descriptions,'Same description and scope require source association review, not another raw row'
        for e in evidence:
            assert e['field_key'] in FIELDS and e['source_kind']=='report' and e['method']=='reviewed_native_transcription'
            assert e['details']['source_sha256']==item['sha256'] and e['details']['review_method']==data['review_method']
            assert e['details'].get('reason') and e['details'].get('user_confirmation') is False
            quote=original_quote(body,e['locator']);span=e['details']['span']
            assert quote==e['quote'] and len(span)==2 and all(type(i) is int for i in span)
            assert 0<=span[0]<span[1]<=len(quote) and quote[span[0]:span[1]]==e['value']
        for k,v in values.items():
            if v is not None:assert any(e['field_key']==k and e['value']==v for e in evidence)
        problem=[e for e in evidence if e['field_key']=='problem_description' and e['value']==values['problem_description']]
        assert len(problem)==1
        assert r['locator']['source_locator']==problem[0]['locator'] and r['locator']['span']==problem[0]['details']['span']
        parent=context.get('parent')
        if parent:values['project_name']=parent['value'];evidence.append({**parent,'field_key':'project_name'})
        values['hazard_category']=None;r['review_state']='ai_native_checked';staged.append(r)
        known.add(r['key']);descriptions.add(identity(values))
    result['records'].extend(staged)
    if staged:result['issues']=[i for i in result['issues'] if i['code']!='NO_ELIGIBLE_PROBLEM_ROWS']
    result['counts']['findings']=len(result['records']);result['counts']['issues']=len(result['issues'])
    result['status']='partial' if result['issues'] else 'extracted'
    return result

def validate_prepared(result,path,item,context):
    """A cached prepared result cannot claim a newer supplement configuration."""
    if not context.get('native_supplement_sha256'):return
    from .engine import hash_json,parse_original
    expected=parse_original(path,item,context)
    assert hash_json(result)==hash_json(expected),'Prepared parse does not match the current reviewed native supplement'
