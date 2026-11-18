import io
import zipfile
import json
import uuid
import unittest
from test_leader_reports import LeaderReports, s


class MobileWorkflow(unittest.TestCase):
    setUp=LeaderReports.setUp
    tearDown=LeaderReports.tearDown
    request=LeaderReports.request
    login=LeaderReports.login
    post=LeaderReports.post

    def raw(self, action, token=None, **data):
        return self.request('/quality/api/work/'+action,dict(requestId=uuid.uuid4().hex,**data),token or self.owner)

    def create(self):
        return self.post('mobile-create',projectId=self.pid,title='检查任务',site='三号楼',workDate='2026-11-17',
                         requiredPeople=1,leaderId='host:admin:8',invitedIds=['host:admin:9'])

    def change(self, t, action, token=None, **data):
        return self.post(action,token,taskId=t['id'],revision=t['revision'],**data)

    def inspect(self):
        t=self.create()
        t=self.change(t,'mobile-accept',self.worker)
        t=self.change(t,'mobile-roster',self.lead,confirmedIds=['host:admin:9'])
        t=self.change(t,'issue',self.worker,description='防护缺失',evidence=[],location='楼梯')
        return self.change(t,'issue',self.worker,description='待核实项',evidence=[])

    def selected(self):
        t=self.inspect(); t=self.change(t,'mobile-complete',self.worker)
        return self.change(t,'mobile-select',self.lead,selectedIds=[t['issues'][0]['id']],reason='第二条现场复核无问题')

    def report(self,t):
        code,r,_=self.request('/quality/api/work/combined-data/'+t['combinedId'],token=self.lead)
        self.assertEqual(code,200,r);return r

    def sign(self,r,token):
        return self.post('combined-sign',token,combinedId=r['id'],revision=r['revision'],contentHash=r['contentHash'],
                         assignmentHash=r['assignmentHash'],confirmed=True,base64=self.image)

    def signed(self):
        t=self.selected();r=self.report(t)
        r=self.post('combined-assign',self.lead,combinedId=r['id'],revision=r['revision'],managerIds=['host:admin:8'],recipientIds=['host:admin:11'])
        for token in [self.worker,self.lead,self.receiver]: r=self.sign(r,token)
        return t,r

    def test_full_flow_selected_drafts_signature_lock_and_recognition_counts(self):
        t,r=self.signed()
        self.assertEqual(len(t['issues']),2)
        self.assertEqual(len(r['report']['issues']),1)
        self.assertIn('三号楼',r['report']['scope'])
        self.assertTrue(r['report']['inspector'])
        self.assertEqual(r['report']['issues'][0]['description'],'防护缺失')
        self.assertEqual(self.raw('mobile-recognize',taskId=t['id'],revision=t['revision'],actualIds=['host:admin:9'],hoursPerPerson=8,text='现场核验')[0],409)
        t=self.change(t,'mobile-publish',self.lead,contentHash=r['contentHash'],reportRevision=r['revision'])
        status,blob,_=self.request('/quality/api/work/combined-word/'+r['id'],token=self.lead)
        self.assertEqual(status,200)
        with zipfile.ZipFile(io.BytesIO(blob)) as doc: self.assertIn('已确认发布',doc.read('word/document.xml').decode())
        self.assertEqual(self.raw('combined-guest-add',self.lead,combinedId=r['id'],name='补签',unit='单位')[0],409)
        t=self.change(t,'mobile-recognize',self.lead,actualIds=['host:admin:9'],hoursPerPerson=6.5,text='现场核验')
        self.assertEqual(t['stage'],'recognized')
        result=self.request('/quality/api/work/mobile-state?from=2026-11-17&to=2026-11-17',token=self.worker)[1]
        self.assertEqual(result['statistics'][0]['recognized'],1)
        self.assertEqual(result['statistics'][0]['hours'],6.5)
        self.assertEqual(result['projectStatistics'][0]['actual'],1)
        self.assertEqual(self.raw('mobile-recognize',taskId=t['id'],revision=t['revision'],actualIds=['host:admin:9'],hoursPerPerson=8,text='重复')[0],409)

    def test_roster_requires_acceptance_and_wrong_actor_cannot_collect(self):
        t=self.create()
        self.assertEqual(self.raw('mobile-roster',self.lead,taskId=t['id'],revision=t['revision'],confirmedIds=['host:admin:9'])[0],400)
        self.assertEqual(self.raw('mobile-accept',self.other,taskId=t['id'],revision=t['revision'])[0],403)
        self.assertEqual(self.raw('start',self.worker,taskId=t['id'],revision=t['revision'],checklist=[])[0],409)
        t=self.change(t,'mobile-accept',self.worker)
        t=self.change(t,'mobile-roster',self.lead,confirmedIds=['host:admin:9'])
        self.assertEqual(self.raw('issue',self.other,taskId=t['id'],revision=t['revision'],description='非法')[0],403)
        self.assertEqual(self.raw('submit-field',self.worker,taskId=t['id'],revision=t['revision'])[0],409)

    def test_unsigned_cannot_publish_and_selected_inspectors_cannot_be_removed(self):
        t=self.selected();r=self.report(t)
        self.assertEqual(self.raw('mobile-publish',self.lead,taskId=t['id'],revision=t['revision'],contentHash=r['contentHash'],reportRevision=r['revision'])[0],409)
        r=self.post('combined-assign',self.lead,combinedId=r['id'],revision=r['revision'],managerIds=['host:admin:8'],recipientIds=['host:admin:11'])
        self.assertIn('host:admin:9',[p['userId'] for p in r['coSigners']])
        self.assertEqual(self.raw('combined-create',self.lead,keys=['brief:'+t['fieldBriefs'][0]['id']])[0],409)

    def test_revision_idempotency_and_permissions(self):
        t=self.create();payload=dict(requestId='stable-accept',taskId=t['id'],revision=t['revision'])
        first=self.request('/quality/api/work/mobile-accept',payload,self.worker)
        self.assertEqual(first[0],200)
        self.assertEqual(first,self.request('/quality/api/work/mobile-accept',payload,self.worker))
        self.assertEqual(self.raw('mobile-roster',self.lead,taskId=t['id'],revision=t['revision'],confirmedIds=['host:admin:9'])[0],409)
        self.assertEqual(self.request('/quality/api/work/mobile-state?scope=all',token=self.worker)[0],403)
        with s.db() as c: c.execute('DELETE FROM memberships WHERE project_id=? AND user_id=?',(self.pid,'host:admin:9'))
        self.assertEqual(self.request('/quality/api/work/mobile-accept',payload,self.worker)[0],403)

    def test_contract_limits_dates_and_no_automatic_completed_work(self):
        self.post('mobile-project-config',projectId=self.pid,contractPeople=0,basis='合同无巡查人员配置',revision=0)
        t=self.create()
        result=self.request('/quality/api/work/mobile-state?scope=all',token=self.owner)[1]
        self.assertTrue(result['tasks'][0]['overContract'])
        self.assertEqual(result['projectStatistics'][0]['overTasks'],1)
        self.assertEqual(sum(r['recognized'] for r in result['statistics']),0)
        self.assertEqual(self.request('/quality/api/work/mobile-state?from=2026-12-01&to=2026-01-01',token=self.owner)[0],400)
        self.assertEqual(self.raw('mobile-project-config',self.worker,projectId=self.pid,contractPeople=2,basis='伪造')[0],403)

    def test_records_are_drafts_and_review_return_preserves_sources(self):
        t=self.inspect()
        t=self.change(t,'record',self.worker,type='巡查记录',text='现场日志',occurredAt='2026-11-17T09:00:00+08:00',evidence=[],confirm=True)
        self.assertEqual(t['records'][0]['status'],'draft')
        t=self.change(t,'mobile-complete',self.worker)
        self.assertEqual(self.raw('issue',self.worker,taskId=t['id'],revision=t['revision'],description='锁定')[0],409)
        t=self.change(t,'mobile-return',self.lead,text='补拍照片')
        self.assertEqual(t['stage'],'inspection');self.assertEqual(len(t['issues']),2)

    def test_selected_field_record_is_in_word_but_not_in_hazard_list(self):
        t=self.inspect()
        photo=self.post('upload',self.worker,projectId=self.pid,name='现场记录.png',base64=self.image,
                        occurredAt='2026-11-17T09:00:00+08:00')['id']
        t=self.change(t,'record',self.worker,type='现场日志',text='现场通道检查记录',
                      occurredAt='2026-11-17T09:00:00+08:00',evidence=[photo])
        t=self.change(t,'mobile-complete',self.worker)
        record_id=t['records'][0]['id']
        self.assertEqual(self.raw('mobile-select',self.lead,taskId=t['id'],revision=t['revision'],
                                 selectedIds=[record_id],reason='复核排除两项疑似隐患')[0],400)
        t=self.change(t,'mobile-select',self.lead,selectedIds=[record_id],reason='复核排除两项疑似隐患',
                      noHazard=True,text='检查通道及防护，复核未发现隐患')
        self.assertEqual(len(t['issues']),2)
        report=self.report(t)
        self.assertEqual(report['report']['issues'],[])
        self.assertTrue(report['report']['noHazard'])
        self.assertEqual(report['report']['fieldRecords'][0]['photos'],['evidence:'+photo])
        status,blob,_=self.request('/quality/api/work/combined-word/'+report['id'],token=self.lead)
        self.assertEqual(status,200)
        with zipfile.ZipFile(io.BytesIO(blob)) as doc:
            xml=doc.read('word/document.xml').decode()
            self.assertIn('附件3 现场记录',xml)
            self.assertIn('现场通道检查记录',xml)
            self.assertIn('本次在上述检查范围内未发现隐患',xml)
            self.assertIn('w:drawing',xml.split('附件3 现场记录')[1])


if __name__=='__main__': unittest.main()
