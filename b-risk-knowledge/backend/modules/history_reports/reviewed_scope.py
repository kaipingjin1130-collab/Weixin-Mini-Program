"""Report-specific, source-checked section/site mappings; fill empty values only."""
import hashlib,json,zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
from ...storage import asset_path
from ..report_parsing.parser import W,text_of
A='{http://schemas.openxmlformats.org/drawingml/2006/main}'
P='{http://schemas.openxmlformats.org/presentationml/2006/main}'

def review_path(sha):
    assert len(sha)==64 and all(c in '0123456789abcdef' for c in sha)
    return asset_path(f'history/reviewed-scopes/{sha}.json')

def converted_source(path,item,context):
    source=review_path(item['sha256'])
    if not source.is_file():return None
    raw=source.read_bytes();assert hashlib.sha256(raw).hexdigest()==context.get('reviewed_scope_sha256')
    data=json.loads(raw.decode('utf-8'))
    if not data.get('converted_storage_key'):return None
    assert data['source_sha256']==item['sha256']==hashlib.sha256(path.read_bytes()).hexdigest()
    assert data['converted_storage_key'].startswith('history/conversions/'+item['sha256']+'/')
    converted=asset_path(data['converted_storage_key'])
    assert hashlib.sha256(converted.read_bytes()).hexdigest()==data['converted_sha256']
    return converted

def validate_pdf_scope(spec,path):
    """A cross-page scope requires explicit reviewed boundaries and page proofs."""
    loc=spec['locator'];proof=spec['scope_evidence']
    assert spec['method'] in ('pdf_visual_page_scope','pdf_visual_document_scope')
    assert spec['review_method']=='assistant_visual_readback'
    preview=Path(spec['preview_path'])
    assert hashlib.sha256(preview.read_bytes()).hexdigest()==spec['preview_sha256']
    assert loc['physical_page'] in spec['reviewed_pages']
    assert loc['units']=='pt' and loc['origin']=='top_left' and len(loc['bbox'])==4
    assert 0<=loc['bbox'][0]<loc['bbox'][2] and 0<=loc['bbox'][1]<loc['bbox'][3]
    targets={r['locator']['physical_page'] for r in spec['record_refs']}
    if spec['method']=='pdf_visual_page_scope':
        assert targets=={loc['physical_page']}
        return
    assert proof['scope_kind']=='cross_page_explicit_project_continuation'
    assert proof['all_native_pages_reviewed'] is True
    assert isinstance(proof['boundary_reason'],str) and proof['boundary_reason'].strip()
    assert isinstance(proof['counterexample_check'],str) and proof['counterexample_check'].strip()
    assert proof['evidence_page']==loc['physical_page']
    assert targets==set(proof['target_pages']) and targets
    from pypdf import PdfReader
    with path.open('rb') as source:
        pages=len(PdfReader(source).pages)
        assert proof['document_pages']==pages
        assert all(type(p) is int and 1<=p<=pages for p in targets|{loc['physical_page']})
    # Read every intervening page to rule out a change of worksite or new section.
    covered=set(range(min(targets|{loc['physical_page']}),max(targets|{loc['physical_page']})+1))
    assert covered.issubset(set(proof['visual_reviewed_pages']))
    assert covered.issubset(set(spec['reviewed_pages']))
    previews={p['physical_page']:p for p in spec['page_previews']}
    assert covered.issubset(previews)
    for page in covered:
        p=previews[page]
        assert hashlib.sha256(Path(p['path']).read_bytes()).hexdigest()==p['sha256']

def augment(result,path,item,context):
    source=review_path(item['sha256'])
    if not source.is_file():return result
    raw=source.read_bytes();assert hashlib.sha256(raw).hexdigest()==context.get('reviewed_scope_sha256')
    data=json.loads(raw.decode('utf-8'));assert data['source_sha256']==item['sha256']
    assert hashlib.sha256(path.read_bytes()).hexdigest()==item['sha256']
    records={r['key']:r for r in result['records']};fixed=set();body=None;slides={}
    if path.suffix.lower()=='.docx':
        with zipfile.ZipFile(path) as z:body=ET.fromstring(z.read('word/document.xml')).find(W+'body')
    elif path.suffix.lower() in ('.doc','.wps'):
        converted=converted_source(path,item,context);assert converted is not None
        with zipfile.ZipFile(converted) as z:body=ET.fromstring(z.read('word/document.xml')).find(W+'body')
    for spec in data['specs']:
        assert spec['field_key']=='engineering_project_name'
        loc=spec['locator'];kind=loc['kind'];proof=spec['scope_evidence']
        if kind=='docx_paragraph':
            assert body is not None;quote=text_of(body.findall(W+'p')[loc['body_paragraph']-1])
        elif kind=='docx_cell':
            assert body is not None
            table=list(body.iter(W+'tbl'))[loc['table']-1]
            quote=text_of(table.findall(W+'tr')[loc['row']-1].findall(W+'tc')[loc['cell']-1])
        elif kind=='pptx_shape':
            assert path.suffix.lower()=='.pptx'
            part=f"ppt/slides/slide{loc['slide']}.xml"
            if part not in slides:
                with zipfile.ZipFile(path) as z:slides[part]=ET.fromstring(z.read(part))
            shape=slides[part].findall('.//'+P+'sp')[loc['shape']-1]
            quote=''.join(t.text or '' for t in shape.iter(A+'t'))
            assert proof['method']=='same_slide_explicit_project_heading'
        elif kind=='pdf_region':
            assert path.suffix.lower()=='.pdf'
            validate_pdf_scope(spec,path)
            quote=spec['quote']
        else:raise AssertionError('Unsupported original scope locator')
        span=spec['span'];assert quote==spec['quote'] and quote[span[0]:span[1]]==spec['value'] and spec['value'].strip()
        assert proof.get('reason') and spec['record_refs']
        for ref in spec['record_refs']:
            r=records[ref['source_key']];assert r['locator']==ref['locator']
            if kind=='pptx_shape':assert r['locator']['slide']==loc['slide']
            elif kind=='pdf_region':
                if spec['method']=='pdf_visual_page_scope':assert r['locator']['physical_page']==loc['physical_page']
                else:assert r['locator']['physical_page'] in proof['target_pages']
            else:
                assert r['locator']['part']=='word/document.xml'
                assert r['locator']['table'] in proof['allowed_tables']
                ranges=proof.get('row_ranges',{}).get(str(r['locator']['table']))
                if ranges:assert any(start<=r['locator']['row']<=end for start,end in ranges)
            old=r['values'].get('engineering_project_name')
            if old is not None:
                assert old==spec['value'],'Reviewed scope cannot replace existing facts'
                continue
            r['values']['engineering_project_name']=spec['value']
            r['evidence'].append({'field_key':'engineering_project_name','value':spec['value'],'quote':quote,
              'source_label':spec['source_label'],'locator':loc,'source_kind':'report','method':spec.get('method','reviewed_original_section_scope'),
              'details':{'span':span,'source_sha256':item['sha256'],'scope_evidence':proof,
                 'review_method':spec.get('review_method','assistant_original_xml_readback'),'user_confirmation':False}})
            fixed.add(r['key'])
    result['issues']=[i for i in result['issues'] if not (i['code']=='SITE_SCOPE_UNRESOLVED' and i.get('record_key') in fixed)]
    return result

def reconcile_site_issues(result):
    """Visual additions must obey the same missing-site checks as native rows."""
    missing={r['key']:r for r in result['records'] if r['values'].get('engineering_project_name') is None}
    result['issues']=[i for i in result['issues'] if i['code']!='SITE_SCOPE_UNRESOLVED' or i.get('record_key') in missing]
    flagged={i.get('record_key') for i in result['issues'] if i['code']=='SITE_SCOPE_UNRESOLVED'}
    for key,r in missing.items():
        if key not in flagged:result['issues'].append({'code':'SITE_SCOPE_UNRESOLVED','kind':'semantic',
          'reason':'本条问题尚无明确工程项目的原文范围证据；不从上级目录或文件名推断工地。',
          'record_key':key,'target_field':'engineering_project_name','locator':r['locator']})
    result['counts']['issues']=len(result['issues'])
    if result['status']!='source_review':result['status']='partial' if result['issues'] else 'extracted'
    return result
