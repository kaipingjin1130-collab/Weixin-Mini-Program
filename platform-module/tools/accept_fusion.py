"""Repeatable HTTP acceptance against fusion_runtime.py unified + worker only.

Creates explicitly labelled test projects. Never accepts a production URL,
credentials, or direct database access. Test reviews are not engineering advice.
"""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
from pathlib import Path
import time
from uuid import uuid4
import httpx

BASE = 'http://127.0.0.1:18771/quality'
OUT = Path(__file__).resolve().parents[2] / '.local/fusion-integration/acceptance.json'
checks = []


class Client:
    def __init__(self, username='fusion'):
        self.http = httpx.Client(base_url=BASE, timeout=45, trust_env=False)
        login = self.call('POST', '/api/login', {'username': username, 'password': 'fusion-test-only'})
        # Exercise browser-style cookies; bearer auth hid a Secure-on-HTTP bug.
        assert any(c.name == 'qaxc_fusion_session' and not c.secure for c in self.http.cookies.jar)
        user = login['user']
        assert user['name'].startswith('融合验收'), 'This is not the isolated fixture runtime'
        self.csrf = self.call('GET', '/api/csrf-token')['csrf_token']

    def call(self, method, path, data=None, expect=200, key=None, project=None):
        headers = {'X-CSRF-Token': self.csrf} if hasattr(self, 'csrf') else {}
        if key:
            headers['Idempotency-Key'] = key
        if project:
            headers['X-Project-ID'] = project
        response = self.http.request(method, BASE + path, json=data, headers=headers)
        assert response.status_code == expect, (method, path, response.status_code, response.text[:700])
        return response.json()

    def b(self, method, path, data=None, **kw):
        return self.call(method, '/b/api/v1' + path, data, **kw)

    def work(self, action, **data):
        return self.call('POST', '/api/work/' + action, {**data, 'requestId': str(uuid4())})


def passed(name):
    checks.append(name)
    print('PASS ' + name, flush=True)


def wait(client, path, field, value):
    end = time.monotonic() + 50
    while time.monotonic() < end:
        data = client.b('GET', path)
        if data[field] == value:
            return data
        assert data[field] != 'failed', data
        time.sleep(.25)
    raise AssertionError(('Timed out', path, data.get(field)))


def version(data, **extra):
    return {'revision_id': data['revision_id'], 'row_version': data['row_version'], 'reason': '隔离验收核对', **extra}


def main():
    c, member = Client(), Client('fusion-member')
    health = c.b('GET', '/health')
    assert health['auth_mode'] == 'a' and health['environment'] == 'development' and health['worker_online']
    assert c.http.get('http://127.0.0.1:18771/__knowledge/api/v1/health').status_code == 404
    assert httpx.get(BASE+'/b/api/v1/me', trust_env=False).status_code == 401
    assert c.http.post(BASE+'/b/api/v1/retrospectives', json={}).status_code == 403
    passed('统一入口、共享身份、内部路由与写入校验')

    with ThreadPoolExecutor(max_workers=20) as pool:
        results = list(pool.map(lambda _: c.b('GET', '/me')['name'], range(20)))
    assert all(n == '融合验收测试管理员' for n in results)
    passed('20 个并发身份回调无死锁')

    project = c.call('POST','/api/projects',{'name':'融合验收-'+uuid4().hex[:8], 'contract':'隔离验收合同'})['id']
    c.b('GET','/me',project='not-authorized',expect=403)
    assert [p['id'] for p in c.b('GET','/me',project=project)['projects']] == [project]
    member.b('GET','/me',project=project,expect=403)
    c.work('members',projectId=project,userId='host:admin:900002',role='manager')
    assert member.b('GET','/me',project=project)['projects'][0]['can_run']
    c.work('members',projectId=project,userId='host:admin:900002',role='inspector')
    assert not member.b('GET','/me',project=project)['projects'][0]['can_run']
    member.b('POST','/retrospectives',{'mode':'task_process','task_package_id':str(uuid4())},expect=404)
    passed('项目范围收窄、越权拒绝与角色撤权即时生效')

    scenario = next(s for s in c.call('GET','/api/work/state')['scenarios'] if s['id']=='inspection')
    task = c.work('adhoc-tasks',projectId=project,scenarioId='inspection',title='隔离验收巡查归档',
        object='验收区域',dueDate='2026-11-30',fields={f:'隔离测试' for f in scenario['fields']})
    task_id = task['id']
    empty = c.work('knowledge',taskId=task_id,question='巡查证据')
    assert empty['status']=='insufficient_evidence' and empty['items']==[]
    c.work('start',taskId=task_id,revision=task['revision'],checklist=scenario['checklist'])
    image = c.work('upload',projectId=project,name='test-signature.png',occurredAt=datetime.now(timezone.utc).isoformat(),
        base64='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZ1kAAAAASUVORK5CYII=')
    def action(name, **data):
        current = next(t for t in c.call('GET','/api/work/state')['tasks'] if t['id']==task_id)
        return c.work(name,taskId=task_id,revision=current['revision'],**data)
    action('submit-field',noHazard=True,text='隔离测试现场记录，无真实工程数据',inspectors='测试检查人',signer='测试检查人',signature=image['id'])
    action('receive-field',decision='accept',text='验收接收',receiverName='测试接收人')
    action('deliver',text='隔离测试正式成果')
    action('accept',decision='accept',text='验收接收确认')
    archived = action('archive')
    delivery = archived['deliveries'][-1]['id']
    package_bytes = c.http.get(BASE+'/api/work/package/'+delivery)
    assert package_bytes.status_code==200 and package_bytes.content.startswith(b'PK')
    passed('巡查、签名证据、现场接收、正式成果与归档下载')

    member.b('POST','/platform-archives',{'delivery_id':delivery},key=str(uuid4()),expect=403)
    key = str(uuid4())
    receipt = c.b('POST','/platform-archives',{'delivery_id':delivery},key=key,expect=202)
    repeated = c.b('POST','/platform-archives',{'delivery_id':delivery},key=key,expect=202)
    assert receipt['receipt_id']==repeated['receipt_id'] and repeated['replayed']
    package = wait(c,'/task-packages/'+receipt['receipt_id'],'status','ready')
    retro = c.b('POST','/retrospectives',{'mode':'task_process','task_package_id':package['id']})
    repeat = c.b('POST','/retrospectives',{'mode':'task_process','task_package_id':package['id']})
    assert retro['id']==repeat['id']
    passed('归档接入、证据处理、复盘生成与重复操作幂等')

    path = '/retrospectives/'+retro['id']
    detail = c.b('GET',path)
    findings, suggestions = detail['findings'], detail['suggestions']
    for row in findings+suggestions:
        row['review_state']='confirmed'
    c.b('PATCH',path+'/draft',version(detail,summary=detail['summary'],findings=findings,suggestions=suggestions))
    detail=c.b('GET',path)
    c.b('POST',path+'/submit-review',version(detail))
    detail=c.b('GET',path)
    c.b('POST','/reviews/'+detail['revision_id']+'/approve',version(detail,evidence_checked=True))
    detail=c.b('GET',path)
    converted=c.b('POST',path+'/publish-experiences',version(detail))
    kid=converted['draft_ids'][0]
    card=c.b('GET','/knowledge/'+kid)
    c.b('POST','/knowledge/'+kid+'/submit-review',version(card))
    card=c.b('GET','/knowledge/'+kid)
    c.b('POST','/reviews/'+card['revision_id']+'/approve',version(card,evidence_checked=True))
    card=c.b('GET','/knowledge/'+kid)
    release=c.b('POST','/releases',{'project_id':project,'revision_ids':[card['revision_id']]},key=str(uuid4()),expect=202)
    release=wait(c,'/releases/'+release['id'],'state','ready')
    c.b('POST','/releases/'+release['id']+'/activate',{'row_version':release['row_version'],'expected_active_id':None})
    c.b('GET','/published/knowledge/'+kid)
    answer=c.work('knowledge',taskId=task_id,question='巡查 归档 现场记录')
    assert answer['status']=='answered' and answer['items'] and answer['citations'] and answer['requiresConfirmation']
    assert answer['knowledge_release_id']==release['id']
    passed('复盘审核、知识审核发布、作业查询返回固定版本与引用')

    generated=c.b('POST','/training/questions/generate',{'knowledge_revision_ids':[card['revision_id']],'types':['single_choice']})
    questions=[]
    for item in generated['items']:
        q=c.b('GET','/training/questions/'+item['id'])
        c.b('POST','/training/questions/'+q['id']+'/submit-review',version(q))
        q=c.b('GET','/training/questions/'+q['id'])
        c.b('POST','/reviews/'+q['revision_id']+'/approve',version(q,evidence_checked=True))
        questions.append(c.b('GET','/training/questions/'+q['id']))
    lesson=c.b('POST','/training/packages',{'project_id':project,'title':'隔离验收学习包','package_key':'fusion-'+uuid4().hex,'version':1,
        'question_revision_ids':[q['revision_id'] for q in questions],'role_scope':['learner','admin']})
    c.b('POST','/training/packages/'+lesson['id']+'/publish',{'row_version':lesson['row_version'],'reason':'隔离验收'})
    attempt=member.b('POST','/training/attempts',{'package_version_id':lesson['id'],'grading_mode':'rules'},key=str(uuid4()))
    student=member.b('GET','/training/attempts/'+attempt['id'])
    assert all('answer' not in q and 'rubric' not in q for q in student['questions'])
    for q in questions:
        member.b('PUT',f"/training/attempts/{attempt['id']}/answers/{q['id']}",{'row_version':0,'selected':q['content']['answer'].get('selected',[]),'text':''})
    student=member.b('GET','/training/attempts/'+attempt['id'])
    member.b('POST','/training/attempts/'+attempt['id']+'/submit',{})
    passed('已发布知识生成审核题目、学习包发布、普通成员作答提交')

    assert c.b('GET','/audit-events?limit=100',project=project)['items']
    action('reopen',text='隔离验收来源补正与失效检查')
    c.b('GET',path,expect=410)
    c.b('GET','/published/knowledge/'+kid,expect=410)
    after=c.work('knowledge',taskId=task_id,question='巡查 归档 现场记录')
    assert after['status']=='insufficient_evidence' and not after['items']
    passed('来源补正后复盘、已发布知识与作业查询实时失效')
    member.call('POST','/api/logout',{})
    member.b('GET','/me',expect=401)
    passed('统一退出后知识接口拒绝旧会话')
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps({'checked_at':datetime.now(timezone.utc).isoformat(),'checks':checks,
        'project_id':project,'task_id':task_id,'delivery_id':delivery,'retrospective_id':retro['id'],
        'knowledge_id':kid,'release_id':release['id'],'learning_package_id':lesson['id'],
        'identity':'labelled fixture; actual business services/database/queue','model':'deterministic local fixture; no cloud model accuracy claim'},ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'{len(checks)} acceptance groups passed',flush=True)


if __name__=='__main__':
    main()
