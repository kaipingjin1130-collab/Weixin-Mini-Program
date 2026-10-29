"""Local inspection backend. Python 3.10+, standard library only."""
import argparse, base64, binascii, hashlib, hmac, html, io, json, os, re, secrets, sqlite3, threading, time, uuid, zipfile, sys
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
from xml.sax.saxutils import escape
from contextlib import contextmanager, closing
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT))
import workflow
import host_auth
PREFIX=os.environ.get("QAXC_ROOT_PATH", "").rstrip("/")
if PREFIX and not re.fullmatch(r"/[a-z][a-z0-9-]*", PREFIX): raise RuntimeError("Invalid module prefix")
COOKIE_PATH=(PREFIX+"/")
COOKIE_SECURE="; Secure" if PREFIX else ""
DATA = Path(os.environ.get('QAXC_DATA', ROOT / 'data'))
SESSIONS = {}
SESSION_USERS = {}
SESSION_LOCK = threading.Lock()
LOGIN_ATTEMPTS = {}
PASSWORD = ''
KNOWLEDGE = [
 {'id':'k1','category':'施工用电','title':'临时用电巡查要点','text':'检查配电箱防护、线路敷设、接地及漏电保护装置。记录现场实际情况，并由专业人员核对适用标准。','reference':'演示检查提示，非规范条文'},
 {'id':'k2','category':'高处作业','title':'临边与洞口防护','text':'观察临边防护、洞口覆盖和警示情况；记录具体楼层、部位、缺失情况及现场照片。','reference':'演示检查提示，非规范条文'},
 {'id':'k3','category':'消防安全','title':'消防通道与器材','text':'检查消防通道是否畅通、灭火器是否在有效状态；对占用和缺失情况逐项记录。','reference':'演示检查提示，非规范条文'},
 {'id':'k4','category':'工程质量','title':'混凝土外观检查','text':'记录蜂窝、孔洞、露筋、裂缝等可见现象。尺寸、成因及处理意见需专业核实，不凭照片自动定性。','reference':'演示检查提示，非规范条文'},
 {'id':'k5','category':'文明施工','title':'现场材料堆放','text':'检查材料分类堆放、通行空间和防倾倒措施。建议结合现场实际明确整改责任及要求。','reference':'演示检查提示，非规范条文'}
]

class Problem(Exception):
 def __init__(self, message, status=400): self.message, self.status = message, status

@contextmanager
def db():
 c=sqlite3.connect(DATA/'inspections.sqlite3', timeout=20)
 c.row_factory=sqlite3.Row
 c.execute('PRAGMA foreign_keys=ON')
 try:
  with c: yield c
 finally: c.close()

def init():
 global PASSWORD
 DATA.mkdir(parents=True,exist_ok=True)
 (DATA/'uploads').mkdir(exist_ok=True)
 PASSWORD=os.environ.get('QAXC_PASSWORD','')
 if not PASSWORD:
  p=DATA/'local-password.txt'
  if not p.exists(): p.write_text(secrets.token_urlsafe(12),encoding='utf-8')
  PASSWORD=p.read_text(encoding='utf-8').strip()
 with db() as c:
  c.executescript('''
  CREATE TABLE IF NOT EXISTS projects(id TEXT PRIMARY KEY, name TEXT NOT NULL, contract TEXT NOT NULL, created TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS codes(id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id), number TEXT UNIQUE NOT NULL, participants TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS reports(id TEXT PRIMARY KEY, code_id TEXT REFERENCES codes(id), status TEXT NOT NULL, payload TEXT NOT NULL, revision INTEGER NOT NULL, updated TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS media(id TEXT PRIMARY KEY, mime TEXT NOT NULL, name TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS favorites(id TEXT PRIMARY KEY);
  ''')
  workflow.init(c)
  import ab_v1
  ab_v1.init(c)
 if ab_v1.enabled(): ab_v1.config()

def now(): return datetime.now().astimezone().isoformat(timespec='seconds')
def uid(): return uuid.uuid4().hex
def required(d,k,maxlen=500):
 v=d.get(k,'')
 if not isinstance(v,str) or not v.strip(): raise Problem('请填写'+k)
 if len(v)>maxlen: raise Problem(k+'内容过长')
 return v.strip()
def media_check(c,mid):
 if not isinstance(mid,str) or not c.execute('SELECT 1 FROM media WHERE id=?',(mid,)).fetchone(): raise Problem('照片不存在，请重新上传')
def image_type(data):
 if data.startswith(b'\x89PNG\r\n\x1a\n'): return 'image/png','.png'
 if data.startswith(b'\xff\xd8\xff') and data.endswith(b'\xff\xd9'): return 'image/jpeg','.jpg'
 raise Problem('仅支持 JPEG / PNG 图片')
def unpack(r):
 d=json.loads(r['payload']); d.update(id=r['id'],status=r['status'],revision=r['revision'],updated=r['updated']); return d
def get_report(c,rid):
 r=c.execute('SELECT * FROM reports WHERE id=?',(rid,)).fetchone()
 if not r: raise Problem('报告不存在',404)
 return unpack(r)

def validate_report(c,d,submit):
 code=c.execute('SELECT codes.*, projects.name, projects.contract FROM codes JOIN projects ON projects.id=codes.project_id WHERE codes.id=?',(d.get('codeId'),)).fetchone()
 if not code: raise Problem('请先选择项目及巡查编号')
 issues=d.get('issues',[])
 if not isinstance(issues,list) or len(issues)>100: raise Problem('隐患条数应在100条以内')
 nohazard=d.get('noHazard') is True
 if nohazard and issues: raise Problem('无隐患检查不能同时包含隐患条目')
 if submit and not issues and not nohazard: raise Problem('请添加隐患，或明确选择未发现隐患')
 clean=[]
 for item in issues:
  if not isinstance(item,dict): raise Problem('隐患格式错误')
  row={k:str(item.get(k,''))[:4000] for k in ['description','location','category','subcategory','reference','suggestion','risk']}
  photos=item.get('photos',[])
  if not isinstance(photos,list) or len(photos)>9: raise Problem('每条隐患最多9张照片')
  for p in photos: media_check(c,p)
  row['photos']=photos
  if submit:
   if not all(row[k].strip() for k in ['description','category']): raise Problem('请补齐每条隐患的描述和分类')
   if row['risk'] not in ['低','中','高']: raise Problem('请选择风险等级')
   if not photos: raise Problem('每条隐患至少需要一张现场照片')
  clean.append(row)
 inspector=str(d.get('inspector','')).strip()
 names=[n.strip() for n in re.split(r'[,，、;；\n]+',inspector) if n.strip()]
 if len(names)>20 or any(len(n)>100 for n in names): raise Problem('检查人最多20位，每个姓名不超过100字')
 if len(set(names))!=len(names): raise Problem('检查人姓名重复，请用工号等信息区分同名人员')
 inspector='、'.join(names)
 supplied=d.get('signatures')
 if supplied is None:
  supplied=[{'name':names[0],'signature':d.get('signature','')}] if len(names)==1 else []
 if not isinstance(supplied,list) or len(supplied)>20: raise Problem('签名数据格式不正确')
 signed={}
 for entry in supplied:
  if not isinstance(entry,dict) or entry.get('name') not in names or entry['name'] in signed: raise Problem('签名与检查人不匹配，请重新核对')
  mid=entry.get('signature','')
  if mid: media_check(c,mid)
  signed[entry['name']]=mid
 signatures=[{'name':n,'signature':signed.get(n,'')} for n in names]
 signature=signatures[0]['signature'] if signatures else ''
 scope=str(d.get('scope','')).strip()[:4000]
 if submit and (not names or any(not x['signature'] for x in signatures)): raise Problem('正式提交需要每位检查人姓名及各自的手写签名')
 if submit and nohazard and not scope: raise Problem('无隐患检查请填写检查范围与结论')
 date=str(d.get('date',''))
 try: datetime.strptime(date,'%Y-%m-%d')
 except ValueError: raise Problem('检查日期格式不正确')
 return dict(codeId=code['id'],projectId=code['project_id'],project=code['name'],contract=code['contract'],number=code['number'],participants=code['participants'],date=date,inspector=inspector,scope=scope,noHazard=nohazard,issues=clean,signature=signature,signatures=signatures)

def save_report(c,d):
 rid=d.get('id') or uid()
 old=c.execute('SELECT * FROM reports WHERE id=?',(rid,)).fetchone()
 if d.get('id') and not old: raise Problem('草稿不存在',404)
 if old and old['status']!='draft': raise Problem('正式报告已锁定，请复制为新草稿',409)
 if old and d.get('revision')!=old['revision']: raise Problem('草稿已在另一页面更新，请重新打开，避免覆盖',409)
 submit=d.get('submit') is True
 payload=validate_report(c,d,submit)
 revision=old['revision']+1 if old else 1
 status='submitted' if submit else 'draft'
 c.execute('INSERT OR REPLACE INTO reports VALUES(?,?,?,?,?,?)',(rid,payload['codeId'],status,json.dumps(payload,ensure_ascii=False),revision,now()))
 return get_report(c,rid)

def make_docx(c,r):
 """Minimal standards-based OOXML, including embedded photos and signature."""
 body=[]; images=[]
 def para(t,bold=False):
  body.append('<w:p><w:r>'+('<w:rPr><w:b/></w:rPr>' if bold else '')+'<w:t xml:space="preserve">'+escape(t)+'</w:t></w:r></w:p>')
 def picture(mid):
  m=c.execute('SELECT * FROM media WHERE id=?',(mid,)).fetchone()
  n=len(images)+1; ext='.png' if m['mime']=='image/png' else '.jpg'; images.append((n,ext,(DATA/'uploads'/m['name']).read_bytes()))
  # Preserve aspect ratio for PNG and JPEG headers, without third-party libraries.
  w,h=dimensions(images[-1][2]); width=min(5486400,w*9525); height=int(width*h/w)
  if height>6400800: width=int(width*6400800/height); height=6400800
  body.append(f'<w:p><w:r><w:drawing><wp:inline><wp:extent cx="{width}" cy="{height}"/><wp:docPr id="{n}" name="照片{n}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="{n}" name="image{n}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId{n}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{width}" cy="{height}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>')
 para(r.get('title','质量安全巡查报告'),True)
 for k,label in [('contract','合同'),('project','项目'),('number','巡查编号'),('date','检查日期'),('inspector','检查人'),('scope','检查范围与结论')]: para(label+'：'+r.get(k,''))
 para('报告状态：'+r.get('statusLabel',('草稿（未正式签署）' if r['status']=='draft' else '已提交')))
 if r['noHazard']: para('本次在上述检查范围内未发现隐患。')
 for i,item in enumerate(r['issues'],1):
  para(f'问题 {i}｜{item["category"]}｜风险：{item["risk"]}',True)
  for k,label in [('subcategory','子分类'),('location','部位'),('description','问题描述'),('reference','规范依据'),('suggestion','整改建议')]: para(label+'：'+item.get(k,''))
  for mid in item['photos']: picture(mid)
 for signer in r.get('signatures', [{'name':r.get('inspector',''),'signature':r.get('signature','')}]):
  para('检查人手写签名：'+signer['name'])
  if signer['signature']: picture(signer['signature'])
 para('本地试用版生成。风险等级及规范依据由检查人确认；手写签名图片不等同于第三方可信电子签章。')
 namespaces='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"'
 xml='<?xml version="1.0" encoding="UTF-8"?><w:document '+namespaces+'><w:body>'+''.join(body)+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>'
 stream=io.BytesIO()
 with zipfile.ZipFile(stream,'w',zipfile.ZIP_DEFLATED) as z:
  z.writestr('[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
  z.writestr('_rels/.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')
  z.writestr('word/document.xml',xml)
  z.writestr('word/_rels/document.xml.rels','<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+''.join(f'<Relationship Id="rId{n}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image{n}{ext}"/>' for n,ext,_ in images)+'</Relationships>')
  for n,ext,data in images: z.writestr(f'word/media/image{n}{ext}',data)
 return stream.getvalue()

def dimensions(b):
 import struct
 if b.startswith(b'\x89PNG'): return struct.unpack('>II',b[16:24])
 p=2
 while p<len(b)-9:
  if b[p]!=255: p+=1; continue
  marker=b[p+1]; p+=2
  if marker in (0xd8,0xd9): continue
  size=int.from_bytes(b[p:p+2],'big')
  if marker in (0xc0,0xc1,0xc2): return int.from_bytes(b[p+5:p+7],'big'),int.from_bytes(b[p+3:p+5],'big')
  if size<2: break
  p+=size
 raise Problem('图片格式损坏')

def snapshot_docx(snap,brief=False):
 """Render a frozen task snapshot without inserting evidence into legacy tables."""
 with closing(sqlite3.connect(':memory:')) as mc:
  mc.row_factory=sqlite3.Row;mc.execute('CREATE TABLE media(id TEXT,mime TEXT,name TEXT)')
  photos=[]
  for item in snap['evidence']:
   if item['mime'].startswith('image/'):
    mc.execute('INSERT INTO media VALUES(?,?,?)',(item['id'],item['mime'],item['filename']));photos.append(item['id'])
  t=snap['task'];names={u['id']:u['name'] for u in snap['members']};names['admin']='系统管理员'
  issue_rows=[]
  for i in t['issues']:
   history='\n'.join(names.get(h['actor'],h['actor'])+'：'+h['text'] for h in i['history'])
   issue_rows.append(dict(category=i.get('category') or '发现的问题',subcategory=i.get('subcategory',''),location=i.get('location',''),reference=i.get('reference',''),risk=i['risk'],description=i['description'],suggestion='\n'.join(filter(None,[i.get('suggestion',''),history])) or '由网页平台分派、整改及复核',photos=[eid for eid in i['evidence'] if eid in photos]))
  report=dict(title='现场检查简报（非正式审核报告）' if brief else t['scenario']['report']['title'],
   statusLabel=('现场上报材料' if brief else workflow.STATUS[t['status']])+' · 版本 '+str(snap['version']),status='submitted',
   contract=snap['project']['contract'],project=snap['project']['name'],number=t['number'],date=t['updatedAt'][:10],
   inspector=t.get('inspectors') or '、'.join(dict.fromkeys(r['authorName'] for r in t['records'])),
   scope=(t.get('fieldSummary','') if brief else t.get('handoverSummary',''))+'\n'+'\n'.join(k+'：'+v for k,v in t['fields'].items())+
         (('\n接收意见：'+t['receipt']['text']) if t.get('receipt') else ''),
   noHazard=t.get('noHazard',False),issues=([dict(category='现场确认记录与证据',risk='人工核对',description='\n'.join(r['type']+' / '+r['authorName']+' / '+r['occurredAt']+'：'+r['text'] for r in t['records']),photos=[eid for eid in photos if any(eid in r['evidence'] for r in t['records']) and not any(eid in i['evidence'] for i in t['issues'])])] if t['records'] else [])+issue_rows,signatures=[dict(name=t['fieldSignature']['name'],signature=t['fieldSignature']['evidenceId'])] if t.get('fieldSignature') else [])
  return make_docx(mc,report)

def module_asset(file):
 text=file.read_text(encoding='utf-8')
 if file.name=='ab-client.js': return text.encode() # This client derives its prefix from its own script URL.
 if not PREFIX: return text.encode()
 # Known root-relative URLs in controlled static assets only. Regex does not touch // URLs.
 text=re.sub(r"([\"'`])/(?!/)(?=api/|media/|work(?:[?\"'`]|\.js)|style\.css|app\.js|followup\.js|ab-client\.js|#|[\"'`])",lambda m:m[1]+PREFIX+'/',text)
 return text.encode()

def module_report(text):
 if not PREFIX: return text
 return re.sub(r'(src|href)="(/(?:api/|media/))',lambda m:m[1]+'="'+PREFIX+m[2],text)

class Handler(BaseHTTPRequestHandler):
 def log_message(self,fmt,*args): pass # No tokens or sensitive report content in logs.
 def send(self,value,status=200,mime='application/json; charset=utf-8',headers=None):
  if getattr(self,'db_connection',None) is not None:
   if status<400: self.db_connection.commit()
   else: self.db_connection.rollback()
  if not isinstance(value,bytes): value=json.dumps(value,ensure_ascii=False).encode() if mime.startswith('application/json') else value.encode()
  self.send_response(status); self.send_header('Content-Type',mime); self.send_header('Content-Length',str(len(value))); self.send_header('Cache-Control','no-store'); self.send_header('X-Content-Type-Options','nosniff')
  for k,v in (headers or {}).items(): self.send_header(k,v)
  self.end_headers(); self.wfile.write(value)
 def auth(self):
  token=self.headers.get('Authorization','').removeprefix('Bearer ')
  if not token:
   from http.cookies import SimpleCookie
   cookie=SimpleCookie(self.headers.get('Cookie','')); token=cookie['qaxc_session'].value if 'qaxc_session' in cookie else ''
  with SESSION_LOCK: valid=SESSIONS.get(token,0)>time.time()
  if not valid: raise Problem('请登录工作台',401)
  user=SESSION_USERS.get(token)
  if not user: raise Problem('请重新登录',401)
  if host_auth.enabled():
   if user.get('authSource')!='host': raise Problem('请使用老平台账号重新登录',401)
   try: fresh=host_auth.identity(host_auth.call('identity',{'id':user['id']}))
   except host_auth.AuthError as e: raise Problem(e.message,e.status)
   if fresh['id']!=user['id']: raise Problem('登录账号不一致',401)
   with SESSION_LOCK: SESSION_USERS[token]=fresh
  return token
 def do_GET(self): self.handle_request('GET')
 def do_POST(self): self.handle_request('POST')
 def handle_request(self,method):
  self.db_connection=None
  try:
   path=urlsplit(self.path).path
   if PREFIX:
    if path==PREFIX:
     self.send('',302,mime='text/plain',headers={'Location':PREFIX+'/'}); return
    if not path.startswith(PREFIX+'/'): raise Problem('接口不存在',404)
    path=path[len(PREFIX):]
   if method=='GET' and path in ['/','/app.js','/followup.js','/ab-client.js','/style.css','/work','/work.js']:
    f=ROOT/'web'/({'/':'index.html','/work':'work.html'}.get(path,path.lstrip('/')))
    self.send(module_asset(f),mime={'/':'text/html; charset=utf-8','/work':'text/html; charset=utf-8','/work.js':'text/javascript; charset=utf-8','/app.js':'text/javascript; charset=utf-8','/ab-client.js':'text/javascript; charset=utf-8','/followup.js':'text/javascript; charset=utf-8','/style.css':'text/css; charset=utf-8'}[path]); return
   d={}
   if method=='POST':
    origin=self.headers.get('Origin')
    if origin and urlsplit(origin).netloc!=self.headers.get('Host'): raise Problem('不接受跨站请求',403)
    length=int(self.headers.get('Content-Length','0'))
    if length>15*1024*1024: raise Problem('请求超过15MB限制',413)
    d=json.loads(self.rfile.read(length) or b'{}')
    if not isinstance(d,dict): raise Problem('请求格式错误')
   if path in ('/api/login','/api/host-session') and method=='POST':
    if path=='/api/host-session' and not host_auth.enabled(): raise Problem('未启用统一登录',404)
    ip=self.client_address[0]
    with SESSION_LOCK:
     attempts=[t for t in LOGIN_ATTEMPTS.get(ip,[]) if time.time()-t<60]
     if len(attempts)>=20: raise Problem('尝试过于频繁，请一分钟后重试',429)
     LOGIN_ATTEMPTS[ip]=attempts+[time.time()]
    if host_auth.enabled():
     try:
      result=host_auth.call('session',cookie=self.headers.get('Cookie','')) if path=='/api/host-session' else host_auth.call('login',{'username':str(d.get('username','')).strip(),'password':str(d.get('password',''))})
      user=host_auth.identity(result)
     except host_auth.AuthError as e: raise Problem(e.message,e.status)
     with db() as c: host_auth.register(c,user)
    else:
     username=str(d.get('username','admin')).strip() or 'admin'
     user=None
     if username=='admin' and hmac.compare_digest(str(d.get('password','')),PASSWORD):
      user=dict(id='admin',username='admin',name='系统管理员',isAdmin=True)
     elif username!='admin':
      with db() as c: user=workflow.login(c,username,str(d.get('password','')))
     if not user: raise Problem('账号或密码不正确',401)
    with SESSION_LOCK:
     token=secrets.token_urlsafe(32); SESSIONS[token]=time.time()+86400
     SESSION_USERS[token]=user
    secure=COOKIE_SECURE
    if os.environ.get('QAXC_LOOPBACK_HTTP_DEV')=='1' and self.client_address[0] in ('127.0.0.1','::1') and urlsplit('//'+self.headers.get('Host','')).hostname in ('localhost','127.0.0.1','::1'): secure=''
    self.send({'token':token,'user':user},headers={'Set-Cookie':f'qaxc_session={token}; HttpOnly; SameSite=Strict; Path={COOKIE_PATH}; Max-Age=86400{secure}'}); return
   token=self.auth()
   if path=='/api/logout':
    with SESSION_LOCK: SESSIONS.pop(token,None); SESSION_USERS.pop(token,None)
    self.send({'ok':True},headers={'Set-Cookie':f'qaxc_session=; HttpOnly; SameSite=Strict; Path={COOKIE_PATH}; Max-Age=0{COOKIE_SECURE}'}); return
   with db() as c:
    self.db_connection=c
    if method=='POST': c.execute('BEGIN IMMEDIATE')
    user=SESSION_USERS[token]
    w=workflow.Workflow(SimpleNamespace(Problem=Problem,required=required,uid=uid,now=now,get_report=get_report,image_type=image_type,dimensions=dimensions,DATA=DATA,KNOWLEDGE=KNOWLEDGE),c,user)
    if host_auth.enabled() and path=='/api/work/users': raise Problem('请使用老平台账号登录一次，再分配项目权限',403)
    if path.startswith('/api/work/'):
     action=path.removeprefix('/api/work/')
     if method=='GET':
      if action=='state': self.send(w.state());return
      if action.startswith('evidence-meta/'):
       row=c.execute('SELECT * FROM evidence WHERE id=?',(action.split('/')[-1],)).fetchone()
       if not row: raise Problem('证据不存在',404)
       w.role(row['project_id']);m=json.loads(row['payload']);m.pop('filename',None);self.send(m);return
      if action.startswith(('brief/','brief-data/','brief-word/')):
       kind,bid=action.split('/',1)
       row=c.execute('SELECT * FROM field_reports WHERE id=?',(bid,)).fetchone()
       if not row: raise Problem('现场简报不存在',404)
       w.task(row['task_id']);snap=json.loads(row['payload'])
       if kind=='brief-word':
        self.send(snapshot_docx(snap,brief=True),mime='application/vnd.openxmlformats-officedocument.wordprocessingml.document',headers={'Content-Disposition':'attachment; filename="field-brief.docx"'});return
       for item in snap['evidence']: item.pop('filename',None)
       self.send(module_report(workflow.report_html(snap)) if kind=='brief' else snap,mime='text/html; charset=utf-8' if kind=='brief' else 'application/json; charset=utf-8');return
      if action.startswith('evidence/'):
       row=c.execute('SELECT * FROM evidence WHERE id=?',(action.split('/')[-1],)).fetchone()
       if not row: raise Problem('证据不存在',404)
       w.role(row['project_id']);m=json.loads(row['payload'])
       headers={} if m['mime'].startswith(('image/','audio/')) else {'Content-Disposition':'attachment; filename="evidence.pdf"'}
       self.send((DATA/'uploads'/m['filename']).read_bytes(),mime=m['mime'],headers=headers);return
      if action.startswith(('package/','report/','issues/','snapshot/','word/')):
       kind,did=action.split('/',1);snap=w.delivery(did)
       if kind=='package': value=workflow.package_bytes(snap,DATA);mime='application/zip';filename='task-'+did+'.zip'
       elif kind=='report': value=module_report(workflow.report_html(snap));mime='text/html; charset=utf-8';filename=''
       elif kind=='issues': value=workflow.issue_csv(snap);mime='text/csv; charset=utf-8';filename='issues.csv'
       elif kind=='word': value=snapshot_docx(snap);mime='application/vnd.openxmlformats-officedocument.wordprocessingml.document';filename='formal-report.docx'
       else:
        value=json.loads(json.dumps(snap))
        for item in value['evidence']: item.pop('filename',None)
        mime='application/json; charset=utf-8';filename='task.json'
       self.send(value,mime=mime,headers={'Content-Disposition':'attachment; filename="'+filename+'"'} if filename else {});return
      raise Problem('接口不存在',404)
     request_id=required(d,'requestId',100)
     fingerprint=hashlib.sha256((path+json.dumps(d,sort_keys=True,ensure_ascii=False)).encode()).hexdigest()
     previous=c.execute('SELECT * FROM operations WHERE user_id=? AND request_id=?',(user['id'],request_id)).fetchone()
     if previous:
      if previous['fingerprint']!=fingerprint: raise Problem('同一请求编号不能用于不同内容',409)
      # Recheck authorization after role changes before returning cached task data.
      if d.get('taskId'): w.task(d['taskId'])
      if d.get('projectId'): w.role(d['projectId'])
      if d.get('reportId'): w.role(get_report(c,d['reportId'])['projectId'])
      self.send(json.loads(previous['result']));return
     result=w.upload(d) if action=='upload' else w.dispatch(action,d)
     c.execute('INSERT INTO operations VALUES(?,?,?,?)',(user['id'],request_id,fingerprint,workflow.dump(result)))
     self.send(result);return
    if not host_auth.is_admin(user) and method=='POST': raise Problem('成员请使用作业协同入口办理任务',403)
    if method=='GET':
     if path=='/api/state':
      reports=[unpack(r) for r in c.execute('SELECT * FROM reports ORDER BY updated DESC')]
      projects=[dict(r) for r in c.execute('SELECT * FROM projects ORDER BY created DESC')]
      if not host_auth.is_admin(user):
       allowed={r['project_id'] for r in c.execute('SELECT project_id FROM memberships WHERE user_id=?',(user['id'],))}
       projects=[p for p in projects if p['id'] in allowed];reports=[r for r in reports if r['projectId'] in allowed]
      ids={p['id'] for p in projects}
      self.send(dict(user=user,projects=projects,codes=[dict(r) for r in c.execute('SELECT * FROM codes ORDER BY number DESC') if r['project_id'] in ids],reports=reports,knowledge=KNOWLEDGE,favorites=[r['id'] for r in c.execute('SELECT * FROM favorites')] if host_auth.is_admin(user) else [])); return
     if path.startswith('/media/'):
      mid=path.split('/')[-1]; m=c.execute('SELECT * FROM media WHERE id=?',(mid,)).fetchone()
      if not m: raise Problem('图片不存在',404)
      if not host_auth.is_admin(user):
       allowed={r['project_id'] for r in c.execute('SELECT project_id FROM memberships WHERE user_id=?',(user['id'],))}
       matched=False
       for rr in c.execute('SELECT * FROM reports'):
        r=unpack(rr)
        ids={r.get('signature','')}|{x['signature'] for x in r.get('signatures',[])}|{p for i in r['issues'] for p in i['photos']}
        if r['projectId'] in allowed and mid in ids: matched=True;break
       if not matched: raise Problem('无此证据访问权限',403)
      self.send((DATA/'uploads'/m['name']).read_bytes(),mime=m['mime']); return
     if path.startswith('/api/export/'):
      r=get_report(c,path.split('/')[-1]); w.role(r['projectId']);self.send(make_docx(c,r),mime='application/vnd.openxmlformats-officedocument.wordprocessingml.document',headers={'Content-Disposition':f'attachment; filename="inspection-{r["number"]}.docx"'}); return
    else:
     if path=='/api/projects':
      name=required(d,'name',100); contract=required(d,'contract',200); pid=d.get('id') or uid()
      if d.get('id'):
       if not c.execute('SELECT 1 FROM projects WHERE id=?',(pid,)).fetchone(): raise Problem('项目不存在',404)
       c.execute('UPDATE projects SET name=?,contract=? WHERE id=?',(name,contract,pid))
      else: c.execute('INSERT INTO projects VALUES(?,?,?,?)',(pid,name,contract,now()))
      self.send({'id':pid}); return
     if path=='/api/projects/delete':
      if c.execute('SELECT 1 FROM codes WHERE project_id=?',(d.get('id'),)).fetchone(): raise Problem('项目已有巡查编号，不能删除')
      c.execute('DELETE FROM projects WHERE id=?',(d.get('id'),)); self.send({'ok':True}); return
     if path=='/api/codes':
      pid=required(d,'projectId'); participants=required(d,'participants',500)
      if not c.execute('SELECT 1 FROM projects WHERE id=?',(pid,)).fetchone(): raise Problem('项目不存在')
      cid=uid(); number=datetime.now().strftime('%Y%m%d')+'-'+uuid.uuid4().hex[:10].upper()
      c.execute('INSERT INTO codes VALUES(?,?,?,?)',(cid,pid,number,participants)); self.send({'id':cid,'number':number}); return
     if path=='/api/codes/delete':
      if c.execute('SELECT 1 FROM reports WHERE code_id=?',(d.get('id'),)).fetchone(): raise Problem('编号已有草稿或报告，不能删除')
      c.execute('DELETE FROM codes WHERE id=?',(d.get('id'),)); self.send({'ok':True}); return
     if path=='/api/media':
      try: raw=base64.b64decode(d.get('base64',''),validate=True)
      except (ValueError,binascii.Error): raise Problem('图片编码错误')
      if len(raw)>10*1024*1024: raise Problem('单张照片不能超过10MB')
      mime,ext=image_type(raw); w,h=dimensions(raw)
      if w<1 or h<1 or w*h>60000000: raise Problem('图片尺寸不支持')
      mid=uid(); filename=mid+ext; (DATA/'uploads'/filename).write_bytes(raw)
      c.execute('INSERT INTO media VALUES(?,?,?)',(mid,mime,filename)); self.send({'id':mid}); return
     if path=='/api/reports': self.send(save_report(c,d)); return
     if path=='/api/reports/delete':
      r=get_report(c,d.get('id'))
      if r['status']!='draft': raise Problem('正式报告不可删除')
      c.execute('DELETE FROM reports WHERE id=?',(r['id'],)); self.send({'ok':True}); return
     if path=='/api/reports/copy':
      r=get_report(c,d.get('id')); r.pop('id'); r['signature']=''; r['signatures']=[{'name':x['name'],'signature':''} for x in r.get('signatures',[{'name':r.get('inspector','')}]) if x['name']]; r['submit']=False
      self.send(save_report(c,r)); return
     if path=='/api/reports/merge':
      ids=d.get('ids',[])
      if not isinstance(ids,list) or len(set(ids))<2 or len(ids)!=len(set(ids)): raise Problem('请选择至少两份不同报告')
      rr=[get_report(c,i) for i in ids]
      if len({r['codeId'] for r in rr})!=1: raise Problem('仅支持同一巡查编号的报告合并')
      r=dict(rr[0]); r.pop('id'); r['issues']=[i for x in rr for i in x['issues']]; r['scope']='\n'.join(dict.fromkeys(x['scope'] for x in rr if x['scope'])); r['noHazard']=not r['issues'] and all(x['noHazard'] for x in rr); r['signature']=''; r['signatures']=[{'name':x['name'],'signature':''} for x in r.get('signatures',[{'name':r.get('inspector','')}]) if x['name']]; r['submit']=False
      self.send(save_report(c,r)); return
     if path=='/api/favorites':
      kid=d.get('id')
      if kid not in {k['id'] for k in KNOWLEDGE}: raise Problem('条目不存在')
      if d.get('selected'): c.execute('INSERT OR IGNORE INTO favorites VALUES(?)',(kid,))
      else: c.execute('DELETE FROM favorites WHERE id=?',(kid,))
      self.send({'ok':True}); return
   self.db_connection=None
   raise Problem('接口不存在',404)
  except Problem as e: self.db_connection=None; self.send({'error':e.message},e.status)
  except (ValueError,TypeError,KeyError): self.db_connection=None; self.send({'error':'输入格式错误，请检查填写内容'},400)
  except sqlite3.IntegrityError: self.db_connection=None; self.send({'error':'数据已关联或存在冲突，请刷新后重试'},409)
  except Exception as e:
   self.db_connection=None
   print('Server error:',type(e).__name__,str(e)); self.send({'error':'本地服务处理失败，请查看终端日志'},500)

import ab_gateway
ab_gateway.install(sys.modules[__name__])
import ab_v1
ab_v1.install(sys.modules[__name__])

if __name__=='__main__':
 parser=argparse.ArgumentParser(); parser.add_argument('--host',default='127.0.0.1'); parser.add_argument('--port',type=int,default=8765); args=parser.parse_args()
 init()
 if args.host not in ('localhost','127.0.0.1') and len(PASSWORD)<12: raise SystemExit('局域网模式请设置至少12位 QAXC_PASSWORD')
 print(f'Local inspector: http://127.0.0.1:{args.port}',flush=True)
 print('Password: QAXC_PASSWORD environment value or data/local-password.txt',flush=True)
 ThreadingHTTPServer((args.host,args.port),Handler).serve_forever()

