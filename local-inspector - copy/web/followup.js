// Report-centre entry points share the existing, permission-checked workflow.
let lifecycleState={tasks:[],projects:[]};
const lifecycleLabels={active:'整改办理中',ready:'待执行',handover:'待成果接收',accepted:'待归档',archived:'已归档'};
function reportTask(id){return lifecycleState.tasks.find(t=>t.sourceReportId===id||t.records.some(r=>r.sourceReportId===id))}
function workflowLink(t,section,label){return `<a class="secondary" href="/work?task=${encodeURIComponent(t.id)}&section=${section}">${label}</a>`}
function followupButton(r){const t=reportTask(r.id);return t?workflowLink(t,t.status==='archived'?'archive':'rectification','整改复核 / 成果归档'):`<button class="secondary" data-followup-report="${e(r.id)}">办理整改复核与归档</button>`}
function followupEntry(r){
 const due=new Date();due.setDate(due.getDate()+7);
 return `<details><summary>${r.noHazard?'确认报告并进入成果办理':'发起整改复核'}</summary><form data-start-followup="${e(r.id)}"><p>确认接收这份已提交报告后，系统关联原始记录和照片，建立独立的后续办理任务。原报告保持不变。</p><label>最终成果接收人<input name="receiverName" maxlength="100" required></label><label>办理期限<input name="dueDate" type="date" value="${due.toLocaleDateString('sv-SE')}" required></label><button>确认接收报告并开始办理</button><p data-followup-status role="status"></p></form></details>`
}
function rectification(){
 const reports=state.reports.filter(r=>r.status==='submitted');
 const linked=new Set(reports.map(r=>reportTask(r.id)?.id).filter(Boolean));
 const cards=reports.map(r=>{const t=reportTask(r.id);return `<article class="card" id="followup-${e(r.id)}"><span class="tag">${t?lifecycleLabels[t.status]||'办理中':'待发起后续办理'}</span><h3>${e(r.project)}</h3><p>${e(r.number)} · ${e(r.date)} · ${r.issues.length} 条隐患</p>${t?`<p>${t.issues.filter(i=>i.status==='closed').length}/${t.issues.length} 条已销项 · ${t.issues.filter(i=>i.status==='review').length} 条待复核</p>${workflowLink(t,'rectification','进入整改复核')}`:followupEntry(r)}</article>`}).join('');
 const other=lifecycleState.tasks.filter(t=>!linked.has(t.id)).map(t=>`<article class="card"><span class="tag">${lifecycleLabels[t.status]||'办理中'}</span><h3>${e(t.title)}</h3><p>${t.issues.length} 条隐患</p>${workflowLink(t,'rectification','查看整改复核')}</article>`).join('');
 return `<h1>整改复核</h1><p class="muted">已提交巡查报告 → 分派整改 → 上传整改证据 → 复核销项；复核不通过可退回补充。</p>${cards+other||empty('暂无待办理报告','先在报告中心提交巡查报告。','<button data-go="reports">进入报告中心</button>')}`
}
function archives(){
 const tasks=lifecycleState.tasks;
 const pending=tasks.filter(t=>t.status!=='archived');const done=tasks.filter(t=>t.status==='archived');
 const card=t=>`<article class="card"><span class="tag">${lifecycleLabels[t.status]||'办理中'}</span><h3>${e(t.title)}</h3><p>${e(t.number)} · ${t.issues.filter(i=>i.status==='closed').length}/${t.issues.length} 条问题已销项${t.archivedAt?' · 归档时间 '+e(t.archivedAt):''}</p>${workflowLink(t,'archive',t.status==='archived'?'查看归档记录':t.status==='accepted'?'办理成果归档':'继续办理成果')}${t.status==='archived'&&t.deliveries.length?` <a href="/api/work/package/${encodeURIComponent(t.deliveries[t.deliveries.length-1].id)}">下载最终归档包</a> <a href="/api/work/word/${encodeURIComponent(t.deliveries[t.deliveries.length-1].id)}">下载最终报告</a>`:''}</article>`;
 return `<h1>成果归档</h1><p class="muted">问题全部复核销项后生成正式成果，登记接收意见，再归档保存最终版本。无隐患报告可直接进入成果办理。</p><h2>待归档（${pending.length}）</h2>${pending.map(card).join('')||'<p>暂无待归档任务。</p>'}<h2>已归档（${done.length}）</h2>${done.map(card).join('')||'<p>暂无已归档成果。</p>'}<p>报告尚未发起后续办理？<button class="linkbutton" data-go="rectification">前往整改复核</button></p>`
}
function bindFollowup(){
 app.querySelectorAll('[data-followup-report]').forEach(b=>b.onclick=()=>run(async()=>{await refresh();page='rectification';render();document.getElementById('followup-'+b.dataset.followupReport)?.scrollIntoView({block:'center'})}));
 app.querySelectorAll('[data-refresh-followup]').forEach(b=>b.onclick=()=>run(async()=>{await refresh();render()}));
 app.querySelectorAll('[data-start-followup]').forEach(f=>f.onsubmit=ev=>{ev.preventDefault();run(async()=>{const status=f.querySelector('[data-followup-status]');const button=f.querySelector('button');button.disabled=true;try{status.textContent='正在建立后续办理任务…';const d=Object.fromEntries(new FormData(f));const t=await api('/api/work/report-followup',{...d,reportId:f.dataset.startFollowup,requestId:Date.now()+'-'+Math.random()});location.href='/work?task='+encodeURIComponent(t.id)+'&section=rectification'}catch(err){status.textContent=err.message;throw err}finally{button.disabled=false}})});
}
