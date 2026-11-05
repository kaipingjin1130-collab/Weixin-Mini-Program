import copy, hashlib, json, tempfile, unittest, zipfile
from pathlib import Path
from unittest.mock import patch
from backend.modules.history_reports.native_supplement import augment
from backend.modules.history_reports.engine import hash_json
from backend.modules.history_reports.service import validate_result

class NativeSupplementTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.path=Path(self.tmp.name)/'original.docx';self.side=Path(self.tmp.name)/'review.json'
        xml='<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>受检工地：甲工地</w:t></w:r></w:p><w:p><w:r><w:t>检查月：2025年5月</w:t></w:r></w:p><w:p><w:r><w:t>1、C1楼防护栏缺失；2、验收结论与现场不符。</w:t></w:r></w:p><w:tbl><w:tr><w:tc><w:p><w:r><w:t>回填压实度不合格：85%</w:t></w:r></w:p></w:tc></w:tr></w:tbl></w:body></w:document>'
        with zipfile.ZipFile(self.path,'w') as z:z.writestr('word/document.xml',xml)
        self.sha=hashlib.sha256(self.path.read_bytes()).hexdigest();self.item={'sha256':self.sha}
        def ev(field,quote,value,paragraph):
            a=quote.index(value)
            return dict(field_key=field,value=value,quote=quote,source_kind='report',source_label='原文',method='reviewed_native_transcription',locator=dict(kind='docx_paragraph',body_paragraph=paragraph),details=dict(span=[a,a+len(value)],source_sha256=self.sha,review_method='assistant_original_native_readback',reason='已对照打印正文与同项目表格，非旧库补值',user_confirmation=False))
        self.evs=[ev('problem_description','1、C1楼防护栏缺失；2、验收结论与现场不符。','验收结论与现场不符',3),ev('engineering_project_name','受检工地：甲工地','甲工地',1),ev('inspection_date','检查月：2025年5月','2025年5月',2)]
        loc=dict(kind='reviewed_native_problem',source_locator=self.evs[0]['locator'],span=self.evs[0]['details']['span'])
        self.rec=dict(key=hash_json(loc),locator=loc,values={e['field_key']:e['value'] for e in self.evs},evidence=self.evs)
        self.data=dict(schema_version=1,source_sha256=self.sha,review_method='assistant_original_native_readback',records=[self.rec])
        self.base=dict(records=[],issues=[dict(code='NO_ELIGIBLE_PROBLEM_ROWS')],counts={},status='partial')
        self.patcher=patch('backend.modules.history_reports.native_supplement.supplement_path',return_value=self.side);self.patcher.start();self.addCleanup(self.patcher.stop)
    def run_data(self,data=None,base=None,context=None):
        self.side.write_text(json.dumps(data or self.data,ensure_ascii=False),encoding='utf-8')
        ctx={'native_supplement_sha256':hashlib.sha256(self.side.read_bytes()).hexdigest()}
        if context:ctx.update(context)
        return augment(copy.deepcopy(self.base if base is None else base),self.path,self.item,ctx)
    def test_original_span_and_month_precision(self):
        r=self.run_data();self.assertEqual(len(r['records']),1)
        self.assertEqual(r['records'][0]['values']['inspection_date'],'2025年5月')
        self.assertEqual(r['records'][0]['review_state'],'ai_native_checked');self.assertEqual(r['issues'],[]);validate_result(r)
    def test_cell_backed_failure_not_converted_to_pass(self):
        d=copy.deepcopy(self.data);e=d['records'][0]['evidence'][0]
        e.update(quote='回填压实度不合格：85%',value='回填压实度不合格：85%',locator=dict(kind='docx_cell',part='word/document.xml',table=1,row=1,cell=1));e['details']['span']=[0,len(e['value'])]
        r=d['records'][0];r['values']['problem_description']=e['value'];r['locator'].update(source_locator=e['locator'],span=e['details']['span']);r['key']=hash_json(r['locator'])
        self.assertEqual(self.run_data(d)['records'][0]['values']['problem_description'],'回填压实度不合格：85%')
    def test_wrong_original_quote_and_span_rejected(self):
        for change in ('quote','span','value'):
            d=copy.deepcopy(self.data);e=d['records'][0]['evidence'][0]
            if change=='span':e['details']['span']=[0,3]
            else:e[change]='凭空补入的内容'
            with self.subTest(change=change),self.assertRaises(AssertionError):self.run_data(d)
    def test_source_and_context_identity_rejected(self):
        d=copy.deepcopy(self.data);d['source_sha256']='a'*64
        with self.assertRaises(AssertionError):self.run_data(d)
        with self.assertRaises(AssertionError):self.run_data(context={'native_supplement_sha256':'b'*64})
    def test_missing_supplement_blocks_previously_reviewed_parse(self):
        with self.assertRaises(AssertionError):augment(copy.deepcopy(self.base),self.path,self.item,{'native_supplement_sha256':'a'*64})
        self.assertEqual(augment(copy.deepcopy(self.base),self.path,self.item,{}),self.base)
    def test_duplicate_description_cannot_be_added_at_different_position(self):
        b=copy.deepcopy(self.base);b['records']=[dict(key='old',values={'problem_description':'验收结论与现场不符。','engineering_project_name':'甲工地','inspection_date':'2025年5月','source_category':'原类别'},evidence=[],locator={})]
        with self.assertRaises(AssertionError):self.run_data(base=b)
    def test_unknown_field_or_standard_classification_rejected(self):
        for field in ('另一个同义描述','hazard_category'):
            d=copy.deepcopy(self.data);d['records'][0]['values'][field]='不应补入'
            with self.subTest(field=field),self.assertRaises(AssertionError):self.run_data(d)
    def test_existing_rows_unchanged_and_repeat_deterministic(self):
        b=copy.deepcopy(self.base);old=dict(key='old',values={'problem_description':'其他独立问题','source_category':'原类别'},evidence=[],locator={});b['records']=[old]
        one=self.run_data(base=b);two=self.run_data(base=b)
        self.assertEqual(one,two);self.assertEqual(one['records'][0],old)
        d=copy.deepcopy(self.data);d['records'].append(copy.deepcopy(d['records'][0]))
        with self.assertRaises(AssertionError):self.run_data(d,base=b)
        self.assertEqual(b['records'],[old])
    def test_same_words_at_other_site_are_not_suppressed(self):
        b=copy.deepcopy(self.base);b['records']=[dict(key='other',values={'problem_description':'验收结论与现场不符','engineering_project_name':'乙工地','inspection_date':'2025年5月'},evidence=[],locator={})]
        self.assertEqual(len(self.run_data(base=b)['records']),2)
    def test_stale_prepared_parse_cannot_claim_new_supplement(self):
        from backend.modules.history_reports.native_supplement import validate_prepared
        expected=self.run_data()
        with patch('backend.modules.history_reports.engine.parse_original',return_value=expected):
            with self.assertRaises(AssertionError):validate_prepared(self.base,self.path,self.item,{'native_supplement_sha256':'current'})
            validate_prepared(copy.deepcopy(expected),self.path,self.item,{'native_supplement_sha256':'current'})

if __name__=='__main__':unittest.main()
