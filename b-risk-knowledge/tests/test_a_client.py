import hashlib
import json
from pathlib import Path
import httpx
import pytest
from backend.integrations.a.client import AClient, AClientError
from backend.integrations.a.registry import SourceRegistration

DATA = b'test photo'
EVIDENCE = {'id': 'photo-1', 'name': 'photo.png', 'mime': 'image/png', 'size': len(DATA),
            'sha256': hashlib.sha256(DATA).hexdigest()}
META = {'source_system': 'a', 'org_id': 'demo-org', 'project_id': 'demo-project-001', 'task_id': 'task-1',
        'delivery_id': 'delivery-1', 'delivery_version': 1, 'eligible': True, 'ineligible_reason': None,
        'withdrawn': False, 'withdrawn_at': None, 'withdraw_reason': None, 'is_demo': True}


def client(handler):
    registration = SourceRegistration.from_config({'source_system': 'a', 'org_id': 'demo-org',
        'project_ids': ['demo-project-001', '085ecd33912a440fb092c2ed59ee07ed'],
        'allowed_actions': ['delivery.meta', 'delivery.snapshot', 'delivery.attachment'], 'enabled': True})
    return AClient('http://127.0.0.1:8765/quality', 'service-test', registration=registration, transport=httpx.MockTransport(handler))


def metadata(c):
    return c.metadata('delivery-1', org_id='demo-org', project_id='demo-project-001', task_id='task-1', version=1)


def test_meta_and_attachment_with_service_only():
    requests = []
    def handle(req):
        requests.append(req)
        if '/delivery-meta/' in req.url.path:
            return httpx.Response(200, json=META)
        if '/evidence-meta/' in req.url.path:
            return httpx.Response(200, json=EVIDENCE)
        return httpx.Response(200, content=DATA)
    c = client(handle)
    try:
        assert metadata(c)['eligible']
        assert c.attachment('delivery-1', EVIDENCE, org_id='demo-org', project_id='demo-project-001') == DATA
        assert all(r.headers['authorization'] == 'Bearer service-test' for r in requests)
        assert all('x-ab-session' not in r.headers for r in requests)
        assert requests[1].url.params['deliveryId'] == 'delivery-1'
    finally:
        c.close()


@pytest.mark.parametrize('change,status', [({'withdrawn': True}, 410), ({'eligible': False}, 422),
                                            ({'project_id': 'other'}, 409), ({'withdrawn': None}, 503)])
def test_meta_rejects_invalid_or_ineligible(change, status):
    c = client(lambda _: httpx.Response(200, json={**META, **change}))
    try:
        with pytest.raises(AClientError) as error:
            metadata(c)
        assert error.value.status == status
    finally:
        c.close()


def test_unregistered_scope_is_denied_before_network():
    def fail(_):
        raise AssertionError('network must not be called')
    c = client(fail)
    try:
        with pytest.raises(AClientError) as error:
            c.metadata('delivery-1', org_id='demo-org', project_id='not-registered', task_id='task-1', version=1)
        assert error.value.status == 403
    finally:
        c.close()


def test_attachment_rejects_bad_hash_and_redirect():
    def handle(req):
        return httpx.Response(200, json=EVIDENCE) if '/evidence-meta/' in req.url.path else httpx.Response(200, content=b'wrong')
    c = client(handle)
    try:
        with pytest.raises(AClientError, match='A_ATTACHMENT_HASH_MISMATCH'):
            c.attachment('delivery-1', EVIDENCE, org_id='demo-org', project_id='demo-project-001')
    finally:
        c.close()


def test_prepare_rechecks_metadata_and_snapshot_relationship():
    path = Path(__file__).resolve().parent / 'fixtures/a-export/completed-task-demo.json'
    raw = path.read_bytes()
    source = json.loads(raw)
    delivery = source['task']['deliveries'][-1]
    meta = {**META, 'project_id': source['project']['id'], 'task_id': source['task']['id'],
            'delivery_id': delivery['id'], 'delivery_version': delivery['version']}
    calls = []
    def handle(req):
        calls.append(req.url.path)
        return httpx.Response(200, content=raw) if '/snapshot/' in req.url.path else httpx.Response(200, json=meta)
    c = client(handle)
    try:
        actual_raw, mapped, _ = c.prepare(delivery['id'], org_id='demo-org', project_id=meta['project_id'],
                                          task_id=meta['task_id'], version=meta['delivery_version'])
        assert actual_raw == raw and mapped['package']['task_id'] == meta['task_id']
        assert len(calls) == 3 and '/delivery-meta/' in calls[0] and '/delivery-meta/' in calls[2]
    finally:
        c.close()
    c = client(lambda _: httpx.Response(302, headers={'Location': 'https://example.com/'}))
    try:
        with pytest.raises(AClientError) as error:
            metadata(c)
        assert error.value.status == 503
    finally:
        c.close()
