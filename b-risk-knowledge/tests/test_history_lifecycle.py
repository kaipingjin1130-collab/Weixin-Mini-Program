import unittest,tempfile,json,hashlib,copy
from pathlib import Path
from unittest.mock import patch
from types import SimpleNamespace
from backend.modules.history_reports.lifecycle import validate_mapping,deletion_info,removed_receipt,business_gaps

class LifecycleTests(unittest.TestCase):
    def test_reply_filename_requires_exact_printed_inspection_reference(self):
        from backend.modules.history_reports.visual_supplement import validate_filename_date
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'page.png';p.write_bytes(b'checked-preview')
            sha='a'*64;name='20251205-整改回复.pdf'
            e={'source_kind':'filename','field_key':'inspection_date','method':'reviewed_filename_date','quote':name,
               'locator':{'kind':'original_filename','filename':name},'value':'20251205','details':{
                   'span':[0,8],'precision':'day','role':'inspection_date','role_reviewed':True,'role_reason':'正文明确本次检查'}}
            item={'sha256':sha,'original_name':name}
            with self.assertRaises(AssertionError):validate_filename_date(e,item,'record')
            proof={'source_kind':'report','source_sha256':sha,'review_method':'assistant_visual_readback',
                'semantic_role':'explicit_original_inspection_reference','physical_page':1,'source_keys':['record'],
                'quote':'我方接到12月5日检查整改单后，已按要求完成相关工作。','preview_path':str(p),
                'preview_sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
            e['details']['report_role_evidence']=proof
            validate_filename_date(e,item,'record')
            with self.assertRaises(AssertionError):validate_filename_date(e,item,'unreviewed-record')
            for field,value in [('quote','我方于12月5日完成整改。'),('quote','我方接到12月4日检查整改单后'),
                                ('source_sha256','b'*64),('preview_sha256','0'*64)]:
                altered=copy.deepcopy(e);altered['details']['report_role_evidence'][field]=value
                with self.assertRaises(AssertionError):validate_filename_date(altered,item,'record')
    def test_category_suffix_is_covered_only_by_the_actual_category_field(self):
        source={'problem_description':'角磨机防护罩缺失。（施工机具）','source_category':None}
        target={'problem_description':'角磨机防护罩缺失。','source_category':'施工机具'}
        self.assertEqual(business_gaps(source,target),[])
        target['source_category']='消防安全'
        self.assertEqual(business_gaps(source,target),['problem_description'])
    def test_removed_row_cannot_reappear_and_new_evidence_requires_review(self):
        from backend.modules.history_reports.record_removals import filter_result
        base={'records':[{'key':'remove','values':{'problem_description':'问题甲'},'locator':{'row':1}},
                         {'key':'keep','values':{'problem_description':'问题乙'},'locator':{'row':2}}],
              'issues':[{'code':'SITE_SCOPE_UNRESOLVED','record_key':'remove'}],'counts':{}}
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'policy.json';sha='a'*64
            p.write_text(json.dumps({'source_sha256':sha,'records':[{'source_key':'remove','source_locator':{'row':1},
                'source_fields_snapshot':{'problem_description':'问题甲'}}]}),encoding='utf-8')
            ctx={'record_removals_sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
            with patch('backend.modules.history_reports.record_removals.removal_path',return_value=p):
                result=filter_result(copy.deepcopy(base),{'sha256':sha},ctx)
                self.assertEqual([r['key'] for r in result['records']],['keep']);self.assertEqual(result['issues'],[])
                changed=copy.deepcopy(base);changed['records'][0]['values']['problem_description']='新原文'
                with self.assertRaises(AssertionError):filter_result(changed,{'sha256':sha},ctx)

    def test_near_description_does_not_erase_grade_number_or_response(self):
        a={'problem_description':'钢丝绳 11.5mm。（大型机械）','source_grade':'★★','reported_response':'已整改'}
        b={'problem_description':'钢丝绳11.5mm（大型机械）','source_grade':'★','reported_response':None}
        self.assertEqual(business_gaps(a,b),['source_grade','reported_response'])
        b['problem_description']='钢丝绳11.25mm（大型机械）'
        self.assertIn('problem_description',business_gaps(a,b))
    def test_requires_every_source_row_and_one_to_one_target(self):
        good=[{'source_key':'a','canonical_source_key':'x'},{'source_key':'b','canonical_source_key':'y'}]
        validate_mapping({'a','b'},{'x','y','z'},good)
        for bad in (good[:1],[good[0],good[0]],[good[0],{'source_key':'b','canonical_source_key':'x'}],
                    [good[0],{'source_key':'b','canonical_source_key':'unknown'}]):
            with self.assertRaises(AssertionError):validate_mapping({'a','b'},{'x','y','z'},bad)

    def test_removed_current_version_has_zero_rows_and_points_elsewhere(self):
        run=SimpleNamespace(id='r',document_id='source',status='merged_duplicate',counts={'findings':0,'removed_findings':10},
            context={'duplicate_deletion':{'canonical_document_id':'target'}})
        self.assertEqual(deletion_info(run)['canonical_document_id'],'target')
        self.assertTrue(removed_receipt(run)['reused'])
        run.counts['findings']=1
        with self.assertRaises(AssertionError):deletion_info(run)
        run.status='extracted';self.assertIsNone(removed_receipt(run))
        self.assertIsNone(deletion_info(None))
