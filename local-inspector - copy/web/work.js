'use strict';
const root=document.querySelector('#work');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const actionNames={create:'建立任务',start:'确认准备并开始',materials:'关联任务资料',record:'保存现场记录',issue:'登记问题','submit-field':'现场上报','receive-field':'平台接收／退回',reassign:'分派问题',reply:'整改回复',review:'复核处理',deliver:'生成正式成果',accept:'成果接收／退回',archive:'归档',reopen:'发起补正','import-report':'导入历史报告'};
const taskSource=t=>t.source==='adhoc'?'自主临时巡查':'平台派发';
const fieldNames={collecting:'待现场上报',submitted:'待平台接收',accepted:'平台已接收'};
const labels={ready:'待执行',active:'执行中',handover:'待接收',accepted:'已接收',archived:'已归档',unassigned:'待分派',assigned:'待整改',returned:'已退回',review:'待复核',closed:'已销项',manager:'项目负责人',inspector:'检查人',rectifier:'整改人',reviewer:'复核人',receiver:'接收人',draft:'草稿',confirmed:'已确认'};
const replyDrafts={};
let state,taskId='',busy=false,evidence=[],draft=null,pid='',sid='inspection',timer;
function toast(text){const el=document.querySelector('#toast');el.textContent=text;el.style.display='block';clearTimeout(timer);timer=setTimeout(()=>el.style.display='none',6000)}
async function api(path,data){const r=await fetch(path,{method:data?'POST':'GET',headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});const result=await r.json();if(!r.ok){if(r.status===401)login();throw Error(result.error||'请求失败')}return result}
const post=(action,data)=>api('/api/work/'+action,{...data,requestId:crypto.randomUUID?crypto.randomUUID():Date.now()+'-'+Math.random()});
async function run(fn){if(busy)return;busy=true;document.querySelectorAll('button').forEach(b=>b.disabled=true);try{await fn()}catch(e){toast(e.message)}finally{busy=false;document.querySelectorAll('button').forEach(b=>b.disabled=false)}}
const input=(name,label,value='',type='text')=>`<label>${esc(label)}<input name="${esc(name)}" type="${type}" value="${esc(value)}" required></label>`;
const select=(name,label,items,selected='')=>`<label>${esc(label)}<select name="${esc(name)}" aria-label="${esc(label)}" required><option value="">请选择</option>${items.map(x=>`<option value="${esc(x.id)}" ${x.id===selected?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label>`;
const members=(p,roles)=>p.members.filter(x=>!roles||roles.includes(x.role)).map(x=>({id:x.id,name:x.name+'（'+(labels[x.role]||x.role)+'）'}));
const form=(id,title,content,button)=>`<form id="${id}" class="card"><h3>${title}</h3>${content}<button>${button}</button></form>`;
const formData=f=>Object.fromEntries(new FormData(f));
function bindForm(id,fn){const f=document.getElementById(id);if(f)f.onsubmit=e=>{e.preventDefault();run(()=>fn(formData(f),f))}}
function login(){state=null;root.innerHTML=`<header><h1>作业协同</h1><a href="/">巡查工作台</a></header>${form('login','登录',input('username','账号','admin')+input('password','密码','','password'),'登录')}<p class="muted">管理员使用原本地密码，成员使用管理员分配的账号。</p>`;bindForm('login',async d=>{await api('/api/login',d);await refresh()})}
async function refresh(){state=await api('/api/work/state');if(!state.projects.some(p=>p.id===pid))pid=state.projects[0]?.id||'';render()}
function current(){return state.tasks.find(t=>t.id===taskId)}
async function action(name,d={}){const t=current();await post(name,{...d,taskId:t.id,revision:t.revision});await refresh();toast('操作已保存')}
function render(){if(!state)return;const t=current();root.innerHTML=`<header><div><div class="muted">质量安全小察 / 作业协同</div><h1>${t?esc(t.title):'从任务建立，到成果归档'}</h1></div><div class="flex"><span>${esc(state.user.name)}</span><a href="/">巡查工作台</a><button id="reload" class="secondary">刷新</button><button id="logout" class="secondary">退出</button></div></header>${t?detail(t):list()}`;document.getElementById('logout').onclick=()=>run(async()=>{await api('/api/logout',{});login()});document.getElementById('reload').onclick=()=>run(refresh);if(t)bindDetail(t);else bindList()}
function list(){const p=state.projects.find(p=>p.id===pid);const admin=state.user.id==='admin';const manage=admin||p?.role==='manager';const s=state.scenarios.find(x=>x.id===sid)||state.scenarios[0];sid=s.id;
 return `${state.reminders.length?`<div class="notice"><strong>待办提醒</strong>${state.reminders.map(r=>`<p><a href="#" data-open="${r.taskId}">${esc(r.text)}</a></p>`).join('')}</div>`:''}<div class="cards">${state.tasks.map(t=>`<article class="card"><span class="tag">${taskSource(t)} · ${labels[t.status]} · ${fieldNames[t.fieldStatus||'collecting']}</span><h3>${esc(t.title)}</h3><p>${esc(t.number)}</p><p>${esc(t.scenario.name)} · 截止 ${esc(t.dueDate)}</p><p>${t.records.length} 条记录 / ${t.issues.length} 个问题</p><button data-open="${t.id}">打开任务 →</button></article>`).join('')||'<div class="card">暂无任务。请创建项目，配置成员，再建立任务。</div>'}</div>
 ${admin?`<details><summary>账号与项目管理</summary><div class="cards">${form('project','新建项目',input('name','项目名称')+input('contract','合同名称'),'创建项目')}${form('user','创建独立账号',input('username','登录账号（字母数字，至少3位）')+input('name','姓名')+input('password','密码（至少12位）','','password'),'创建账号')}</div><p>${state.users.map(u=>esc(u.name)+' / '+esc(u.username)).join('　')}</p></details>`:''}
 ${p?`<section class="card"><h2>项目分工</h2>${select('project','当前项目',state.projects,pid)}<div>${p.members.map(m=>`<p>${esc(m.name)} · ${esc(m.username)} · ${labels[m.role]}</p>`).join('')||'尚未分配成员'}</div>${manage?form('member','添加／调整项目成员',input('username','已有登录账号')+select('role','角色',Object.keys(labels).filter(k=>['manager','inspector','rectifier','reviewer','receiver'].includes(k)).map(k=>({id:k,name:labels[k]}))),'保存分工'):''}</section>`:''}
 ${p&&manage?form('task','建立任务',select('scene','场景',state.scenarios,sid)+`<small>配置版本 v${s.version} · ${esc(s.projectType)}</small>`+input('title','任务名称')+input('object','检查对象／设备')+input('dueDate','完成期限','','date')+s.fields.map(f=>input('field:'+f,f)).join('')+select('assignee','任务执行人',members(p,['inspector','manager']))+input('receiverName','最终成果接收人（手动填写姓名）'),'建立任务'):''}
 ${admin?`<details><summary>场景配置与扩展（JSON）</summary><p>调整字段、检查清单、记录类型、整改证据要求和报告章节。发布后版本递增，已有任务保持原配置。</p>${form('scenario','发布场景配置',`<textarea name="config" rows="18">${esc(JSON.stringify(s,null,2))}</textarea>`,'发布新版本')}</details>`:''}`;
}
function bindList(){
 root.querySelectorAll('[data-open]').forEach(b=>b.onclick=e=>{e.preventDefault();taskId=b.dataset.open;evidence=[];draft=null;render()});
 const p=root.querySelector('[name=project]');if(p)p.onchange=()=>{pid=p.value;render()};
 const s=root.querySelector('[name=scene]');if(s)s.onchange=()=>{sid=s.value;render()};
 bindForm('project',async d=>{await api('/api/projects',d);await refresh()});
 bindForm('user',async d=>{await post('users',d);await refresh()});
 bindForm('member',async d=>{await post('members',{...d,projectId:pid});await refresh()});
 bindForm('task',async d=>{const fields={};Object.keys(d).filter(k=>k.startsWith('field:')).forEach(k=>fields[k.slice(6)]=d[k]);const t=await post('tasks',{...d,fields,projectId:pid,scenarioId:d.scene});taskId=t.id;evidence=[];draft=null;await refresh()});
 bindForm('scenario',async d=>{const scenario=JSON.parse(d.config);const old=state.scenarios.find(s=>s.id===scenario.id);await post('scenarios',{scenario,baseVersion:old?scenario.version:0});await refresh();toast('新配置已发布；已有任务保持原版本')});
}
function detail(t){
 const p=state.projects.find(p=>p.id===t.projectId),role=p.role,admin=state.user.id==='admin',manager=admin||role==='manager',writer=manager||role==='inspector',name=id=>id==='admin'?'系统管理员':p.members.find(m=>m.id===id)?.name||id||'未分派';
 const active=t.status==='active';const handling=active&&t.fieldStatus==='accepted';
 const fileLink=(id,label)=>`<a target="_blank" rel="noopener" href="/api/work/evidence/${encodeURIComponent(id)}">${esc(label||'查看证据')}</a>`;
 const canReply=i=>handling&&(i.assigneeName?manager:i.assignee===state.user.id)&&['assigned','returned'].includes(i.status);
 const evidencePanel=(scope='')=>`<section class="card"><h2>证据与任务资料</h2><p>照片、MP3／WAV／M4A录音、PDF资料，每份不超过10MB。上传后勾选，用于任务资料或整改回复。</p><input data-files="${scope}" type="file" multiple accept="image/png,image/jpeg,audio/mpeg,audio/wav,audio/mp4,application/pdf"><div>${evidence.filter(e=>(e.issueId||'')===scope).map(e=>`<div class="entry"><label><input type="checkbox" data-evidence="${e.id}" ${e.selected!==false?'checked':''}> ${esc(e.name)}</label>${fileLink(e.id)}</div>`).join('')}</div>${writer?`<button class="secondary" data-materials="${scope}">将所选文件加入任务资料</button>`:''}<p>任务资料：${t.materials.map(id=>fileLink(id)).join(' / ')||'暂无'}</p></section>`;
 const r=draft||{type:t.scenario.recordTypes[0],text:'',occurredAt:new Date().toISOString(),evidence:[]};
 return `<button class="secondary" id="back">← 任务列表</button><section class="card"><div class="flex"><span class="tag">${taskSource(t)} · ${labels[t.status]} · ${fieldNames[t.fieldStatus||'collecting']}</span><span>${esc(t.number)}</span></div><p>项目：${esc(p.name)} · 对象：${esc(t.object)}</p><p>发起人：${esc(t.createdByName||'平台历史任务')} · 执行人：${esc(name(t.assignee))} · 接收人：${esc(t.receiverName||name(t.receiver))} · 截止：${t.dueDate}</p><p>场景 ${esc(t.scenario.name)} v${t.scenario.version} · 修订 ${t.revision}</p>${Object.entries(t.fields).map(([k,v])=>`<p>${esc(k)}：${esc(v)}</p>`).join('')}
 <p class="notice">隐患记录在小程序完成。平台接收后办理分派、整改、复核及正式成果。</p></section>
 <section class="card"><h2>现场上报与简报</h2><p>${fieldNames[t.fieldStatus||'collecting']}</p>${t.fieldFeedback?`<p>平台反馈：${esc(t.fieldFeedback.text)}</p>`:''}${(t.fieldBriefs||[]).map(b=>`<p>现场简报 v${b.version} · ${esc(b.createdAt)} <a target="_blank" rel="noopener" href="/api/work/brief/${b.id}">查看现场材料</a> · <a href="/api/work/brief-word/${b.id}">下载简报 Word</a></p>`).join('')}${active&&manager&&t.fieldStatus==='submitted'?form('receiveField','接收／退回现场材料',select('decision','处理结果',[{id:'accept',name:'接收材料，进入平台办理'},{id:'return',name:'退回小程序补充'}])+(!t.receiver&&!t.receiverName?input('receiverName','最终成果接收人（手动填写；接收时必填，退回可不填）').replace(' required>','>'):'')+input('text','接收意见（选填；退回时请填写原因）').replace(' required>','>')+'<p id="receiveStatus" role="status" aria-live="polite"></p>','提交处理结果'):''}</section>
 ${['ready','active'].includes(t.status)&&!t.issues.some(canReply)?evidencePanel():''}

 <section class="card"><h2>检查人员与签名</h2><p>${esc(t.inspectors||'未填写')}</p>${t.fieldSignature?`<p>签名人：${esc(t.fieldSignature.name)} · ${esc(t.fieldSignature.signedAt)} ${fileLink(t.fieldSignature.evidenceId)}</p>`:''}<h2>问题与整改闭环</h2>${t.issues.map(i=>`<article class="entry"><span class="tag">${labels[i.status]} · ${esc(i.risk)}</span><h3>${esc(i.description)}</h3><p>${esc(i.category||'现场问题')} / ${esc(i.subcategory||'')} / ${esc(i.location||'未填写部位')}</p>${handling&&manager&&i.status!=='closed'?`<details><summary>${i.status==='unassigned'?'分派整改任务':'重新分派'}</summary><form data-reassign="${i.id}">${input('assigneeName','整改人（手动填写姓名）',i.assigneeName||(i.assignee?name(i.assignee):''))}${input('reviewerName','复核人（手动填写姓名）',i.reviewerName||(i.reviewer?name(i.reviewer):''))}<p>手填人员由平台负责人代录整改回复、复核结果，保留实际操作账号。</p>${input('dueDate','期限',i.dueDate,'date')}${input('text','分派说明／调整原因（选填）').replace(' required>','>')}<p data-reassign-status role="status" aria-live="polite"></p><button>保存分派</button></form></details>`:''}${i.reference?`<p class="block">规范依据：${esc(i.reference)}</p>`:''}${i.suggestion?`<p class="block">处理建议：${esc(i.suggestion)}</p>`:''}<p>整改：${esc(i.assigneeName||name(i.assignee))} / 复核：${esc(i.reviewerName||name(i.reviewer))} / 截止 ${i.dueDate}</p><p>${i.evidence.map(id=>fileLink(id)).join(' / ')}</p><h4>整改与复核记录</h4>${i.history.length?'':'<p>暂无处理记录</p>'}${i.history.map(h=>`<p class="block">${esc(actionNames[h.action]||h.action)} · ${esc(name(h.actor))} · ${esc(h.text)}<br><small>${esc(h.uploadedAt)}</small> ${h.evidence.map(id=>fileLink(id)).join(' / ')}</p>`).join('')}
 ${canReply(i)?`${evidencePanel(i.id)}<form data-reply="${i.id}" novalidate><label>整改完成情况<textarea name="text" required>${esc(replyDrafts[i.id]||'')}</textarea></label><p>请先在上方“证据与任务资料”上传并勾选整改照片或资料。当前已勾选 ${selectedEvidence(i.id).length} 份证据。</p><p data-reply-status role="status" aria-live="polite"></p><button>提交整改回复</button></form>`:''}
 ${handling&&(i.reviewerName?manager:i.reviewer===state.user.id)&&i.status==='review'?`<button data-issue="${i.id}" data-action="review" data-decision="close">复核销项</button> <button class="secondary" data-issue="${i.id}" data-action="review" data-decision="return">退回整改</button>`:''}
 </article>`).join('')||'<p>暂无问题</p>'}</section>
 ${active&&manager&&(t.fieldStatus||'collecting')==='collecting'?`<details><summary>关联原巡查报告，避免重复录入</summary>${form('import','导入同项目已提交报告',`<select name="reportId" id="reportChoice"><option>正在加载…</option></select><p>导入确认记录、照片和签名，并将隐患建立为待分派问题。</p>`,'导入报告')}</details>`:''}
 <details><summary>知识辅助查询</summary>${form('knowledge','查询专业提示',input('question','现场问题'),'查询')}<div id="knowledgeResult"></div></details>
 <section class="card"><h2>正式报告、成果交接与归档</h2>${t.handoverSummary?`<p class="block">${esc(t.handoverSummary)}</p>`:''}${t.receipt?`<p>接收意见：${esc(t.receipt.text)} · ${esc(t.receipt.decision)}</p>`:''}
 ${handling&&manager?form('deliver','生成正式报告和交接成果',`<label>交接摘要<textarea name="text" required></textarea></label><p>所有记录需确认，所有问题需复核销项。</p>`,'生成成果并交接'):''}
 ${t.status==='handover'&&(t.receiverName?manager:t.receiver===state.user.id)?form('accept',t.receiverName?'登记成果接收结果（平台负责人代录）':'接收确认',select('decision','处理结果',[{id:'accept',name:'确认接收'},{id:'return',name:'退回补充'}])+input('text','接收意见／退回原因'),'提交接收意见'):''}
 ${t.status==='accepted'&&manager?'<button id="archive">归档并生成最终任务包</button>':''}
 ${manager&&['archived','accepted'].includes(t.status)?'<button id="reopen" class="secondary">发起补正（保留历史版本）</button>':''}
 ${t.deliveries.map(d=>`<div class="entry"><strong>成果版本 v${d.version}</strong> · ${esc(d.createdAt)}<p class="flex"><a target="_blank" rel="noopener" href="/api/work/report/${d.id}">查看报告／打印 PDF</a><a href="/api/work/word/${d.id}">下载正式报告 Word</a><a href="/api/work/package/${d.id}">完整任务包 ZIP（交给 B）</a><a href="/api/work/snapshot/${d.id}">JSON 快照</a><a href="/api/work/issues/${d.id}">问题清单 CSV</a></p></div>`).join('')}</section>
 <details><summary>操作留痕（${t.events.length}）</summary>${t.events.map(x=>`<p>${esc(x.actorName)} · ${esc(actionNames[x.action]||x.action)} · ${esc(x.detail)}<br><small>${esc(x.uploadedAt)}</small></p>`).join('')}</details>`;
}
function selectedEvidence(scope=''){return evidence.filter(e=>e.selected!==false&&(e.issueId||'')===scope).map(e=>e.id)}
function bindDetail(t){
 document.getElementById('back').onclick=()=>{taskId='';draft=null;evidence=[];render()};
 const receiveForm=document.getElementById('receiveField');
 if(receiveForm){
  receiveForm.noValidate=true;
  receiveForm.onsubmit=e=>{e.preventDefault();run(async()=>{
   const status=document.getElementById('receiveStatus'),d=formData(receiveForm);
   try{
    if(!d.decision)throw Error('请选择接收或退回');
    if(d.decision==='accept'&&!t.receiver&&!t.receiverName&&!d.receiverName?.trim())throw Error('请填写最终成果接收人姓名');
    if(d.decision==='return'&&!d.text.trim())throw Error('请填写退回原因');
    if(d.decision==='accept'&&!d.text.trim())d.text='现场材料已接收';
    status.textContent='正在提交处理结果…';
    await action('receive-field',d);
   }catch(error){status.textContent=error.message;status.className='error';throw error}
  })};
 }
 bindForm('start',()=>action('start',{checklist:t.scenario.checklist}));
 bindForm('record',async d=>{if(d.confirm&&!confirm('确认记录内容无误？确认后不可直接修改。'))return;await action('record',{...d,id:draft?.id,type:d.type,confirm:!!d.confirm,evidence:[...new Set([...(draft?.evidence||[]),...selectedEvidence()])]});draft=null;render()});
 root.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{draft=structuredClone(t.records.find(r=>r.id===b.dataset.edit));render();document.getElementById('record')?.scrollIntoView({behavior:'smooth'})});
 bindForm('issue',d=>action('issue',{...d,evidence:selectedEvidence()}));
 root.querySelectorAll('[data-reply]').forEach(f=>{
  const id=f.dataset.reply,textarea=f.elements.text;
  textarea.oninput=()=>{replyDrafts[id]=textarea.value};
  f.onsubmit=e=>{e.preventDefault();run(async()=>{
   const status=f.querySelector('[data-reply-status]');replyDrafts[id]=textarea.value;
   try{
    const text=textarea.value.trim(),attachments=selectedEvidence(id);
    if(!text)throw Error('请填写整改完成情况');
    if(t.scenario.workflow.requireEvidence&&!attachments.length)throw Error('尚未提交：请先在上方“证据与任务资料”上传并勾选整改证据，填写内容已保留。');
    status.className='';status.textContent='正在保存整改回复…';
    await action('reply',{issueId:id,text,evidence:attachments});
    delete replyDrafts[id];
    toast('整改回复已保存，记录已显示在该问题下方，当前待复核');
   }catch(error){status.className='error';status.textContent=error.message;throw error}
  })};
 });
 root.querySelectorAll('[data-issue]').forEach(b=>b.onclick=()=>{const text=prompt(b.dataset.action==='reply'?'填写整改回复':'填写复核意见');if(text)run(()=>action(b.dataset.action,{issueId:b.dataset.issue,decision:b.dataset.decision,text,evidence:selectedEvidence()}))});
 root.querySelectorAll('[data-reassign]').forEach(f=>{
  f.noValidate=true;
  f.onsubmit=e=>{e.preventDefault();run(async()=>{
   const status=f.querySelector('[data-reassign-status]');
   try{
    const d=formData(f);
    for(const [key,label] of [['assigneeName','整改人姓名'],['reviewerName','复核人姓名'],['dueDate','整改期限']]){
     d[key]=(d[key]||'').trim();if(!d[key])throw Error('请填写'+label);
    }
    if(d.assigneeName.length>100||d.reviewerName.length>100)throw Error('人员姓名不能超过100字');
    if(t.scenario.workflow.separateReviewer&&d.assigneeName===d.reviewerName)throw Error('整改人和复核人必须不同');
    if(!f.elements.dueDate.validity.valid)throw Error('请填写有效的整改期限');
    d.text=d.text.trim()||'平台分派整改与复核';
    status.className='';status.textContent='正在保存分派…';
    await action('reassign',{...d,issueId:f.dataset.reassign});
    toast('分派已保存，可在问题下方提交整改回复');
   }catch(error){status.className='error';status.textContent=error.message;throw error}
  })};
 });
 bindForm('deliver',d=>action('deliver',d));bindForm('accept',d=>action('accept',d));
 const reopen=document.getElementById('reopen');if(reopen)reopen.onclick=()=>{const text=prompt('填写补正原因；任务将退回现场补充，保留全部历史成果');if(text)run(()=>action('reopen',{text}))};
 const archive=document.getElementById('archive');if(archive)archive.onclick=()=>{if(confirm('归档后只读，是否继续？'))run(()=>action('archive'))};
 bindForm('import',d=>action('import-report',d));
 const reports=document.getElementById('reportChoice');if(reports)api('/api/state').then(s=>{if(!reports.isConnected)return;reports.innerHTML=s.reports.filter(r=>r.projectId===t.projectId&&r.status==='submitted').map(r=>`<option value="${r.id}">${esc(r.number+' '+r.date+' '+r.inspector)}</option>`).join('')||'<option value="">无同项目正式报告</option>'}).catch(e=>toast(e.message));
 root.querySelectorAll('[data-files]').forEach(files=>files.onchange=()=>run(async()=>{const recordForm=document.getElementById('record');if(recordForm){const values=formData(recordForm);draft={...draft,...values,evidence:draft?.evidence||[]}}for(const file of files.files){if(file.size>10*1024*1024)throw Error('文件不能超过10MB');const base64=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=reject;reader.readAsDataURL(file)});evidence.push({...await post('upload',{projectId:t.projectId,name:file.name,base64,occurredAt:new Date().toISOString()}),issueId:files.dataset.files})}render();toast('文件已上传，请勾选后保存资料或提交整改回复') }));
 root.querySelectorAll('[data-evidence]').forEach(el=>el.onchange=()=>{evidence.find(e=>e.id===el.dataset.evidence).selected=el.checked});
 root.querySelectorAll('[data-materials]').forEach(materials=>materials.onclick=()=>run(()=>action('materials',{evidence:[...new Set([...t.materials,...selectedEvidence(materials.dataset.materials)])]})));
 root.querySelectorAll('[data-recognize]').forEach(b=>b.onclick=()=>run(async()=>{const r=await post('recognize',{taskId:t.id,evidenceId:b.dataset.recognize,kind:b.dataset.kind});const textarea=document.querySelector('#record textarea');if(r.text&&textarea)textarea.value+=(textarea.value?'\n':'')+r.text;toast(r.message||'提取内容已加入草稿，请人工核对')}));
 bindForm('knowledge',async d=>{const r=await post('knowledge',{...d,taskId:t.id});document.getElementById('knowledgeResult').innerHTML=`<p class="notice">${esc(r.message||'查询结果仅供核对参考')}</p>${(r.items||[]).map(x=>`<article class="card"><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p><small>${esc(x.reference)}</small></article>`).join('')}`});
}
refresh().catch(()=>login());
