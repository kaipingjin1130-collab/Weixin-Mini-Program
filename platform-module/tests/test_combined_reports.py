import io
import json
import os
from pathlib import Path
import unittest
import uuid
import zipfile

from test_leader_reports import LeaderReports, s


class CombinedReports(unittest.TestCase):
    setUp = LeaderReports.setUp
    tearDown = LeaderReports.tearDown
    request = LeaderReports.request
    login = LeaderReports.login
    post = LeaderReports.post
    task = LeaderReports.task
    submit = LeaderReports.submit
    inbox = LeaderReports.inbox
    submitted_report = LeaderReports.submitted_report

    def raw(self, action, token=None, **payload):
        return self.request('/quality/api/work/' + action, dict(requestId=uuid.uuid4().hex, **payload), token or self.lead)

    def combined(self):
        for token, text in [(self.worker, '一号楼临边缺少防护'), (self.other, '二号楼通道被占用')]:
            task = self.post('adhoc-tasks', token, projectId=self.pid, scenarioId='inspection', quickStart=True,
                             leaderId='host:admin:8', inspectors='现场检查员', notice={'inspectionDate':'2026-11-12'})
            self.assertEqual(task['status'], 'active')
            self.assertEqual(task['checklist'], [])
            photo = self.post('upload', token, projectId=self.pid, name='现场照片.png', base64=self.image, occurredAt='2026-11-12T09:30:00+08:00')
            task = self.post('issue', token, taskId=task['id'], revision=task['revision'], description=text,
                             location='三层', category='施工安全', risk='中', inspectionDate='2026-11-12', inspectionTime='09:30', evidence=[photo['id']])
            self.post('submit-field', token, taskId=task['id'], revision=task['revision'], inspectors='现场检查员', signer='现场检查员', signature=photo['id'])
        rows = self.inbox()
        return self.post('combined-create', self.lead, keys=[r['key'] for r in rows])

    def assign(self, report):
        return self.post('combined-assign', self.lead, combinedId=report['id'], revision=report['revision'], recipientId='host:admin:10')

    def sign(self, report):
        return self.post('combined-sign', self.other, combinedId=report['id'], revision=report['revision'],
                         contentHash=report['contentHash'], confirmed=True, base64=self.image)

    def test_merge_two_members_photos_times_originals_and_word_signature(self):
        report = self.combined()
        with s.db() as c:
            before = [dict(r) for r in c.execute('SELECT * FROM field_reports ORDER BY id')]
        self.assertEqual(len(report['report']['issues']), 2)
        self.assertEqual(len(report['report']['signatures']), 2)
        self.assertTrue(all(i['sourceKey'] and i['inspectionTime'] == '09:30' for i in report['report']['issues']))
        report = self.sign(self.assign(report))
        read = self.request('/quality/api/work/combined-data/' + report['id'], token=self.worker)[1]
        self.assertEqual(read['recipientSignature']['userId'], 'host:admin:10')
        status, data, _ = self.request('/quality/api/work/combined-word/' + report['id'], token=self.lead)
        self.assertEqual(status, 200)
        with zipfile.ZipFile(io.BytesIO(data)) as doc:
            xml = doc.read('word/document.xml').decode()
            for text in ['一号楼临边缺少防护', '二号楼通道被占用', '被检查单位负责人签字', '09:30', '委托单位', '项目进度', '监理单位', report['contentHash']]:
                self.assertIn(text, xml)
            self.assertGreaterEqual(len([n for n in doc.namelist() if 'notice-photo-' in n]), 5)
        with s.db() as c:
            self.assertEqual(before, [dict(r) for r in c.execute('SELECT * FROM field_reports ORDER BY id')])
        if os.environ.get('QAXC_QA_OUTPUT'):
            Path(os.environ['QAXC_QA_OUTPUT']).mkdir(parents=True, exist_ok=True)
            (Path(os.environ['QAXC_QA_OUTPUT']) / 'combined-sample.docx').write_bytes(data)

    def test_only_designated_person_signs_and_conflict_is_rejected(self):
        report = self.assign(self.combined())
        payload = dict(combinedId=report['id'], revision=report['revision'], contentHash=report['contentHash'], confirmed=True, base64=self.image)
        self.assertEqual(self.raw('combined-sign', self.lead, **payload)[0], 403)
        self.assertEqual(self.raw('combined-sign', self.owner, **payload)[0], 403)
        self.assertEqual(self.raw('combined-sign', self.other, **dict(payload, contentHash='wrong'))[0], 409)
        self.assertEqual(self.raw('combined-sign', self.other, **dict(payload, confirmed=False))[0], 400)
        self.sign(report)
        self.assertEqual(self.raw('combined-sign', self.other, **payload)[0], 409)

    def test_access_revocation_read_export_and_idempotent_replay(self):
        report = self.assign(self.combined())
        payload = dict(combinedId=report['id'], revision=report['revision'], contentHash=report['contentHash'], confirmed=True, base64=self.image, requestId='stable-sign')
        first = self.request('/quality/api/work/combined-sign', payload, self.other)
        self.assertEqual(first[0], 200)
        self.assertEqual(first[1], self.request('/quality/api/work/combined-sign', payload, self.other)[1])
        with s.db() as c:
            c.execute('DELETE FROM memberships WHERE project_id=? AND user_id=?', (self.pid, 'host:admin:10'))
        for action in ['combined-data/', 'combined-word/']:
            self.assertEqual(self.request('/quality/api/work/' + action + report['id'], token=self.other)[0], 403)
        self.assertEqual(self.request('/quality/api/work/combined-sign', payload, self.other)[0], 403)
        self.assertEqual(self.request('/quality/api/work/combined-list', token=self.other)[1], [])

    def test_duplicate_versions_and_unauthorized_merge_are_rejected(self):
        task = self.submit(self.task())
        old = self.inbox()[0]['key']
        task = self.post('receive-field', taskId=task['id'], revision=task['revision'], decision='return', text='补充')
        self.post('submit-field', self.worker, taskId=task['id'], revision=task['revision'])
        keys = [r['key'] for r in self.inbox()]
        self.assertEqual(self.raw('combined-create', keys=keys)[0], 400)
        self.assertEqual(self.raw('combined-create', self.other, keys=[old])[0], 403)

    def test_legacy_and_brief_can_be_merged_and_signer_must_be_member(self):
        self.submit(self.task())
        self.submitted_report('host:admin:8')
        report = self.post('combined-create', self.lead, keys=[r['key'] for r in self.inbox()])
        self.assertEqual(len(report['report']['signatures']), 2)
        self.assertEqual(self.raw('combined-assign', combinedId=report['id'], revision=1, recipientId='outsider')[0], 400)
        self.assertEqual(self.raw('combined-assign', self.worker, combinedId=report['id'], revision=1, recipientId='host:admin:9')[0], 403)

    def test_creation_retry_returns_same_report_and_signing_locks_assignment(self):
        self.submit(self.task())
        payload = dict(keys=[self.inbox()[0]['key']], requestId='stable-create')
        first = self.request('/quality/api/work/combined-create', payload, self.lead)
        again = self.request('/quality/api/work/combined-create', payload, self.lead)
        self.assertEqual(first[1]['id'], again[1]['id'])
        report = self.sign(self.assign(first[1]))
        self.assertEqual(self.raw('combined-assign', combinedId=report['id'], revision=report['revision'], recipientId='host:admin:9')[0], 403)

    def test_quick_start_is_scoped_to_adhoc_and_bad_time_rejected(self):
        task = self.task()
        self.assertEqual(task['status'], 'ready')
        task = self.post('start', self.worker, taskId=task['id'], revision=task['revision'], checklist=[])
        self.assertEqual(self.raw('issue', self.worker, taskId=task['id'], revision=task['revision'], inspectionDate='bad')[0], 400)
        self.assertEqual(self.raw('issue', self.worker, taskId=task['id'], revision=task['revision'], inspectionTime='25:99')[0], 400)

    def test_legacy_edit_preserves_inspection_time(self):
        task = self.post('adhoc-tasks', self.worker, projectId=self.pid, scenarioId='inspection', quickStart=True)
        task = self.post('issue', self.worker, taskId=task['id'], revision=task['revision'], inspectionDate='2026-11-12', inspectionTime='09:30')
        task = self.post('edit-issue', self.worker, taskId=task['id'], revision=task['revision'], issueId=task['issues'][0]['id'], description='旧客户端修改文字')
        self.assertEqual(task['issues'][0]['inspectionDate'], '2026-11-12')
        self.assertEqual(task['issues'][0]['inspectionTime'], '09:30')


if __name__ == '__main__':
    unittest.main()
