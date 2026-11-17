"""WM adapter using its real /api/tasks contract, explicit IDs, and durable outbox.

No credentials or task writes are performed merely by importing or starting A.
The operator must explicitly run tools/mobile_services.py against configured services.
"""
import hashlib
import hmac
import json
import os
import time
from urllib.parse import urlsplit, urlencode
from urllib.request import Request, build_opener, ProxyHandler, HTTPRedirectHandler
from urllib.error import HTTPError
import mobile_workflow as mobile
import combined_reports


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs): return None


class BridgeError(Exception):
    pass


def call(actor, method, path, data=None, raw=None, content_type='application/json'):
    base=os.getenv('QAXC_WM_URL','').rstrip('/'); key=os.getenv('QAXC_WM_BRIDGE_KEY','')
    parsed=urlsplit(base)
    if len(key)<32 or parsed.username or parsed.password or parsed.query or parsed.fragment or not parsed.hostname or (parsed.scheme!='https' and not(parsed.scheme=='http' and parsed.hostname in ('127.0.0.1','localhost','::1'))):
        raise BridgeError('老平台互通地址 / 服务密钥尚未配置')
    body=raw if raw is not None else (json.dumps(data,ensure_ascii=False,separators=(',',':')).encode() if data is not None else b'')
    stamp=str(int(time.time()))
    canonical='\n'.join([stamp,actor['id'],method,path,hashlib.sha256(body).hexdigest()]).encode()
    headers={'Content-Type':content_type,'X-Qaxc-Actor':actor['id'],'X-Qaxc-Time':stamp,
             'X-Qaxc-Signature':hmac.new(key.encode(),canonical,hashlib.sha256).hexdigest()}
    try:
        with build_opener(ProxyHandler({}),NoRedirect()).open(Request(base+path,body if method!='GET' else None,headers,method=method),timeout=20) as response:
            value=response.read(10*1024*1024+1)
            if len(value)>10*1024*1024: raise BridgeError('老平台响应过大，请缩小查询范围')
            return json.loads(value)
    except HTTPError as exc:
        raise BridgeError('老平台拒绝同步，HTTP '+str(exc.code)+'；请核对权限、身份和任务修订') from None
    except (OSError,ValueError):
        raise BridgeError('老平台连接或响应异常，已保留待同步任务') from None


def identities():
    mapping=json.loads(os.getenv('QAXC_WM_PERSON_IDS','{}'))
    if any(type(v) is not int or v<=0 for v in mapping.values()) or len(set(mapping.values()))!=len(mapping):
        raise BridgeError('工作量平台人员ID映射无效或重复')
    return mapping


def payload(w,t):
    mapping=identities(); users=t['recognition']['actualIds'] if t.get('recognition') else (t['confirmedIds'] or t['invitedIds'])
    if not users or any(uid not in mapping for uid in users): raise BridgeError('参与人员尚未配置已核验的老平台人员ID')
    config=mobile.setting(w,'project:'+t['projectId'])
    if not config.get('catalogId'): raise BridgeError('项目尚未绑定老平台合同目录ID')
    return dict(client_request_id='qaxc_'+t['id'],work_date=t['workDate'],contract_name=t['title'],
                catalog_id=config['catalogId'],work_type=t['workType'],participant_ids=[mapping[u] for u in users],
                planned_people_count=t['requiredPeople'],service_focus=t['site'],submit=True,
                remark='小察任务 '+t['number']+'；'+mobile.STAGES[t['stage']])


def lock(w):
    if not getattr(w.c,'in_transaction',False): w.c.execute('BEGIN IMMEDIATE')


def save_status(w,tid,status,message=''):
    lock(w)
    t=w.task(tid);t.update(syncStatus=status,syncMessage=message)
    # Integration metadata must not invalidate a user's business-form revision.
    w.c.execute('UPDATE tasks SET payload=? WHERE id=?',(json.dumps(t,ensure_ascii=False),tid))


def sync(w, limit=30):
    jobs=[(row['id'],json.loads(row['payload'])) for row in w.c.execute('SELECT * FROM mobile_outbox')]
    jobs.sort(key=lambda pair:(pair[1]['taskId'],pair[1]['revision']))
    done=0;blocked=set()
    for jid,job in jobs:
        if done>=limit: break
        if job['status']=='done' or job['taskId'] in blocked: continue
        try: task=w.task(job['taskId'])
        except w.s.Problem: continue
        actor=job['actor']; link=mobile.setting(w,'wm:'+task['id'])
        if not job.get('request'):
            try: job['request']=payload(w,job.get('task',task))
            except BridgeError as exc:
                save_status(w,task['id'],'blocked',str(exc));blocked.add(task['id']);continue
            job['stateRevision']=task['revision']
            w.c.execute('UPDATE mobile_outbox SET payload=? WHERE id=?',(json.dumps(job,ensure_ascii=False),jid));w.c.commit()
        try:
            # Recheck local membership before sending a queued mutation under its author.
            from workflow import Workflow
            if w.s.host_auth.enabled(): actor=w.s.host_auth.identity(w.s.host_auth.call('identity',{'id':actor['id']}))
            aw=Workflow(w.s,w.c,actor); mobile.manage(aw,task) if job['revision']==1 else aw.role(task['projectId'])
            if not link.get('taskId'):
                remote=call(actor,'POST','/api/tasks',job['request'])
                link=dict(taskId=remote['id'],revision=remote['revision'])
                mobile.save_setting(w,'wm:'+task['id'],link);w.c.commit()
            else:
                remote=call(actor,'GET','/api/tasks/'+str(link['taskId']))
                if remote['revision']!=link['revision']: raise BridgeError('老平台任务已由其他人调整，请先拉取核对，禁止覆盖')
                values=dict(job['request'],expected_revision=link['revision'])
                values.pop('client_request_id',None)
                remote=call(actor,'PUT','/api/tasks/'+str(link['taskId']),values)
                link['revision']=remote['revision'];mobile.save_setting(w,'wm:'+task['id'],link);w.c.commit()
            lock(w)
            link['syncedRevision']=job['revision'];mobile.save_setting(w,'wm:'+task['id'],link)
            task=w.task(job['taskId'])
            task['legacyTaskId']=link['taskId']
            w.c.execute('UPDATE tasks SET payload=? WHERE id=?',(json.dumps(task,ensure_ascii=False),task['id']))
            job.update(status='done',completedAt=w.s.now());done+=1
            save_status(w,task['id'],'synced','计划及最终名单已同步；成果在工作认定后单独归档')
        except (BridgeError,w.s.Problem,w.s.host_auth.AuthError) as exc:
            job.update(status='failed',attempts=job['attempts']+1,error=str(exc) if isinstance(exc,BridgeError) else exc.message)
            save_status(w,task['id'],'conflict' if '调整' in job['error'] else 'failed',job['error']);blocked.add(task['id'])
        w.c.execute('UPDATE mobile_outbox SET payload=? WHERE id=?',(json.dumps(job,ensure_ascii=False),jid));w.c.commit()
    return dict(synced=done,blocked=len(blocked))


def pull(w, project_id, leader_id, start, end):
    """Import plans from the existing system; never reinterpret already-counted history."""
    w.allow(project_id,['manager']);w.member(project_id,leader_id,['manager','inspector'])
    w.checkdate(start);w.checkdate(end)
    if start>end: w.fail('日期范围无效')
    config=mobile.setting(w,'project:'+project_id)
    if not config.get('catalogId'): raise BridgeError('请先设置老平台合同目录ID')
    reverse={pid:uid for uid,pid in identities().items()};offset=0;created=0;skipped=[]
    while True:
        result=call(w.user,'GET','/api/tasks?'+urlencode(dict(date_from=start,date_to=end,limit=200,offset=offset,include_cancelled='true')))
        items=result['items']
        for remote in items:
            if remote.get('catalog_id')!=config['catalogId'] and remote.get('accounting_catalog_id')!=config['catalogId']: continue
            existing=next((json.loads(row[0]) for row in w.c.execute('SELECT payload FROM tasks WHERE project_id=?',(project_id,)) if json.loads(row[0]).get('legacyTaskId')==remote['id']),None)
            if existing:
                link=mobile.setting(w,'wm:'+existing['id'])
                if link.get('revision')!=remote['revision']: save_status(w,existing['id'],'conflict','老平台任务发生变化，保留本地检查内容，待负责人核对')
                continue
            if remote.get('counts_workload') or remote['status']=='cancelled': continue
            people=[reverse.get(p['id']) for p in remote['participants']]
            if not people or any(not p for p in people): skipped.append(remote['id']);continue
            try:
                for uid in people: w.member(project_id,uid,['manager','inspector'])
            except w.s.Problem: skipped.append(remote['id']);continue
            t=mobile.dispatch(w,'mobile-create',dict(projectId=project_id,leaderId=leader_id,invitedIds=people,
                title=remote['contract_name'],site=remote.get('service_focus') or remote['contract_name'],workDate=remote['work_date'],
                workType=remote['work_type'],requiredPeople=remote['planned_people_count'] or len(people)))
            t.update(legacyTaskId=remote['id'],syncStatus='synced',source='legacy-workload')
            w.c.execute('UPDATE tasks SET payload=? WHERE id=?',(json.dumps(t,ensure_ascii=False),t['id']))
            mobile.save_setting(w,'wm:'+t['id'],dict(taskId=remote['id'],revision=remote['revision']))
            w.c.execute('DELETE FROM mobile_outbox WHERE id=?',(t['id']+':1',));created+=1
        offset+=len(items)
        if len(items)<200: break
    return dict(imported=created,unmappedTaskIds=skipped)


def archive_result(w,tid):
    """Explicit export after recognition. WM's existing evidence/completion rules remain authoritative."""
    t=w.task(tid);mobile.manage(w,t)
    if t['stage']!='recognized': w.fail('工作认定前不能向老平台计入成果',409)
    link=mobile.setting(w,'wm:'+tid)
    if not link.get('taskId') or link.get('syncedRevision',0)<t['revision']: raise BridgeError('请先同步最新工作认定和实际人员名单')
    if link.get('resultStatus') in ('sent','sending','uncertain'): raise BridgeError('成果已发送或结果待核对，不能重复发送')
    report=combined_reports.get(w,t['combinedId']);content=combined_reports.export(w,report)
    remote=call(w.user,'GET','/api/tasks/'+str(link['taskId']))
    if remote['revision']!=link['revision']: raise BridgeError('老平台任务修订变化，须核对后再传成果')
    boundary='qaxc'+w.s.uid();parts=[]
    def field(name,value): parts.append(('--'+boundary+'\r\nContent-Disposition: form-data; name="'+name+'"\r\n\r\n'+str(value)+'\r\n').encode())
    field('expected_revision',link['revision']);field('proof_kind','result')
    filename=t['workDate'].replace('-','')+'_'+tid+'.docx'
    field('original_name',filename)
    parts.append(('--'+boundary+'\r\nContent-Disposition: form-data; name="file"; filename="'+filename+'"\r\nContent-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document\r\n\r\n').encode()+content+b'\r\n')
    parts.append(('--'+boundary+'--\r\n').encode())
    link['resultStatus']='sending';mobile.save_setting(w,'wm:'+tid,link);w.c.commit()
    try:
        result=call(w.user,'POST','/api/tasks/'+str(link['taskId'])+'/evidence',raw=b''.join(parts),content_type='multipart/form-data; boundary='+boundary)
        link.update(resultStatus='sent',resultAt=w.s.now(),revision=result['task']['revision'])
    except BridgeError:
        link['resultStatus']='uncertain';mobile.save_setting(w,'wm:'+tid,link);w.c.commit();raise
    mobile.save_setting(w,'wm:'+tid,link);w.c.commit()
    return dict(ok=True,legacyTaskId=link['taskId'])


def statistics(w, query):
    start=query.get('from',[''])[0];end=query.get('to',[''])[0];scope=query.get('scope',['self'])[0]
    if start: w.checkdate(start)
    if end: w.checkdate(end)
    if start and end and start>end: w.fail('日期范围无效')
    if scope not in ('self','all'): w.fail('统计范围无效')
    if scope=='all' and not w.s.host_auth.is_admin(w.user): w.fail('全部人员统计仅向管理员开放',403)
    params=dict(date_from=start,date_to=end,include_tasks='false')
    if scope=='self':
        pid=identities().get(w.user['id'])
        if not pid: raise BridgeError('当前账号尚未建立老平台人员映射')
        params['person_id']=pid
    return call(w.user,'GET','/api/workload?'+urlencode(params))
