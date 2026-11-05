import unittest,tempfile,hashlib,copy
from pathlib import Path
from types import SimpleNamespace
from backend.modules.history_reports.reviewed_photos import validate_region
from backend.modules.history_reports.media import relation

class ReviewedPhotoTests(unittest.TestCase):
    def test_report_only_media_does_not_gain_a_link_after_new_parse(self):
        record=SimpleNamespace(source_key='new-row',locator={'physical_page':2,'bbox':[0,0,600,800]})
        image={'allow_row_link':True,'locator':{'physical_page':2,'bbox':[50,50,200,200],'association':'unlinked'}}
        self.assertIsNone(relation(image,record))
        image['locator'].pop('association');image['locator']['kind']='reviewed_unlinked_region'
        self.assertIsNone(relation(image,record))

    def test_cross_report_problem_keeps_explicit_reviewed_photo_link(self):
        record=SimpleNamespace(source_key='reply-row',locator={'physical_page':1,'bbox':[0,0,600,300]})
        image={'allow_row_link':True,'locator':{'kind':'reviewed_photo_region','physical_page':4,'bbox':[50,50,200,200],
            'review_method':'assistant_visual_readback','source_problem_evidence':[],
            'association_method':'confirmed_continuous_row','association_evidence':[{'quote':'问题3整改后照片'}],
            'reviewed_finding_source_key':'reply-row'}}
        self.assertEqual(relation(image,record),'reviewed_same_problem_photo')
        record.source_key='another-row';self.assertIsNone(relation(image,record))
        record.source_key='reply-row';image['locator']['association_method']='similar_image';self.assertIsNone(relation(image,record))

    def test_photo_requires_same_report_reviewed_page_and_bounded_region(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'page.png';p.write_bytes(b'original-page-preview');sha='a'*64
            photo={'source_sha256':sha,'review_method':'assistant_visual_readback','preview_path':str(p),
                'preview_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),
                'locator':{'kind':'pdf_region','physical_page':2,'bbox':[20,30,80,90],'units':'pt','origin':'top_left'}}
            self.assertEqual(validate_region(photo,sha,(600,800),{2}),[20,30,80,90])
            for box in ([0,0,600,800],[-1,0,20,20],[0,0,601,40],[20,20,10,30],[0,0,float('nan'),20]):
                wrong=copy.deepcopy(photo);wrong['locator']['bbox']=box
                with self.assertRaises(AssertionError):validate_region(wrong,sha,(600,800),{2})
            with self.assertRaises(AssertionError):validate_region(photo,'b'*64,(600,800),{2})
            with self.assertRaises(AssertionError):validate_region(photo,sha,(600,800),{1})
            p.write_bytes(b'changed')
            with self.assertRaises(AssertionError):validate_region(photo,sha,(600,800),{2})

    def test_cross_page_photo_follows_only_exact_reviewed_finding(self):
        image={'allow_row_link':True,'locator':{'kind':'reviewed_photo_region','physical_page':5,'bbox':[20,40,80,90],
            'review_method':'assistant_visual_readback','source_problem_evidence':[{'quote':'问题1'}],'reviewed_finding_source_key':'row-one'}}
        record=SimpleNamespace(source_key='row-one',locator={'physical_page':1,'bbox':[0,0,600,30]})
        self.assertEqual(relation(image,record),'reviewed_same_problem_photo')
        record.source_key='row-two';self.assertIsNone(relation(image,record))
        record.source_key='row-one';image['locator']['source_problem_evidence']=[];self.assertIsNone(relation(image,record))
        image['locator'].update(kind='consolidated_photo_region',physical_page=1,bbox=[0,0,600,30])
        self.assertIsNone(relation(image,record))

    def test_numbered_photo_attachment_needs_source_specific_association(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'page.png';p.write_bytes(b'original-preview');sha='a'*64;h=hashlib.sha256(p.read_bytes()).hexdigest()
            loc={'kind':'pdf_region','physical_page':2,'bbox':[20,30,80,90],'units':'pt','origin':'top_left'}
            photo={'source_sha256':sha,'review_method':'assistant_visual_readback','preview_path':str(p),'preview_sha256':h,'locator':loc}
            record={'key':'one','locator':{'original_problem_number':'1'}}
            proof={'source_sha256':sha,'canonical_source_key':'one','photo':photo,'reason':'Printed attachment number matches row 1.',
                'status':'confirmed_numbered_attachment','original_problem_number':'1','association_evidence':[
                    {'source_sha256':sha,'review_method':'assistant_visual_readback','locator':loc,'quote':'附件1','value':'附件1','span':[0,3],'preview_path':str(p),'preview_sha256':h}]}
            self.assertEqual(validate_region(photo,sha,(600,800),{1},proof,record),[20,30,80,90])
            for field,value in [('canonical_source_key','two'),('original_problem_number','2'),('status','similar_photo')]:
                bad=copy.deepcopy(proof);bad[field]=value
                with self.assertRaises(AssertionError):validate_region(photo,sha,(600,800),{1},bad,record)

    def test_unnumbered_continuation_requires_all_intermediate_page_reviews(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/'page.png';p.write_bytes(b'preview');sha='a'*64;h=hashlib.sha256(p.read_bytes()).hexdigest()
            loc={'kind':'pdf_region','physical_page':3,'bbox':[20,30,80,90],'units':'pt','origin':'top_left'}
            photo={'source_sha256':sha,'review_method':'assistant_visual_readback','preview_path':str(p),'preview_sha256':h,'locator':loc}
            record={'key':'one','locator':{'original_problem_number':'9'}}
            proof={'source_sha256':sha,'canonical_source_key':'one','photo':photo,'reason':'Continuous final attachment',
                'status':'confirmed_continuous_row','original_problem_number':'9','association_evidence':[
                    {'source_sha256':sha,'review_method':'assistant_visual_readback','locator':{**loc,'physical_page':2},'quote':'9','value':'9','span':[0,1],'preview_path':str(p),'preview_sha256':h}],
                'scope_evidence':{'scope_kind':'same_report_explicit_number_or_continuous_row','target_pages':[3],'problem_page':1,'visual_reviewed_pages':[1,2,3],'boundary_reason':'Final row continues','counterexample_check':'No new number or site'},
                'page_previews':[{'physical_page':n,'path':str(p),'sha256':h} for n in [1,2,3]]}
            self.assertEqual(validate_region(photo,sha,(600,800),{1},proof,record),[20,30,80,90])
            proof['page_previews'].pop(1)
            with self.assertRaises(AssertionError):validate_region(photo,sha,(600,800),{1},proof,record)

if __name__=='__main__':unittest.main()
