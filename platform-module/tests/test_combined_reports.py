import io
import json
import os
from pathlib import Path
import unittest
import uuid
import zipfile
from concurrent.futures import ThreadPoolExecutor
from threading import Barrier

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
        return self.request('/quality/api/work/' + action, {'requestId':uuid.uuid4().hex, **payload}, token or self.lead)

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

    def test_four_people_sign_same_revision_concurrently_without_lost_signatures(self):
        report = self.combined()
        report = self.post('combined-assign', self.lead, combinedId=report['id'], revision=report['revision'],
                           recipientId='host:admin:11', coSignerIds=['host:admin:8', 'host:admin:9', 'host:admin:10'])
        tokens = [self.lead, self.worker, self.other, self.receiver]
        for token in tokens:
            read = self.request('/quality/api/work/combined-data/'+report['id'], token=token)[1]
            self.assertEqual(read['contentHash'], report['contentHash'])
            self.assertTrue(read['canSign'])
        barrier = Barrier(4)
        payload = dict(combinedId=report['id'], revision=report['revision'], contentHash=report['contentHash'],
                       assignmentHash=report['assignmentHash'], confirmed=True, base64=self.image)
        def sign(token):
            barrier.wait()
            return self.raw('combined-sign', token, **payload)
        with ThreadPoolExecutor(max_workers=4) as pool:
            results = list(pool.map(sign, tokens))
        self.assertEqual([r[0] for r in results], [200]*4, results)
        for token in tokens:
            read = self.request('/quality/api/work/combined-data/'+report['id'], token=token)[1]
            self.assertEqual(read['signedCount'], 4)
            self.assertEqual(len({p['signature']['evidenceId'] for p in read['signers']}), 4)
            self.assertFalse(read['canSign'])
            self.assertFalse(read['canAssign'])
        self.assertEqual(self.raw('combined-sign', self.worker, **payload)[0], 409)
        self.assertEqual(self.raw('combined-sign', self.owner, **payload)[0], 403)
        self.assertEqual(self.raw('combined-assign', self.lead, combinedId=report['id'], revision=read['revision'], recipientId='host:admin:11', coSignerIds=[])[0], 403)
        status, data, _ = self.request('/quality/api/work/combined-word/'+report['id'], token=self.worker)
        self.assertEqual(status, 200)
        with zipfile.ZipFile(io.BytesIO(data)) as doc:
            xml = doc.read('word/document.xml').decode()
            for text in ['合并报告在线会签', '项目负责人', '检查人', '被检查单位负责人', 'host:admin:8', 'host:admin:9', 'host:admin:10', 'host:admin:11']:
                self.assertIn(text, xml)
        if os.environ.get('QAXC_QA_OUTPUT'):
            Path(os.environ['QAXC_QA_OUTPUT']).mkdir(parents=True, exist_ok=True)
            (Path(os.environ['QAXC_QA_OUTPUT'])/'combined-four-signers.docx').write_bytes(data)

    def test_assignment_change_requires_review_and_revocation_blocks_replay(self):
        report = self.combined()
        report = self.post('combined-assign', self.lead, combinedId=report['id'], revision=report['revision'], recipientId='host:admin:11', coSignerIds=['host:admin:9'])
        payload = dict(combinedId=report['id'], revision=report['revision'], contentHash=report['contentHash'], assignmentHash=report['assignmentHash'], confirmed=True, base64=self.image)
        changed = self.post('combined-assign', self.lead, combinedId=report['id'], revision=report['revision'], recipientId='host:admin:11', coSignerIds=['host:admin:9','host:admin:10'])
        self.assertEqual(self.raw('combined-sign', self.worker, **payload)[0], 409)
        payload.update(revision=changed['revision'], assignmentHash=changed['assignmentHash'], requestId='co-sign-retry')
        first = self.request('/quality/api/work/combined-sign', payload, self.worker)
        self.assertEqual(first[0], 200)
        self.assertEqual(first[1], self.request('/quality/api/work/combined-sign', payload, self.worker)[1])
        with s.db() as c:
            c.execute('DELETE FROM memberships WHERE project_id=? AND user_id=?', (self.pid,'host:admin:9'))
        self.assertEqual(self.request('/quality/api/work/combined-sign', payload, self.worker)[0], 403)

    def test_multiple_leaders_recipients_and_onsite_people_keep_originals_shared(self):
        report = self.combined()
        originals = report['report']['signatures']
        report = self.post('combined-assign', self.lead, combinedId=report['id'], revision=report['revision'],
                           managerIds=['host:admin:8','host:admin:12'], recipientIds=['host:admin:11','host:admin:13'])
        self.assertEqual([p['role'] for p in report['signers']].count('项目负责人'), 2)
        for token in [self.worker, self.other]:
            shared = self.request('/quality/api/work/combined-data/'+report['id'], token=token)[1]
            self.assertEqual(shared['report']['signatures'], originals)
            self.assertFalse(shared['canSign'])  # Original inspectors need not sign twice.
            self.assertTrue(shared['canCollectGuest'])
        old_hash = report['assignmentHash']
        report = self.post('combined-guest-add', self.worker, combinedId=report['id'], name='现场甲', unit='单位甲')
        report = self.post('combined-guest-add', self.other, combinedId=report['id'], name='现场乙', unit='单位乙')
        self.assertEqual(report['assignmentHash'], old_hash)
        revision = report['revision']
        jobs = [(token, 'combined-sign', dict(assignmentHash=old_hash)) for token in [self.lead,self.lead2,self.receiver,self.receiver2]]
        jobs += [(token, 'combined-guest-sign', dict(guestSignerId=person['id'],slotHash=person['slotHash'])) for token, person in zip([self.worker,self.other],report['guestSigners'])]
        barrier = Barrier(6)
        def submit(job):
            token, action, extra = job
            barrier.wait()
            return self.raw(action,token,combinedId=report['id'],revision=revision,contentHash=report['contentHash'],confirmed=True,base64=self.image,signMethod='image',**extra)
        with ThreadPoolExecutor(max_workers=6) as pool:
            responses=list(pool.map(submit,jobs))
        self.assertEqual([r[0] for r in responses],[200]*6,responses)
        for token in [self.worker,self.other,self.lead,self.lead2]:
            shared=self.request('/quality/api/work/combined-data/'+report['id'],token=token)[1]
            self.assertEqual(shared['signedCount'],6)
            self.assertEqual(shared['report']['signatures'],originals)
            self.assertEqual({p['signature']['collectedBy'] for p in shared['guestSigners']},{'host:admin:9','host:admin:10'})
            self.assertTrue(all(p['signature']['signMethod']=='image' for p in shared['signers']+shared['guestSigners']))
        appended=self.post('combined-guest-add',self.other,combinedId=report['id'],name='现场丙',unit='单位丙')
        self.assertEqual(appended['signedCount'],6)
        self.assertEqual(len(appended['guestSigners']),3)
        status, data, _ = self.request('/quality/api/work/combined-word/'+report['id'],token=self.worker)
        self.assertEqual(status,200)
        with zipfile.ZipFile(io.BytesIO(data)) as doc:
            xml=doc.read('word/document.xml').decode()
            for text in ['项目负责人签字（支持多人）','host:admin:12','host:admin:13','现场甲','现场乙','现场丙','单位甲','现场采集人','检查人员原签名']:
                self.assertIn(text,xml)

    def test_onsite_identity_permissions_and_retry(self):
        report=self.combined()
        report=self.post('combined-assign',self.lead,combinedId=report['id'],revision=report['revision'],managerIds=['host:admin:8'],recipientIds=['host:admin:11'])
        with s.db() as c:
            c.execute("UPDATE memberships SET role='receiver' WHERE project_id=? AND user_id=?",(self.pid,'host:admin:11'))
        self.assertEqual(self.raw('combined-guest-add',self.receiver,combinedId=report['id'],name='甲',unit='乙')[0],403)
        report=self.post('combined-guest-add',self.worker,combinedId=report['id'],name='甲',unit='乙')
        person=report['guestSigners'][0]
        payload=dict(combinedId=report['id'],guestSignerId=person['id'],slotHash=person['slotHash'],contentHash=report['contentHash'],confirmed=True,base64=self.image,signMethod='image',requestId='onsite-retry')
        self.assertEqual(self.raw('combined-guest-sign',self.worker,**dict(payload,requestId='bad-slot',slotHash='wrong'))[0],409)
        self.assertEqual(self.raw('combined-guest-sign',self.worker,**dict(payload,requestId='no-confirm',confirmed=False))[0],400)
        first=self.request('/quality/api/work/combined-guest-sign',payload,self.worker)
        self.assertEqual(first[0],200)
        self.assertEqual(first[1],self.request('/quality/api/work/combined-guest-sign',payload,self.worker)[1])
        self.assertEqual(self.raw('combined-guest-sign',self.other,**dict(payload,requestId='overwrite'))[0],409)
        with s.db() as c:
            c.execute("UPDATE memberships SET role='receiver' WHERE project_id=? AND user_id=?",(self.pid,'host:admin:9'))
        self.assertEqual(self.request('/quality/api/work/combined-guest-sign',payload,self.worker)[0],403)


if __name__ == '__main__':
    unittest.main()
