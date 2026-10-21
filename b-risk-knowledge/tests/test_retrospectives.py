import copy
import os
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from uuid import uuid4
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select, func
from backend.app import app
from backend.db import Session
from backend.models import FileAsset
from backend.modules.task_packages.fixtures import sample
from backend.modules.task_packages.models import TaskPackageAsset, PackageInvalidation
from backend.modules.retrospectives.engine import build_task
from backend.modules.retrospectives.models import RetrospectiveRevision, Retrospective, ExperienceConversion
from backend.modules.knowledge.models import KnowledgeItem, ReviewAction
from backend.modules.ingestion.models import SourceRecordVersion, SourceRecord
from contracts.tools.contract_rules import validate as validate_contract

assert os.environ.get('B_DATABASE_URL', '').endswith('/risk_b_test')
BASE = '/api/v1/retrospectives'


def h(role='admin'):
    return {'Authorization': 'Bearer dev-'+role, 'Idempotency-Key': str(uuid4())}


@pytest.fixture(scope='module')
def client():
    worker = subprocess.Popen([sys.executable, '-m', 'backend.worker'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        with TestClient(app, raise_server_exceptions=False) as c:
            yield c
    finally:
        worker.kill()
        worker.wait(timeout=10)


def wait(c, url, key, expected):
    end = time.monotonic()+25
    while time.monotonic() < end:
        r = c.get(url, headers=h())
        assert r.status_code == 200, r.text
        value = r.json()
        if value[key] == expected:
            return value
        time.sleep(.1)
    pytest.fail(str(value))


def package(c, scenario='complete', task=None):
    r = c.post('/api/v1/task-packages', headers=h(), json=sample(scenario, task_id=task or 'retro-'+uuid4().hex[:20]))
    assert r.status_code == 202, r.text
    ident = r.json()['receipt_id']
    wait(c, '/api/v1/task-packages/'+ident, 'status', 'ready')
    return ident


def create(c, ident):
    r = c.post(BASE, headers=h(), json={'mode': 'task_process', 'task_package_id': ident})
    assert r.status_code == 200, r.text
    return get(c, r.json()['id'])


def get(c, ident, version=None):
    r = c.get(BASE+'/'+ident+('?revision_id='+version if version else ''), headers=h())
    assert r.status_code == 200, r.text
    return r.json()


def payload(d, **kwargs):
    return {'row_version': d['row_version'], 'revision_id': d['revision_id'], 'reason': '测试核对意见', **kwargs}


def edit_confirm(c, d, summary=None):
    f, s = copy.deepcopy(d['findings']), copy.deepcopy(d['suggestions'])
    for row in f+s:
        row['review_state'] = 'confirmed'
    r = c.patch(BASE+'/'+d['id']+'/draft', headers=h(), json=payload(d, summary=summary or d['summary'], findings=f, suggestions=s))
    assert r.status_code == 200, r.text
    return get(c, d['id'])


def approve(c, d):
    d = edit_confirm(c, d)
    r = c.post(BASE+'/'+d['id']+'/submit-review', headers=h(), json=payload(d))
    assert r.status_code == 200, r.text
    d = get(c, d['id'])
    r = c.post('/api/v1/reviews/'+d['revision_id']+'/approve', headers=h(), json=payload(d, evidence_checked=True))
    assert r.status_code == 200, r.text
    return get(c, d['id'])


def test_timeline_stable_unknown_and_no_fabricated_duration():
    data = sample()
    _, timeline, _, _ = build_task(data)
    assert [e['event_id'] for e in timeline['known']] == [f'event-{i}' for i in range(1,9)]
    assert timeline['intervals'][0]['seconds'] == 7200
    assert timeline['deadlines'][0]['result'] == '未晚于期限'
    data['events'][2]['occurred_at'] = data['events'][1]['occurred_at']
    assert [e['event_id'] for e in build_task(data)[1]['known']][1:3] == ['event-2','event-3']
    data['events'][0]['occurred_at'] = None
    timeline = build_task(data)[1]
    assert timeline['unknown_time'][0]['event_id'] == 'event-1' and not timeline['intervals']
    data['events'][-1]['occurred_at'] = '2026-10-19T07:00:00+08:00'
    assert not build_task(data)[1]['intervals']


def test_deadline_requires_rule_due_and_unambiguous_terminal_evidence():
    data = sample()
    data['issues'][0]['due_at'] = None
    assert build_task(data)[1]['deadlines'][0]['result'] == '不判定'
    data = sample();data['scene_code'] = 'unknown_scene'
    assert build_task(data)[1]['deadlines'][0]['result'] == '不判定'
    data = sample();data['events'][6]['occurred_at'] = None
    assert build_task(data)[1]['deadlines'][0]['result'] == '不判定'
    data = sample();data['issues'][0]['due_at'] = '2026-10-19T09:00:00+08:00'
    assert build_task(data)[1]['deadlines'][0]['late_seconds'] == 1800
    data['events'].append({**data['events'][4], 'event_id':'late-reject', 'occurred_at':'2026-10-19T09:40:00+08:00'})
    assert build_task(data)[1]['deadlines'][0]['result'] == '不判定'


def test_missing_records_are_not_missing_actions():
    summary, timeline, findings, _ = build_task(sample('summary-only'))
    assert not timeline['intervals'] and not timeline['known']
    assert '未发现相关过程记录' in summary
    assert all('不据此判断现场是否执行' in f['text'] for f in findings if f['type'] == 'template_comparison')


def test_process_create_dedup_concurrency_and_permissions(client):
    ident = package(client)
    with ThreadPoolExecutor(max_workers=3) as pool:
        replies = list(pool.map(lambda _: client.post(BASE, headers=h(), json={'mode':'task_process','task_package_id':ident}), range(3)))
    assert all(r.status_code == 200 for r in replies), [r.text for r in replies]
    assert len({r.json()['id'] for r in replies}) == 1
    d = get(client, replies[0].json()['id'])
    assert len(d['timeline']['known']) == 8 and d['timeline']['intervals'][0]['seconds'] == 7200
    assert len(d['evidence']) == 11
    status = client.get('/integration/v1/task-packages/'+ident, headers=h('a-service')).json()
    assert status['retrospective_id'] == d['id']
    for role in ['learner','outsider','a-service']:
        assert client.get(BASE+'/'+d['id'], headers=h(role)).status_code == 403
        assert client.post(BASE, headers=h(role), json={'mode':'task_process','task_package_id':ident}).status_code == 403


def test_shared_review_return_edit_and_exact_version_approval(client):
    d = create(client, package(client))
    first = d['revision_id']
    assert client.post(BASE+'/'+d['id']+'/submit-review', headers=h(), json=payload(d)).status_code == 200
    d = get(client, d['id'])
    assert client.post('/api/v1/reviews/'+first+'/approve', headers=h(), json=payload(d, evidence_checked=True)).json()['code'] == 'ITEM_REVIEW_REQUIRED'
    q = client.get('/api/v1/reviews?object_type=retrospective_revision', headers=h()).json()
    assert any(i['review_id'] == first for i in q['items'])
    assert client.post('/api/v1/reviews/'+first+'/request-changes', headers=h(), json=payload(d)).status_code == 200
    d = get(client, d['id']); assert d['state'] == 'changes_requested'
    d = edit_confirm(client, d, summary='人工补充：供新人复盘演练使用。')
    second = d['revision_id']
    again = create(client, d['sources']['task_package_id'])
    assert again['revision_id'] == second and again['summary'].startswith('人工补充')
    assert client.post(BASE+'/'+d['id']+'/submit-review', headers=h(), json=payload(d)).status_code == 200
    d = get(client, d['id'])
    assert client.post('/api/v1/reviews/'+first+'/approve', headers=h(), json=payload(d, evidence_checked=True)).status_code == 409
    assert client.post('/api/v1/reviews/'+second+'/approve', headers=h(), json=payload(d, evidence_checked=True)).status_code == 200
    old = get(client, d['id'], first)
    assert old['state'] == 'changes_requested' and old['summary'] != '人工补充：供新人复盘演练使用。'
    with Session() as db:
        assert db.scalar(select(func.count()).select_from(ReviewAction).where(ReviewAction.object_type=='retrospective_revision', ReviewAction.object_id==d['id'])) == 5


def test_new_package_new_revision_preserves_old_approval(client):
    task='retro-versions-'+uuid4().hex[:10]
    p1=package(client,task=task);d1=approve(client,create(client,p1))
    p2=package(client,'v2',task);d2=create(client,p2)
    assert d1['id']==d2['id'] and d2['version']>d1['version'] and d2['state']=='draft'
    assert get(client,d1['id'],d1['revision_id'])['state']=='approved'
    assert client.post('/api/v1/reviews/'+d1['revision_id']+'/approve',headers=h(),json=payload(d2,evidence_checked=True)).status_code==409
    assert client.post(BASE,headers=h(),json={'mode':'task_process','task_package_id':p1}).json()['code']=='PACKAGE_NOT_CURRENT'


def test_invalid_evidence_stale_edit_and_blocked_conversion(client):
    d=create(client,package(client))
    assert client.post(BASE+'/'+d['id']+'/publish-experiences',headers=h(),json=payload(d)).status_code==409
    f=copy.deepcopy(d['findings']);f[0]['evidence_refs']=[str(uuid4())]
    assert client.patch(BASE+'/'+d['id']+'/draft',headers=h(),json=payload(d,summary=d['summary'],findings=f,suggestions=d['suggestions'])).json()['code']=='INVALID_EVIDENCE_REFERENCE'
    d2=edit_confirm(client,d)
    assert client.patch(BASE+'/'+d['id']+'/draft',headers=h(),json=payload(d,summary=d['summary'],findings=d['findings'],suggestions=d['suggestions'])).status_code==409
    assert d2['version']==2


def test_experience_draft_reuses_knowledge_review_publication_and_live_withdrawal(client):
    ident=package(client);d=approve(client,create(client,ident))
    response=client.post(BASE+'/'+d['id']+'/publish-experiences',headers=h(),json=payload(d))
    assert response.status_code==200,response.text
    kid=response.json()['draft_ids'][0]
    repeat=client.post(BASE+'/'+d['id']+'/publish-experiences',headers=h(),json=payload(d)).json()
    assert repeat['replayed'] and repeat['draft_ids']==[kid]
    k=client.get('/api/v1/knowledge/'+kid,headers=h()).json()
    assert k['state']=='draft' and not k['published'] and k['record_version_id'] is None
    assert k['source']['kind']=='retrospective'
    assert client.get('/api/v1/published/knowledge/'+kid,headers=h('learner')).status_code==404
    assert client.post('/api/v1/knowledge/'+kid+'/submit-review',headers=h(),json=payload(k)).status_code==200
    k=client.get('/api/v1/knowledge/'+kid,headers=h()).json()
    assert client.post('/api/v1/reviews/'+k['revision_id']+'/approve',headers=h(),json=payload(k,evidence_checked=True)).status_code==200
    r=client.post('/api/v1/releases',headers=h(),json={'project_id':'demo-airport','revision_ids':[k['revision_id']]} )
    assert r.status_code==202,r.text
    rid=r.json()['id'];release=wait(client,'/api/v1/releases/'+rid,'state','ready')
    rels=client.get('/api/v1/releases',headers=h()).json()
    assert client.post('/api/v1/releases/'+rid+'/activate',headers=h(),json={'row_version':release['row_version'],'expected_active_id':rels['active_ids']['demo-airport']}).status_code==200
    assert client.get('/api/v1/published/knowledge/'+kid,headers=h('learner')).status_code==200
    search=client.post('/api/v1/search',headers=h('learner'),json={'project_id':'demo-airport','question':'复核通过','scene_code':'lifting_supervision'}).json()
    assert any(r['id']==kid for r in search['results']),search
    contract_keys = {'query_id', 'status', 'knowledge_release_id', 'answer_blocks', 'checkpoints', 'cases', 'citations', 'missing_conditions', 'warnings'}
    errors, _ = validate_contract('knowledge-response.schema.json', {k: v for k, v in search.items() if k in contract_keys})
    assert not errors, errors
    eid=search['citations'][0]['evidence_id']
    proof=client.get('/api/v1/published/evidence/'+eid+'?revision_id='+k['revision_id'],headers=h('learner'))
    assert proof.status_code==200,proof.text
    assert client.post('/api/v1/task-packages/'+ident+'/withdraw',headers=h(),json={'reason':'测试来源撤回'}).status_code==200
    for url in [BASE+'/'+d['id'],'/api/v1/knowledge/'+kid,'/api/v1/published/evidence/'+eid+'?revision_id='+k['revision_id']]:
        assert client.get(url,headers=h()).status_code==410
    assert client.post(BASE+'/'+d['id']+'/publish-experiences',headers=h(),json=payload(d)).status_code==410
    library=client.get('/api/v1/knowledge/library?project_id=demo-airport',headers=h('learner')).json()
    assert not any(i['id']==kid for i in library['items'])
    assert not client.post('/api/v1/search',headers=h('learner'),json={'project_id':'demo-airport','question':'复核通过','scene_code':'lifting_supervision'}).json()['results']
    with Session() as db:
        assert db.scalar(select(func.count()).select_from(ExperienceConversion).where(ExperienceConversion.revision_id==d['revision_id']))==1
        event=db.scalar(select(PackageInvalidation).where(PackageInvalidation.package_id==ident))
        assert 'B06' in event.payload['consumed_by'] and event.payload['pending_consumers']==['B07']


def test_partial_and_summary_packages_degrade_without_fake_process(client):
    for scenario in ['no-time','unknown-event','bad-attachment','summary-only']:
        d=create(client,package(client,scenario))
        if scenario=='no-time':assert len(d['timeline']['unknown_time'])==1
        if scenario=='bad-attachment':assert not any(e['reference']=='attachment:evidence-photo' for e in d['evidence'])
        if scenario=='unknown-event':assert any(e['event_type']=='a_custom_observation' for e in d['timeline']['known'])
        if scenario=='summary-only':assert not d['timeline']['intervals'] and '未发现相关过程记录' in d['summary']


def test_historical_mode_pins_sources_and_source_withdrawal(client):
    with Session() as db:
        rows=db.scalars(select(SourceRecordVersion).join(SourceRecord).where(SourceRecord.project_id=='demo-airport',SourceRecordVersion.version==SourceRecord.current_version)).all()
        ids=[]
        for v in rows:
            if db.get(FileAsset,v.provenance['input_asset_id']).availability=='available':ids.append(v.id)
        assert ids
    r=client.post(BASE,headers=h(),json={'mode':'historical_case','record_version_ids':ids[:2]})
    assert r.status_code==200,r.text
    d=get(client,r.json()['id']);assert d['sources']['record_version_ids']==sorted(ids[:2])
    assert not d['timeline']['known'] and not d['timeline']['intervals'] and not d['timeline']['deadlines']
    assert '未发现完整过程记录' in d['summary']
    d=approve(client,d)
    assert client.post(BASE+'/'+d['id']+'/publish-experiences',headers=h(),json=payload(d)).status_code==200
    with Session.begin() as db:
        v=db.get(SourceRecordVersion,ids[0]);asset=db.get(FileAsset,v.provenance['input_asset_id']);asset.availability='withdrawn';aid=asset.id
    try:
        assert client.get(BASE+'/'+d['id'],headers=h()).status_code==410
        assert client.post(BASE+'/'+d['id']+'/publish-experiences',headers=h(),json=payload(d)).status_code==410
    finally:
        with Session.begin() as db:db.get(FileAsset,aid).availability='available'
