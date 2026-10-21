import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, ArrowRight, CheckCircle2, ChevronRight, ClipboardList, Download, FileCheck2,
  FolderLock, LayoutDashboard, LoaderCircle, Play, RefreshCw, ShieldCheck, Users, X, AlertCircle } from 'lucide-react';
import './style.css';
import { Ingestion } from './Ingestion';
import { Knowledge } from './Knowledge';
import { Retrieval } from './Retrieval';
import { TaskPackages } from './TaskPackages';

type Project = { id: string; name: string; roles: string[]; can_run: boolean; can_manage: boolean };
type Me = { id: string; name: string; subject: string; mode: string; projects: Project[] };
type Job = { id: string; title: string; kind: string; project_id: string; status: string; attempts: number;
  progress: number; result_ref: string | null; error: string | null; row_version: number; created_at: string; updated_at: string };
type Binding = { id: string; user_id: string; project_id: string; role: string; row_version: number };
type Access = { users: { id: string; name: string; authorized_projects: string[] }[];
  projects: { id: string; name: string }[]; bindings: Binding[] };

const statuses: Record<string, string> = { queued: '等待处理', running: '正在处理', retrying: '自动重试中', succeeded: '已完成', failed: '处理失败' };
const roles: Record<string, string> = { admin: '管理员', processor: '资料加工', reviewer: '内容审核', teacher: '培训教员', learner: '学习成员', a_service: '模拟A服务' };
const projectNames: Record<string, string> = { 'demo-airport': '机场检查 · 演示', 'demo-metro': '地铁监护 · 演示' };
const fmt = (date: string) => new Date(date).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
const profiles = [['admin', '本地管理员'], ['processor', '资料加工员'], ['learner', '新成员'], ['outsider', '其他项目成员']];

function App() {
  const [identity, setIdentity] = useState(localStorage.getItem('b01-identity') || 'admin');
  const [path, setPath] = useState(location.pathname);
  const [governanceOpen, setGovernanceOpen] = useState(['/sources','/imports','/records'].some(p => location.pathname.startsWith(p)));
  const isRetrieval = ['/search','/releases','/knowledge/library'].includes(path) || /^\/knowledge\/[^/]+$/.test(path) && path !== '/knowledge/drafts';
  const isKnowledge = !isRetrieval && ['/quality','/knowledge','/reviews'].some(p => path.startsWith(p));
  const isPackages = path.startsWith('/task-packages');
  const isIngestion = ['/sources', '/imports', '/records'].some(p => path.startsWith(p));
  const [me, setMe] = useState<Me | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [online, setOnline] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [status, setStatus] = useState('');
  const [kind, setKind] = useState('');
  const [cursor, setCursor] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [selected, setSelected] = useState<Job | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [project, setProject] = useState('demo-airport');
  const [scenario, setScenario] = useState('success');
  const [access, setAccess] = useState<Access | null>(null);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('processor');
  const [grantProject, setGrantProject] = useState('demo-airport');
  const [audit, setAudit] = useState<{ id: string; action: string; project_id: string; created_at: string }[]>([]);

  async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch('/api/v1' + url, {
      ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer dev-${identity}`, ...options.headers }
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `请求失败（${response.status}），请刷新后重试。`);
    }
    return response.json();
  }

  const navigate = (url: string) => {
    window.history.pushState({}, '', url); setPath(url.split('?')[0]); setError(''); setSelected(null);
    setCursor(''); setHistory([]);
  };
  useEffect(() => { const fn = () => setPath(location.pathname); window.addEventListener('popstate', fn);
    return () => window.removeEventListener('popstate', fn); }, []);
  useEffect(() => {
    let stale = false;
    setLoading(true); setError(''); setMe(null); setAccess(null); setJobs([]); setAudit([]);
    async function load() {
      try {
        const current = await api<Me>('/me');
        if (stale) return;
        setMe(current);
        const health = await api<{ worker_online: boolean }>('/health');
        if (stale) return;
        setOnline(health.worker_online);
        if (isIngestion || isKnowledge || isRetrieval || isPackages) return;
        if (path === '/settings/access') {
          if (!current.projects.some(p => p.can_manage)) return;
          const [a, logs] = await Promise.all([api<Access>('/access'), api<{ items: typeof audit }>('/audit-events?limit=10')]);
          if (stale) return;
          setAccess(a); setAudit(logs.items);
          setUserId(prev => a.users.some(u => u.id === prev) ? prev : a.users[0]?.id || '');
        } else {
          const [list, dash] = await Promise.all([
            api<{ items: Job[]; next_cursor: string | null }>(`/jobs?limit=12${kind ? `&kind=${kind}` : ''}${status ? `&status=${status}` : ''}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
            api<{ counts: Record<string, number> }>('/dashboard')
          ]);
          if (stale) return;
          setJobs(list.items); setNextCursor(list.next_cursor); setCounts(dash.counts);
        }
      } catch (e) { if (!stale) setError((e as Error).message); }
      finally { if (!stale) setLoading(false); }
    }
    void load();
    return () => { stale = true; };
  }, [identity, path, status, kind, cursor, refresh]);

  useEffect(() => {
    if (!me || path === '/settings/access' || isIngestion || isKnowledge || isRetrieval || isPackages) return;
    let stale = false;
    const timer = window.setInterval(async () => {
      try {
        const [list, dash, health] = await Promise.all([
          api<{ items: Job[]; next_cursor: string | null }>(`/jobs?limit=12${kind ? `&kind=${kind}` : ''}${status ? `&status=${status}` : ''}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`),
          api<{ counts: Record<string, number> }>('/dashboard'), api<{ worker_online: boolean }>('/health')
        ]);
        if (stale) return;
        setJobs(list.items); setNextCursor(list.next_cursor); setCounts(dash.counts); setOnline(health.worker_online);
        setSelected(prev => prev ? list.items.find(j => j.id === prev.id) || prev : null);
        setError('');
      } catch (e) { if (!stale) { setError((e as Error).message); setOnline(false); } }
    }, 2000);
    return () => { stale = true; clearInterval(timer); };
  }, [identity, path, status, kind, cursor, me?.id]);

  const runAction = async (fn: () => Promise<void>) => {
    setBusy(true); setError(''); setNotice('');
    try { await fn(); setRefresh(v => v + 1); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  };
  const create = () => runAction(async () => {
    await api('/jobs', { method: 'POST', headers: { 'Idempotency-Key': crypto.randomUUID() },
      body: JSON.stringify({ title: '演示资料完整性检查', project_id: project, scenario, duration_seconds: 6 }) });
    setShowCreate(false); setNotice('任务已保存，处理服务会自动执行。'); navigate('/jobs');
  });
  const retry = (job: Job) => runAction(async () => {
    await api(`/jobs/${job.id}/retry`, { method: 'POST', headers: { 'Idempotency-Key': crypto.randomUUID() },
      body: JSON.stringify({ row_version: job.row_version }) });
    setNotice('已提交重试，原任务和来源保持不变。');
  });
  const download = (job: Job) => runAction(async () => {
    const response = await fetch(`/api/v1/assets/${job.result_ref}/content`, { headers: { Authorization: `Bearer dev-${identity}` } });
    if (!response.ok) { const value = await response.json(); throw new Error(value.message); }
    const link = document.createElement('a'); const url = URL.createObjectURL(await response.blob());
    link.href = url; link.download = `演示检查结果-${job.id.slice(0, 8)}.txt`; link.click(); URL.revokeObjectURL(url);
    setNotice('演示结果已下载。');
  });
  const canRun = me?.projects.some(p => p.can_run);
  const canManage = me?.projects.some(p => p.can_manage);
  const title = isPackages ? 'A任务包接入' : isRetrieval ? (path === '/releases' ? '知识发布管理' : path === '/search' ? '知识检索' : '已发布知识库') : isKnowledge ? '知识加工与审核' : isIngestion ? (path.startsWith('/sources') ? '历史数据来源' : path.startsWith('/imports') ? '历史项目' : '风险数据') : path === '/settings/access' ? '成员与权限' : path === '/jobs' ? '处理任务' : '我的工作台';
  const activeCount = (counts.queued || 0) + (counts.running || 0) + (counts.retrying || 0);

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><ShieldCheck size={26} /></span><div>工程风险<span>知识与复盘培训中心</span></div></div>
      <div className="workspace-label">B模块 / 开发工作区</div>
      <nav aria-label="主导航">
        {[['/workbench', LayoutDashboard, '我的工作台'], ['/jobs', ClipboardList, '处理任务']].map(([url, Icon, label]) => {
          const I = Icon as typeof LayoutDashboard;
          return <button key={String(url)} aria-label={String(label)} className={path === url || (url === '/workbench' && path === '/') ? 'nav-item active' : 'nav-item'} onClick={() => navigate(String(url))}><I size={19}/><span>{String(label)}</span><ChevronRight size={15}/></button>;
        })}
        <button className={`nav-item governance-toggle ${isIngestion ? 'active-group' : ''}`} aria-label="历史数据治理" aria-expanded={governanceOpen} aria-controls="governance-menu" onClick={() => setGovernanceOpen(v => !v)}><FolderLock size={19}/><span>历史数据治理</span><ChevronRight className={governanceOpen ? 'expanded' : ''} size={15}/></button>
        {governanceOpen && <div id="governance-menu" className="subnav">{[['/sources','数据来源'],['/imports','历史项目'],['/records','风险数据']].map(([url,label]) => <button key={url} aria-label={label} className={path.startsWith(url) ? 'active' : ''} onClick={() => navigate(url)}>{label}</button>)}</div>}
        <button className={isKnowledge ? 'nav-item active' : 'nav-item'} onClick={() => navigate('/quality')} aria-label="知识加工与审核"><FileCheck2 size={19}/><span>知识加工与审核</span><ChevronRight size={15}/></button>
        <button className={isRetrieval ? 'nav-item active' : 'nav-item'} onClick={() => navigate('/knowledge/library')} aria-label="知识库与检索"><FileCheck2 size={19}/><span>知识库与检索</span><ChevronRight size={15}/></button>
        <button className={isPackages ? 'nav-item active' : 'nav-item'} onClick={() => navigate('/task-packages')} aria-label="A任务包接入"><FileCheck2 size={19}/><span>A任务包接入</span><ChevronRight size={15}/></button>
        <button className={path === '/settings/access' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('/settings/access')} aria-label="成员与权限"><Users size={19}/><span>成员与权限</span><ChevronRight size={15}/></button>
      </nav>
      <div className="scope-card"><FolderLock size={19} /><strong>项目范围隔离</strong><p>记录、文件和操作权限<br />随当前身份实时检查。</p></div>
      <div className="sidebar-bottom"><span className="dot" />本地开发 · B05<span className="version">v0.5</span></div>
    </aside>
    <div className="main-shell">
      <header className="topbar"><div className="breadcrumb">工程风险知识中心 <ChevronRight size={14} /><strong>{title}</strong></div>
        <div className="identity"><span className="demo-tag">模拟身份</span><select aria-label="切换模拟身份" value={identity} onChange={e => {
          localStorage.setItem('b01-identity', e.target.value); setIdentity(e.target.value); setSelected(null); setCursor(''); setHistory([]); setNotice('');
        }}>{profiles.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></div>
      </header>
      <main>
        <div className="page-heading"><div><div className="eyebrow">工作空间</div><h1>{title}</h1>
          <p>{isPackages ? '接收作业快照，核对事件、证据和版本，减少重复准备资料。' : isRetrieval ? '固定审核版本发布，以项目权限检索知识并打开来源。' : isKnowledge ? '复用来源证据生成候选，核查质量问题后逐版本审核。' : isIngestion ? '一次接入模拟资料，保留原文、治理生效值与来源证据。' : path === '/settings/access' ? '按项目分配角色，保留每次授权与撤销的记录。' : '查看处理进度、定位失败任务，保留每一次执行结果。'}</p></div>
          <div className="heading-actions"><button className="button ghost" onClick={() => setRefresh(v => v + 1)} disabled={loading}><RefreshCw size={16} />刷新</button>
            {!isIngestion && !isKnowledge && !isRetrieval && !isPackages && path !== '/settings/access' && <button className="button primary" disabled={!canRun || busy} onClick={() => {
              setProject(me?.projects.find(p => p.can_run)?.id || 'demo-airport'); setShowCreate(true);
            }}><Play size={16} />运行演示检查</button>}</div>
        </div>
        {!isIngestion && !isKnowledge && !isRetrieval && !isPackages && <div className="mode-banner"><ShieldCheck size={18} /><div><strong>本地演示模式</strong><span>尚未接入A的真实身份或历史资料。所有输入均为明确标注的模拟数据，尚未接入真实工程资料。</span></div></div>}
        {error && <div className="feedback error" role="alert"><AlertCircle size={18} />{error}<button onClick={() => setRefresh(v => v + 1)}>重新加载</button></div>}
        {notice && <div className="feedback success" role="status"><CheckCircle2 size={18} />{notice}<button aria-label="关闭提示" onClick={() => setNotice('')}><X size={16} /></button></div>}
        {loading ? <div className="loading"><LoaderCircle className="spin" size={24} /><span>正在读取工作区…</span></div> :
          isPackages ? <TaskPackages key={identity} identity={identity} path={path} navigate={navigate} projects={me?.projects || []} /> :
          isRetrieval ? <Retrieval key={identity} identity={identity} path={path} navigate={navigate} projects={me?.projects || []} /> :
          isKnowledge ? <Knowledge key={identity} api={api} path={path} navigate={navigate} projects={me?.projects || []} identity={identity} /> :
          isIngestion ? <Ingestion key={identity} api={api} path={path} navigate={navigate} projects={me?.projects || []} identity={identity} /> :
          path === '/settings/access' ? !canManage ? <section className="panel empty"><FolderLock size={38} /><h2>当前身份没有管理权限</h2><p>可以切换到本地管理员验证授权流程。后端同样会拒绝越权请求。</p></section> :
            access && <div className="access-layout">
              <section className="panel"><div className="panel-heading"><h2>项目角色</h2><span>{access.bindings.length} 项绑定</span></div>
                <div className="table-wrap"><table><thead><tr><th>成员</th><th>项目</th><th>角色</th><th>操作</th></tr></thead><tbody>
                  {access.bindings.map(b => <tr key={b.id}><td><strong>{access.users.find(u => u.id === b.user_id)?.name}</strong></td>
                    <td>{projectNames[b.project_id]}</td><td><span className="role-tag">{roles[b.role]}</span></td>
                    <td>{b.role === 'admin' ? <span className="muted">初始化管理</span> : <button className="text-button danger" disabled={busy}
                      onClick={() => { if (confirm('撤销后，该成员在此项目的对应能力将立即失效。继续？')) void runAction(async () => {
                        await api(`/role-bindings/${b.id}`, { method: 'DELETE', body: JSON.stringify({ row_version: b.row_version }) });
                        setNotice('角色已撤销。');
                      }); }}>撤销</button>}</td></tr>)}
                </tbody></table></div>
                <div className="panel-footer"><FolderLock size={15} />B内角色不能扩大来源系统授予的项目范围。</div>
              </section>
              <section className="panel grant-panel"><h2>添加项目角色</h2>
                <label>成员<select value={userId} onChange={e => setUserId(e.target.value)}>{access.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></label>
                <label>项目<select value={grantProject} onChange={e => setGrantProject(e.target.value)}>{access.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
                <label>角色<select value={role} onChange={e => setRole(e.target.value)}>{Object.entries(roles).filter(([k]) => k !== 'admin' && k !== 'a_service').map(([k, v]) => <option value={k} key={k}>{v}</option>)}</select></label>
                <button className="button primary" disabled={busy || !userId} onClick={() => void runAction(async () => {
                  await api('/role-bindings', { method: 'POST', body: JSON.stringify({ user_id: userId, project_id: grantProject, role }) });
                  setNotice('角色已添加。');
                })}>添加角色<ArrowRight size={16} /></button>
                <p className="small-note">每次变更都会记录操作者。重复绑定或超出项目范围会被拒绝。</p>
              </section>
              <section className="panel audit-panel"><div className="panel-heading"><h2>最近操作</h2><span>按当前管理范围展示</span></div>
                {audit.length ? audit.map(a => <div className="audit-row" key={a.id}><span className="audit-point" /><strong>{{ job_created: '创建演示任务', job_retried: '重试任务', role_granted: '添加角色', role_revoked: '撤销角色' }[a.action] || a.action}</strong><span>{projectNames[a.project_id]}</span><time>{fmt(a.created_at)}</time></div>) : <p className="empty-inline">暂无操作记录。</p>}
              </section>
            </div> :
            <>
              <section className="metrics" aria-label="任务概况">
                <div className="metric"><span>处理中</span><strong>{activeCount}</strong><small>包含等待与自动重试</small></div>
                <div className="metric"><span>已完成</span><strong>{counts.succeeded || 0}</strong><small>结果可查看、可下载</small></div>
                <div className="metric"><span>待处理失败</span><strong className={counts.failed ? 'danger-color' : ''}>{counts.failed || 0}</strong><small>保留原因，可手动重试</small></div>
                <div className="metric service"><span>处理服务</span><strong><i className={`dot ${online ? 'green' : 'orange'}`} />{online ? '在线' : '未连接'}</strong><small>{online ? '可自动执行已提交任务' : '任务会保留，等待服务恢复'}</small></div>
              </section>
              <section className="panel jobs-panel">
                <div className="panel-heading"><div><h2>{path === '/jobs' ? '任务列表' : '最近处理任务'}</h2><span>仅展示当前身份可访问的项目</span></div>
                  <select aria-label="任务类型筛选" value={kind} onChange={e => { setKind(e.target.value); setCursor(''); setHistory([]); }}>
                    <option value="">全部类型</option><option value="demo_check">演示检查</option><option value="source_import">历史数据接入</option><option value="knowledge_generation">知识候选生成</option><option value="release_build">发布索引构建</option><option value="task_package_import">A任务包接入</option></select>
                  <select aria-label="任务状态筛选" value={status} onChange={e => { setStatus(e.target.value); setCursor(''); setHistory([]); }}>
                    <option value="">全部状态</option>{Object.entries(statuses).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                {!jobs.length ? <div className="empty"><FileCheck2 size={42} /><h2>{status ? '没有符合条件的任务' : '还没有处理任务'}</h2>
                  <p>{status ? '切换筛选条件查看其他任务。' : canRun ? '运行一次演示检查，验证提交、执行和结果保存的完整过程。' : '当前身份可查看项目任务，请等待加工人员提交。'}</p>
                  {canRun && !status && <button className="button secondary" onClick={() => setShowCreate(true)}>开始一次演示<ArrowRight size={16} /></button>}</div> :
                  <div className="table-wrap"><table><thead><tr><th>任务 / 项目</th><th>状态</th><th>进度</th><th>提交时间</th><th>操作</th></tr></thead><tbody>
                    {jobs.map(job => <tr key={job.id}><td><button className="job-title" onClick={() => setSelected(job)}>{job.title}</button><small>{projectNames[job.project_id]}<span className="subtle-separator">·</span>{job.kind === 'source_import' ? '历史项目接入' : job.kind === 'knowledge_generation' ? '知识候选生成' : job.kind === 'release_build' ? '发布索引构建' : job.kind === 'task_package_import' ? 'A任务包接入' : '演示任务'}</small></td>
                      <td><span className={`status ${job.status}`}><i />{statuses[job.status]}</span></td>
                      <td><div className="progress-cell"><div className="progress-track"><span style={{ width: `${job.progress}%` }} /></div><span>{job.progress}%</span></div></td>
                      <td className="muted nowrap">{fmt(job.created_at)}</td><td><div className="row-actions">{job.kind === 'source_import' && <button className="text-button" onClick={() => navigate('/imports')}>历史项目</button>}<button className="text-button" onClick={() => setSelected(job)}>详情</button>
                        {job.status === 'failed' && me?.projects.find(p => p.id === job.project_id)?.can_run && <button className="text-button" disabled={busy} onClick={() => void retry(job)}>重试任务</button>}
                        {job.result_ref && <button className="icon-button" aria-label="下载任务结果" disabled={busy} onClick={() => void download(job)}><Download size={17} /></button>}</div></td></tr>)}
                  </tbody></table></div>}
                <div className="panel-footer"><span>显示 {jobs.length} 条 · 任务状态自动更新</span><div className="pagination"><button disabled={!history.length} onClick={() => { setCursor(history[history.length - 1]); setHistory(history.slice(0, -1)); }}>上一页</button>
                  <button disabled={!nextCursor} onClick={() => { setHistory([...history, cursor]); setCursor(nextCursor || ''); }}>下一页</button></div></div>
              </section>
              {path !== '/jobs' && <section className="next-step"><div className="next-icon"><Activity size={22} /></div><div><h3>从真实记录开始，逐步形成可用知识</h3><p>现在可以配置模拟来源、预览字段和异常，再增量接入并核查证据。</p></div><button className="button secondary" onClick={() => navigate('/sources')}>打开数据接入<ArrowRight size={16} /></button></section>}
            </>}
        <footer className="footer">工程风险知识与复盘培训中心<span>仅限本机开发验证 · 真实身份接入待A确认</span></footer>
      </main>
    </div>
    {showCreate && <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="create-title">
      <div className="modal-heading"><h2 id="create-title">运行演示检查</h2><button className="icon-button" aria-label="关闭" onClick={() => setShowCreate(false)}><X size={20} /></button></div>
      <p>创建真实的后台任务，生成一份演示结果文件。不会读取原始工程资料。</p>
      <label>所属项目<select value={project} onChange={e => setProject(e.target.value)}>{me?.projects.filter(p => p.can_run).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      <label>验证场景<select value={scenario} onChange={e => setScenario(e.target.value)}><option value="success">正常完成</option><option value="fail_once">临时失败后自动重试</option><option value="manual_failure">失败后手动重试</option></select></label>
      {!online && <p className="warning-text">处理服务未连接，任务将保存并等待恢复。</p>}
      <div className="modal-actions"><button className="button ghost" onClick={() => setShowCreate(false)}>取消</button><button className="button primary" disabled={busy || !canRun} onClick={() => void create()}>{busy ? <LoaderCircle className="spin" size={16} /> : <Play size={16} />}提交任务</button></div>
    </section></div>}
    {selected && <div className="drawer-backdrop"><aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className="modal-heading"><h2 id="detail-title">任务详情</h2><button className="icon-button" aria-label="关闭详情" onClick={() => setSelected(null)}><X size={20} /></button></div>
      <span className={`status ${selected.status}`}><i />{statuses[selected.status]}</span><h3>{selected.title}</h3>
      <dl><dt>项目</dt><dd>{projectNames[selected.project_id]}</dd><dt>实际执行次数</dt><dd>{selected.attempts}</dd><dt>提交时间</dt><dd>{fmt(selected.created_at)}</dd><dt>最近更新</dt><dd>{fmt(selected.updated_at)}</dd><dt>任务编号</dt><dd className="mono">{selected.id}</dd></dl>
      {selected.error && <div className="detail-error"><strong>处理说明</strong><p>{selected.error}</p></div>}
      <p className="small-note">此为本地模拟数据任务，不代表实际工程检查。所有进度和结果均来自后台执行记录。</p>
      {selected.result_ref && <button className="button primary" disabled={busy} onClick={() => void download(selected)}><Download size={16} />下载演示结果</button>}
      {selected.status === 'failed' && me?.projects.find(p => p.id === selected.project_id)?.can_run && <button className="button primary" disabled={busy} onClick={() => void retry(selected)}><RefreshCw size={16} />重试任务</button>}
    </aside></div>}
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);
