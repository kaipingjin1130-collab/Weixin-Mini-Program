import React, { useEffect, useRef, useState } from 'react';
import { apiFetch } from './platform';

export function ArchiveReview({deliveryId,navigate}:{deliveryId:string;navigate:(path:string)=>void}) {
  const [busy,setBusy]=useState(false),[message,setMessage]=useState('读取固定归档版本并校验证据后，生成待审核复盘。');
  const alive=useRef(true);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false}},[]);
  async function request(path:string,body?:object,key?:string){
    const r=await apiFetch('/api/v1'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(key?{'Idempotency-Key':key}:{})},body:body?JSON.stringify(body):undefined});
    const value=await r.json();if(!r.ok)throw Error(value.message||'处理失败，请重试');return value;
  }
  async function generate(){
    if(busy)return;setBusy(true);
    const storageKey='archive-review:'+deliveryId;
    const key=sessionStorage.getItem(storageKey)||crypto.randomUUID();sessionStorage.setItem(storageKey,key);
    try{
      setMessage('正在核验归档成果…');
      const result=await request('/platform-archives',{delivery_id:deliveryId},key);
      for(let attempt=0;attempt<60&&alive.current;attempt++){
        const detail=await request('/task-packages/'+result.receipt_id);
        if(!alive.current)return;
        if(detail.status==='ready'){
          setMessage('证据已校验，正在生成复盘…');
          const review=await request('/retrospectives',{mode:'task_process',task_package_id:detail.id});
          if(alive.current)navigate('/retrospectives/'+review.id);
          return;
        }
        if(['failed','withdrawn'].includes(detail.status))throw Error('成果处理失败或已撤回，请在成果清单查看原因并重试。');
        setMessage('正在处理成果与证据，离开页面不会取消后台任务…');
        await new Promise(resolve=>setTimeout(resolve,1000));
      }
      if(alive.current)setMessage('成果仍在后台处理。可在成果清单查看进度，稍后再次生成会复用已有接入。');
    }catch(error){if(alive.current)setMessage((error as Error).message)}
    finally{if(alive.current)setBusy(false)}
  }
  return <section className="panel" style={{padding:24}}><h2>归档成果复盘</h2><p role="status" style={{margin:'20px 0'}}>{message}</p><div className="heading-actions"><button className="button primary" disabled={busy} onClick={()=>void generate()}>生成 / 打开复盘</button><button className="button ghost" onClick={()=>navigate('/task-packages')}>成果处理清单</button></div></section>;
}
