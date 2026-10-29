import React, {useEffect, useState} from 'react';
import {apiFetch} from './platform';

type Event = {id:string; action:string; project_id:string; created_at:string; source:string};
export function PlatformServices({navigate}:{navigate:(path:string)=>void}) {
  const [events,setEvents]=useState<Event[]>([]),[error,setError]=useState(''),[online,setOnline]=useState(false);
  useEffect(()=>{
    let stale=false;
    void (async()=>{
      try {
        const [health,logs,work]=await Promise.all([apiFetch('/api/v1/health'),apiFetch('/api/v1/audit-events?limit=50'),fetch('/quality/api/work/state',{credentials:'same-origin'})]);
        if(!health.ok||!logs.ok||!work.ok)throw Error('无法读取运行记录，请确认登录及项目管理权限。');
        const [h,b,a]=await Promise.all([health.json(),logs.json(),work.json()]);
        const project=(window as Window & {QaxcProjectId?:string}).QaxcProjectId;
        const taskEvents=a.tasks.filter((t:any)=>!project||t.projectId===project).flatMap((t:any)=>(t.events||[]).map((e:any)=>({id:e.id,action:t.title+' · '+e.action,project_id:t.projectId,created_at:e.uploadedAt,source:'现场作业'})));
        if(!stale){setOnline(h.worker_online);setEvents([...taskEvents,...b.items.map((e:any)=>({...e,source:'知识与学习'}))].sort((a,b)=>Date.parse(b.created_at)-Date.parse(a.created_at)).slice(0,100))}
      }catch(e){if(!stale)setError((e as Error).message)}
    })();return()=>{stale=true};
  },[]);
  return <section className="panel" style={{padding:24}}><h2>平台运行与操作记录</h2>
    <p role="status">后台处理：{online?'在线':'未连接或正在读取'}。成果接入、知识发布与资料处理共用后台任务队列。</p>
    <div className="heading-actions" style={{margin:'20px 0',flexWrap:'wrap'}}><button className="button primary" onClick={()=>navigate('/jobs')}>处理任务与重试</button><button className="button ghost" onClick={()=>navigate('/settings/models')}>模型配置</button><button className="button ghost" onClick={()=>navigate('/task-packages')}>成果与证据</button></div>
    {error?<p role="alert">{error}</p>:<><h3>最近操作</h3><p className="small-note">合并显示当前项目范围内的作业和知识记录；原始记录仍可在对应成果中追溯。</p>{events.length?<div className="table-wrap"><table><thead><tr><th>时间</th><th>业务</th><th>操作</th></tr></thead><tbody>{events.map(e=><tr key={e.source+e.id}><td>{new Date(e.created_at).toLocaleString('zh-CN')}</td><td>{e.source}</td><td>{e.action}</td></tr>)}</tbody></table></div>:<p>暂无操作记录。</p>}</>}
  </section>;
}
