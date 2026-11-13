"""Regression tests for real template assets and optional/repeated data slots."""
import io
from pathlib import Path
import sys
import unittest
import zipfile
from xml.dom import minidom

sys.path.insert(0, str(Path(__file__).resolve().parents[1]/'candidate'))
import notice_docx as n

class NoticeTemplateTests(unittest.TestCase):
    def export(self, report):
        return zipfile.ZipFile(io.BytesIO(n.render(report, lambda mid: (b'image-'+mid.encode(), 'image/png'), lambda data: (300, 600))))

    def test_preserves_header_logo_styles_and_table_geometry(self):
        with self.export({'notice':{'noticeNumber':'20260922-三林项目-06'}}) as result, zipfile.ZipFile(n.TEMPLATE) as template:
            for part in ['word/header1.xml','word/_rels/header1.xml.rels','word/media/image1.png','word/styles.xml','word/theme/theme1.xml','word/fontTable.xml']:
                self.assertEqual(result.read(part),template.read(part),part)
            a=minidom.parseString(result.read('word/document.xml'));b=minidom.parseString(template.read('word/document.xml'))
            self.assertEqual(n.nodes(a, 'w:sectPr')[0].toxml(), n.nodes(b, 'w:sectPr')[0].toxml())
            n.center_report_tables(b)
            for tag in ['w:sectPr','w:tblGrid','w:tblPr','w:tcPr']:
                self.assertEqual([e.toxml() for e in n.nodes(a,tag)],[e.toxml() for e in n.nodes(b,tag)])
            xml=result.read('word/document.xml').decode()
            self.assertIn('20260922-三林项目-06',xml);self.assertIn('C9C9C9',xml)
            self.assertNotIn('{{',xml)

    def test_tables_center_with_equal_width_inside_page_margins(self):
        with self.export({'issues': [{'description': '隐患', 'photos': []}]}) as result:
            doc = minidom.parseString(result.read('word/document.xml'))
            for table in n.nodes(doc, 'w:tbl'):
                props = n.children(table, 'w:tblPr')[0]
                self.assertEqual(n.children(props, 'w:jc')[0].getAttribute('w:val'), 'center')
                self.assertFalse(n.children(props, 'w:tblInd'))
                self.assertEqual(n.children(props, 'w:tblW')[0].getAttribute('w:w'), '8306')
                self.assertEqual(sum(int(c.getAttribute('w:w')) for c in n.nodes(table, 'w:gridCol')), 8306)
                for row in n.children(table, 'w:tr'):
                    self.assertEqual(sum(int(n.nodes(cell, 'w:tcW')[0].getAttribute('w:w'))
                                         for cell in n.children(row, 'w:tc')), 8306)

    def test_no_reference_data_or_photos_leak(self):
        with self.export({}) as result:
            xml=result.read('word/document.xml').decode()
            for value in ['曾雄伟','上海地产','地下车库','20260922','未发现隐患']:
                self.assertNotIn(value,xml)
            self.assertEqual([p for p in result.namelist() if p.startswith('word/media/')],['word/media/image1.png'])
            self.assertFalse(any(p.startswith(('customXml/','docProps/')) for p in result.namelist()))

    def test_issues_photos_signatures_and_escaping(self):
        report={'notice':{'projectName':'项目<&>','subject':'多行\n事由'},'issues':[
            {'description':'第一条<&>','category':'消防','photos':['a','b']},
            {'description':'第二条','photos':[]}], 'signatures':[{'name':'检查员','signature':'sig'}]}
        with self.export(report) as result:
            d=minidom.parseString(result.read('word/document.xml'));xml=d.toxml()
            self.assertIn('第一条&lt;&amp;&gt;',xml);self.assertIn('（消防）',xml)
            self.assertEqual(len(n.children(n.nodes(d,'w:tbl')[1],'w:tr')),3)
            self.assertEqual(len(n.nodes(d,'w:drawing')),3)
            self.assertGreaterEqual(len(n.nodes(d,'w:br')),2) # subject newline plus appendix page break
            self.assertEqual(len([p for p in result.namelist() if 'notice-photo-' in p]),3)
            self.assertEqual(len(n.nodes(d,'w:tblHeader')),1)
            self.assertNotIn('{{',xml)

    def test_inline_images_expand_lines_without_changing_image_bytes_or_aspect_ratio(self):
        for report in [
            {'signatures': [{'signature': 'sig'}], 'issues': [{'description': '照片', 'photos': ['photo']}]},
            {'combined': True, 'signatures': [{'signature': 'sig'}],
             'recipientSignature': {'signature': 'recipient', 'name': '负责人', 'signedAt': '2026-11-13'}}
        ]:
            with self.subTest(combined=report.get('combined', False)), self.export(report) as result:
                doc = minidom.parseString(result.read('word/document.xml'))
                drawings = n.nodes(doc, 'w:drawing')
                self.assertGreater(len(drawings), 0)
                for drawing in drawings:
                    paragraph = drawing.parentNode.parentNode
                    spacing = n.nodes(paragraph, 'w:spacing')[0]
                    self.assertEqual(spacing.getAttribute('w:lineRule'), 'auto')
                    self.assertEqual(n.nodes(paragraph, 'w:snapToGrid')[0].getAttribute('w:val'), '0')
                    extent = n.nodes(drawing, 'wp:extent')[0]
                    self.assertEqual(int(extent.getAttribute('cy')), 2 * int(extent.getAttribute('cx')))
                    rid = n.nodes(drawing, 'a:blip')[0].getAttribute('r:embed')
                    rels = minidom.parseString(result.read('word/_rels/document.xml.rels'))
                    rel = next(r for r in n.nodes(rels, 'Relationship') if r.getAttribute('Id') == rid)
                    self.assertTrue(result.read('word/' + rel.getAttribute('Target')).startswith(b'image-'))
                row = n.children(n.nodes(doc, 'w:tbl')[0], 'w:tr')[7]
                self.assertEqual(n.nodes(row, 'w:trHeight')[0].getAttribute('w:hRule'), 'atLeast')

    def test_many_issues_and_explicit_no_hazard(self):
        with self.export({'issues':[{'description':'长内容'*100,'photos':[]} for _ in range(100)]}) as result:
            d=minidom.parseString(result.read('word/document.xml'))
            self.assertEqual(len(n.children(n.nodes(d,'w:tbl')[1],'w:tr')),101)
        with self.export({'noHazard':True}) as result:
            self.assertIn('本次在上述检查范围内未发现隐患',result.read('word/document.xml').decode())

if __name__=='__main__':unittest.main()
