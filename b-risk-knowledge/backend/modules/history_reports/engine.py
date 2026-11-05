"""Deterministic original-backed extraction; uncertain values remain unresolved."""
import collections, datetime, hashlib, json, re, zipfile, tempfile, subprocess, shutil
from pathlib import Path, PurePosixPath
from xml.etree import ElementTree as ET
from ..report_parsing.fields import FIELDS, VERSION, resolve_label, label_key
from ..report_parsing import parser as native

PARSER_VERSION = 'history-canonical-20261103-v7'
COMPOUND = {'不符合内容与建议','问题及建议','检查发现的问题及整改要求'}
META = {'engineering_project_name','inspection_date','project_name'}
ALIASES = {'项目名称':'engineering_project_name','项目名':'engineering_project_name','工程项目':'engineering_project_name',
    '类别':'source_category','分类':'source_category','部位':'inspection_location','位置':'inspection_location',
    '隐患星级':'source_grade','问题依据':'basis_or_clause','规范出处':'basis_or_clause',
    '整改描述':'reported_response','现场隐患':'problem_description'}
BASIS = {'规范名称','标准名称','规范编号','标准编号','条款号','条款编号','具体条款'}
AUX = {'序号','序','照片','隐患照片','问题照片','问题图片','影像资料','施工单位','监理单位','建设单位','检查人员',
    '工程概况','检查范围','备注','检查情况','检查内容','检查内容及检查情况','整改措施','日期','时间','隐患判定',
    '项目进度','施工阶段','工程进度','告知单编号'}
BAD_ROWS = re.compile(r'^(?:无|无问题|未发现问题|未发现隐患|符合要求|合格|正常|不涉及|/|—|待填写)[。；\s]*$')
MARK = re.compile(r'(问题|违反|依据|建议|要求)\s*[:：]')


def hash_json(value):
    return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()


def target(label):
    k=label_key(label)
    return resolve_label(label) or ALIASES.get(k) or ('basis_or_clause' if k in BASIS else None)


def parent_from_folders(item):
    parts=PurePosixPath(item.get('relative_path',Path(item['path']).name).replace('\\','/')).parts[:-1]
    if not parts:return None
    top=parts[0];chosen=top;index=0
    if top in ('曾雄伟项目','吴亚辉-项目资料','赵赢.rar','西部机场集团、市交通站检查报告'):
        for i,p in enumerate(parts[1:],1):
            if p==top or re.search(r'检查项目资料|^\d{2,4}年$|^\d+月份|^\d+、?季度|^\d+月$',p):continue
            if re.search(r'机场|项目|检查',p) and not re.search(r'报告|清单|资料|年度|记录|附件|通知|签到',p):
                chosen=p;index=i;break
    return {'value':chosen,'source_kind':'directory','source_label':'用户授权的上级项目目录',
        'quote':chosen,'locator':{'relative_directory':'/'.join(parts[:index+1]),'directory_level':index},
        'method':'authorized_directory_rule','details':{'rule_version':'folder-parent-v1','needs_review':top==chosen and top in ('曾雄伟项目','吴亚辉-项目资料','赵赢.rar')}}


def last_saved(path,item):
    values=[]
    if Path(path).suffix.lower() in ('.docx','.xlsx','.pptx'):
        try:
            with zipfile.ZipFile(path) as z:
                core=ET.fromstring(z.read('docProps/core.xml'))
                node=core.find('{http://purl.org/dc/terms/}modified')
                if node is not None and node.text:values.append({'value':node.text,'method':'office_last_saved','locator':{'part':'docProps/core.xml','element':'dcterms:modified'}})
        except (KeyError,zipfile.BadZipFile,ET.ParseError):pass
    if item.get('mtime_ns'):
        value=datetime.datetime.fromtimestamp(item['mtime_ns']/1e9,datetime.timezone(datetime.timedelta(hours=8))).isoformat()
        values.append({'value':value,'method':'filesystem_last_write','locator':{'attribute':'mtime_ns','value':item['mtime_ns'],'timezone':'+08:00'}})
    return values


class Extractor(native.Extraction):
    def __init__(self,item):
        super().__init__(item);self.context=item.get('context',{});self.record_evidence=[];self.report_meta=[];self.continuation=None
        from .mapping_review import CellReview
        self.cell_review=CellReview(item)

    def issue(self,code,reason,u=None,label=None,key=None,kind='semantic',record_key=None):
        self.issues.append({'kind':kind,'code':code,'reason':reason,'quote':u['text'] if u else None,
            'locator':u['locator'] if u else {},'source_label':label,'target_field':key,'record_key':record_key})

    def ev(self,key,u,label,span=None):
        quote=u['text'];value=quote if span is None else quote[span[0]:span[1]]
        return {'field_key':key,'value':value,'quote':quote,'locator':u['locator'],'source_label':label,
            'source_kind':'report','method':u.get('method','native'),
            'details':{'span':span,'span_convention':'unicode_zero_based_half_open','source_sha256':self.item['sha256']}}

    def split(self,u,label):
        reviewed=self.cell_review.split(u,label,self.ev)
        if reviewed is not None:return reviewed
        matches=list(MARK.finditer(u['text']));labels=[m[1] for m in matches]
        # Optional basis/advice and repeated basis labels are explicit boundaries too.
        phases={'问题':0,'违反':1,'依据':1,'建议':2,'要求':2}
        if not labels or labels[0]!='问题' or labels.count('问题')!=1 or any(phases[a]>phases[b] for a,b in zip(labels,labels[1:])) or ('建议' in labels and '要求' in labels):
            self.issue('MIXED_FIELD_BOUNDARY','混合栏目缺少唯一、有序的分段标签，未强拆。',u,label,'problem_description');return []
        if u['text'][:matches[0].start()].strip():
            self.issue('MIXED_FIELD_PREFIX','首标签前有未归属内容。',u,label,'problem_description');return []
        keys={'问题':'problem_description','违反':'basis_or_clause','依据':'basis_or_clause','建议':'rectification_advice','要求':'rectification_requirement'}
        result=[]
        groups=[]
        for m in matches:
            if not groups or phases[m[1]]!=phases[groups[-1][0][1]]:groups.append([m])
            else:groups[-1].append(m)
        for i,group in enumerate(groups):
            m=group[0];end=groups[i+1][0].start() if i+1<len(groups) else len(u['text'])
            if not u['text'][m.end():end].strip():
                self.issue('MIXED_EMPTY_PART','混合栏标签内容为空。',u,label,keys[m[1]]);return []
            result.append(self.ev(keys[m[1]],u,label,(m.end(),end)))
        return result

    def inline_meta(self,u):
        # Explicit labels only; source snippets retain character offsets.
        reverse=re.fullmatch(r'\s*(.{3,160}?)\s*[:：]?\s*[（(]\s*(项目名称|工程名称|受检项目)\s*[）)]\s*',u['text'])
        if reverse and re.search(r'[\u4e00-\u9fffA-Za-z]',reverse[1]):
            return [self.ev('engineering_project_name',u,reverse[2],reverse.span(1))]
        pattern=re.compile(r'(工程名称|工程项目|项目名称|项目标段|受检项目|检查日期|检查时间|巡查日期)\s*[:：]')
        matches=list(pattern.finditer(u['text']));result=[]
        for i,m in enumerate(matches):
            end=matches[i+1].start() if i+1<len(matches) else len(u['text'])
            text=u['text'][m.end():end]
            # Stop before another known metadata field, including unfilled form labels.
            other=re.search(r'(检查人员|施工单位|监理单位|建设单位|签发人)\s*[:：]',text)
            if other:end=m.end()+other.start()
            if u['text'][m.end():end].strip():result.append(self.ev(target(m[1]),u,m[1],(m.end(),end)))
        return result

    def tables(self,rows,locator):
        headers={};local=[];width=0;metadata_header=None
        column_widths=locator.get('native_column_widths')
        if self.continuation and locator.get('adjacent_without_text') and column_widths and all(column_widths) and column_widths==self.continuation['column_widths']:
            headers=self.continuation['headers'];width=self.continuation['width'];local=list(self.continuation['local'])
        self.continuation=None
        for row in rows:
            cs=row['cells'];unique=list({c['key']:c for c in cs}.values());texts=[c['text'].strip() for c in unique]
            # A header/value overview is distinct from the following problem table.
            overview_labels={'项目名称','工程名称','工程项目','受检项目','检查内容','检查范围','影像资料','照片','检查日期','检查时间'}
            if len(unique)>=2 and all(label_key(t) in overview_labels for t in texts) and any(target(t)=='engineering_project_name' for t in texts):
                metadata_header={i:c['text'] for i,c in enumerate(cs) if target(c['text']) in META};continue
            if metadata_header is not None:
                additions=[]
                for i,label in metadata_header.items():
                    if i<len(cs) and cs[i]['text'].strip() and target(cs[i]['text']) is None and label_key(cs[i]['text']) not in AUX|COMPOUND:
                        additions.append(self.ev(target(label),cs[i],label))
                if any(e['field_key']=='engineering_project_name' for e in additions):
                    local=[e for e in local if e['field_key']!='engineering_project_name']
                    local.extend(additions);self.report_meta.extend(additions)
                metadata_header=None
                if additions:continue
            # Structural metadata pairs, including merged label/value cells.
            is_pairs=len(unique)%2==0 and len(unique)>=2 and all(
                (target(unique[i]['text']) in META or label_key(unique[i]['text']) in AUX)
                and target(unique[i+1]['text']) is None and label_key(unique[i+1]['text']) not in AUX|COMPOUND
                and len(unique[i]['text'])<30 for i in range(0,len(unique),2))
            if is_pairs:
                if any(target(unique[i]['text'])=='engineering_project_name' for i in range(0,len(unique),2)):
                    local=[e for e in local if e['field_key']!='engineering_project_name']
                for i in range(0,len(unique),2):
                    key=target(unique[i]['text'])
                    if key in META and unique[i+1]['text'].strip():
                        e=self.ev(key,unique[i+1],unique[i]['text']);local.append(e);self.report_meta.append(e)
                continue
            if len(unique)==2 and label_key(unique[0]['text']) in COMPOUND:
                fields=self.split(unique[1],unique[0]['text']);self.add(fields,row['locator'],local);continue
            desc_headers=[i for i,c in enumerate(cs) if target(c['text'])=='problem_description' or label_key(c['text']) in COMPOUND]
            known=sum(bool(target(c['text'])) or label_key(c['text']) in AUX|COMPOUND for c in unique)
            if desc_headers and known>=2 and all(len(t)<=70 for t in texts if t) and known>=.5*len([t for t in texts if t]):
                headers={i:c for i,c in enumerate(cs) if target(c['text']) or label_key(c['text']) in COMPOUND};width=len(cs);continue
            if not headers:
                for c in unique:
                    if len(c['text'])<300:local.extend(self.inline_meta(c))
                continue
            if len(unique)==1 and re.search(r'工程验收检查单|违反强制性条文.*一般性条款',unique[0]['text']):
                # Validated intra-table checklist section, not an engineering-site value.
                local=[];continue
            if len(cs)!=width or len(unique)==1:
                # Any table section may introduce another engineering site. Don't carry values blindly.
                headers={};continue
            fields=[];seen=set()
            for i,h in headers.items():
                u=cs[i];label=h['text'];key=target(label)
                if (key,u['key']) in seen:continue
                seen.add((key,u['key']))
                if not u['text'].strip():continue
                if u['locator'].get('missing_cell'):
                    self.issue('MISSING_CELL_GEOMETRY','缺少真实单元格边界，不能继承内容。',u,label,key,'technical');continue
                if label_key(label) in COMPOUND:fields.extend(self.split(u,label))
                elif key:fields.append(self.ev(key,u,label))
            self.add(fields,row['locator'],local)
        # Record scope remains table-specific; metadata is not automatically propagated across different sites.
        if headers and column_widths:
            self.continuation={'headers':headers,'width':width,'local':local,'column_widths':column_widths}

    def add(self,fields,loc,context):
        fields=self.cell_review.correct_fields(fields,loc,self.units,self.ev)
        desc=[e for e in fields if e['field_key']=='problem_description' and e['value'].strip()]
        if not desc:return
        value=desc[0]['value'].strip()
        if len(value)<5 or BAD_ROWS.fullmatch(value) or target(value) or value.startswith('='):
            self.issue('NOT_ACTUAL_PROBLEM_ROW','空模板、标签、公式、正常项或过短片段不生成问题。',{'text':value,'locator':loc},desc[0]['source_label'],'problem_description','source_identity');return
        if re.match(r'^(检查范围|工程概况|检查内容|本次检查|整改建议|说明[:：])',value):
            self.issue('ROW_ROLE_UNCERTAIN','可能是检查范围、概况或总体说明，暂不生成问题。',{'text':value,'locator':loc},desc[0]['source_label'],'problem_description');return
        values=collections.defaultdict(list)
        for e in fields:values[e['field_key']].append(e)
        direct=set(values)
        for e in context:
            if e['field_key'] in META and e['field_key'] not in direct:values[e['field_key']].append(e)
        out={};evidence=[];key=hash_json(loc)
        for name,es in values.items():
            distinct={e['value'].strip() for e in es}
            if len(distinct)>1:
                if name=='inspection_date':
                    evidence.extend(es);continue
                if name=='basis_or_clause' and all(label_key(e['source_label']) in BASIS for e in es):
                    out[name]='\n'.join(e['source_label']+'：'+e['value'] for e in es);evidence.extend(es);continue
                if name=='reported_response' and len({label_key(e['source_label']) for e in es})==len(es) and all(label_key(e['source_label']) in {'整改回复','整改情况','整改落实情况','整改结果'} for e in es):
                    out[name]='\n'.join(e['source_label']+'：'+e['value'] for e in es);evidence.extend(es);continue
                for e in es:self.issue('FIELD_VALUE_CONFLICT','同义字段值不同，未覆盖；保留所有候选证据。',{'text':e['quote'],'locator':e['locator']},e['source_label'],name,record_key=key)
                continue
            out[name]=es[0]['value'];evidence.extend(es)
        if not out.get('problem_description'):return
        self.records.append({'key':key,'values':out,'evidence':evidence,'locator':loc})

    def finish(self):
        # Only explicit report metadata; no filename-derived sites or dates.
        for u in self.units:
            if u['kind'] in ('paragraph','page'):
                if u['kind']=='page':
                    for line in u['text'].splitlines():
                        if len(line)<240:self.report_meta.extend(self.inline_meta({**u,'text':line,'locator':{**u['locator'],'extracted_line_quote':line}}))
                elif len(u['text'])<240:self.report_meta.extend(self.inline_meta(u))
        grouped=collections.defaultdict(list)
        for e in self.report_meta:grouped[e['field_key']].append(e)
        sites={e['value'].strip() for e in grouped['engineering_project_name']}
        sites.update(r['values']['engineering_project_name'].strip() for r in self.records if r['values'].get('engineering_project_name'))
        for r in self.records:
            vals=r['values'];ev=r['evidence'];key=r['key']
            if not vals.get('engineering_project_name') and len(sites)==1 and grouped['engineering_project_name']:
                e=grouped['engineering_project_name'][0];vals['engineering_project_name']=e['value'];ev.append(e)
            if not vals.get('engineering_project_name'):
                self.issue('SITE_SCOPE_UNRESOLVED','原文工地归属缺失或不唯一，未按封面或文件名填充。',{'text':'','locator':r['locator']},key='engineering_project_name',record_key=key)
            parent=self.context.get('parent')
            if parent and parent.get('value'):
                vals['project_name']=parent['value'];ev.append({**parent,'field_key':'project_name'})
            dates=[e for e in ev if e['field_key']=='inspection_date']
            if not dates and len(sites)<=1:dates=grouped['inspection_date']
            if dates:
                unique={e['value'].strip() for e in dates};years=set(re.findall(r'\b(?:19|20)\d{2}\b',' '.join(unique)))
                if len(unique)==1 and len(years)<=1:
                    vals['inspection_date']=dates[0]['value']
                    if not any(e['field_key']=='inspection_date' for e in ev):ev.extend(dates)
                else:
                    vals.pop('inspection_date',None)
                if len(unique)>1 or len(years)!=1:
                    saved=self.context.get('saved_times',[]);selected=None
                    for s in saved:
                        year=s['value'][:4]
                        if year.isdigit() and 2000<=int(year)<=datetime.date.today().year and (not years or year in years):selected=s;break
                    year=next(iter(years)) if len(years)==1 else selected['value'][:4] if selected else None
                    if year:
                        vals['inspection_date']=year
                        ev[:]=[e for e in ev if e['field_key']!='inspection_date']
                        ev.extend(dates)
                        if selected:ev.append({'field_key':'inspection_date','value':year,'quote':selected['value'],
                            'source_label':'文件最后保存时间（仅辅助年份）','locator':selected['locator'],'source_kind':'file_metadata',
                            'method':selected['method'],'details':{'selected_year':year,'precision':'year','candidate_dates':sorted(unique)}})
                    else:
                        vals.pop('inspection_date',None)
                        self.issue('DATE_YEAR_UNRESOLVED','多个年份与最后保存时间不能形成一致判断，日期留空。',{'text':'；'.join(sorted(unique)),'locator':r['locator']},key='inspection_date',record_key=key)
            vals['hazard_category']=None
        for p in self.pages:
            if p['status']!='native_text':self.issue('PAGE_NEEDS_OCR','页面原生文字不足，需区分扫描正文、照片、签字或空白。',{'text':'','locator':{'physical_page':p['page']}},kind='technical')
        if not self.records:self.issue('NO_ELIGIBLE_PROBLEM_ROWS','未获得可可靠定位的实际问题行；不代表没有隐患。',kind='technical')
        return {'parser_version':PARSER_VERSION,'dictionary_version':VERSION,'records':self.records,'issues':self.issues,
            'status':'partial' if self.issues else 'extracted','counts':{'findings':len(self.records),'issues':len(self.issues),'pages':len(self.pages)},
            'source_sha256':self.item['sha256']}


def _parse_original(path,item,context=None):
    item={**item,'context':context or {}};suffix=Path(path).suffix.lower()
    # Candidate inventory contains auxiliary documents and derived spreadsheets. They are not factual inputs.
    name=item.get('original_name',Path(item['path']).name)
    blocked=re.search(r'签到|申请表|申报表|管理办法|管理制度|检查计划|工作计划|数据统计|评分细则|打分定稿|考核标准|空白模板',name)
    if blocked or suffix in ('.xls','.xlsx'):
        out=Extractor(item);out.issue('SOURCE_ROLE_NOT_REPORT','辅助资料、统计/标准或尚未核实为原始检查记录的表格，不提取隐患事实。',kind='source_identity')
        result=out.finish();result['status']='source_review';return result
    if suffix in ('.doc','.wps'):
        from .reviewed_scope import converted_source
        reviewed_conversion=converted_source(Path(path),item,context or {})
        if reviewed_conversion is not None:
            result=native.docx(reviewed_conversion,item,Extractor)
            for r in result['records']:
                r['locator']['locator_space']='converted_docx'
                for e in r['evidence']:
                    if e['source_kind']=='report':e['method']='converted_native';e['locator']['locator_space']='converted_docx'
            return result
        wrapper=Path('D:/脚本/脚本/Convert-LibreOfficeIsolated.ps1')
        with tempfile.TemporaryDirectory(prefix='history-convert-') as temp:
            output=Path(temp)/'converted';output.mkdir()
            if wrapper.exists():
                cmd=['powershell.exe','-NoProfile','-ExecutionPolicy','Bypass','-File',str(wrapper),'-SourcePath',str(path),'-OutputDir',str(output),'-ConvertTo','docx','-TimeoutSeconds','120']
            else:
                executable=shutil.which('libreoffice') or shutil.which('soffice')
                if not executable:
                    out=Extractor(item);out.issue('CONVERTER_UNAVAILABLE','当前环境无旧Word转换器，原件已保存，待转换。',kind='technical');return out.finish()
                cmd=[executable,'-env:UserInstallation='+ (Path(temp)/'profile').as_uri(),'--headless','--convert-to','docx','--outdir',str(output),str(path)]
            completed=subprocess.run(cmd,capture_output=True,timeout=150)
            converted=list(output.glob('*.docx'))
            if completed.returncode or len(converted)!=1:
                out=Extractor(item);out.issue('CONVERSION_FAILED','旧Word转换失败；继续其他文件。',kind='technical');return out.finish()
            result=native.docx(converted[0],item,Extractor)
            for r in result['records']:
                r['locator']['locator_space']='converted_docx'
                for e in r['evidence']:
                    if e['source_kind']=='report':e['method']='converted_native';e['locator']['locator_space']='converted_docx'
            return result
    if suffix=='.docx':return native.docx(path,item,Extractor)
    if suffix=='.pdf':
        result=native.pdf(path,item,Extractor)
        from .visual_supplement import augment
        return augment(result,item,context or {})
    if suffix=='.pptx':
        out=Extractor(item)
        with zipfile.ZipFile(path) as z:
            for part in sorted(n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)):
                slide=int(re.search(r'(\d+)\.xml',part)[1]);root=ET.fromstring(z.read(part))
                for ti,t in enumerate(root.iter(native.A+'tbl'),1):
                    rows=[]
                    for ri,row in enumerate(t.findall(native.A+'tr'),1):
                        loc={'kind':'pptx_row','slide':slide,'table':ti,'row':ri}
                        cells=[out.unit(f's{slide}t{ti}r{ri}c{ci}',native.text_of(c),{**loc,'cell':ci}) for ci,c in enumerate(row.findall(native.A+'tc'),1)]
                        rows.append({'cells':cells,'locator':loc})
                    out.tables(rows,{'slide':slide})
        return out.finish()
    out=Extractor(item);out.issue('FORMAT_REQUIRES_CONVERSION','旧格式需临时转换后读取，原件仍保留原格式。',kind='technical');return out.finish()

def parse_original(path,item,context=None):
    result=_parse_original(path,item,context)
    from .scope_supplement import augment
    result=augment(result,Path(path),item,context or {})
    from .reviewed_scope import augment as reviewed_augment,reconcile_site_issues
    result=reviewed_augment(result,Path(path),item,context or {})
    from .native_supplement import augment as native_augment
    result=native_augment(result,Path(path),item,context or {})
    from .external_supplement import augment as external_augment
    result=external_augment(result,Path(path),item,context or {})
    from .record_removals import filter_result
    result=filter_result(result,item,context or {})
    from .page_reuse import apply as apply_page_reuse
    result=apply_page_reuse(result,item,context or {})
    return reconcile_site_issues(result)
