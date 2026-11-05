"""Read-only integration checks against the explicitly configured local history reader."""
import unittest

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.testclient import TestClient
from sqlalchemy import text

from backend.auth import Actor, Problem, current_actor
from backend import history_reader as r


@unittest.skipUnless(r.CONFIG.is_file(), 'Requires the explicitly provisioned local history reader.')
class HistoryReaderTests(unittest.TestCase):
    def setUp(self):
        self.app = FastAPI()
        self.app.include_router(r.router)
        self.app.add_exception_handler(Problem, lambda request, exc: JSONResponse({'message': exc.message}, status_code=exc.status))
        self.actor = Actor('test', 'host:admin:900001', 'Reader test', set(), {}, org_id='fusion-test')
        self.app.dependency_overrides[current_actor] = lambda: self.actor
        self.client = TestClient(self.app)
        self.base = '/api/v1/history-reader'

    def tearDown(self):
        self.client.close()

    def test_database_permissions_and_transaction(self):
        with r.engine().connect() as db:
            self.assertEqual(db.execute(text('SHOW transaction_read_only')).scalar(), 'on')
            self.assertEqual(db.execute(text('SELECT current_user')).scalar(), 'ab_history_reader')
            for table in ('history_documents', 'history_imports', 'history_findings', 'history_evidence', 'history_images',
                          'history_image_occurrences', 'history_image_links', 'file_assets'):
                for permission in ('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE'):
                    self.assertFalse(db.execute(text('SELECT has_table_privilege(current_user,:t,:p)'), {'t': table, 'p': permission}).scalar())

    def test_authorization(self):
        for org, subject in [('fusion-test', 'host:admin:900002'), ('other-org', 'host:admin:900001')]:
            self.actor.org_id, self.actor.subject = org, subject
            self.assertEqual(self.client.get(self.base + '/summary').status_code, 403)

    def test_summary_and_current_version(self):
        summary = self.client.get(self.base + '/summary')
        self.assertEqual(summary.status_code, 200)
        self.assertEqual(len(summary.json()['fields']), 14)
        self.assertGreater(summary.json()['findings'], 40000)
        self.assertNotIn('database_url', summary.text)
        page = self.client.get(self.base + '/findings?limit=2')
        self.assertEqual(page.status_code, 200)
        self.assertEqual(len(page.json()['items']), 2)
        self.assertTrue(page.json()['has_more'])
        item = page.json()['items'][0]
        detail = self.client.get(self.base + '/findings/' + item['id'])
        self.assertEqual(detail.status_code, 200)
        self.assertEqual(len(detail.json()['fields']), 14)
        self.assertGreater(len(detail.json()['evidence']), 0)
        original = self.client.get(self.base + '/documents/' + detail.json()['document_id'] + '/original')
        self.assertEqual(original.status_code, 200)
        self.assertGreater(len(original.content), 0)

    def test_search_empty_and_bounds(self):
        empty = self.client.get(self.base + '/findings', params={'q': 'NO_MATCH_ab_history_reader_8293'})
        self.assertEqual(empty.status_code, 200)
        self.assertEqual(empty.json()['items'], [])
        for query in ['limit=999', 'offset=-1', 'q=' + 'x' * 101]:
            self.assertEqual(self.client.get(self.base + '/findings?' + query).status_code, 422)
        self.assertEqual(self.client.get(self.base + '/findings/not-found').status_code, 404)

    def test_writes_refused(self):
        for method in ('POST', 'PUT', 'PATCH', 'DELETE'):
            self.assertEqual(self.client.request(method, self.base + '/findings', json={}).status_code, 405)

    def test_picture_and_superseded_version(self):
        image = r.rows(r.LATEST + '''SELECT im.id FROM latest l JOIN history_findings f ON f.import_id=l.id
            JOIN history_image_links k ON k.finding_id=f.id JOIN history_image_occurrences o ON o.id=k.occurrence_id
            JOIN history_images im ON im.id=o.image_id LIMIT 1''')[0]
        result = self.client.get(self.base + '/images/' + image['id'])
        self.assertEqual(result.status_code, 200)
        self.assertGreater(len(result.content), 0)
        old = r.rows(r.LATEST + '''SELECT f.id FROM history_findings f JOIN history_imports i ON i.id=f.import_id
            JOIN latest l ON l.document_id=i.document_id WHERE i.id<>l.id LIMIT 1''')[0]
        self.assertEqual(self.client.get(self.base + '/findings/' + old['id']).status_code, 404)

    def test_consolidated_hazard_keeps_multi_report_evidence_and_photos(self):
        items=r.rows('''SELECT id,consolidation_id FROM history_current_consolidated_findings
            WHERE consolidation_id IS NOT NULL AND jsonb_array_length(COALESCE(consolidation->'images','[]'::jsonb))>1 LIMIT 1''')
        if not items:self.skipTest('No reviewed consolidation with multiple photos yet.')
        result=self.client.get(self.base+'/findings/'+items[0]['id']);self.assertEqual(result.status_code,200)
        detail=result.json();self.assertEqual(len(detail['fields']),14)
        self.assertGreaterEqual(len(detail['images']),2);self.assertGreaterEqual(len(detail['sources']),2)
        self.assertTrue(all(e.get('document_id') and e.get('source_sha256') for e in detail['evidence']))
        hidden=r.rows(r.LATEST+'''SELECT f.id FROM history_finding_consolidation_members m
            JOIN latest l ON l.document_id=m.document_id JOIN history_findings f ON f.import_id=l.id AND f.source_key=m.source_key
            WHERE m.group_id=:group AND f.id<>:canonical LIMIT 1''',{'group':items[0]['consolidation_id'],'canonical':items[0]['id']})
        if hidden:self.assertEqual(self.client.get(self.base+'/findings/'+hidden[0]['id']).status_code,404)


if __name__ == '__main__':
    unittest.main()
