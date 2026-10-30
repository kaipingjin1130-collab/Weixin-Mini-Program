import base64
import io
import json
import sys
import unittest
import uuid
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import test_integration as integration
s = integration.s


class LeaderReports(unittest.TestCase):
    tearDown = integration.Integration.tearDown
    request = integration.Integration.request
    login = integration.Integration.login
    def setUp(self):
        integration.Integration.setUp(self)
        def bridge(action, data=None, cookie=''):
            data = data or {}
            uid = data.get('id') or {'owner':'host:admin:7', 'lead':'host:admin:8', 'worker':'host:admin:9', 'other':'host:admin:10'}.get(data.get('username'), 'host:admin:8')
            return dict(active=True, aud='qaxc', id=uid, name=uid, isAdmin=uid=='host:admin:7')
        s.host_auth.call.side_effect = bridge
        self.owner = self.login()[0]
        self.lead = self.login('lead')[0]
        self.worker = self.login('worker')[0]
        self.other = self.login('other')[0]
        self.pid = self.request('/quality/api/projects', dict(name='汇总测试项目', contract='测试合同'), self.owner)[1]['id']
        with s.db() as c:
            for uid in ('host:admin:8', 'host:admin:9', 'host:admin:10'):
                c.execute('INSERT INTO memberships VALUES(?,?,?)', (self.pid, uid, 'inspector'))
        image = Path(__file__).resolve().parents[2] / 'local-inspector/tests/fixtures/upload-test.png'
        self.image = base64.b64encode(image.read_bytes()).decode()

    def post(self, action, token=None, **data):
        data['requestId'] = uuid.uuid4().hex
        result = self.request('/quality/api/work/'+action, data, token or self.owner)
        self.assertEqual(result[0], 200, result[1])
        return result[1]

    def task(self, leader='host:admin:8', token=None):
        return self.post('adhoc-tasks', token or self.worker, projectId=self.pid, scenarioId='inspection', title='成员巡查', object='', dueDate='2026-10-30', fields={}, leaderId=leader)

    def submit(self, task, token=None):
        token = token or self.worker
        task = self.post('start', token, taskId=task['id'], revision=task['revision'], checklist=task['scenario']['checklist'])
        signature = self.post('upload', token, projectId=self.pid, name='signature.png', base64=self.image, occurredAt='2026-10-30T09:00:00+08:00')['id']
        return self.post('submit-field', token, taskId=task['id'], revision=task['revision'], inspectors='现场成员', signer='现场成员', signature=signature, noHazard=True, text='检查范围与无隐患结论')

    def inbox(self, token=None):
        result = self.request('/quality/api/work/leader-inbox', token=token or self.lead)
        self.assertEqual(result[0], 200)
        return result[1]

    def test_optional_leader_does_not_block_submission(self):
        self.submit(self.task(''))
        self.assertEqual(self.inbox(), [])

    def test_submission_routes_to_owner_and_read_state_is_per_user(self):
        task = self.task()
        self.assertEqual(self.inbox(), [])
        self.submit(task)
        rows = self.inbox()
        self.assertEqual(len(rows), 1)
        self.assertTrue(rows[0]['unread'])
        self.assertEqual(self.inbox(self.other), [])
        self.post('leader-read', self.lead, keys=[rows[0]['key']])
        self.assertFalse(self.inbox()[0]['unread'])
        self.assertTrue(self.inbox(self.owner)[0]['unread'])

    def test_cross_project_assignment_and_unauthorized_reassignment_rejected(self):
        task = self.task()
        result = self.request('/quality/api/work/assign-leader', dict(taskId=task['id'], revision=task['revision'], leaderId='host:admin:10', requestId='forged'), self.other)
        self.assertEqual(result[0], 403)
        result = self.request('/quality/api/work/adhoc-tasks', dict(projectId=self.pid, scenarioId='inspection', title='非法负责人', dueDate='2026-10-30', fields={}, leaderId='outsider', requestId='bad-leader'), self.worker)
        self.assertEqual(result[0], 400)

    def test_multiple_members_export_originals_and_summary(self):
        self.submit(self.task())
        self.submit(self.task(token=self.other), self.other)
        rows = self.inbox()
        self.assertEqual(len(rows), 2)
        query = '&'.join('key='+row['key'] for row in rows)
        status, data, _ = self.request('/quality/api/work/leader-export?'+query, token=self.lead)
        self.assertEqual(status, 200)
        with zipfile.ZipFile(io.BytesIO(data)) as bundle:
            self.assertEqual(len([n for n in bundle.namelist() if n.endswith('.docx')]), 2)
            self.assertIn('现场成员', bundle.read('summary.html').decode())
            self.assertEqual(len(json.loads(bundle.read('manifest.json'))['documents']), 2)
            for name in bundle.namelist():
                if name.endswith('.docx'):
                    with zipfile.ZipFile(io.BytesIO(bundle.read(name))) as doc:
                        self.assertTrue(any(n.startswith('word/media/') for n in doc.namelist()))
        self.assertEqual(self.request('/quality/api/work/leader-export?'+query, token=self.other)[0], 403)

    def test_reassignment_routes_existing_reports_and_revocation_hides_inbox(self):
        task = self.submit(self.task())
        task = self.post('assign-leader', taskId=task['id'], revision=task['revision'], leaderId='host:admin:10')
        self.assertEqual(self.inbox(), [])
        self.assertEqual(len(self.inbox(self.other)), 1)
        with s.db() as c:
            c.execute('DELETE FROM memberships WHERE project_id=? AND user_id=?', (self.pid, 'host:admin:10'))
        self.assertEqual(self.inbox(self.other), [])

    def test_legacy_report_leader_and_draft_exclusion(self):
        code = self.request('/quality/api/codes', dict(projectId=self.pid, participants='现场成员'), self.owner)[1]['id']
        signature = self.request('/quality/api/media', dict(base64=self.image), self.owner)[1]['id']
        payload = dict(codeId=code, date='2026-10-30', inspector='现场成员', signature=signature, scope='检查无隐患', noHazard=True, issues=[], leaderId='host:admin:8')
        status, draft, _ = self.request('/quality/api/reports', payload, self.owner)
        self.assertEqual(status, 200)
        self.assertEqual(self.inbox(), [])
        old_client = dict(payload, id=draft['id'], revision=draft['revision'])
        old_client.pop('leaderId')
        status, draft, _ = self.request('/quality/api/reports', old_client, self.owner)
        self.assertEqual(status, 200)
        self.assertEqual(draft['leaderId'], 'host:admin:8')
        status, report, _ = self.request('/quality/api/reports', dict(**payload, id=draft['id'], revision=draft['revision'], submit=True), self.owner)
        self.assertEqual(status, 200)
        self.assertEqual(self.inbox()[0]['id'], report['id'])

    def test_returned_submission_keeps_versions_and_new_version_is_unread(self):
        task = self.submit(self.task())
        old = self.inbox()[0]
        self.post('leader-read', self.lead, keys=[old['key']])
        task = self.post('receive-field', taskId=task['id'], revision=task['revision'], decision='return', text='补充检查范围')
        signature = task['fieldSignature']['evidenceId']
        self.post('submit-field', self.worker, taskId=task['id'], revision=task['revision'], inspectors='现场成员', signer='现场成员', signature=signature, noHazard=True, text='补充后的检查结论')
        rows = self.inbox()
        self.assertEqual(sorted(r['version'] for r in rows), [1, 2])
        self.assertFalse(next(r for r in rows if r['version']==1)['unread'])
        self.assertTrue(next(r for r in rows if r['version']==2)['unread'])

    def test_stale_revision_cannot_overwrite_leader(self):
        task = self.task()
        self.post('assign-leader', taskId=task['id'], revision=task['revision'], leaderId='host:admin:10')
        result = self.request('/quality/api/work/assign-leader', dict(taskId=task['id'], revision=task['revision'], leaderId='', requestId='stale'), self.owner)
        self.assertEqual(result[0], 409)


if __name__ == '__main__':
    unittest.main(verbosity=2)
