import httpx
import pytest
from backend.auth import Problem
from backend.modules.extraction import llm
from backend.modules.extraction.schemas import ModelSettings
from backend.modules.retrieval.adapters import get_embedding


@pytest.mark.parametrize('bad', [False, True])
def test_cloud_embedding_dimension_and_no_fake_fallback(monkeypatch, tmp_path, bad):
    monkeypatch.setattr(llm, 'config_path', lambda: tmp_path/'model.json')
    llm.save(ModelSettings(enabled=True,base_url='https://api.openai.com/v1',model='gpt-5.4-mini',api_key='test-key'))
    def response(request):
        assert str(request.url) == 'https://api.openai.com/v1/embeddings'
        return httpx.Response(200,json={'data':[{'index':0,'embedding':[1.0]*(7 if bad else 1536)}]})
    monkeypatch.setattr(llm,'TRANSPORT',httpx.MockTransport(response))
    if bad:
        with pytest.raises(Problem) as exc:get_embedding('openai-text-embedding-3-small').embed('临边防护检查')
        assert exc.value.code == 'EMBEDDING_INVALID'
    else:
        assert len(get_embedding('openai-text-embedding-3-small').embed('临边防护检查')) == 1536


def test_embedding_never_sends_deepseek_key_to_openai(monkeypatch,tmp_path):
    monkeypatch.setattr(llm,'config_path',lambda:tmp_path/'model.json')
    llm.save(ModelSettings(enabled=True,model='deepseek-flash',api_key='test-key'))
    with pytest.raises(Problem) as exc:get_embedding('openai-text-embedding-3-small').embed('检查')
    assert exc.value.code == 'EMBEDDING_PROVIDER_REQUIRED'
