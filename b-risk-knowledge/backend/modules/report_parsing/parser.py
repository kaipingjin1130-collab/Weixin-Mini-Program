"""Original-only evidence extraction. No legacy data dependency, no inferred facts.

Every field candidate references an exact evidence unit. Unclassified text remains
searchable evidence; a successful text extraction is not a claim of semantic completeness.
"""
import collections,datetime,hashlib,json,re,zipfile
from pathlib import Path
import xml.etree.ElementTree as ET
from .fields import FIELDS,VERSION,resolve_label,label_key,AMBIGUOUS

PARSER_VERSION='original-evidence-20261102-v2'
W='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
A='{http://schemas.openxmlformats.org/drawingml/2006/main}'
REL='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
NS={'w':W[1:-1]}
DESCRIPTION_KEYS={'problem_description','finding_and_action','reported_response','reinspection_conclusion','inspection_observation'}
NO_ISSUE=re.compile(r'^(无|无问题|未发现问题|未发现隐患|符合要求|合格|正常)[。；;\s]*$')

def text_of(element):
    parts=[]
    for n in element.iter():
        if n.tag in (W+'t',A+'t'):parts.append(n.text or '')
        elif n.tag in (W+'br',W+'cr'):parts.append('\n')
        elif n.tag==W+'tab':parts.append('\t')
    return ''.join(parts)

def normalize_date(raw):
    # Full, singular dates only. Ranges/partial/ambiguous dates remain raw.
    s=raw.strip();m=re.fullmatch(r'(20\d{2})\s*[年./-]\s*(\d{1,2})\s*[月./-]\s*(\d{1,2})\s*日?',s)
    if m:
        try:return {'value':datetime.date(*map(int,m.groups())).isoformat(),'precision':'day'}
        except ValueError:pass
    return {'value':None,'precision':'unresolved','raw':raw}

class Extraction:
    def __init__(self,item):
        self.item=item;self.units=[];self.records=[];self.issues=[];self.metadata=[];self.pages=[];self.images=[]
        self.unknown=collections.Counter();self._unit_ids=set()
    def unit(self,key,text,locator,kind='cell',method='native'):
        if key in self._unit_ids:raise ValueError('Duplicate evidence locator '+key)
        self._unit_ids.add(key)
        u={'key':key,'text':text,'locator':locator,'kind':kind,'method':method}
        self.units.append(u);return u
    def field(self,key,label,u,header=None,scope='direct'):
        s=u['text'];f={'field_key':key,'source_label':label,'raw_text':s,'value_state':'extracted' if s.strip() else 'source_blank',
                     'evidence_keys':[u['key']],'header_evidence_keys':[header['key']] if header else [],'method':u['method'],'scope':scope}
        if key.endswith('_date') and s.strip():f['normalized_value']=normalize_date(s)
        return f
    def tables(self,rows,locator):
        headers={};header_width=0;local_meta=[]
        for row in rows:
            cells=row['cells'];unique=list({c['key']:c for c in cells}.values());nonempty=[c for c in unique if c['text'].strip()]
            keys=[resolve_label(c['text']) for c in unique];recognized=[k for k in keys if k]
            # Label-value forms are not column headers. Their values stay directly cited.
            if len(unique)==2 and keys[0] and not keys[1] and len(unique[0]['text'])<40:
                f=self.field(keys[0],unique[0]['text'],unique[1],unique[0]);local_meta.append(f)
                if keys[0] in DESCRIPTION_KEYS:
                    self.add_record([f],row['locator'],local_meta[:-1])
                else:self.metadata.append(f)
                continue
            if len(recognized)>=2 and any(k in DESCRIPTION_KEYS|{'inspection_criterion','project_name'} for k in recognized) and len(recognized)>=max(2,len(nonempty)*0.45):
                headers={i:(resolve_label(c['text']),c) for i,c in enumerate(cells) if resolve_label(c['text'])}
                header_width=len(cells)
                for c in unique:
                    if c['text'].strip() and not resolve_label(c['text']):self.unknown[c['text']]+=1
                continue
            if not headers:continue
            if len(cells)!=header_width or len(unique)==1:
                # Single merged section headings and irregular rows are never auto-filled as hazards.
                continue
            fields=[];seen=set()
            for i,(key,h) in headers.items():
                c=cells[i]
                if (key,c['key']) in seen:continue
                seen.add((key,c['key']));fields.append(self.field(key,h['text'],c,h))
            if any(f['field_key'] in DESCRIPTION_KEYS and f['raw_text'].strip() for f in fields):
                self.add_record(fields,row['locator'],local_meta)
        return local_meta
    def add_record(self,fields,locator,context=()):
        present={f['field_key'] for f in fields};meta={}
        for f in context:
            if f['field_key'] in ('project_name','inspection_date'):meta.setdefault(f['field_key'],[]).append(f)
        for key,fs in meta.items():
            vals={f['raw_text'].strip() for f in fs if f['raw_text'].strip()}
            if key not in present and len(vals)==1:fields.append({**fs[-1],'scope':'explicit_table_metadata'})
        fs={f['field_key']:f['raw_text'] for f in fields}
        desc=fs.get('problem_description','')
        kind='problem' if desc else 'mixed_finding_action' if fs.get('finding_and_action') else 'response' if fs.get('reported_response') else 'reinspection' if fs.get('reinspection_conclusion') else 'observation'
        if desc and NO_ISSUE.fullmatch(desc.strip()):kind='no_issue'
        self.records.append({'key':f'r{len(self.records)+1}','kind':kind,'locator':locator,'fields':fields})
    def finish(self):
        # Only an explicitly labelled, unique report-wide project can supply
        # document metadata. Multi-project reports keep row-level gaps.
        meta=collections.defaultdict(list)
        for f in self.metadata:
            if f['raw_text'].strip():meta[f['field_key']].append(f)
        names={f['raw_text'].strip() for f in meta['project_name']}
        names.update(f['raw_text'].strip() for r in self.records for f in r['fields'] if f['field_key']=='project_name' and f['raw_text'].strip())
        if len(names)==1 and meta['project_name']:
            for r in self.records:
                present={f['field_key'] for f in r['fields']}
                for key in ('project_name','inspection_date'):
                    fs=meta[key]
                    if key not in present and len({f['raw_text'] for f in fs})==1:
                        r['fields'].append({**fs[0],'scope':'explicit_unique_report_metadata'})
        # Canonical fields absent from a recognized row have explicit state, never empty-string facts.
        for record in self.records:
            grouped=collections.defaultdict(list)
            for f in record['fields']:grouped[f['field_key']].append(f)
            for key,fs in grouped.items():
                vals={f['raw_text'] for f in fs if f['raw_text'].strip()}
                if len(vals)>1:
                    for f in fs:f['value_state']='conflict'
            for key in FIELDS:
                if key not in grouped:record['fields'].append({'field_key':key,'source_label':None,'raw_text':None,'value_state':'not_observed','evidence_keys':[],'header_evidence_keys':[],'method':'none','scope':'record'})
        if not self.records:self.issues.append({'code':'NO_STRUCTURED_RECORDS','detail':'原文已保留；未识别可靠问题表结构，不等于无隐患。'})
        if self.unknown:self.issues.append({'code':'UNMAPPED_COLUMN_LABELS','labels':dict(self.unknown)})
        failed=[p for p in self.pages if p['status']!='native_text']
        if failed:self.issues.append({'code':'PAGES_REQUIRE_OCR_OR_REVIEW','pages':[p['page'] for p in failed]})
        return {'schema_version':1,'parser_version':PARSER_VERSION,'registry_version':VERSION,'source_sha256':self.item['sha256'],
                'source_format':self.item['suffix'],'status':'partial' if self.issues else 'succeeded',
                'units':self.units,'records':self.records,'metadata':self.metadata,'pages':self.pages,'images':self.images,'issues':self.issues,
                'counts':{'units':len(self.units),'records':len(self.records),'pages':len(self.pages),'images':len(self.images),'issues':len(self.issues)},
                'semantic_review':'pending','facts_source':'original_report'}

def docx(path,item,extraction_class=Extraction):
    out=extraction_class(item)
    with zipfile.ZipFile(path) as z:
        root=ET.fromstring(z.read('word/document.xml'))
        relations={}
        if 'word/_rels/document.xml.rels' in z.namelist():
            relations={r.attrib['Id']:r.attrib.get('Target','') for r in ET.fromstring(z.read('word/_rels/document.xml.rels'))}
        body=root.find(W+'body');table_ids={id(t):n for n,t in enumerate(body.iter(W+'tbl'),1)}
        for n,p in enumerate(body.findall(W+'p'),1):
            out.unit(f'p{n}',text_of(p),{'kind':'docx_paragraph','part':'word/document.xml','body_paragraph':n},'paragraph')
        previous_body_index=None
        for table in body.iter(W+'tbl'):
            ti=table_ids[id(table)];rows=[];merged={}
            for ri,row in enumerate(table.findall(W+'tr'),1):
                cells=[];col=0
                before=row.find('./'+W+'trPr/'+W+'gridBefore')
                if before is not None:col=int(before.attrib.get(W+'val','0'))
                if col:
                    for ci in range(col):
                        u=out.unit(f't{ti}r{ri}g{ci+1}','',{'kind':'docx_cell','part':'word/document.xml','table':ti,'row':ri,'grid_column':ci+1,'omitted':True})
                        cells.append(u)
                for ci,cell in enumerate(row.findall(W+'tc'),1):
                    span=cell.find('./'+W+'tcPr/'+W+'gridSpan');span=int(span.attrib.get(W+'val','1')) if span is not None else 1
                    vm=cell.find('./'+W+'tcPr/'+W+'vMerge');cont=vm is not None and vm.attrib.get(W+'val','continue')=='continue'
                    loc={'kind':'docx_cell','part':'word/document.xml','table':ti,'row':ri,'cell':ci,'grid_column':col+1,'grid_span':span}
                    u=out.unit(f't{ti}r{ri}c{ci}',text_of(cell),loc)
                    use=merged.get(col,u) if cont else u
                    if vm is not None and not cont:merged[col]=u
                    elif vm is None:merged.pop(col,None)
                    cells.extend([use]*span);col+=span
                    for blip in cell.iter(A+'blip'):
                        rid=blip.attrib.get(REL+'embed');target=relations.get(rid)
                        if target:out.images.append({'evidence_key':u['key'],'relation_id':rid,'embedded_part':target,'relation':'same_cell','verified':'native_xml'})
                rows.append({'cells':cells,'locator':{'kind':'docx_row','part':'word/document.xml','table':ti,'row':ri}})
            children=list(body)
            body_index=next((i for i,c in enumerate(children) if c is table),None)
            between=children[previous_body_index+1:body_index] if previous_body_index is not None and body_index is not None else []
            first_row=table.find(W+'tr')
            widths=[]
            if first_row is not None:
                for cell in first_row.findall(W+'tc'):
                    cw=cell.find('./'+W+'tcPr/'+W+'tcW')
                    widths.append(cw.attrib.get(W+'w') if cw is not None else None)
            out.tables(rows,{'table':ti,'native_column_widths':widths,
                'adjacent_without_text':previous_body_index is not None and body_index is not None and not any(text_of(x).strip() for x in between)})
            previous_body_index=body_index
    return out.finish()

def pdf(path,item,extraction_class=Extraction):
    from ..history_reports.pdf_compat import open_pdf_layout
    out=extraction_class(item)
    with open_pdf_layout(path) as doc:
        for pi,page in enumerate(doc.pages,1):
            try:
                txt=page.extract_text() or '';loc={'kind':'pdf_page','physical_page':pi,'bbox':[0,0,page.width,page.height],'units':'pt','origin':'top_left','width':page.width,'height':page.height,'rotation':page.rotation}
                out.unit(f'p{pi}',txt,loc,'page')
                good=len(re.sub(r'\s','',txt))>=20 and txt.count('\ufffd')<max(3,len(txt)*0.03)
                out.pages.append({'page':pi,'status':'native_text' if good else 'ocr_pending','chars':len(txt)})
                if good:
                    for ti,t in enumerate(page.find_tables(),1):
                        rows=[];values=t.extract()
                        for ri,(row,vals) in enumerate(zip(t.rows,values),1):
                            cells=[]
                            for ci,(box,val) in enumerate(zip(row.cells,vals),1):
                                if box is None:box=t.bbox
                                c=out.unit(f'p{pi}t{ti}r{ri}c{ci}',val or '',{**loc,'kind':'pdf_cell','bbox':list(box),'table':ti,'row':ri,'column':ci})
                                cells.append(c)
                            rows.append({'cells':cells,'locator':{**loc,'kind':'pdf_row','table':ti,'row':ri,'bbox':list(row.bbox)}})
                        out.tables(rows,loc)
                page.close()
            except Exception as exc:
                out.pages.append({'page':pi,'status':'page_failed','error':type(exc).__name__})
                out.issues.append({'code':'PDF_PAGE_FAILED','page':pi,'error':type(exc).__name__})
    return out.finish()

def xlsx(path,item):
    import openpyxl
    out=Extraction(item);book=openpyxl.load_workbook(path,read_only=True,data_only=False,keep_links=False)
    # Excel may be an original checklist or a derivative. Inventory cells, but
    # do not turn any spreadsheet into report fact until its source role is verified.
    for sheet in book:
        for row in sheet.iter_rows():
            for cell in row:
                if cell.value is not None:
                    value=cell.value.isoformat() if isinstance(cell.value,(datetime.date,datetime.datetime)) else str(cell.value)
                    out.unit(f's{book.sheetnames.index(sheet.title)+1}{cell.coordinate}',value,{'kind':'xlsx_cell','sheet':sheet.title,'cell':cell.coordinate,'formula':cell.data_type=='f'},'reference_cell')
    book.close();out.issues.append({'code':'SPREADSHEET_SOURCE_ROLE_UNVERIFIED','detail':'只保存原表格证据，不作为报告事实补值；需确认属于原始检查记录后才提取。'})
    return out.finish()

def pptx(path,item):
    out=Extraction(item)
    with zipfile.ZipFile(path) as z:
        names=sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)),key=lambda x:int(re.search(r'(\d+)\.xml',x)[1]))
        for name in names:
            slide=int(re.search(r'(\d+)\.xml',name)[1]);root=ET.fromstring(z.read(name))
            for n,para in enumerate(root.iter(A+'p'),1):
                out.unit(f's{slide}p{n}',text_of(para),{'kind':'pptx_paragraph','part':name,'slide':slide,'paragraph':n},'paragraph')
    out.issues.append({'code':'PRESENTATION_REQUIRES_LAYOUT_REVIEW','detail':'演示报告已保留逐页段落；未将标题、图片说明自动判为独立隐患。'})
    return out.finish()

PARSERS={'.docx':docx,'.pdf':pdf,'.xlsx':xlsx,'.pptx':pptx}

def parse(path,item):return PARSERS[Path(path).suffix.lower()](path,item)
