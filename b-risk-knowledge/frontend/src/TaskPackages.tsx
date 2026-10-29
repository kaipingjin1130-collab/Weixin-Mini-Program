import { apiFetch, inPlatform } from './platform';
import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileInput, RefreshCw, Upload } from 'lucide-react';
import './task-packages.css';

type Project={id:string;name:string;roles:string[];can_run:boolean;can_manage:boolean};
type Notice={code:string;message:string;path:string};
type Package={id:string;name:string;producer:string;task_id:string;package_version:number;project_id:string;status:string;
  is_current:boolean;retrospective_id?:string|null;is_demo:boolean;created_at:string;capabilities:string[];warnings:Notice[];missing_fields:string[];
  latest_received_version:number;current_ready_version:number;current_package_id:string|null};
type Event={event_id:string;event_type:string;occurred_at:string|null;actor:{actor_id:string|null;actor_role:string};payload:object;related_object_id?:string;evidence_refs:string[];is_known:boolean};
type Attachment={attachment_id:string;state:string;error:string|null;evidence_type:string;mime_type:string;size:number;asset_id:string|null;event_ids:string[];issue_ids:string[]};
type Detail=Package&{snapshot_available:boolean;task?:{name:string;status:string;started_at:string|null;completed_at:string|null};
  participants?:{actor_id:string;role:string}[];issues?:{issue_id:string;description:string;rectification:string|null;review_conclusion:string|null;status:string;responsible_actor_id:string|null;due_at:string|null}[];
  events?:Event[];event_next?:number|null;attachments?:Attachment[];job_id:string;job_row_version:number;progress:number;job_status:string;
  validation_errors:Notice[];versions?:{id:string;package_version:number;state:string;is_current:boolean}[];
  diff?:{previous_version?:number;changes:{section:string;before?:unknown;after?:unknown;added?:string[];removed?:string[];changed?:{id:string;before:object;after:object}[];counts?:object;order_changed?:boolean;before_order?:string[];after_order?:string[]}[]};
  invalidations:{id:string;state:string;pending_consumers:string[]}[]};
type Preview={is_demo:boolean;name:string;task_id:string;project_id:string;package_version:number;content_hash:string;counts:Record<string,number>;warnings:string[];note:string};
const labels:Record<string,string>={received:'已接收',validating:'校验中',processing:'处理中',ready:'处理完成',failed:'处理失败',withdrawn:'已撤回',verified:'校验通过',pending:'待校验',unavailable:'当前不可用'};
const events:Record<string,string>={task_started:'任务开始',inspection_recorded:'现场检查记录',issue_created:'提出问题',rectification_submitted:'提交整改',review_rejected:'复核退回',review_accepted:'复核通过',task_completed:'任务完成'};
const sections:Record<string,string>={task:'任务资料',participants:'参与人员',events:'过程事件',issues:'问题与整改',attachments:'证据附件',event_times:'实际时间',data_completeness:'资料完整性',scene_code:'作业场景',extensions:'扩展资料'};
const caps:Record<string,string>={historical_summary:'可供历史资料复盘',partial_timeline:'只能还原部分过程',complete_timeline:'具备完整时间线输入条件'};
const evidenceTypes:Record<string,string>={site_photo:'现场照片',text_screenshot:'文字截图',source_document:'原始文档',video:'视频',other:'其他资料',unknown:'类型未确认'};
const roleLabel=(value:string)=>({supervisor:'监护人员',contractor:'整改责任方',inspector:'检查人员',reviewer:'复核人员'}[value]||value);
const fmt=(value:string|null|undefined)=>value?new Date(value).toLocaleString('zh-CN'):'实际时间未提供';
const pretty=(value:unknown)=>JSON.stringify(value,null,2);
const fieldLabels:Record<string,string>={due_at:'整改期限',status:'状态',issue_id:'问题编号',description:'问题描述',evidence_refs:'证据编号',rectification:'整改说明',review_conclusion:'复核结论',responsible_actor_id:'责任方',event_type:'事件类型',occurred_at:'实际时间',actor_id:'人员编号',actor_role:'人员角色',payload:'补充信息',note:'说明',related_object_id:'对应对象',event_id:'事件编号',name:'任务名称',started_at:'开始时间',completed_at:'结束时间',attachment_id:'附件编号',mime_type:'文件类型',size:'文件字节数',evidence_type:'证据类型',sha256:'内容校验值'};
function diffText(value:unknown,key=''):string{
  if(value===null||value===undefined)return '未提供';
  if(Array.isArray(value))return value.every(v=>typeof v!=='object')?value.join('、'):value.map((v,i)=>`第${i+1}条\n${diffText(v)}`).join('\n\n');
  if(typeof value==='object')return Object.entries(value as Record<string,unknown>).map(([k,v])=>`${fieldLabels[k]||sections[k]||k}：${diffText(v,k)}`).join('\n');
  if(typeof value==='string'){
    if(['due_at','occurred_at','started_at','completed_at'].includes(key))return fmt(value);
    if(key==='actor_role'||key==='role')return roleLabel(value);
    if(key==='event_type')return events[value]||value;
    if(key==='evidence_type')return evidenceTypes[value]||value;
    if(key==='status')return ({closed:'已闭环',open:'未整改',rectifying:'整改中',pending_review:'待复核',completed:'已完成',cancelled:'已取消',archived:'已归档'}[value]||value);
  }
  return String(value);
}
const eventDescription=(payload:object)=>{const note=(payload as Record<string,unknown>).note;return typeof note==='string'?note:Object.keys(payload).length?pretty(payload):'未补充说明';};

export function TaskPackages({identity,path,projects,navigate}:{identity:string;path:string;projects:Project[];navigate:(url:string)=>void}) {
  const importing=path==='/task-packages/import';const ident=!importing&&path!=='/task-packages'?path.split('/')[2]:null;
  const [project,setProject]=useState(projects[0]?.id||'');const [filter,setFilter]=useState('');
  const [items,setItems]=useState<Package[]>([]);const [detail,setDetail]=useState<Detail|null>(null);
  const [cursor,setCursor]=useState('');const [next,setNext]=useState<string|null>(null);const [history,setHistory]=useState<string[]>([]);
  const [archives,setArchives]=useState<{id:string;title:string;project_id:string;version:number}[]>([]);
  const [samples,setSamples]=useState<{id:string;label:string}[]>([]);const [scenario,setScenario]=useState('complete');
  const [group,setGroup]=useState(()=>sessionStorage.getItem('b05-demo-task:'+identity)||'demo-task-'+crypto.randomUUID().slice(0,8));
  const [body,setBody]=useState('');const [preview,setPreview]=useState<Preview|null>(null);
  const [error,setError]=useState('');const [notice,setNotice]=useState('');const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);const [refresh,setRefresh]=useState(0);
  const [reason,setReason]=useState('');const [opened,setOpened]=useState<{id:string;url:string|null;text:string|null}|null>(null);
  const keys=useRef<{hash:string;key:string}|null>(null);const withdrawKey=useRef<{body:string;key:string}|null>(null);
  const scope=useRef('');scope.current=[identity,path,project,scenario,group,body].join('|');
  const canImport=projects.find(p=>p.id===project)?.can_run;
  const canWithdraw=detail&&projects.find(p=>p.id===detail.project_id)?.roles.some(r=>['admin','reviewer'].includes(r));
  const canRetry=detail&&projects.find(p=>p.id===detail.project_id)?.can_run;
  async function api<T>(url:string,init:RequestInit={}):Promise<T>{const response=await apiFetch('/api/v1/task-packages'+url,{...init,
    headers:{'Content-Type':'application/json',Authorization:`Bearer dev-${identity}`,...init.headers}});
    const result=await response.json().catch(()=>({}));if(!response.ok)throw new Error(result.message||'接入服务暂未就绪，请稍后刷新。');return result;}
  const action=async(fn:()=>Promise<void>)=>{setBusy(true);setError('');setNotice('');try{await fn();}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  useEffect(()=>{sessionStorage.setItem('b05-demo-task:'+identity,group);},[group,identity]);
  useEffect(()=>()=>{if(opened?.url)URL.revokeObjectURL(opened.url);},[opened?.url]);
  useEffect(()=>{setCursor('');setHistory([]);setError('');setNotice('');setOpened(null);setReason('');setPreview(null);},[path,project,filter]);
  useEffect(()=>{
    let stale=false;setLoading(true);setDetail(null);setError('');
    const load=async()=>{try{
      if(importing && inPlatform){const response=await apiFetch('/api/v1/platform-archives');const data=await response.json();if(!response.ok)throw new Error(data.message);if(!stale)setArchives(data.items);}
      else if(importing){const data=await api<{items:{id:string;label:string}[]}>('/samples');if(!stale)setSamples(data.items);}
      else if(ident){const data=await api<Detail>('/'+ident);if(!stale)setDetail(data);}
      else{const data=await api<{items:Package[];next_cursor:string|null}>(`?project_id=${project}${filter?'&state='+filter:''}${cursor?'&cursor='+encodeURIComponent(cursor):''}`);if(!stale){setItems(data.items);setNext(data.next_cursor);}}
    }catch(e){if(!stale)setError((e as Error).message);}finally{if(!stale)setLoading(false);}};
    void load();return()=>{stale=true;};
  },[path,project,filter,cursor,refresh]);
  useEffect(()=>{
    if(inPlatform||!importing||!canImport)return;let stale=false;setPreview(null);setBody('');
    const task=group+'.'+(scenario==='v2'?'complete':scenario);
    void api<object>(`/samples/${scenario}?project_id=${project}&task_id=${task}`).then(data=>{if(!stale)setBody(JSON.stringify(data,null,2));}).catch(e=>{if(!stale)setError(e.message);});
    return()=>{stale=true;};
  },[importing,project,scenario,group]);
  useEffect(()=>{
    const pending=(detail&&['received','validating','processing'].includes(detail.status))||(!ident&&items.some(i=>['received','validating','processing'].includes(i.status)));
    if(!pending||importing)return;const timer=setInterval(()=>setRefresh(v=>v+1),1800);return()=>clearInterval(timer);
  },[detail?.status,items,path]);
  const preflight=()=>action(async()=>{const before=scope.current;setPreview(null);const data=await api<Preview>('/preview',{method:'POST',body});if(scope.current===before)setPreview(data);});
  const submit=()=>action(async()=>{if(!preview)return;if(keys.current?.hash!==preview.content_hash)keys.current={hash:preview.content_hash,key:crypto.randomUUID()};
    const data=await api<{receipt_id:string;replayed:boolean}>('',{method:'POST',headers:{'Idempotency-Key':keys.current.key},body});
    setNotice(data.replayed?'已找到相同任务包，复用原接收记录。':'任务包已接收，后台将自动校验附件。');navigate('/task-packages/'+data.receipt_id);});
  const openAsset=(a:Attachment)=>action(async()=>{const before=scope.current;setOpened(null);const response=await apiFetch(`/api/v1/task-packages/${ident}/assets/${a.attachment_id}/content`,{headers:{Authorization:`Bearer dev-${identity}`}});
    if(!response.ok){const value=await response.json().catch(()=>({}));throw new Error(value.message||'附件服务暂不可用，请稍后重试。');}const blob=await response.blob();if(before!==scope.current)return;
    if(a.mime_type.startsWith('text/')){const text=await blob.slice(0,1000000).text();if(before===scope.current)setOpened({id:a.attachment_id,url:null,text});}
    else if(a.mime_type.startsWith('image/'))setOpened({id:a.attachment_id,url:URL.createObjectURL(blob),text:null});
    else{const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='任务附件';link.click();URL.revokeObjectURL(url);}});
  const pages=<div className="panel-footer"><span>仅展示当前授权项目</span><div className="pagination"><button disabled={!history.length||loading} onClick={()=>{setCursor(history.at(-1)||'');setHistory(history.slice(0,-1));}}>上一页</button><button disabled={!next||loading} onClick={()=>{setHistory([...history,cursor]);setCursor(next||'');}}>下一页</button></div></div>;
  if(!projects.length)return <section className="panel empty"><h2>当前没有可用项目</h2><p>请刷新以重新加载授权范围，或核对当前身份权限。</p></section>;
  return <div className="task-packages-module">
    <div className="ingest-banner"><FileInput size={21}/><div><strong>{inPlatform ? "小察归档成果接入" : "A任务包接入 · 模拟数据"}</strong><span>保留任务、事件、问题和附件的归档版本。补正或更新后的旧成果停止使用；缺失信息不会自动补全。</span></div></div>
    <div className="ingest-toolbar"><div className="ingest-tabs"><button className={!importing?'selected':''} onClick={()=>navigate('/task-packages')}>任务包清单</button>{projects.some(p=>p.can_run)&&<button className={importing?'selected':''} onClick={()=>navigate('/task-packages/import')}>接入归档成果</button>}</div><button className="button ghost" onClick={()=>{setOpened(null);setRefresh(v=>v+1);}}><RefreshCw size={15}/>刷新</button></div>
    {error&&<div className="feedback error" role="alert"><AlertCircle size={18}/>{error}</div>}{notice&&<div className="feedback success" role="status"><CheckCircle2 size={18}/>{notice}</div>}
    {!ident&&<div className="package-filters"><label>项目范围<select aria-label="任务包项目" value={project} onChange={e=>setProject(e.target.value)}>{projects.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>{!importing&&<label>接入状态<select aria-label="任务包状态" value={filter} onChange={e=>setFilter(e.target.value)}><option value="">全部状态</option>{['received','validating','processing','ready','failed','withdrawn'].map(s=><option key={s} value={s}>{labels[s]}</option>)}</select></label>}</div>}
    {loading?<div className="loading">正在读取任务包…</div>:importing?!canImport?<section className="panel empty"><h2>当前项目没有导入权限</h2></section>:inPlatform?<section className="panel package-import"><div className="panel-heading"><h2>选择当前项目已归档成果</h2><span>自动接入已有记录和附件，无需重复填写</span></div><div className="package-import-inner">{archives.filter(a=>a.project_id===project).map(a=><article key={a.id}><h3>{a.title} · 第{a.version}版</h3><button className="button primary" disabled={busy} onClick={()=>void action(async()=>{const response=await apiFetch('/api/v1/platform-archives',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({delivery_id:a.id})});const data=await response.json();if(!response.ok)throw new Error(data.message);navigate('/task-packages/'+data.receipt_id);})}>接入此成果</button></article>)}{!archives.some(a=>a.project_id===project)&&<p>当前项目没有已归档成果，请先在小察任务工作台完成接收与归档。</p>}</div></section>:<>
      <section className="panel package-import"><div className="panel-heading"><h2>选择演示数据</h2><span>无需重复填写已有任务、人员与事件</span></div><div className="package-import-inner"><label>模拟场景<select aria-label="模拟任务场景" value={scenario} onChange={e=>setScenario(e.target.value)}>{samples.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></label><p>完整包与第2版属于同一模拟任务，便于验证版本更新；其他异常场景分别保存。重复导入相同内容会复用原记录。</p><button className="button ghost" disabled={busy} onClick={()=>setGroup('demo-task-'+crypto.randomUUID().slice(0,8))}>换一组新的模拟任务</button><label className="package-file">或选择本地JSON任务包<input type="file" accept=".json,application/json" disabled={busy} onChange={e=>{const file=e.target.files?.[0];if(!file)return;if(file.size>5242880){setError('文件超过5MiB上限。');return;}void file.text().then(text=>{setBody(text);setPreview(null);setError('');});}}/></label><details><summary>查看或调整原始任务包（开发用）</summary><textarea aria-label="任务包JSON" rows={15} value={body} onChange={e=>{setBody(e.target.value);setPreview(null);}} spellCheck={false}/></details><div className="package-actions"><button className="button ghost" disabled={busy||!body} onClick={()=>void preflight()}>预检查</button><button className="button primary" disabled={busy||!preview} onClick={()=>void submit()}><Upload size={16}/>{busy?'正在处理…':'确认接入归档成果'}</button></div></div></section>
      {preview&&<section className="panel package-preview"><h2>{preview.name} · 第{preview.package_version}版</h2><p>归属项目：{projects.find(p=>p.id===preview.project_id)?.name||preview.project_id}</p><div>{Object.entries(preview.counts).map(([k,n])=><span key={k}>{sections[k]} <strong>{n}</strong></span>)}</div><p>{preview.note}</p>{preview.warnings.length>0&&<p>检测到缺少时间、资料或兼容性提示；接收后会保留并限制使用范围。</p>}</section>}
    </>:!ident?<section className="panel"><div className="panel-heading"><h2>接收与版本记录</h2><span>新包接收后，不会立即替换当前可用包</span></div>{items.length?<div className="table-wrap"><table><thead><tr><th>任务 / 来源</th><th>包版本</th><th>状态</th><th>当前可用</th><th>资料提示</th></tr></thead><tbody>{items.map(p=><tr key={p.id}><td><button className="job-title" onClick={()=>navigate('/task-packages/'+p.id)}>{p.name}</button><small>{p.producer} · {p.task_id}</small></td><td>第{p.package_version}版<small>最新接收：第{p.latest_received_version}版</small></td><td>{labels[p.status]}</td><td>{p.is_current?<span className="role-tag">当前使用</span>:p.current_package_id?'其他版本':'暂无可用包'}</td><td>{p.status==='withdrawn'?'正文与附件已停止使用':p.missing_fields.length?`${p.missing_fields.length} 项资料限制`:p.status==='ready'?'暂未发现缺失':'等待校验结果'}</td></tr>)}</tbody></table></div>:<div className="empty"><FileInput size={35}/><h2>暂无任务包</h2><p>接入归档成果，即可查看任务过程、附件校验和版本变化。</p></div>}{pages}</section>:detail&&<>
      <section className="panel package-overview"><button className="text-button" onClick={()=>navigate('/task-packages')}>返回任务包清单</button><div className="package-title"><div><h2>{detail.name}</h2><p>{projects.find(p=>p.id===detail.project_id)?.name||detail.project_id} · 第{detail.package_version}版 · {labels[detail.status]}{detail.is_current?' · 当前可用版本':''}</p></div><span className="demo-tag">{detail.is_demo ? "模拟任务包" : "平台归档成果"}</span></div><div className="package-version-stats"><span>最新收到 <strong>第{detail.latest_received_version}版</strong></span><span>当前可用 <strong>{detail.current_package_id?'第'+detail.current_ready_version+'版':'暂无（不会自动恢复旧版）'}</strong></span></div>{detail.capabilities.map(c=><span className="role-tag" key={c}>{caps[c]}</span>)}{detail.status!=='withdrawn'&&<p className="small-note">上述为输入资料可用程度；复盘需单独生成、核查和审核，发布后可用于培训学习。</p>}{detail.retrospective_id&&<button className="button secondary" onClick={()=>navigate('/retrospectives/'+detail.retrospective_id)}>打开已有复盘</button>}{canRetry&&detail.status==='ready'&&detail.is_current&&<button className="button primary" disabled={busy} onClick={()=>void action(async()=>{const r=await apiFetch('/api/v1/retrospectives',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer dev-${identity}`},body:JSON.stringify({mode:'task_process',task_package_id:detail.id})});const body=await r.json();if(!r.ok)throw new Error(body.message);navigate('/retrospectives/'+body.id);})}>自动生成 / 更新复盘</button>}</section>
      {detail.status==='withdrawn'?<section className="panel package-warning"><h2>此任务包已撤回</h2><p>正文、事件、问题和附件已停止在线使用。</p>{detail.invalidations.map(i=><p key={i.id}>下游失效通知：{i.state==='handled'?'复盘、培训实时来源保护已生效':i.state==='pending'?'历史通知待标记；当前在线访问仍受来源保护':i.state}</p>)}</section>:<>
        {(detail.warnings.length>0||detail.validation_errors.length>0)&&<section className="panel package-warning"><h2>校验结果与资料限制</h2>{detail.validation_errors.map((w,i)=><p key={'e'+i}>{w.message}</p>)}{detail.warnings.map((w,i)=><p key={'w'+i}>{w.message}</p>)}</section>}
        {['received','validating','processing'].includes(detail.status)&&<div className="feedback">后台处理中 · {detail.progress}%</div>}
        <section className="panel package-facts"><h2>任务快照</h2><p>开始：{fmt(detail.task?.started_at)}　结束：{fmt(detail.task?.completed_at)}</p><p>参与人员：{detail.participants?.map(p=>roleLabel(p.role)+'（'+p.actor_id+'）').join('、')||'未提供'}</p>{detail.issues?.map(i=><div key={i.issue_id}><h3>{i.description}</h3><p>责任方：{i.responsible_actor_id||'未提供'}　期限：{fmt(i.due_at)}</p><p>整改：{i.rectification||'未提供'}</p><p>复核：{i.review_conclusion||'未提供'}</p></div>)}</section>
        <section className="panel"><div className="panel-heading"><h2>过程事件与证据</h2><span>按A提供顺序展示，未知时间保持为空</span></div><div className="package-timeline">{detail.events?.length?detail.events.map(e=><article key={e.event_id}><time>{fmt(e.occurred_at)}</time><div><h3>{e.is_known?events[e.event_type]||e.event_type:'未知事件 · '+e.event_type}</h3><p>{eventDescription(e.payload)}</p>{e.related_object_id&&<p>对应：{e.related_object_id===detail.task_id?'本次任务':'问题 '+e.related_object_id}</p>}<small>{roleLabel(e.actor.actor_role)} · {e.actor.actor_id||'未提供人员'}</small>{e.evidence_refs.length>0&&<div className="package-event-evidence">关联证据：{e.evidence_refs.map(ref=>{const asset=detail.attachments?.find(a=>a.attachment_id===ref);return <button className="text-button" key={ref} disabled={busy||!asset||asset.state!=='verified'} onClick={()=>asset&&void openAsset(asset)}>{asset?evidenceTypes[asset.evidence_type]||'证据附件':'证据缺失'} · {ref}</button>;})}</div>}</div></article>):<p>没有已接入的过程事件；后台处理未完成或此包仅提供历史资料。</p>}</div>{detail.event_next!==null&&detail.event_next!==undefined&&<button className="button ghost package-more" disabled={busy} onClick={()=>void action(async()=>{const data=await api<Detail>('/'+ident+'?event_after='+detail.event_next);setDetail({...data,events:[...(detail.events||[]),...(data.events||[])]});})}>加载后续事件</button>}</section>
        <section className="panel package-attachments"><div className="panel-heading"><h2>证据附件</h2><span>校验通过后才可打开</span></div>{detail.attachments?.length?detail.attachments.map(a=><article key={a.attachment_id}><div><strong>{evidenceTypes[a.evidence_type]||'未知类型'} · {a.attachment_id}</strong><small>{labels[a.state]} · {a.size} 字节 · 关联{a.event_ids.length}个事件</small>{a.error&&<p>{a.error}</p>}</div><button className="button ghost" disabled={busy||a.state!=='verified'} onClick={()=>void openAsset(a)}>打开附件</button></article>):<p className="package-pad">未提供附件，不能据此声称证据完整。</p>}{opened&&<div className="package-opened"><button className="text-button" onClick={()=>setOpened(null)}>关闭预览</button><p>证据附件 · {opened.id}</p>{opened.url&&<img src={opened.url} alt="任务证据附件"/>}{opened.text&&<pre>{opened.text}</pre>}</div>}</section>
        <section className="panel package-history"><h2>版本与变化</h2><div className="package-version-links">{detail.versions?.map(v=><button key={v.id} className="button ghost" disabled={v.id===detail.id} onClick={()=>navigate('/task-packages/'+v.id)}>第{v.package_version}版 · {labels[v.state]}{v.is_current?' · 当前使用':''}</button>)}</div>{detail.diff?.previous_version?<p>与上一可查看版本（第{detail.diff.previous_version}版）比较：</p>:<p>暂无更早可查看版本。</p>}{detail.diff?.changes.map((c,i)=><details key={i}><summary>{sections[c.section]||c.section}有变化</summary>{'before'in c?<div className="package-diff"><div><strong>上一版</strong><pre>{diffText(c.before)}</pre></div><div><strong>本版</strong><pre>{diffText(c.after)}</pre></div></div>:<><p>新增：{c.added?.join('、')||'无'}；移除：{c.removed?.join('、')||'无'}</p>{c.order_changed&&<p>来源记录顺序有变化：{c.before_order?.join(' → ')}　调整为　{c.after_order?.join(' → ')}</p>}{c.changed?.map(x=><div key={x.id} className="package-diff"><div><strong>{x.id} · 上一版</strong><pre>{diffText(x.before)}</pre></div><div><strong>本版</strong><pre>{diffText(x.after)}</pre></div></div>)}</>}</details>)}</section>
        {(canWithdraw||canRetry&&detail.status==='failed')&&<section className="panel package-controls">{canRetry&&detail.status==='failed'&&<button className="button primary" disabled={busy} onClick={()=>void action(async()=>{const r=await apiFetch('/api/v1/jobs/'+detail.job_id+'/retry',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer dev-${identity}`,'Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({row_version:detail.job_row_version})});if(!r.ok)throw new Error((await r.json()).message);setNotice('已提交重试，已保存事件与附件不会重复新增。');setRefresh(v=>v+1);})}>重试接入</button>}{canWithdraw&&<><label>撤回原因<input value={reason} maxLength={2000} onChange={e=>setReason(e.target.value)} placeholder="请填写撤回原因"/></label><button className="button ghost danger" disabled={busy||!reason.trim()} onClick={()=>void action(async()=>{const payload=JSON.stringify({reason});const ref=detail.id+payload;if(withdrawKey.current?.body!==ref)withdrawKey.current={body:ref,key:crypto.randomUUID()};await api('/'+detail.id+'/withdraw',{method:'POST',headers:{'Idempotency-Key':withdrawKey.current.key},body:payload});setOpened(null);setRefresh(v=>v+1);})}>撤回此任务包</button></>}</section>}
      </>}
    </>}
  </div>;
}
