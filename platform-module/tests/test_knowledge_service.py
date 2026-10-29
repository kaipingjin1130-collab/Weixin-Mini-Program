"""The workflow must fail closed, not substitute demo guidance."""
import json
from pathlib import Path
import sys
from types import SimpleNamespace
from urllib.error import HTTPError, URLError
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'candidate'))
import knowledge_service as bridge


class Problem(Exception):
    def __init__(self, message, status):
        self.status = status


TASK = {'id': 'task', 'projectId': 'project', 'object': '验收区域', 'scenario': {'id': 'inspection', 'version': 1}}


def query():
    return bridge.query(TASK, '现场问题', 'request-1', 'session', Problem)


@pytest.fixture
def configured(monkeypatch):
    monkeypatch.setenv('QAXC_B_URL', 'http://127.0.0.1:18771/__knowledge')
    monkeypatch.setenv('A_TO_B_KEY', 'test-service-key')


def test_missing_service_never_returns_demo(monkeypatch):
    monkeypatch.delenv('A_TO_B_KEY', raising=False)
    with pytest.raises(Problem) as exc:
        query()
    assert exc.value.status == 503


@pytest.mark.parametrize('failure,status', [(URLError('offline'),503),(HTTPError('local',403,'denied',{},None),403),
    (HTTPError('local',302,'redirect',{},None),503),(TimeoutError(),503)])
def test_service_failures_are_visible(configured,monkeypatch,failure,status):
    def fail(*args,**kwargs):
        raise failure
    monkeypatch.setattr(bridge,'build_opener',lambda *args:SimpleNamespace(open=fail))
    with pytest.raises(Problem) as exc:
        query()
    assert exc.value.status==status


def test_contract_and_no_redirect(configured,monkeypatch):
    response={'status':'answered','items':[{'title':'现场知识','text':'核对来源','reference':'归档成果 v2'}],
        'knowledge_release_id':'release-v1','citations':[{'citation_id':'proof'}]}
    class Response:
        def __enter__(self):return self
        def __exit__(self,*args):pass
        def read(self,limit):return json.dumps(response).encode()
    def open_request(request,timeout):
        payload=json.loads(request.data)
        assert payload['project_id']=='project' and payload['task_id']=='task'
        assert payload['scenario_version']==1 and payload['object']=='验收区域'
        assert request.headers['X-ab-session']=='session' and timeout==15
        return Response()
    def opener(*handlers):
        assert any(isinstance(h,bridge.NoRedirect) for h in handlers)
        return SimpleNamespace(open=open_request)
    monkeypatch.setattr(bridge,'build_opener',opener)
    result=query()
    assert result['version']=='release-v1' and result['requiresConfirmation']
    assert result['citations']==response['citations']
    response['items']=[{'title':'missing reference'}]
    with pytest.raises(Problem) as exc:query()
    assert exc.value.status==503
