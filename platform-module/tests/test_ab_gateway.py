import importlib.util
import json
import sqlite3
import io
from contextlib import contextmanager
from pathlib import Path
from types import SimpleNamespace
import pytest

spec = importlib.util.spec_from_file_location('ab_gateway', Path(__file__).parents[1] / 'candidate/ab_gateway.py')
gateway = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gateway)

class Problem(Exception):
    def __init__(self, message, status=400):
        self.message, self.status = message, status

@pytest.fixture
def platform(tmp_path):
    connection = sqlite3.connect(':memory:')
    connection.row_factory = sqlite3.Row
    connection.executescript('CREATE TABLE projects(id TEXT,name TEXT); CREATE TABLE memberships(project_id TEXT,user_id TEXT,role TEXT); CREATE TABLE tasks(id TEXT,payload TEXT); CREATE TABLE deliveries(id TEXT,task_id TEXT,payload TEXT);')
    connection.execute('INSERT INTO projects VALUES(?,?)', ('p1','真实项目'))
    connection.execute('INSERT INTO memberships VALUES(?,?,?)', ('p1','u1','manager'))
    task = {'projectId':'p1','status':'archived','title':'巡查','deliveries':[{'id':'d1','version':1}]}
    connection.execute('INSERT INTO tasks VALUES(?,?)', ('t1',json.dumps(task)))
    connection.execute('INSERT INTO deliveries VALUES(?,?,?)', ('d1','t1',json.dumps({'project':{'id':'p1'},'evidence':[]})))
    @contextmanager
    def db():
        yield connection
    return SimpleNamespace(db=db,host_auth=SimpleNamespace(is_admin=lambda u:False),Problem=Problem,DATA=tmp_path), connection, task

def test_roles_do_not_expand_member_access():
    assert 'run' not in gateway.project_permissions('inspector')
    assert 'manage' not in gateway.project_permissions('manager')
    assert 'package_receive' in gateway.project_permissions('manager')

def test_current_archive_and_membership(platform):
    server, db, task = platform
    user={'id':'u1','name':'负责人'}
    assert gateway.archive_data(server,user,'archives',{})['items'][0]['id']=='d1'
    assert gateway.archive_data(server,user,'archive',{'delivery_id':'d1'})['snapshot']['project']['id']=='p1'
    db.execute('DELETE FROM memberships')
    with pytest.raises(Problem) as exc:
        gateway.archive_data(server,user,'archive',{'delivery_id':'d1'})
    assert exc.value.status == 403

@pytest.mark.parametrize('status,deliveries',[('active',[{'id':'d1'}]),('archived',[{'id':'d2'}])])
def test_reopened_or_superseded_archive_is_rejected(platform,status,deliveries):
    server, db, task=platform
    task.update(status=status,deliveries=deliveries)
    db.execute('UPDATE tasks SET payload=?',(json.dumps(task),))
    with pytest.raises(Problem) as exc:
        gateway.archive_data(server,{'id':'u1','name':'负责人'},'archive',{'delivery_id':'d1'})
    assert exc.value.status == 410

def test_attachment_cannot_escape_upload_directory(platform):
    server,db,task=platform
    snapshot={'project':{'id':'p1'},'evidence':[{'id':'e1','projectId':'p1','filename':'../../private','size':1,'sha256':'bad'}]}
    db.execute('UPDATE deliveries SET payload=?',(json.dumps(snapshot),))
    with pytest.raises(Problem) as exc:
        gateway.archive_data(server,{'id':'u1','name':'负责人'},'attachment',{'delivery_id':'d1','evidence_id':'e1'})
    assert exc.value.status == 410

@pytest.fixture
def handler(tmp_path, monkeypatch):
    class Handler:
        def handle_request(self, method):
            self.result = (404, None)
        def auth(self):
            if self.headers.get('Cookie') != 'qaxc_session=valid':
                raise Problem('未登录',401)
            return 'valid'
        def send(self,value,status=200,**kwargs):
            self.result = (status,value)
    (tmp_path/'index.html').write_text('platform page')
    server=SimpleNamespace(Handler=Handler,PREFIX='/quality',ROOT=tmp_path,Problem=Problem,
        host_auth=SimpleNamespace(AuthError=Problem))
    monkeypatch.setenv('QAXC_B_STATIC',str(tmp_path))
    monkeypatch.setenv('QAXC_B_URL','http://127.0.0.1:18181')
    monkeypatch.setenv('A_TO_B_KEY','server-key')
    gateway.install(server)
    instance=Handler()
    instance.headers={'Cookie':'qaxc_session=valid','Host':'platform.test'}
    instance.path='/quality/b/'
    instance.rfile=io.BytesIO(b'{}')
    instance.client_address=('127.0.0.1',123)
    return instance

def test_static_requires_existing_login(handler):
    handler.headers={}
    handler.handle_request('GET')
    assert handler.result[0]==401

def test_static_path_cannot_escape(handler):
    handler.path='/quality/b/%2e%2e/secret'
    handler.handle_request('GET')
    assert handler.result[0]==404

def test_mutation_requires_csrf(handler):
    handler.path='/quality/b/api/v1/platform-inputs'
    handler.handle_request('POST')
    assert handler.result[0]==403

def test_cross_origin_mutation_rejected(handler):
    handler.path='/quality/api/csrf-token'
    handler.handle_request('GET')
    handler.headers.update({'X-CSRF-Token':handler.result[1]['csrf_token'],'Origin':'https://other.test'})
    handler.path='/quality/b/api/v1/platform-inputs'
    handler.handle_request('POST')
    assert handler.result[0]==403

def test_proxy_replaces_browser_credentials(handler,monkeypatch):
    calls=[]
    class Response(io.BytesIO):
        code=200
        headers={'Content-Type':'application/json'}
    def open_request(req,timeout):
        calls.append(req)
        return Response(b'{"ok":true}')
    monkeypatch.setattr(gateway,'build_opener',lambda *args:SimpleNamespace(open=open_request))
    handler.headers.update({'Authorization':'Bearer forged','X-AB-Session':'forged'})
    handler.path='/quality/b/api/v1/me'
    handler.handle_request('GET')
    assert handler.result[0]==200
    headers={k.lower():v for k,v in calls[0].header_items()}
    assert headers['authorization']=='Bearer server-key'
    assert headers['x-ab-session']=='valid'
    assert 'cookie' not in headers
