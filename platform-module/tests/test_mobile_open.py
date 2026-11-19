"""Platform signup and temporary inspection without project membership grants."""
import json
import uuid
import unittest
import test_mobile_workflow as mobile
s=mobile.s


class PlatformOpen(unittest.TestCase):
    tearDown = mobile.MobileWorkflow.tearDown
    request = mobile.MobileWorkflow.request
    login = mobile.MobileWorkflow.login
    post = mobile.MobileWorkflow.post
    raw = mobile.MobileWorkflow.raw
    change = mobile.MobileWorkflow.change
    sign = mobile.MobileWorkflow.sign

    def setUp(self):
        mobile.MobileWorkflow.setUp(self)
        with s.db() as c:
            c.execute('DELETE FROM memberships')

    def create(self, **extra):
        return self.post('mobile-create', self.worker, **dict(dict(projectId=self.pid,
            title='开放巡查',site='一号楼',workDate='2026-11-19',requiredPeople=1,
            leaderId='host:admin:8'), **extra))

    def assert_no_grants(self):
        with s.db() as c:
            self.assertEqual(c.execute('SELECT COUNT(*) FROM memberships').fetchone()[0],0)

    def test_platform_signup_owner_selection_and_public_summary(self):
        t=self.create()
        state=self.request('/quality/api/work/mobile-state',token=self.other)[1]
        self.assertTrue(state['canCreate'])
        self.assertTrue(next(x for x in state['tasks'] if x['id']==t['id'])['canAccept'])
        t=self.change(t,'mobile-accept',self.other)
        self.assertEqual(self.raw('mobile-roster',self.other,taskId=t['id'],revision=t['revision'],confirmedIds=['host:admin:10'])[0],403)
        self.assertEqual(self.raw('mobile-roster',self.lead,taskId=t['id'],revision=t['revision'],confirmedIds=['host:admin:10'])[0],403)
        t=self.change(t,'mobile-roster',self.worker,confirmedIds=['host:admin:10'])
        t=self.change(t,'issue',self.other,description='仅名单人员可编辑',evidence=[])
        state=self.request('/quality/api/work/mobile-state',token=self.receiver)[1]
        public=next(x for x in state['tasks'] if x['id']==t['id'])
        self.assertTrue(public['publicSummary'])
        self.assertEqual(public['issues'],[])
        self.assertFalse(public['canCollect'])
        self.assertEqual(self.raw('issue',self.receiver,taskId=t['id'],revision=t['revision'],description='不能编辑')[0],403)
        self.assert_no_grants()

    def test_removed_applicant_cannot_reapply_but_newly_logged_in_user_can_apply(self):
        t=self.create()
        t=self.change(t,'mobile-accept',self.other)
        t=self.change(t,'mobile-remove-applicant',self.worker,userId='host:admin:10',reason='时间不合适')
        self.assertEqual(self.raw('mobile-accept',self.other,taskId=t['id'],revision=t['revision'])[0],403)
        original=s.host_auth.call.side_effect
        s.host_auth.call.side_effect=lambda action,data=None,cookie='': dict(active=True,aud='qaxc',id='host:admin:99',name='新登录用户',isAdmin=False) if (data or {}).get('username')=='new-user' or (data or {}).get('id')=='host:admin:99' else original(action,data,cookie)
        token=self.login('new-user')[0]
        state=self.request('/quality/api/work/mobile-state',token=token)[1]
        self.assertTrue(next(x for x in state['tasks'] if x['id']==t['id'])['canAccept'])
        t=self.change(t,'mobile-accept',token)
        self.assertIn('host:admin:99',t['acceptedIds'])
        self.assert_no_grants()

    def test_manual_project_creation_is_atomic_and_retries_do_not_duplicate(self):
        payload=dict(requestId=uuid.uuid4().hex,projectName="临时项目 O'Brien 工地",title='巡查',site='门口',
                     workDate='2026-11-19',requiredPeople=1,leaderId='host:admin:8')
        first=self.request('/quality/api/work/mobile-create',payload,self.worker)
        self.assertEqual(first[0],200,first[1])
        self.assertEqual(self.request('/quality/api/work/mobile-create',payload,self.worker),first)
        with s.db() as c:
            self.assertEqual(c.execute('SELECT COUNT(*) FROM projects WHERE name=?',(payload['projectName'],)).fetchone()[0],1)
        for value in ('', '   ', 'x'*301):
            invalid=dict(payload,requestId=uuid.uuid4().hex,projectName=value)
            self.assertEqual(self.request('/quality/api/work/mobile-create',invalid,self.worker)[0],400)
        invalid=dict(payload,requestId=uuid.uuid4().hex,projectName='应回滚项目',requiredPeople=0)
        self.assertEqual(self.request('/quality/api/work/mobile-create',invalid,self.worker)[0],400)
        with s.db() as c:
            self.assertEqual(c.execute('SELECT COUNT(*) FROM projects WHERE name=?',('应回滚项目',)).fetchone()[0],0)
        self.assert_no_grants()

    def test_temporary_inspection_photo_report_sign_publish_recognition_without_memberships(self):
        t=self.post('mobile-adhoc',self.worker,projectName='临时巡查项目',title='临时巡查',site='现场',workDate='2026-11-19')
        self.assertEqual(t['stage'],'inspection')
        self.assertEqual(t['confirmedIds'],['host:admin:9'])
        self.assertEqual(t['leaderId'],'host:admin:9')
        self.assertEqual(t['requiredPeople'],1)
        state=self.request('/quality/api/work/mobile-state',token=self.other)[1]
        self.assertNotIn(t['id'],[x['id'] for x in state['tasks']])
        photo=self.post('upload',self.worker,projectId=t['projectId'],taskId=t['id'],name='现场.png',base64=self.image,occurredAt='2026-11-19T09:00:00+08:00')
        self.assertEqual(self.request('/quality/api/work/evidence/'+photo['id'],token=self.worker)[0],200)
        self.assertEqual(self.request('/quality/api/work/evidence/'+photo['id'],token=self.other)[0],403)
        t=self.change(t,'issue',self.worker,description='围栏缺失',evidence=[photo['id']])
        t=self.change(t,'mobile-complete',self.worker)
        t=self.change(t,'mobile-select',self.worker,selectedIds=[t['issues'][0]['id']])
        r=self.request('/quality/api/work/combined-data/'+t['combinedId'],token=self.worker)[1]
        r=self.post('combined-assign',self.worker,combinedId=r['id'],revision=r['revision'],managerIds=['host:admin:9'],recipientIds=['host:admin:11'])
        self.assertEqual(self.request('/quality/api/work/evidence/'+photo['id'],token=self.receiver)[0],200)
        self.assertEqual(self.request('/quality/api/work/combined-data/'+r['id'],token=self.other)[0],403)
        for token in (self.worker,self.receiver): r=self.sign(r,token)
        t=self.change(t,'mobile-publish',self.worker,contentHash=r['contentHash'],reportRevision=r['revision'])
        self.assertEqual(self.request('/quality/api/work/combined-word/'+r['id'],token=self.receiver)[0],200)
        t=self.change(t,'mobile-recognize',self.worker,actualIds=['host:admin:9'],hoursPerPerson=2,text='临时巡查完成')
        self.assertEqual(t['stage'],'recognized')
        self.assert_no_grants()

    def test_cross_task_evidence_and_legacy_project_access_stay_restricted(self):
        t=self.post('mobile-adhoc',self.worker,projectId=self.pid,title='临时巡查',site='现场',workDate='2026-11-19')
        photo=self.post('upload',self.worker,projectId=self.pid,taskId=t['id'],name='现场.png',base64=self.image,occurredAt='2026-11-19T09:00:00+08:00')
        other=self.post('mobile-adhoc',self.other,projectId=self.pid,title='另一次巡查',site='现场',workDate='2026-11-19')
        self.assertEqual(self.raw('issue',self.other,taskId=other['id'],revision=other['revision'],description='跨任务图片',evidence=[photo['id']])[0],403)
        self.assertEqual(self.raw('upload',self.other,projectId=self.pid,name='未绑定.png',base64=self.image,occurredAt='2026-11-19T09:00:00+08:00')[0],403)
        with s.db() as c:
            c.execute('INSERT INTO memberships VALUES(?,?,?)',(self.pid,'host:admin:7','manager'))
        legacy=self.post('tasks',self.owner,projectId=self.pid,scenarioId='inspection',title='历史流程',fields={},assignee='host:admin:7',receiverName='负责人')
        with s.db() as c:
            c.execute('DELETE FROM memberships')
        state=self.request('/quality/api/work/state',token=self.worker)[1]
        self.assertNotIn(legacy['id'],[x['id'] for x in state['tasks']])
        self.assert_no_grants()
