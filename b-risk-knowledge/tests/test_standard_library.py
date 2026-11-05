"""K01a: real PostgreSQL transactions and files; no real standards or model calls."""
from concurrent.futures import ThreadPoolExecutor
from copy import deepcopy
from datetime import date
import os
from uuid import uuid4
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select, func
from backend.app import app
from backend.auth import Actor, current_actor
from backend.db import Session
from backend.models import FileAsset, AuditEvent
from backend.modules.standards.models import StandardRevision, StandardClause
from backend.modules.standards import service
from backend.storage import asset_path

assert os.environ.get('B_DATABASE_URL', '').rsplit('/', 1)[-1].startswith('risk_b_k01_'), 'Use isolated K01 runner'


def headers(role='admin', key=None):
    return {'Authorization': 'Bearer dev-' + role, **({'Idempotency-Key': key} if key else {})}


@pytest.fixture()
def client():
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


def source(client, project='demo-airport', text=None):
    # Every test uses synthetic text, never a claimed real standard.
    raw = (text or '测试材料（非正式规范）\n1 总则\n1.1 核查测试对象。\n' + uuid4().hex).encode('utf-8')
    r = client.post('/api/v1/standards/source-files', params={'project_id': project, 'name': '测试原件.txt'},
        headers=headers(), content=raw)
    assert r.status_code == 201, r.text
    return r.json()['asset_id'], raw


def payload(client, **changes):
    ident, _ = source(client)
    data = {'project_id': 'demo-airport', 'code': 'TEST-' + uuid4().hex, 'edition': '2026',
        'expected_version': 0, 'title': '测试规范（不得用于现场）', 'source_asset_id': ident,
        'valid_from': '2026-01-01', 'valid_until': '2027-01-01',
        'scope': {'regions': ['测试地域'], 'object_types': ['测试对象']}, 'maintainer': '测试维护人',
        'reason': '测试录入', 'clauses': [
            {'number': '1', 'text': '总则', 'chapter': '第一章', 'page': 1},
            {'number': '1.1', 'parent_number': '1', 'text': '核查测试对象。', 'chapter': '第一章', 'page': 1,
             'preconditions': ['仅限测试'], 'exceptions': ['非现场使用'], 'tables': ['测试表格'],
             'notes': ['测试注释'], 'references': ['1']}]}
    return {**data, **changes}


def create(client, data, key=None, role='admin'):
    return client.post('/api/v1/standards', headers=headers(role, key or uuid4().hex), json=data)


def action(client, row, act, role='admin', checked=False):
    return client.post('/api/v1/standards/' + row['id'] + '/actions', headers=headers(role), json={
        'row_version': row['row_version'], 'action': act, 'reason': '测试核验说明', 'evidence_checked': checked})


def published(client, data):
    r = create(client, data)
    assert r.status_code == 201, r.text
    row = r.json()
    for step in ('submit', 'approve', 'publish'):
        r = action(client, row, step, checked=True)
        assert r.status_code == 200, r.text
        row = r.json()
    return row


def test_review_publish_original_and_no_permission_escalation(client, monkeypatch):
    monkeypatch.setattr(service, 'today', lambda: date(2026, 10, 30))
    data = payload(client)
    assert create(client, data, role='learner').status_code == 403
    row = create(client, data, role='processor').json()
    asset_url = '/api/v1/assets/' + data['source_asset_id'] + '/content'
    assert client.get(asset_url, headers=headers('learner')).status_code == 403
    assert client.get('/api/v1/standards/' + row['id'], headers=headers('learner')).status_code == 403
    assert action(client, row, 'publish').status_code == 409
    row = action(client, row, 'submit', role='processor').json()
    assert action(client, row, 'approve', role='processor', checked=True).status_code == 403
    assert action(client, row, 'approve').status_code == 422
    approved = action(client, row, 'approve', checked=True).json()
    assert action(client, row, 'approve', checked=True).status_code == 409
    row = action(client, approved, 'publish').json()
    response = client.get('/api/v1/standards/' + row['id'], headers=headers('learner'))
    assert response.status_code == 200, response.text
    assert response.json()['clauses'][1]['tables'] == ['测试表格']
    assert response.json()['clauses'][1]['parent_number'] == '1'
    assert response.json()['verified_on'] == '2026-10-30'
    assert client.get('/api/v1/standards/' + row['id'], headers=headers('outsider')).status_code == 403
    original = client.get('/api/v1/standards/' + row['id'] + '/source', headers=headers('learner'))
    assert original.status_code == 200 and '非正式规范' in original.content.decode('utf-8')
    assert client.get(asset_url, headers=headers('learner')).status_code == 200
    assert action(client, row, 'withdraw', role='processor').status_code == 403
    assert action(client, row, 'withdraw').status_code == 200
    assert client.get(asset_url, headers=headers('learner')).status_code == 403
    assert client.get('/api/v1/standards/' + row['id'], headers=headers('learner')).status_code == 403
    assert client.post('/api/v1/standards/' + row['id'] + '/applicability', headers=headers(),
        json={'purpose': 'current_rectification'}).json()['status'] == 'unavailable'


def test_idempotency_concurrency_and_immutable_revision(client):
    data, key = payload(client), uuid4().hex
    with ThreadPoolExecutor(max_workers=2) as executor:
        responses = list(executor.map(lambda _: create(client, data, key), range(2)))
    assert sorted(r.status_code for r in responses) == [200, 201]
    first = responses[0].json()
    assert {r.json()['id'] for r in responses} == {first['id']}
    assert create(client, {**data, 'title': '改变内容'}, key).status_code == 409
    assert create(client, data).status_code == 409
    second_data = {**data, 'expected_version': 1, 'title': '修订版'}
    second = create(client, second_data).json()
    assert second['version'] == 2
    assert action(client, first, 'submit').json()['code'] == 'REVISION_SUPERSEDED'
    with Session() as db:
        assert db.get(StandardRevision, first['id']).title == data['title']
        assert db.scalar(select(func.count()).select_from(StandardClause).where(
            StandardClause.standard_revision_id == first['id'])) == 2
        assert db.scalar(select(func.count()).select_from(AuditEvent).where(
            AuditEvent.object_id == first['id'], AuditEvent.action == 'standard_created')) == 1


def test_dates_scope_and_current_cannot_be_backdated(client, monkeypatch):
    monkeypatch.setattr(service, 'today', lambda: date(2026, 10, 30))
    data = payload(client, valid_until='2026-07-01')
    row = published(client, data)
    url = '/api/v1/standards/' + row['id'] + '/applicability'
    def check(**kwargs):
        r = client.post(url, headers=headers('learner'), json=kwargs)
        assert r.status_code == 200, r.text
        return r.json()
    assert check(purpose='historical_review')['missing'] == ['event_date', 'region', 'object_type']
    assert check(purpose='historical_review', event_date='2026-06-30', region='测试地域', object_type='测试对象')['status'] == 'candidate'
    assert check(purpose='historical_review', event_date='2026-07-01', region='测试地域', object_type='测试对象')['status'] == 'not_applicable'
    assert check(purpose='historical_review', event_date='2026-05-01', region='其他地域')['status'] == 'not_applicable'
    result = check(purpose='current_rectification', event_date='2026-05-01', region='测试地域', object_type='测试对象')
    assert result['status'] == 'not_applicable' and result['as_of'] == '2026-10-30'


def test_source_revocation_integrity_and_replay_are_checked(client):
    data, key = payload(client), uuid4().hex
    row = create(client, data, key).json()
    with Session.begin() as db:
        db.get(FileAsset, data['source_asset_id']).availability = 'withdrawn'
    assert create(client, data, key).status_code == 410
    assert action(client, row, 'submit').status_code == 410
    assert client.get('/api/v1/standards/' + row['id'], headers=headers()).status_code == 410
    with Session.begin() as db:
        asset = db.get(FileAsset, data['source_asset_id'])
        asset.availability = 'available'
        path = asset_path(asset.storage_key)
    path.write_bytes(b'tampered')
    assert action(client, row, 'submit').status_code == 409


def test_published_source_withdrawal_blocks_every_read_but_can_withdraw(client):
    data = payload(client)
    row = published(client, data)
    with Session.begin() as db:
        db.get(FileAsset, data['source_asset_id']).availability = 'withdrawn'
    url = '/api/v1/standards/' + row['id']
    for suffix in ('', '/source'):
        assert client.get(url + suffix, headers=headers('learner')).status_code == 410
    assert client.post(url + '/applicability', headers=headers('learner'), json={'purpose': 'current_rectification'}).status_code == 410
    response = client.get('/api/v1/standards', headers=headers('learner'), params={'project_id': 'demo-airport', 'limit': 100})
    assert row['id'] not in {item['id'] for item in response.json()['items']}
    assert action(client, row, 'withdraw').status_code == 200


def test_editions_overlap_rejected_and_correction_supersedes(client):
    data = payload(client)
    first = published(client, data)
    conflicting = {**data, 'edition': '2027'}
    row = create(client, conflicting).json()
    row = action(client, row, 'submit').json()
    row = action(client, row, 'approve', checked=True).json()
    response = action(client, row, 'publish')
    assert response.status_code == 409 and response.json()['code'] == 'EDITION_PERIOD_OVERLAP'
    revision = published(client, {**data, 'expected_version': 1, 'title': '原版核验更正'})
    with Session() as db:
        assert db.get(StandardRevision, first['id']).state == 'superseded'
        assert db.get(StandardRevision, revision['id']).state == 'published'
    # A later non-overlapping edition preserves historical availability.
    later = published(client, {**data, 'edition': '2028', 'valid_from': '2027-01-01', 'valid_until': None})
    assert later['state'] == 'published'


@pytest.mark.parametrize('corruption', ['duplicate', 'cycle', 'missing_parent', 'locator', 'date', 'blank'])
def test_invalid_structured_original_never_saved(client, corruption):
    data = payload(client)
    if corruption == 'duplicate': data['clauses'].append(deepcopy(data['clauses'][0]))
    elif corruption == 'cycle': data['clauses'][0]['parent_number'] = '1.1'
    elif corruption == 'missing_parent': data['clauses'][1]['parent_number'] = '9'
    elif corruption == 'locator': data['clauses'][0]['page'] = None
    elif corruption == 'date': data['valid_until'] = data['valid_from']
    else: data['clauses'][0]['text'] = '  '
    assert create(client, data).status_code == 422
    with Session() as db:
        assert db.scalar(select(StandardRevision.id).where(StandardRevision.code == data['code'])) is None


def test_cross_project_org_and_explicit_permission_grants(client):
    data = payload(client)
    other, _ = source(client, 'demo-metro')
    assert create(client, {**data, 'source_asset_id': other}).status_code == 403
    readonly = Actor('test', 'test', '只读', {'demo-airport'}, {'demo-airport': {'admin'}},
        permissions={'demo-airport': {'knowledge.read'}})
    # In A mode explicit grants must never expand because of admin role labels.
    from backend.integrations.a import runtime
    with pytest.MonkeyPatch.context() as monkeypatch:
        monkeypatch.setattr(runtime, 'enabled', lambda: True)
        app.dependency_overrides[current_actor] = lambda: readonly
        assert create(client, data).status_code == 403
        assert client.get('/api/v1/standards', params={'project_id': 'demo-airport', 'view': 'manage'}).status_code == 403
        readonly.permissions = {'demo-airport': {'knowledge.read', 'knowledge.process'}}
        readonly.org_id = 'other-org'
        assert create(client, data).status_code == 403


def test_upload_validation_dedup_and_path_is_server_owned(client):
    raw = ('测试材料 ' + uuid4().hex).encode('utf-8')
    ident, _ = source(client, text=raw.decode('utf-8'))
    r = client.post('/api/v1/standards/source-files', headers=headers(), content=raw,
        params={'project_id': 'demo-airport', 'name': '../../CON.txt'})
    assert r.status_code == 200 and r.json()['asset_id'] == ident
    with Session() as db:
        assert db.get(FileAsset, ident).storage_key.endswith('/original.txt')
    assert client.post('/api/v1/standards/source-files', headers=headers('learner'), content=raw,
        params={'project_id': 'demo-airport', 'name': 'x.txt'}).status_code == 403
    for name, content, status in [('x.pdf', b'fake pdf', 422), ('x.txt', b'\xff', 422),
                                 ('x.docx', b'not a zip', 422), ('x.txt', b'x' * 5_000_001, 413)]:
        r = client.post('/api/v1/standards/source-files', headers=headers(), content=content,
            params={'project_id': 'demo-airport', 'name': name})
        assert r.status_code == status, r.text
