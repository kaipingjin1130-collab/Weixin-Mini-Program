"""Real A HTTP server and B HTTP substitute; no production services or data."""
import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.request import Request, build_opener, ProxyHandler
from urllib.error import HTTPError

import pytest
import sys
sys.path.insert(0,str(Path(__file__).parents[1]/'candidate'))
import server as s


def http(base,path,body=None,headers=None):
    request=Request(base+path,data=json.dumps(body).encode() if body is not None else None,
                    headers={'Content-Type':'application/json',**(headers or {})})
    try: response=build_opener(ProxyHandler({})).open(request,timeout=5)
    except HTTPError as exc: response=exc
    with response:
        raw=response.read()
        try: value=json.loads(raw)
        except ValueError: value=raw
        return response.status,value,dict(response.headers)


@pytest.fixture
def live(tmp_path,monkeypatch):
    monkeypatch.setattr(s,'DATA',tmp_path)
    monkeypatch.setattr(s,'PREFIX','/quality')
    monkeypatch.setattr(s,'COOKIE_PATH','/quality/')
    monkeypatch.setattr(s,'COOKIE_SECURE','; Secure')
    monkeypatch.setenv('QAXC_PASSWORD','test-only-long-password')
    monkeypatch.delenv('QAXC_AUTH_URL',raising=False)
    monkeypatch.setenv('AB_INTEGRATION_VERSION','1.0')
    monkeypatch.setenv('B_TO_A_KEY','test-b-a')
    monkeypatch.setenv('A_TO_B_KEY','test-a-b')
    cfg={'org_id':'demo-org','is_demo':True,'service':{'org_id':'demo-org','project_ids':['p1'],
         'allowed_actions':['metadata.read','snapshot.read','evidence.read']},
         'grants':{'admin':{'p1':['knowledge.read','imports.read','imports.create']}}}
    conf=tmp_path/'auth.json';conf.write_text(json.dumps(cfg))
    monkeypatch.setenv('AB_AUTHORIZATION_FILE',str(conf))
    s.init()
    task={'id':'t1','projectId':'p1','status':'archived','object':'测试对象','scenario':{'id':'inspection','version':'1.0'},'events':[]}
    snap={'project':{'id':'p1'},'task':task,'evidence':[]}
    with s.db() as db:
        db.execute('INSERT INTO projects VALUES(?,?,?,?)',('p1','测试项目','测试合同',s.now()))
        db.execute('INSERT INTO tasks VALUES(?,?,?,?)',('t1','p1',json.dumps(task),1))
        db.execute('INSERT INTO deliveries VALUES(?,?,?,?)',('d1','t1',1,json.dumps(snap)))
    a=ThreadingHTTPServer(('127.0.0.1',0),s.Handler)
    thread=threading.Thread(target=a.serve_forever,daemon=True);thread.start()
    base=f'http://127.0.0.1:{a.server_port}/quality'
    code,login,_=http(base,'/api/login',{'password':'test-only-long-password'})
    assert code==200
    try: yield base,login['token'],cfg,conf
    finally: a.shutdown();a.server_close();thread.join()


def test_live_service_identity_metadata_and_user_compatibility(live):
    base,token,cfg,conf=live
    service={'Authorization':'Bearer test-b-a'}
    assert http(base,'/integration/v1/identity/resolve',{'project_id':'p1'},{**service,'X-AB-Session':token})[0]==200
    assert http(base,'/api/work/delivery-meta/d1',headers=service)[1]['eligible'] is True
    assert http(base,'/api/work/snapshot/d1',headers={'Authorization':'Bearer '+token})[0]==200
    assert http(base,'/api/work/evidence/unknown',headers=service)[0]==422
    assert http(base,'/integration/v1/identity/archive',{},service)[0]==404
    http(base,'/api/logout',{}, {'Authorization':'Bearer '+token})
    assert http(base,'/integration/v1/identity/resolve',{}, {**service,'X-AB-Session':token})[0]==401
    assert http(base,'/api/work/snapshot/d1',headers=service)[0]==200


def test_a_waiting_for_b_allows_identity_callback_and_database_write(live,monkeypatch):
    base,token,cfg,conf=live
    class B(BaseHTTPRequestHandler):
        def log_message(self,*args): pass
        def do_POST(self):
            self.rfile.read(int(self.headers['Content-Length']))
            code,identity,_=http(base,'/integration/v1/identity/resolve',{'project_id':'p1'},
                 {'Authorization':'Bearer test-b-a','X-AB-Session':self.headers['X-AB-Session']})
            assert code==200 and identity['subject_id']=='admin'
            with s.db() as db:
                db.execute('UPDATE projects SET name=? WHERE id=?',('回调时可写','p1'))
            result={'query_id':'q1','status':'insufficient_evidence','knowledge_release_id':None,
                 'items':[],'citations':[],'missing_conditions':['对象分类'],'warnings':[], 'requiresConfirmation':True}
            body=json.dumps(result).encode();self.send_response(200);self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
    b=ThreadingHTTPServer(('127.0.0.1',0),B)
    thread=threading.Thread(target=b.serve_forever,daemon=True);thread.start()
    monkeypatch.setenv('QAXC_B_URL',f'http://127.0.0.1:{b.server_port}')
    try:
        code,result,_=http(base,'/api/work/knowledge',{'taskId':'t1','question':'检查什么？'}, {'Authorization':'Bearer '+token})
        assert code==200 and result['status']=='insufficient_evidence' and result['items']==[]
        assert result['version']=='ab-integration/1.0'
    finally: b.shutdown();b.server_close();thread.join()


def test_browser_query_needs_csrf_and_loopback_cookie_exception(live,monkeypatch):
    base,token,cfg,conf=live
    assert http(base,'/api/work/knowledge',{'taskId':'t1','question':'检查什么？'}, {'Cookie':'qaxc_session='+token})[0]==403
    monkeypatch.setenv('QAXC_LOOPBACK_HTTP_DEV','1')
    _,_,headers=http(base,'/api/login',{'password':'test-only-long-password'})
    assert 'Secure' not in headers['Set-Cookie']
    _,_,headers=http(base,'/api/login',{'password':'test-only-long-password'},{'Host':'external.example'})
    assert 'Secure' in headers['Set-Cookie']
    code,script,_=http(base,'/ab-client.js')
    assert code==200 and b"request('/api/work/integration-context')" in script
    assert b"request('/quality/api/work/integration-context')" not in script
