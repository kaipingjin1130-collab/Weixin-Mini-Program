"""Private host-account adapter. Credentials are never persisted or logged."""
import json
import os
import re
from urllib.request import Request, build_opener, ProxyHandler, HTTPRedirectHandler
from urllib.error import HTTPError

class NoRedirect(HTTPRedirectHandler):
 def redirect_request(self, *args, **kwargs): return None

class AuthError(Exception):
 def __init__(self, message, status=503): self.message, self.status = message, status

def enabled(): return bool(os.environ.get('QAXC_AUTH_URL'))

def call(action, data=None, cookie='', timeout=8):
 url=os.environ['QAXC_AUTH_URL'].rstrip('/')+'/'+action
 headers={'Content-Type':'application/json','X-Qaxc-Service-Key':os.environ['QAXC_AUTH_KEY']}
 if cookie: headers['Cookie']=cookie
 try:
  req=Request(url,json.dumps(data or {}).encode(),headers,method='POST')
  with build_opener(ProxyHandler({}),NoRedirect()).open(req,timeout=timeout) as res:
   result=json.loads(res.read(1024*1024))
 except HTTPError as e:
  if e.code in (401,403): raise AuthError('老平台账号或密码不正确，或账号已停用',401)
  raise AuthError('老平台认证服务暂不可用，请稍后重试')
 except Exception:
  raise AuthError('老平台认证服务暂不可用，请稍后重试')
 if result.get('aud')!='qaxc' or result.get('active') is not True:
  raise AuthError('老平台登录状态已失效，请重新登录',401)
 return result

def identity(result):
 uid=result.get('id','')
 if not isinstance(uid,str) or not re.fullmatch(r'host:admin:[1-9][0-9]*',uid):
  raise AuthError('老平台返回的账号信息不完整')
 return dict(id=uid,username=uid,name=str(result.get('name') or uid)[:100],
             isAdmin=result.get('isAdmin') is True,authSource='host')

def register(c,user):
 # Empty digest disables local password authentication for imported identities.
 c.execute('INSERT INTO users(id,username,name,salt,digest) VALUES(?,?,?,?,?) '
           'ON CONFLICT(id) DO UPDATE SET name=excluded.name',
           (user['id'],user['username'],user['name'],'',''))

def is_admin(user): return user.get('isAdmin') is True or user.get('id')=='admin'
