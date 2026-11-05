import copy,hashlib,json,tempfile,unittest,zipfile
from pathlib import Path
from unittest.mock import patch
from backend.modules.history_reports.external_supplement import augment,validate_data,validate_prepared
from backend.modules.report_parsing.fields import FIELDS
from backend.modules.history_reports.service import validate_result

class ExternalReviewTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup);self.root=Path(self.tmp.name)
        p=self.root/'reference.docx'
        with zipfile.ZipFile(p,'w') as z:z.writestr('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>一号楼防护缺失</w:t></w:r></w:p></w:body></w:document>')
        self.sha=hashlib.sha256(p.read_bytes()).hexdigest();(self.root/'preview.png').write_bytes(b'preview-test')
        self.psha=hashlib.sha256(b'preview-test').hexdigest();self.side=self.root/'accepted.json'
        self.item={'sha256':self.sha};self.base={'records':[],'issues':[{'code':'PAGE_NEEDS_OCR','locator':{'physical_page':1}},{'code':'PAGE_NEEDS_OCR','locator':{'physical_page':2}}],'counts':{}}
        v=dict.fromkeys(FIELDS);v['problem_description']='一号楼防护缺失'
        e=dict(field_key='problem_description',value=v['problem_description'],quote=v['problem_description'],source_kind='report',method='central_external_readback',locator=dict(document_id='ref',kind='docx_paragraph',part='word/document.xml',paragraph=1),details=dict(source_document_id='ref',source_sha256=self.sha,user_confirmation=False,external_package_id='WP-test',value_span=[0,7],value_segment=v['problem_description'],span=[0,7],preview_storage_key='preview.png',preview_sha256=self.psha))
        rec=dict(key='stable-key',external_record_id='R1',central_decision='accepted',values=v,evidence=[e],locator={'physical_page':1})
        self.data=dict(schema_version=1,source_sha256=self.sha,review_method='central_original_readback',user_confirmation=False,acceptance={'decision_sha256':'a'*64,'archive_sha256':'b'*64,'package_id':'WP-test'},sources={'ref':{'sha256':self.sha,'storage_key':'reference.docx'}},records=[rec],reviewed_pages=[1,2],fully_reviewed_pages=[1],page_acceptances=[{'physical_page':1,'central_decision':'accepted','preview_storage_key':'preview.png','preview_sha256':self.psha}])
        p=patch('backend.modules.history_reports.external_supplement.asset_path',side_effect=lambda key:self.root/key);p.start();self.addCleanup(p.stop)
        p=patch('backend.modules.history_reports.external_supplement.supplement_path',return_value=self.side);p.start();self.addCleanup(p.stop)
    def run_data(self,d=None):
        self.side.write_text(json.dumps(d or self.data,ensure_ascii=False),encoding='utf-8')
        return augment(copy.deepcopy(self.base),self.root/'reference.docx',self.item,{'external_supplement_sha256':hashlib.sha256(self.side.read_bytes()).hexdigest()})
    def test_accept_original_reference_only_close_finished_page(self):
        r=self.run_data();validate_result(r)
        self.assertEqual([i['locator']['physical_page'] for i in r['issues']],[2])
        self.assertEqual(r['records'][0]['evidence'][0]['locator']['document_id'],'ref')
        self.assertEqual(r['records'][0]['review_state'],'ai_external_checked')
    def test_forged_quote_rejected_even_with_matching_value(self):
        d=copy.deepcopy(self.data);r=d['records'][0];r['values']['problem_description']='一号楼防护完好';e=r['evidence'][0];e.update(quote='一号楼防护完好',value='一号楼防护完好');e['details']['value_segment']='一号楼防护完好'
        with self.assertRaises(AssertionError):self.run_data(d)
    def test_original_and_preview_changes_rejected(self):
        for name in ['reference.docx','preview.png']:
            p=self.root/name;old=p.read_bytes();p.write_bytes(old+b'changed')
            with self.subTest(name=name),self.assertRaises(AssertionError):self.run_data()
            p.write_bytes(old)
    def test_partial_value_coverage_rejected(self):
        d=copy.deepcopy(self.data);d['records'][0]['values']['problem_description']+='且未整改'
        with self.assertRaises(AssertionError):self.run_data(d)
    def test_unknown_synonym_and_standard_category_rejected(self):
        for k in ['问题内容','hazard_category']:
            d=copy.deepcopy(self.data);d['records'][0]['values'][k]='安全'
            with self.subTest(k=k),self.assertRaises(AssertionError):self.run_data(d)
    def test_no_bulk_close_without_actual_page_acceptance(self):
        d=copy.deepcopy(self.data);d['fully_reviewed_pages']=[1,2]
        with self.assertRaises(AssertionError):self.run_data(d)
    def test_no_overwrite_or_repeat_duplicates(self):
        one=self.run_data();two=self.run_data();self.assertEqual(one,two)
        d=copy.deepcopy(self.data);d['records'].append(copy.deepcopy(d['records'][0]))
        with self.assertRaises(AssertionError):self.run_data(d)
        self.base['records']=copy.deepcopy(one['records'])
        with self.assertRaises(AssertionError):self.run_data()
    def test_missing_and_stale_sidecar_blocked(self):
        with self.assertRaises(AssertionError):augment(copy.deepcopy(self.base),self.root/'reference.docx',self.item,{'external_supplement_sha256':'a'*64})
        expected=self.run_data()
        with patch('backend.modules.history_reports.engine.parse_original',return_value=expected):
            with self.assertRaises(AssertionError):validate_prepared(self.base,None,self.item,{'external_supplement_sha256':'a'*64})
            validate_prepared(expected,None,self.item,{'external_supplement_sha256':'a'*64})

    def test_sparse_original_backed_fill_and_reparse(self):
        d=copy.deepcopy(self.data);r=d['records'].pop();self.base['records']=[r]
        e=copy.deepcopy(r['evidence'][0]);e['field_key']='reported_response'
        d['field_additions']=[dict(source_key=r['key'],values={'reported_response':e['value']},expected_fields={'reported_response':None},reason='原文逐字核对',central_decision='accepted',evidence=[e])]
        first=self.run_data(d);second=self.run_data(d)
        self.assertEqual(first,second)
        self.assertEqual(first['records'][0]['values']['reported_response'],'一号楼防护缺失')
        self.base['records'][0]['values']['reported_response']='已有确认'
        with self.assertRaises(AssertionError):self.run_data(d)

    def test_sparse_fill_rejects_category_missing_target_and_uncovered_value(self):
        for field in ['source_category','hazard_category','reported_response']:
            d=copy.deepcopy(self.data)
            d['field_additions']=[dict(source_key='missing',values={field:'新值'},expected_fields={field:None},reason='test',central_decision='accepted',evidence=[])]
            with self.subTest(field=field),self.assertRaises(AssertionError):self.run_data(d)

    def scope_data(self):
        from pypdf import PdfWriter
        writer=PdfWriter();writer.add_blank_page(612,792);writer.add_blank_page(612,792)
        path=self.root/'contract.pdf'
        with path.open('wb') as stream:writer.write(stream)
        sha=hashlib.sha256(path.read_bytes()).hexdigest();self.item={'sha256':sha}
        d=copy.deepcopy(self.data);d.update(source_sha256=sha,sources={'ref':{'sha256':sha,'storage_key':'contract.pdf'}},records=[],reviewed_pages=[],fully_reviewed_pages=[],page_acceptances=[])
        d['scope_exclusion']=dict(document_id='ref',source_sha256=sha,decision='exclude_from_hazard_review',decision_source='current_user_confirmation',user_confirmation=True,document_kind='contract',user_statement='合同、协议不含检查记录',pages=[1,2])
        return d

    def test_user_scope_exclusion_not_visual_acceptance(self):
        d=self.scope_data();d['acceptance'].pop('archive_sha256');d['acceptance']['input_sha256']='c'*64
        result=self.run_data(d)
        self.assertFalse(result['records'])
        self.assertEqual([i['code'] for i in result['issues']],['NON_INSPECTION_DOCUMENT'])
        self.assertEqual(result['issues'][0]['details']['decision_source'],'current_user_confirmation')

    def test_scope_exclusion_requires_user_identity_and_no_findings(self):
        for change in ('user_confirmation','pages','document_kind','existing_record'):
            d=self.scope_data()
            if change=='user_confirmation':d['scope_exclusion'][change]=False
            elif change=='pages':d['scope_exclusion'][change]=[1]
            elif change=='document_kind':d['scope_exclusion'][change]='inspection_report'
            else:self.base['records']=[copy.deepcopy(self.data['records'][0])]
            with self.subTest(change=change),self.assertRaises(AssertionError):self.run_data(d)

    def test_additional_original_source_preserves_values_and_requires_exact_target(self):
        d=copy.deepcopy(self.data);r=d['records'].pop();self.base['records']=[r]
        e=copy.deepcopy(r['evidence'][0]);e['method']='central_additional_original_source'
        d['evidence_additions']=[dict(source_key=r['key'],action='attach_additional_original_source',central_decision='accepted',expected_fields={'problem_description':r['values']['problem_description']},evidence=[e],reason='同一检查事件原件对应')]
        result=self.run_data(d)
        self.assertEqual(result['records'][0]['values'],r['values']);self.assertEqual(len(result['records'][0]['evidence']),2)
        self.assertEqual(result,self.run_data(d))
        self.base['records'][0]['values']['problem_description']='另一个部位的问题'
        with self.assertRaises(AssertionError):self.run_data(d)

if __name__=='__main__':unittest.main()
