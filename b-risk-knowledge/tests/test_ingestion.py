"""B02 uses actual files, PostgreSQL transactions and Procrastinate workers."""
import os
import subprocess
import sys
import time
from uuid import uuid4
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select, func
from backend.app import app
from backend.db import Session
from backend.modules.ingestion.models import SourceRecord, SourceRecordVersion, ImportRow
from backend.modules.ingestion.fixtures import fixture_id

assert os.environ.get('B_DATABASE_URL', '').endswith('/risk_b_test')


def h(role='admin', key=None):
    headers = {'Authorization': f'Bearer dev-{role}'}
    if key:
        headers['Idempotency-Key'] = key
    return headers


@pytest.fixture(scope='module')
def client():
    worker = subprocess.Popen([sys.executable, '-m', 'backend.worker'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        with TestClient(app, raise_server_exceptions=False) as c:
            yield c
    finally:
        worker.kill()
        worker.wait(timeout=10)


def source(c, kind='csv', project='demo-airport'):
    result = c.post('/api/v1/sources', headers=h(), json={'name': '模拟来源验证', 'namespace': str(uuid4()),
                  'kind': kind, 'project_id': project, 'mapping_template': 'governance-v1' if kind=='governance_export' else f'{kind}-v1'})
    assert result.status_code == 201, result.text
    return result.json()


def submit(c, src, ref='airport-v1', fault=None, key=None):
    body = {'source_id': src['id'], 'input_asset_id': fixture_id(ref)}
    preview = c.post('/api/v1/imports/preview', headers=h(), json=body)
    assert preview.status_code == 200, preview.text
    body.update(input_hash=preview.json()['input_hash'], fail_after=fault)
    response = c.post('/api/v1/imports', headers=h(key=key or str(uuid4())), json=body)
    assert response.status_code in [200, 202], response.text
    return response.json(), body


def wait(c, ident, status='completed', timeout=30):
    until = time.monotonic() + timeout
    while time.monotonic() < until:
        response = c.get('/api/v1/imports/'+ident, headers=h())
        assert response.status_code == 200, response.text
        detail = response.json()
        if detail['status'] == status:
            return detail
        if detail['status']=='failed' and status!='failed':
            pytest.fail(str(detail))
        time.sleep(.15)
    pytest.fail(f'Import not settled: {detail}')


def records(c, src):
    return c.get('/api/v1/records?source_id='+src['id'], headers=h()).json()['items']


def test_preview_validation_and_scope(client):
    src = source(client)
    with Session() as db:
        before = db.scalar(select(func.count()).select_from(SourceRecord))
    p = client.post('/api/v1/imports/preview', headers=h(), json={'source_id':src['id'], 'input_asset_id':fixture_id('airport-v1')})
    assert p.status_code == 200
    data = p.json()
    assert data['total']==6 and len(data['raw_columns'])==39 and data['failed_rows']==0
    assert data['warning_rows']==2
    with Session() as db:
        assert db.scalar(select(func.count()).select_from(SourceRecord))==before
    assert client.post('/api/v1/imports/preview', headers=h('learner'), json={'source_id':src['id'], 'input_asset_id':fixture_id('airport-v1')}).status_code==403
    assert client.post('/api/v1/imports/preview', headers=h(), json={'source_id':src['id'], 'input_asset_id':fixture_id('metro-v1')}).status_code==403
    assert client.post('/api/v1/imports', headers=h(key=str(uuid4())), json={'source_id':src['id'],'input_asset_id':fixture_id('airport-v1'),'input_hash':'0'*64}).status_code==409


def test_csv_repeat_incremental_versions_and_raw_preservation(client):
    src = source(client)
    key = str(uuid4())
    first, body = submit(client,src,key=key)
    batch = wait(client,first['id'])
    assert batch['counts']=={'total':6,'processed':6,'created':6,'updated':0,'skipped':0,'failed':0,'warning_rows':2,'kinds':{'detail':4,'review':1,'summary':1}}
    replay = client.post('/api/v1/imports',headers=h(key=key),json=body)
    assert replay.status_code==200 and replay.json()['id']==first['id']
    assert client.post('/api/v1/imports',headers=h(key=key),json={**body,'fail_after':1}).status_code==409
    repeat,_ = submit(client,src)
    assert wait(client,repeat['id'])['counts']['skipped']==6
    changed,_ = submit(client,src,'airport-v2')
    counts = wait(client,changed['id'])['counts']
    assert counts['updated']==1 and counts['skipped']==5 and counts['created']==0
    result = records(client,src)
    assert len(result)==6
    edited = next(r for r in result if r['external_record_id']=='MOCK-001')
    d = client.get('/api/v1/records/'+edited['id'],headers=h()).json()
    assert d['current_version']==2 and len(d['versions'])==2 and len(d['raw_fields'])==39
    assert d['raw_fields']['custom_unmapped']=='扩展字段也应完整保留'
    old = client.get('/api/v1/records/'+edited['id']+'?version=1',headers=h()).json()
    assert old['raw_fields']['description']=='模拟：疏散通道堆放物品'
    bad = next(r for r in result if r['external_record_id']=='MOCK-005')
    bad_detail = client.get('/api/v1/records/'+bad['id'],headers=h()).json()
    assert bad_detail['raw_fields']['images']=='{not-json}' and bad_detail['effective_fields']['images']==[]
    assert bad_detail['occurred_on'] is None
    assert any(r['external_record_id'].startswith('fallback:') for r in result)
    # Reverting content reuses an old immutable version rather than creating a duplicate hash.
    reverted,_ = submit(client,src)
    assert wait(client,reverted['id'])['counts']['updated']==1
    with Session() as db:
        assert db.scalar(select(func.count()).select_from(SourceRecordVersion).join(SourceRecord).where(SourceRecord.source_id==src['id']))==7


def test_excel_governance_links_and_version_bound_confirmation(client):
    csv = source(client)
    batch,_ = submit(client,csv)
    wait(client,batch['id'])
    excel = source(client,'excel')
    eb,_=submit(client,excel,'airport-excel')
    assert wait(client,eb['id'])['counts']['created']==2
    er = next(r for r in records(client,excel) if r['external_record_id']=='EXCEL-001')
    detail = client.get('/api/v1/records/'+er['id'],headers=h()).json()
    assert detail['provenance']['locator']['sheet']=='模拟隐患清单'
    assert detail['provenance']['locator']['range']=='A2:I2'
    assert any(e['type']=='text_screenshot' and e['relation_confidence']=='candidate' for e in detail['evidence'])
    link = next(l for l in detail['links'] if l['review_state']=='candidate')
    endpoint=f"/api/v1/record-links/{link['id']}/confirm"
    body={'row_version':link['row_version'],'decision':'confirmed'}
    assert client.post(endpoint,headers=h('learner'),json=body).status_code==403
    before_groups=client.get('/api/v1/records',headers=h()).json()['detail_groups_after_confirmed_links']
    assert client.post(endpoint,headers=h(),json=body).status_code==200
    assert client.get('/api/v1/records',headers=h()).json()['detail_groups_after_confirmed_links']==before_groups-1
    assert client.post(endpoint,headers=h(),json=body).status_code==409
    gb_src=source(client,'governance_export')
    gb,_=submit(client,gb_src,'governance')
    assert wait(client,gb['id'])['counts']['created']==1
    gr=records(client,gb_src)[0]
    gd=client.get('/api/v1/records/'+gr['id'],headers=h()).json()
    assert gd['raw_fields']['description']=='模拟：疏散通道堆放物品'
    assert '人工确认' in gd['effective_fields']['description']
    assert gd['provenance']['governance']['revision']==7
    assert gd['provenance']['governance']['field_provenance']['description']['method']=='manual'
    repeat,_=submit(client,gb_src,'governance')
    assert wait(client,repeat['id'])['counts']['skipped']==1
    # Changing the exact CSV compared in the selected candidate invalidates that decision.
    other=client.get('/api/v1/records/'+link['other_record_id'],headers=h()).json()
    changed,_=submit(client,other['source'],'airport-v2')
    wait(client,changed['id'])
    updated=client.get('/api/v1/records/'+er['id'],headers=h()).json()
    decision=next(l for l in updated['links'] if l['id']==link['id'])
    assert decision['review_state']!='confirmed'


def test_partial_failure_resume_and_row_errors(client):
    src=source(client)
    first,_=submit(client,src,fault=2)
    failed=wait(client,first['id'],'failed')
    assert failed['counts']['processed']==2 and failed['counts']['created']==2
    time.sleep(.5)
    retry=client.post('/api/v1/jobs/'+failed['job_id']+'/retry',headers=h(key=str(uuid4())),json={'row_version':failed['row_version']})
    assert retry.status_code==200, retry.text
    done=wait(client,first['id'])
    assert done['counts']['created']==6 and done['counts']['processed']==6
    with Session() as db:
        assert db.scalar(select(func.count()).select_from(ImportRow).where(ImportRow.batch_id==first['id']))==6
    errors,_=submit(client,src,'mixed-errors')
    outcome=wait(client,errors['id'],'completed_with_errors')
    assert outcome['counts']['failed']==2 and outcome['counts']['skipped']==1
    assert len(records(client,src))==6


def test_cross_project_record_evidence_file_and_filters(client):
    airport=source(client)
    b,_=submit(client,airport)
    wait(client,b['id'])
    metro=source(client,project='demo-metro')
    m,_=submit(client,metro,'metro-v1')
    wait(client,m['id'])
    ar=next(r for r in records(client,airport) if r['external_record_id']=='MOCK-001')
    mr=records(client,metro)[0]
    assert ar['description']==mr['description'] and ar['id']!=mr['id']
    d=client.get('/api/v1/records/'+ar['id'],headers=h()).json()
    assert client.get('/api/v1/records/'+ar['id'],headers=h('outsider')).status_code==403
    photo=next(e for e in d['evidence'] if e['type']=='site_photo')
    missing=next(e for e in d['evidence'] if e['type']=='text_screenshot')
    assert photo['availability']=='available' and missing['availability']=='unavailable'
    assert client.get('/api/v1/evidence/'+photo['id'],headers=h('outsider')).status_code==403
    assert client.get('/api/v1/assets/'+photo['asset_id']+'/content',headers=h('outsider')).status_code==403
    assert client.get('/api/v1/assets/'+photo['asset_id']+'/content',headers=h('learner')).status_code==200
    reviewed=client.get('/api/v1/records?record_kind=review&source_id='+airport['id'],headers=h()).json()
    assert len(reviewed['items'])==1
    bad=client.get('/api/v1/records?quality_status=needs_review&source_id='+airport['id'],headers=h()).json()
    assert len(bad['items'])==2
    dated=client.get('/api/v1/records?from_date=2026-10-01&to_date=2026-10-01&source_id='+airport['id'],headers=h()).json()
    assert len(dated['items'])==5


def test_adapter_malformed_excel_and_governed_kind():
    from backend.modules.ingestion.adapters import read_rows, normalize, TEMPLATES
    from backend.auth import Problem
    with pytest.raises(Problem) as error:
        read_rows('excel', b'not an xlsx file')
    assert error.value.status==422
    raw={'record_id':'MOCK','report_id':'MOCK-REPORT','project_id':'demo-airport',
         'description':'模拟原文','record_kind':'invalid-kind','inspection_date':'2026-10-01','images':'[]'}
    result=normalize(raw, {'effective_fields':{'description':'模拟人工生效值','record_kind':'review'}},
                     TEMPLATES['governance-v1'], 'demo-airport')
    assert not result['errors'] and result['effective']['record_kind']=='review'
    assert result['effective']['description']=='模拟人工生效值' and raw['description']=='模拟原文'
