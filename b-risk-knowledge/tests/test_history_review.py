"""人工核验修改入口：列表/筛选/草稿/批量确认/日志（本地解析成果库，用后恢复原值）。"""
import unittest

from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.testclient import TestClient

from backend.auth import Actor, Problem, current_actor
from backend import history_review as r


@unittest.skipUnless(r.CONFIG.is_file(), 'Requires the explicitly configured local history review writer.')
class HistoryReviewTests(unittest.TestCase):
    def setUp(self):
        self.app = FastAPI()
        self.app.include_router(r.router)
        self.app.add_exception_handler(Problem, lambda request, exc: JSONResponse({'message': exc.message}, status_code=exc.status))
        self.actor = Actor('test', 'host:admin:900001', 'Review test', set(), {}, org_id='fusion-test')
        self.app.dependency_overrides[current_actor] = lambda: self.actor
        self.client = TestClient(self.app)
        self.base = '/api/v1/history-review'
        page = self.client.get(self.base + '/findings', params={'limit': 5}).json()
        self.assertGreaterEqual(len(page['items']), 1)
        self.item = page['items'][0]

    def tearDown(self):
        self.client.close()

    def test_summary_projects_and_filters(self):
        summary = self.client.get(self.base + '/summary')
        self.assertEqual(summary.status_code, 200)
        data = summary.json()
        self.assertGreater(data['findings'], 40000)
        self.assertGreater(data['reports'], 1000)
        self.assertEqual(len(data['editable_fields']), 14)
        self.assertNotIn('database_url', summary.text)
        projects = self.client.get(self.base + '/projects', params={'limit': 5}).json()['items']
        self.assertTrue(projects)
        filtered = self.client.get(self.base + '/findings', params={'project': projects[0]['name'], 'limit': 3}).json()
        self.assertTrue(all((x['engineering_project_name'] or x['project_name']) == projects[0]['name'] for x in filtered['items']))
        reports = self.client.get(self.base + '/reports', params={'limit': 3}).json()['items']
        self.assertTrue(reports)
        detail = self.client.get(self.base + '/reports/' + reports[0]['document_id'] + '/findings')
        self.assertEqual(detail.status_code, 200)
        self.assertGreaterEqual(len(detail.json()['items']), 1)

    def test_authorization(self):
        for org, subject in [('fusion-test', 'host:admin:900002'), ('other-org', 'host:admin:900001')]:
            self.actor.org_id, self.actor.subject = org, subject
            self.assertEqual(self.client.get(self.base + '/summary').status_code, 403)
        self.actor.org_id, self.actor.subject = 'fusion-test', 'host:admin:900001'

    def test_draft_then_discard_keeps_database(self):
        before = self.client.get(self.base + '/findings', params={'document_id': self.item['document_id'], 'limit': 100}).json()['items']
        row = next(x for x in before if x['id'] == self.item['id'])
        draft = self.client.post(self.base + '/drafts', json={'finding_id': self.item['id'], 'changes': {'inspection_location': '联调测试-位置'}})
        self.assertEqual(draft.status_code, 200, draft.text)
        draft_id = draft.json()['draft_id']
        pending = self.client.get(self.base + '/drafts').json()['items']
        self.assertTrue(any(d['id'] == draft_id for d in pending))
        self.assertEqual(self.client.post(self.base + '/drafts/discard', json={'ids': [draft_id]}).status_code, 200)
        after = self.client.get(self.base + '/findings', params={'document_id': self.item['document_id'], 'limit': 100}).json()['items']
        self.assertEqual(next(x for x in after if x['id'] == self.item['id'])['inspection_location'], row['inspection_location'])

    def test_confirm_overwrites_and_logs_then_restores(self):
        original = self.item['reported_response']
        draft = self.client.post(self.base + '/drafts', json={'finding_id': self.item['id'], 'changes': {'reported_response': '联调测试-回复待确认'}})
        self.assertEqual(draft.status_code, 200, draft.text)
        result = self.client.post(self.base + '/drafts/confirm', json={'ids': [draft.json()['draft_id']]})
        self.assertEqual(result.status_code, 200)
        self.assertEqual(len(result.json()['applied']), 1)
        changed = self.client.get(self.base + '/findings', params={'document_id': self.item['document_id'], 'limit': 100}).json()['items']
        self.assertEqual(next(x for x in changed if x['id'] == self.item['id'])['reported_response'], '联调测试-回复待确认')
        logs = self.client.get(self.base + '/logs', params={'finding_id': self.item['id'], 'limit': 20}).json()['items']
        self.assertTrue(any(log['action'] == 'confirm' for log in logs))
        restore = self.client.post(self.base + '/drafts', json={'finding_id': self.item['id'], 'changes': {'reported_response': original}})
        self.client.post(self.base + '/drafts/confirm', json={'ids': [restore.json()['draft_id']]})
        restored = self.client.get(self.base + '/findings', params={'document_id': self.item['document_id'], 'limit': 100}).json()['items']
        self.assertEqual(next(x for x in restored if x['id'] == self.item['id'])['reported_response'], original)

    def test_confirm_detects_value_conflict(self):
        current = self.client.get(self.base + '/findings', params={'document_id': self.item['document_id'], 'limit': 100}).json()['items']
        row = next(x for x in current if x['id'] == self.item['id'])
        draft = self.client.post(self.base + '/drafts', json={'finding_id': self.item['id'], 'changes': {'inspection_location': '联调测试-并发A'}})
        draft_id = draft.json()['draft_id']
        # 直接改库模拟他人先改（使用同一写连接），再确认应报冲突且不改回。
        with r.engine().begin() as connection:
            connection.execute(r.text("UPDATE history_findings SET inspection_location=:v WHERE id=:i"),
                               {'v': '联调测试-并发B', 'i': self.item['id']})
        try:
            result = self.client.post(self.base + '/drafts/confirm', json={'ids': [draft_id]}).json()
            self.assertEqual(len(result['applied']), 0)
            self.assertEqual(result['conflicts'][0]['reason'], 'value_changed_since_draft')
        finally:
            with r.engine().begin() as connection:
                connection.execute(r.text("UPDATE history_findings SET inspection_location=:v WHERE id=:i"),
                                   {'v': row['inspection_location'], 'i': self.item['id']})
