import copy,json,os,subprocess,sys
from uuid import uuid4
import httpx,pytest
from fastapi.testclient import TestClient
from sqlalchemy import select,func
from backend.app import app
from backend.db import Session
from backend.models import FileAsset,ProcessingRun
from backend.auth import Problem
from backend.modules.extraction import llm,service
from backend.modules.extraction.tasks import extract
from backend.modules.extraction.models import ExtractionRun,KnowledgeSource
from backend.modules.knowledge.models import KnowledgeItem,KnowledgeRevision
from backend.modules.ingestion.models import SourceRecordVersion
from backend.modules.ingestion.fixtures import fixture_id
import test_knowledge as b03
import test_retrieval as b04

assert os.environ.get('B_DATABASE_URL','').endswith('/risk_b_test')
def h(role='admin',key=None):return {'Authorization':'Bearer dev-'+role,'Idempotency-Key':key or str(uuid4())}

@pytest.fixture(scope='module')
def client():
    worker=subprocess.Popen([sys.executable,'-m','backend.worker'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        with TestClient(app,raise_server_exceptions=False) as c:yield c
    finally:worker.kill();worker.wait(timeout=10)

@pytest.fixture
def config(monkeypatch,tmp_path):
    monkeypatch.setattr(llm,'config_path',lambda:tmp_path/'model.json')
    monkeypatch.setattr(service,'enqueue',lambda db,run_id:None)

def setup(c,ids=None,mode='llm'):
    if ids is None:_,versions,_=b03.data(c);ids=[versions['MOCK-001'],versions['MOCK-006']]
    tx=c.get('/api/v1/knowledge/taxonomies?project_id=demo-airport',headers=h()).json()
    r=c.post('/api/v1/knowledge/taxonomies',headers=h(),json={'project_id':'demo-airport','expected_version':tx['items'][0]['version'] if tx['items'] else 0,
        'categories':[{'code':'construction','name':'施工准备与现场检查','focus':'合并隐患，归纳现场核查方法与复核要点','keywords':[]}]})
    assert r.status_code==200,r.text
    return {'record_version_ids':ids,'taxonomy_id':r.json()['id'],'mode':mode}

def enable(c):
    r=c.put('/api/v1/models/settings',headers=h(),json={'enabled':True,'base_url':'https://model.example/v1','model':'unit-model','api_key':'unit-test-key'})
    assert r.status_code==200,r.text
    return r.json()

def provider_reply(request,corrupt=None):
    wire=json.loads(request.content);payload=json.loads(wire['messages'][1]['content']);rows=payload['sources']
    facts=[]
    for r in rows:
        fields=json.loads(r['text']);desc=fields['description']
        facts.append({'text':desc,'evidence_ids':[r['evidence_id']],'source_quotes':[{'evidence_id':r['evidence_id'],'text':desc}]})
    point={'title':'归纳施工核查关注点','stage':'execution','content':'；'.join(f['text'] for f in facts),
        'inspection_method':'核对来源记录中的对应检查事项。','common_mistakes':'其他做法需补充证据。','claim_kind':'source_summary',
        'evidence_ids':[r['evidence_id'] for r in rows],'source_quotes':[q for f in facts for q in f['source_quotes']]}
    card={'title':'施工准备与现场检查要点','type':'checkpoint_card','facts':facts,'project_name':'模拟机场','generation_mode':'llm',
        'category_code':payload['categories'][0]['code'],'construction_points':[point],'suggestions':['需现场核查适用条件。']}
    if corrupt=='quote':card['facts'][0]['source_quotes'][0]['text']='根本不存在的伪造原文'
    if corrupt=='evidence':card['facts'][0]['evidence_ids']=[str(uuid4())]
    if corrupt=='category':card['category_code']='unknown_category'
    return httpx.Response(200,json={'choices':[{'finish_reason':'stop','message':{'content':json.dumps({'cards':[card],'missing_information':[]},ensure_ascii=False)}}],'usage':{'prompt_tokens':100,'completion_tokens':80,'total_tokens':180}})

def run(c,body):
    r=c.post('/api/v1/knowledge/extraction-jobs',headers=h(),json=body);assert r.status_code==202,r.text
    extract.func(r.json()['job_id'])
    d=c.get('/api/v1/knowledge/extraction-jobs/'+r.json()['job_id'],headers=h());assert d.status_code==200,d.text
    return d.json()

def test_model_config_no_secret_echo_and_permission(config,client):
    value=enable(client);assert value['api_key_configured'] and 'api_key' not in value and 'unit-test-key' not in str(value)
    assert 'api_key' not in client.get('/api/v1/models/settings',headers=h()).json()
    assert client.get('/api/v1/models/settings',headers=h('processor')).status_code==403
    r=client.put('/api/v1/models/settings',headers=h(),json={'enabled':True,'base_url':'https://other.example/v1','model':'unit-model'})
    assert r.status_code==422
    for url in ['http://model.example/v1','https://127.0.0.1/v1','https://user:password@model.example/v1','https://model.example/v1?key=value']:
        assert client.put('/api/v1/models/settings',headers=h(),json={'base_url':url}).status_code==422

def test_unconfigured_model_does_not_silently_use_mock(config,client):
    body=setup(client)
    r=client.post('/api/v1/knowledge/extraction-jobs',headers=h(),json=body)
    assert r.status_code==409 and r.json()['code']=='MODEL_NOT_CONFIGURED'
    assert client.post('/api/v1/knowledge/extraction-jobs',headers=h('learner'),json=body).status_code==403

def test_cloud_request_grounded_multi_source_card_and_rerun_preserves_edits(config,client,monkeypatch):
    enable(client);sent=[]
    def handler(request):sent.append(request);return provider_reply(request)
    monkeypatch.setattr(llm,'TRANSPORT',httpx.MockTransport(handler));body=setup(client)
    d=run(client,body);assert d['status']=='succeeded' and len(sent)==1
    assert sent[0].url.path=='/v1/chat/completions' and sent[0].headers['authorization']=='Bearer unit-test-key'
    assert d['result']['generation_mode']=='llm' and 'unit-test-key' not in str(d)
    item=d['result']['items'][0]['item_id'];card=b03.card(client,item)
    assert card['schema_version']=='knowledge-card-v2'
    assert 'construction_points' in client.get('/api/v1/knowledge/schema',headers=h()).json()['properties']
    assert client.get('/api/v1/knowledge/schema?version=knowledge-card-v1',headers=h()).status_code==200
    assert card['content']['category_name']=='施工准备与现场检查' and len(card['content']['construction_points'])==1
    assert len(card['content']['facts'])==2 and card['state']=='draft' and card['content']['generation_mode']=='llm'
    with Session() as db:assert db.scalar(select(func.count()).select_from(KnowledgeSource).where(KnowledgeSource.item_id==item))==2
    content=copy.deepcopy(card['content']);content['title']='人工修订后的要点名称'
    edited=client.patch('/api/v1/knowledge/'+item+'/draft',headers=h(),json={'row_version':card['row_version'],'revision_id':card['revision_id'],'reason':'保留人工修订','content':content})
    assert edited.status_code==200,edited.text
    again=run(client,body)
    assert again['result']['items'][0]=={'item_id':item,'outcome':'reused'}
    assert b03.card(client,item)['content']['title']=='人工修订后的要点名称'

@pytest.mark.parametrize('corrupt',['quote','evidence','category'])
def test_invalid_model_evidence_or_category_rejected_atomically(config,client,monkeypatch,corrupt):
    enable(client);body=setup(client)
    monkeypatch.setattr(llm,'TRANSPORT',httpx.MockTransport(lambda request:provider_reply(request,corrupt)))
    before=client.get('/api/v1/knowledge?limit=100',headers=h()).json()['items']
    r=client.post('/api/v1/knowledge/extraction-jobs',headers=h(),json=body);ident=r.json()['job_id']
    with pytest.raises(Problem):extract.func(ident)
    d=client.get('/api/v1/knowledge/extraction-jobs/'+ident,headers=h()).json()
    assert d['status']=='failed' and not d['result']
    after=client.get('/api/v1/knowledge?limit=100',headers=h()).json()['items'];assert len(after)==len(before)

def test_cloud_timeout_and_config_change_fail_without_fake_success(config,client,monkeypatch):
    enable(client);body=setup(client)
    def timeout(request):raise httpx.ReadTimeout('private provider detail must not be exposed',request=request)
    monkeypatch.setattr(llm,'TRANSPORT',httpx.MockTransport(timeout))
    r=client.post('/api/v1/knowledge/extraction-jobs',headers=h(),json=body);ident=r.json()['job_id']
    with pytest.raises(Problem):extract.func(ident)
    d=client.get('/api/v1/knowledge/extraction-jobs/'+ident,headers=h()).json()
    assert d['status']=='failed' and 'private provider detail' not in str(d)
    r=client.post('/api/v1/knowledge/extraction-jobs',headers=h(),json=body);ident=r.json()['job_id']
    client.put('/api/v1/models/settings',headers=h(),json={'enabled':True,'base_url':'https://model.example/v1','model':'changed-model'})
    with pytest.raises(Problem) as exc:extract.func(ident)
    assert exc.value.code=='MODEL_CONFIG_CHANGED'

def test_multi_source_withdrawal_and_publication_citations(config,client,monkeypatch):
    enable(client)
    _,v1,_=b03.data(client);source,v2,_=b03.data(client)
    preview=client.post('/api/v1/imports/preview',headers=h(),json={'source_id':source['id'],'input_asset_id':fixture_id('airport-v2')}).json()
    batch=client.post('/api/v1/imports',headers=h(),json={'source_id':source['id'],'input_asset_id':fixture_id('airport-v2'),'input_hash':preview['input_hash']}).json();b03.await_batch(client,batch['id'])
    with Session() as db:
        old=db.get(SourceRecordVersion,v2['MOCK-001']);new=db.scalar(select(SourceRecordVersion).where(SourceRecordVersion.record_id==old.record_id,SourceRecordVersion.version==2));second=new.id
    body=setup(client,[v1['MOCK-001'],second]);monkeypatch.setattr(llm,'TRANSPORT',httpx.MockTransport(provider_reply))
    d=run(client,body);card=b03.card(client,d['result']['items'][0]['item_id'])
    assert client.post('/api/v1/knowledge/'+card['id']+'/submit-review',headers=h(),json=b03.version_body(card)).status_code==200
    card=b03.card(client,card['id'])
    assert client.post('/api/v1/reviews/'+card['revision_id']+'/approve',headers=h(),json=b03.version_body(card,checked=True)).status_code==200
    card=b03.card(client,card['id']);release,_=b04.release(client,[card]);b04.activate(client,release)
    search=b04.search(client,'施工 核查 疏散').json();assert search['results'],search
    for fact in card['content']['facts']:
        evidence=client.get('/api/v1/published/evidence/'+fact['evidence_ids'][0]+'?revision_id='+card['revision_id'],headers=h('learner'))
        assert evidence.status_code==200,evidence.text
    with Session.begin() as db:
        item=db.get(KnowledgeItem,card['id']);extra=next(i for i in body['record_version_ids'] if i!=item.record_version_id)
        asset=db.get(FileAsset,db.get(SourceRecordVersion,extra).provenance['input_asset_id']);asset.availability='withdrawn';asset_id=asset.id
    try:
        assert client.get('/api/v1/knowledge/'+card['id'],headers=h()).status_code==410
        library=client.get('/api/v1/knowledge/library?project_id=demo-airport',headers=h('learner')).json()
        assert not any(i['id']==card['id'] for i in library['items'])
        assert not b04.search(client,'施工 核查 疏散').json()['results']
    finally:
        with Session.begin() as db:db.get(FileAsset,asset_id).availability='available'

def test_taxonomy_cas_and_explicit_mock_worker_pipeline(client):
    body=setup(client,mode='mock')
    r=client.post('/api/v1/knowledge/extraction-jobs',headers=h(),json=body);assert r.status_code==202,r.text
    import time
    end=time.monotonic()+20
    while time.monotonic()<end:
        d=client.get('/api/v1/knowledge/extraction-jobs/'+r.json()['job_id'],headers=h()).json()
        if d['status'] in {'succeeded','failed'}:break
        time.sleep(.1)
    assert d['status']=='succeeded' and d['result']['generation_mode']=='mock',d
    tx=client.get('/api/v1/knowledge/taxonomies?project_id=demo-airport',headers=h()).json()['items'][0]
    assert client.post('/api/v1/knowledge/taxonomies',headers=h(),json={'project_id':'demo-airport','expected_version':tx['version']-1,'categories':tx['categories']}).status_code==409
