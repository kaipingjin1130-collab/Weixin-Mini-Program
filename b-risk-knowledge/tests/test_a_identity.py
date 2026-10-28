from types import SimpleNamespace
import httpx
import pytest
from starlette.requests import Request
from backend.auth import Problem, resolve_a_actor

SETTINGS = SimpleNamespace(a_base='http://127.0.0.1:8765/quality', a_to_b_key='proxy-test',
                           b_to_a_key='service-test', a_org_id='demo-org')


def request(key='proxy-test', session='opaque'):
    headers = [(b'authorization', ('Bearer ' + key).encode()), (b'x-ab-session', session.encode())]
    return Request({'type': 'http', 'method': 'GET', 'path': '/', 'headers': headers,
                    'query_string': b'', 'server': ('testserver', 80)})


def identity(permissions=None):
    return {'active': True, 'subject_id': 'demo-user-001', 'display_name': '测试用户', 'org_id': 'demo-org',
            'projects': [{'project_id': 'demo-project-001', 'permissions': permissions or []}]}


def test_current_permission_is_resolved_every_time(monkeypatch):
    calls = []
    def post(url, **kwargs):
        calls.append((url, kwargs))
        return httpx.Response(200, json=identity(['knowledge.read'] if len(calls) == 1 else []))
    monkeypatch.setattr(httpx, 'post', post)
    first = resolve_a_actor(request(), SETTINGS)
    second = resolve_a_actor(request(), SETTINGS)
    assert first.can('knowledge.read', 'demo-project-001')
    assert not second.can('knowledge.read', 'demo-project-001')
    assert not first.can('read', 'demo-project-001')
    assert not first.can('knowledge.read', 'other')
    assert calls[0][0].endswith('/quality/integration/v1/identity/resolve')
    assert calls[0][1]['headers']['Authorization'] == 'Bearer service-test'
    assert calls[0][1]['json'] == {'project_id': None}


@pytest.mark.parametrize('status,expected', [(401, 401), (403, 403), (500, 503), (302, 503)])
def test_identity_failures_are_closed(monkeypatch, status, expected):
    monkeypatch.setattr(httpx, 'post', lambda *a, **kw: httpx.Response(status))
    with pytest.raises(Problem) as error:
        resolve_a_actor(request(), SETTINGS)
    assert error.value.status == expected


def test_wrong_key_and_invalid_response_are_denied(monkeypatch):
    with pytest.raises(Problem) as error:
        resolve_a_actor(request(key='wrong'), SETTINGS)
    assert error.value.status == 401
    monkeypatch.setattr(httpx, 'post', lambda *a, **kw: httpx.Response(200, json={**identity(), 'org_id': 'other'}))
    with pytest.raises(Problem) as error:
        resolve_a_actor(request(), SETTINGS)
    assert error.value.status == 503


def test_identity_timeout_does_not_fall_back(monkeypatch):
    def fail(*args, **kwargs):
        raise httpx.ConnectTimeout('offline')
    monkeypatch.setattr(httpx, 'post', fail)
    with pytest.raises(Problem) as error:
        resolve_a_actor(request(), SETTINGS)
    assert error.value.status == 503
