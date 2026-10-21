"""Developer A workflow. SQLite transactions are owned by server.Handler."""
import base64
import copy
import csv
import hashlib
import hmac
import io
import json
import os
import re
import secrets
import zipfile
from datetime import datetime, timedelta
from urllib.request import Request, urlopen

SCENARIOS = [
 dict(id='inspection', version=1, name='质量安全巡查', projectType='建设工程',
      fields=['检查区域', '检查重点'], checklist=['任务资料已核对', '人员分工已确认', '现场安全条件已确认'],
      recordTypes=['巡查记录', '现场日志', '交底记录'], roles=['manager','inspector','rectifier','reviewer','receiver'],
      workflow=dict(requireEvidence=True, separateReviewer=True, defaultDays=7),
      report=dict(title='质量安全巡查成果', sections=['任务信息','确认记录','问题清单','操作日志','交接摘要'])),
 dict(id='handover', version=1, name='设备交接验收', projectType='设备工程',
      fields=['设备编号', '验收范围'], checklist=['设备清单已核对', '技术资料已核对', '验收人员已到位'],
      recordTypes=['验收记录', '运行记录', '交接记录'], roles=['manager','inspector','rectifier','reviewer','receiver'],
      workflow=dict(requireEvidence=True, separateReviewer=True, defaultDays=3),
      report=dict(title='设备交接验收成果', sections=['任务信息','确认记录','问题清单','操作日志','交接摘要']))
]
ROLES = ['manager', 'inspector', 'rectifier', 'reviewer', 'receiver']
STATUS = {'ready':'待执行','active':'执行中','handover':'待接收','accepted':'已接收','archived':'已归档'}


def init(c):
 c.executescript('''
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, name TEXT NOT NULL, salt TEXT NOT NULL, digest TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS memberships(project_id TEXT NOT NULL REFERENCES projects(id), user_id TEXT NOT NULL REFERENCES users(id), role TEXT NOT NULL, PRIMARY KEY(project_id,user_id));
 CREATE TABLE IF NOT EXISTS tasks(id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), payload TEXT NOT NULL, revision INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS evidence(id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), payload TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS deliveries(id TEXT PRIMARY KEY, task_id TEXT NOT NULL REFERENCES tasks(id), version INTEGER NOT NULL, payload TEXT NOT NULL, UNIQUE(task_id,version));
 CREATE TABLE IF NOT EXISTS operations(user_id TEXT NOT NULL, request_id TEXT NOT NULL, fingerprint TEXT NOT NULL, result TEXT NOT NULL, PRIMARY KEY(user_id,request_id));
 CREATE TABLE IF NOT EXISTS scenarios(id TEXT PRIMARY KEY, payload TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS field_reports(id TEXT PRIMARY KEY, task_id TEXT NOT NULL REFERENCES tasks(id), payload TEXT NOT NULL);
 ''')
 for s in SCENARIOS:
  c.execute('INSERT OR IGNORE INTO scenarios VALUES(?,?)',(s['id'],dump(s)))


def dump(x): return json.dumps(x,ensure_ascii=False)
def public_user(r): return {k:r[k] for k in ('id','username','name')}
def login(c,username,password):
 r=c.execute('SELECT * FROM users WHERE username=?',(username,)).fetchone()
 if not r: return None
 digest=hashlib.pbkdf2_hmac('sha256',password.encode(),bytes.fromhex(r['salt']),200000).hex()
 return public_user(r) if hmac.compare_digest(digest,r['digest']) else None


class Workflow:
 def __init__(self,s,c,user): self.s,self.c,self.user=s,c,user
 def fail(self,msg,status=400): raise self.s.Problem(msg,status)
 def text(self,d,k,n=4000): return self.s.required(d,k,n)
 def role(self,pid):
  if not self.c.execute('SELECT 1 FROM projects WHERE id=?',(pid,)).fetchone(): self.fail('项目不存在',404)
  if self.user['id']=='admin': return 'admin'
  r=self.c.execute('SELECT role FROM memberships WHERE project_id=? AND user_id=?',(pid,self.user['id'])).fetchone()
  if not r: self.fail('无此项目访问权限',403)
  return r['role']
 def allow(self,pid,roles):
  role=self.role(pid)
  if role!='admin' and role not in roles: self.fail('当前项目角色不能执行此操作',403)
 def task(self,tid):
  r=self.c.execute('SELECT payload FROM tasks WHERE id=?',(tid,)).fetchone()
  if not r: self.fail('任务不存在',404)
  t=json.loads(r['payload']);self.role(t['projectId']);return t
 def member(self,pid,uid,roles=None):
  r=self.c.execute('SELECT role FROM memberships WHERE project_id=? AND user_id=?',(pid,uid)).fetchone()
  if not r or (roles and r['role'] not in roles): self.fail('请选择符合角色要求的项目成员')
  return uid
 def evidence(self,pid,ids):
  if not isinstance(ids,list) or len(ids)>30 or any(not isinstance(x,str) for x in ids): self.fail('证据列表格式错误（最多30项）')
  for eid in ids:
   r=self.c.execute('SELECT project_id FROM evidence WHERE id=?',(eid,)).fetchone()
   if not r or r['project_id']!=pid: self.fail('证据不存在或不属于当前项目',403)
  return list(dict.fromkeys(ids))
 def stamp(self,t,action,detail=''):
  t['events'].append(dict(id=self.s.uid(),action=action,detail=detail,actor=self.user['id'],actorName=self.user['name'],uploadedAt=self.s.now()))
 def persist(self,t):
  t['revision']+=1;t['updatedAt']=self.s.now()
  self.c.execute('UPDATE tasks SET payload=?,revision=? WHERE id=?',(dump(t),t['revision'],t['id']))
  return t
 def checkdate(self,value):
  try: datetime.strptime(value,'%Y-%m-%d')
  except (ValueError,TypeError): self.fail('日期请使用 YYYY-MM-DD')
  return value
 def checktime(self,value):
  try:
   dt=datetime.fromisoformat(value)
   if dt.tzinfo is None: self.fail('发生时间需包含时区')
  except (ValueError,TypeError): self.fail('发生时间请使用含时区的 ISO 时间')
  return value
 def state(self):
  projects=[]
  for r in self.c.execute('SELECT * FROM projects ORDER BY created DESC'):
   try: role=self.role(r['id'])
   except self.s.Problem: continue
   p=dict(r);p['role']=role
   p['members']=[dict(x) for x in self.c.execute('SELECT u.id,u.username,u.name,m.role FROM users u JOIN memberships m ON m.user_id=u.id WHERE m.project_id=?',(p['id'],))]
   projects.append(p)
  ids={p['id'] for p in projects}
  tasks=[json.loads(r['payload']) for r in self.c.execute('SELECT * FROM tasks ORDER BY rowid DESC') if r['project_id'] in ids]
  today=datetime.now().astimezone().date().isoformat()
  reminders=[]
  for t in tasks:
   if t['status']!='archived' and t['dueDate']<today: reminders.append(dict(taskId=t['id'],text=t['title']+'：任务逾期'))
   for i in t['issues']:
    if i['status']!='closed' and i['dueDate']<today: reminders.append(dict(taskId=t['id'],text=t['title']+'：问题逾期 '+i['description']))
  users=[public_user(r) for r in self.c.execute('SELECT * FROM users')] if self.user['id']=='admin' else []
  return dict(user=self.user,projects=projects,tasks=tasks,users=users,scenarios=[json.loads(r[0]) for r in self.c.execute('SELECT payload FROM scenarios')],reminders=reminders)
 def snapshot(self,t,version):
  evidence_ids=set(t['materials'])
  if t.get('fieldSignature'): evidence_ids.add(t['fieldSignature']['evidenceId'])
  for r in t['records']: evidence_ids.update(r['evidence'])
  for i in t['issues']:
   evidence_ids.update(i['evidence'])
   for reply in i['history']: evidence_ids.update(reply.get('evidence',[]))
  evidence=[json.loads(self.c.execute('SELECT payload FROM evidence WHERE id=?',(eid,)).fetchone()[0]) for eid in sorted(evidence_ids)]
  p=dict(self.c.execute('SELECT * FROM projects WHERE id=?',(t['projectId'],)).fetchone())
  members=[dict(r) for r in self.c.execute('SELECT u.id,u.name,m.role FROM memberships m JOIN users u ON u.id=m.user_id WHERE m.project_id=?',(t['projectId'],))]
  return dict(schemaVersion='1.0',packageId=self.s.uid(),version=version,exportedAt=self.s.now(),project=p,members=members,
              scenario=copy.deepcopy(t['scenario']),task=copy.deepcopy(t),evidence=evidence,
              summary=dict(records=len(t['records']),issues=len(t['issues']),closed=sum(i['status']=='closed' for i in t['issues'])))
 def delivery(self,did):
  r=self.c.execute('SELECT * FROM deliveries WHERE id=?',(did,)).fetchone()
  if not r: self.fail('成果不存在',404)
  self.task(r['task_id'])
  return json.loads(r['payload'])
 def dispatch(self,path,d):
  if path=='users':
   if self.user['id']!='admin': self.fail('只有管理员可以创建账号',403)
   username=self.text(d,'username',60)
   if not re.fullmatch(r'[A-Za-z0-9_.-]{3,60}',username) or username=='admin': self.fail('账号需为3到60位字母、数字或 ._-，且不能是 admin')
   password=self.text(d,'password',200)
   if len(password)<12: self.fail('密码至少12位')
   uid=self.s.uid();salt=secrets.token_hex(16)
   digest=hashlib.pbkdf2_hmac('sha256',password.encode(),bytes.fromhex(salt),200000).hex()
   self.c.execute('INSERT INTO users VALUES(?,?,?,?,?)',(uid,username,self.text(d,'name',100),salt,digest))
   return {'id':uid}
  if path=='members':
   pid=self.text(d,'projectId');self.allow(pid,['manager'])
   role=d.get('role')
   if role not in ROLES: self.fail('角色不支持')
   if self.user['id']!='admin' and role=='manager': self.fail('管理员负责指定项目负责人',403)
   uid=d.get('userId')
   if not uid:
    row=self.c.execute('SELECT id FROM users WHERE username=?',(d.get('username'),)).fetchone()
    uid=row['id'] if row else None
   if not self.c.execute('SELECT 1 FROM users WHERE id=?',(uid,)).fetchone(): self.fail('账号不存在，请管理员先创建')
   if uid==self.user['id']: self.fail('请由管理员调整自己的角色')
   self.c.execute('INSERT OR REPLACE INTO memberships VALUES(?,?,?)',(pid,uid,role))
   return {'ok':True}
  if path=='scenarios':
   if self.user['id']!='admin': self.fail('只有管理员可发布场景配置',403)
   s=d.get('scenario')
   if not isinstance(s,dict): self.fail('场景格式错误')
   self.text(s,'id',60);self.text(s,'name',100);self.text(s,'projectType',100)
   if not re.fullmatch(r'[a-z0-9_-]+',s['id']): self.fail('场景编码仅支持小写字母、数字及 _-')
   for key in ['fields','checklist','recordTypes','roles']:
    if not isinstance(s.get(key),list) or not s[key] or len(s[key])>30 or any(not isinstance(x,str) or not x.strip() or len(x)>100 for x in s[key]): self.fail('场景列表配置不正确：'+key)
   if set(s['roles'])!=set(ROLES): self.fail('本版流程需保留五种角色')
   w=s.get('workflow',{})
   if type(w.get('requireEvidence')) is not bool or type(w.get('separateReviewer')) is not bool or type(w.get('defaultDays')) is not int or not 1<=w['defaultDays']<=365: self.fail('流程配置不正确')
   report=s.get('report',{});self.text(report,'title',100)
   allowed=['任务信息','确认记录','问题清单','操作日志','交接摘要']
   if not isinstance(report.get('sections'),list) or not report['sections'] or len(set(report['sections']))!=len(report['sections']) or any(x not in allowed for x in report['sections']): self.fail('报告章节配置不支持')
   old=self.c.execute('SELECT payload FROM scenarios WHERE id=?',(s['id'],)).fetchone()
   expected=json.loads(old[0])['version'] if old else 0
   if d.get('baseVersion')!=expected: self.fail('场景已更新，请刷新后重试',409)
   s=copy.deepcopy(s);s['version']=expected+1
   self.c.execute('INSERT OR REPLACE INTO scenarios VALUES(?,?)',(s['id'],dump(s)));return s
  if path in ['tasks','adhoc-tasks']:
   adhoc=path=='adhoc-tasks'
   pid=self.text(d,'projectId');self.allow(pid,['manager','inspector'] if adhoc else ['manager'])
   row=self.c.execute('SELECT payload FROM scenarios WHERE id=?',(d.get('scenarioId'),)).fetchone()
   if not row: self.fail('场景不存在')
   scenario=json.loads(row[0]);fields=d.get('fields',{})
   if not isinstance(fields,dict): self.fail('任务字段格式错误')
   optional={'inspection':{'检查区域','检查重点'},'handover':{'设备编号','验收范围'}}.get(scenario['id'],set()) if adhoc else set()
   values={}
   for k in scenario['fields']:
    if k in optional:
     value=fields.get(k,'')
     if not isinstance(value,str) or len(value)>1000: self.fail('任务字段格式错误')
     values[k]=value.strip()
    else: values[k]=self.text(fields,k,1000)
   inspectors=d.get('inspectors','')
   if not isinstance(inspectors,str) or len(inspectors)>1000: self.fail('检查人员名单格式错误')
   fields=values
   obj=d.get('object','') if adhoc else self.text(d,'object',200)
   if not isinstance(obj,str) or len(obj)>200: self.fail('检查对象格式错误或超过200字')
   t=dict(id=self.s.uid(),number='TASK-'+datetime.now().strftime('%Y%m%d')+'-'+secrets.token_hex(4).upper(),
          projectId=pid,inspectors=inspectors.strip(),title=self.text(d,'title',200),objectId=self.s.uid(),object=obj.strip(),
          dueDate=self.checkdate(d.get('dueDate')),scenario=scenario,fields=fields,materials=self.evidence(pid,d.get('materials',[])),
          checklist=[],assignee=self.user['id'] if adhoc else self.member(pid,d.get('assignee'),['inspector','manager']),
          receiver='' if adhoc or 'receiverName' in d else self.member(pid,d.get('receiver'),['receiver','manager']),
          receiverName='' if adhoc or 'receiverName' not in d else self.text(d,'receiverName',100),
          source='adhoc' if adhoc else 'platform',createdBy=self.user['id'],createdByName=self.user['name'],
          status='ready',fieldStatus='collecting',fieldBriefs=[],revision=1,records=[],issues=[],events=[],deliveries=[],createdAt=self.s.now(),updatedAt=self.s.now())
   self.stamp(t,'create','现场自主发起临时巡查' if adhoc else '平台建立派发任务')
   self.c.execute('INSERT INTO tasks VALUES(?,?,?,?)',(t['id'],pid,dump(t),1));return t
  if path=='knowledge':
   t=self.task(d.get('taskId'))
   return self.adapter('knowledge',dict(scene=t['scenario']['id'],version=t['scenario']['version'],object=t['object'],question=self.text(d,'question')),
                       {'status':'fallback','version':'demo-1','items':self.s.KNOWLEDGE,'message':'当前使用演示检查提示，非已核验规范；业务流程可独立运行。'})
  if path=='recognize':
   t=self.task(d.get('taskId'));self.evidence(t['projectId'],[d.get('evidenceId')])
   m=json.loads(self.c.execute('SELECT payload FROM evidence WHERE id=?',(d['evidenceId'],)).fetchone()[0])
   payload={'kind':d.get('kind'),'evidenceId':d.get('evidenceId'),'taskId':t['id'],'mime':m['mime'],'sha256':m['sha256']}
   if os.environ.get('QAXC_RECOGNITION_URL'): payload['base64']=base64.b64encode((self.s.DATA/'uploads'/m['filename']).read_bytes()).decode()
   return self.adapter('recognition',payload,
                       {'status':'manual','text':'','message':'未配置可用的识别服务，请听取录音或查看照片后人工填写并确认。'})
  t=self.task(d.get('taskId'));pid=t['projectId']
  if d.get('revision')!=t['revision']: self.fail('任务已更新，请刷新后重试，避免覆盖他人修改',409)
  if t['status']=='archived' and path!='reopen': self.fail('归档任务只读，请负责人发起补正后再操作',409)
  if path=='reopen':
   self.allow(pid,['manager'])
   if t['status'] not in ['archived','accepted']: self.fail('仅已接收或归档任务可发起补正',409)
   self.text(d,'text');t['status']='active';t['fieldStatus']='collecting';t.pop('archivedAt',None);t.pop('receipt',None)
  elif path=='submit-field':
   self.allow(pid,['manager','inspector'])
   if self.role(pid)=='inspector' and self.user['id']!=t['assignee']: self.fail('由任务执行人汇总上报',403)
   if t['status']!='active' or t.get('fieldStatus','collecting')!='collecting': self.fail('当前不能重复上报现场记录',409)
   if any(r['status']!='confirmed' for r in t['records']): self.fail('请先在网页平台确认历史现场记录草稿')
   if not t['issues']: self.fail('请至少保存一条隐患记录后再生成简报')
   inspectors=self.text(d,'inspectors',1000)
   signer=self.text(d,'signer',100)
   names=[n.strip() for n in re.split(r'[,，、;；\n]+',inspectors) if n.strip()]
   if signer not in names: self.fail('签名人须在检查人员名单中')
   sid=self.text(d,'signature',200);self.evidence(pid,[sid])
   meta=json.loads(self.c.execute('SELECT payload FROM evidence WHERE id=?',(sid,)).fetchone()[0])
   if not meta['mime'].startswith('image/'): self.fail('签名必须为图片')
   t['inspectors']=inspectors
   t['fieldSignature']=dict(name=signer,evidenceId=sid,signedAt=self.s.now(),submittedBy=self.user['id'])
   t['fieldSummary']=self.text(d,'text');t['fieldStatus']='submitted'
   bid=self.s.uid();briefs=t.setdefault('fieldBriefs',[]);version=len(briefs)+1
   briefs.append(dict(id=bid,version=version,createdAt=self.s.now()))
   self.stamp(t,path,t['fieldSummary']);self.persist(t)
   snap=self.snapshot(t,version);snap['documentKind']='field-brief'
   snap['task']['scenario']['report']=dict(title='现场检查简报（现场上报材料，非正式审核报告）',sections=['任务信息','确认记录','问题清单','交接摘要'])
   snap['task']['handoverSummary']=t['fieldSummary']
   self.c.execute('INSERT INTO field_reports VALUES(?,?,?)',(bid,t['id'],dump(snap)));return t
  elif path=='receive-field':
   self.allow(pid,['manager'])
   if t['status']!='active' or t.get('fieldStatus') not in ['submitted','accepted']: self.fail('尚无待接收的现场上报',409)
   if d.get('decision') not in ['accept','return']: self.fail('请选择接收或退回')
   self.text(d,'text')
   if d['decision']=='accept' and not (t.get('receiver') or t.get('receiverName')):
    if 'receiverName' in d: t['receiverName']=self.text(d,'receiverName',100)
    else: t['receiver']=self.member(pid,d.get('receiver'),['receiver','manager'])
   t['fieldStatus']='accepted' if d['decision']=='accept' else 'collecting'
   t['fieldFeedback']=dict(text=d['text'],decision=d['decision'],actor=self.user['id'],uploadedAt=self.s.now())
  elif path in ['start','materials']:
   self.allow(pid,['manager','inspector'])
   if self.role(pid)=='inspector' and t['assignee']!=self.user['id']: self.fail('仅任务执行人可操作',403)
   if path=='materials':
    if t['status'] not in ['ready','active']: self.fail('交接后不能修改资料',409)
    t['materials']=self.evidence(pid,d.get('evidence',[]))
   else:
    if t['status']!='ready': self.fail('任务已经开始',409)
    if d.get('checklist')!=t['scenario']['checklist']: self.fail('请逐项确认全部准备清单')
    t['checklist']=d['checklist'];t['status']='active'
  elif path=='record':
   self.allow(pid,['manager','inspector'])
   if t['status']!='active': self.fail('仅执行中任务可记录',409)
   if t.get('fieldStatus','collecting')!='collecting': self.fail('现场材料已上报，请平台退回补充后新增记录',409)
   old=next((r for r in t['records'] if r['id']==d.get('id')),None)
   if d.get('id') and not old: self.fail('记录不存在',404)
   if old and (old['status']=='confirmed' or old['author']!=self.user['id']): self.fail('确认记录不可修改；只能编辑自己的草稿',409)
   kind=d.get('type')
   if kind not in t['scenario']['recordTypes']: self.fail('记录类型不支持')
   record=dict(id=old['id'] if old else self.s.uid(),type=kind,text=self.text(d,'text'),occurredAt=self.checktime(d.get('occurredAt')),
               uploadedAt=self.s.now(),author=self.user['id'],authorName=self.user['name'],evidence=self.evidence(pid,d.get('evidence',[])),
               status='confirmed' if d.get('confirm') is True else 'draft')
   if record['status']=='confirmed': record['confirmedAt']=self.s.now()
   if old: t['records'][t['records'].index(old)]=record
   else: t['records'].append(record)
  elif path=='issue':
   self.allow(pid,['manager','inspector'])
   if t['status']!='active': self.fail('仅执行中任务可登记问题',409)
   if t.get('fieldStatus','collecting')!='collecting': self.fail('现场材料已上报，请平台退回后补充问题',409)
   evidence=self.evidence(pid,d.get('evidence',[]))
   if t['scenario']['workflow']['requireEvidence'] and not evidence: self.fail('此场景的问题必须关联证据')
   risk=d.get('risk','中')
   if risk not in ['低','中','高']: self.fail('风险等级不支持')
   details={}
   for key in ['category','subcategory','location','reference','suggestion']:
    value=d.get(key,'')
    if not isinstance(value,str) or len(value)>4000: self.fail('隐患字段格式不正确')
    details[key]=value.strip()
   if details['category'] and details['category'] not in ['工程质量','施工安全','消防安全','文明施工','其他']: self.fail('隐患类别不支持')
   assigned=bool(d.get('assignee') or d.get('reviewer'))
   if assigned: self.allow(pid,['manager'])
   t['issues'].append(dict(id=self.s.uid(),description=self.text(d,'description'),risk=risk,**details,
      assignee=self.member(pid,d.get('assignee'),['rectifier','manager']) if assigned else '',reviewer=self.member(pid,d.get('reviewer'),['reviewer','manager']) if assigned else '',
      dueDate=self.checkdate(d.get('dueDate') or (datetime.now().astimezone()+timedelta(days=t['scenario']['workflow']['defaultDays'])).date().isoformat()),status='assigned' if assigned else 'unassigned',evidence=evidence,history=[],createdAt=self.s.now()))
   i=t['issues'][-1]
   if assigned and t['scenario']['workflow']['separateReviewer'] and i['assignee']==i['reviewer']: self.fail('整改人和复核人必须不同')
  elif path in ['reply','review','reassign']:
   if t['status']!='active': self.fail('交接后不能修改问题',409)
   if t.get('fieldStatus')!='accepted': self.fail('平台接收现场材料后，才能办理整改及复核',409)
   i=next((x for x in t['issues'] if x['id']==d.get('issueId')),None)
   if not i: self.fail('问题不存在',404)
   if path=='reassign':
    self.allow(pid,['manager'])
    if i['status']=='closed': self.fail('已销项问题不能重新分派',409)
    manual='assigneeName' in d or 'reviewerName' in d
    if manual:
     i['assigneeName']=self.text(d,'assigneeName',100);i['reviewerName']=self.text(d,'reviewerName',100)
     i['assignee']='';i['reviewer']=''
    else:
     i['assignee']=self.member(pid,d.get('assignee'),['rectifier','manager'])
     i['reviewer']=self.member(pid,d.get('reviewer'),['reviewer','manager'])
     i.pop('assigneeName',None);i.pop('reviewerName',None)
    if t['scenario']['workflow']['separateReviewer'] and (i['assigneeName']==i['reviewerName'] if manual else i['assignee']==i['reviewer']): self.fail('整改人和复核人必须不同')
    if not d.get('text'): d['text']='平台分派整改与复核'
    elif isinstance(d['text'],str) and not d['text'].strip(): d['text']='平台分派整改与复核'
    i['dueDate']=self.checkdate(d.get('dueDate'));i['status']='assigned'
    i['history'].append(dict(action=path,text=self.text(d,'text'),actor=self.user['id'],uploadedAt=self.s.now(),evidence=[]))
   else:
    self.allow(pid,['rectifier','manager'] if path=='reply' else ['reviewer','manager'])
    target=i['assignee'] if path=='reply' else i['reviewer']
    manual=bool(i.get('assigneeName' if path=='reply' else 'reviewerName'))
    if manual: self.allow(pid,['manager'])
    elif self.user['id']!=target: self.fail('请使用指定的整改人或复核人账号操作',403)
    if path=='reply' and i['status'] not in ['assigned','returned']: self.fail('当前问题不能回复',409)
    if path=='review' and i['status']!='review': self.fail('当前问题尚未提交复核',409)
    evidence=self.evidence(pid,d.get('evidence',[]))
    if path=='reply' and t['scenario']['workflow']['requireEvidence'] and not evidence: self.fail('整改回复必须关联证据')
    if path=='review' and d.get('decision') not in ['close','return']: self.fail('请选择销项或退回')
    i['status']='review' if path=='reply' else ('closed' if d['decision']=='close' else 'returned')
    i['history'].append(dict(action=path,recordedByManager=manual,personName=i.get('assigneeName' if path=='reply' else 'reviewerName',''),text=self.text(d,'text'),decision=d.get('decision',''),actor=self.user['id'],uploadedAt=self.s.now(),evidence=evidence))
  elif path=='import-report':
   self.allow(pid,['manager','inspector'])
   if t['status']!='active': self.fail('任务未处于执行中',409)
   if t.get('fieldStatus','collecting')!='collecting': self.fail('现场材料已上报，请平台退回后补充',409)
   report=self.s.get_report(self.c,d.get('reportId'))
   if report['projectId']!=pid or report['status']!='submitted': self.fail('请选择同项目已提交报告')
   if any(r.get('sourceReportId')==report['id'] for r in t['records']): self.fail('该报告已导入',409)
   mids={report.get('signature','')}
   mids.update(x['signature'] for x in report.get('signatures',[]))
   for issue in report['issues']: mids.update(issue['photos'])
   evidence=[]
   for mid in mids-{''}:
    m=self.c.execute('SELECT * FROM media WHERE id=?',(mid,)).fetchone()
    raw=(self.s.DATA/'uploads'/m['name']).read_bytes()
    eid=self.s.uid();meta=dict(id=eid,projectId=pid,name=m['name'],mime=m['mime'],filename=m['name'],sha256=hashlib.sha256(raw).hexdigest(),size=len(raw),version=1,reviewStatus='source-confirmed',source='legacy-report:'+report['id'],uploadedAt=self.s.now(),occurredAt=report['date']+'T00:00:00+08:00',access='/api/work/evidence/'+eid)
    self.c.execute('INSERT INTO evidence VALUES(?,?,?)',(eid,pid,dump(meta)));evidence.append(eid)
   t['records'].append(dict(id=self.s.uid(),sourceReportId=report['id'],type=t['scenario']['recordTypes'][0],text=report['scope']+'\n'+ '\n'.join(x['description'] for x in report['issues']),sourceReport=report,occurredAt=report['date']+'T00:00:00+08:00',uploadedAt=self.s.now(),confirmedAt=self.s.now(),author=self.user['id'],authorName=self.user['name'],status='confirmed',evidence=evidence))
   for item in report['issues']:
    t['issues'].append(dict(id=self.s.uid(),description=item['description'],risk=item['risk'],assignee='',reviewer='',dueDate=t['dueDate'],status='unassigned',evidence=evidence,history=[],createdAt=self.s.now()))
  elif path=='deliver':
   self.allow(pid,['manager'])
   if t['status']!='active': self.fail('仅执行中任务可生成交接成果',409)
   if t.get('fieldStatus')!='accepted': self.fail('请先在网页平台接收现场上报材料')
   if any(r['status']!='confirmed' for r in t['records']): self.fail('所有历史记录草稿均需确认')
   if any(i['status']!='closed' for i in t['issues']): self.fail('请先完成全部问题的整改复核销项')
   t['handoverSummary']=self.text(d,'text');t['status']='handover'
   t.pop('receipt',None)
   did=self.s.uid();version=len(t['deliveries'])+1
   t['deliveries'].append(dict(id=did,version=version,createdAt=self.s.now()))
   self.stamp(t,path,t['handoverSummary']);self.persist(t)
   snap=self.snapshot(t,version)
   self.c.execute('INSERT INTO deliveries VALUES(?,?,?,?)',(did,t['id'],version,dump(snap)))
   return t
  elif path=='accept':
   self.allow(pid,['receiver','manager'])
   if t.get('receiverName'): self.allow(pid,['manager'])
   elif self.user['id']!=t['receiver']: self.fail('请使用指定接收人账号确认',403)
   if t['status']!='handover': self.fail('当前没有待接收成果',409)
   if d.get('decision') not in ['accept','return']: self.fail('请选择接收或退回')
   t['status']='accepted' if d['decision']=='accept' else 'active'
   t['receipt']=dict(receiverName=t.get('receiverName',''),recordedByManager=bool(t.get('receiverName')),actor=self.user['id'],text=self.text(d,'text'),decision=d['decision'],uploadedAt=self.s.now(),deliveryId=t['deliveries'][-1]['id'])
  elif path=='archive':
   self.allow(pid,['manager'])
   if t['status']!='accepted': self.fail('接收确认后才可归档',409)
   t['status']='archived';t['archivedAt']=self.s.now()
   did=self.s.uid();version=len(t['deliveries'])+1
   t['deliveries'].append(dict(id=did,version=version,createdAt=self.s.now()))
   self.stamp(t,path,'归档');self.persist(t)
   self.c.execute('INSERT INTO deliveries VALUES(?,?,?,?)',(did,t['id'],version,dump(self.snapshot(t,version))));return t
  else: self.fail('业务接口不存在',404)
  self.stamp(t,path,str(d.get('text',''))[:1000]);return self.persist(t)
 def adapter(self,kind,payload,fallback):
  url=os.environ.get('QAXC_'+kind.upper()+'_URL')
  if not url: return fallback
  try:
   req=Request(url,data=dump(payload).encode(),headers={'Content-Type':'application/json','Authorization':'Bearer '+os.environ.get('QAXC_'+kind.upper()+'_TOKEN','')},method='POST')
   with urlopen(req,timeout=8) as response:
    raw=response.read(1024*1024+1)
    if len(raw)>1024*1024: raise ValueError('response too large')
    result=json.loads(raw)
   if not isinstance(result,dict): raise ValueError('invalid response')
   if kind=='knowledge' and (not isinstance(result.get('items'),list) or any(not isinstance(x,dict) or not all(isinstance(x.get(k),str) for k in ['title','text','reference']) for x in result['items'])): raise ValueError('invalid knowledge')
   if kind=='recognition' and not isinstance(result.get('text'),str): raise ValueError('invalid recognition')
   result['requiresConfirmation']=True;return result
  except Exception: return dict(fallback,message=fallback['message']+' 外部服务不可用或响应格式不匹配。')
 def upload(self,d):
  pid=self.text(d,'projectId');self.allow(pid,['manager','inspector','rectifier','reviewer','receiver'])
  try: raw=base64.b64decode(d.get('base64',''),validate=True)
  except Exception: self.fail('文件编码错误')
  if not raw or len(raw)>10*1024*1024: self.fail('文件必须在10MB以内')
  name=self.text(d,'name',200);ext=name.rsplit('.',1)[-1].lower()
  types={'png':'image/png','jpg':'image/jpeg','jpeg':'image/jpeg','mp3':'audio/mpeg','wav':'audio/wav','m4a':'audio/mp4','pdf':'application/pdf'}
  if ext not in types: self.fail('支持照片、MP3/WAV/M4A录音和PDF资料')
  if ext in ['png','jpg','jpeg']:
   mime,suffix=self.s.image_type(raw);w,h=self.s.dimensions(raw)
   if w<1 or h<1 or w*h>60000000: self.fail('图片尺寸不支持')
  else:
   valid=(ext=='pdf' and raw.startswith(b'%PDF-')) or (ext=='wav' and raw.startswith(b'RIFF') and raw[8:12]==b'WAVE') or (ext=='m4a' and raw[4:8]==b'ftyp') or (ext=='mp3' and (raw.startswith(b'ID3') or (len(raw)>2 and raw[0]==255 and raw[1]&224==224)))
   if not valid: self.fail('文件内容与扩展名不符')
   mime=types[ext];suffix='.'+ext
  eid=self.s.uid();filename=eid+suffix
  meta=dict(id=eid,projectId=pid,name=name,mime=mime,filename=filename,sha256=hashlib.sha256(raw).hexdigest(),size=len(raw),version=1,reviewStatus='unreviewed',source='field-upload',uploadedAt=self.s.now(),occurredAt=self.checktime(d.get('occurredAt')),access='/api/work/evidence/'+eid)
  (self.s.DATA/'uploads'/filename).write_bytes(raw)
  self.c.execute('INSERT INTO evidence VALUES(?,?,?)',(eid,pid,dump(meta)))
  return meta


def package_bytes(snapshot,data):
 out=io.BytesIO();s=copy.deepcopy(snapshot)
 with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
  for item in s['evidence']:
   filename=item.pop('filename');item['packagePath']='evidence/'+item['id']+'.'+filename.rsplit('.',1)[-1]
   z.writestr(item['packagePath'],(data/'uploads'/filename).read_bytes())
  z.writestr('task.json',dump(s))
  z.writestr('report.html',report_html(s))
 return out.getvalue()


def report_html(s):
 import html
 esc=lambda x:html.escape(str(x))
 t=s['task'];blocks={}
 blocks['任务信息']='<p>检查人员：'+esc(t.get('inspectors',''))+'</p><p>'+esc(t['number']+' / '+t['title']+' / '+s['project']['name'])+'</p><p>对象：'+esc(t['object'])+'　状态：'+esc(STATUS[t['status']])+'</p>'+''.join('<p>'+esc(k)+'：'+esc(v)+'</p>' for k,v in t['fields'].items())
 if t.get('receiverName'): blocks['任务信息']+='<p>最终成果接收人：'+esc(t['receiverName'])+'</p>'
 blocks['确认记录']=''.join('<article><h3>'+esc(r['type'])+' · '+esc(r['authorName'])+'</h3><p>'+esc(r['text'])+'</p><small>'+esc(r['occurredAt'])+' / '+esc(r['status'])+'</small></article>' for r in t['records'])
 blocks['问题清单']=''.join('<article><p>'+esc(i['description'])+' / '+esc(i['risk'])+' / '+esc(i['status'])+'</p>'+''.join('<p>'+esc(label+'：'+i.get(key,''))+'</p>' for key,label in [('category','类别'),('subcategory','子分类'),('location','部位'),('reference','规范依据'),('suggestion','处理建议')])+'<p>整改人：'+esc(i.get('assigneeName') or i['assignee'])+' / 复核人：'+esc(i.get('reviewerName') or i['reviewer'])+'</p>'+'<p>关联证据：'+esc('、'.join(i['evidence']))+'</p>'+''.join('<p>'+esc(h['action']+'：'+h['text'])+'</p>' for h in i['history'])+'</article>' for i in t['issues']) or '<p>未登记问题。</p>'
 blocks['操作日志']=''.join('<p>'+esc(x['uploadedAt']+' '+x['actorName']+' '+x['action']+' '+x['detail'])+'</p>' for x in t['events'])
 blocks['交接摘要']='<p>'+esc(t.get('handoverSummary',''))+'</p><p>'+esc(t.get('receipt',{}).get('text','尚未接收'))+'</p>'
 evidence='<h2>证据与附件</h2>'
 for e in s['evidence']:
  url=esc(e.get('packagePath',e['access']))
  evidence+='<article><p>'+esc(e['id']+' / '+e['name']+' / SHA256 '+e['sha256'])+'</p>'
  if e['mime'].startswith('image/'): evidence+='<img alt="'+esc(e['name'])+'" style="max-width:100%;max-height:650px" src="'+url+'">'
  else: evidence+='<a href="'+url+'">查看或播放附件</a>'
  evidence+='</article>'
 return '<!doctype html><meta charset="utf-8"><title>'+esc(t['title'])+'</title><style>body{font:16px sans-serif;max-width:900px;margin:40px auto;color:#172f27}p{white-space:pre-wrap;overflow-wrap:anywhere}article{border-bottom:1px solid #ddd;padding:12px 0}@media print{body{margin:15mm}}</style><h1>'+esc(t['scenario']['report']['title'])+'</h1><p>成果版本 '+str(s['version'])+' · 场景版本 '+str(t['scenario']['version'])+'</p>'+''.join('<h2>'+esc(k)+'</h2>'+blocks[k] for k in t['scenario']['report']['sections'])+evidence


def issue_csv(s):
 out=io.StringIO();writer=csv.writer(out);writer.writerow(['问题编号','描述','风险','状态','整改人','复核人','期限'])
 for i in s['task']['issues']:
  values=[i.get(k+'Name') or i[k] if k in ['assignee','reviewer'] else i[k] for k in ['id','description','risk','status','assignee','reviewer','dueDate']]
  writer.writerow(["'"+str(v) if str(v).startswith(('=','+','-','@','\t','\r')) else v for v in values])
 return ('\ufeff'+out.getvalue()).encode('utf-8')
