import hashlib
import io
import json
import sqlite3
import sys
import threading
import time
from contextlib import contextmanager
from pathlib import Path
from types import SimpleNamespace

import pytest
from jsonschema import Draft202012Validator

sys.path.insert(0, str(Path(__file__).parents[1] / 'candidate'))
import ab_v1


class Problem(Exception):
    def __init__(self, message, status=400):
        self.message, self.status = message, status


@pytest.fixture
def platform(tmp_path, monkeypatch):
    db = sqlite3.connect(':memory:')
    db.row_factory = sqlite3.Row
    db.executescript('''CREATE TABLE projects(id TEXT PRIMARY KEY);
        CREATE TABLE memberships(project_id TEXT,user_id TEXT);
        CREATE TABLE deliveries(id TEXT PRIMARY KEY,task_id TEXT,version INTEGER,payload TEXT);
        INSERT INTO projects VALUES('p1'); INSERT INTO projects VALUES('p2');
        INSERT INTO memberships VALUES('p1','u1');''')
    ab_v1.init(db)
    (tmp_path/'uploads').mkdir()
    (tmp_path/'uploads/photo').write_bytes(b'real test photo')
    item = dict(id='e1',projectId='p1',filename='photo',name='photo.jpg',mime='image/jpeg',
                size=15,sha256=hashlib.sha256(b'real test photo').hexdigest())
    snap = dict(project={'id':'p1'},task={'status':'archived','events':[]},evidence=[item],version=1)
    for did, version in [('old',1),('new',2)]:
        db.execute('INSERT INTO deliveries VALUES(?,?,?,?)',(did,'t1',version,json.dumps(snap)))
    cfg = dict(org_id='test-org',is_demo=True,service=dict(org_id='test-org',project_ids=['p1'],
               allowed_actions=sorted(ab_v1.SERVICE_ACTIONS)),grants={'u1':{'p1':['knowledge.read','imports.read']}})
    config_path=tmp_path/'auth.json'
    config_path.write_text(json.dumps(cfg))
    monkeypatch.setenv('AB_AUTHORIZATION_FILE',str(config_path))
    monkeypatch.setenv('AB_INTEGRATION_VERSION','1.0')
    monkeypatch.setenv('B_TO_A_KEY','test-service-key')
    @contextmanager
    def connect():
        yield db
    class Handler:
        def handle_request(self, method): self.result=(299,{'legacy':True})
        def send(self, body, status=200, **kwargs): self.result=(status,body)
    s=SimpleNamespace(db=connect,DATA=tmp_path,Problem=Problem,PREFIX='/quality',Handler=Handler,
        SESSION_LOCK=threading.Lock(),SESSIONS={'live':time.time()+60},SESSION_USERS={'live':{'id':'u1','name':'测试'}},
        host_auth=SimpleNamespace(is_admin=lambda user:user.get('isAdmin',False),enabled=lambda:False,AuthError=Problem))
    ab_v1.install(s)
    return s, db, cfg, snap


def call(s,path,method='GET',body=None,headers=None):
    h=s.Handler();h.path='/quality'+path
    payload=json.dumps(body or {}).encode()
    h.rfile=io.BytesIO(payload)
    h.headers={'Authorization':'Bearer test-service-key','Content-Length':str(len(payload)),**(headers or {})}
    h.handle_request(method)
    return h.result


def test_identity_contract_and_scope(platform):
    s,db,cfg,snap=platform
    code,value=call(s,'/integration/v1/identity/resolve','POST',{'project_id':'p1'},{'X-AB-Session':'live'})
    assert code==200
    schema=json.loads((Path(__file__).parents[1]/'integration-v1/reference/接口约定v1/schemas.json').read_text(encoding='utf-8'))
    Draft202012Validator({**schema,'$ref':'#/$defs/identity_response'}).validate(value)
    assert value['projects'][0]['permissions']==['imports.read','knowledge.read']
    assert call(s,'/integration/v1/identity/resolve','POST',{'project_id':'p2'},{'X-AB-Session':'live'})[0]==403
    db.execute('DELETE FROM memberships')
    assert call(s,'/integration/v1/identity/resolve','POST',{'project_id':'p1'},{'X-AB-Session':'live'})[0]==403


def test_admin_is_not_automatically_granted_permissions(platform):
    s,db,cfg,snap=platform
    assert ab_v1.identity(s,{'id':'admin','name':'管理员','isAdmin':True},cfg)['projects']==[]


def test_service_does_not_need_browser_session(platform):
    s,db,cfg,snap=platform
    s.SESSIONS.clear()
    assert call(s,'/api/work/snapshot/old')[0]==200
    assert call(s,'/integration/v1/identity/resolve','POST',headers={'X-AB-Session':'live'})[0]==401


def test_historical_archive_and_metadata_schema(platform):
    s,db,cfg,snap=platform
    for did in ['old','new']:
        code,meta=call(s,'/api/work/delivery-meta/'+did)
        assert code==200 and meta['eligible'] is True
        schema=json.loads((Path(__file__).parents[1]/'integration-v1/reference/接口约定v1/schemas.json').read_text(encoding='utf-8'))
        Draft202012Validator({**schema,'$ref':'#/$defs/delivery_meta'}).validate(meta)
    assert call(s,'/api/work/snapshot/old')==call(s,'/api/work/snapshot/old')


def test_withdrawal_blocks_body_but_keeps_metadata(platform):
    s,db,cfg,snap=platform
    db.execute('INSERT INTO ab_source_withdrawals VALUES(?,?,?,?)',('old','2026-10-29T09:00:00+08:00','错误资料','u1'))
    assert call(s,'/api/work/delivery-meta/old')[1]['withdrawn'] is True
    assert call(s,'/api/work/snapshot/old')[0]==410
    assert call(s,'/api/work/evidence/e1?deliveryId=old')[0]==410
    assert call(s,'/api/work/snapshot/new')[0]==200


def test_unarchived_not_eligible(platform):
    s,db,cfg,snap=platform
    snap['task']['status']='handover'
    db.execute('UPDATE deliveries SET payload=? WHERE id=?',(json.dumps(snap),'old'))
    assert call(s,'/api/work/delivery-meta/old')[1]['eligible'] is False
    assert call(s,'/api/work/snapshot/old')[0]==422


def test_attachment_membership_and_hash(platform):
    s,db,cfg,snap=platform
    assert call(s,'/api/work/evidence/e1')[0]==422
    assert call(s,'/api/work/evidence/e2?deliveryId=old')[0]==403
    assert call(s,'/api/work/evidence/e1?deliveryId=old')==(200,b'real test photo')
    (s.DATA/'uploads/photo').write_bytes(b'changed')
    assert call(s,'/api/work/evidence/e1?deliveryId=old')[0]==409


def test_cross_project_and_wrong_service_credential(platform):
    s,db,cfg,snap=platform
    snap['project']['id']='p2'
    db.execute('UPDATE deliveries SET payload=?',(json.dumps(snap),))
    assert call(s,'/api/work/snapshot/old')[0]==403
    assert call(s,'/api/work/snapshot/old',headers={'Authorization':'Bearer forged'})[0]==403


def test_legacy_user_routes_are_preserved(platform):
    s,db,cfg,snap=platform
    assert call(s,'/api/work/snapshot/old',headers={'Authorization':'Bearer live'})[0]==299
    assert call(s,'/api/work/evidence/e1',headers={'Authorization':''})[0]==299


def test_invalid_identity_body_and_unknown_permission(platform):
    s,db,cfg,snap=platform
    assert call(s,'/integration/v1/identity/resolve','POST',{'project_id':[]})[0]==422
    cfg['grants']['u1']['p1'].append('superadmin')
    Path(__import__('os').environ['AB_AUTHORIZATION_FILE']).write_text(json.dumps(cfg))
    with pytest.raises(ValueError): ab_v1.config()
