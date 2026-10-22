import copy
import json
import os
from pathlib import Path
import subprocess
import sys
import time
from uuid import uuid4
from concurrent.futures import ThreadPoolExecutor
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select, func
from backend.app import app
from backend.db import Session
from backend.models import FileAsset, ProcessingRun, UserLink
from backend.modules.task_packages.models import TaskPackage, TaskStream, TaskEvent, TaskPackageAsset, PackageRequest, PackageInvalidation
from backend.modules.task_packages.fixtures import sample, attachment
from backend.modules.task_packages import service
from backend.modules.task_packages.tasks import process_package
from contracts.tools.contract_rules import validate, content_hash, load_json, ROOT

assert os.environ.get('B_DATABASE_URL','').endswith('/risk_b_test')
API='/integration/v1/task-packages'
INTERNAL='/api/v1/task-packages'

def h(role='a-service',key=None):
    result={'Authorization':'Bearer dev-'+role}
    if key:result['Idempotency-Key']=key
    return result

@pytest.fixture(scope='module')
def client():
    worker=subprocess.Popen([sys.executable,'-m','backend.worker'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        with TestClient(app,raise_server_exceptions=False) as c:
            c.package_worker=worker
            yield c
    finally:
        if worker.poll() is None:worker.kill();worker.wait(timeout=10)

def data(scenario='complete',task=None):
    return sample(scenario,task_id=task or 'test-'+uuid4().hex[:20])

def submit(c,body,key=None,role='a-service',internal=False):
    return c.post(INTERNAL if internal else API,headers=h(role,key or str(uuid4())),json=body)

def accepted(c,body,**kwargs):
    r=submit(c,body,**kwargs);assert r.status_code in (200,202),r.text
    errors,_=validate('task-receipt.schema.json',r.json());assert not errors,errors
    return r.json()

def wait(c,ident,state='ready'):
    end=time.monotonic()+25
    while time.monotonic()<end:
        response=c.get(API+'/'+ident,headers=h());assert response.status_code==200,response.text
        status=response.json()
        errors,_=validate('task-status.schema.json',status);assert not errors,errors
        if status['status']==state:return status
        time.sleep(.1)
    pytest.fail(str(status))

def detail(c,ident,role='admin'):
    r=c.get(INTERNAL+'/'+ident,headers=h(role));assert r.status_code==200,r.text
    return r.json()

def retry(c,ident):
    end=time.monotonic()+10
    key=str(uuid4())
    d=detail(c,ident)
    while time.monotonic()<end:
        r=c.post('/api/v1/jobs/'+d['job_id']+'/retry',headers=h('admin',key),json={'row_version':d['job_row_version']})
        if r.status_code==200:return r
        assert r.status_code==409 and r.json()['code']=='QUEUE_NOT_SETTLED',r.text
        time.sleep(.1)
    pytest.fail('Queue did not settle')

def test_service_identity_scope_and_offline_shared_receiver(client):
    body=data()
    assert client.post(API,json=body,headers={'Idempotency-Key':str(uuid4())}).status_code==401
    assert submit(client,body,role='admin').status_code==403
    assert submit(client,body,role='learner',internal=True).status_code==403
    for field,value in [('project_id','project-ungranted'),('org_id','org-forged'),('producer','another-producer')]:
        assert submit(client,{**body,field:value}).status_code==403
    assert submit(client,{**body,'is_demo':False}).status_code==422
    first=accepted(client,body,role='processor',internal=True)
    replay=accepted(client,body)
    assert replay['replayed'] and replay['receipt_id']==first['receipt_id']
    wait(client,first['receipt_id'])
    assert client.get(INTERNAL+'/'+first['receipt_id'],headers=h('outsider')).status_code==403
    assert client.get(API+'/'+first['receipt_id'],headers=h('admin')).status_code==403
    assert client.get('/api/v1/jobs',headers=h()).json()['items']==[]  # Service role does not grant generic platform access.

def test_strict_json_and_untrusted_access_refs(client):
    body=data();raw=json.dumps(body)
    duplicated=raw.replace('"schema_version": "1.0"','"schema_version": "1.0", "schema_version": "1.0"')
    for bad in [duplicated,raw.replace('"package_version": 1','"package_version": NaN')]:
        assert client.post(API,content=bad,headers=h(key=str(uuid4()))).status_code==422
    assert client.post(API,content=b' '*5242881,headers=h(key=str(uuid4()))).status_code==413
    unsafe=copy.deepcopy(body);unsafe['events'][0]['payload']={'unsafe_integer':9007199254740992}
    assert submit(client,unsafe).status_code==422
    for ref in [{'url':'https://example.com/private'},{'connector_id':'demo-store','object_id':'D:\\private\\report.pdf'}]:
        other=copy.deepcopy(body);other['attachments'][0]['access_ref']=ref
        assert submit(client,other).status_code==422
    original=accepted(client,body)
    wait(client,original['receipt_id'])
    assert content_hash(body)==content_hash({**body,'exported_at':'2026-10-22T09:00:00+08:00'})

def test_concurrent_idempotency_and_business_identity_conflicts(client):
    body=data();key=str(uuid4())
    with ThreadPoolExecutor(max_workers=4) as pool:
        responses=list(pool.map(lambda _:submit(client,body,key=key),range(4)))
    assert sorted(r.status_code for r in responses)==[200,200,200,202],[r.text for r in responses]
    ident=responses[0].json()['receipt_id']
    assert len({r.json()['receipt_id'] for r in responses})==1
    equivalent=copy.deepcopy(body);equivalent['exported_at']='2026-11-01T12:00:00+08:00'
    assert accepted(client,equivalent,key=key)['receipt_id']==ident
    assert accepted(client,equivalent,key=str(uuid4()))['receipt_id']==ident
    changed=copy.deepcopy(body);changed['task']['name']+=' business change'
    assert submit(client,changed,key=key).json()['code']=='IDEMPOTENCY_CONFLICT'
    assert submit(client,changed).json()['code']=='PACKAGE_VERSION_CONFLICT'
    changed_task=copy.deepcopy(body);changed_task['task_id']='other-task-'+uuid4().hex[:12]
    for event in changed_task['events']:
        if event['related_object_id']==body['task_id']:event['related_object_id']=changed_task['task_id']
    assert submit(client,changed_task).json()['code']=='PACKAGE_ID_CONFLICT'
    with Session() as db:
        assert db.scalar(select(func.count()).select_from(TaskPackage).where(TaskPackage.task_id==body['task_id']))==1

def test_version_pointer_late_arrival_and_interrupted_retry(client):
    task='versions-'+uuid4().hex[:15]
    v2=accepted(client,data('v2',task));wait(client,v2['receipt_id'])
    v1=accepted(client,data('complete',task));assert not wait(client,v1['receipt_id'])['is_current']
    v3=data('interrupt-once',task);v3['package_version']=3;v3['package_id']=task+'.v3'
    pending=accepted(client,v3);wait(client,pending['receipt_id'],'failed')
    before=detail(client,pending['receipt_id']);assert before['current_package_id']==v2['receipt_id']
    assert before['latest_received_version']==3 and before['current_ready_version']==2
    retry(client,pending['receipt_id']);assert wait(client,pending['receipt_id'])['is_current']
    after=detail(client,pending['receipt_id'])
    assert after['current_ready_version']==3 and len(after['events'])==len(v3['events'])
    with Session() as db:
        assert db.scalar(select(func.count()).select_from(TaskEvent).where(TaskEvent.package_id==pending['receipt_id']))==8
        rows=db.scalars(select(TaskPackageAsset).where(TaskPackageAsset.package_id==pending['receipt_id'])).all()
        assert len(rows)==2 and all(r.verification_state=='verified' for r in rows)
    assert accepted(client,v3)['receipt_id']==pending['receipt_id']
    assert detail(client,pending['receipt_id'])['diff']['changes']
    v4=copy.deepcopy(v3);v4['package_version']=4;v4['package_id']=task+'.v4';v4['events'].reverse();v4.pop('extensions',None)
    changed=accepted(client,v4);wait(client,changed['receipt_id'])
    differences=detail(client,changed['receipt_id'])['diff']['changes']
    assert next(x for x in differences if x['section']=='events')['order_changed'] is True

def test_missing_times_unknown_events_and_partial_attachments(client):
    for scenario,warning in [('no-time','missing_event_time'),('unknown-event','unknown_event_type'),('bad-attachment','attachment_unavailable')]:
        body=data(scenario);rec=accepted(client,body);status=wait(client,rec['receipt_id'])
        assert warning in {w['code'] for w in status['warnings']}
        assert 'partial_timeline' in status['capabilities'] and 'complete_timeline' not in status['capabilities']
        d=detail(client,rec['receipt_id'])
        if scenario=='no-time':assert d['events'][3]['occurred_at'] is None
        if scenario=='unknown-event':assert d['events'][2]['event_type']=='a_custom_observation' and not d['events'][2]['is_known']
        if scenario=='bad-attachment':
            bad=next(a for a in d['attachments'] if a['attachment_id']=='evidence-photo')
            assert bad['asset_id'] is None and bad['state']=='failed'
            assert client.get(INTERNAL+'/'+rec['receipt_id']+'/assets/evidence-photo/content',headers=h('learner')).status_code==410
    summary=accepted(client,data('summary-only'));assert wait(client,summary['receipt_id'])['capabilities']==['historical_summary']
    complete=accepted(client,data());assert 'complete_timeline' in wait(client,complete['receipt_id'])['capabilities']

def test_connector_scope_type_and_verified_transport_refresh(client):
    body=data('interrupt-once');body['attachments'][0]['access_ref']['object_id']='expired-airport-photo'
    rec=accepted(client,body);wait(client,rec['receipt_id'],'failed')
    updated=copy.deepcopy(body);updated['attachments'][0]['access_ref']['object_id']='airport-photo'
    assert content_hash(updated)==content_hash(body)
    assert accepted(client,updated)['receipt_id']==rec['receipt_id']
    retry(client,rec['receipt_id']);assert 'complete_timeline' in wait(client,rec['receipt_id'])['capabilities']
    for mode in ['wrong-project','unknown-connector','wrong-type','wrong-size']:
        body=data()
        if mode=='wrong-project':body['attachments'][0]['access_ref']['object_id']='metro-log'
        elif mode=='unknown-connector':body['attachments'][0]['access_ref']={'connector_id':'https:untrusted','object_id':'example.invalid'}
        elif mode=='wrong-type':body['attachments'][0]['mime_type']='text/html'
        else:body['attachments'][0]['size']=1
        rec=accepted(client,body);wait(client,rec['receipt_id']);d=detail(client,rec['receipt_id'])
        assert next(a for a in d['attachments'] if a['attachment_id']=='evidence-photo')['state']=='failed'

def test_withdrawal_idempotency_attachments_and_pending_downstream(client):
    task='withdraw-'+uuid4().hex[:15];v2=accepted(client,data('v2',task));wait(client,v2['receipt_id'])
    ident=v2['receipt_id'];d=detail(client,ident);asset=next(a for a in d['attachments'] if a['attachment_id']=='evidence-photo')
    url=INTERNAL+'/'+ident+'/assets/evidence-photo/content'
    assert client.get(url,headers=h('learner')).status_code==200
    assert client.get(url,headers=h('outsider')).status_code==403
    with Session.begin() as db:db.get(FileAsset,asset['asset_id']).availability='unavailable'
    try:
        live=client.get(API+'/'+ident,headers=h()).json()
        assert 'complete_timeline' not in live['capabilities'] and live['missing_fields']
        assert client.get(url,headers=h('learner')).status_code==410
    finally:
        with Session.begin() as db:db.get(FileAsset,asset['asset_id']).availability='available'
    key=str(uuid4());body={'reason':'模拟来源撤回，验证立即停止新增使用'}
    assert client.post(INTERNAL+'/'+ident+'/withdraw',headers=h('processor',key),json=body).status_code==403
    first=client.post(API+'/'+ident+'/withdraw',headers=h(key=key),json=body)
    assert first.status_code==200 and not first.json()['replayed']
    assert not validate('withdraw-response.schema.json',first.json())[0]
    assert client.post(API+'/'+ident+'/withdraw',headers=h(key=key),json=body).json()['replayed']
    assert client.post(API+'/'+ident+'/withdraw',headers=h(key=key),json={'reason':'不同原因'}).status_code==409
    assert client.post(API+'/'+ident+'/withdraw',headers=h(key=str(uuid4())),json=body).json()['replayed']
    assert client.get(url,headers=h('learner')).status_code==410
    assert client.get('/api/v1/assets/'+asset['asset_id']+'/content',headers=h('learner')).status_code==410
    assert client.get(INTERNAL+'/'+ident+'/snapshot',headers=h('learner')).status_code==410
    info=detail(client,ident);assert not info['snapshot_available'] and 'task' not in info and 'events' not in info and 'issues' not in info
    assert info['invalidations'][0]['state']=='handled' and info['invalidations'][0]['pending_consumers']==[] and not info['capabilities']
    # Late completion of an older package cannot resurrect a withdrawn current pointer.
    old=accepted(client,data('complete',task));wait(client,old['receipt_id'])
    assert detail(client,old['receipt_id'])['current_package_id'] is None
    assert accepted(client,data('v2',task))['status']=='withdrawn'
    with Session() as db:
        assert db.scalar(select(func.count()).select_from(PackageInvalidation).where(PackageInvalidation.package_id==ident))==1

def test_all_b00_package_examples_and_hash_vector(client):
    report=[]
    for entry in load_json(ROOT/'examples/manifest.json'):
        if entry['schema']!='task-package.schema.json':continue
        original=load_json(ROOT/'examples'/entry['file']);body=copy.deepcopy(original)
        if 'project_id' in body:body['project_id']='demo-airport'
        body['org_id']='demo-org'
        old=body['task_id'];body['task_id']='b00-'+uuid4().hex[:20];body['package_id']='b00-pkg-'+uuid4().hex[:20]
        for event in body['events']:
            if event['related_object_id']==old:event['related_object_id']=body['task_id']
        for item in body['attachments']:
            item.update(attachment('airport-log',item['attachment_id'],'source_document'))
        response=submit(client,body)
        assert response.status_code==(202 if entry['valid'] else 422),(entry['file'],response.text)
        if entry['valid']:wait(client,response.json()['receipt_id'])
        report.append({'file':entry['file'],'expected_valid':entry['valid'],'http_status':response.status_code})
    for vector in load_json(ROOT/'examples/hash-vectors.json')['vectors']:
        assert content_hash(load_json(ROOT/'examples'/vector['file']))==vector['sha256']
    Path('.local/B05-contract-cases.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')

def test_queue_insert_failure_rolls_back_receipt_and_idempotency(client,monkeypatch):
    body=data()
    def fail(*args):raise RuntimeError('injected queue insert failure')
    monkeypatch.setattr(service,'enqueue',fail)
    assert submit(client,body).status_code==503
    with Session() as db:
        assert db.scalar(select(func.count()).select_from(TaskPackage).where(TaskPackage.task_id==body['task_id']))==0
        assert db.scalar(select(func.count()).select_from(TaskStream).where(TaskStream.task_id==body['task_id']))==0

def test_background_revocation_and_queued_withdrawal_do_not_create_facts(client):
    # Final test stops the module's owned worker to control the receive/process boundary.
    worker=client.package_worker;worker.kill();worker.wait(timeout=10)
    body=data();rec=accepted(client,body)
    with Session.begin() as db:
        user=db.scalar(select(UserLink).where(UserLink.subject_id=='a-service'))
        ident,saved=user.id,list(user.authorized_projects);user.authorized_projects=[]
    try:
        assert submit(client,body).status_code==403
        assert client.get(API+'/'+rec['receipt_id'],headers=h()).status_code==403
        with pytest.raises(Exception):process_package.func(run_id=rec['job_id'])
        assert detail(client,rec['receipt_id'])['status']=='failed'
        with Session() as db:assert db.scalar(select(func.count()).select_from(TaskEvent).where(TaskEvent.package_id==rec['receipt_id']))==0
    finally:
        with Session.begin() as db:db.get(UserLink,ident).authorized_projects=saved
    pending=accepted(client,data())
    assert client.post(API+'/'+pending['receipt_id']+'/withdraw',headers=h(key=str(uuid4())),json={'reason':'处理前撤回'}).status_code==200
    process_package.func(run_id=pending['job_id'])
    assert detail(client,pending['receipt_id'])['status']=='withdrawn'
    with Session() as db:assert db.scalar(select(func.count()).select_from(TaskEvent).where(TaskEvent.package_id==pending['receipt_id']))==0
