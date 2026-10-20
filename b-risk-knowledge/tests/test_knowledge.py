import copy
import os
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
from backend.models import FileAsset
from backend.modules.ingestion.fixtures import fixture_id
from backend.modules.ingestion.models import SourceRecord, SourceRecordVersion
from backend.modules.knowledge.models import KnowledgeItem, KnowledgeRevision, KnowledgeEvidenceLink

assert os.environ.get('B_DATABASE_URL','').endswith('/risk_b_test')

def h(role='admin',key=None):
    result={'Authorization':f'Bearer dev-{role}'}
    if key: result['Idempotency-Key']=key
    return result

@pytest.fixture(scope='module')
def client():
    worker=subprocess.Popen([sys.executable,'-m','backend.worker'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        with TestClient(app,raise_server_exceptions=False) as c: yield c
    finally:
        worker.kill();worker.wait(timeout=10)

def await_batch(c,ident):
    end=time.monotonic()+20
    while time.monotonic()<end:
        d=c.get('/api/v1/imports/'+ident,headers=h()).json()
        if d['status']=='completed': return d
        time.sleep(.1)
    pytest.fail(str(d))

def data(c,project='demo-airport'):
    source=c.post('/api/v1/sources',headers=h(),json={'name':'B03模拟来源','namespace':str(uuid4()),'project_id':project,'kind':'csv','mapping_template':'csv-v1'}).json()
    body={'source_id':source['id'],'input_asset_id':fixture_id('airport-v1' if project=='demo-airport' else 'metro-v1')}
    preview=c.post('/api/v1/imports/preview',headers=h(),json=body).json()
    batch=c.post('/api/v1/imports',headers=h(key=str(uuid4())),json={**body,'input_hash':preview['input_hash']}).json()
    await_batch(c,batch['id'])
    with Session() as db:
        rows=db.execute(select(SourceRecord,SourceRecordVersion).join(SourceRecordVersion,SourceRecordVersion.record_id==SourceRecord.id).where(SourceRecord.source_id==source['id'])).all()
        versions={r.external_record_id:v.id for r,v in rows}
        records={r.external_record_id:r.id for r,v in rows}
    return source,versions,records

def gen(c,ids,kind='case_card',scenario='normal',key=None):
    body={'record_version_ids':ids,'type':kind,'template_version':'mock-v1','mock_scenario':scenario}
    response=c.post('/api/v1/knowledge/generation-jobs',headers=h(key=key or str(uuid4())),json=body)
    assert response.status_code in (200,202),response.text
    ident=response.json()['job_id'];end=time.monotonic()+20
    while time.monotonic()<end:
        d=c.get('/api/v1/knowledge/generation-jobs/'+ident,headers=h()).json()
        if d['status']=='succeeded': return d,body
        time.sleep(.1)
    pytest.fail(str(d))

def card(c,item):
    r=c.get('/api/v1/knowledge/'+item,headers=h());assert r.status_code==200,r.text
    return r.json()

def version_body(d,reason='已核对模拟来源',checked=False):
    return {'revision_id':d['revision_id'],'row_version':d['row_version'],'reason':reason,'evidence_checked':checked}

def test_reports_grouping_filters_and_scope(client):
    source,versions,records=data(client)
    result=client.get('/api/v1/reports?source_id='+source['id'],headers=h()).json()
    assert len(result['items'])==1 and result['items'][0]['count']==6
    report=result['items'][0]
    assert report['counts']=={'detail':4,'review':1,'summary':1}
    page=client.get('/api/v1/records?document_id='+report['id']+'&limit=2',headers=h()).json()
    assert len(page['items'])==2 and page['next_cursor']
    second=client.get('/api/v1/records?document_id='+report['id']+'&limit=2&cursor='+page['next_cursor'],headers=h()).json()
    assert not ({x['id'] for x in page['items']}&{x['id'] for x in second['items']})
    assert client.get('/api/v1/records?document_id='+report['id'],headers=h('outsider')).status_code==403
    assert client.get('/api/v1/reports?source_id='+source['id'],headers=h('outsider')).status_code==403
    filtered=client.get('/api/v1/reports?source_id='+source['id']+'&record_kind=review',headers=h()).json()
    assert filtered['items'][0]['count']==1

def test_quality_annotations_cas_and_immutable_source(client):
    source,versions,records=data(client)
    result=client.get('/api/v1/quality/issues?limit=100',headers=h()).json()
    issue=next(i for i in result['items'] if i['record_version_id']==versions['MOCK-005'])
    before=client.get('/api/v1/records/'+records['MOCK-005'],headers=h()).json()
    body={'row_version':issue['row_version'],'status':'resolved','reason':'模拟核查：确认日期缺失，按未知保留','annotation':'待项目补充，不编造日期'}
    assert client.patch('/api/v1/quality/issues/'+issue['id'],headers=h('learner'),json=body).status_code==403
    assert client.patch('/api/v1/quality/issues/'+issue['id'],headers=h('processor'),json=body).status_code==200
    assert client.patch('/api/v1/quality/issues/'+issue['id'],headers=h('processor'),json=body).status_code==409
    after=client.get('/api/v1/records/'+records['MOCK-005'],headers=h()).json()
    assert after['raw_fields']==before['raw_fields'] and after['current_version']==before['current_version']
    updated=client.get('/api/v1/quality/issues?limit=100',headers=h()).json()
    assert next(i for i in updated['items'] if i['id']==issue['id'])['annotations'][0]['reason']==body['reason']

def test_generation_prefill_idempotency_and_invalid_references(client):
    source,versions,records=data(client)
    key=str(uuid4());job,body=gen(client,[versions['MOCK-001'],versions['MOCK-002']],key=key)
    assert job['counts']=={'created':2,'skipped':0,'failed':0}
    replay=client.post('/api/v1/knowledge/generation-jobs',headers=h(key=key),json=body)
    assert replay.status_code==200 and replay.json()['job_id']==job['job_id']
    assert client.post('/api/v1/knowledge/generation-jobs',headers=h(key=key),json={**body,'type':'checkpoint_card'}).status_code==409
    detail=card(client,job['items'][0]['item_id'])
    assert detail['content']['project_name']=='模拟机场项目' and detail['content']['occurred_on']=='2026-10-01'
    with Session() as db:
        assert db.scalar(select(func.count()).select_from(KnowledgeEvidenceLink).where(KnowledgeEvidenceLink.revision_id==detail['revision_id']))>=1
    bad,_=gen(client,[versions['MOCK-006']],scenario='bad_evidence')
    assert bad['counts']['failed']==1 and '证据' in bad['items'][0]['error']
    content=copy.deepcopy(detail['content']);content['facts'][0]['evidence_ids']=[str(uuid4())]
    edit={'row_version':detail['row_version'],'revision_id':detail['revision_id'],'content':content,'reason':'模拟错误引用'}
    assert client.patch('/api/v1/knowledge/'+detail['id']+'/draft',headers=h(),json=edit).status_code==422

def test_review_return_concurrent_edit_approval_and_regeneration(client):
    _,versions,_=data(client);job,_=gen(client,[versions['MOCK-001']],kind='checkpoint_card');detail=card(client,job['items'][0]['item_id'])
    assert client.post('/api/v1/knowledge/'+detail['id']+'/submit-review',headers=h('processor'),json=version_body(detail)).status_code==200
    detail=card(client,detail['id'])
    reject=client.post('/api/v1/reviews/'+detail['revision_id']+'/request-changes',headers=h(),json=version_body(detail,'请补充人工核查说明'))
    assert reject.status_code==200
    detail=card(client,detail['id']);assert detail['state']=='changes_requested'
    def edit(suffix):
        content=copy.deepcopy(detail['content']);content['title']+=' · '+suffix
        return client.patch('/api/v1/knowledge/'+detail['id']+'/draft',headers=h('processor' if suffix=='甲' else 'admin'),json={'row_version':detail['row_version'],'revision_id':detail['revision_id'],'content':content,'reason':'按退回意见修订'})
    with ThreadPoolExecutor(max_workers=2) as pool: responses=list(pool.map(edit,['甲','乙']))
    assert sorted(r.status_code for r in responses)==[200,409]
    detail=card(client,detail['id']);assert detail['version']==2
    assert client.post('/api/v1/knowledge/'+detail['id']+'/submit-review',headers=h('processor'),json=version_body(detail)).status_code==200
    detail=card(client,detail['id'])
    assert client.post('/api/v1/reviews/'+detail['revision_id']+'/approve',headers=h('processor'),json=version_body(detail,checked=True)).status_code==403
    assert client.post('/api/v1/reviews/'+detail['revision_id']+'/approve',headers=h(),json=version_body(detail)).status_code==422
    approved=client.post('/api/v1/reviews/'+detail['revision_id']+'/approve',headers=h(),json=version_body(detail,checked=True));assert approved.status_code==200,approved.text
    approved_detail=card(client,detail['id']);assert approved_detail['state']=='approved' and not approved_detail['published']
    assert client.get('/api/v1/knowledge/'+detail['id'],headers=h('learner')).status_code==403
    regenerated,_=gen(client,[versions['MOCK-001']],kind='checkpoint_card')
    assert regenerated['counts']['skipped']==1 and card(client,detail['id'])['state']=='approved'
    content=copy.deepcopy(approved_detail['content']);content['title']+=' 新修改'
    assert client.patch('/api/v1/knowledge/'+detail['id']+'/draft',headers=h(),json={'row_version':approved_detail['row_version'],'revision_id':approved_detail['revision_id'],'content':content,'reason':'批准后新内容须重新审核'}).status_code==200
    fresh=card(client,detail['id']);assert fresh['state']=='draft' and fresh['version']==3
    assert any(r['state']=='approved' for r in fresh['revisions'])
    assert client.post('/api/v1/reviews/'+approved_detail['revision_id']+'/approve',headers=h(),json=version_body(fresh,checked=True)).status_code==409
    assert any(a['reason']=='请补充人工核查说明' for a in fresh['review_actions'])

def test_pending_standard_cannot_become_verified(client):
    _,versions,_=data(client);job,_=gen(client,[versions['MOCK-001']],scenario='unverified_standard');detail=card(client,job['items'][0]['item_id'])
    assert detail['content']['standards'][0]['verification_status']=='pending_verification'
    assert client.post('/api/v1/knowledge/'+detail['id']+'/submit-review',headers=h(),json=version_body(detail)).status_code==200
    detail=card(client,detail['id'])
    response=client.post('/api/v1/reviews/'+detail['revision_id']+'/approve',headers=h(),json=version_body(detail,checked=True))
    assert response.status_code==422 and response.json()['code']=='STANDARD_UNVERIFIED'
    content=copy.deepcopy(detail['content']);content['standards'][0]['verification_status']='verified'
    assert client.patch('/api/v1/knowledge/'+detail['id']+'/draft',headers=h(),json={'row_version':detail['row_version'],'revision_id':detail['revision_id'],'content':content,'reason':'不能伪造核验状态'}).status_code==422
    content['standards'][0]['verification_status']='not_used'
    assert client.patch('/api/v1/knowledge/'+detail['id']+'/draft',headers=h(),json={'row_version':detail['row_version'],'revision_id':detail['revision_id'],'content':content,'reason':'明确不采用待核验依据'}).status_code==200
    detail=card(client,detail['id']);client.post('/api/v1/knowledge/'+detail['id']+'/submit-review',headers=h(),json=version_body(detail));detail=card(client,detail['id'])
    assert client.post('/api/v1/reviews/'+detail['revision_id']+'/approve',headers=h(),json=version_body(detail,checked=True)).status_code==200

def test_generation_scope_and_source_withdrawal(client):
    _,versions,_=data(client);body={'record_version_ids':[versions['MOCK-001']],'type':'case_card'}
    assert client.post('/api/v1/knowledge/generation-preview',headers=h('learner'),json=body).status_code==403
    assert client.post('/api/v1/knowledge/generation-jobs',headers=h('outsider',str(uuid4())),json=body).status_code==403
    job,_=gen(client,[versions['MOCK-001']]);item=job['items'][0]['item_id']
    assert client.get('/api/v1/knowledge/'+item,headers=h('outsider')).status_code==403
    assert client.get('/api/v1/knowledge/'+item,headers=h('learner')).status_code==403
    with Session.begin() as db: db.get(FileAsset,fixture_id('airport-v1')).availability='withdrawn'
    try:
        assert client.get('/api/v1/knowledge/'+item,headers=h()).status_code==410
        assert client.post('/api/v1/knowledge/generation-preview',headers=h(),json=body).status_code==410
        review_list=client.get('/api/v1/reviews?state=draft',headers=h())
        assert review_list.status_code==200 and all(i['id']!=item for i in review_list.json()['items'])
    finally:
        with Session.begin() as db: db.get(FileAsset,fixture_id('airport-v1')).availability='available'
