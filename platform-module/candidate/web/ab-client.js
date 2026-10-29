/* A-owned controls; B remains the sole authority for job and retrospective state. */
(() => {
  'use strict';
  const base = new URL('.', document.currentScript.src).pathname.replace(/\/$/, '');
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const statusNames = {queued:'排队中',fetching:'取件中',validating:'校验中',processing:'处理中',ready:'已就绪',failed:'失败',withdrawn:'已撤回',not_created:'未生成'};
  let actor, checking=false, unavailable=false;
  async function request(path, body, key) {
    const headers = {};
    if (body !== undefined) {
      const tokenResponse = await fetch(base+'/api/csrf-token', {credentials:'same-origin'});
      if (!tokenResponse.ok) throw Error('登录已失效，请返回小察重新登录');
      headers['X-CSRF-Token'] = (await tokenResponse.json()).csrf_token;
      headers['Content-Type'] = 'application/json';
      headers['Idempotency-Key'] = key;
    }
    const response = await fetch(base+path, {method:body===undefined?'GET':'POST',headers,
      credentials:'same-origin',cache:'no-store',body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
    const result = await response.json();
    if (!response.ok) throw Object.assign(Error(result.message||result.error||'服务暂不可用'), {status:response.status});
    return result;
  }
  const api = '/b/integration/v1/a-imports';
  function pendingKey(meta, action) {
    return ['ab-v1',actor.subject_id,meta.delivery_id,meta.delivery_version,action].join(':');
  }
  async function mutate(meta, action, path, body) {
    const storageKey = pendingKey(meta, action);
    let pending = JSON.parse(sessionStorage.getItem(storageKey)||'null');
    if (!pending) {
      pending = {key:crypto.randomUUID(),body};
      sessionStorage.setItem(storageKey,JSON.stringify(pending));
    }
    try {
      const result = await request(path,pending.body,pending.key);
      sessionStorage.removeItem(storageKey);
      return result;
    } catch (error) {
      // Definite client rejection can be corrected; timeouts retain the same operation.
      if (error.status && error.status < 500 && error.status !== 429) sessionStorage.removeItem(storageKey);
      throw error;
    }
  }
  async function load(element) {
    element.textContent = '正在查询成果接入状态…';
    try {
      const {meta,permissions} = await request('/api/work/integration-delivery/'+encodeURIComponent(element.dataset.abDelivery));
      const query = new URLSearchParams({project_id:meta.project_id,delivery_id:meta.delivery_id,delivery_version:meta.delivery_version});
      const list = await request(api+'?'+query);
      const job = list.items?.[0];
      const buttons = [];
      const add = (action,label) => buttons.push(`<button class="secondary small" data-ab-action="${action}">${label}</button>`);
      if (!job && meta.eligible && permissions.includes('imports.create')) add('create','接入知识中心');
      if (job?.status==='failed' && meta.eligible && permissions.includes('imports.retry')) add('retry','重试接入');
      if (job?.status==='ready' && meta.eligible && job.capabilities?.can_generate_retrospective && permissions.includes('retrospective.generate')) add('retrospectives','生成复盘');
      if (job && job.status!=='withdrawn' && permissions.includes('imports.withdraw')) add('withdraw','撤回 B 接入');
      const warning = [...(job?.warnings||[]).map(x=>x.message),...(job?.missing_fields||[]).map(x=>typeof x==='string'?x:JSON.stringify(x))];
      element.innerHTML = `<p>知识中心：${job?esc(statusNames[job.status]||job.status):'尚未接入'}${!meta.eligible?' · '+esc(meta.ineligible_reason||'不符合接入条件'):''}</p>`+
        (job?`<p>复盘：${esc(statusNames[job.retrospective_status]||job.retrospective_status)}</p>`:'')+
        (warning.length?`<p class="muted">资料提示：${esc(warning.join('；'))}</p>`:'')+
        `<div class="row">${buttons.join('')}<button class="secondary small" data-ab-action="refresh">刷新状态</button>`+
        (job?`<a href="${base}/b/#/imports/${encodeURIComponent(job.import_id)}">处理详情</a>`:'')+
        (job?.retrospective_id && job.retrospective_status==='ready' && meta.eligible && permissions.includes('retrospective.read')?`<a href="${base}/b/#/retrospectives/${encodeURIComponent(job.retrospective_id)}">查看复盘</a>`:'')+'</div><p role="status" data-ab-message></p>';
      element.querySelectorAll('[data-ab-action]').forEach(button => button.onclick=async () => {
        element.querySelectorAll('button').forEach(b=>b.disabled=true);
        try {
          const action=button.dataset.abAction;
          if (action!=='refresh') {
            let body=action==='create'?{source_system:'a',project_id:meta.project_id,task_id:meta.task_id,delivery_id:meta.delivery_id,delivery_version:meta.delivery_version}:{expected_version:job.version};
            if (action==='withdraw') {
              const reason=prompt('填写撤回原因：只撤回 B 接入，不修改 A 原始成果');
              if (!reason?.trim()) return;
              body.reason=reason.trim();
            }
            await mutate(meta,action,action==='create'?api:api+'/'+encodeURIComponent(job.import_id)+'/'+action,body);
          }
          await load(element);
        } catch(error) {
          element.querySelector('[data-ab-message]').textContent=error.message+'；可刷新确认，结果未知时再次操作将复用原请求。';
        } finally {element.querySelectorAll('button').forEach(b=>b.disabled=false);}
      });
    } catch(error) {
      element.textContent='知识中心状态暂不可用：'+error.message;
      const button=document.createElement('button');button.className='secondary small';button.textContent='重试查询';button.onclick=()=>load(element);element.append(button);
    }
  }
  function scan() {
    if (!actor) {
      if (!checking && !unavailable && document.querySelector('[data-ab-delivery]')) {
        checking=true;
        request('/api/work/integration-context').then(value=>{actor=value;scan();})
          .catch(()=>{unavailable=true;}).finally(()=>{checking=false;});
      }
      return;
    }
    document.querySelectorAll('[data-ab-delivery]:not([data-ab-loaded])').forEach(element=>{
      element.dataset.abLoaded='1';load(element);
    });
  }
  // A legacy deployment returns 404; controls activate only with explicit v1 configuration.
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
  scan();
})();
