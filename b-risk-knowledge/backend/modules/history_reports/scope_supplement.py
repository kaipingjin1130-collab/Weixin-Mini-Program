"""Original-XML checked, report-specific scope evidence. Never a filename fill."""
import hashlib,json,zipfile
from xml.etree import ElementTree as ET
from ...storage import asset_path
from ..report_parsing.parser import W,text_of

def supplement_path(sha):
    if len(sha)!=64 or any(c not in '0123456789abcdef' for c in sha):raise ValueError('Invalid source hash')
    return asset_path(f'history/scope-transcriptions/{sha}.json')

def augment(result,path,item,context):
    source=supplement_path(item['sha256'])
    if not source.is_file():return result
    raw=source.read_bytes();data=json.loads(raw.decode('utf-8'))
    assert hashlib.sha256(raw).hexdigest()==context.get('scope_supplement_sha256')
    assert data['source_sha256']==item['sha256'] and data['review_method'] in ('assistant_original_xml_readback','assistant_original_pdf_geometry_readback')
    assert hashlib.sha256(path.read_bytes()).hexdigest()==item['sha256']
    if path.suffix.lower()=='.pdf':return augment_pdf(result,path,item,data)
    with zipfile.ZipFile(path) as z:body=ET.fromstring(z.read('word/document.xml')).find(W+'body')
    paragraphs=body.findall(W+'p');tables=list(body.iter(W+'tbl'));children=list(body)
    records={r['key']:r for r in result['records']};fixed=set()
    for spec in data['tables']:
        assert spec['field_key']=='engineering_project_name'
        loc=spec['locator'];quote=text_of(paragraphs[loc['body_paragraph']-1]);span=spec['span']
        assert quote==spec['quote'] and quote[span[0]:span[1]]==spec['value'] and spec['value'].strip()
        table=tables[spec['table']-1];assert table in children
        prior=[n for n in children[:children.index(table)] if n.tag==W+'p' and text_of(n).strip()]
        assert prior and prior[-1] is paragraphs[loc['body_paragraph']-1]
        for ref in spec['record_refs']:
            r=records[ref['source_key']];assert r['locator']['table']==spec['table'] and r['locator']['part']=='word/document.xml'
            value=r['values'].get('engineering_project_name')
            if value is not None:
                assert value==spec['value'],'Scope supplement cannot overwrite nonempty value'
                continue
            r['values']['engineering_project_name']=spec['value']
            r['evidence'].append({'field_key':'engineering_project_name','value':spec['value'],'quote':quote,
              'locator':loc,'source_label':spec['source_label'],'source_kind':'report','method':'original_xml_table_scope_readback',
              'details':{'span':span,'span_convention':'unicode_zero_based_half_open','source_sha256':item['sha256'],
                'review_method':'assistant_original_xml_readback','user_confirmation':False,'old_confirmation_migrated':False}})
            fixed.add(r['key'])
    result['issues']=[i for i in result['issues'] if not (i['code']=='SITE_SCOPE_UNRESOLVED' and i.get('record_key') in fixed)]
    result['counts']['issues']=len(result['issues']);result['status']='partial' if result['issues'] else 'extracted'
    return result

def augment_pdf(result,path,item,data):
    from .pdf_compat import open_pdf_layout
    records={r['key']:r for r in result['records']};fixed=set();tables={}
    with open_pdf_layout(path) as pdf:
        def get_cell(loc):
            pi,ti=loc['physical_page'],loc['table']
            if pi not in tables:tables[pi]=pdf.pages[pi-1].find_tables()
            table=tables[pi][ti-1];ri,ci=loc['row']-1,loc['column']-1
            box=table.rows[ri].cells[ci];text=table.extract()[ri][ci]
            assert box is not None and all(abs(a-b)<.01 for a,b in zip(box,loc['bbox']))
            return text,box
        for spec in data['records']:
            assert spec['field_key']=='engineering_project_name'
            quote,box=get_cell(spec['locator']);label,_=get_cell(spec['label_locator']);span=spec['span']
            assert quote==spec['quote'] and label==spec['source_label'] and quote[span[0]:span[1]]==spec['value']
            for ref in spec['record_refs']:
                r=records[ref['source_key']];assert r['locator']==ref['locator']
                if spec['method']=='pdf_original_merged_site_cell':
                    proof=spec['scope_evidence'];assert r['locator']['physical_page']==spec['locator']['physical_page'] and r['locator']['table']==spec['locator']['table']
                    desc=[e for e in r['evidence'] if e['field_key']=='problem_description' and e['locator'].get('kind')=='pdf_cell']
                    assert len(desc)==1 and desc[0]['locator']['bbox']==proof['description_cell_bbox']
                    db=proof['description_cell_bbox'];assert box[1]-.75<=db[1] and box[3]+.75>=db[3]
                else:
                    assert spec['method']=='pdf_original_single_receiver_scope'
                    assert spec['scope_evidence']['pages_checked']==len(pdf.pages) and spec['scope_evidence']['unique_explicit_receiver_count']==1
                value=r['values'].get('engineering_project_name')
                if value is not None:
                    assert value==spec['value'],'PDF review cannot overwrite nonempty value'
                    continue
                r['values']['engineering_project_name']=spec['value']
                r['evidence'].append({'field_key':'engineering_project_name','value':spec['value'],'quote':quote,
                  'locator':spec['locator'],'source_label':label,'source_kind':'report','method':spec['method'],
                  'details':{'span':span,'span_convention':'unicode_zero_based_half_open','source_sha256':item['sha256'],
                    'label_locator':spec['label_locator'],'scope_evidence':spec['scope_evidence'],
                    'review_method':'assistant_original_pdf_geometry_readback','user_confirmation':False,'old_confirmation_migrated':False}})
                fixed.add(r['key'])
    result['issues']=[i for i in result['issues'] if not (i['code']=='SITE_SCOPE_UNRESOLVED' and i.get('record_key') in fixed)]
    result['counts']['issues']=len(result['issues']);result['status']='partial' if result['issues'] else 'extracted'
    return result
