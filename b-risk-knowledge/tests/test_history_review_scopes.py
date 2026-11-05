import unittest,tempfile,json,hashlib,copy,gzip
from pathlib import Path
from unittest.mock import patch
from backend.modules.history_reports.reviewed_scope import augment,reconcile_site_issues,converted_source,validate_pdf_scope
from backend.modules.history_reports.review_queue import scan_stage,record_dispositions,effective_fields

class ReviewScopeTests(unittest.TestCase):
    def test_semantic_resolution_preserves_raw_and_rejects_stale_application(self):
        raw={'inspection_date':None,'source_category':'原类别'}
        identity={'field_resolutions':[{'source_key':'one','field':'inspection_date','status':'confirmed',
          'original_value':None,'resolved_value':'2024-01-12','evidence':[{'quote':'2024年1月12日'}],'reason':'同次原报告及图片互证'}]}
        values,review=effective_fields(raw,'one',identity)
        self.assertIsNone(raw['inspection_date']);self.assertEqual(values['inspection_date'],'2024-01-12')
        self.assertEqual(values['source_category'],'原类别');self.assertTrue(review[0]['applicable'])
        changed={'inspection_date':'2024年1月13日'}
        values,review=effective_fields(changed,'one',identity)
        self.assertEqual(values,changed);self.assertFalse(review[0]['applicable'])
        self.assertEqual(effective_fields(raw,'other',identity),(raw,[]))

    def test_crosspage_scope_requires_all_intervening_page_proofs(self):
        from pypdf import PdfWriter
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'original.pdf';preview=Path(tmp)/'page.png';preview.write_bytes(b'reviewed page')
            pdf=PdfWriter()
            for _ in range(3):pdf.add_blank_page(width=600,height=800)
            with p.open('wb') as out:pdf.write(out)
            sha=hashlib.sha256(preview.read_bytes()).hexdigest()
            spec={'method':'pdf_visual_document_scope','review_method':'assistant_visual_readback',
              'preview_path':str(preview),'preview_sha256':sha,'reviewed_pages':[1,2,3],
              'locator':{'physical_page':1,'units':'pt','origin':'top_left','bbox':[1,1,20,20]},
              'record_refs':[{'locator':{'physical_page':3}}],
              'page_previews':[{'physical_page':i,'path':str(preview),'sha256':sha} for i in (1,2,3)],
              'scope_evidence':{'scope_kind':'cross_page_explicit_project_continuation','all_native_pages_reviewed':True,
                'boundary_reason':'项目栏后附连续问题清单','counterexample_check':'逐页未出现其他工程标题',
                'evidence_page':1,'target_pages':[3],'document_pages':3,'visual_reviewed_pages':[1,2,3]}}
            validate_pdf_scope(spec,p)
            bad=copy.deepcopy(spec);bad['scope_evidence']['visual_reviewed_pages']=[1,3]
            with self.assertRaises(AssertionError):validate_pdf_scope(bad,p)
            bad=copy.deepcopy(spec);bad['scope_evidence']['target_pages']=[2]
            with self.assertRaises(AssertionError):validate_pdf_scope(bad,p)
            bad=copy.deepcopy(spec);bad['page_previews'][1]['sha256']='0'*64
            with self.assertRaises(AssertionError):validate_pdf_scope(bad,p)
            bad=copy.deepcopy(spec);bad['method']='pdf_visual_page_scope'
            with self.assertRaises(AssertionError):validate_pdf_scope(bad,p)

    def test_nonproblem_exclusion_requires_explicit_source_identity(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'review.json';sha='a'*64
            data={'source_sha256':sha,'records':[{'source_key':'one','decision':'non_problem_section_heading',
              'analysis_include':False,'evidence':{'source_sha256':sha,'quote':'一、甲标段'}}]}
            with patch('backend.modules.history_reports.review_queue.asset_path',return_value=p):
                self.assertEqual(record_dispositions(sha),{})
                p.write_text(json.dumps(data),encoding='utf-8')
                self.assertEqual(set(record_dispositions(sha)),{'one'})
                with self.assertRaises(AssertionError):record_dispositions('b'*64)
                data['records'][0]['decision']='similar_description'
                p.write_text(json.dumps(data),encoding='utf-8')
                with self.assertRaises(AssertionError):record_dispositions(sha)

    def test_conversion_reuse_requires_both_original_and_derivative_identity(self):
        with tempfile.TemporaryDirectory() as tmp:
            original=Path(tmp)/'original.doc';original.write_bytes(b'original document')
            converted=Path(tmp)/'derived.docx';converted.write_bytes(b'verified converted document')
            sha=hashlib.sha256(original.read_bytes()).hexdigest();sidecar=Path(tmp)/'review.json'
            raw=json.dumps({'source_sha256':sha,'converted_storage_key':f'history/conversions/{sha}/reviewed.docx',
                            'converted_sha256':hashlib.sha256(converted.read_bytes()).hexdigest()}).encode()
            sidecar.write_bytes(raw);ctx={'reviewed_scope_sha256':hashlib.sha256(raw).hexdigest()}
            with patch('backend.modules.history_reports.reviewed_scope.review_path',return_value=sidecar),patch('backend.modules.history_reports.reviewed_scope.asset_path',return_value=converted):
                self.assertEqual(converted_source(original,{'sha256':sha},ctx),converted)
                converted.write_bytes(b'changed derivative')
                with self.assertRaises(AssertionError):converted_source(original,{'sha256':sha},ctx)
                self.assertEqual(original.read_bytes(),b'original document')

    def test_missing_scope_alerts_include_visual_rows_and_are_idempotent(self):
        data={'records':[{'key':'visual','values':{},'locator':{'physical_page':1}},
             {'key':'filled','values':{'engineering_project_name':'甲项目'},'locator':{}}],
          'issues':[{'code':'SITE_SCOPE_UNRESOLVED','record_key':'filled'}],'counts':{},'status':'extracted'}
        result=reconcile_site_issues(data);self.assertEqual(len(result['issues']),1)
        self.assertEqual(result['issues'][0]['record_key'],'visual')
        self.assertEqual(reconcile_site_issues(result)['counts']['issues'],1)

    def test_slide_scope_cannot_leak_to_next_slide_or_change_existing_value(self):
        import zipfile
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'source.pptx';s=Path(tmp)/'review.json'
            xml='<p:sld xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><p:cSld><p:spTree><p:sp><a:t>3.1 甲工地【施工单位】</a:t></p:sp></p:spTree></p:cSld></p:sld>'
            with zipfile.ZipFile(p,'w') as z:z.writestr('ppt/slides/slide4.xml',xml)
            sha=hashlib.sha256(p.read_bytes()).hexdigest();loc={'slide':4,'table':1,'row':2}
            spec={'field_key':'engineering_project_name','quote':'3.1 甲工地【施工单位】','value':'甲工地','span':[4,7],
              'source_label':'章节标题','locator':{'kind':'pptx_shape','slide':4,'shape':1},
              'scope_evidence':{'method':'same_slide_explicit_project_heading','reason':'本页唯一工程标题'},
              'record_refs':[{'source_key':'one','locator':loc}]}
            raw=json.dumps({'source_sha256':sha,'specs':[spec]}).encode();s.write_bytes(raw)
            context={'reviewed_scope_sha256':hashlib.sha256(raw).hexdigest()}
            base={'records':[{'key':'one','values':{},'locator':loc,'evidence':[]}],'issues':[]}
            with patch('backend.modules.history_reports.reviewed_scope.review_path',return_value=s):
                result=augment(copy.deepcopy(base),p,{'sha256':sha},context)
                self.assertEqual(result['records'][0]['values']['engineering_project_name'],'甲工地')
                changed=copy.deepcopy(base);changed['records'][0]['values']['engineering_project_name']='乙工地'
                with self.assertRaises(AssertionError):augment(changed,p,{'sha256':sha},context)
                bad=copy.deepcopy(base);bad['records'][0]['locator']={'slide':5,'table':1,'row':2}
                with self.assertRaises(AssertionError):augment(bad,p,{'sha256':sha},context)

    def test_scan_cache_status_is_not_acceptance_and_wrong_identity_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'1.json.gz';sha='a'*64
            with patch('backend.modules.history_reports.review_queue.asset_path',return_value=p):
                self.assertEqual(scan_stage(sha,1),'not_ocr')
                data={'source_sha256':sha,'physical_page':1,'version':'rapidocr-grid-20261102-v1','lines':['text']}
                with gzip.open(p,'wt',encoding='utf-8') as f:json.dump(data,f)
                self.assertEqual(scan_stage(sha,1),'ocr_ready_for_structure_review')
                data['lines']=[]
                with gzip.open(p,'wt',encoding='utf-8') as f:json.dump(data,f)
                self.assertEqual(scan_stage(sha,1),'no_text_needs_page_type_check')
                self.assertEqual(scan_stage(sha,2),'ocr_cache_invalid')
if __name__=='__main__':unittest.main()
