"""Immutable combined reports and authenticated, revision-checked countersigning."""
import copy
import hashlib
import json

import leader_reports
from host_auth import is_admin


def encode(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True)


def digest(value):
    return hashlib.sha256(encode(value).encode()).hexdigest()


def accessible(w, report):
    role = w.role(report['projectId'])
    if role not in ('admin', 'manager') and w.user['id'] not in report['readers'] + [report['recipientId']]:
        w.fail('这份合并报告未分发给当前账号', 403)


def get(w, report_id):
    row = w.c.execute('SELECT payload FROM combined_reports WHERE id=?', (report_id,)).fetchone()
    if not row:
        w.fail('合并报告不存在', 404)
    value = json.loads(row[0])
    accessible(w, value)
    return value


def public(w, value):
    value = copy.deepcopy(value)
    value['canAssign'] = not value['recipientSignature'] and (is_admin(w.user) or w.user['id'] == value['createdBy'] or w.role(value['projectId']) == 'manager')
    value['canSign'] = not value['recipientSignature'] and w.user['id'] == value['recipientId']
    return value


def listing(w):
    result = []
    for row in w.c.execute('SELECT payload FROM combined_reports'):
        value = json.loads(row[0])
        try:
            accessible(w, value)
        except w.s.Problem as error:
            if error.status in (403, 404):
                continue
            raise
        result.append({key: value[key] for key in ('id', 'projectId', 'title', 'createdAt', 'createdByName', 'revision', 'recipientId', 'recipientName', 'recipientSignature')})
    return sorted(result, key=lambda x: (x['createdAt'], x['id']), reverse=True)


def source(w, row):
    if row['kind'] == 'inspection':
        report = copy.deepcopy(w.s.get_report(w.c, row['id']))
        for issue in report['issues']:
            issue['photos'] = ['media:' + mid for mid in issue.get('photos', [])]
        signatures = report.get('signatures', [])
        if not signatures and report.get('signature'):
            signatures = [dict(name=report.get('inspector', ''), signature=report['signature'])]
        report['signatures'] = [dict(s, signature='media:' + s['signature']) for s in signatures if s.get('signature')]
        return report, []
    table = 'field_reports' if row['kind'] == 'brief' else 'deliveries'
    snap = json.loads(w.c.execute('SELECT payload FROM ' + table + ' WHERE id=?', (row['id'],)).fetchone()[0])
    task = snap['task']
    images = {e['id'] for e in snap['evidence'] if e['mime'].startswith('image/')}
    issues = []
    for issue in task['issues']:
        issues.append(dict(copy.deepcopy(issue), photos=['evidence:' + eid for eid in issue['evidence'] if eid in images]))
    for record in task['records']:
        issues.append(dict(description=record['text'], category='现场确认记录', location='',
                           inspectionDate=record.get('occurredAt', ''),
                           photos=['evidence:' + eid for eid in record['evidence'] if eid in images]))
    signature = task.get('fieldSignature')
    report = dict(notice=task.get('notice', {}), inspector=task.get('inspectors', ''), issues=issues,
                  scope=task.get('fieldSummary', '') if row['kind'] == 'brief' else task.get('handoverSummary', ''),
                  noHazard=task.get('noHazard', False),
                  signatures=[dict(name=signature['name'], signature='evidence:' + signature['evidenceId'])] if signature else [])
    return report, [task['assignee']]


def create(w, data):
    rows = leader_reports.select(w, data.get('keys'))
    logical = [r['taskId'] or r['key'] for r in rows]
    if len(set(logical)) != len(logical):
        w.fail('同一任务只能选择一个版本的简报或成果，请取消重复版本后合并')
    sources, issues, signatures, summaries, readers = [], [], [], [], [w.user['id']]
    for row in rows:
        report, participants = source(w, row)
        readers.extend(participants)
        sources.append(dict(key=row['key'], number=row['number'], title=row['title'], version=row['version'],
                            inspectors=row['inspectors'], createdAt=row['createdAt'], snapshotHash=digest(report)))
        label = f"{row['number']} / v{row['version']} / {row['inspectors']}"
        for issue in report['issues']:
            issues.append(dict(issue, sourceLabel=label, sourceKey=row['key']))
        signatures.extend(dict(s, sourceLabel=label) for s in report.get('signatures', []))
        if report.get('scope'):
            summaries.append(label + '：' + report['scope'])
    report_id = w.s.uid()
    report = dict(notice={}, project=rows[0]['project'], number='MERGED-' + report_id[:12],
                  inspector='、'.join(dict.fromkeys(r['inspectors'] for r in rows if r['inspectors'])),
                  date=w.s.now()[:10], scope='\n'.join(summaries), issues=issues, signatures=signatures,
                  noHazard=not issues and all(source(w, r)[0].get('noHazard') for r in rows), combined=True)
    value = dict(id=report_id, projectId=rows[0]['projectId'], title=rows[0]['project'] + ' 巡查合并报告',
                 createdAt=w.s.now(), createdBy=w.user['id'], createdByName=w.user['name'],
                 readers=list(dict.fromkeys(readers)), sources=sources, report=report, contentHash=digest(report),
                 revision=1, recipientId='', recipientName='', recipientSignature=None, history=[])
    w.c.execute('INSERT INTO combined_reports VALUES(?,?,?)', (report_id, value['projectId'], encode(value)))
    return public(w, value)


def mutate(w, action, data):
    value = get(w, w.text(data, 'combinedId', 100))
    if action == 'combined-assign':
        if not public(w, value)['canAssign']:
            w.fail('仅汇总人或项目管理人员可在签署前指定签名人', 403)
    elif w.user['id'] != value['recipientId']:
        w.fail('请使用指定的被检查单位负责人本人账号签署', 403)
    if data.get('revision') != value['revision']:
        w.fail('报告签字状态已更新，请刷新核对后再提交', 409)
    if value['recipientSignature']:
        w.fail('报告已签署，不能覆盖签字；内容变更请重新生成报告', 409)
    if action == 'combined-assign':
        recipient = w.member(value['projectId'], w.text(data, 'recipientId', 100))
        value['recipientId'] = recipient
        value['recipientName'] = w.c.execute('SELECT name FROM users WHERE id=?', (recipient,)).fetchone()[0]
    else:
        if data.get('contentHash') != value['contentHash']:
            w.fail('签署的报告内容不一致，请重新打开报告核对', 409)
        if data.get('confirmed') is not True:
            w.fail('请本人核对整份报告后确认签署')
        # Upload through this operation: never accept another person's existing signature ID.
        ev = w.upload(dict(projectId=value['projectId'], name='被检查单位负责人签名.png',
                           base64=w.text(data, 'base64', 2_000_000), occurredAt=w.s.now()))
        if ev['mime'] != 'image/png':
            w.fail('请提交 PNG 手写签名')
        value['recipientSignature'] = dict(evidenceId=ev['id'], name=w.user['name'], userId=w.user['id'],
                                           signedAt=w.s.now(), contentHash=value['contentHash'])
    value['revision'] += 1
    value['history'].append(dict(action=action, actorId=w.user['id'], actorName=w.user['name'],
                                 at=w.s.now(), recipientId=value['recipientId'], revision=value['revision']))
    w.c.execute('UPDATE combined_reports SET payload=? WHERE id=?', (encode(value), value['id']))
    return public(w, value)


def export(w, value):
    import notice_docx
    report = copy.deepcopy(value['report'])
    report['sources'] = value['sources']
    report['contentHash'] = value['contentHash']
    if value['recipientSignature']:
        signature = value['recipientSignature']
        report['recipientSignature'] = dict(signature, signature='evidence:' + signature['evidenceId'])
    def read_image(ref):
        kind, mid = ref.split(':', 1)
        if kind == 'media':
            row = w.c.execute('SELECT * FROM media WHERE id=?', (mid,)).fetchone()
            if not row:
                w.fail('原报告照片不存在', 404)
            name, mime = row['name'], row['mime']
        else:
            row = w.c.execute('SELECT project_id,payload FROM evidence WHERE id=?', (mid,)).fetchone()
            if not row or row['project_id'] != value['projectId']:
                w.fail('报告证据不存在或不属于当前项目', 403)
            meta = json.loads(row['payload'])
            name, mime = meta['filename'], meta['mime']
        return (w.s.DATA / 'uploads' / name).read_bytes(), mime
    return notice_docx.render(report, read_image, w.s.dimensions)
