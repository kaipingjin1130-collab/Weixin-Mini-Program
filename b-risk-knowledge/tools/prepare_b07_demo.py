"""Prepare explicitly simulated B07 content via the real local API workflows.

Does not read original reports or configure/call any cloud model. All approvals
here are labelled demo validation, never real engineering/teaching sign-off.
"""
import time
import uuid
import httpx

BASE='http://127.0.0.1:8181/api/v1'
REASON='B07模拟验收：核对本地演示来源和模板，非真实工程或正式题目签认。'


def main():
    with httpx.Client(base_url=BASE,timeout=30,trust_env=False) as client:
        def call(method,path,body=None,role='admin'):
            r=client.request(method,path,headers={'Authorization':'Bearer dev-'+role,'Idempotency-Key':str(uuid.uuid4())},json=body)
            if r.status_code>=400:raise RuntimeError(f'{method} {path}: {r.status_code} '+r.json().get('message',''))
            return r.json()
        health=call('GET','/health')
        if health['environment']!='development' or health['auth_mode']!='mock':raise RuntimeError('Demo initializer only supports local mock mode')
        def version(d):return {'revision_id':d['revision_id'],'row_version':d['row_version'],'reason':REASON,'evidence_checked':True}
        def wait(path,field,value):
            until=time.monotonic()+45
            while time.monotonic()<until:
                result=call('GET',path)
                if result[field]==value:return result
                if result[field]=='failed':raise RuntimeError('Demo processing failed: '+str(result.get('error','')))
                time.sleep(.2)
            raise RuntimeError('Demo processing did not finish')
        retro=next((r for r in call('GET','/retrospectives?state=approved&limit=100')['items'] if r['project_id']=='demo-airport' and r['mode']=='task_process'),None)
        if not retro:raise RuntimeError('An approved B06 mock task retrospective is required; existing drafts are never automatically approved')
        source=call('GET','/task-packages/'+retro['sources']['task_package_id'])
        if not source.get('is_demo'):raise RuntimeError('Refusing non-demo source')
        generated=call('POST','/retrospectives/'+retro['id']+'/publish-experiences',{**version(retro),'type':'checkpoint_card'})
        kid=generated['draft_ids'][0];card=call('GET','/knowledge/'+kid)
        if card['state']!='approved':
            if card['version']!=1 or not card['content'].get('is_mock') or card['model_ref']!='deterministic-mock-summary-v1':
                raise RuntimeError('Demo knowledge was edited; refusing to replace or approve manual changes')
            if card['state']=='draft':call('POST','/knowledge/'+kid+'/submit-review',version(card))
            card=call('GET','/knowledge/'+kid);call('POST','/reviews/'+card['revision_id']+'/approve',version(card));card=call('GET','/knowledge/'+kid)
        current=call('GET','/knowledge/library?project_id=demo-airport&limit=100')['items']
        revisions=list(dict.fromkeys([c['revision_id'] for c in current]+[card['revision_id']]))
        if card['revision_id'] not in [c['revision_id'] for c in current]:
            release=call('POST','/releases',{'project_id':'demo-airport','revision_ids':revisions})
            ready=wait('/releases/'+release['id'],'state','ready')
            active=call('GET','/releases?project_id=demo-airport')['active_ids']['demo-airport']
            call('POST','/releases/'+ready['id']+'/activate',{'row_version':ready['row_version'],'expected_active_id':active})
        questions=call('POST','/training/questions/generate',{'knowledge_revision_ids':[card['revision_id']],'types':['single_choice','multiple_choice','case_answer']},'teacher')['items']
        legacy=next((c for c in current if c.get('origin_type')!='retrospective'),None)
        if legacy:
            questions+=call('POST','/training/questions/generate',{'knowledge_revision_ids':[legacy['revision_id']],'types':['single_choice','case_answer']},'teacher')['items']
        approved=[]
        for q in questions:
            d=call('GET','/training/questions/'+q['id'],role='teacher')
            if d['state']!='approved':
                if d['version']!=1:raise RuntimeError('A demo question was manually revised; refusing auto approval')
                if d['state']=='draft':call('POST','/training/questions/'+d['id']+'/submit-review',version(d),'teacher')
                d=call('GET','/training/questions/'+d['id'],role='teacher');call('POST','/reviews/'+d['revision_id']+'/approve',version(d),'teacher')
            approved.append(call('GET','/training/questions/'+q['id'],role='teacher')['revision_id'])
        existing=next((p for p in call('GET','/training/packages?limit=100',role='teacher')['items'] if p['package_key']=='b07-local-demo' and p['version']==1),None)
        if existing is None:
            existing=call('POST','/training/packages',{'project_id':'demo-airport','title':'新人风险识别与B06复盘练习（模拟）','package_key':'b07-local-demo','version':1,
                'question_revision_ids':approved,'role_scope':['learner','teacher','admin']},'teacher')
        if existing['state']!='published':
            existing=call('POST','/training/packages/'+existing['id']+'/publish',{'row_version':existing['row_version'],'reason':REASON},'teacher')
        print('B07 simulated package ready:',existing['id'],'questions:',existing['question_count'])
        print('B06 source retrospective:',retro['id'])
        print('No original reports read. No external model called. Demo approvals only.')


if __name__=='__main__':main()
