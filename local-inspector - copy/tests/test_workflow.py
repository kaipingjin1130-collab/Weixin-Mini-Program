import base64
import copy
import io
import json
import os
import unittest
import uuid
import zipfile
from unittest.mock import patch
import test_app as legacy
server=legacy.server
png=legacy.png


class Collaboration(unittest.TestCase):
 setUpClass=classmethod(legacy.Workflow.setUpClass.__func__)
 tearDownClass=classmethod(legacy.Workflow.tearDownClass.__func__)
 request=legacy.Workflow.request

 def setUp(self):
  _,r=self.request('/api/login',{'password':'automated-test-password'},False);self.admin=r['token'];self.token=self.admin
  _,r=self.request('/api/projects',{'name':'协同测试项目','contract':'测试合同'});self.pid=r['id']
  self.people={};self.tokens={}
  for role in ['manager','inspector','rectifier','reviewer','receiver']:
   username=role+'-'+uuid.uuid4().hex[:8]
   user=self.ok('users',dict(username=username,name=role,password='test-password-2026'))
   self.people[role]=user['id']
   self.ok('members',dict(projectId=self.pid,userId=user['id'],role=role))
   _,r=self.request('/api/login',dict(username=username,password='test-password-2026'),False)
   self.tokens[role]=r['token']
  self.token=self.tokens['manager']
  self.t=self.ok('tasks',dict(projectId=self.pid,scenarioId='inspection',title='现场巡查',object='二号楼',
    dueDate='2026-01-01',fields={'检查区域':'二层','检查重点':'防护'},assignee=self.people['inspector'],receiver=self.people['receiver']))
  self.ev=self.ok('upload',dict(projectId=self.pid,name='现场.png',base64=base64.b64encode(png()).decode(),occurredAt='2026-10-20T09:00:00+08:00'))
 def call(self,action,data=None):
  return self.request('/api/work/'+action,dict(data or {},requestId=uuid.uuid4().hex))
 def ok(self,action,data=None):
  status,result=self.call(action,data);self.assertEqual(status,200,result);return result
 def act(self,action,data=None,role='manager',expected=200):
  self.token=self.tokens[role]
  if action=='submit-field': data=dict(inspectors='检查员',signer='检查员',signature=self.ev['id'],**(data or {}))
  status,result=self.call(action,dict(taskId=self.t['id'],revision=self.t['revision'],**(data or {})))
  self.assertEqual(status,expected,result)
  if status==200:self.t=result
  return result
 def start(self):
  self.act('start',{'checklist':self.t['scenario']['checklist']},'inspector')
 def record(self,confirm=True):
  return dict(type='巡查记录',text='现场检查确认',occurredAt='2026-10-20T09:00:00+08:00',evidence=[self.ev['id']],confirm=confirm)
 def issue(self):
  return dict(description='防护缺失',risk='高',evidence=[self.ev['id']],dueDate='2026-01-02',assignee=self.people['rectifier'],reviewer=self.people['reviewer'])
 def field_received(self):
  self.act('submit-field',{'text':'现场检查完成，请平台接收'},'inspector')
  self.act('receive-field',{'text':'现场材料完整','decision':'accept'})
 def completed(self):
  self.start();self.act('record',self.record(),'inspector')
  self.act('issue',self.issue());self.field_received();iid=self.t['issues'][0]['id']
  self.act('reply',dict(issueId=iid,text='防护已补齐',evidence=[self.ev['id']]),'rectifier')
  self.act('review',dict(issueId=iid,text='现场复核合格',decision='close'),'reviewer')

 def test_manual_rectification_and_review(self):
  self.start();self.act('record',self.record(),'inspector')
  self.act('issue',self.issue());self.field_received();iid=self.t['issues'][0]['id']
  data=dict(issueId=iid,assigneeName=' 张工 ',reviewerName=' 李工 ',dueDate='2026-10-27',text='')
  self.act('reassign',dict(data,reviewerName='张工'),expected=400)
  self.act('reassign',dict(data,assigneeName=' '),expected=400)
  self.act('reassign',data)
  self.assertEqual(self.t['issues'][0]['assigneeName'],'张工')
  self.assertEqual(self.t['issues'][0]['history'][-1]['text'],'平台分派整改与复核')
  self.act('reply',dict(issueId=iid,text='完成',evidence=[self.ev['id']]),'rectifier',expected=403)
  self.act('reply',dict(issueId=iid,text='张工已完成',evidence=[self.ev['id']]))
  self.act('review',dict(issueId=iid,text='复核',decision='close'),'reviewer',expected=403)
  self.act('review',dict(issueId=iid,text='李工要求补充',decision='return'))
  self.act('reply',dict(issueId=iid,text='已补充',evidence=[self.ev['id']]))
  self.act('review',dict(issueId=iid,text='李工复核通过',decision='close'))
  item=self.t['issues'][0]
  self.assertEqual(item['status'],'closed')
  self.assertTrue(item['history'][-1]['recordedByManager'])
  self.assertEqual(item['history'][-1]['personName'],'李工')
  self.assertEqual(item['history'][-1]['actor'],self.people['manager'])

 def test_manual_receiver_on_field_receipt(self):
  self.token=self.tokens['inspector']
  self.t=self.ok('adhoc-tasks',self.adhoc_data())
  self.start();self.act('record',self.record(),'inspector')
  self.act('issue',self.issue())
  self.act('submit-field',{'text':'请接收'},'inspector')
  self.act('receive-field',{'text':'接收','decision':'accept','receiverName':'  '},expected=400)
  self.act('receive-field',{'text':'接收','decision':'accept','receiverName':' 李工 '})
  self.assertEqual(self.t['receiverName'],'李工')
  self.assertEqual(self.t['receiver'],'')

 def test_manual_receiver_handover(self):
  self.token=self.tokens['manager']
  payload=dict(projectId=self.pid,scenarioId='inspection',title='手填接收人',object='二号楼',dueDate='2026-01-01',fields={'检查区域':'二层','检查重点':'防护'},assignee=self.people['inspector'],receiverName='  外部接收人张工  ')
  self.t=self.ok('tasks',payload)
  self.assertEqual(self.t['receiverName'],'外部接收人张工')
  self.assertEqual(self.t['receiver'],'')
  self.completed()
  self.act('deliver',{'text':'交付'})
  self.act('accept',{'text':'接收','decision':'accept'},'receiver',expected=403)
  self.act('accept',{'text':'已向张工核实接收','decision':'accept'})
  self.assertTrue(self.t['receipt']['recordedByManager'])
  self.assertEqual(self.t['receipt']['actor'],self.people['manager'])
  self.act('archive')
  self.assertEqual(self.t['receiverName'],'外部接收人张工')
  status,_=self.call('tasks',dict(payload,receiverName='  '));self.assertEqual(status,400)

 def test_end_to_end_handover_archive_package_and_correction(self):
  self.completed()
  self.act('deliver',{'text':'检查整改已完成，请接收'})
  first=self.t['deliveries'][0]['id']
  status,original=self.request('/api/work/snapshot/'+first);self.assertEqual(status,200)
  self.act('accept',{'text':'资料齐全，接收','decision':'accept'},'receiver')
  self.act('archive')
  final=self.t['deliveries'][-1]['id']
  status,content=self.request('/api/work/package/'+final);self.assertEqual(status,200)
  with zipfile.ZipFile(io.BytesIO(content)) as z:
   s=json.loads(z.read('task.json'))
   self.assertEqual(s['task']['status'],'archived')
   self.assertEqual(s['task']['receipt']['actor'],self.people['receiver'])
   self.assertEqual(s['summary']['closed'],1)
   self.assertEqual(len(s['evidence']),1)
   self.assertIn(s['evidence'][0]['packagePath'],z.namelist())
   self.assertEqual(z.read(s['evidence'][0]['packagePath']),png())
   self.assertNotIn('filename',s['evidence'][0])
   self.assertIn(s['evidence'][0]['packagePath'],z.read('report.html').decode())
  status,word=self.request('/api/work/word/'+final);self.assertEqual(status,200)
  with zipfile.ZipFile(io.BytesIO(word)) as z:
   xml=z.read('word/document.xml').decode()
   self.assertIn('现场复核合格',xml);self.assertIn('接收意见',xml);self.assertIn('已归档',xml)
  self.act('record',self.record(),'inspector',409)
  self.act('reopen',{'text':'根据B反馈补充现场说明'})
  self.act('record',self.record(),'inspector')
  self.field_received();self.act('deliver',{'text':'补充记录后的新版本'})
  _,unchanged=self.request('/api/work/snapshot/'+first)
  self.assertEqual(original,unchanged)
  self.assertEqual(self.t['deliveries'][-1]['version'],3)
  self.assertNotIn('receipt',self.t)

 def test_roles_conflicts_and_read_isolation(self):
  self.act('start',{'checklist':self.t['scenario']['checklist']},'rectifier',403)
  self.start();stale=self.t['revision']
  self.act('record',self.record(),'inspector')
  status,_=self.call('record',dict(self.record(),taskId=self.t['id'],revision=stale));self.assertEqual(status,409)
  self.token=self.admin
  _,other=self.request('/api/projects',{'name':'隔离项目','contract':'另一个合同'})
  foreign=self.ok('upload',dict(projectId=other['id'],name='另一项目.png',base64=base64.b64encode(png()).decode(),occurredAt='2026-10-20T09:00:00+08:00'))
  self.token=self.tokens['inspector']
  self.assertEqual(self.request('/api/work/evidence/'+foreign['id'])[0],403)
  bad=self.record();bad['evidence']=[foreign['id']]
  self.act('record',bad,'inspector',403)
  for path in ['/api/state','/api/work/state']:
   _,s=self.request(path);self.assertNotIn(other['id'],[p['id'] for p in s['projects']])
  self.assertEqual(self.request('/api/projects',{'name':'越权','contract':'越权'})[0],403)

 def test_rectification_return_reassign_and_gates(self):
  self.start();self.act('record',self.record(),'inspector')
  issue=self.issue();issue['reviewer']=self.people['rectifier']
  self.act('issue',issue,expected=400)
  self.act('issue',self.issue());self.field_received();iid=self.t['issues'][0]['id']
  self.act('deliver',{'text':'不得提前交接'},expected=400)
  self.act('reply',dict(issueId=iid,text='无证据',evidence=[]),'rectifier',400)
  self.act('reply',dict(issueId=iid,text='整改说明',evidence=[self.ev['id']]),'rectifier')
  self.act('review',dict(issueId=iid,text='自己复核',decision='close'),'rectifier',403)
  self.act('review',dict(issueId=iid,text='需补充处理',decision='return'),'reviewer')
  self.assertEqual(self.t['issues'][0]['status'],'returned')
  self.act('reply',dict(issueId=iid,text='补充整改',evidence=[self.ev['id']]),'rectifier')
  self.act('review',dict(issueId=iid,text='符合要求',decision='close'),'reviewer')
  self.act('deliver',{'text':'交接'})
  self.act('accept',{'text':'冒领','decision':'accept'},'manager',403)
  self.act('archive',expected=409)
  self.act('accept',{'text':'补充资料','decision':'return'},'receiver')
  self.assertEqual(self.t['status'],'active')

 def test_idempotence_and_changed_request_rejection(self):
  self.start();self.token=self.tokens['inspector']
  data=dict(self.record(),taskId=self.t['id'],revision=self.t['revision'],requestId=uuid.uuid4().hex)
  status,first=self.request('/api/work/record',data);self.assertEqual(status,200)
  status,second=self.request('/api/work/record',data);self.assertEqual(status,200);self.assertEqual(first,second)
  data['text']='different';self.assertEqual(self.request('/api/work/record',data)[0],409)
  self.assertEqual(len(first['records']),1)

 def adhoc_data(self):
  return dict(projectId=self.pid,scenarioId='inspection',title='自主临时巡查',object='三号楼',
              dueDate='2026-10-22',fields={'检查区域':'三层','检查重点':'防护'})

 def test_adhoc_field_to_platform_full_lifecycle(self):
  self.token=self.tokens['inspector']
  self.t=self.ok('adhoc-tasks',dict(self.adhoc_data(),assignee=self.people['manager'],receiver=self.people['rectifier'],status='archived'))
  self.assertEqual(self.t['assignee'],self.people['inspector'])
  self.assertEqual(self.t['createdBy'],self.people['inspector'])
  self.assertEqual(self.t['source'],'adhoc');self.assertEqual(self.t['receiver'],'')
  self.assertEqual(self.t['status'],'ready')
  self.start();self.act('record',self.record(),'inspector')
  self.act('issue',dict(description='防护缺失',risk='高',evidence=[self.ev['id']]),'inspector')
  self.act('submit-field',{'text':'临时现场检查完成'},'inspector')
  self.token=self.tokens['manager'];_,s=self.request('/api/work/state')
  self.assertTrue(any(t['id']==self.t['id'] and t['source']=='adhoc' for t in s['tasks']))
  self.act('receive-field',{'text':'需要补充检查范围','decision':'return'})
  self.act('record',self.record(),'inspector')
  self.act('submit-field',{'text':'补充完成'},'inspector')
  self.act('receive-field',{'text':'接收','decision':'accept'},expected=400)
  self.act('receive-field',{'text':'接收','decision':'accept','receiver':self.people['rectifier']},expected=400)
  self.act('receive-field',{'text':'接收','decision':'accept','receiver':self.people['receiver']})
  iid=self.t['issues'][0]['id']
  self.act('reassign',dict(issueId=iid,assignee=self.people['rectifier'],reviewer=self.people['reviewer'],dueDate='2026-10-25',text='平台指定整改分工'))
  self.act('reply',dict(issueId=iid,text='防护已完善',evidence=[self.ev['id']]),'rectifier')
  self.act('review',dict(issueId=iid,text='复核合格',decision='close'),'reviewer')
  self.act('deliver',{'text':'临时巡查正式成果'})
  self.act('accept',{'text':'接收完整成果','decision':'accept'},'receiver');self.act('archive')
  _,s=self.request('/api/work/snapshot/'+self.t['deliveries'][-1]['id'])
  self.assertEqual(s['task']['source'],'adhoc');self.assertEqual(s['task']['status'],'archived')
  self.assertEqual(s['task']['createdBy'],self.people['inspector'])

 def test_adhoc_permissions_and_deduplication(self):
  self.assertEqual(self.t['source'],'platform')
  for role in ['rectifier','reviewer','receiver']:
   self.token=self.tokens[role];self.assertEqual(self.call('adhoc-tasks',self.adhoc_data())[0],403)
  self.token=self.admin;_,other=self.request('/api/projects',{'name':'无检查权限的项目','contract':'测试合同'})
  self.token=self.tokens['inspector']
  self.assertEqual(self.call('adhoc-tasks',dict(self.adhoc_data(),projectId=other['id']))[0],403)
  self.assertEqual(self.call('tasks',dict(self.adhoc_data(),assignee=self.people['inspector'],receiver=self.people['receiver']))[0],403)
  data=dict(self.adhoc_data(),requestId=uuid.uuid4().hex)
  status,a=self.request('/api/work/adhoc-tasks',data);self.assertEqual(status,200)
  status,b=self.request('/api/work/adhoc-tasks',data);self.assertEqual(status,200);self.assertEqual(a,b)
  _,s=self.request('/api/work/state');self.assertEqual(len([t for t in s['tasks'] if t['id']==a['id']]),1)
  data['title']='不同任务';self.assertEqual(self.request('/api/work/adhoc-tasks',data)[0],409)

 def test_mobile_submission_platform_return_and_brief_versions(self):
  self.start();self.act('record',self.record(),'inspector')
  self.act('issue',dict(description='现场发现的问题',risk='中',evidence=[self.ev['id']]),'inspector')
  self.assertEqual(self.t['issues'][0]['status'],'unassigned')
  self.act('reassign',dict(issueId=self.t['issues'][0]['id'],assignee=self.people['rectifier'],reviewer=self.people['reviewer'],dueDate='2026-10-22',text='提前分派'),expected=409)
  self.act('submit-field',{'text':'现场检查简报'},'inspector')
  bid=self.t['fieldBriefs'][0]['id']
  _,original=self.request('/api/work/brief-data/'+bid)
  status,word=self.request('/api/work/brief-word/'+bid);self.assertEqual(status,200)
  with zipfile.ZipFile(io.BytesIO(word)) as z:
   xml=z.read('word/document.xml').decode()
   self.assertIn('非正式审核报告',xml);self.assertIn('现场发现的问题',xml)
   self.assertEqual(len([n for n in z.namelist() if n.startswith('word/media/')]),2)
  self.act('record',self.record(),'inspector',409)
  self.act('submit-field',{'text':'重复上报'},'inspector',409)
  self.act('receive-field',{'text':'补充检查范围','decision':'return'})
  self.act('record',self.record(),'inspector')
  self.act('submit-field',{'text':'补充后的简报'},'inspector')
  self.assertEqual(len(self.t['fieldBriefs']),2)
  _,frozen=self.request('/api/work/brief-data/'+bid);self.assertEqual(original,frozen)
  self.act('receive-field',{'text':'现场端不得接收','decision':'accept'},'inspector',403)
  self.act('receive-field',{'text':'材料齐全','decision':'accept'})

 def test_drafts_freeze_and_second_scenario_version(self):
  self.start();self.act('record',self.record(False),'inspector')
  self.act('deliver',{'text':'草稿不可交接'},expected=400)
  record=self.record();record['id']=self.t['records'][0]['id'];self.act('record',record,'inspector')
  self.act('record',record,'inspector',409)
  self.token=self.admin
  _,s=self.request('/api/work/state');scenario=copy.deepcopy(s['scenarios'][1])
  scenario['fields'].append('验收批次')
  updated=self.ok('scenarios',{'scenario':scenario,'baseVersion':1})
  self.assertEqual(updated['version'],2)
  data=dict(projectId=self.pid,scenarioId=scenario['id'],title='设备验收',object='设备A',dueDate='2026-10-21',
    fields={f:'测试值' for f in updated['fields']},assignee=self.people['inspector'],receiver=self.people['receiver'])
  task=self.ok('tasks',data);self.assertEqual(task['scenario']['version'],2)
  self.assertIn('验收批次',task['fields']);self.assertEqual(self.t['scenario']['version'],1)
  # Restore scenario for independent subsequent tests using its current base.
  scenario['fields'].remove('验收批次');self.ok('scenarios',{'scenario':scenario,'baseVersion':2})

 def test_knowledge_and_recognition_fallback_do_not_mutate_task(self):
  with patch.dict(os.environ,{'QAXC_KNOWLEDGE_URL':'','QAXC_RECOGNITION_URL':''}):
   result=self.ok('knowledge',{'taskId':self.t['id'],'question':'临边检查'})
   self.assertEqual(result['status'],'fallback')
   result=self.ok('recognize',{'taskId':self.t['id'],'evidenceId':self.ev['id'],'kind':'image/png'})
   self.assertEqual(result['status'],'manual');self.assertEqual(result['text'],'')
  with patch.dict(os.environ,{'QAXC_KNOWLEDGE_URL':'https://example.invalid/knowledge'}),patch('workflow.urlopen',side_effect=OSError('unavailable')):
   self.assertEqual(self.ok('knowledge',{'taskId':self.t['id'],'question':'检查'})['status'],'fallback')
  _,s=self.request('/api/work/state');self.assertEqual(next(t for t in s['tasks'] if t['id']==self.t['id'])['revision'],1)
  self.assertTrue(any(r['taskId']==self.t['id'] for r in s['reminders']))

 def test_legacy_report_import_without_duplicate_facts(self):
  self.token=self.admin
  _,c=self.request('/api/codes',{'projectId':self.pid,'participants':'测试员'})
  _,m=self.request('/api/media',{'base64':base64.b64encode(png()).decode()})
  _,r=self.request('/api/reports',dict(codeId=c['id'],date='2026-10-20',inspector='测试员',scope='原报告现场记录',signature=m['id'],noHazard=False,submit=True,issues=[dict(category='安全',risk='高',description='防护缺失',photos=[m['id']])]))
  self.start();self.act('import-report',{'reportId':r['id']})
  self.assertEqual(self.t['records'][0]['sourceReportId'],r['id'])
  self.assertEqual(self.t['issues'][0]['status'],'unassigned')
  self.act('import-report',{'reportId':r['id']},expected=409)
  issue=self.issue();issue.update(issueId=self.t['issues'][0]['id'],text='指定处理人员')
  self.field_received();self.act('reassign',issue);self.assertEqual(self.t['issues'][0]['status'],'assigned')

 def test_snapshot_and_evidence_require_membership(self):
  self.completed();self.act('deliver',{'text':'交接'})
  did=self.t['deliveries'][0]['id']
  self.token=self.admin
  username='outsider-'+uuid.uuid4().hex[:8]
  self.ok('users',dict(username=username,name='无权限人员',password='test-password-2026'))
  _,r=self.request('/api/login',dict(username=username,password='test-password-2026'),False);self.token=r['token']
  for path in ['/api/work/package/'+did,'/api/work/report/'+did,'/api/work/evidence/'+self.ev['id']]:
   self.assertEqual(self.request(path)[0],403)
  _,s=self.request('/api/work/state');self.assertEqual(s['tasks'],[]);self.assertEqual(s['projects'],[])

 def test_structured_hazard_survives_brief_and_platform_exports(self):
  self.start();self.act('record',self.record(),'inspector')
  fields=dict(category='施工安全',subcategory='临边防护',location='三号楼二层',reference='经核实的项目依据',suggestion='补齐防护设施')
  self.act('issue',dict(description='栏杆缺失',risk='高',evidence=[self.ev['id']],**fields),'inspector')
  self.act('submit-field',{'text':'现场检查完成'},'inspector')
  bid=self.t['fieldBriefs'][-1]['id']
  _,snap=self.request('/api/work/brief-data/'+bid)
  for key,value in fields.items():self.assertEqual(snap['task']['issues'][0][key],value)
  _,word=self.request('/api/work/brief-word/'+bid)
  with zipfile.ZipFile(io.BytesIO(word)) as z:
   xml=z.read('word/document.xml').decode()
   for value in fields.values():self.assertIn(value,xml)
  html=server.workflow.report_html(snap)
  self.assertIn('三号楼二层',html);self.assertIn('补齐防护设施',html)

 def test_adhoc_inspection_optional_fields(self):
  self.token=self.tokens['inspector']
  for fields in [{},{'检查区域':'','检查重点':'   '},{'检查区域':'二层','检查重点':''}]:
   task=self.ok('adhoc-tasks',dict(self.adhoc_data(),fields=fields,object=''))
   self.assertEqual(task['object'],'')
   self.assertEqual(task['fields']['检查重点'],'')
   self.assertEqual(task['fields']['检查区域'],fields.get('检查区域',''))
  self.assertEqual(self.call('adhoc-tasks',dict(self.adhoc_data(),fields={'检查区域':[]}))[0],400)
  self.token=self.tokens['manager']
  self.assertEqual(self.call('tasks',dict(self.adhoc_data(),fields={},assignee=self.people['inspector'],receiver=self.people['receiver']))[0],400)

 def test_multiple_hazards_without_records_in_brief(self):
  self.start()
  for n in range(1,4):
   self.act('issue',dict(description=f'独立隐患{n}',category='施工安全',risk='中',evidence=[self.ev['id']]),'inspector')
  self.act('submit-field',{'text':'三条隐患汇总'},'inspector')
  bid=self.t['fieldBriefs'][-1]['id']
  _,snap=self.request('/api/work/brief-data/'+bid)
  self.assertEqual(snap['task']['records'],[])
  self.assertEqual(len(snap['task']['issues']),3)
  _,word=self.request('/api/work/brief-word/'+bid)
  with zipfile.ZipFile(io.BytesIO(word)) as z:
   xml=z.read('word/document.xml').decode()
   for n in range(1,4):self.assertIn(f'独立隐患{n}',xml)
  for issue in snap['task']['issues']:self.assertEqual(issue['evidence'],[self.ev['id']])

 def test_adhoc_handover_optional_fields(self):
  self.token=self.tokens['inspector']
  for fields in [{},{'设备编号':'','验收范围':'   '},{'设备编号':' EQ-001 ','验收范围':''}]:
   task=self.ok('adhoc-tasks',dict(self.adhoc_data(),scenarioId='handover',fields=fields))
   self.assertEqual(task['fields']['验收范围'],'')
   self.assertEqual(task['fields']['设备编号'],fields.get('设备编号','').strip())
  for value in [[], 'x'*1001]:
   self.assertEqual(self.call('adhoc-tasks',dict(self.adhoc_data(),scenarioId='handover',fields={'设备编号':value}))[0],400)

 def test_signature_required_and_frozen_in_brief(self):
  self.start();self.act('record',self.record(),'inspector')
  self.act('issue',self.issue())
  self.token=self.tokens['inspector']
  payload=dict(taskId=self.t['id'],revision=self.t['revision'],text='检查完成',inspectors='张三、李四',signer='张三')
  self.assertEqual(self.call('submit-field',payload)[0],400)
  self.assertEqual(self.call('submit-field',dict(payload,signature=self.ev['id'],signer='其他人'))[0],400)
  self.t=self.ok('submit-field',dict(payload,signature=self.ev['id']))
  _,snap=self.request('/api/work/brief-data/'+self.t['fieldBriefs'][-1]['id'])
  self.assertEqual(snap['task']['inspectors'],'张三、李四')
  self.assertEqual(snap['task']['fieldSignature']['name'],'张三')
  self.assertIn(self.ev['id'],[e['id'] for e in snap['evidence']])

 def test_brief_requires_saved_hazard(self):
  self.start();self.act('record',self.record(),'inspector')
  revision=self.t['revision']
  error=self.act('submit-field',{'text':'只有摘要和记录'},'inspector',400)
  self.assertIn('至少保存一条隐患',error['error'])
  self.token=self.tokens['inspector']
  _,state=self.request('/api/work/state')
  task=next(t for t in state['tasks'] if t['id']==self.t['id'])
  self.assertEqual(task['revision'],revision)
  self.assertEqual(task['fieldBriefs'],[])
  self.assertEqual(task['fieldStatus'],'collecting')
  self.act('issue',self.issue())
  self.act('submit-field',{'text':'一条隐患已保存'},'inspector')
  self.assertEqual(len(self.t['fieldBriefs']),1)
