import unittest
from backend.modules.history_reports.consolidation import choose_fields,view_sql

class ConsolidationTests(unittest.TestCase):
    def test_complementary_fields_and_original_category_variants(self):
        values={'a':{'problem_description':'脚手架缺少防护。','source_category':'安全'},
                'b':{'problem_description':'东侧脚手架作业层缺少防护栏杆。','source_category':'脚手架','reported_response':'已增设防护栏杆。'}}
        evidence={key:[{'field_key':k,'quote':v,'document_id':key} for k,v in fields.items()] for key,fields in values.items()}
        fields,variants,proofs=choose_fields('a',values,evidence)
        self.assertEqual(len(fields),14);self.assertEqual(fields['source_category'],'安全')
        self.assertEqual(fields['problem_description'],values['b']['problem_description'])
        self.assertEqual(fields['reported_response'],'已增设防护栏杆。');self.assertIsNone(fields['hazard_category'])
        self.assertEqual([v['value'] for v in variants['source_category']],['安全','脚手架'])
        self.assertEqual(len(proofs),5)

    def test_no_fill_without_original_evidence(self):
        with self.assertRaises(AssertionError):choose_fields('a',{'a':{'problem_description':'问题'}},{'a':[]})

    def test_query_does_not_hide_changed_or_missing_members(self):
        from backend.db import engine
        from sqlalchemy import text,inspect
        if not inspect(engine).has_table('history_finding_consolidations'):self.skipTest('No local consolidation schema.')
        with engine.connect() as db:
            tx=db.begin()
            try:
                group=db.execute(text('SELECT consolidation_id FROM history_current_consolidated_findings WHERE consolidation_id IS NOT NULL LIMIT 1')).scalar()
                if not group:self.skipTest('No reviewed groups.')
                total=db.execute(text('SELECT count(*) FROM history_finding_consolidation_members WHERE group_id=:g'),{'g':group}).scalar()
                db.execute(text("UPDATE history_finding_consolidation_members SET expected_fields=jsonb_set(expected_fields,'{problem_description}',to_jsonb('test-stale-snapshot'::text)) WHERE group_id=:g"),{'g':group})
                self.assertEqual(db.execute(text('SELECT count(*) FROM history_current_consolidated_findings WHERE consolidation_id=:g'),{'g':group}).scalar(),0)
                self.assertEqual(db.execute(text('''SELECT count(*) FROM history_current_consolidated_findings v
                    JOIN history_finding_consolidation_members m ON m.document_id=v.document_id AND m.source_key=v.source_key WHERE m.group_id=:g'''),{'g':group}).scalar(),total)
            finally:tx.rollback()

if __name__=='__main__':unittest.main()
