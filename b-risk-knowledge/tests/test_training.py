import copy,os,subprocess,sys
from uuid import uuid4
import pytest
import httpx,json
from fastapi.testclient import TestClient
from sqlalchemy import select,func
from backend.app import app
from backend.db import Session
from backend.modules.training.models import TrainingAnswer,TrainingScoreReview,QuestionRevision
import test_knowledge as b03
import test_retrieval as b04
import test_retrospectives as b06

assert os.environ.get('B_DATABASE_URL','').endswith('/risk_b_test')
def h(role='admin',key=None):return {'Authorization':'Bearer dev-'+role,'Idempotency-Key':key or str(uuid4())}

@pytest.fixture(scope='module')
def client():
    worker=subprocess.Popen([sys.executable,'-m','backend.worker'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        with TestClient(app,raise_server_exceptions=False) as c:yield c
    finally:worker.kill();worker.wait(timeout=10)

def published(c):
    receipt=b06.package(c);retro=b06.approve(c,b06.create(c,receipt))
    converted=c.post('/api/v1/retrospectives/'+retro['id']+'/publish-experiences',headers=h(),json=b06.payload(retro)).json()
    card=b03.card(c,converted['draft_ids'][0])
    assert c.post('/api/v1/knowledge/'+card['id']+'/submit-review',headers=h(),json=b03.version_body(card)).status_code==200
    card=b03.card(c,card['id'])
    assert c.post('/api/v1/reviews/'+card['revision_id']+'/approve',headers=h(),json=b03.version_body(card,checked=True)).status_code==200
    card=b03.card(c,card['id']);release,_=b04.release(c,[card]);b04.activate(c,release)
    return card,receipt

def questions(c,card):
    r=c.post('/api/v1/training/questions/generate',headers=h('teacher'),json={'knowledge_revision_ids':[card['revision_id']],'types':['single_choice','multiple_choice','case_answer']})
    assert r.status_code==200,r.text
    result=[]
    for item in r.json()['items']:
        d=c.get('/api/v1/training/questions/'+item['id'],headers=h('teacher')).json()
        if d['state']!='approved':
            r=c.post('/api/v1/training/questions/'+d['id']+'/submit-review',headers=h('teacher'),json=b03.version_body(d));assert r.status_code==200,r.text
            d=c.get('/api/v1/training/questions/'+d['id'],headers=h('teacher')).json()
            r=c.post('/api/v1/reviews/'+d['revision_id']+'/approve',headers=h('teacher'),json=b03.version_body(d,checked=True));assert r.status_code==200,r.text
            d=c.get('/api/v1/training/questions/'+d['id'],headers=h('teacher')).json()
        result.append(d)
    return result

def package(c,qs,key=None,version=1,roles=None):
    r=c.post('/api/v1/training/packages',headers=h('teacher'),json={'project_id':'demo-airport','title':'模拟B06复盘练习','package_key':key or 'test-'+uuid4().hex,'version':version,
        'question_revision_ids':[q['revision_id'] for q in qs],'role_scope':roles or ['learner','teacher','admin']})
    assert r.status_code==200,r.text
    p=r.json();r=c.post('/api/v1/training/packages/'+p['id']+'/publish',headers=h('teacher'),json={'row_version':p['row_version'],'reason':'模拟发布固定题目版本'})
    assert r.status_code==200,r.text
    return r.json()

@pytest.fixture(scope='module')
def demo(client):
    card,receipt=published(client);qs=questions(client,card);p=package(client,qs)
    return card,receipt,qs,p

def start(c,p,mode='rules',role='learner',key=None):
    r=c.post('/api/v1/training/attempts',headers=h(role,key),json={'package_version_id':p['id'],'grading_mode':mode});assert r.status_code==200,r.text
    return r.json()['id']

def fill(c,ident,qs):
    for q in qs:
        content=q['content'];value={'row_version':0,'selected':content['answer'].get('selected',[]),'text':content['answer'].get('text','')}
        r=c.put(f"/api/v1/training/attempts/{ident}/answers/{q['id']}",headers=h('learner'),json=value);assert r.status_code==200,r.text

def test_generation_scope_and_dedup(client,demo):
    card,_,qs,_=demo
    body={'knowledge_revision_ids':[card['revision_id']],'types':['single_choice','case_answer']}
    r=client.post('/api/v1/training/questions/generate',headers=h('teacher'),json=body)
    assert r.status_code==200 and all(x['replayed'] for x in r.json()['items'])
    assert client.post('/api/v1/training/questions/generate',headers=h('learner'),json=body).status_code==403
    assert client.post('/api/v1/training/questions/generate',headers=h('outsider'),json=body).status_code==403
    assert client.get('/api/v1/training/questions/'+qs[0]['id'],headers=h('learner')).status_code==403
    assert client.get('/api/v1/reviews?object_type=question_revision',headers=h('teacher')).status_code==200
    assert client.get('/api/v1/training/questions/'+qs[0]['id'],headers=h('teacher')).json()['published'] is True
    assert any(q['id']==qs[0]['id'] for q in client.get('/api/v1/training/questions?state=published&limit=100',headers=h('teacher')).json()['items'])

def test_learner_schema_never_leaks_answers_and_saves_survive_refresh(client,demo):
    _,_,qs,p=demo;ident=start(client,p);url='/api/v1/training/attempts/'+ident
    d=client.get(url,headers=h('learner')).json()
    for q in d['questions']:
        assert set(q)=={'question_id','revision_id','type','stem','options','max_score','position'}
    assert 'rubric' not in str(d) and 'reference_answer' not in str(d)
    assert client.get(url+'/result',headers=h('learner')).status_code==409
    q=qs[0];body={'row_version':0,'selected':q['content']['answer']['selected'],'text':''}
    r=client.put(url+'/answers/'+q['id'],headers=h('learner'),json=body).json()
    replay=client.put(url+'/answers/'+q['id'],headers=h('learner'),json=body).json()
    assert replay['replayed'] and replay['row_version']==r['row_version']
    refreshed=client.get(url,headers=h('learner')).json();assert refreshed['saved_answers'][0]['answer']['selected']==body['selected']
    assert client.put(url+'/answers/'+q['id'],headers=h('learner'),json={**body,'selected':['z']}).status_code==422

def test_start_idempotency_and_attempt_owner_isolation(client,demo):
    _,_,_,p=demo;key=str(uuid4());ident=start(client,p,key=key)
    assert start(client,p,key=key)==ident
    for role in ['outsider','teacher','admin']:
        assert client.get('/api/v1/training/attempts/'+ident,headers=h(role)).status_code==403
    assert client.get('/api/v1/training/results',headers=h('learner')).status_code==403
    assert client.get('/api/v1/training/results?project_id=demo-metro',headers=h('teacher')).status_code==403
    assert client.post('/api/v1/training/attempts',headers=h('outsider'),json={'package_version_id':p['id']}).status_code==403

def test_objective_rule_scores_and_open_suggestions_are_distinct(client,demo):
    _,_,qs,p=demo;ident=start(client,p);fill(client,ident,qs)
    r=client.post('/api/v1/training/attempts/'+ident+'/submit',headers=h('learner'));assert r.status_code==200,r.text
    replay=client.post('/api/v1/training/attempts/'+ident+'/submit',headers=h('learner')).json();assert replay['replayed']
    result=client.get('/api/v1/training/attempts/'+ident+'/result',headers=h('learner')).json()
    assert result['confirmed_total'] is None and result['result_state']=='awaiting_review'
    assert all(a['confirmed_score']==100 for a in result['answers'] if a['type']!='case_answer')
    case=next(a for a in result['answers'] if a['type']=='case_answer')
    assert case['suggested_score']==100 and case['confirmed_score'] is None and case['score_kind']=='rule_suggestion'
    r=client.post('/api/v1/training/answers/'+case['id']+'/review-score',headers=h('teacher'),json={'row_version':case['row_version'],'score':80,'reason':'教员核对：回答遗漏现场适用条件'})
    assert r.status_code==200,r.text
    final=client.get('/api/v1/training/attempts/'+ident+'/result',headers=h('learner')).json()
    assert final['confirmed_total']==280 and final['result_state']=='confirmed'
    updated=next(a for a in final['answers'] if a['type']=='case_answer');assert updated['suggested_score']==100 and updated['confirmed_score']==80
    with Session() as db:assert db.scalar(select(func.count()).select_from(TrainingScoreReview).where(TrainingScoreReview.answer_id==case['id']))==1
    assert client.post('/api/v1/training/answers/'+case['id']+'/review-score',headers=h('teacher'),json={'row_version':case['row_version'],'score':90,'reason':'重复旧版本'}).status_code==409
    assert client.put('/api/v1/training/attempts/'+ident+'/answers/'+qs[0]['id'],headers=h('learner'),json={'row_version':1,'selected':[]}).status_code==409
    assert client.post('/api/v1/training/attempts/'+ident+'/feedback',headers=h('learner'),json={'rating':'useful','comment':'模拟练习反馈'}).status_code==200

def test_grading_failure_preserves_answers_without_fake_zero(client,demo):
    _,_,qs,p=demo;ident=start(client,p,'simulate_failure');fill(client,ident,qs)
    assert client.post('/api/v1/training/attempts/'+ident+'/submit',headers=h('learner')).status_code==200
    d=client.get('/api/v1/training/attempts/'+ident+'/result',headers=h('learner')).json()
    assert d['result_state']=='pending_scoring' and d['confirmed_total'] is None and d['provisional_total'] is None
    case=next(a for a in d['answers'] if a['type']=='case_answer')
    assert case['suggested_score'] is None and case['confirmed_score'] is None and case['answer']['text']

def test_package_versions_roles_and_missing_answers(client,demo):
    _,_,qs,p=demo;p2=package(client,qs,key=p['package_key'],version=2,roles=['teacher'])
    assert p2['version']==2 and p2['id']!=p['id']
    assert client.post('/api/v1/training/attempts',headers=h('learner'),json={'package_version_id':p2['id']}).status_code==403
    ident=start(client,p)
    assert client.post('/api/v1/training/attempts/'+ident+'/submit',headers=h('learner')).status_code==422

def test_question_new_version_keeps_old_package_and_review_target(client):
    card,_=published(client);qs=questions(client,card);p=package(client,qs);ident=start(client,p);fill(client,ident,qs)
    q=qs[0];new=copy.deepcopy(q['content']);new['stem']+=' 新版本补充。'
    r=client.patch('/api/v1/training/questions/'+q['id']+'/draft',headers=h('teacher'),json={**b03.version_body(q),'content':new});assert r.status_code==200,r.text
    current=client.get('/api/v1/training/questions/'+q['id'],headers=h('teacher')).json()
    assert current['version']==q['version']+1 and current['state']=='draft'
    assert client.post('/api/v1/reviews/'+q['revision_id']+'/approve',headers=h('teacher'),json=b03.version_body(current,checked=True)).status_code==409
    assert client.post('/api/v1/training/attempts/'+ident+'/submit',headers=h('learner')).status_code==200
    result=client.get('/api/v1/training/attempts/'+ident+'/result',headers=h('learner')).json()
    assert next(a for a in result['answers'] if a['question_revision_id']==q['revision_id'])['stem']==q['content']['stem']

def test_source_withdrawal_stops_new_attempts_and_redacts_historical_body(client):
    card,receipt=published(client);qs=questions(client,card);p=package(client,qs);ident=start(client,p);fill(client,ident,qs)
    assert client.post('/api/v1/training/attempts/'+ident+'/submit',headers=h('learner')).status_code==200
    assert client.post('/api/v1/task-packages/'+receipt+'/withdraw',headers=h(),json={'reason':'模拟培训来源撤回'}).status_code==200
    assert client.post('/api/v1/training/attempts',headers=h('learner'),json={'package_version_id':p['id']}).status_code==410
    d=client.get('/api/v1/training/attempts/'+ident+'/result',headers=h('learner')).json()
    assert d['content_available'] is False and d['max_score']==300
    assert all(not any(k in a for k in ['stem','answer','reference_answer','rubric','feedback']) for a in d['answers'])
    assert client.get('/api/v1/training/questions/'+qs[0]['id'],headers=h('teacher')).status_code==410


def test_model_grading_is_background_and_cannot_override_human_score(client,demo,monkeypatch,tmp_path):
    from backend.modules.extraction import llm
    from backend.modules.training import service
    from backend.modules.training.tasks import grade_attempt
    monkeypatch.setattr(llm,'config_path',lambda:tmp_path/'model.json')
    monkeypatch.setattr(service,'enqueue',lambda db,ident:None)
    r=client.put('/api/v1/models/settings',headers=h(),json={'enabled':True,'base_url':'https://model.example/v1','model':'unit-grader','api_key':'unit-grading-key'})
    assert r.status_code==200
    calls=[]
    def handler(request):
        calls.append(request)
        return httpx.Response(200,json={'choices':[{'finish_reason':'stop','message':{'content':json.dumps({'score':65,'explanation':'模型建议：还需核对适用条件。'})}}]})
    monkeypatch.setattr(llm,'TRANSPORT',httpx.MockTransport(handler))
    _,_,qs,p=demo;ident=start(client,p,'llm');fill(client,ident,qs)
    assert client.post('/api/v1/training/attempts/'+ident+'/submit',headers=h('learner')).status_code==200
    d=client.get('/api/v1/training/attempts/'+ident+'/result',headers=h('learner')).json()
    assert d['result_state']=='pending_scoring' and d['grading_job']['status']=='queued' and not calls
    grade_attempt.func(d['grading_job']['id'])
    d=client.get('/api/v1/training/attempts/'+ident+'/result',headers=h('learner')).json()
    case=next(a for a in d['answers'] if a['type']=='case_answer')
    assert case['suggested_score']==65 and case['confirmed_score'] is None and case['score_kind']=='model_suggestion'
    assert d['grading_job']['status']=='succeeded' and len(calls)==1
    second=start(client,p,'llm');fill(client,second,qs);client.post('/api/v1/training/attempts/'+second+'/submit',headers=h('learner'))
    d=client.get('/api/v1/training/attempts/'+second+'/result',headers=h('learner')).json();case=next(a for a in d['answers'] if a['type']=='case_answer')
    assert client.post('/api/v1/training/answers/'+case['id']+'/review-score',headers=h('teacher'),json={'row_version':case['row_version'],'score':80,'reason':'先由教员核对'}).status_code==200
    grade_attempt.func(d['grading_job']['id'])
    d=client.get('/api/v1/training/attempts/'+second+'/result',headers=h('learner')).json()
    assert d['confirmed_total']==280 and len(calls)==1
