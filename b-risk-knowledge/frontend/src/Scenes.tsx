import {useEffect,useState} from 'react';
type Api=<T>(url:string,options?:RequestInit)=>Promise<T>;
type Project={id:string;name:string;can_run:boolean;can_manage:boolean;permissions?:string[]};
type Category={code:string;name:string;focus:string;keywords:string[]};
type Payload={name:string;categories:Category[];steps:{event_type:string;name:string;scope:string}[];compare_deadline:boolean};
type Scene={id:string;code:string;version:number;active:boolean;payload:Payload};
const steps=[['task_started','任务开始','task'],['inspection_recorded','检查记录','task'],['issue_created','问题记录','issue'],['rectification_submitted','整改提交','issue'],['review_rejected','复核退回','issue'],['review_accepted','复核通过','issue'],['task_completed','任务结束','task']];
export function Scenes({api,projects}:{api:Api;projects:Project[]}) {
 const [project,setProject]=useState(projects[0]?.id||''),[items,setItems]=useState<Scene[]>([]),[code,setCode]=useState('general_inspection');
 const [name,setName]=useState('现场质量安全检查'),[categories,setCategories]=useState('general,通用施工检查'),[selected,setSelected]=useState(steps.map(s=>s[0]));
 const [deadline,setDeadline]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[refresh,setRefresh]=useState(0);
 const scope=projects.find(p=>p.id===project),canEdit=scope?.permissions?scope.permissions.includes('knowledge.process'):scope?.can_run;
 const canActivate=scope?.permissions?scope.permissions.includes('knowledge.review'):scope?.can_manage;
 useEffect(()=>{let stale=false;setItems([]);setError('');if(project)void api<{items:Scene[]}>(`/scenes?project_id=${encodeURIComponent(project)}`).then(r=>{if(!stale)setItems(r.items);}).catch(e=>{if(!stale)setError(e.message);});return()=>{stale=true;};},[project,refresh]);
 const action=async(fn:()=>Promise<void>)=>{setBusy(true);setError('');setNotice('');try{await fn();setRefresh(x=>x+1);}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
 const edit=(s:Scene)=>{setCode(s.code);setName(s.payload.name);setCategories(s.payload.categories.map(c=>c.code+','+c.name).join('\n'));setSelected(s.payload.steps.map(x=>x.event_type));setDeadline(s.payload.compare_deadline);};
 return <section className="panel"><div className="panel-heading"><h2>场景与流程配置</h2><span>保存新版本，经审核人员启用后用于后续复盘</span></div><div className="proof-body">
 {error&&<p className="feedback error" role="alert">{error}</p>}{notice&&<p className="feedback success" role="status">{notice}</p>}
 <label>项目<select aria-label="场景项目" value={project} onChange={e=>setProject(e.target.value)}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
 {canEdit&&<><div className="form-grid"><label>场景编码<input aria-label="场景编码" value={code} onChange={e=>setCode(e.target.value)}/></label><label>场景名称<input aria-label="场景名称" value={name} onChange={e=>setName(e.target.value)}/></label></div>
 <label>分类（每行：英文编码,中文名称）<textarea aria-label="场景分类" value={categories} onChange={e=>setCategories(e.target.value)}/></label>
 <fieldset><legend>需要核对的过程记录</legend>{steps.map(s=><label className="check-label" key={s[0]}><input type="checkbox" checked={selected.includes(s[0])} onChange={e=>setSelected(v=>e.target.checked?[...v,s[0]]:v.filter(x=>x!==s[0]))}/>{s[1]}</label>)}</fieldset>
 <label className="check-label"><input type="checkbox" checked={deadline} onChange={e=>setDeadline(e.target.checked)}/>有明确期限、终态及复核时间时比较记录中的期限</label>
 <button className="button primary" disabled={busy||!project||!selected.length} onClick={()=>void action(async()=>{
 const prior=items.filter(s=>s.code===code).sort((a,b)=>b.version-a.version)[0];
 const parsed=categories.split('\n').filter(x=>x.trim()).map(line=>{const [id,label]=line.split(/[,，]/);if(!id?.trim()||!label?.trim())throw new Error('分类须逐行填写英文编码和中文名称。');const old=prior?.payload.categories.find(c=>c.code===id.trim());return {code:id.trim(),name:label.trim(),focus:old?.focus||'',keywords:old?.keywords||[]};});
 await api('/scenes',{method:'POST',body:JSON.stringify({project_id:project,code,expected_version:prior?.version||0,payload:{name,categories:parsed,steps:steps.filter(s=>selected.includes(s[0])).map(s=>({event_type:s[0],name:s[1],scope:s[2]})),compare_deadline:deadline}})});setNotice('新场景版本已保存，原成果保持原配置。');})}>保存新版本</button></>}
 {items.map(s=><div className="proof-row" key={s.id}><h3>{s.payload.name} · v{s.version}{s.active?' · 已启用':''}</h3><p>{s.code} · {s.payload.categories.length}项分类 · {s.payload.steps.length}项过程记录</p>{canEdit&&<button className="button ghost" onClick={()=>edit(s)}>以此版本编辑</button>}{canActivate&&!s.active&&<button className="button secondary" disabled={busy} onClick={()=>void action(async()=>{await api(`/scenes/${s.id}/activate`,{method:'POST',body:JSON.stringify({expected_active_id:items.find(x=>x.code===s.code&&x.active)?.id||null})});setNotice('场景版本已启用。');})}>启用此版本</button>}{canEdit&&<button className="button ghost" disabled={busy} onClick={()=>void action(async()=>{const prior=await api<{items:{version:number}[]}>(`/knowledge/taxonomies?project_id=${encodeURIComponent(project)}`);await api('/knowledge/taxonomies',{method:'POST',body:JSON.stringify({project_id:project,expected_version:prior.items[0]?.version||0,categories:s.payload.categories})});setNotice('分类已保存为新的知识萃取分类版本。');})}>用于知识萃取分类</button>}</div>)}
 </div></section>;
}
