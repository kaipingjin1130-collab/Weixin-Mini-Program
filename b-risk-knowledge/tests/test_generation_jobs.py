import os
import subprocess
import sys
from uuid import uuid4
import pytest
from fastapi.testclient import TestClient
from backend.app import app
from backend.auth import Problem
from backend.modules.extraction import generation_jobs as jobs, llm
from backend.modules.extraction.schemas import ModelSettings
import test_knowledge as b03
import test_retrieval as b04

assert os.environ.get('B_DATABASE_URL','').endswith('/risk_b_test')


@pytest.fixture(scope='module')
def client():
    worker=subprocess.Popen([sys.executable,'-m','backend.worker'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        with TestClient(app) as c:yield c
    finally:worker.kill();worker.wait(timeout=10)


def h(role='admin',key=None):
    return {'Authorization':'Bearer dev-'+role,'Idempotency-Key':key or str(uuid4())}


def test_retrospective_queue_idempotency_and_access(client,monkeypatch):
    monkeypatch.setattr(jobs,'enqueue',lambda db,ident:None)
    _,versions,_=b03.data(client)
    data={'mode':'historical_case','record_version_ids':[versions['MOCK-001']],'generation_mode':'mock'}
    key=str(uuid4())
    first=client.post('/api/v1/retrospective-generation-jobs',headers=h(key=key),json=data)
    assert first.status_code==202,first.text
    ident=first.json()['job_id']
    assert client.post('/api/v1/retrospective-generation-jobs',headers=h(key=key),json=data).json()['job_id']==ident
    assert client.post('/api/v1/retrospective-generation-jobs',headers=h('learner'),json=data).status_code==403
    assert client.get('/api/v1/model-generation-jobs/'+ident,headers=h('outsider')).status_code==403
    assert client.get('/api/v1/model-generation-jobs/'+ident,headers=h()).json()['status']=='queued'
    jobs.generate.func(ident)
    done=client.get('/api/v1/model-generation-jobs/'+ident,headers=h()).json()
    assert done['status']=='succeeded' and done['result']['id']
    entry=client.get('/api/v1/jobs/'+ident,headers=h()).json()
    assert entry['result_links'][0]['path']=='/retrospectives/'+done['result']['id']
    jobs.generate.func(ident)
    assert client.get('/api/v1/model-generation-jobs/'+ident,headers=h()).json()==done


def test_question_queue_published_source_and_result(client,monkeypatch):
    monkeypatch.setattr(jobs,'enqueue',lambda db,ident:None)
    card=b04.approved(client);release,_=b04.release(client,[card]);b04.activate(client,release)
    data={'knowledge_revision_ids':[card['revision_id']],'types':['single_choice'],'generation_mode':'mock'}
    response=client.post('/api/v1/training/generation-jobs',headers=h('teacher'),json=data)
    assert response.status_code==202,response.text
    ident=response.json()['job_id'];jobs.generate.func(ident)
    done=client.get('/api/v1/model-generation-jobs/'+ident,headers=h('teacher')).json()
    assert done['status']=='succeeded' and len(done['result']['items'])==1
    q=client.get('/api/v1/training/questions/'+done['result']['items'][0]['id'],headers=h('teacher')).json()
    assert q['state']=='draft'
    assert client.get('/api/v1/model-generation-jobs/'+ident,headers=h('learner')).status_code==403


def test_queued_configuration_change_fails_before_generation(client,monkeypatch,tmp_path):
    monkeypatch.setattr(jobs,'enqueue',lambda db,ident:None)
    monkeypatch.setattr(llm,'config_path',lambda:tmp_path/'model.json')
    llm.save(ModelSettings(enabled=True,model='original',api_key='test-key'))
    _,versions,_=b03.data(client)
    response=client.post('/api/v1/retrospective-generation-jobs',headers=h(),json={
        'mode':'historical_case','record_version_ids':[versions['MOCK-001']],'generation_mode':'llm'})
    assert response.status_code==202,response.text
    llm.save(ModelSettings(enabled=True,model='changed',api_key='test-key'))
    with pytest.raises(Problem) as exc:jobs.generate.func(response.json()['job_id'])
    assert exc.value.code=='MODEL_CONFIG_CHANGED'
    result=client.get('/api/v1/model-generation-jobs/'+response.json()['job_id'],headers=h()).json()
    assert result['status']=='failed' and not result['result']


def test_governance_review_cannot_be_bypassed_through_retrospective(client):
    from backend.db import Session
    from backend.modules.knowledge.models import QualityIssue
    import test_retrospectives as b06
    _,versions,_=b03.data(client)
    with Session.begin() as db:
        db.add(QualityIssue(record_version_id=versions['MOCK-001'],rule_code='GOVERNANCE_REVIEW_REQUIRED',
            field='source',severity='error',message='治理候选尚未人工核实',status='open'))
    created=client.post('/api/v1/retrospectives',headers=h(),json={'mode':'historical_case','record_version_ids':[versions['MOCK-001']]})
    assert created.status_code==200,created.text
    draft=b06.edit_confirm(client,b06.get(client,created.json()['id']))
    assert client.post('/api/v1/retrospectives/'+draft['id']+'/submit-review',headers=h(),json=b06.payload(draft)).status_code==200
    draft=b06.get(client,draft['id'])
    blocked=client.post('/api/v1/reviews/'+draft['revision_id']+'/approve',headers=h(),json=b06.payload(draft,evidence_checked=True))
    assert blocked.status_code==422 and blocked.json()['code']=='BLOCKING_QUALITY_ISSUE'
