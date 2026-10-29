"""Real A HTTP handler + real B routes/queue functions + isolated PostgreSQL."""
import copy
import json
import os
import sys
import threading
import socket
import time
import subprocess
import zipfile
from pathlib import Path
from uuid import uuid4
from http.server import ThreadingHTTPServer

import httpx
import pytest
from jsonschema import Draft202012Validator, FormatChecker
from backend.app import app
from backend.config import settings
from backend.db import Session
from backend.integrations.a.models import AImport
from backend.integrations.a.tasks import import_job, retrospective_job

ROOT = Path(__file__).resolve().parents[2]
SCHEMA = json.loads((ROOT/'platform-module/integration-v1/reference/接口约定v1/schemas.json').read_text(encoding='utf-8'))
EVIDENCE = {}
if not os.environ.get('B_DATABASE_URL', '').endswith('/risk_b_v1_test'):
    pytest.skip('Dedicated v1 integration database required; run tools/check_v1.py.', allow_module_level=True)


def schema(name, value):
    Draft202012Validator({**SCHEMA, '$ref': '#/$defs/'+name}, format_checker=FormatChecker()).validate(value)


def contract_response(response):
    path=response.request.url.path
    if path.startswith('/quality/b/'):
        path=path[len('/quality/b'):]
    if not path.startswith('/integration/v1/a-'):
        return
    response.read()
    if response.status_code>=400:name='error'
    elif path.endswith('/a-knowledge/query'):name='knowledge_response'
    elif path.endswith(('/retrospective','/retrospectives')):name='retrospective_response'
    elif path.endswith('/a-imports') and response.request.method=='GET':name='import_list'
    else:name='import_response'
    schema(name,response.json())
    key=(response.request.url.path.startswith('/quality/b/'),response.request.method,name,response.status_code,response.json().get('status'),response.json().get('replayed'))
    EVIDENCE.setdefault(key,{'method':response.request.method,'path':str(response.request.url).split(response.request.url.host+':'+str(response.request.url.port))[-1],
        'request':json.loads(response.request.content) if response.request.content else None,
        'status':response.status_code,'schema':name,'schema_valid':True,'response':response.json()})


@pytest.fixture(scope='session',autouse=True)
def write_evidence():
    yield
    path=ROOT/'b-risk-knowledge/.local/v1-contract-evidence.json'
    path.write_text(json.dumps({'scope':'Real A/B localhost HTTP; isolated test identity and synthetic fixtures; not production acceptance',
        'responses':list(EVIDENCE.values())},ensure_ascii=False,indent=2),encoding='utf-8')


@pytest.fixture
def live(tmp_path, monkeypatch):
    sys.path.insert(0, str(ROOT/'platform-module/candidate'))
    import server as a
    import ab_v1
    old = {k: getattr(settings, k) for k in ['auth_mode', 'a_base', 'a_org_id', 'a_to_b_key', 'b_to_a_key']}
    for k,v in {'auth_mode':'a', 'a_org_id':'demo-org', 'a_to_b_key':'test-a-to-b', 'b_to_a_key':'test-b-to-a'}.items():
        object.__setattr__(settings, k, v)
    monkeypatch.setenv('AB_INTEGRATION_VERSION','1.0')
    monkeypatch.setenv('B_TO_A_KEY','test-b-to-a')
    monkeypatch.setenv('A_TO_B_KEY','test-a-to-b')
    monkeypatch.setenv('B_AUTH_MODE','a')
    monkeypatch.setenv('A_ORG_ID','demo-org')
    monkeypatch.setenv('QAXC_PASSWORD','v1-isolated-test-password')
    monkeypatch.delenv('QAXC_AUTH_URL', raising=False)
    monkeypatch.setattr(a, 'DATA', tmp_path/'a-data')
    monkeypatch.setattr(a, 'PREFIX', '/quality')
    monkeypatch.setattr(a, 'COOKIE_PATH', '/quality/')
    project, task = 'v1-p-'+uuid4().hex, 'v1-t-'+uuid4().hex
    deliveries = ['v1-d-'+uuid4().hex, 'v1-d-'+uuid4().hex]
    config = {'org_id':'demo-org','is_demo':True,
        'service':{'org_id':'demo-org','project_ids':[project], 'allowed_actions':sorted(ab_v1.SERVICE_ACTIONS)},
        'grants':{'admin':{project:sorted(ab_v1.PERMISSIONS)}}}
    conf=tmp_path/'a-auth.json';conf.write_text(json.dumps(config), encoding='utf-8')
    monkeypatch.setenv('AB_AUTHORIZATION_FILE',str(conf))
    registration=tmp_path/'b-registration.json'
    registration.write_text(json.dumps({'source_system':'a','org_id':'demo-org','project_ids':[project],
        'allowed_actions':['delivery.meta','delivery.snapshot','delivery.attachment'],'enabled':True}),encoding='utf-8')
    monkeypatch.setenv('B_A_SOURCE_REGISTRATION',str(registration))
    policy=tmp_path/'b-worker.json'
    policy.write_text(json.dumps({'org_id':'demo-org','projects':{project:sorted(ab_v1.PERMISSIONS)}}),encoding='utf-8')
    monkeypatch.setenv('B_WORKER_AUTHORIZATION',str(policy))
    a.init()
    sample=json.loads((ROOT/'platform-module/integration-v1/samples/completed-task-demo.json').read_text(encoding='utf-8'))
    original_project, original_task=sample['project']['id'],sample['task']['id']
    sample=json.loads(json.dumps(sample).replace(original_project,project).replace(original_task,task))
    for index, delivery in enumerate(sample['task'].get('deliveries', [])):
        if index < len(deliveries):
            delivery['id'], delivery['version'] = deliveries[index], index+1
    with zipfile.ZipFile(ROOT/'platform-module/integration-v1/samples/completed-task-demo.zip') as archive:
        for evidence in sample['evidence']:
            evidence['filename']=evidence['id']+'.png'
            (a.DATA/'uploads'/evidence['filename']).write_bytes(archive.read(evidence['packagePath']))
    with a.db() as db:
        db.execute('INSERT INTO projects VALUES(?,?,?,?)',(project,'v1隔离验收','测试',a.now()))
        db.execute('INSERT INTO tasks VALUES(?,?,?,?)',(task,project,json.dumps(sample['task']),1))
        for version, delivery in enumerate(deliveries,1):
            snap=copy.deepcopy(sample);snap['version']=version
            snap['task']['deliveries']=[{'id':delivery,'version':version,'createdAt':snap['exportedAt']}]
            db.execute('INSERT INTO deliveries VALUES(?,?,?,?)',(delivery,task,version,json.dumps(snap)))
    server=ThreadingHTTPServer(('127.0.0.1',0),a.Handler)
    thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
    base=f'http://127.0.0.1:{server.server_port}/quality'
    object.__setattr__(settings,'a_base',base)
    monkeypatch.setenv('A_INTERNAL_BASE',base)
    monkeypatch.setattr(a,'V1_TEST_BASE',base,raising=False)
    # Exercise the actual HTTP boundary, including JSON/error serialization.
    import uvicorn
    sock=socket.socket();sock.bind(('127.0.0.1',0))
    bbase=f'http://127.0.0.1:{sock.getsockname()[1]}'
    bserver=uvicorn.Server(uvicorn.Config(app,log_level='error',access_log=False))
    bt=threading.Thread(target=lambda:bserver.run(sockets=[sock]),daemon=True);bt.start()
    for _ in range(100):
        if bserver.started:break
        time.sleep(.02)
    assert bserver.started
    monkeypatch.setenv('QAXC_B_URL',bbase)
    monkeypatch.setenv('QAXC_B_STATIC',str(ROOT/'b-risk-knowledge/frontend/dist'))
    def login():
        r=httpx.post(base+'/api/login',json={'password':'v1-isolated-test-password'},trust_env=False)
        assert r.status_code==200,r.text
        return {'Authorization':'Bearer test-a-to-b','X-AB-Session':r.json()['token']}
    try:
        with httpx.Client(base_url=bbase,trust_env=False,timeout=30,event_hooks={'response':[contract_response]}) as b:
            yield b, a, login, config, conf, project, task, deliveries
    finally:
        bserver.should_exit=True;bt.join(timeout=10);sock.close()
        server.shutdown();server.server_close();thread.join()
        for k,v in old.items():object.__setattr__(settings,k,v)


def create(live, key=None, version=1):
    b,a,login,cfg,conf,project,task,deliveries=live
    headers={**login(),'Idempotency-Key':key or uuid4().hex}
    body={'source_system':'a','project_id':project,'task_id':task,'delivery_id':deliveries[version-1],'delivery_version':version}
    response=b.post('/integration/v1/a-imports',headers=headers,json=body)
    assert response.status_code in (200,202),response.text
    schema('import_response',response.json())
    return response,headers,body


def test_v1_real_import_logout_old_version_retrospective_and_withdraw(live):
    b,a,login,cfg,conf,project,task,deliveries=live
    response,headers,body=create(live)
    ident=response.json()['import_id']
    with Session() as db:run_id=db.get(AImport,ident).run_id
    # Explicit logout/session loss must not block registered service background work.
    a.SESSIONS.clear();a.SESSION_USERS.clear()
    assert b.get('/integration/v1/a-imports/'+ident,headers=headers).status_code==401
    import_job(run_id)
    headers=login()
    r=b.get('/integration/v1/a-imports/'+ident,headers=headers)
    assert r.status_code==200,r.text
    schema('import_response',r.json());assert r.json()['status']=='ready'
    assert r.json()['warnings'] and 'events[].occurred_at' in r.json()['missing_fields']
    later,_,_=create(live,version=2)
    with Session() as db:import_job_id=db.get(AImport,later.json()['import_id']).run_id
    import_job(import_job_id)
    # Version 1 remains readable and usable after version 2 becomes ready.
    r=b.get('/integration/v1/a-imports/'+ident,headers=headers);assert r.status_code==200,r.text
    r=b.post('/integration/v1/a-imports/'+ident+'/retrospectives',headers={**headers,'Idempotency-Key':uuid4().hex},json={'expected_version':r.json()['version']})
    assert r.status_code==202,r.text;schema('retrospective_response',r.json())
    with Session() as db:retro_run=db.get(AImport,ident).retrospective_run_id
    retrospective_job(retro_run)
    r=b.get('/integration/v1/a-imports/'+ident+'/retrospective',headers=headers)
    assert r.status_code==200,r.text;schema('retrospective_response',r.json());assert r.json()['status']=='ready'
    with a.db() as db:db.execute('INSERT INTO ab_source_withdrawals VALUES(?,?,?,?)',(deliveries[0],a.now(),'test','admin'))
    assert b.get('/integration/v1/a-imports/'+ident,headers=headers).status_code==410
    assert b.get('/integration/v1/a-imports/'+later.json()['import_id'],headers=headers).status_code==200
    later_state=b.get('/integration/v1/a-imports/'+later.json()['import_id'],headers=headers).json()
    later_material=b.get('/api/v1/task-packages/'+later_state['receipt_id'],headers=headers)
    assert later_material.status_code==200,later_material.text
    assert later_material.json()['diff']['previous_receipt_id'] is None


def test_v1_replay_scope_and_schema(live):
    b,a,login,cfg,conf,project,task,deliveries=live
    r,h,body=create(live);ident=r.json()['import_id']
    replay=b.post('/integration/v1/a-imports',headers=h,json=body)
    assert replay.status_code==200 and replay.json()['import_id']==ident
    replay=b.post('/integration/v1/a-imports',headers={**h,'Idempotency-Key':uuid4().hex},json=body)
    assert replay.status_code==200 and replay.json()['import_id']==ident
    changed={**body,'delivery_id':deliveries[1],'delivery_version':2}
    assert b.post('/integration/v1/a-imports',headers=h,json=changed).status_code==409
    listing=b.get('/integration/v1/a-imports',headers=h,params={k:body[k] for k in ['project_id','delivery_id','delivery_version']})
    assert listing.status_code==200;schema('import_list',listing.json())
    assert b.get('/integration/v1/a-imports',headers=h).status_code==422
    retro=b.get('/integration/v1/a-imports/'+ident+'/retrospective',headers=h)
    schema('retrospective_response',retro.json());assert retro.json()['status']=='not_created'
    cfg['grants']['admin'][project]=['knowledge.read']
    conf.write_text(json.dumps(cfg),encoding='utf-8')
    denied=b.post('/integration/v1/a-imports',headers=h,json=body)
    assert denied.status_code==403;schema('error',denied.json())


def queued(run_id):
    """A separate real worker consumes only this test's persisted job."""
    from sqlalchemy import text
    from backend.models import ProcessingRun
    queue='v1-'+uuid4().hex
    with Session.begin() as db:
        run=db.get(ProcessingRun,run_id)
        db.execute(text('UPDATE procrastinate_jobs SET queue_name=:queue WHERE id=:id'),{'queue':queue,'id':run.queue_job_id})
    code="import asyncio,sys;from backend.queue import queue_app;asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy()) if sys.platform=='win32' else None;queue_app.run_worker(queues=[sys.argv[1]],wait=False,install_signal_handlers=False)"
    result=subprocess.run([sys.executable,'-c',code,queue],cwd=ROOT/'b-risk-knowledge',capture_output=True,text=True,timeout=90)
    assert result.returncode==0,result.stderr[-3000:]
    with Session() as db:
        run=db.get(ProcessingRun,run_id)
        assert run.status=='succeeded',run.error


def test_v1_fail_retry_concurrency_dependency_and_b_withdraw(live,monkeypatch):
    from concurrent.futures import ThreadPoolExecutor
    from backend.models import ProcessingRun
    from backend.auth import Problem
    b,a,login,cfg,conf,project,task,deliveries=live
    r,h,body=create(live);ident=r.json()['import_id'];url='/integration/v1/a-imports/'+ident
    with ThreadPoolExecutor(max_workers=3) as pool:
        copies=list(pool.map(lambda _:b.post('/integration/v1/a-imports',headers={**h,'Idempotency-Key':uuid4().hex},json=body),range(3)))
    assert all(x.status_code==200 and x.json()['import_id']==ident for x in copies)
    with Session() as db:run_id=db.get(AImport,ident).run_id
    original=settings.a_base
    object.__setattr__(settings,'a_base','http://127.0.0.1:1/quality')
    try:
        failure=b.get(url,headers=h);assert failure.status_code==503;schema('error',failure.json())
        with pytest.raises(Problem):import_job(run_id)
    finally:object.__setattr__(settings,'a_base',original)
    from sqlalchemy import text
    with Session.begin() as db:
        run=db.get(ProcessingRun,run_id)
        db.execute(text("UPDATE procrastinate_jobs SET status='failed' WHERE id=:id"),{'id':run.queue_job_id})
    failed=b.get(url,headers=h).json();assert failed['status']=='failed'
    retry=b.post(url+'/retry',headers={**h,'Idempotency-Key':uuid4().hex},json={'expected_version':failed['version']})
    assert retry.status_code==200,retry.text
    a.SESSIONS.clear();a.SESSION_USERS.clear()
    queued(run_id)
    h=login();ready=b.get(url,headers=h).json();assert ready['status']=='ready'
    with Session() as db:assert db.get(AImport,ident).run_id==run_id
    stale=b.post(url+'/withdraw',headers={**h,'Idempotency-Key':uuid4().hex},json={'expected_version':1,'reason':'test'})
    assert stale.status_code==409;schema('error',stale.json())
    withdrawn=b.post(url+'/withdraw',headers={**h,'Idempotency-Key':uuid4().hex},json={'expected_version':ready['version'],'reason':'测试仅撤回B接入'})
    assert withdrawn.status_code==200,withdrawn.text
    assert not any(withdrawn.json()['capabilities'].values())
    assert b.get('/api/v1/task-packages/'+ready['receipt_id']+'/snapshot',headers=h).status_code==410
    with httpx.Client(trust_env=False) as client:
        meta=client.get(a.V1_TEST_BASE+'/api/work/delivery-meta/'+deliveries[0],headers={'Authorization':'Bearer test-b-to-a'})
    assert meta.status_code==200 and meta.json()['withdrawn'] is False
    pending,headers,_=create(live,version=2)
    fresh=pending.json()
    response=b.post('/integration/v1/a-imports/'+fresh['import_id']+'/withdraw',headers={**headers,'Idempotency-Key':uuid4().hex},json={'expected_version':fresh['version'],'reason':'取消尚未处理的测试任务'})
    assert response.status_code==200,response.text
    with Session() as db:
        row=db.get(AImport,fresh['import_id']);job=db.get(ProcessingRun,row.run_id)
        assert job.status=='failed' and row.status=='withdrawn' and row.receipt_id is None
        assert headers['X-AB-Session'] not in json.dumps(job.payload)


def test_v1_fine_permissions_and_published_knowledge(live):
    b,a,login,cfg,conf,project,task,deliveries=live
    r,h,body=create(live);ident=r.json()['import_id'];url='/integration/v1/a-imports/'+ident
    with Session() as db:run_id=db.get(AImport,ident).run_id
    queued(run_id)
    state=b.get(url,headers=h).json()
    r=b.post(url+'/retrospectives',headers={**h,'Idempotency-Key':uuid4().hex},json={'expected_version':state['version']})
    assert r.status_code==202,r.text
    with Session() as db:queued_id=db.get(AImport,ident).retrospective_run_id
    queued(queued_id)
    retro=b.get(url+'/retrospective',headers=h).json();rid=retro['retrospective_id']
    def get(path):
        r=b.get('/api/v1'+path,headers=h);assert r.status_code==200,r.text;return r.json()
    def post(path,data):
        r=b.post('/api/v1'+path,headers={**h,'Idempotency-Key':uuid4().hex},json=data);assert r.status_code in (200,202),r.text;return r.json()
    def version(d,**extra):return {'row_version':d['row_version'],'revision_id':d['revision_id'],'reason':'隔离联测核对',**extra}
    d=get('/retrospectives/'+rid)
    assert not d['timeline']['intervals'] and d['timeline']['unknown_time']
    for row in d['findings']+d['suggestions']:row['review_state']='confirmed'
    r=b.patch('/api/v1/retrospectives/'+rid+'/draft',headers=h,json=version(d,summary=d['summary'],findings=d['findings'],suggestions=d['suggestions']))
    assert r.status_code==200,r.text
    d=get('/retrospectives/'+rid);post('/retrospectives/'+rid+'/submit-review',version(d))
    d=get('/retrospectives/'+rid);post('/reviews/'+d['revision_id']+'/approve',version(d,evidence_checked=True))
    d=get('/retrospectives/'+rid);kid=post('/retrospectives/'+rid+'/publish-experiences',version(d))['draft_ids'][0]
    k=get('/knowledge/'+kid);post('/knowledge/'+kid+'/submit-review',version(k))
    k=get('/knowledge/'+kid);post('/reviews/'+k['revision_id']+'/approve',version(k,evidence_checked=True))
    rel=post('/releases',{'project_id':project,'revision_ids':[k['revision_id']]});queued(rel['job_id'])
    release=get('/releases/'+rel['id']);post('/releases/'+rel['id']+'/activate',{'row_version':release['row_version'],'expected_active_id':None})
    question=post('/training/questions/generate',{'knowledge_revision_ids':[k['revision_id']],'types':['single_choice']})['items'][0]
    post('/training/questions/'+question['id']+'/submit-review',version(question))
    question=get('/training/questions/'+question['id'])
    post('/reviews/'+question['revision_id']+'/approve',version(question,evidence_checked=True))
    package=post('/training/packages',{'title':'v1隔离学习包','package_key':'v1-'+uuid4().hex,'version':1,'project_id':project,'question_revision_ids':[question['revision_id']],'role_scope':['learner']})
    post('/training/packages/'+package['id']+'/publish',{'row_version':package['row_version'],'reason':'隔离联测审核发布'})
    cfg['grants']['admin'][project]=['training.learn'];conf.write_text(json.dumps(cfg),encoding='utf-8')
    attempt=post('/training/attempts',{'package_version_id':package['id']})
    assert get('/training/attempts/'+attempt['id'])['questions']
    assert b.get('/api/v1/training/packages/'+package['id'],headers=h).status_code==403
    # Only a knowledge read grant: real published content, no draft/admin/import mutations.
    cfg['grants']['admin'][project]=['knowledge.read'];conf.write_text(json.dumps(cfg),encoding='utf-8')
    request={'request_id':uuid4().hex,'project_id':project,'task_id':task,'scenario_id':'inspection','scenario_version':1,'question':k['title'],'object':'现场巡查','stage':'execution','conditions':{}}
    answer=b.post('/integration/v1/a-knowledge/query',headers=h,json=request)
    assert answer.status_code==200,answer.text;schema('knowledge_response',answer.json())
    assert answer.json()['status']=='answered' and answer.json()['citations'],answer.json()
    via_a=httpx.post(a.V1_TEST_BASE+'/api/work/knowledge',headers={'Authorization':'Bearer '+h['X-AB-Session']},json={'taskId':task,'question':k['title']},trust_env=False)
    assert via_a.status_code==200,via_a.text
    assert via_a.json()['status']=='answered' and via_a.json()['citations']
    assert via_a.json()['version']==answer.json()['knowledge_release_id']
    assert b.get('/api/v1/knowledge/'+kid,headers=h).status_code==403
    assert b.get('/api/v1/access',headers=h).status_code==403
    assert b.get('/api/v1/audit-events',headers=h).status_code==403
    assert b.post(url+'/retrospectives',headers={**h,'Idempotency-Key':uuid4().hex},json={'expected_version':1}).status_code==403
    # A read-only retrospective grant must open the actual detail without knowledge/admin grants.
    cfg['grants']['admin'][project]=['retrospective.read'];conf.write_text(json.dumps(cfg),encoding='utf-8')
    assert b.get('/api/v1/retrospectives/'+rid,headers=h).status_code==200
    assert b.patch('/api/v1/retrospectives/'+rid+'/draft',headers=h,json=version(d,summary=d['summary'],findings=d['findings'],suggestions=d['suggestions'])).status_code==403
    assert b.get('/api/v1/audit-events',headers=h).status_code==403
    cfg['grants']['admin'][project]=['retrospective.review'];conf.write_text(json.dumps(cfg),encoding='utf-8')
    audit=b.get('/api/v1/audit-events',headers=h)
    assert audit.status_code==200,audit.text
    assert all(event['project_id']==project for event in audit.json()['items'])
    cfg['grants']['admin'][project]=['knowledge.read'];conf.write_text(json.dumps(cfg),encoding='utf-8')
    with a.db() as db:db.execute('INSERT INTO ab_source_withdrawals VALUES(?,?,?,?)',(deliveries[0],a.now(),'test','admin'))
    assert b.get('/api/v1/published/knowledge/'+kid,headers=h).status_code==410
    assert b.post('/integration/v1/a-knowledge/query',headers=h,json=request).json()['status']=='insufficient_evidence'
    assert not b.get('/api/v1/knowledge/library',headers=h,params={'project_id':project}).json()['items']
    cfg['grants']['admin'][project]=['training.learn'];conf.write_text(json.dumps(cfg),encoding='utf-8')
    assert b.get('/api/v1/training/attempts/'+attempt['id'],headers=h).status_code==410


def test_v1_missing_attachment_and_retrospective_retry(live,monkeypatch):
    from backend.auth import Problem
    from backend.models import ProcessingRun
    from sqlalchemy import text
    b,a,login,cfg,conf,project,task,deliveries=live
    # A declared photo with tampered bytes must remain unavailable, never evidence.
    photo=next((a.DATA/'uploads').glob('*.png'));photo.write_bytes(b'invalid-test-image')
    r,h,body=create(live);ident=r.json()['import_id'];url='/integration/v1/a-imports/'+ident
    with Session() as db:run_id=db.get(AImport,ident).run_id
    queued(run_id)
    state=b.get(url,headers=h).json()
    assert state['status']=='ready' and not state['capabilities']['evidence_complete']
    assert any(w['code']=='attachment_unavailable' for w in state['warnings'])
    r=b.post(url+'/retrospectives',headers={**h,'Idempotency-Key':uuid4().hex},json={'expected_version':state['version']})
    assert r.status_code==202,r.text
    with Session() as db:retro_run=db.get(AImport,ident).retrospective_run_id
    from backend.modules.retrospectives import service
    original=service.generate
    def fail(*args,**kwargs):raise Problem(503,'TEMPORARY_FAILURE','隔离故障注入')
    monkeypatch.setattr(service,'generate',fail)
    with pytest.raises(Problem):retrospective_job(retro_run)
    monkeypatch.setattr(service,'generate',original)
    with Session.begin() as db:
        run=db.get(ProcessingRun,retro_run)
        db.execute(text("UPDATE procrastinate_jobs SET status='failed' WHERE id=:id"),{'id':run.queue_job_id})
    state=b.get(url,headers=h).json();assert state['status']=='ready' and state['retrospective_status']=='failed'
    retry_headers={**h,'Idempotency-Key':uuid4().hex};retry_body={'expected_version':state['version']}
    retry=b.post(url+'/retry',headers=retry_headers,json=retry_body);assert retry.status_code==200,retry.text
    queued(retro_run)
    replay=b.post(url+'/retry',headers=retry_headers,json=retry_body)
    assert replay.status_code==200 and replay.json()['replayed']
    with Session() as db:assert db.get(AImport,ident).retrospective_run_id==retro_run
    ready=b.get(url+'/retrospective',headers=h).json();assert ready['status']=='ready'
    data=b.get('/api/v1/retrospectives/'+ready['retrospective_id'],headers=h).json()
    assert not data['timeline']['intervals']
    # Remove service registration scope while user permissions stay unchanged.
    cfg['service']['project_ids']=[];conf.write_text(json.dumps(cfg),encoding='utf-8')
    denied=b.get(url,headers=h)
    assert denied.status_code==403,denied.text


def test_a_real_cookie_proxy_contract_and_live_revocation(live,monkeypatch):
    b,a,login,cfg,conf,project,task,deliveries=live
    monkeypatch.setenv('QAXC_LOOPBACK_HTTP_DEV','1')
    origin=a.V1_TEST_BASE.removesuffix('/quality')
    body={'source_system':'a','project_id':project,'task_id':task,'delivery_id':deliveries[0],'delivery_version':1}
    prefix='/quality/b/integration/v1/a-imports'
    with httpx.Client(base_url=origin,trust_env=False,timeout=30,event_hooks={'response':[contract_response]}) as browser:
        signed=browser.post('/quality/api/login',json={'password':'v1-isolated-test-password'})
        assert signed.status_code==200 and browser.cookies
        csrf=browser.get('/quality/api/csrf-token').json()['csrf_token']
        headers={'Origin':origin,'X-CSRF-Token':csrf,'Idempotency-Key':uuid4().hex}
        assert browser.post(prefix,json=body).status_code==403
        assert browser.post(prefix,headers={**headers,'Origin':'https://outside.invalid'},json=body).status_code==403
        created=browser.post(prefix,headers=headers,json=body);assert created.status_code==202,created.text
        ident=created.json()['import_id'];url=prefix+'/'+ident
        assert browser.post(prefix,headers=headers,json=body).status_code==200
        with Session() as db:run_id=db.get(AImport,ident).run_id
        queued(run_id)
        state=browser.get(url).json();assert state['status']=='ready'
        restored=browser.get(prefix,params={k:body[k] for k in ('project_id','delivery_id','delivery_version')})
        assert restored.status_code==200 and restored.json()['items'][0]['import_id']==ident
        assert browser.get(url+'/retrospective').json()['status']=='not_created'
        retro=browser.post(url+'/retrospectives',headers={**headers,'Idempotency-Key':uuid4().hex},json={'expected_version':state['version']})
        assert retro.status_code==202,retro.text
        with Session() as db:run_id=db.get(AImport,ident).retrospective_run_id
        queued(run_id)
        assert browser.get(url+'/retrospective').json()['status']=='ready'
        current=browser.get(url).json()
        assert browser.post(url+'/retry',headers={**headers,'Idempotency-Key':uuid4().hex},json={'expected_version':current['version']}).status_code==409
        cfg['grants']['admin'][project]=['knowledge.read'];conf.write_text(json.dumps(cfg),encoding='utf-8')
        assert browser.get(url).status_code==403
        # A's own task-context knowledge endpoint reaches the actual B service.
        answer=browser.post('/quality/api/work/knowledge',headers=headers,json={'taskId':task,'question':'现场检查'})
        assert answer.status_code==200,answer.text
        assert answer.json()['status']=='insufficient_evidence' and answer.json()['items']==[]
        assert answer.json()['requiresConfirmation'] is True
        import ab_v1
        cfg['grants']['admin'][project]=sorted(ab_v1.PERMISSIONS);conf.write_text(json.dumps(cfg),encoding='utf-8')
        withdrawn=browser.post(url+'/withdraw',headers={**headers,'Idempotency-Key':uuid4().hex},json={'expected_version':current['version'],'reason':'A代理验收撤回'})
        assert withdrawn.status_code==200 and withdrawn.json()['status']=='withdrawn'
        a.SESSIONS.clear();a.SESSION_USERS.clear()
        assert browser.get(url).status_code==401
