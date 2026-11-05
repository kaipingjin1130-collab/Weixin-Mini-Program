import { useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch } from './platform';
import './risk-data.css';

type Api = <T>(url: string, options?: RequestInit) => Promise<T>;
type Field = { key: string; label: string };
type Summary = {
  findings: number; reports: number; projects: number; pending_drafts: number;
  editable_fields: Field[]; notice: string;
  documents?: number; consolidated_findings?: number; removed_duplicate_reports?: number;
  fields?: Field[]; read_only?: boolean;
};
type Finding = {
  id: string; document_id: string; original_name?: string | null;
  project_name: string | null; engineering_project_name: string | null;
  inspection_date: string | null; inspection_location: string | null;
  problem_description: string; source_category: string | null; hazard_category: string | null;
  source_grade: string | null; basis_or_clause: string | null;
  rectification_requirement: string | null; rectification_advice: string | null;
  rectification_deadline: string | null; reported_response: string | null;
  reinspection_conclusion: string | null; review_state: string; consolidation_id: string | null;
  draft_id?: string | null;
};
type ReportRow = { document_id: string; original_name: string; findings: number; project_name: string | null; inspection_date: string | null };
type Draft = {
  id: string; finding_id: string; document_id: string | null; changes: Record<string, string | null>;
  old_values: Record<string, string | null>; updated_at: string; original_name: string | null;
  current_problem_description: string | null; current_engineering_project_name: string | null;
};
type LogRow = { id: string; finding_id: string; document_id: string | null; action: string; changes: Record<string, string | null> | null; old_values: Record<string, string | null> | null; actor: string | null; created_at: string; original_name: string | null };
type Detail = {
  id: string; document_id: string; original_name: string; parsed_at: string; fields: Record<string, string | null>;
  evidence: { field_key: string; quote: string; locator: unknown; method: string; document_id?: string }[];
  sources: { document_id: string; original_name: string }[]; consolidation_id?: string;
  field_variants?: Record<string, { value: string; source_ref: string }[]>;
  images: { id: string; relation: string; locator: unknown; document_id?: string }[];
};

const REVIEW = '/history-review';
const READER = '/history-reader';
const STORE_KEY = 'historyReview.visibleFields';
const DEFAULT_FIELDS = ['engineering_project_name', 'inspection_date', 'problem_description', 'source_category', 'rectification_requirement', 'reported_response'];
const EDIT_ORDER = ['project_name', 'engineering_project_name', 'inspection_date', 'inspection_location', 'problem_description', 'source_category', 'source_grade', 'hazard_category', 'basis_or_clause', 'rectification_requirement', 'rectification_advice', 'rectification_deadline', 'reported_response', 'reinspection_conclusion'];
const ACTION_LABEL: Record<string, string> = { save_draft: '保存草稿', confirm: '批量确认', discard: '放弃修改', conflict: '值冲突' };

function loadFields(): string[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length ? parsed.filter((x) => typeof x === 'string') : DEFAULT_FIELDS;
  } catch { return DEFAULT_FIELDS; }
}
function text(value: string | null | undefined, max = 120) {
  const s = (value || '').replace(/\s+/g, ' ').trim();
  return s.length > max ? s.slice(0, max) + '…' : s || '—';
}
function fieldLabel(fields: Field[], key: string) { return fields.find((f) => f.key === key)?.label || key; }
function changeSummary(changes: Record<string, string | null> | null, fields: Field[]) {
  if (!changes) return '—';
  return Object.entries(changes).map(([k, v]) => `${fieldLabel(fields, k)}：${text(v, 30)}`).join('；');
}

function Picture({ id }: { id: string }) {
  const [src, setSrc] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    let stale = false; let objectUrl = '';
    apiFetch('/api/v1' + READER + '/images/' + encodeURIComponent(id))
      .then(async (r) => { if (!r.ok) throw Error('图片暂不可用'); return r.blob(); })
      .then((blob) => { objectUrl = URL.createObjectURL(blob); if (!stale) setSrc(objectUrl); else URL.revokeObjectURL(objectUrl); })
      .catch((e) => { if (!stale) setError(e.message); });
    return () => { stale = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [id]);
  return error ? <p role="alert">{error}</p> : src ? <a href={src} target="_blank" rel="noreferrer"><img src={src} alt="原报告关联图片，点击查看大图" /></a> : <p>读取图片…</p>;
}

export function RiskData({ api }: { api: Api }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [projects, setProjects] = useState<{ name: string; findings: number }[]>([]);
  const [tab, setTab] = useState<'findings' | 'reports' | 'logs'>('findings');
  const [items, setItems] = useState<Finding[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [visible, setVisible] = useState<string[]>(loadFields);
  const [showFields, setShowFields] = useState(false);
  const [project, setProject] = useState('');
  const [documentFilter, setDocumentFilter] = useState('');
  const [input, setInput] = useState(''); const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(0); const [more, setMore] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  const [editing, setEditing] = useState<Finding | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailError, setDetailError] = useState('');
  const [message, setMessage] = useState(''); const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const detailPanel = useRef<HTMLElement>(null);
  const fields = summary?.editable_fields || summary?.fields || [];
  const detailFields = summary?.fields || fields;

  useEffect(() => { if (detail) detailPanel.current?.scrollIntoView({ block: 'start' }); }, [detail]);
  useEffect(() => {
    let stale = false; setLoading(true); setError('');
    Promise.all([
      api<Summary>(REVIEW + '/summary'),
      api<{ items: { name: string; findings: number }[] }>(REVIEW + '/projects?limit=800'),
      api<{ items: Draft[] }>(REVIEW + '/drafts?limit=100'),
    ]).then(([s, p, d]) => {
      if (stale) return;
      setSummary(s); setProjects(p.items); setDrafts(d.items);
      setVisible((current) => {
        const known = new Set(s.editable_fields.map((f) => f.key));
        const next = current.filter((k) => known.has(k));
        return next.length ? next : DEFAULT_FIELDS.filter((k) => known.has(k));
      });
    }).catch((e) => { if (!stale) setError(e.message); }).finally(() => { if (!stale) setLoading(false); });
    return () => { stale = true; };
  }, [api, refresh]);

  useEffect(() => {
    if (tab !== 'findings') return;
    let stale = false; setLoading(true); setError('');
    api<{ items: Finding[]; has_more: boolean }>(REVIEW + '/findings?' + new URLSearchParams({
      q: query, project, document_id: documentFilter, offset: String(offset), limit: '30',
    })).then((page) => {
      if (stale) return;
      setItems(pendingOnly ? page.items.filter((x) => x.draft_id) : page.items);
      setMore(page.has_more);
    }).catch((e) => { if (!stale) setError(e.message); }).finally(() => { if (!stale) setLoading(false); });
    return () => { stale = true; };
  }, [api, tab, query, project, documentFilter, offset, pendingOnly, refresh]);

  useEffect(() => {
    if (tab !== 'reports') return;
    let stale = false; setLoading(true); setError('');
    api<{ items: ReportRow[] }>(REVIEW + '/reports?' + new URLSearchParams({ q: query, project, offset: '0', limit: '100' }))
      .then((page) => { if (!stale) { setReports(page.items); setMore(false); } })
      .catch((e) => { if (!stale) setError(e.message); }).finally(() => { if (!stale) setLoading(false); });
    return () => { stale = true; };
  }, [api, tab, query, project, refresh]);

  useEffect(() => {
    if (tab !== 'logs') return;
    let stale = false; setLoading(true); setError('');
    api<{ items: LogRow[] }>(REVIEW + '/logs?limit=100').then((page) => { if (!stale) setLogs(page.items); })
      .catch((e) => { if (!stale) setError(e.message); }).finally(() => { if (!stale) setLoading(false); });
    return () => { stale = true; };
  }, [api, tab, refresh]);

  function saveColumns(next: string[]) {
    setVisible(next);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* 忽略本地存储异常 */ }
  }
  function startEdit(item: Finding) {
    setEditing(item);
    const values: Record<string, string> = {};
    for (const key of EDIT_ORDER) values[key] = (item as unknown as Record<string, string | null>)[key] || '';
    setEditValues(values); setMessage(''); setDetail(null); setDetailError('');
  }
  async function saveDraft() {
    if (!editing) return;
    const changes: Record<string, string | null> = {};
    for (const key of EDIT_ORDER) {
      const before = (editing as unknown as Record<string, string | null>)[key] || '';
      if (editValues[key] !== before) changes[key] = editValues[key] || null;
    }
    if (!Object.keys(changes).length) { setMessage('没有修改任何字段。'); return; }
    setBusy(true); setError('');
    try {
      await api(REVIEW + '/drafts', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ finding_id: editing.id, changes }) });
      setMessage(`已保存草稿（${Object.keys(changes).map((k) => fieldLabel(fields, k)).join('、')}），批量确认后覆盖数据库。`);
      setEditing(null); setRefresh((x) => x + 1);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  async function confirmDrafts(ids: string[]) {
    if (!ids.length) { setMessage('请先勾选要确认的修改。'); return; }
    if (!window.confirm(`确认将 ${ids.length} 条修改直接覆盖数据库中的对应数据？该操作会写入修改日志。`)) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await api<{ applied: unknown[]; conflicts: { reason: string }[] }>(REVIEW + '/drafts/confirm', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ids }) });
      setMessage(`已确认写入 ${result.applied.length} 条${result.conflicts.length ? `；${result.conflicts.length} 条存在值冲突` : ''}。`);
      setSelectedDrafts([]); setRefresh((x) => x + 1);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  async function discardDrafts(ids: string[]) {
    if (!ids.length) return;
    setBusy(true); setError('');
    try {
      await api(REVIEW + '/drafts/discard', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ids }) });
      setSelectedDrafts([]); setRefresh((x) => x + 1);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  async function openDetail(item: Finding) {
    setDetail(null); setDetailError('');
    try {
      const d = await api<Detail>(READER + '/findings/' + encodeURIComponent(item.id));
      setDetail(d);
    } catch (e) { setDetailError((e as Error).message); }
  }
  async function download(source?: { document_id: string; original_name: string }) {
    if (!detail) return;
    try {
      const selectedSource = source || detail;
      const r = await apiFetch('/api/v1' + READER + '/documents/' + encodeURIComponent(selectedSource.document_id) + '/original');
      if (!r.ok) throw Error('原件暂不可用，请稍后重试。');
      const url = URL.createObjectURL(await r.blob()); const a = document.createElement('a');
      a.href = url; a.download = selectedSource.original_name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { setDetailError((e as Error).message); }
  }

  const shownReports = useMemo(() => reports, [reports]);
  const allDraftIds = useMemo(() => drafts.map((d) => d.id), [drafts]);

  return (
    <div className="risk-data">
      <section className="panel">
        <div className="panel-heading">
          <div><h2>风险数据 <span className="role-tag">可编辑核验</span></h2><p>历史报告解析成果与人工核验修改入口。</p></div>
          <button className="button secondary" disabled={loading} onClick={() => setRefresh((v) => v + 1)}>刷新数据</button>
        </div>
        <p>{summary?.notice || '正在读取历史报告数据…'}</p>
        <div className="history-stats">
          <span>问题条目 <b>{summary?.findings ?? '—'}</b></span>
          <span>历史报告 <b>{summary?.reports ?? '—'}</b></span>
          <span>工程项目 <b>{summary?.projects ?? '—'}</b></span>
          <span>待确认修改 <b>{summary?.pending_drafts ?? '—'}</b></span>
        </div>
        {error && <div className="feedback error" role="alert">{error}<button className="button secondary" onClick={() => setRefresh((v) => v + 1)}>重试</button></div>}
        {message && <p role="status" className="history-message">{message}</p>}
        <nav aria-label="历史报告视图" className="history-tabs">
          {([['findings', '问题条目'], ['reports', '历史报告'], ['logs', '修改日志']] as const).map(([id, label]) =>
            <button key={id} className={tab === id ? 'button primary' : 'button ghost'} onClick={() => { setTab(id); setOffset(0); }}>{label}</button>)}
        </nav>
      </section>

      <section className="panel">
        <div className="history-toolbar">
          <form className="history-search" onSubmit={(e) => { e.preventDefault(); setQuery(input.trim()); setOffset(0); }}>
            <label htmlFor="history-query">搜索</label>
            <div>
              <input id="history-query" value={input} onChange={(e) => setInput(e.target.value)} maxLength={100} placeholder={tab === 'reports' ? '报告名称或项目' : '问题描述、项目或报告'} />
              <button className="button primary" disabled={loading}>搜索</button>
            </div>
          </form>
          <label className="history-inline">项目筛选
            <select value={project} onChange={(e) => { setProject(e.target.value); setOffset(0); }}>
              <option value="">全部项目（{summary?.projects ?? '—'}）</option>
              {projects.map((p) => <option key={p.name} value={p.name}>{p.name}（{p.findings}）</option>)}
            </select>
          </label>
          {documentFilter && <button className="button ghost" onClick={() => { setDocumentFilter(''); setOffset(0); }}>清除报告筛选</button>}
          {tab === 'findings' && <label className="history-inline"><input type="checkbox" checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)} />只看待确认修改</label>}
          {tab === 'findings' && <button className="button secondary" onClick={() => setShowFields((x) => !x)}>显示字段（{visible.length}/{fields.length}）</button>}
        </div>
        {showFields && tab === 'findings' && <div className="history-fieldpicker" role="group" aria-label="选择显示字段">
          {fields.map((f) => <label key={f.key}><input type="checkbox" checked={visible.includes(f.key)} onChange={(e) => saveColumns(e.target.checked ? [...visible, f.key] : visible.filter((k) => k !== f.key))} />{f.label}</label>)}
          <button className="button ghost" onClick={() => saveColumns(DEFAULT_FIELDS.filter((k) => fields.some((f) => f.key === k)))}>恢复默认</button>
        </div>}
      </section>

      <section className="panel">
        {tab === 'findings' && <>
          {drafts.length > 0 && <div className="history-drafts">
            <div className="history-drafts-head">
              <h3>待确认修改（{drafts.length}）</h3>
              <div>
                <button className="button secondary" disabled={busy} onClick={() => setSelectedDrafts(selectedDrafts.length === allDraftIds.length ? [] : allDraftIds)}>{selectedDrafts.length === allDraftIds.length ? '全不选' : '全选'}</button>
                <button className="button primary" disabled={busy || !selectedDrafts.length} onClick={() => void confirmDrafts(selectedDrafts)}>批量确认所选（{selectedDrafts.length}）</button>
                <button className="button ghost" disabled={busy || !selectedDrafts.length} onClick={() => void discardDrafts(selectedDrafts)}>放弃所选</button>
              </div>
            </div>
            <div className="table-wrap"><table><thead><tr><th></th><th>报告</th><th>问题描述（当前）</th><th>修改内容</th><th>更新时间</th></tr></thead><tbody>
              {drafts.map((d) => <tr key={d.id}>
                <td><input type="checkbox" checked={selectedDrafts.includes(d.id)} onChange={(e) => setSelectedDrafts(e.target.checked ? [...selectedDrafts, d.id] : selectedDrafts.filter((x) => x !== d.id))} /></td>
                <td>{text(d.original_name, 24)}</td>
                <td className="history-description">{text(d.current_problem_description, 100)}</td>
                <td>{changeSummary(d.changes, fields)}</td>
                <td>{d.updated_at ? new Date(d.updated_at).toLocaleString('zh-CN') : '—'}</td>
              </tr>)}
            </tbody></table></div>
          </div>}
          <div className="table-wrap" aria-busy={loading}>
            <table>
              <thead><tr><th>操作</th>{visible.map((key) => <th key={key}>{fieldLabel(fields, key)}</th>)}<th>来源报告</th><th>状态</th></tr></thead>
              <tbody>
                {items.map((item) => <tr key={item.id} className={item.draft_id ? 'history-dirty' : ''}>
                  <td className="history-actions">
                    <button className="button secondary" onClick={() => startEdit(item)}>编辑</button>
                    <button className="button ghost" onClick={() => void openDetail(item)}>证据</button>
                  </td>
                  {visible.map((key) => <td key={key} className={key === 'problem_description' ? 'history-description' : ''}>{text((item as unknown as Record<string, string | null>)[key], key === 'problem_description' ? 220 : 80)}</td>)}
                  <td>{text(item.original_name, 24)}</td>
                  <td>{item.draft_id ? <span className="history-badge">待确认</span> : text(item.review_state, 14)}</td>
                </tr>)}
                {!items.length && !loading && !error && <tr><td colSpan={visible.length + 3}>没有匹配的问题条目。</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="history-pagination">
            <button className="button secondary" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - 30))}>上一页</button>
            <span>第 {offset / 30 + 1} 页 · 本页 {items.length} 条</span>
            <button className="button secondary" disabled={!more} onClick={() => setOffset(offset + 30)}>下一页</button>
          </div>
        </>}

        {tab === 'reports' && <div className="table-wrap" aria-busy={loading}><table>
          <thead><tr><th>历史报告</th><th>项目</th><th>检查日期</th><th>问题条目</th><th>操作</th></tr></thead>
          <tbody>
            {shownReports.map((r) => <tr key={r.document_id}>
              <td>{text(r.original_name, 60)}</td><td>{text(r.project_name, 30)}</td><td>{text(r.inspection_date, 20)}</td><td>{r.findings}</td>
              <td className="history-actions">
                <button className="button secondary" onClick={() => { setDocumentFilter(r.document_id); setTab('findings'); setOffset(0); }}>查看问题</button>
                <button className="button ghost" onClick={() => { void apiFetch('/api/v1' + READER + '/documents/' + encodeURIComponent(r.document_id) + '/original').then(async (resp) => { if (!resp.ok) throw Error('原件暂不可用'); const url = URL.createObjectURL(await resp.blob()); const a = document.createElement('a'); a.href = url; a.download = r.original_name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }).catch((e) => setError(e.message)); }}>原件</button>
              </td>
            </tr>)}
            {!shownReports.length && !loading && !error && <tr><td colSpan={5}>没有匹配的历史报告。</td></tr>}
          </tbody>
        </table></div>}

        {tab === 'logs' && <div className="table-wrap" aria-busy={loading}><table>
          <thead><tr><th>时间</th><th>操作</th><th>报告</th><th>修改内容</th><th>操作人</th></tr></thead>
          <tbody>
            {logs.map((l) => <tr key={l.id}>
              <td>{new Date(l.created_at).toLocaleString('zh-CN')}</td>
              <td>{ACTION_LABEL[l.action] || l.action}</td>
              <td>{text(l.original_name, 28) || text(l.document_id, 8)}</td>
              <td>{changeSummary(l.changes, fields)}</td>
              <td>{text(l.actor, 30)}</td>
            </tr>)}
            {!logs.length && !loading && !error && <tr><td colSpan={5}>暂无修改日志。</td></tr>}
          </tbody>
        </table></div>}
      </section>

      {editing && <section className="panel history-editor" aria-label="编辑问题条目">
        <div className="panel-heading"><h2>编辑问题条目</h2><button className="button ghost" onClick={() => { setEditing(null); setDetail(null); }}>关闭</button></div>
        <p className="muted">修改先保存为待确认草稿；批量确认后直接覆盖数据库对应记录，并写入修改日志。来源报告：{text(editing.original_name, 80)}</p>
        <div className="history-editor-grid">
          {EDIT_ORDER.map((key) => <label key={key} className={key === 'problem_description' ? 'history-editor-wide' : ''}>
            <span>{fieldLabel(fields, key)}</span>
            <textarea rows={key === 'problem_description' ? 3 : 2} value={editValues[key] || ''} onChange={(e) => setEditValues({ ...editValues, [key]: e.target.value })} />
          </label>)}
        </div>
        <div className="history-actions">
          <button className="button primary" disabled={busy} onClick={() => void saveDraft()}>保存草稿</button>
          <button className="button ghost" onClick={() => setEditing(null)}>取消</button>
        </div>
        {detail && <details className="history-detail"><summary>查看原文证据与关联图片</summary>
          <button className="button secondary" onClick={() => void download()}>下载原报告</button>
          <dl className="history-fields">{detailFields.map((f) => <div key={f.key}><dt>{f.label}</dt><dd>{detail.fields[f.key] || '—'}</dd></div>)}</dl>
          {detail.evidence.map((e, i) => <details key={i}><summary>{fieldLabel(fields, e.field_key)}：{text(e.quote, 80)}</summary><p className="history-quote">{e.quote}</p><p className="muted">来源位置：{JSON.stringify(e.locator)}</p></details>)}
          {detail.images.length > 0 && <><h3>关联图片（{detail.images.length}）</h3><div className="history-images">{detail.images.map((im, i) => <figure key={im.id + ':' + i}><Picture id={im.id} /><figcaption>{JSON.stringify(im.locator)}</figcaption></figure>)}</div></>}
        </details>}
      </section>}

      {detail && !editing && <section className="panel history-editor" ref={detailPanel} aria-label="问题条目证据">
        <div className="panel-heading"><h2>字段与来源证据</h2><button className="button ghost" onClick={() => setDetail(null)}>关闭</button></div>
        <p><strong>{detail.original_name}</strong></p><p className="muted">解析版本时间：{new Date(detail.parsed_at).toLocaleString('zh-CN')}</p>
        <button className="button secondary" onClick={() => void download()}>下载原报告</button>
        {detail.consolidation_id && <><p>同一隐患的重复出处已合并，以下字段与图片保留原报告来源。</p><ul>{detail.sources.map((s) => <li key={s.document_id}><button className="button secondary" onClick={() => void download(s)}>{s.original_name}</button></li>)}</ul></>}
        <dl className="history-fields">{detailFields.map((f) => <div key={f.key}><dt>{f.label}</dt><dd>{detail.fields[f.key] || '—'}</dd></div>)}</dl>
        <h3>原文证据</h3>{detail.evidence.map((e, i) => <details key={i}><summary>{fieldLabel(fields, e.field_key)}：{text(e.quote, 100)}</summary><p className="history-quote">{e.quote}</p><p className="muted">来源位置：{JSON.stringify(e.locator)}</p></details>)}
        {detailError && <p role="alert">{detailError}</p>}
        <h3>关联图片（{detail.images.length}）</h3><p className="muted">展示已建立关联的图片；无图片不代表原报告没有照片。</p><div className="history-images">{detail.images.map((im, i) => <figure key={im.id + ':' + i}><Picture id={im.id} /><figcaption>{JSON.stringify(im.locator)}</figcaption></figure>)}</div>
      </section>}
    </div>
  );
}
