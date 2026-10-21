import copy
import json
import os
import subprocess
import sys
import time
from pathlib import Path
from uuid import uuid4
from concurrent.futures import ThreadPoolExecutor
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select, text, func
from backend.app import app
from backend.db import Session
from backend.models import FileAsset, RoleBinding, UserLink
from backend.modules.knowledge.models import KnowledgeItem, KnowledgeRevision
from backend.modules.ingestion.models import SourceRecordVersion
from backend.modules.retrieval.models import EmbeddingSet, ChunkEmbedding, SearchRun
from backend.modules.retrieval.api import RESPONSE_VALIDATOR
import test_knowledge as b03

assert os.environ.get('B_DATABASE_URL','').endswith('/risk_b_test')
h=b03.h

@pytest.fixture(scope='module')
def client():
    worker=subprocess.Popen([sys.executable,'-m','backend.worker'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        with TestClient(app,raise_server_exceptions=False) as c: yield c
    finally:
        worker.kill();worker.wait(timeout=10)

def approved(c,ident='MOCK-001',kind='case_card',replace_text=None,include_images=False):
    _,versions,_=b03.data(c)
    job,_=b03.gen(c,[versions[ident]],kind=kind)
    card=b03.card(c,job['items'][0]['item_id'])
    if replace_text or include_images:
        content=copy.deepcopy(card['content'])
        if replace_text:content['facts'][0]['text']=replace_text
        if include_images:content['facts'][0]['evidence_ids'] += [e['id'] for e in card['source']['evidence'] if e['type']=='site_photo' and e['relation_confidence']=='anchored']
        r=c.patch('/api/v1/knowledge/'+card['id']+'/draft',headers=h(),json={
            'row_version':card['row_version'],'revision_id':card['revision_id'],'content':content,'reason':'固定检索样例；模拟人工审定文本'})
        assert r.status_code==200,r.text
        card=b03.card(c,card['id'])
    r=c.post('/api/v1/knowledge/'+card['id']+'/submit-review',headers=h(),json=b03.version_body(card));assert r.status_code==200,r.text
    card=b03.card(c,card['id'])
    r=c.post('/api/v1/reviews/'+card['revision_id']+'/approve',headers=h(),json=b03.version_body(card,checked=True));assert r.status_code==200,r.text
    return b03.card(c,card['id'])

def release(c,cards,model='mock-hash-64',scenario='normal',key=None):
    body={'project_id':'demo-airport','revision_ids':[d['revision_id'] for d in cards],
          'embedding_model':model,'mock_scenario':scenario}
    r=c.post('/api/v1/releases',headers=h(key=key or str(uuid4())),json=body)
    assert r.status_code in (200,202),r.text
    ident=r.json()['id'];end=time.monotonic()+30
    while time.monotonic()<end:
        d=c.get('/api/v1/releases/'+ident,headers=h()).json()
        if d['state'] in {'ready','failed'}:return d,body
        time.sleep(.1)
    pytest.fail(str(d))

def activate(c,release):
    active=c.get('/api/v1/releases?project_id=demo-airport',headers=h()).json()['active_ids']['demo-airport']
    r=c.post('/api/v1/releases/'+release['id']+'/activate',headers=h(),json={
        'row_version':release['row_version'],'expected_active_id':active})
    assert r.status_code==200,r.text
    return r

def search(c,query,role='learner',**extra):
    return c.post('/api/v1/search',headers=h(role),json={'project_id':'demo-airport','question':query,**extra})

def test_release_snapshot_idempotency_permissions_and_approved_only(client):
    card=approved(client);key=str(uuid4())
    pub,body=release(client,[card],key=key);assert pub['state']=='ready',pub
    replay=client.post('/api/v1/releases',headers=h(key=key),json=body)
    assert replay.status_code==200 and replay.json()['id']==pub['id']
    assert client.post('/api/v1/releases',headers=h(key=key),json={**body,'embedding_model':'mock-hash-96'}).status_code==409
    assert client.post('/api/v1/releases',headers=h('processor',str(uuid4())),json=body).status_code==403
    # Until activation even approved knowledge cannot be read by learners.
    assert not any(r['id']==card['id'] for r in client.get('/api/v1/knowledge/library',headers=h('learner')).json()['items'])
    activate(client,pub)
    assert b03.card(client,card['id'])['published'] is True
    library=client.get('/api/v1/knowledge/library',headers=h('learner')).json()['items']
    assert any(r['revision_id']==card['revision_id'] for r in library)
    assert client.get('/api/v1/published/knowledge/'+card['id'],headers=h('learner')).status_code==200
    assert client.get('/api/v1/published/knowledge/'+card['id'],headers=h('outsider')).status_code==403
    content=copy.deepcopy(card['content']);content['title']+=' 草稿新增，不能泄露'
    assert client.patch('/api/v1/knowledge/'+card['id']+'/draft',headers=h(),json={'row_version':card['row_version'],
        'revision_id':card['revision_id'],'content':content,'reason':'发布后准备新版'}).status_code==200
    published=client.get('/api/v1/published/knowledge/'+card['id'],headers=h('learner')).json()
    assert published['content']['title']==card['content']['title']
    fresh=b03.card(client,card['id'])
    assert client.post('/api/v1/releases',headers=h(key=str(uuid4())),json={**body,'revision_ids':[fresh['revision_id']]}).status_code==409
    assert len(published['versions'])==1
    assert client.post('/api/v1/knowledge/'+fresh['id']+'/submit-review',headers=h(),json=b03.version_body(fresh)).status_code==200
    fresh=b03.card(client,fresh['id'])
    assert client.post('/api/v1/reviews/'+fresh['revision_id']+'/approve',headers=h(),json=b03.version_body(fresh,checked=True)).status_code==200
    fresh=b03.card(client,fresh['id']);second,_=release(client,[fresh]);activate(client,second)
    current=client.get('/api/v1/published/knowledge/'+card['id'],headers=h('learner')).json()
    historical=client.get('/api/v1/published/knowledge/'+card['id']+'?revision_id='+card['revision_id'],headers=h('learner')).json()
    assert current['version']==fresh['version'] and historical['version']==card['version']
    assert historical['is_current_release'] is False and len(historical['versions'])==2

def test_hybrid_retrieval_contract_citations_filters_and_fallback(client):
    case=approved(client,replace_text='模拟审核记录：依据 GB 55037-2022 核查疏散通道，材料堆放造成出口堵塞。此编号仅用于检索样例，不代表标准已独立核验。')
    checkpoint=approved(client,ident='MOCK-006',kind='checkpoint_card')
    pub,_=release(client,[case,checkpoint]);activate(client,pub)
    response=search(client,'GB 55037-2022').json()
    assert response['status']=='answered' and response['results'][0]['revision_id']==case['revision_id'],response
    assert response['results'][0]['match']=='exact_standard'
    assert all(block['citation_ids'] for block in response['answer_blocks'])
    for citation in response['citations']:
        opened=client.get('/api/v1/published/evidence/'+citation['evidence_id']+'?revision_id='+citation['knowledge_revision_id'],headers=h('learner'))
        assert opened.status_code==200,opened.text
        assert opened.json()['source_version']>=1
        assert client.get('/api/v1/published/evidence/'+citation['evidence_id']+'?revision_id='+citation['knowledge_revision_id'],headers=h('outsider')).status_code==403
    badid=str(uuid4())
    assert client.get('/api/v1/published/evidence/'+badid+'?revision_id='+case['revision_id'],headers=h('learner')).status_code==404
    assert search(client,'材料堆积在疏散出口，人员无法通过').json()['results'][0]['revision_id']==case['revision_id']
    assert search(client,'GB 999999-2099').json()['status']=='insufficient_evidence'
    assert search(client,'疏散',scene_code='lifting_supervision').json()['results']==[]
    assert search(client,'疏散',object_type='unregistered').json()['results']==[]
    degraded=search(client,'疏散',answer_mode='simulate_timeout').json()
    assert degraded['status']=='degraded' and not degraded['answer_blocks'] and degraded['results']
    query={'request_id':'b04-contract-test','project_id':'demo-airport','scene_code':'general_inspection','question':'GB 55037-2022',
        'context':{'object_type':'construction_risk','stage':'training','conditions':{}},'output_types':['answer','cases','checkpoints'],'limit':5}
    integration=client.post('/integration/v1/knowledge/query',headers=h('learner'),json=query)
    assert integration.status_code==200,integration.text
    RESPONSE_VALIDATOR.validate(integration.json())
    assert integration.json()['cases'][0]['knowledge_revision_id']==case['revision_id']
    assert client.post('/integration/v1/knowledge/query',headers=h('learner'),json={**query,'limit':21}).status_code==422
    assert client.post('/integration/v1/knowledge/query',headers=h('learner'),json={**query,'scene_code':'generic'}).status_code==422
    assert client.post('/integration/v1/knowledge/query',headers=h('outsider'),json=query).status_code==403
    assert search(client,'疏散','outsider').status_code==403
    with Session() as db:
        log=db.get(SearchRun,response['query_id'])
        assert len(log.query)==64 and 'GB ' not in log.query and 'question' not in log.parameters
    assert client.post('/api/v1/search/'+response['query_id']+'/feedback',headers=h('learner'),json={'rating':'useful'}).status_code==200
    assert client.post('/api/v1/search/'+response['query_id']+'/feedback',headers=h(),json={'rating':'useful'}).status_code==403
    with Session.begin() as db:
        db.get(KnowledgeItem,case['id']).scope={'project_id':'demo-airport','stages':['execution'],'conditions':{'near_metro':True}}
    assert not search(client,'GB 55037-2022').json()['results']
    assert not search(client,'GB 55037-2022',stage='execution',conditions={'near_metro':False}).json()['results']
    assert search(client,'GB 55037-2022',stage='execution',conditions={'near_metro':True}).json()['results']

def test_failed_index_does_not_replace_active_and_switch_dimensions(client):
    card=approved(client)
    first,_=release(client,[card]);activate(client,first)
    failed,_=release(client,[card],scenario='index_failure')
    assert failed['state']=='failed' and failed['entries'][0]['state']=='failed'
    r=client.post('/api/v1/releases/'+failed['id']+'/activate',headers=h(),json={'row_version':failed['row_version'],'expected_active_id':first['id']})
    assert r.status_code==409
    assert search(client,'疏散').json()['knowledge_release_id']==first['id']
    second,_=release(client,[card],model='mock-hash-96');assert second['state']=='ready',second
    activate(client,second)
    assert search(client,'疏散').json()['knowledge_release_id']==second['id']
    with Session() as db:
        one=db.scalar(select(EmbeddingSet).where(EmbeddingSet.release_id==first['id']))
        two=db.scalar(select(EmbeddingSet).where(EmbeddingSet.release_id==second['id']))
        assert (one.dimension,two.dimension)==(64,96) and one.id!=two.id
        dims=db.execute(text('SELECT embedding_set_id,vector_dims(vector) FROM chunk_embeddings WHERE embedding_set_id IN (:a,:b)'),{'a':one.id,'b':two.id}).all()
        assert set(dims)=={(one.id,64),(two.id,96)}
        index_count=db.scalar(text("SELECT count(*) FROM pg_indexes WHERE indexname IN (:a,:b)"),{'a':'emb_'+one.id.replace('-','')+'_hnsw','b':'emb_'+two.id.replace('-','')+'_hnsw'})
        assert index_count==2

def test_competing_activation_uses_project_compare_and_swap(client):
    card=approved(client);first,_=release(client,[card]);activate(client,first)
    second,_=release(client,[card]);third,_=release(client,[card],model='mock-hash-96')
    def go(pub):return client.post('/api/v1/releases/'+pub['id']+'/activate',headers=h(),json={
        'row_version':pub['row_version'],'expected_active_id':first['id']})
    with ThreadPoolExecutor(max_workers=2) as pool:results=list(pool.map(go,[second,third]))
    assert sorted(r.status_code for r in results)==[200,409]

def test_withdrawal_and_revocation_block_old_index_evidence(client):
    card=approved(client,include_images=True);pub,_=release(client,[card]);activate(client,pub)
    result=search(client,'疏散').json();citation=result['citations'][0]
    evidence='/api/v1/published/evidence/'+citation['evidence_id']+'?revision_id='+citation['knowledge_revision_id']
    image=next(e for e in card['source']['evidence'] if e['type']=='site_photo')
    image_url='/api/v1/published/evidence/'+image['id']+'/content?revision_id='+card['revision_id']
    opened=client.get(image_url,headers=h('learner'))
    assert opened.status_code==200 and 'image/svg' in opened.headers['content-type']
    assert client.get(image_url,headers=h('outsider')).status_code==403
    with Session.begin() as db:
        user=db.scalar(select(UserLink).where(UserLink.subject_id=='learner'))
        saved=list(user.authorized_projects);user.authorized_projects=[]
    try:
        assert search(client,'疏散').status_code==403
        assert client.get(evidence,headers=h('learner')).status_code==403
    finally:
        with Session.begin() as db:db.get(UserLink,user.id).authorized_projects=saved
    with Session.begin() as db:
        item=db.get(KnowledgeItem,card['id']);source=db.get(SourceRecordVersion,item.record_version_id)
        asset=db.get(FileAsset,source.provenance['input_asset_id']);asset.availability='withdrawn';asset_id=asset.id
    try:
        assert search(client,'疏散').json()['results']==[]
        assert client.get(evidence,headers=h('learner')).status_code==410
        assert client.get('/api/v1/evidence/'+citation['evidence_id'],headers=h('learner')).status_code==410
        assert client.get(image_url,headers=h('learner')).status_code==410
        assert client.get('/api/v1/published/knowledge/'+card['id'],headers=h('learner')).status_code==404
    finally:
        with Session.begin() as db:db.get(FileAsset,asset_id).availability='available'
    current=b03.card(client,card['id'])
    body={'row_version':current['row_version'],'reason':'模拟知识撤回验证'}
    assert client.post('/api/v1/knowledge/'+card['id']+'/withdraw',headers=h('processor'),json=body).status_code==403
    assert client.post('/api/v1/knowledge/'+card['id']+'/withdraw',headers=h(),json=body).status_code==200
    assert not search(client,'疏散').json()['results']
    assert client.get(evidence,headers=h('learner')).status_code==410
    assert client.get('/api/v1/published/knowledge/'+card['id'],headers=h('learner')).status_code==410

def test_fixed_retrieval_evaluation(client):
    case=approved(client,replace_text='模拟审核事实：疏散通道有材料堆放，堵塞人员通行出口；检查记录编号 GB 55037-2022（仅作模拟检索编号）。')
    equipment=approved(client,ident='MOCK-006',kind='checkpoint_card',replace_text='模拟审核事实：机房配电柜存在漏电风险，接地连接缺失，应关注电气绝缘状态。')
    pub,_=release(client,[case,equipment]);activate(client,pub)
    samples=json.loads((Path(__file__).parent/'fixtures/b04-evaluation.json').read_text(encoding='utf-8'))
    lookup={'evacuation':case['revision_id'],'electrical':equipment['revision_id']}
    scores=[]
    for sample in samples:
        response=search(client,sample['question'],scene_code=sample.get('scene','generic')).json()
        refs=[r['revision_id'] for r in response['results']]
        success=(not refs) if sample['expected'] is None else lookup[sample['expected']] in refs[:3]
        scores.append({'id':sample['id'],'kind':sample['kind'],'hit_at_3':success,'latency_ms':response['latency_ms'],'status':response['status']})
    output={'scope':'synthetic fixtures; hash vectors only; no real semantic/LLM accuracy claim','release_id':pub['id'],'samples':scores,
            'hits':sum(s['hit_at_3'] for s in scores),'total':len(scores)}
    path=Path('.local/b04-evaluation.json');path.write_text(json.dumps(output,ensure_ascii=False,indent=2),encoding='utf-8')
    assert all(s['hit_at_3'] for s in scores),output
