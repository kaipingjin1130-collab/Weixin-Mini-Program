import json
from types import SimpleNamespace
from uuid import uuid4
import httpx
import pytest
from fastapi.testclient import TestClient
from backend.app import app
from backend.auth import Actor, Problem
from backend.modules.extraction import llm
from backend.modules.extraction.schemas import ModelSettings
from backend.modules.extraction.generation import retrospective_suggestions, training_question
from backend.modules.scenes.api import active_template
from backend.modules.training.service import learner_scope
from backend.db import Session
from backend.modules.retrospectives.engine import build_task
from backend.modules.task_packages.fixtures import sample
from backend.modules.ingestion.adapters import normalize,TEMPLATES


def headers(role='admin'):
    return {'Authorization':'Bearer dev-'+role}


def test_scene_versions_permissions_and_frozen_result():
    with TestClient(app) as c:
        code='scene_'+uuid4().hex[:8]
        payload={'name':'第二场景','categories':[{'code':'electricity','name':'临时用电'}],
                 'steps':[{'event_type':'task_started','name':'开始','scope':'task'}],'compare_deadline':False}
        data={'project_id':'demo-airport','code':code,'expected_version':0,'payload':payload}
        assert c.post('/api/v1/scenes',headers=headers('learner'),json=data).status_code==403
        first=c.post('/api/v1/scenes',headers=headers(),json=data); assert first.status_code==200,first.text
        ident=first.json()['id']
        assert c.post('/api/v1/scenes',headers=headers(),json=data).status_code==409
        assert c.post('/api/v1/scenes/'+ident+'/activate',headers=headers('processor'),json={'expected_active_id':None}).status_code==403
        assert c.post('/api/v1/scenes/'+ident+'/activate',headers=headers(),json={'expected_active_id':None}).status_code==200
        with Session() as db:frozen=active_template(db,'demo-airport',code)
        data['expected_version']=1; data['payload']['name']='新配置'
        second=c.post('/api/v1/scenes',headers=headers(),json=data).json()
        assert c.post('/api/v1/scenes/'+second['id']+'/activate',headers=headers(),json={'expected_active_id':None}).status_code==409
        assert c.post('/api/v1/scenes/'+second['id']+'/activate',headers=headers(),json={'expected_active_id':ident}).status_code==200
        assert frozen['name']=='第二场景'
        before=build_task(sample('complete'),frozen)
        assert len([f for f in before[2] if f['id'].startswith('step-')])<=1
        assert all(d['result']=='不判定' for d in before[1]['deadlines'])
        data['expected_version']=2;data['payload']['steps'][0]['scope']='issue'
        assert c.post('/api/v1/scenes',headers=headers(),json=data).status_code==422


def test_assigned_learning_scope_cannot_be_bypassed_by_v1_grant():
    actor=Actor('u','allowed','member',{'p'},{},permissions={'p':{'training.learn'}})
    package=SimpleNamespace(project_id='p',role_scope=[],audience_subjects=['allowed'],state='published')
    learner_scope(package,actor)
    actor.subject='other'
    with pytest.raises(Problem) as exc:learner_scope(package,actor)
    assert exc.value.code=='AUDIENCE_DENIED'


@pytest.mark.parametrize('corrupt',[False,True])
def test_generated_suggestion_requires_exact_evidence(monkeypatch,tmp_path,corrupt):
    monkeypatch.setattr(llm,'config_path',lambda:tmp_path/'model.json')
    llm.save(ModelSettings(enabled=True,base_url='https://api.openai.com/v1',model='gpt-6.1-sol',api_key='test-key'))
    output={'suggestions':[{'text':'建议补充核验防护状态。','quotes':[{'source_id':'e1','text':'伪造原文' if corrupt else '临边防护缺失'}]}]}
    monkeypatch.setattr(llm,'TRANSPORT',httpx.MockTransport(lambda request:httpx.Response(200,json={
        'choices':[{'finish_reason':'stop','message':{'content':json.dumps(output,ensure_ascii=False)}}]})))
    if corrupt:
        with pytest.raises(Problem) as exc:retrospective_suggestions({'e1':'临边防护缺失'},[])
        assert exc.value.code=='GENERATED_QUOTE_INVALID'
    else:
        values,meta=retrospective_suggestions({'e1':'临边防护缺失'},[])
        assert values[0].quotes[0].source_id=='e1' and meta['model_ref']=='gpt-6.1-sol'


def test_governance_candidates_remain_pending():
    raw={'record_id':'r1','report_id':'doc1','project_id':'p','description':'待核实记录',
         'record_kind':'detail','governance_review_required':True}
    result=normalize(raw,{},TEMPLATES['governance-v1'],'p')
    assert not result['errors'] and any('治理候选尚未人工核实' in message for message in result['issues'])


@pytest.mark.parametrize('kind',['single_choice','multiple_choice','case_answer'])
def test_model_question_answer_contract(monkeypatch,tmp_path,kind):
    from backend.modules.training.service import validate
    monkeypatch.setattr(llm,'config_path',lambda:tmp_path/'model.json')
    llm.save(ModelSettings(enabled=True,model='test-model',api_key='test-key'))
    case=kind=='case_answer'
    content={'stem':'依据来源，现场需要核查哪些事项？','options':[] if case else [
        {'id':'a','text':'临边防护'},{'id':'b','text':'洞口防护'},{'id':'c','text':'完全不需核查'}],
        'answer':{'text':'临边和洞口防护'} if case else {'selected':['a','b'] if kind=='multiple_choice' else ['a']},
        'rubric':[{'point':'防护核查','keywords':['防护'],'points':100}] if case else []}
    output={'content':content,'explanation':'来源记载了临边防护缺失。','quotes':[{'source_id':'0','text':'临边防护缺失'}]}
    monkeypatch.setattr(llm,'TRANSPORT',httpx.MockTransport(lambda request:httpx.Response(200,json={
        'choices':[{'finish_reason':'stop','message':{'content':json.dumps(output,ensure_ascii=False)}}]})))
    generated,_=training_question(kind,{'title':'防护检查','facts':[{'text':'临边防护缺失，洞口防护缺失'}]})
    validate(generated,kind)
    assert generated.answer['evidence_quotes'][0]['source_id']=='0'
    content['answer']={'correct_answer':'a'}
    with pytest.raises(Problem) as exc:training_question(kind,{'title':'防护检查','facts':[{'text':'临边防护缺失，洞口防护缺失'}]})
    assert exc.value.code=='MODEL_OUTPUT_INVALID'
