import {useEffect, useRef, useState} from 'react';
import {apiFetch} from './platform';
import './knowledge.css';
import './training.css';
import './standards.css';

type Api = <T>(url:string, options?:RequestInit)=>Promise<T>;
type Project = {id:string;name:string;can_run:boolean;can_manage:boolean;roles?:string[];permissions?:string[]};
type Clause = {number:string;text:string;chapter:string;parent_number:string|null;page:number|null;locator:string;
  preconditions:string[];exceptions:string[];tables:string[];notes:string[];references:string[]};
type Scope = {project_types:string[];regions:string[];object_types:string[];stages:string[]};
type Draft = {project_id:string;code:string;edition:string;expected_version:number;title:string;source_asset_id:string;
  valid_from:string;valid_until:string|null;scope:Scope;maintainer:string;reason:string;clauses:Clause[]};
type Standard = Omit<Draft,'expected_version'|'reason'|'clauses'> & {id:string;version:number;row_version:number;state:string;
  source_available?:boolean;verified_on:string|null;clauses?:Clause[];history?:{action:string;reason:string;created_at:string}[]};
const states:Record<string,string> = {draft:'草稿',pending_review:'待审核',changes_requested:'已退回',approved:'已审核',published:'已发布',superseded:'已有修订版',withdrawn:'已撤回'};
const actions:Record<string,string> = {created:'保存草稿',submit:'提交审核',approve:'审核通过',request_changes:'退回修改',publish:'发布',withdraw:'撤回',superseded:'被修订版替代'};
const newClause = ():Clause => ({number:'',text:'',chapter:'',parent_number:null,page:null,locator:'',preconditions:[],exceptions:[],tables:[],notes:[],references:[]});
const empty = (project:string):Draft => ({project_id:project,code:'',edition:'',expected_version:0,title:'',source_asset_id:'',valid_from:'',valid_until:null,
  scope:{project_types:[],regions:[],object_types:[],stages:[]},maintainer:'',reason:'首次录入',clauses:[newClause()]});
const lines = (value:string) => value.split('\n').map(x=>x.trim()).filter(Boolean);
function allowed(project:Project|undefined, permission:string) {
  if(project?.permissions) return project.permissions.includes(permission);
  if(permission==='knowledge.process') return !!project?.can_run;
  return !!project?.can_manage || !!project?.roles?.includes('reviewer');
}

export function Standards({api,projects,identity}:{api:Api;projects:Project[];identity:string}) {
  const [project,setProject]=useState(projects[0]?.id||'');
  const [items,setItems]=useState<Standard[]>([]),[detail,setDetail]=useState<Standard|null>(null);
  const [draft,setDraft]=useState<Draft|null>(null),[dirty,setDirty]=useState(false);
  const [busy,setBusy]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [cursor,setCursor]=useState(''),[next,setNext]=useState<string|null>(null),[refresh,setRefresh]=useState(0);
  const [reason,setReason]=useState(''),[checked,setChecked]=useState(false),[fileName,setFileName]=useState('');
  const [purpose,setPurpose]=useState('current_rectification'),[eventDate,setEventDate]=useState('');
  const [conditions,setConditions]=useState({project_type:'',region:'',object_type:'',stage:''});
  const [result,setResult]=useState<{status:string;missing:string[];reasons:string[];note:string;as_of?:string}|null>(null);
  const key=useRef(crypto.randomUUID()),epoch=useRef(0);
  const scope=projects.find(p=>p.id===project),process=allowed(scope,'knowledge.process'),review=allowed(scope,'knowledge.review'),publish=allowed(scope,'knowledge.publish');
  const manage=process||review||publish;
  useEffect(()=>{const before=(event:BeforeUnloadEvent)=>{if(dirty){event.preventDefault();event.returnValue='';}};
    window.addEventListener('beforeunload',before);return()=>window.removeEventListener('beforeunload',before);},[dirty]);
  useEffect(()=>{let stale=false;setLoading(true);setError('');setItems([]);setNext(null);
    if(!project){setLoading(false);return;}
    void api<{items:Standard[];next_cursor:string|null}>(`/standards?project_id=${encodeURIComponent(project)}&view=${manage?'manage':'published'}${cursor?'&cursor='+encodeURIComponent(cursor):''}`)
      .then(data=>{if(!stale){setItems(data.items);setNext(data.next_cursor);}}).catch(e=>{if(!stale)setError(e.message);}).finally(()=>{if(!stale)setLoading(false);});
    return()=>{stale=true;};},[project,manage,cursor,refresh]);
  useEffect(()=>()=>{epoch.current++;},[]);
  const run=async(fn:()=>Promise<void>)=>{setBusy(true);setError('');setNotice('');try{await fn();}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  const clearChanges=()=>{setDirty(false);(window as Window & {QaxcClearPendingEdits?:()=>void}).QaxcClearPendingEdits?.();};
  const mayLeave=()=>!dirty||confirm('当前规范草稿尚未保存，确定放弃本次编辑？');
  const edit=(change:Partial<Draft>)=>{setDraft(d=>d?{...d,...change}:d);setDirty(true);key.current=crypto.randomUUID();};
  const editClause=(n:number,change:Partial<Clause>)=>{if(draft)edit({clauses:draft.clauses.map((c,i)=>i===n?{...c,...change}:c)});};
  const open=async(row:Standard)=>{if(!mayLeave())return;const ticket=++epoch.current;await run(async()=>{
    const found=await api<Standard>('/standards/'+row.id);if(ticket!==epoch.current)return;
    setDetail(found);setDraft(null);clearChanges();setResult(null);setReason('');setChecked(false);
  });};
  const revise=()=>{if(!detail||!mayLeave())return;
    const {id,version,row_version,state,source_available,verified_on,history,clauses,...fields}=detail;
    // Select only the public write contract; response-only IDs never leak into drafts.
    setDraft({project_id:fields.project_id,code:fields.code,edition:fields.edition,title:fields.title,source_asset_id:fields.source_asset_id,
      valid_from:fields.valid_from,valid_until:fields.valid_until,scope:fields.scope,maintainer:fields.maintainer,
      expected_version:version,reason:'修订说明待填写',clauses:(clauses||[]).map(c=>Object.fromEntries(Object.keys(newClause()).map(k=>[k,c[k as keyof Clause]])) as Clause)});
    setFileName('沿用已绑定原件；原文变化时请重新上传');setDirty(true);key.current=crypto.randomUUID();
  };
  const transition=(action:string)=>void run(async()=>{if(!detail)return;
    const updated=await api<Standard>(`/standards/${detail.id}/actions`,{method:'POST',body:JSON.stringify({action,row_version:detail.row_version,reason,evidence_checked:checked})});
    setDetail({...detail,...updated});clearChanges();setRefresh(x=>x+1);setNotice(actions[action]+'成功。');setReason('');setChecked(false);
    if(detail.source_available!==false)setDetail(await api<Standard>('/standards/'+detail.id));
  });
  const download=()=>void run(async()=>{if(!detail)return;const response=await apiFetch(`/api/v1/standards/${detail.id}/source`,{headers:{Authorization:`Bearer dev-${identity}`}});
    if(!response.ok){const e=await response.json();throw new Error(e.message||'原件不可用。');}
    const blob=await response.blob(),url=URL.createObjectURL(blob),anchor=document.createElement('a');
    anchor.href=url;anchor.download='规范原件'+(blob.type.includes('pdf')?'.pdf':blob.type.includes('wordprocessing')?'.docx':'.txt');anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  return <div className="knowledge-module training-module standards-module">
    <div className="panel-heading"><div><h2>规范原文与版本</h2><p>绑定原件，保留条文上下文，经核验后发布。适用性核对仅检查已登记的日期和条件。</p></div></div>
    {error&&<p className="feedback error" role="alert">{error}<button className="button ghost" disabled={busy} onClick={()=>setRefresh(x=>x+1)}>刷新列表</button></p>}
    {notice&&<p className="feedback success" role="status">{notice}</p>}
    <div className="standards-toolbar"><label>项目<select aria-label="规范项目" disabled={busy} value={project} onChange={e=>{if(!mayLeave())return;epoch.current++;setProject(e.target.value);setDetail(null);setDraft(null);setDirty(false);setCursor('');setResult(null);}}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      {process&&<button className="button primary" disabled={busy||!project} onClick={()=>{if(!mayLeave())return;setDraft(empty(project));setDetail(null);setFileName('');setDirty(false);key.current=crypto.randomUUID();}}>登记规范原文</button>}
      <button className="button ghost" disabled={busy||loading} onClick={()=>setRefresh(x=>x+1)}>刷新</button></div>
    {!project&&<p className="panel empty">没有可访问项目。</p>}
    {loading?<p role="status">正在读取规范版本…</p>:<section className="panel"><div className="proof-body">
      {!items.length&&<p>当前页没有{manage?'已登记':'已发布'}的规范版本。</p>}
      {items.map(row=><article className="standard-entry" key={row.id}><div><strong>{row.title}</strong><p>{row.code} · {row.edition} · 修订 {row.version} · {states[row.state]}</p><small>生效 {row.valid_from}；{row.valid_until?'自 '+row.valid_until+' 起不再适用':'未登记废止日期'}{row.source_available===false?' · 原件不可用':''}</small></div>
        <button className="button secondary" disabled={busy} onClick={()=>void open(row)}>查看与核验</button>
        {publish&&row.source_available===false&&['published','approved','superseded'].includes(row.state)&&<button className="button ghost" disabled={busy} onClick={()=>{setDetail(row);setDraft(null);setChecked(false);setReason('来源不可用，撤回规范');}}>办理撤回</button>}
      </article>)}
      <div className="standards-toolbar"><button className="button ghost" disabled={!cursor||busy} onClick={()=>setCursor('')}>返回首页</button><button className="button secondary" disabled={!next||busy} onClick={()=>setCursor(next||'')}>下一页</button></div>
    </div></section>}
    {draft&&<form className="panel" onSubmit={e=>{e.preventDefault();void run(async()=>{
      if(!draft.source_asset_id)throw new Error('请先上传规范原件。');
      const payload={...draft,scope:Object.fromEntries(Object.entries(draft.scope).map(([k,v])=>[k,lines(v.join('\n'))])),clauses:draft.clauses.map(c=>({...c,
        preconditions:lines(c.preconditions.join('\n')),exceptions:lines(c.exceptions.join('\n')),tables:lines(c.tables.join('\n')),notes:lines(c.notes.join('\n')),references:lines(c.references.join('\n'))}))};
      const saved=await api<Standard>('/standards',{method:'POST',headers:{'Idempotency-Key':key.current},body:JSON.stringify(payload)});
      clearChanges();setDraft(null);setDetail(await api<Standard>('/standards/'+saved.id));setRefresh(x=>x+1);setNotice('规范草稿已保存，需核验后发布。');
    });}}><div className="panel-heading"><h3>{draft.expected_version?'修订规范':'登记规范'}</h3><span>原件和已保存版本保留不变</span></div><fieldset className="proof-body" disabled={busy}>
      <div className="form-grid"><label>规范名称<input required maxLength={300} value={draft.title} onChange={e=>edit({title:e.target.value})}/></label><label>规范编号<input required maxLength={128} value={draft.code} readOnly={draft.expected_version>0} onChange={e=>edit({code:e.target.value})}/></label>
      <label>版本标识<input required maxLength={100} value={draft.edition} readOnly={draft.expected_version>0} onChange={e=>edit({edition:e.target.value})}/></label><label>来源维护责任人<input required maxLength={200} value={draft.maintainer} onChange={e=>edit({maintainer:e.target.value})}/></label>
      <label>生效日期<input required type="date" value={draft.valid_from} onChange={e=>edit({valid_from:e.target.value})}/></label><label>废止日期（当天起不再适用，可留空）<input type="date" value={draft.valid_until||''} onChange={e=>edit({valid_until:e.target.value||null})}/></label></div>
      <label>规范原件（PDF / DOCX / UTF-8 TXT，最多5MB）<input type="file" accept=".pdf,.docx,.txt" onChange={e=>{const file=e.target.files?.[0];if(!file)return;void run(async()=>{
        if(file.size>5000000)throw new Error('原件超过5MB，请先分卷整理。');
        const uploaded=await api<{asset_id:string}>(`/standards/source-files?project_id=${encodeURIComponent(project)}&name=${encodeURIComponent(file.name)}`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:file});
        edit({source_asset_id:uploaded.asset_id});setFileName(file.name);setNotice('原件已上传，请逐条核对原文。自动解析尚未接入。');
      });}}/></label><p>{fileName||'尚未选择原件'}</p>
      <details><summary>适用范围（每行一项；空白表示未限定该维度）</summary><div className="form-grid">{([['project_types','项目类型'],['regions','地域'],['object_types','作业对象'],['stages','作业阶段']] as const).map(([k,label])=><label key={k}>{label}<textarea value={draft.scope[k].join('\n')} onChange={e=>edit({scope:{...draft.scope,[k]:e.target.value.split('\n')}})}/></label>)}</div></details>
      <h3>条文与上下文</h3>{draft.clauses.map((clause,n)=><fieldset className="standard-clause" key={n}><legend>条文 {n+1}</legend><div className="form-grid">
        <label>条号<input required maxLength={100} value={clause.number} onChange={e=>editClause(n,{number:e.target.value})}/></label><label>所属章节<input required maxLength={200} value={clause.chapter} onChange={e=>editClause(n,{chapter:e.target.value})}/></label>
        <label>父条号（可留空）<input value={clause.parent_number||''} onChange={e=>editClause(n,{parent_number:e.target.value||null})}/></label><label>原文页码<input type="number" min={1} max={100000} value={clause.page||''} onChange={e=>editClause(n,{page:e.target.value?Number(e.target.value):null})}/></label></div>
        <label>原文位置（无页码时必填）<input value={clause.locator} onChange={e=>editClause(n,{locator:e.target.value})}/></label><label>条文原文<textarea required maxLength={12000} value={clause.text} onChange={e=>editClause(n,{text:e.target.value})}/></label>
        <details><summary>前置条件、例外、表格、注释与引用（每行一项）</summary>{([['preconditions','前置条件'],['exceptions','例外条件'],['tables','相关表格原文'],['notes','注释'],['references','引用条款']] as const).map(([k,label])=><label key={k}>{label}<textarea value={clause[k].join('\n')} onChange={e=>editClause(n,{[k]:e.target.value.split('\n')})}/></label>)}</details>
        {draft.clauses.length>1&&<button type="button" className="button ghost" onClick={()=>edit({clauses:draft.clauses.filter((_,i)=>i!==n)})}>删除此条草稿</button>}</fieldset>)}
      <button type="button" className="button secondary" disabled={draft.clauses.length>=200} onClick={()=>edit({clauses:[...draft.clauses,newClause()]})}>添加条文</button>
      <label>录入或修订原因<textarea required maxLength={200} value={draft.reason} onChange={e=>edit({reason:e.target.value})}/></label>
      <button className="button primary" type="submit" disabled={!draft.source_asset_id}>保存草稿</button><button className="button ghost" type="button" onClick={()=>{if(mayLeave()){setDraft(null);setDirty(false);}}}>取消编辑</button>
    </fieldset></form>}
    {detail&&!draft&&<section className="panel"><div className="panel-heading"><div><h3>{detail.title}</h3><p>{detail.code} · {detail.edition} · 修订 {detail.version} · {states[detail.state]}</p></div></div><div className="proof-body">
      <p>维护人：{detail.maintainer}；核验日期：{detail.verified_on||'尚未核验'}。有效区间：{detail.valid_from} 至 {detail.valid_until||'未登记废止日期'}。</p>
      <div className="standards-toolbar"><button className="button secondary" disabled={busy||detail.source_available===false} onClick={download}>下载核对原件</button>{process&&<button className="button ghost" disabled={busy||!detail.clauses} onClick={revise}>以此版本修订</button>}</div>
      {detail.clauses?.map(c=><article className="standard-clause" key={c.number}><h4>{c.number} · {c.chapter}</h4><p>父条号：{c.parent_number||'无'}；{c.page?'第 '+c.page+' 页；':''}{c.locator}</p><p className="standard-original">{c.text}</p>{([['preconditions','前置条件'],['exceptions','例外'],['tables','表格'],['notes','注释'],['references','引用条款']] as const).map(([k,label])=>c[k].length>0&&<div key={k}><strong>{label}</strong>{c[k].map((t,i)=><p className="standard-original" key={i}>{t}</p>)}</div>)}</article>)}
      {detail.state==='published'&&<fieldset className="standard-clause"><legend>核对版本及适用范围</legend><p>此处只核对已登记条件，具体条文前提和例外仍需专业判断。</p><label>用途<select value={purpose} onChange={e=>{setPurpose(e.target.value);setResult(null);}}><option value="current_rectification">当前整改</option><option value="historical_review">历史复盘</option></select></label>
        {purpose==='historical_review'&&<label>事件日期<input type="date" value={eventDate} onChange={e=>{setEventDate(e.target.value);setResult(null);}}/></label>}
        <div className="form-grid">{([['project_type','项目类型'],['region','地域'],['object_type','作业对象'],['stage','作业阶段']] as const).map(([k,label])=><label key={k}>{label}<input value={conditions[k]} onChange={e=>{setConditions({...conditions,[k]:e.target.value});setResult(null);}}/></label>)}</div>
        <button className="button secondary" disabled={busy} onClick={()=>void run(async()=>{setResult(await api(`/standards/${detail.id}/applicability`,{method:'POST',body:JSON.stringify({purpose,event_date:eventDate||null,...conditions})}));})}>核对条件</button>
        {result&&<div role="status"><p>{{candidate:'日期与登记范围符合，仍需核对具体条文',needs_information:'条件不全，请补充',not_applicable:'存在不适用条件',unavailable:'版本不可用'}[result.status]}</p>{result.missing.length>0&&<p>待补：{result.missing.map(k=>({event_date:'事件日期',project_type:'项目类型',region:'地域',object_type:'作业对象',stage:'作业阶段'}[k]||k)).join('、')}</p>}{result.reasons.map(x=><p key={x}>{x}</p>)}<p>{result.note}</p></div>}
      </fieldset>}
      {manage&&<fieldset className="standard-clause" disabled={busy}><legend>审核与发布</legend><label>操作说明<textarea value={reason} maxLength={2000} onChange={e=>setReason(e.target.value)}/></label>
        {detail.state==='pending_review'&&review&&<label className="check-label"><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/>已逐项核对条号、原文、上下文、适用范围及有效日期</label>}
        <div className="standards-toolbar">{detail.state==='draft'&&process&&<button className="button primary" disabled={!reason.trim()} onClick={()=>transition('submit')}>提交审核</button>}
        {detail.state==='pending_review'&&review&&<><button className="button primary" disabled={!reason.trim()||!checked} onClick={()=>transition('approve')}>审核通过</button><button className="button secondary" disabled={!reason.trim()} onClick={()=>transition('request_changes')}>退回修改</button></>}
        {detail.state==='approved'&&publish&&<button className="button primary" disabled={!reason.trim()} onClick={()=>transition('publish')}>发布此版本</button>}
        {['published','approved','superseded'].includes(detail.state)&&publish&&<button className="button ghost" disabled={!reason.trim()} onClick={()=>transition('withdraw')}>撤回此版本</button>}</div>
        {detail.state==='changes_requested'&&<p>请使用“以此版本修订”保存新稿，再提交审核。</p>}
      </fieldset>}
      <details><summary>操作记录</summary>{detail.history?.map((h,n)=><p key={n}>{actions[h.action]||h.action} · {h.reason} · {new Date(h.created_at).toLocaleString('zh-CN')}</p>)}</details>
    </div></section>}
  </div>;
}
