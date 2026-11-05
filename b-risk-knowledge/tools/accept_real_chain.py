"""Real provider through release/training services, using labelled test fixtures.

Requires the dedicated risk_b_test DB after check.py; never approves governance
candidates. Model credentials are read from the existing local configuration.
"""
import json, os, sys, time
from pathlib import Path
from uuid import uuid4
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
assert os.environ.get('B_DATABASE_URL','').endswith('/risk_b_test')
from fastapi.testclient import TestClient
from backend.app import app
from backend.modules.extraction import llm,generation_jobs
from backend.modules.retrieval import publication
from backend.modules.retrieval.tasks import build_release
from backend.modules.training import service
from backend.modules.training.tasks import grade_attempt
llm.config_path=lambda:ROOT/'.local/model.json'
generation_jobs.enqueue=lambda db,ident:None
publication.enqueue=lambda db,ident:None
service.enqueue=lambda db,ident:None
OUT=ROOT/'.local/real-model-acceptance/chain.json'


def main():
    with TestClient(app) as c:
        def call(method,path,data=None,role='admin',expect=(200,202)):
            r=c.request(method,'/api/v1'+path,json=data,headers={'Authorization':'Bearer dev-'+role,'Idempotency-Key':str(uuid4())})
            assert r.status_code in expect,(path,r.status_code,r.text[:200])
            return r.json()
        def version(d):return {'row_version':d['row_version'],'revision_id':d['revision_id'],'reason':'仅隔离测试夹具审核，不是业务验收','evidence_checked':True}
        state=json.loads(OUT.read_text(encoding='utf-8')) if OUT.exists() else {'fixture_data':True,'real_provider':True,'checks':[]}
        def save():OUT.write_text(json.dumps(state,ensure_ascii=False,indent=2),encoding='utf-8')
        items=call('GET','/knowledge/library?project_id=demo-airport')['items']
        card=next(x for x in items if x['is_mock'] and x['title'].startswith('案例卡 · 模拟'))
        if state.get('source')!=card['revision_id']:
            state={'source':card['revision_id'],'fixture_data':True,'real_provider':True,'checks':[]}
        if not state.get('release_id'):
            release=call('POST','/releases',{'project_id':'demo-airport','revision_ids':[card['revision_id']],
                'embedding_model':'openai-text-embedding-3-small'})
            state['release_id']=release['id'];state['release_job']=release['job_id'];save()
        build_release.func(state['release_job'])
        release=call('GET','/releases/'+state['release_id']);assert release['state'] in {'ready','active'}
        if release['state']!='active':
            active=call('GET','/releases?project_id=demo-airport')['active_ids']['demo-airport']
            call('POST','/releases/'+release['id']+'/activate',{'row_version':release['row_version'],'expected_active_id':active})
        found=call('POST','/search',{'project_id':'demo-airport','question':'疏散通道堆放物品'},role='learner')
        assert found['status']=='answered' and found['results'] and found['citations'] and not found['is_mock']
        none=call('POST','/search',{'project_id':'demo-airport','question':'GB 999999-2099 的要求是什么'},role='learner')
        assert none['status']=='insufficient_evidence' and not none['results']
        state['checks']=['真实向量发布索引与启用','真实语义查询与证据','无依据标准编号不作答'];save()
        print('PASS actual release/search services with real embedding',flush=True)
        if not state.get('question_job'):
            job=call('POST','/training/generation-jobs',{'knowledge_revision_ids':[card['revision_id']],
                'types':['single_choice','multiple_choice','case_answer'],'generation_mode':'llm'},role='teacher')
            state['question_job']=job['job_id'];save()
        generation_jobs.generate.func(state['question_job'])
        job=call('GET','/model-generation-jobs/'+state['question_job'],role='teacher');assert job['status']=='succeeded'
        questions=[]
        for entry in job['result']['items']:
            q=call('GET','/training/questions/'+entry['id'],role='teacher')
            if q['state']=='draft':
                call('POST','/training/questions/'+q['id']+'/submit-review',version(q),role='teacher')
                q=call('GET','/training/questions/'+q['id'],role='teacher')
            if q['state']=='pending_review':
                call('POST','/reviews/'+q['revision_id']+'/approve',version(q),role='teacher')
                q=call('GET','/training/questions/'+q['id'],role='teacher')
            questions.append(q)
        if not state.get('package_id'):
            package=call('POST','/training/packages',{'title':'真实模型链路验收 · 明确测试资料','package_key':'real-chain-'+uuid4().hex,
                'version':1,'project_id':'demo-airport','question_revision_ids':[q['revision_id'] for q in questions],
                'role_scope':['learner','teacher','admin']},role='teacher')
            package=call('POST','/training/packages/'+package['id']+'/publish',{'row_version':package['row_version'],'reason':'隔离测试夹具'},role='teacher')
            state['package_id']=package['id'];save()
        if not state.get('attempt_id'):
            attempt=call('POST','/training/attempts',{'package_version_id':state['package_id'],'grading_mode':'llm'},role='learner')
            state['attempt_id']=attempt['id'];save()
            for q in questions:
                a=q['content']['answer']
                call('PUT','/training/attempts/'+attempt['id']+'/answers/'+q['id'],{'row_version':0,'selected':a.get('selected',[]),'text':a.get('text','')},role='learner')
        detail=call('GET','/training/attempts/'+state['attempt_id'],role='learner')
        assert all('answer' not in q and 'rubric' not in q for q in detail['questions'])
        call('POST','/training/attempts/'+state['attempt_id']+'/submit',role='learner')
        result=call('GET','/training/attempts/'+state['attempt_id']+'/result',role='learner')
        grade_attempt.func(result['grading_job']['id'])
        result=call('GET','/training/attempts/'+state['attempt_id']+'/result',role='learner')
        case=next(a for a in result['answers'] if a['type']=='case_answer')
        assert case['suggested_score'] is not None and case['confirmed_score'] is None
        assert result['confirmed_total'] is None
        state['checks']+=['真实模型三题型经生成服务入库','测试审核与固定学习包','学员页面不泄露答案','真实模型评分保持待教员确认']
        state['status']='engineering_passed';state['case_score']=case['suggested_score'];save()
        print('PASS real training generation, learning and unconfirmed grading',flush=True)


if __name__=='__main__':
    try:main()
    except llm.Problem as exc:
        print(json.dumps({'code':exc.code,'message':exc.message},ensure_ascii=False),flush=True);sys.exit(1)
