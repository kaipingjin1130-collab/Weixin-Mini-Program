import React, { useEffect, useState } from 'react';
import { apiFetch } from './platform';
import './a-import.css';

type ImportState = {
  import_id: string; version: number; project_id: string; task_id: string;
  delivery_id: string; delivery_version: number; status: string;
  receipt_id: string | null; retrospective_id: string | null; retrospective_status: string;
  warnings: {code: string; path: string; message: string}[]; missing_fields: string[];
  capabilities: {can_view_materials: boolean; can_generate_retrospective: boolean; evidence_complete: boolean};
  error: {message: string} | null;
};
const labels: Record<string, string> = {queued:'等待处理',fetching:'正在取件',validating:'正在校验',processing:'正在处理',ready:'已完成',failed:'处理失败',withdrawn:'已撤回',not_created:'尚未生成'};

export function AImport({id, identity, projects, navigate}: {
  id: string; identity: string; projects: {id: string; permissions?: string[]}[]; navigate: (path: string) => void;
}) {
  const [value,setValue] = useState<ImportState | null>(null);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const [reason,setReason] = useState('');
  const [reload,setReload] = useState(0);
  const storageKey = `a-import-action:${identity}:${id}`;
  async function request(path: string, init?: RequestInit) {
    const response = await apiFetch('/integration/v1/a-imports/'+id+path,init);
    const body = await response.json().catch(()=>({}));
    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) sessionStorage.removeItem(storageKey);
      throw new Error(body.message || `请求未完成（${response.status}），请刷新查看最新状态。`);
    }
    return body;
  }
  useEffect(()=> {
    let cancelled=false;
    async function load() {
      try {const result=await request('');if(!cancelled){setValue(result);setError('');}}
      catch(e){if(!cancelled){setValue(null);setError((e as Error).message);}}
    }
    setValue(null);void load();
    const timer=window.setInterval(load,3000);
    return ()=>{cancelled=true;clearInterval(timer);};
  },[id,reload,identity]);
  const can=(action:string)=>!!value && !!projects.find(p=>p.id===value.project_id)?.permissions?.includes(action);
  async function act(operation: string) {
    if (!value || busy) return;
    setBusy(true);setError('');
    try {
      const saved=sessionStorage.getItem(storageKey);
      const pending=saved ? JSON.parse(saved) : {operation,key:crypto.randomUUID(),body:{expected_version:value.version,...(operation==='withdraw'?{reason:reason.trim()}:{})}};
      if(pending.operation!==operation) throw new Error('上一次操作结果尚未确认，请先重试该操作或刷新核对状态。');
      sessionStorage.setItem(storageKey,JSON.stringify(pending));
      await request('/'+operation,{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':pending.key},body:JSON.stringify(pending.body)});
      sessionStorage.removeItem(storageKey);setReload(v=>v+1);
    } catch(e){setError((e as Error).message);} finally{setBusy(false);}
  }
  return <section className="panel a-import-detail">
    <div className="panel-heading"><h2>成果处理状态</h2><button className="button ghost" onClick={()=>setReload(v=>v+1)} disabled={busy}>刷新状态</button></div>
    <div className="a-import-body">
    <p>指定成果版本的接入与复盘进度。历史资料批次仍保留在“历史资料”中。</p>
    {error && <p role="alert" className="feedback error">{error}</p>}
    {!value ? <p>{error?'当前接入暂不可读取，请根据提示处理后刷新。':'正在读取成果接入状态…'}</p> : <>
      <dl className="a-import-status"><div><dt>成果版本</dt><dd>v{value.delivery_version}</dd></div><div><dt>接入状态</dt><dd>{labels[value.status]||value.status}</dd></div>
        <div><dt>复盘状态</dt><dd>{labels[value.retrospective_status]||value.retrospective_status}</dd></div></dl>
      <p><strong>证据完整性：</strong>{value.capabilities.evidence_complete?'已通过附件校验':'存在缺失或尚未完成校验'}</p>
      {value.error && <p role="alert">{value.error.message}</p>}
      {value.warnings.length>0 && <><h3>资料提示</h3><ul>{value.warnings.map((w,i)=><li key={w.code+':'+i}>{w.message}</li>)}</ul></>}
      {value.missing_fields.length>0 && <p>存在 {value.missing_fields.length} 项资料缺失。未知实际时间保持未知，缺少照片不补造证据。</p>}
      <div className="a-import-actions">
      {value.capabilities.can_view_materials && value.receipt_id && can('imports.read') && <button className="button secondary" onClick={()=>navigate('/task-packages/'+value.receipt_id)}>查看原始资料</button>}
      {value.capabilities.can_generate_retrospective && can('retrospective.generate') && <button className="button secondary" disabled={busy} onClick={()=>void act('retrospectives')}>{value.retrospective_status==='not_created'?'生成复盘':'确认复盘状态'}</button>}
      {value.retrospective_id && value.status!=='withdrawn' && can('retrospective.read') && <button className="button primary" onClick={()=>navigate('/retrospectives/'+value.retrospective_id)}>查看复盘</button>}
      {(value.status==='failed'||value.retrospective_status==='failed') && can('imports.retry') && <button className="button primary" disabled={busy} onClick={()=>void act('retry')}>重试失败任务</button>}
      </div>
      {value.status!=='withdrawn' && can('imports.withdraw') && <div className="a-import-withdraw"><label>撤回原因<input value={reason} placeholder="填写需要停止使用本次接入的原因" maxLength={2000} onChange={e=>setReason(e.target.value)}/></label><button className="button ghost" disabled={busy||!reason.trim()} onClick={()=>void act('withdraw')}>撤回 B 接入</button><p>撤回后停止使用本次接入；A 原归档保留。</p></div>}
    </>}
    </div>
  </section>;
}
