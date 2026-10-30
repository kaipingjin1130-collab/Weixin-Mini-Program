import io, json, os, sys, tempfile, unittest
from pathlib import Path
from email.message import Message
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).parent/'candidate'))
os.environ['QAXC_ROOT_PATH']='/quality'
import server as s

class Request(s.Handler):
 def send(self,value,status=200,mime='application/json; charset=utf-8',headers=None):
  if self.db_connection is not None:
   if status<400: self.db_connection.commit()
   else: self.db_connection.rollback()
  self.result=(status,value,headers or {})

class Integration(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory(dir=Path(__file__).parent)
  s.DATA=Path(self.temp.name);s.init();s.SESSIONS.clear();s.SESSION_USERS.clear();s.LOGIN_ATTEMPTS.clear()
  self.patch=patch.dict(os.environ,{'QAXC_AUTH_URL':'http://127.0.0.1:18082/internal/qaxc','QAXC_AUTH_KEY':'test'})
  self.patch.start()
  self.disabled=False
  def bridge(action,data=None,cookie=''):
   if self.disabled: raise s.host_auth.AuthError('账号停用',401)
   uid=(data or {}).get('id','host:admin:7')
   if action=='login':
    if data.get('password')!='valid-test-password': raise s.host_auth.AuthError('密码错误',401)
    uid='host:admin:7' if data.get('username')=='owner' else 'host:admin:8'
   return dict(active=True,aud='qaxc',id=uid,name='测试用户',isAdmin=uid=='host:admin:7')
  self.mock=patch.object(s.host_auth,'call',side_effect=bridge);self.mock.start()
 def tearDown(self): self.mock.stop();self.patch.stop();self.temp.cleanup()
 def request(self,path,data=None,token='',origin=None):
  h=Request.__new__(Request);h.path=path;h.client_address=('127.0.0.1',1);h.headers=Message()
  raw=json.dumps(data).encode() if data is not None else b''
  h.rfile=io.BytesIO(raw);h.headers['Content-Length']=str(len(raw));h.headers['Host']='example.test'
  if token:h.headers['Authorization']='Bearer '+token
  if origin:h.headers['Origin']=origin
  h.handle_request('POST' if data is not None else 'GET');return h.result
 def login(self,who='owner'):
  status,result,headers=self.request('/quality/api/login',dict(username=who,password='valid-test-password'))
  self.assertEqual(status,200);return result['token'],headers
 def test_login_and_scoped_cookie(self):
  token,headers=self.login();self.assertIn('Path=/quality/',headers['Set-Cookie']);self.assertIn('Secure',headers['Set-Cookie'])
  status,state,_=self.request('/quality/api/work/state',token=token)
  self.assertEqual(status,200);self.assertTrue(state['user']['isAdmin'])
  with s.db() as c:self.assertEqual(c.execute('SELECT digest FROM users').fetchone()[0],'')
 def test_wrong_password_cannot_fall_back_to_local_admin(self):
  self.assertEqual(self.request('/quality/api/login',dict(username='admin',password=s.PASSWORD))[0],401)
 def test_disabled_account_revokes_existing_token(self):
  token,_=self.login();self.disabled=True
  self.assertEqual(self.request('/quality/api/state',token=token)[0],401)
 def test_member_cannot_see_or_change_owner_project(self):
  owner,_=self.login();member,_=self.login('member')
  status,p,_=self.request('/quality/api/projects',dict(name='测试项目',contract='测试合同'),owner)
  self.assertEqual(status,200)
  self.assertEqual(self.request('/quality/api/state',token=member)[1]['projects'],[])
  self.assertEqual(self.request('/quality/api/projects',dict(name='越权',contract='测试'),member)[0],403)
  status,_,_=self.request('/quality/api/work/adhoc-tasks',dict(requestId='attempt',projectId=p['id']),member)
  self.assertEqual(status,403)
 def test_no_auth_and_cross_site(self):
  self.assertEqual(self.request('/quality/api/state')[0],401)
  self.assertEqual(self.request('/quality/api/login',{},origin='https://evil.example')[0],403)
 def test_old_root_is_not_served(self):
  self.assertEqual(self.request('/api/state')[0],404)
 def test_browser_asset_paths(self):
  for name in ('app.js','work.js','style.css',''):
   status,body,_=self.request('/quality/'+name)
   self.assertEqual(status,200)
   text=body.decode()
   self.assertNotIn('href="/style.css',text)
   self.assertNotIn("fetch('/api/",text)
   self.assertNotIn("api('/api/",text)
 def test_imported_user_no_local_password_login(self):
  self.login()
  with s.db() as c:self.assertIsNone(s.workflow.login(c,'host:admin:7','anything'))
 def test_session_identity_requires_login_and_keeps_selected_account(self):
  self.assertEqual(self.request('/quality/api/session')[0],401)
  owner,_=self.login();member,_=self.login('member')
  self.assertTrue(self.request('/quality/api/session',token=owner)[1]['user']['isAdmin'])
  self.assertEqual(self.request('/quality/api/session',token=member)[1]['user']['id'],'host:admin:8')
  self.assertFalse(self.request('/quality/api/session',token=member)[1]['user']['isAdmin'])

if __name__=='__main__':unittest.main(verbosity=2)

