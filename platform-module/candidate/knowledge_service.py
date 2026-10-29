"""Published knowledge bridge. Call only after releasing the A database transaction."""
import json
import os
from urllib.request import Request, build_opener, ProxyHandler
from urllib.error import HTTPError, URLError
from ab_gateway import NoRedirect

def query(task, question, request_id, session, problem):
    base,key=os.getenv('QAXC_B_URL',''),os.getenv('A_TO_B_KEY','')
    if not base or not key:
        raise problem('知识服务尚未配置',503)
    payload={'request_id':request_id,'project_id':task['projectId'],'task_id':task['id'],
        'question':question,'scenario_id':task['scenario']['id'],'scenario_version':task['scenario']['version'],
        'object':task['object'],'stage':'execution','conditions':{}}
    request=Request(base.rstrip('/')+'/integration/v1/a-knowledge/query',json.dumps(payload).encode(),
        {'Authorization':'Bearer '+key,'X-AB-Session':session,'Content-Type':'application/json','X-Request-ID':request_id},method='POST')
    try:
        with build_opener(ProxyHandler({}),NoRedirect()).open(request,timeout=15) as response:
            raw=response.read(1024*1024+1)
        if len(raw)>1024*1024: raise ValueError('response too large')
        value=json.loads(raw)
        if value.get('status') not in {'answered','insufficient_evidence','degraded'} or not isinstance(value.get('items'),list):
            raise ValueError('invalid response')
        if any(not isinstance(item,dict) or any(not isinstance(item.get(k),str) for k in ('title','text','reference')) for item in value['items']):
            raise ValueError('invalid item')
        value['version']=value.get('knowledge_release_id')
        value['requiresConfirmation']=True
        value['message']='查询结果来自已发布知识，使用前请核对来源。' if value['status']=='answered' else '当前已发布知识不足，请补充条件或核查来源。'
        return value
    except HTTPError as exc:
        raise problem('知识服务拒绝访问或暂不可用',exc.code if exc.code in (401,403,422) else 503)
    except (URLError,TimeoutError,ValueError,TypeError):
        raise problem('知识服务暂不可用，请稍后重试',503)
