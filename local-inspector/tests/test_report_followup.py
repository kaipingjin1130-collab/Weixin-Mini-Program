import json
import unittest
import uuid
import test_app as legacy


class ReportFollowup(unittest.TestCase):
 setUpClass=classmethod(legacy.Workflow.setUpClass.__func__)
 tearDownClass=classmethod(legacy.Workflow.tearDownClass.__func__)
 setUp=legacy.Workflow.setUp
 request=legacy.Workflow.request
 report=legacy.Workflow.report

 def post(self,action,**data):
  return self.request('/api/work/'+action,dict(data,requestId=uuid.uuid4().hex))

 def submit(self,no_hazard=False):
  data=self.report()
  if no_hazard:data.update(noHazard=True,issues=[])
  status,r=self.request('/api/reports',dict(data,submit=True))
  self.assertEqual(status,200,r);return r

 def test_report_to_rectification_review_and_archive(self):
  original=self.submit()
  status,t=self.post('report-followup',reportId=original['id'],receiverName='成果接收人',dueDate='2026-11-01')
  self.assertEqual(status,200,t)
  self.assertEqual(t['fieldStatus'],'accepted')
  self.assertEqual(t['records'][0]['sourceReport'],original)
  self.assertEqual(t['issues'][0]['reference'],original['issues'][0]['reference'])
  status,again=self.post('report-followup',reportId=original['id'])
  self.assertEqual(status,200);self.assertEqual(again['id'],t['id'])
  def act(action,expected=200,**d):
   nonlocal t
   code,value=self.post(action,taskId=t['id'],revision=t['revision'],**d)
   self.assertEqual(code,expected,value)
   if code==200:t=value
  act('archive',409)
  act('deliver',400,text='不能提前生成')
  iid=t['issues'][0]['id'];evidence=t['issues'][0]['evidence']
  act('reassign',issueId=iid,assigneeName='张工',reviewerName='李工',dueDate='2026-11-01')
  act('reply',issueId=iid,text='整改完成',evidence=evidence)
  act('review',issueId=iid,text='照片不清楚，请补充',decision='return')
  act('reply',issueId=iid,text='已补充整改证据',evidence=evidence)
  act('review',issueId=iid,text='复核合格',decision='close')
  act('deliver',text='已完成全部整改复核')
  act('archive',409)
  act('accept',decision='accept',text='已确认接收')
  act('archive')
  self.assertEqual(t['status'],'archived')
  status,package=self.request('/api/work/package/'+t['deliveries'][-1]['id'])
  self.assertEqual(status,200)
  import zipfile,io
  with zipfile.ZipFile(io.BytesIO(package)) as z:
   snap=json.loads(z.read('task.json'))
   self.assertEqual(snap['task']['status'],'archived')
   self.assertEqual(snap['task']['records'][0]['sourceReport']['signatures'],original['signatures'])
  status,state=self.request('/api/state')
  self.assertEqual(next(r for r in state['reports'] if r['id']==original['id']),original)

 def test_no_hazard_report_can_proceed_without_fake_rectification(self):
  r=self.submit(True)
  status,t=self.post('report-followup',reportId=r['id'],receiverName='接收人',dueDate='2026-11-01')
  self.assertEqual(status,200,t);self.assertTrue(t['noHazard']);self.assertEqual(t['issues'],[])
  status,result=self.post('deliver',taskId=t['id'],revision=t['revision'],text='无隐患，提交成果')
  self.assertEqual(status,200,result)

 def test_draft_and_unauthorized_report_cannot_start_followup(self):
  status,r=self.request('/api/reports',self.report())
  self.assertEqual(self.post('report-followup',reportId=r['id'],receiverName='接收人',dueDate='2026-11-01')[0],409)
  r=self.submit()
  username='outsider'+uuid.uuid4().hex[:8]
  self.post('users',username=username,name='其他用户',password='test-password-2026')
  _,login=self.request('/api/login',dict(username=username,password='test-password-2026'),False)
  self.token=login['token']
  self.assertEqual(self.post('report-followup',reportId=r['id'],receiverName='接收人',dueDate='2026-11-01')[0],403)
