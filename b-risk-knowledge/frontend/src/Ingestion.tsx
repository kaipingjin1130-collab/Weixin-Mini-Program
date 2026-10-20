import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Database, FileSearch, RefreshCw, Upload, AlertCircle } from 'lucide-react';
import './ingestion.css';

type Api = <T>(url: string, options?: RequestInit) => Promise<T>;
type Project = { id: string; name: string; can_run: boolean; can_manage: boolean; roles: string[] };
type Source = { id: string; name: string; kind: string; project_id: string; namespace: string; mapping_version: string; mapping: Record<string, string>; cursor: { synced_at?: string } };
type Input = { asset_id: string; label: string; kind: string; project_id: string };
type Page<T> = { items: T[]; next_cursor: string | null };
type Counts = { total: number; processed: number; created: number; updated: number; skipped: number; failed: number; warning_rows: number; kinds: Record<string, number> };
type Batch = { id: string; source_name: string; source_id: string; counts: Counts; status: string; created_at: string };
type BatchDetail = Batch & { source: Source; input_hash: string; rule_version: string; progress: number; mapping: Record<string, string>; error: string | null; job_id: string; job_status: string; row_version: number; next_row: number | null; rows: { row_number: number; outcome: string; record_id: string | null; issues: string[] }[] };
type Report = {id:string; title:string; report_id:string; source_id:string; source_name:string; count:number; counts:Record<string,number>};
type RecordItem = { id: string; description: string; source_id: string; project_id: string; record_kind: string; quality_status: string; current_version: number; occurred_on: string | null; external_record_id: string };
type Evidence = { id: string; type: string; availability: string; asset_id: string | null; relation_confidence: string; locator: Record<string, unknown> };
type RecordDetail = RecordItem & { source: Source; selected_version: number; raw_fields: Record<string, unknown>; effective_fields: Record<string, unknown>; provenance: Record<string, unknown>; issues: string[]; document: { report_id: string; note: string }; versions: { version: number; content_hash: string; batch_id: string; created_at: string }[]; evidence: Evidence[]; links: { id: string; other_record_id: string; review_state: string; method: string; row_version: number }[] };
type Preview = { input_hash: string; total: number; warning_rows: number; failed_rows: number; mapping: Record<string, string>; raw_columns: string[]; preview: { row_number: number; external_id: string; effective_fields: Record<string, unknown>; issues: string[]; errors: string[] }[] };
const kindLabel: Record<string, string> = { csv: 'CSV数据', excel: 'Excel表格', governance_export: '治理结果导出', detail: '明细', review: '复查', summary: '汇总', source_row: '原始行', site_photo: '现场照片类型 · 模拟示意', text_screenshot: '文字截图类型 · 模拟示意' };
const statusLabel: Record<string, string> = { queued: '等待处理', running: '正在接入', failed: '接入中断', completed: '已完成', completed_with_errors: '完成 · 有异常', created: '新增', updated: '更新', skipped: '跳过', candidate: '待确认', confirmed: '已确认重复', rejected: '已排除', stale: '版本已变，需复核' };
const stamp = (s?: string) => s ? new Date(s).toLocaleString('zh-CN') : '尚未同步';
const orderedFields = (fields: Record<string, unknown>) => { const priority = ['description','隐患描述','record_id','来源记录ID','report_id','报告ID','project_id','项目ID','record_kind','记录类型','inspection_date','occurred_on','检查日期','images','图片关系']; const rank = (k: string) => priority.includes(k) ? priority.indexOf(k) : 100; return Object.entries(fields).sort(([a],[b]) => rank(a)-rank(b)); };
const display = (v: unknown) => typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v ?? '—');

function AuthImage({ asset, identity }: { asset: string; identity: string }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let stale = false; let objectUrl = '';
    fetch(`/api/v1/assets/${asset}/content`, { headers: { Authorization: `Bearer dev-${identity}` } })
      .then(async r => { if (!r.ok) throw new Error('图片不可访问或已撤回'); return r.blob(); })
      .then(blob => { objectUrl = URL.createObjectURL(blob); if (!stale) setUrl(objectUrl); else URL.revokeObjectURL(objectUrl); })
      .catch(e => { if (!stale) setError(e.message); });
    return () => { stale = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [asset, identity]);
  return error ? <p role="alert">{error}</p> : url ? <img className="evidence-image" src={url} alt="明确标注的模拟证据示意图，非真实工程现场" /> : <p>正在读取图片…</p>;
}

export function Ingestion({ api, path, navigate, projects, identity }: { api: Api; path: string; navigate: (url: string) => void; projects: Project[]; identity: string }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [inputs, setInputs] = useState<Input[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [view, setView] = useState('reports');
  const reportRequest = useRef(0);
  const [expandedReport, setExpandedReport] = useState('');
  const [reportRows, setReportRows] = useState<RecordItem[]>([]);
  const [reportNext, setReportNext] = useState<string | null>(null);
  const [reportError, setReportError] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [groups, setGroups] = useState(0);
  const [batch, setBatch] = useState<BatchDetail | null>(null);
  const [detail, setDetail] = useState<RecordDetail | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [sourceId, setSourceId] = useState(new URLSearchParams(location.search).get('source') || '');
  const [inputId, setInputId] = useState('');
  const [fail, setFail] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [filters, setFilters] = useState({ project_id: '', source_id: '', record_kind: '', quality_status: '', from_date: '', to_date: '' });
  const [cursor, setCursor] = useState('');
  const [next, setNext] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [version, setVersion] = useState('');
  const [rowAfter, setRowAfter] = useState(0);
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [newKind, setNewKind] = useState('csv');
  const [newName, setNewName] = useState('');
  const [namespace, setNamespace] = useState('');
  const [newProject, setNewProject] = useState(projects.find(p => p.can_run)?.id || 'demo-airport');
  const canRun = projects.some(p => p.can_run);
  const isRecordDetail = path.startsWith('/records/');
  const isBatchDetail = path.startsWith('/imports/') && path !== '/imports/new';
  const selectedSource = sources.find(s => s.id === sourceId);
  const filteredInputs = inputs.filter(i => i.kind === selectedSource?.kind && i.project_id === selectedSource?.project_id);

  useEffect(() => { setCursor(''); setHistory([]); setVersion(''); setRowAfter(0); setError(''); setNotice(''); setPreview(null); }, [path]);
  useEffect(() => {
    let stale = false;
    setLoading(true); setError(''); setDetail(null); setBatch(null);
    const query = new URLSearchParams(Object.entries(filters).filter(([,v]) => !!v));
    query.set('limit', '15'); if (cursor) query.set('cursor', cursor);
    async function load() {
      try {
        const [s, files] = await Promise.all([api<Page<Source>>('/sources?limit=100'), api<{ items: Input[] }>('/input-files')]);
        if (stale) return;
        setSources(s.items); setInputs(files.items);
        if (path === '/sources' || path === '/imports') {
          const b = await api<Page<Batch>>('/imports?limit=15' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : ''));
          if (stale) return; setBatches(b.items); setNext(b.next_cursor);
        } else if (isBatchDetail) {
          const b = await api<BatchDetail>(`${path}?after_row=${rowAfter}&only_issues=${onlyIssues}`);
          if (!stale) setBatch(b);
        } else if (isRecordDetail) {
          const d = await api<RecordDetail>(path + (version ? '?version=' + version : ''));
          if (!stale) setDetail(d);
        } else if (path === '/records') {
          const list = await api<Page<RecordItem> & { totals_by_kind: Record<string, number>; detail_groups_after_confirmed_links: number }>('/records?' + query);
          if (stale) return; setRecords(list.items); setNext(list.next_cursor); setTotals(list.totals_by_kind); setGroups(list.detail_groups_after_confirmed_links);
          if (view === 'reports') { const q = new URLSearchParams(query); q.delete('cursor'); if (cursor) q.set('after_id',cursor); const reportList = await api<Page<Report>>('/reports?'+q); if (stale) return; setReports(reportList.items); setNext(reportList.next_cursor); }
        }
      } catch (e) { if (!stale) setError((e as Error).message); }
      finally { if (!stale) setLoading(false); }
    }
    void load(); return () => { stale = true; };
  }, [path, filters, cursor, version, refresh, rowAfter, onlyIssues, view]);

  useEffect(() => {
    if (!isBatchDetail || !batch || !['queued', 'running'].includes(batch.status)) return;
    let stale = false;
    const timer = setInterval(() => {
      void api<BatchDetail>(`${path}?after_row=${rowAfter}&only_issues=${onlyIssues}`).then(b => { if (!stale) setBatch(b); }).catch(e => { if (!stale) setError(e.message); });
    }, 1500);
    return () => { stale = true; clearInterval(timer); };
  }, [path, batch?.status, rowAfter, onlyIssues]);

  useEffect(() => { reportRequest.current++; setExpandedReport(''); setReportRows([]); setReportNext(null); setReportError(''); }, [filters, view, path]);
  const expandReport = async (id: string, more = false) => {
    const request = ++reportRequest.current;
    if (!more && expandedReport === id) { setExpandedReport(''); setReportLoading(false); return; }
    if (!more) { setReportRows([]); setReportNext(null); }
    setExpandedReport(id); setReportLoading(true); setReportError('');
    const q = new URLSearchParams(Object.entries(filters).filter(([,v])=>!!v)); q.set('document_id',id); q.set('limit','15'); if (more && reportNext) q.set('cursor',reportNext);
    try { const rows = await api<Page<RecordItem>>('/records?'+q); if (request !== reportRequest.current) return; setReportRows(prev=>more?[...prev,...rows.items]:rows.items); setReportNext(rows.next_cursor); }
    catch(e) { if (request === reportRequest.current) setReportError((e as Error).message); } finally { if (request === reportRequest.current) setReportLoading(false); }
  };
  const action = async (fn: () => Promise<void>) => {
    setBusy(true); setError(''); setNotice('');
    try { await fn(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };
  const setup = () => action(async () => {
    for (const p of projects.filter(p => p.can_run)) {
      for (const kind of p.id === 'demo-airport' ? ['csv', 'excel', 'governance_export'] : ['csv']) {
        const ns = `mock-${p.id}-${kind}`;
        if (sources.some(s => s.namespace === ns && s.project_id === p.id)) continue;
        await api('/sources', { method: 'POST', body: JSON.stringify({ name: `${p.id === 'demo-airport' ? '机场' : '地铁'} · ${kindLabel[kind]}（模拟）`, namespace: ns, kind, project_id: p.id, mapping_template: kind === 'governance_export' ? 'governance-v1' : `${kind}-v1` }) });
      }
    }
    setNotice('模拟来源已配置。选择“开始接入”，字段映射会自动带入。'); setRefresh(v => v + 1);
  });
  const pagination = <div className="panel-footer"><span>按权限范围显示 · 使用稳定游标分页</span><div className="pagination"><button disabled={!history.length} onClick={() => { setCursor(history.at(-1) || ''); setHistory(history.slice(0,-1)); }}>上一页</button><button disabled={!next} onClick={() => { setHistory([...history, cursor]); setCursor(next || ''); }}>下一页</button></div></div>;
  const changeFilter = (key: string, value: string) => { setFilters({ ...filters, [key]: value }); setCursor(''); setHistory([]); };
  const download = (asset: string) => action(async () => {
    const r = await fetch(`/api/v1/assets/${asset}/content`, { headers: { Authorization: `Bearer dev-${identity}` } });
    if (!r.ok) { const body = await r.json(); throw new Error(body.message); }
    const url = URL.createObjectURL(await r.blob()); const a = document.createElement('a'); a.href = url; a.download = '模拟来源文件'; a.click(); URL.revokeObjectURL(url);
  });

  return <div className="ingestion">
    <div className="ingest-banner"><Database size={19} /><div><strong>模拟数据工作区</strong><span>三种接入器真实读取本地模拟文件。原文、人工生效值和来源版本分别保留。</span></div></div>
    {error && <div className="feedback error" role="alert"><AlertCircle size={18} />{error}<button onClick={() => setRefresh(v => v + 1)}>重新加载</button></div>}
    {notice && <div className="feedback success" role="status"><CheckCircle2 size={18} />{notice}</div>}
    <div className="ingest-toolbar"><div className="ingest-tabs"><button className={path === '/sources' ? 'selected' : ''} onClick={() => navigate('/sources')}>来源管理</button><button className={path.startsWith('/imports') ? 'selected' : ''} onClick={() => navigate('/imports')}>历史项目</button><button className={path.startsWith('/records') ? 'selected' : ''} onClick={() => navigate('/records')}>风险数据</button></div><button className="button ghost" onClick={() => setRefresh(v => v + 1)} disabled={loading}><RefreshCw size={15} />刷新</button></div>
    {loading ? <div className="loading">正在读取数据…</div> : path === '/sources' ? <>
      <section className="panel ingest-intro"><div><h2>配置一次，后续按变化接入</h2><p>使用来源命名空间保留身份，复用映射模板，无需逐条填写记录。</p></div><button className="button primary" disabled={busy || !canRun} onClick={() => void setup()}><Database size={16} />一键配置模拟来源</button></section>
      <div className="source-grid">{sources.map(s => <section className="panel source-card" key={s.id}><div className="source-top"><span className="source-icon"><Database size={22} /></span><span className="role-tag">{kindLabel[s.kind]}</span></div><h2>{s.name}</h2><p>{projects.find(p => p.id === s.project_id)?.name}</p><dl><dt>映射模板</dt><dd>{s.mapping_version}</dd><dt>最近同步</dt><dd>{stamp(s.cursor.synced_at)}</dd><dt>稳定命名空间</dt><dd>{s.namespace}</dd></dl><button className="button secondary" disabled={!projects.find(p => p.id === s.project_id)?.can_run} onClick={() => { setSourceId(s.id); setInputId(''); navigate('/imports/new?source=' + s.id); }}>开始接入<ArrowRight size={16} /></button></section>)}</div>
      {!sources.length && <div className="panel empty"><FileSearch size={38} /><h2>还没有配置来源</h2><p>点击上方按钮即可创建模拟来源，不需要准备或上传资料。</p></div>}
      {canRun && <details className="panel custom-source"><summary>手动配置来源（可选）</summary><div className="form-grid"><label>来源名称<input value={newName} onChange={e => setNewName(e.target.value)} /></label><label>命名空间<input placeholder="例如 mock-extra-csv" value={namespace} onChange={e => setNamespace(e.target.value)} /></label><label>类型<select value={newKind} onChange={e => setNewKind(e.target.value)}>{['csv','excel','governance_export'].map(k => <option key={k} value={k}>{kindLabel[k]}</option>)}</select></label><label>项目<select value={newProject} onChange={e => setNewProject(e.target.value)}>{projects.filter(p => p.can_run).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label></div><button className="button primary" disabled={busy || !newName || !namespace} onClick={() => void action(async () => { await api('/sources', { method: 'POST', body: JSON.stringify({name:newName, namespace, kind:newKind, project_id:newProject, mapping_template:newKind==='governance_export'?'governance-v1':`${newKind}-v1`}) }); setRefresh(v=>v+1); setNotice('来源已创建。'); })}>创建来源</button></details>}
    </> : path === '/imports/new' ? <>
      <section className="panel import-form"><div className="panel-heading"><div><h2>新建历史项目</h2><span>选择来源 → 预览映射与异常 → 后台增量接入</span></div></div><div className="form-body"><div className="form-grid"><label>数据来源<select aria-label="数据来源" value={sourceId} onChange={e => { setSourceId(e.target.value); setInputId(''); setPreview(null); }}><option value="">请选择</option>{sources.filter(s => projects.find(p => p.id === s.project_id)?.can_run).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>模拟输入文件<select aria-label="模拟输入文件" value={inputId} onChange={e => { setInputId(e.target.value); setPreview(null); }}><option value="">请选择</option>{filteredInputs.map(i => <option key={i.asset_id} value={i.asset_id}>{i.label}</option>)}</select></label></div><label className="check-label"><input type="checkbox" checked={fail} onChange={e => setFail(e.target.checked)} />模拟接入2条后中断，用于验证继续处理</label><button className="button secondary" disabled={busy || !sourceId || !inputId} onClick={() => void action(async () => { setPreview(await api<Preview>('/imports/preview', {method:'POST',body:JSON.stringify({source_id:sourceId,input_asset_id:inputId})})); })}><FileSearch size={16} />预览字段与异常</button></div></section>
      {preview && <><section className="metrics ingest-metrics"><div className="metric"><span>输入记录</span><strong>{preview.total}</strong></div><div className="metric"><span>原始字段</span><strong>{preview.raw_columns.length}</strong></div><div className="metric"><span>需核查行</span><strong>{preview.warning_rows}</strong></div><div className="metric"><span>不能接入行</span><strong>{preview.failed_rows}</strong></div></section><section className="panel"><div className="panel-heading"><h2>字段映射</h2><span>未映射字段仍完整保留在原始字段中</span></div><div className="mapping-grid">{Object.entries(preview.mapping).map(([k,v])=><div key={k}><code>{v}</code><ArrowRight size={13}/><strong>{k}</strong></div>)}</div></section><section className="panel preview-table"><div className="panel-heading"><h2>内容与异常预览</h2><span>预览不生成业务记录 · 最多展示20行</span></div><div className="table-wrap"><table><thead><tr><th>来源行 / 身份</th><th>生效描述</th><th>类型</th><th>异常</th></tr></thead><tbody>{preview.preview.map(r=><tr key={r.row_number}><td>{r.row_number}<small>{r.external_id || '缺少身份'}</small></td><td>{display(r.effective_fields.description)}</td><td>{kindLabel[String(r.effective_fields.record_kind)] || '—'}</td><td>{[...r.errors,...r.issues].join('；') || '通过'}</td></tr>)}</tbody></table></div><div className="submit-bar"><span>坏值保留；不符合项目范围的行会被拒绝。</span><button className="button primary" disabled={busy} onClick={() => void action(async () => { const result = await api<{id:string}>('/imports',{method:'POST',headers:{'Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({source_id:sourceId,input_asset_id:inputId,input_hash:preview.input_hash,fail_after:fail?2:null})}); navigate('/imports/'+result.id); })}><Upload size={16}/>{busy?'正在提交…':'提交接入'}</button></div></section></>}
    </> : path === '/imports' ? <section className="panel"><div className="panel-heading"><h2>历史项目</h2><button className="button primary" disabled={!canRun} onClick={()=>navigate('/imports/new')}>新建历史项目<ArrowRight size={15}/></button></div>{batches.length ? <div className="table-wrap"><table><thead><tr><th>来源 / 时间</th><th>状态</th><th>新增</th><th>更新</th><th>跳过</th><th>失败</th><th>操作</th></tr></thead><tbody>{batches.map(b=><tr key={b.id}><td><strong>{b.source_name}</strong><small>{stamp(b.created_at)}</small></td><td>{statusLabel[b.status]}</td>{['created','updated','skipped','failed'].map(k=><td key={k}>{b.counts[k as keyof Counts] as number}</td>)}<td><button className="text-button" onClick={()=>navigate('/imports/'+b.id)}>查看历史项目</button></td></tr>)}</tbody></table></div>:<div className="empty"><h2>还没有历史项目</h2><p>先配置来源，再选择模拟文件进行预览和接入。</p></div>}{pagination}</section>
    : isBatchDetail && batch ? <><button className="text-button back" onClick={()=>navigate('/imports')}><ArrowLeft size={15}/>返回历史项目</button><section className="panel batch-header"><div><span className="role-tag">{statusLabel[batch.status]}</span><h2>{batch.source.name}</h2><p>已处理 {batch.counts.processed} / {batch.counts.total} 条 · {batch.progress}%</p></div>{batch.job_status==='failed' && projects.find(p=>p.id===batch.source.project_id)?.can_run && <button className="button primary" disabled={busy} onClick={()=>void action(async()=>{await api(`/jobs/${batch.job_id}/retry`,{method:'POST',headers:{'Idempotency-Key':crypto.randomUUID()},body:JSON.stringify({row_version:batch.row_version})});setRefresh(v=>v+1);})}><RefreshCw size={16}/>继续未完成行</button>}</section>{batch.error && <div className="feedback error">{batch.error}</div>}<section className="metrics ingest-metrics">{['created','updated','skipped','failed'].map(k=><div className="metric" key={k}><span>{k==='failed'?'失败行':statusLabel[k]}</span><strong>{batch.counts[k as keyof Counts] as number}</strong></div>)}</section><section className="panel batch-meta"><div><span>实际输入SHA-256</span><code>{batch.input_hash}</code></div><div><span>规则版本</span><strong>{batch.rule_version}</strong></div><div><span>记录类型</span><strong>{Object.entries(batch.counts.kinds || {}).map(([k,v])=>`${kindLabel[k]} ${v}`).join(' / ') || '尚未处理'}</strong></div><p>新增 + 更新 + 跳过 + 失败 = 已处理。明细、复查与汇总不直接相加当独立隐患。</p></section><section className="panel"><div className="panel-heading"><h2>行处理明细</h2><label className="check-label"><input type="checkbox" checked={onlyIssues} onChange={e=>{setOnlyIssues(e.target.checked);setRowAfter(0);}}/>只看异常行</label></div><div className="table-wrap"><table><thead><tr><th>输入行</th><th>结果</th><th>说明</th><th>记录</th></tr></thead><tbody>{batch.rows.map(r=><tr key={r.row_number}><td>{r.row_number}</td><td>{r.outcome==='failed'?'失败':statusLabel[r.outcome]}</td><td>{r.issues.join('；') || '通过'}</td><td>{r.record_id && <button className="text-button" onClick={()=>navigate('/records/'+r.record_id)}>查看证据</button>}</td></tr>)}</tbody></table></div><div className="panel-footer"><button className="text-button" disabled={!rowAfter} onClick={()=>setRowAfter(0)}>返回首段</button><button className="text-button" disabled={!batch.next_row} onClick={()=>setRowAfter(batch.next_row || 0)}>下一段</button></div></section></>
    : path === '/records' ? <><section className="metrics ingest-metrics">{['detail','review','summary'].map(k=><div className="metric" key={k}><span>{kindLabel[k]}记录</span><strong>{totals[k] || 0}</strong></div>)}<div className="metric"><span>确认关联后的明细组</span><strong>{groups}</strong><small>仅合并已确认关系，非独立隐患结论</small></div></section><section className="panel"><div className="record-filters"><label>项目<select aria-label="项目筛选" value={filters.project_id} onChange={e=>changeFilter('project_id',e.target.value)}><option value="">全部项目</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>来源<select aria-label="来源筛选" value={filters.source_id} onChange={e=>changeFilter('source_id',e.target.value)}><option value="">全部来源</option>{sources.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>记录类型<select aria-label="记录类型筛选" value={filters.record_kind} onChange={e=>changeFilter('record_kind',e.target.value)}><option value="">全部类型</option>{['detail','review','summary'].map(k=><option key={k} value={k}>{kindLabel[k]}</option>)}</select></label><label>质量状态<select aria-label="质量状态筛选" value={filters.quality_status} onChange={e=>changeFilter('quality_status',e.target.value)}><option value="">全部状态</option><option value="needs_review">需核查</option><option value="valid">通过</option></select></label><label>开始日期<input type="date" value={filters.from_date} onChange={e=>changeFilter('from_date',e.target.value)}/></label><label>结束日期<input type="date" value={filters.to_date} onChange={e=>changeFilter('to_date',e.target.value)}/></label></div><div className="view-switch" aria-label="风险数据展示方式"><button aria-pressed={view==='reports'} onClick={()=>{setView('reports');setCursor('');setHistory([]);setExpandedReport('');}}>报告清单</button><button aria-pressed={view==='rows'} onClick={()=>{setView('rows');setCursor('');setHistory([]);}}>逐条数据</button></div>{view==='reports' ? <div className="reports-list">{reports.length?reports.map(r=><article key={r.id}><button className="report-toggle" aria-expanded={expandedReport===r.id} onClick={()=>void expandReport(r.id)}><FileSearch size={20}/><div><strong>{r.title}</strong><small>{r.source_name} · {r.report_id}</small></div><span>{r.count} 条风险数据</span><ArrowRight size={16}/></button>{expandedReport===r.id && <div className="report-records">{reportError && <p role="alert">{reportError}</p>}{reportLoading?<p>正在读取报告内风险数据…</p>:reportRows.map(item=><div className="report-record" key={item.id}><button className="job-title" onClick={()=>navigate('/records/'+item.id)}>{item.description || '缺少描述'}</button><span>{kindLabel[item.record_kind]} · v{item.current_version}</span></div>)}{reportNext && <button className="text-button" disabled={reportLoading} onClick={()=>void expandReport(r.id,true)}>加载更多风险数据</button>}</div>}</article>):<div className="empty"><h2>没有符合条件的报告</h2><p>可切换筛选条件或先接入模拟来源。</p></div>}</div> : records.length?<div className="table-wrap"><table><thead><tr><th>记录内容 / 来源</th><th>类型</th><th>检查日期</th><th>质量状态</th><th>版本</th></tr></thead><tbody>{records.map(r=><tr key={r.id}><td><button className="job-title" onClick={()=>navigate('/records/'+r.id)}>{r.description || '缺少描述'}</button><small>{sources.find(s=>s.id===r.source_id)?.name}</small></td><td>{kindLabel[r.record_kind]}</td><td>{r.occurred_on || '未知'}</td><td><span className={`status ${r.quality_status==='valid'?'succeeded':'retrying'}`}>{r.quality_status==='valid'?'通过':'需核查'}</span></td><td>v{r.current_version}</td></tr>)}</tbody></table></div>:<div className="empty"><h2>没有符合条件的记录</h2><p>调整筛选条件，或先完成一批模拟数据接入。</p></div>}{pagination}</section><p className="small-note">概况统计覆盖当前身份的全部可访问项目；下方列表按所选条件筛选。所有记录保留来源身份，描述相同不会自动删除。</p></>
    : isRecordDetail && detail ? <><button className="text-button back" onClick={()=>navigate('/records')}><ArrowLeft size={15}/>返回风险数据</button><section className="panel record-heading"><div><span className="role-tag">{kindLabel[detail.record_kind]} · 模拟记录</span><h2>{detail.description || '缺少描述'}</h2><p>{detail.source.name} · {detail.external_record_id}</p></div><label>查看版本<select aria-label="查看版本" value={detail.selected_version} onChange={e=>setVersion(e.target.value)}>{detail.versions.map(v=><option key={v.version} value={v.version}>v{v.version}{v.version===detail.current_version?' · 当前':''}</option>)}</select></label></section>{detail.issues.length>0 && <div className="feedback error">{detail.issues.join('；')}</div>}<div className="record-columns"><section className="panel"><div className="panel-heading"><h2>来源原始字段</h2><span>{Object.keys(detail.raw_fields).length}个字段 · 完整保留</span></div><div className="field-list">{orderedFields(detail.raw_fields).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{display(v)}</dd></div>)}</div></section><section className="panel"><div className="panel-heading"><h2>生效值与治理来源</h2><span>优先保留旧系统人工修订结果</span></div><div className="field-list">{orderedFields(detail.effective_fields).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{display(v)}</dd></div>)}</div><details className="provenance"><summary>来源定位 / 人工修订 / 内容版本</summary><pre>{JSON.stringify(detail.provenance,null,2)}</pre></details><div className="report-note"><strong>原报告：{detail.document.report_id}</strong><p>{detail.document.note}</p></div></section></div><section className="panel evidence-section"><div className="panel-heading"><h2>证据与图片关系</h2><span>确定锚点与候选关联分别标识</span></div><div className="evidence-grid">{detail.evidence.map(e=><article key={e.id} className="evidence-card"><div><strong>{kindLabel[e.type]}</strong><span className="role-tag">{e.relation_confidence==='anchored'?'来源锚定':'候选关联'}</span></div><p>{JSON.stringify(e.locator)}</p>{e.type!=='source_row' && e.asset_id ? <AuthImage asset={e.asset_id} identity={identity}/> : e.type==='source_row' ? <p>原始行定位已保留，可与上方原文核对。</p>:<div className="missing-evidence">附件缺失或不可用，无法预览</div>}{e.asset_id && projects.find(p=>p.id===detail.project_id)?.can_run && <button className="text-button" disabled={busy} onClick={()=>void download(e.asset_id!)}>下载对应模拟来源</button>}</article>)}</div></section><section className="panel links-section"><div className="panel-heading"><h2>跨来源重复候选</h2><span>仅同项目同类型生成候选，不自动删除原记录</span></div>{detail.links.length?detail.links.map(l=><div className="link-row" key={l.id}><div><strong>{statusLabel[l.review_state]}</strong><small>比较方法：同项目同类型的描述匹配；决策绑定具体版本</small></div><button className="text-button" onClick={()=>navigate('/records/'+l.other_record_id)}>打开另一条记录</button>{projects.find(p=>p.id===detail.project_id)?.roles.some(r=>['admin','reviewer'].includes(r)) && <><button className="button secondary" disabled={busy || l.review_state==='stale'} onClick={()=>void action(async()=>{await api(`/record-links/${l.id}/confirm`,{method:'POST',body:JSON.stringify({row_version:l.row_version,decision:'confirmed'})});setRefresh(v=>v+1);})}>确认重复</button><button className="button ghost" disabled={busy || l.review_state==='stale'} onClick={()=>void action(async()=>{await api(`/record-links/${l.id}/confirm`,{method:'POST',body:JSON.stringify({row_version:l.row_version,decision:'rejected'})});setRefresh(v=>v+1);})}>排除</button></>}</div>):<p className="empty-inline">暂无候选。可再接入Excel或治理导出，验证跨来源比较。</p>}</section></> : error ? null : <div className="empty">请选择来源、批次或记录。</div>}
  </div>;
}
