import json
import httpx
import pytest
from pydantic import BaseModel
from backend.auth import Problem
from backend.modules.extraction import llm
from backend.modules.extraction.schemas import ModelSettings
from backend.modules.extraction.presets import PRESETS


class Reply(BaseModel):
    status: str


@pytest.mark.parametrize('preset', PRESETS)
def test_official_presets_request_and_secret_isolation(monkeypatch, tmp_path, preset):
    monkeypatch.setattr(llm, 'config_path', lambda: tmp_path/'model.json')
    value = llm.save(ModelSettings(enabled=True, base_url=preset['base_url'], model=preset['default_model'], api_key='test-secret'))
    assert 'test-secret' not in json.dumps(value)
    requests = []
    def response(request):
        requests.append(request)
        return httpx.Response(200, json={'choices': [{'finish_reason': 'stop', 'message': {'content': '{"status":"ok"}'}}]})
    monkeypatch.setattr(llm, 'TRANSPORT', httpx.MockTransport(response))
    reply, _ = llm.structured(Reply, 'JSON only', {'connection_test': True})
    assert reply.status == 'ok'
    body = json.loads(requests[0].content)
    assert str(requests[0].url) == preset['base_url']+'/chat/completions'
    if preset['id'] == 'openai':
        assert 'max_completion_tokens' in body and 'temperature' not in body and 'max_tokens' not in body
        assert body['store'] is False
    else:
        assert body['thinking'] == {'type': 'disabled'}
    other = next(p for p in PRESETS if p != preset)
    with pytest.raises(Problem) as exc:
        llm.save(ModelSettings(enabled=True, base_url=other['base_url'], model=other['default_model']))
    assert exc.value.code == 'MODEL_CREDENTIALS_REQUIRED'
    assert llm.load().base_url == preset['base_url']


@pytest.mark.parametrize('status,code', [(401, 'MODEL_AUTH_FAILED'), (403, 'MODEL_AUTH_FAILED'), (429, 'MODEL_RATE_OR_QUOTA_LIMIT')])
def test_provider_errors_do_not_echo_response(monkeypatch, tmp_path, status, code):
    monkeypatch.setattr(llm, 'config_path', lambda: tmp_path/'model.json')
    llm.save(ModelSettings(enabled=True, base_url=PRESETS[0]['base_url'], model=PRESETS[0]['default_model'], api_key='test-secret'))
    monkeypatch.setattr(llm, 'TRANSPORT', httpx.MockTransport(lambda r: httpx.Response(status, text='private-provider-details')))
    with pytest.raises(Problem) as exc:
        llm.structured(Reply, 'JSON only', {})
    assert exc.value.code == code
    assert 'private-provider-details' not in exc.value.message


@pytest.mark.parametrize('error,code', [
    (httpx.ConnectTimeout, 'MODEL_CONNECT_TIMEOUT'),
    (httpx.ReadTimeout, 'MODEL_RESPONSE_TIMEOUT'),
    (httpx.ConnectError, 'MODEL_NETWORK_ERROR'),
])
def test_network_failure_is_not_misreported_as_invalid_output(monkeypatch, tmp_path, error, code):
    monkeypatch.setattr(llm, 'config_path', lambda: tmp_path/'model.json')
    llm.save(ModelSettings(enabled=True, base_url=PRESETS[0]['base_url'], model=PRESETS[0]['default_model'], api_key='test-secret'))
    def fail(request):
        raise error('private-provider-details', request=request)
    monkeypatch.setattr(llm, 'TRANSPORT', httpx.MockTransport(fail))
    with pytest.raises(Problem) as exc:
        llm.structured(Reply, 'JSON only', {})
    assert exc.value.code == code
    assert 'private-provider-details' not in exc.value.message


@pytest.mark.parametrize('proxy,expected', [
    ('http://127.0.0.1:7897', 'http://127.0.0.1:7897'),
    ('http://remote.example:7897', None),
    ('http://secret@127.0.0.1:7897', None),
])
def test_local_proxy_scope(monkeypatch, proxy, expected):
    import urllib.request
    from types import SimpleNamespace
    monkeypatch.setattr(llm.os, 'name', 'nt')
    monkeypatch.setattr(llm, 'settings', SimpleNamespace(environment='development'))
    monkeypatch.setattr(llm, 'TRANSPORT', None)
    monkeypatch.setattr(urllib.request, 'getproxies_registry', lambda: {'https': proxy}, raising=False)
    assert llm.local_model_proxy() == expected
    monkeypatch.setattr(llm, 'settings', SimpleNamespace(environment='production'))
    assert llm.local_model_proxy() is None
