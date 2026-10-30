"""Task-specific, optional report routing; no project-role escalation."""
import csv
import html
import io
import json
import zipfile


def assignment(c, key, fallback=''):
    row = c.execute('SELECT payload FROM document_leaders WHERE document_key=?', (key,)).fetchone()
    return json.loads(row[0]) if row else dict(leaderId=fallback, assignmentRevision=0, history=[])


def decorate_report(c, report):
    routing = assignment(c, 'inspection:'+report['id'], report.get('leaderId', ''))
    return dict(report, leaderId=routing['leaderId'], leaderAssignmentRevision=routing['assignmentRevision'])


def document(w, key):
    if not isinstance(key, str) or ':' not in key:
        w.fail('报告标识不正确')
    kind, doc_id = key.split(':', 1)
    if kind == 'inspection':
        source = w.s.get_report(w.c, doc_id)
        w.role(source['projectId'])
        if source['status'] != 'submitted':
            w.fail('草稿请在填报页面选择负责人，提交后可在此补选', 409)
        fallback = source.get('leaderId', '')
    elif kind in ('brief', 'delivery'):
        table = 'field_reports' if kind == 'brief' else 'deliveries'
        row = w.c.execute('SELECT task_id,payload FROM '+table+' WHERE id=?', (doc_id,)).fetchone()
        if not row:
            w.fail('报告不存在', 404)
        task = w.task(row['task_id'])
        source = json.loads(row['payload'])['task']
        fallback = task.get('leaderId', '')
    else:
        w.fail('报告类型不支持')
    routing = assignment(w.c, key, fallback)
    user = w.c.execute('SELECT name FROM users WHERE id=?', (routing['leaderId'],)).fetchone()
    return dict(routing, key=key, projectId=source['projectId'], title=source.get('title') or source.get('number', ''), leaderName=user[0] if user else '')


def assign_document(w, data):
    current = document(w, data.get('key'))
    w.allow(current['projectId'], ['manager'])
    if data.get('assignmentRevision') != current['assignmentRevision']:
        w.fail('负责人已被调整，请刷新后重试', 409)
    leader = w.leader(current['projectId'], data.get('leaderId', ''))
    history = current['history'] + [dict(previousLeaderId=current['leaderId'], leaderId=leader, actorId=w.user['id'], actorName=w.user['name'], createdAt=w.s.now())]
    routing = dict(leaderId=leader, assignmentRevision=current['assignmentRevision']+1, history=history)
    w.c.execute('INSERT OR REPLACE INTO document_leaders VALUES(?,?)', (current['key'], json.dumps(routing, ensure_ascii=False)))
    return document(w, current['key'])


def validate_leader(c, project_id, value):
    if value in ('', None):
        return ''
    if not isinstance(value, str) or not c.execute(
        'SELECT 1 FROM memberships WHERE project_id=? AND user_id=?',
        (project_id, value),
    ).fetchone():
        raise ValueError('请选择当前项目的成员作为负责人，或留空')
    return value


def inbox(w):
    """Derive notifications from committed documents, including historical versions."""
    state = w.state()
    projects = {p['id']: p for p in state['projects']}
    users = {r['id']: r['name'] for r in w.c.execute('SELECT id,name FROM users')}
    seen = {r[0] for r in w.c.execute('SELECT document_key FROM leader_reads WHERE user_id=?', (w.user['id'],))}
    from host_auth import is_admin
    rows = []

    def add(kind, doc_id, source, leader, version, created, details, task_id=''):
        if not leader or (leader != w.user['id'] and not is_admin(w.user)):
            return
        pid = source['projectId']
        if pid not in projects:
            return
        key = kind + ':' + doc_id
        rows.append(dict(key=key, kind=kind, id=doc_id, projectId=pid,
                         project=projects[pid]['name'], contract=projects[pid]['contract'],
                         leaderId=leader, leaderName=users.get(leader, leader),
                         title=source.get('title') or source.get('number', '巡查报告'),
                         number=source.get('number', ''), inspectors=source.get('inspectors', source.get('inspector', '')),
                         version=version, createdAt=created, taskId=task_id,
                         issues=len(details.get('issues', [])), unread=key not in seen))

    for task in state['tasks']:
        leader = task.get('leaderId', '')
        for kind, docs in [('brief', task.get('fieldBriefs', [])), ('delivery', task.get('deliveries', []))]:
            table = 'field_reports' if kind == 'brief' else 'deliveries'
            for doc in docs:
                effective = assignment(w.c, kind+':'+doc['id'], leader)['leaderId']
                if not effective or (effective != w.user['id'] and not is_admin(w.user)):
                    continue
                row = w.c.execute('SELECT payload FROM '+table+' WHERE id=?', (doc['id'],)).fetchone()
                if row:
                    snap = json.loads(row[0])
                    add(kind, doc['id'], snap['task'], effective, doc['version'], doc['createdAt'], snap['task'], task['id'])
    for row in w.c.execute("SELECT * FROM reports WHERE status='submitted'"):
        report = w.s.get_report(w.c, row['id'])
        add('inspection', report['id'], report, report.get('leaderId', ''), report['revision'], report['updated'], report)
    return sorted(rows, key=lambda r: (r['createdAt'], r['key']), reverse=True)


def select(w, keys):
    if not isinstance(keys, list) or not keys or len(keys) > 100 or any(not isinstance(k, str) for k in keys):
        w.fail('请选择1至100份报告')
    allowed = {r['key']: r for r in inbox(w)}
    if any(k not in allowed for k in keys):
        w.fail('报告不存在、未提交或未指定给你，或项目权限已变更', 403)
    rows = [allowed[k] for k in dict.fromkeys(keys)]
    if len({r['projectId'] for r in rows}) != 1:
        w.fail('请按同一个项目选择报告汇总')
    return rows


def export_bundle(w, rows, make_docx, snapshot_docx):
    """Keep signed source reports intact and add a factual cross-member summary."""
    output = io.BytesIO()
    summary = io.StringIO(newline='')
    writer = csv.writer(summary)
    writer.writerow(['项目', '负责人', '巡查编号', '任务名称', '检查人', '报告类型', '版本', '提交时间', '隐患数'])
    esc = lambda s: html.escape(str(s or ''))
    safe_cell = lambda value: "'"+value if isinstance(value, str) and value.lstrip().startswith(('=', '+', '-', '@')) else value
    sections = []
    names = {'inspection': '巡查报告', 'brief': '现场简报', 'delivery': '正式成果'}
    with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as bundle:
        for n, row in enumerate(rows, 1):
            kind, doc_id = row['kind'], row['id']
            writer.writerow([safe_cell(value) for value in [row['project'], row['leaderName'], row['number'], row['title'], row['inspectors'], names[kind], row['version'], row['createdAt'], row['issues']]])
            if kind == 'inspection':
                details = w.s.get_report(w.c, doc_id)
                data = make_docx(w.c, details)
            else:
                table = 'field_reports' if kind == 'brief' else 'deliveries'
                snap = json.loads(w.c.execute('SELECT payload FROM '+table+' WHERE id=?', (doc_id,)).fetchone()[0])
                details = snap['task']
                data = snapshot_docx(snap, brief=kind == 'brief')
            filename = f'{n:03d}-{kind}-{doc_id}.docx'
            bundle.writestr('reports/'+filename, data)
            issues = ''.join('<li>'+esc(i.get('description'))+'<br>部位：'+esc(i.get('location'))+'；风险：'+esc(i.get('risk'))+'<br>依据：'+esc(i.get('reference'))+'<br>建议：'+esc(i.get('suggestion'))+'</li>' for i in details.get('issues', []))
            sections.append('<section><h2>'+str(n)+'. '+esc(row['title'])+'</h2><p>负责人：'+esc(row['leaderName'])+'；检查人：'+esc(row['inspectors'])+'</p><p>'+esc(names[kind])+' v'+str(row['version'])+' · '+esc(row['createdAt'])+' · '+esc(row['number'])+'</p><p>'+esc(details.get('fieldSummary', details.get('scope', ''))).replace('\n','<br>')+'</p><ol>'+issues+'</ol><p><a href="reports/'+filename+'">含照片与签名的原始报告 Word</a></p></section>')
        bundle.writestr('summary.csv', '\ufeff'+summary.getvalue())
        bundle.writestr('manifest.json', json.dumps(dict(generatedAt=w.s.now(), generatedBy=w.user['name'], documents=rows), ensure_ascii=False, indent=2))
        bundle.writestr('summary.html', '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>巡查报告汇总</title><style>body{max-width:1000px;margin:40px auto;font-family:sans-serif;line-height:1.8}section{border-top:1px solid #ddd;break-inside:avoid}li{margin:12px 0}@media print{a{display:none}}</style><h1>'+esc(rows[0]['project'])+' · 巡查报告汇总</h1><p>汇总人：'+esc(w.user['name'])+' · '+esc(w.s.now())+'</p><p>共 '+str(len(rows))+' 份报告。各版本独立列示，隐患数不跨版本去重。原报告、照片与签名保留在 reports 目录。</p>'+''.join(sections)+'</html>')
    return output.getvalue()
