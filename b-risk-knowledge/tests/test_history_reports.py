import unittest
from backend.modules.history_reports.engine import Extractor,parent_from_folders
from backend.modules.history_reports.service import validate_result

class MappingTests(unittest.TestCase):
    def test_reviewed_filename_date_provenance_and_calendar(self):
        from backend.modules.history_reports.visual_supplement import validate_filename_date
        import copy
        name='22-20251211-华新路雨水泵站项目-现场检查清单.pdf'
        e={'field_key':'inspection_date','source_kind':'filename','method':'reviewed_filename_date',
           'quote':name,'value':'20251211','locator':{'kind':'original_filename','filename':name},
           'details':{'span':[3,11],'precision':'day','role':'inspection_date','role_reviewed':True,
                      'role_reason':'文件名现场检查清单日期；对应已核验的本次检查页'}}
        validate_filename_date(e,{'original_name':name})
        with self.assertRaises(AssertionError):validate_filename_date(e,{'original_name':'别的报告.pdf'})
        altered=copy.deepcopy(e);altered['details']['role_reviewed']=False
        with self.assertRaises(AssertionError):validate_filename_date(altered,{'original_name':name})
        invalid=copy.deepcopy(e);invalid['value']='20250230';invalid['quote']=name.replace('20251211','20250230');invalid['locator']['filename']=invalid['quote']
        with self.assertRaises(ValueError):validate_filename_date(invalid,{'original_name':invalid['quote']})
        reply=copy.deepcopy(e);reply['quote']=name.replace('现场检查清单','整改回复单');reply['locator']['filename']=reply['quote']
        with self.assertRaises(AssertionError):validate_filename_date(reply,{'original_name':reply['quote']})
        year=copy.deepcopy(e);year['value']='2025';year['details'].update(span=[3,7],precision='year')
        with self.assertRaises(AssertionError):validate_filename_date(year,{'original_name':name})
        year['quote']='22-2025年检查记录.pdf';year['locator']['filename']=year['quote']
        validate_filename_date(year,{'original_name':year['quote']})

    def test_reverse_project_label_and_airport_section(self):
        ex=Extractor({'path':'sample.docx','sha256':'a'*64})
        u=ex.unit('p1','中国海螺创业控股有限公司嘉定新城F16a-01、F16a-04（研发总部）：（项目名称）',{'paragraph':1},'paragraph')
        e=ex.inline_meta(u)[0]
        self.assertEqual(e['value'],'中国海螺创业控股有限公司嘉定新城F16a-01、F16a-04（研发总部）')
        self.assertEqual(e['quote'][slice(*e['details']['span'])],e['value'])
        airport=ex.unit('p2','项目标段：城航楼    监理单位：建设工程监理',{'paragraph':2},'paragraph')
        self.assertEqual(ex.inline_meta(airport)[0]['value'].strip(),'城航楼')

    def test_compound_without_basis(self):
        r=self.build(['序号','不符合内容与建议'],[['1','问题：地砖背面有滑石粉。建议：铺贴前清理干净。']])
        self.assertEqual(r['records'][0]['values']['problem_description'],'地砖背面有滑石粉。')
        self.assertEqual(r['records'][0]['values']['rectification_advice'],'铺贴前清理干净。')
        self.assertNotIn('basis_or_clause',r['records'][0]['values'])

    def test_repeated_explicit_basis_keeps_whole_span(self):
        r=self.build(['序号','不符合内容与建议'],[['1','问题：作业人员未系安全带。违反：规范甲。违反：规范乙。建议：系挂安全带。']])
        self.assertEqual(r['records'][0]['values']['basis_or_clause'],'规范甲。违反：规范乙。')

    def test_response_status_components_keep_original_labels(self):
        r=self.build(['序号','问题描述','整改回复','整改情况'],[['1','木梯未固定。','已替换为铝梯。','已整改完成']])
        self.assertEqual(r['records'][0]['values']['reported_response'],'整改回复：已替换为铝梯。\n整改情况：已整改完成')

    def test_site_pair_beside_progress(self):
        ex=Extractor({'path':'sample.docx','sha256':'a'*64});rows=[]
        for ri,values in enumerate([['项目名称','西区公建31-01幼儿园','项目进度','主体结构'],['序号','问题描述','问题类别','照片'],['1','临边缺少防护栏杆。','安全','']],1):
            loc={'table':1,'row':ri};rows.append({'locator':loc,'cells':[ex.unit(f'{ri}:{ci}',s,{**loc,'cell':ci}) for ci,s in enumerate(values,1)]})
        ex.tables(rows,{'table':1});r=ex.finish();validate_result(r)
        self.assertEqual(r['records'][0]['values']['engineering_project_name'],'西区公建31-01幼儿园')

    def test_overview_header_then_site_value(self):
        ex=Extractor({'path':'sample.docx','sha256':'a'*64});rows=[]
        for ri,values in enumerate([['项目名称','检查内容','影像资料'],['临港污水处理厂三期','深基坑使用阶段检查',''],['序号','问题描述','类别'],['1','缺少排水设施。','安全']],1):
            loc={'table':1,'row':ri};rows.append({'locator':loc,'cells':[ex.unit(f'{ri}:{ci}',s,{**loc,'cell':ci}) for ci,s in enumerate(values,1)]})
        ex.tables(rows,{'table':1});r=ex.finish();validate_result(r)
        self.assertEqual(r['records'][0]['values']['engineering_project_name'],'临港污水处理厂三期')

    def build(self,headers,rows,context=None):
        ex=Extractor({'path':'sample.docx','sha256':'a'*64,'context':context or {}})
        parsed=[]
        for ri,row in enumerate([headers]+rows,1):
            loc={'table':1,'row':ri}
            parsed.append({'locator':loc,'cells':[ex.unit(f'{ri}:{ci}',t,{**loc,'cell':ci}) for ci,t in enumerate(row,1)]})
        ex.tables(parsed,{'table':1});result=ex.finish();validate_result(result);return result

    def test_synonyms_and_original_categories(self):
        r=self.build(['序号','具体隐患','隐患类别','隐患星级'],[['1','临边缺少防护栏杆。','A','★★']])
        self.assertEqual(r['records'][0]['values']['source_category'],'A')
        self.assertEqual(r['records'][0]['values']['source_grade'],'★★')
        self.assertIsNone(r['records'][0]['values']['hazard_category'])

    def test_compound_spans(self):
        r=self.build(['序号','不符合内容与建议'],[['1','问题：临边未防护。违反：规范第1条。建议：安装栏杆。']])
        v=r['records'][0]['values']
        self.assertEqual(v['problem_description'],'临边未防护。')
        self.assertEqual(v['basis_or_clause'],'规范第1条。')
        self.assertEqual(v['rectification_advice'],'安装栏杆。')

    def test_ambiguous_mixed_does_not_invent(self):
        r=self.build(['序号','不符合内容与建议'],[['1','临边缺少栏杆，应采取措施']])
        self.assertEqual(len(r['records']),0)
        self.assertTrue(any(i['code']=='MIXED_FIELD_BOUNDARY' for i in r['issues']))

    def test_empty_category_not_filled(self):
        r=self.build(['序号','问题描述','类别'],[['1','临边缺少防护栏杆。','安全'],['2','脚手架缺少连墙件。','']])
        self.assertNotIn('source_category',r['records'][1]['values'])

    def test_conflicting_synonyms_remain_null(self):
        r=self.build(['问题描述','类别','问题类别'],[['临边缺少防护栏杆。','安全','质量']])
        self.assertNotIn('source_category',r['records'][0]['values'])
        self.assertTrue(any(i['code']=='FIELD_VALUE_CONFLICT' for i in r['issues']))

    def test_multiple_sites_no_global_cover_fill(self):
        r=self.build(['问题描述','工程名称'],[['临边缺少防护栏杆。','A工地'],['脚手架缺少连墙件。','B工地'],['模板缺少斜撑。','']])
        self.assertNotIn('engineering_project_name',r['records'][2]['values'])

    def test_normal_rows_excluded(self):
        r=self.build(['序号','问题描述'],[['1','未发现隐患'],['2','问题描述']])
        self.assertEqual(len(r['records']),0)

    def test_year_precision_never_invents_day(self):
        c={'saved_times':[{'value':'2025-06-19T12:00:00','method':'office_last_saved','locator':{'part':'docProps/core.xml'}}]}
        r=self.build(['问题描述','检查日期'],[['临边缺少防护栏杆。','6月18日']],c)
        self.assertEqual(r['records'][0]['values']['inspection_date'],'2025')
        self.assertEqual(r['records'][0]['evidence'][-1]['source_kind'],'file_metadata')

    def test_folder_parent_only(self):
        p=parent_from_folders({'path':'x','relative_path':'曾雄伟项目/嘉定项目/2024/报告.docx'})
        self.assertEqual(p['value'],'嘉定项目');self.assertEqual(p['source_kind'],'directory')

    def test_split_word_table_requires_matching_widths_and_no_intervening_text(self):
        ex=Extractor({'path':'sample.docx','sha256':'a'*64})
        def row(n,values):
            return {'locator':{'table':n,'row':1},'cells':[ex.unit(f'{n}:{i}',v,{'table':n,'row':1,'cell':i}) for i,v in enumerate(values,1)]}
        ex.tables([row(1,['序号','问题描述'])],{'table':1,'native_column_widths':['100','900']})
        ex.tables([row(2,['1','临边缺少防护栏杆。'])],{'table':2,'native_column_widths':['100','900'],'adjacent_without_text':True})
        ex.tables([row(3,['2','此处有新章节不能继承。'])],{'table':3,'native_column_widths':['100','900'],'adjacent_without_text':False})
        self.assertEqual(len(ex.finish()['records']),1)

    def test_multiple_table_dates_do_not_pick_first(self):
        ex=Extractor({'path':'sample.docx','sha256':'a'*64,'context':{'saved_times':[{'value':'2025-03-02','method':'office_last_saved','locator':{'part':'core'}}]}})
        meta=[]
        for n,value in enumerate(['2024年3月1日','2025年3月1日']):
            u=ex.unit(str(n),value,{'table':1,'row':n+1,'cell':2});meta.append(ex.ev('inspection_date',u,'检查日期'))
        desc=ex.unit('problem','临边缺少防护栏杆。',{'table':1,'row':4,'cell':2})
        ex.add([ex.ev('problem_description',desc,'具体隐患')],{'table':1,'row':4},meta)
        r=ex.finish();validate_result(r)
        self.assertEqual(r['records'][0]['values']['inspection_date'],'2025')
        self.assertEqual(len([e for e in r['records'][0]['evidence'] if e['source_kind']=='report' and e['field_key']=='inspection_date']),2)

    def test_two_years_in_one_cell_use_matching_saved_year(self):
        c={'saved_times':[{'value':'2025-03-02','method':'office_last_saved','locator':{'part':'core'}}]}
        r=self.build(['问题描述','检查日期'],[['临边缺少防护栏杆。','2024年3月1日、2025年3月1日']],c)
        self.assertEqual(r['records'][0]['values']['inspection_date'],'2025')

class ReviewedEvidenceTests(unittest.TestCase):
    def test_cell_review_is_exact_and_does_not_generalize(self):
        import tempfile,json,hashlib
        from pathlib import Path
        from unittest.mock import patch
        from backend.modules.history_reports.mapping_review import CellReview
        loc={'kind':'docx_cell','part':'word/document.xml','table':1,'row':4,'cell':2}
        text='配电箱接地缺失。建议：补齐保护接地。'
        spec={'original_location':loc,'original_label':'不符合内容与建议','quote':text,
          'split_fields':[{'field_key':'problem_description','source_label':'原首段','span':[0,8],'value':text[:8]},
             {'field_key':'rectification_advice','source_label':'建议','span':[11,len(text)],'value':text[11:]}]}
        with tempfile.TemporaryDirectory() as temp:
            path=Path(temp)/'review.json';raw=json.dumps({'source_sha256':'a'*64,'splits':[spec]}).encode();path.write_bytes(raw)
            item={'path':'sample.docx','sha256':'a'*64,'context':{'mapping_review_sha256':hashlib.sha256(raw).hexdigest()}}
            with patch('backend.modules.history_reports.mapping_review.review_path',return_value=path):
                ex=Extractor(item);u={'text':text,'locator':loc}
                es=ex.split(u,spec['original_label']);self.assertEqual(es[0]['value'],text[:8])
                self.assertIsNone(ex.cell_review.split({**u,'locator':{**loc,'row':5}},spec['original_label'],ex.ev))
                with self.assertRaises(AssertionError):ex.split({**u,'text':'修改后的文字'},spec['original_label'])

    def test_partial_visual_review_preserves_pending_page_and_source_conflict(self):
        import tempfile,json,hashlib
        from pathlib import Path
        from unittest.mock import patch
        from backend.modules.history_reports.visual_supplement import augment
        with tempfile.TemporaryDirectory() as temp:
            path=Path(temp)/'review.json'
            data={'source_sha256':'a'*64,'review_method':'assistant_visual_readback',
              'reviewed_pages':[1,2],'fully_reviewed_pages':[1],'records':[],
              'review_issues':[{'code':'HANDWRITING_UNRESOLVED','reason':'原字不清',
                'locator':{'physical_page':2},'excerpt':'原文区域待核'},
                {'code':'PAGE_NEEDS_OCR','reason':'手写未读清','locator':{'physical_page':2}}]}
            raw=json.dumps(data).encode();path.write_bytes(raw)
            result={'records':[],'issues':[{'code':'PAGE_NEEDS_OCR','reason':'原文不足','locator':{'physical_page':p}} for p in [1,2]],'counts':{}}
            with patch('backend.modules.history_reports.visual_supplement.supplement_path',return_value=path):
                out=augment(result,{'sha256':'a'*64},{'visual_supplement_sha256':hashlib.sha256(raw).hexdigest()})
            self.assertEqual([i['locator']['physical_page'] for i in out['issues'] if i['code']=='PAGE_NEEDS_OCR'],[2])
            self.assertIn('手写未读清',out['issues'][0]['reason'])
            self.assertIn('HANDWRITING_UNRESOLVED',[i['code'] for i in out['issues']])

    def test_scope_review_cannot_cross_table_or_overwrite_facts(self):
        import tempfile,json,hashlib,zipfile,copy
        from pathlib import Path
        from unittest.mock import patch
        from backend.modules.history_reports.scope_supplement import augment
        with tempfile.TemporaryDirectory() as temp:
            path=Path(temp)/'original.docx';review=Path(temp)/'scope.json'
            xml='<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>甲工地检查问题清单</w:t></w:r></w:p><w:tbl/><w:p><w:r><w:t>乙工地检查问题清单</w:t></w:r></w:p><w:tbl/></w:body></w:document>'
            with zipfile.ZipFile(path,'w') as z:z.writestr('word/document.xml',xml)
            sha=hashlib.sha256(path.read_bytes()).hexdigest()
            spec={'field_key':'engineering_project_name','quote':'甲工地检查问题清单','value':'甲工地','span':[0,3],
              'source_label':'问题清单表标题','locator':{'body_paragraph':1},'table':1,'record_refs':[{'source_key':'one'}]}
            data={'source_sha256':sha,'review_method':'assistant_original_xml_readback','tables':[spec]}
            raw=json.dumps(data).encode();review.write_bytes(raw)
            base={'records':[{'key':'one','locator':{'part':'word/document.xml','table':1},'values':{},'evidence':[]},
              {'key':'two','locator':{'part':'word/document.xml','table':2},'values':{},'evidence':[]}],
              'issues':[{'code':'SITE_SCOPE_UNRESOLVED','record_key':k} for k in ('one','two')],'counts':{}}
            context={'scope_supplement_sha256':hashlib.sha256(raw).hexdigest()}
            with patch('backend.modules.history_reports.scope_supplement.supplement_path',return_value=review):
                out=augment(copy.deepcopy(base),path,{'sha256':sha},context)
                self.assertEqual(out['records'][0]['values']['engineering_project_name'],'甲工地')
                self.assertNotIn('engineering_project_name',out['records'][1]['values'])
                self.assertEqual(out['issues'][0]['record_key'],'two')
                conflicting=copy.deepcopy(base);conflicting['records'][0]['values']['engineering_project_name']='已记载工地'
                with self.assertRaises(AssertionError):augment(conflicting,path,{'sha256':sha},context)

if __name__=='__main__':unittest.main()
