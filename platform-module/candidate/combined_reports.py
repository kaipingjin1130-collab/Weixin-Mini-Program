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


def signers(value):
    people = copy.deepcopy(value.get('coSigners', []))
    if value['recipientId']:
        people.append(dict(userId=value['recipientId'], name=value['recipientName'],
                           role='被检查单位负责人', signature=value['recipientSignature']))
    return people


def assignment_hash(value):
    return digest([(p['userId'], p['role']) for p in signers(value)])


def accessible(w, report):
    role = w.role(report['projectId'])
    if role not in ('admin', 'manager', 'inspector') and w.user['id'] not in report['readers'] + [p['userId'] for p in signers(report)]:
        w.fail('这份合并报告未分发给当前账号', 403)


def can_collect(w, value):
    return w.role(value['projectId']) in ('admin', 'manager', 'inspector') or w.user['id'] == value['createdBy']


def guest_hash(person):
    return digest({k: person[k] for k in ('id', 'name', 'unit', 'role')})


def signature_image(w, value, data, role):
    method = data.get('signMethod', 'draw')
    if method not in ('draw', 'image'):
        w.fail('签名方式不支持')
    ev = w.upload(dict(projectId=value['projectId'], name=role+'签名.png',
                       base64=w.text(data, 'base64', 2_000_000), occurredAt=w.s.now()))
    if ev['mime'] not in ('image/png', 'image/jpeg'):
        w.fail('请提交 PNG 或 JPG 签名图片')
    return ev, method


def get(w, report_id):
    row = w.c.execute('SELECT payload FROM combined_reports WHERE id=?', (report_id,)).fetchone()
    if not row:
        w.fail('合并报告不存在', 404)
    value = json.loads(row[0])
    accessible(w, value)
    return value


def public(w, value):
    value = copy.deepcopy(value)
    value['signers'] = signers(value)
    value['guestSigners'] = [dict(p, slotHash=guest_hash(p)) for p in value.get('guestSigners', [])]
    value['canCollectGuest'] = can_collect(w, value)
    value['assignmentHash'] = assignment_hash(value)
    value['signedCount'] = sum(bool(p['signature']) for p in value['signers'] + value['guestSigners'])
    value['canAssign'] = not value['signedCount'] and (is_admin(w.user) or w.user['id'] == value['createdBy'] or w.role(value['projectId']) == 'manager')
    mine = next((p for p in value['signers'] if p['userId'] == w.user['id']), None)
    value['canSign'] = bool(mine and not mine['signature'])
    value['myRole'] = mine['role'] if mine else ''
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
        item = {key: value[key] for key in ('id', 'projectId', 'title', 'createdAt', 'createdByName', 'revision', 'recipientId', 'recipientName', 'recipientSignature')}
        people = signers(value) + value.get('guestSigners', [])
        item.update(signedCount=sum(bool(p['signature']) for p in people), signerCount=len(people))
        result.append(item)
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
    return report, list(filter(None, [task['assignee'], (signature or {}).get('submittedBy')] + [r.get('author') for r in task['records']]))


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
                 revision=1, recipientId='', recipientName='', recipientSignature=None, coSigners=[], guestSigners=[], history=[])
    w.c.execute('INSERT INTO combined_reports VALUES(?,?,?)', (report_id, value['projectId'], encode(value)))
    return public(w, value)


def mutate(w, action, data):
    value = get(w, w.text(data, 'combinedId', 100))
    mine = next((p for p in signers(value) if p['userId'] == w.user['id']), None)
    if action == 'combined-assign':
        if not public(w, value)['canAssign']:
            w.fail('仅汇总人或项目管理人员可在签署前指定签名人', 403)
    elif not mine:
        w.fail('请使用指定会签人本人账号签署', 403)
    # Independent signatures may arrive from the same reviewed revision. The content
    # and signer assignment must still match; each person's slot is append-only.
    concurrent_sign = action == 'combined-sign' and data.get('assignmentHash') == assignment_hash(value)
    if not concurrent_sign and data.get('revision') != value['revision']:
        w.fail('报告签字状态已更新，请刷新核对后再提交', 409)
    if action == 'combined-assign':
        typed = 'managerIds' in data or 'recipientIds' in data
        managers, recipients = data.get('managerIds', []), data.get('recipientIds', [])
        if typed:
            if not isinstance(managers, list) or not managers or not isinstance(recipients, list):
                w.fail('请至少指定一名项目负责人；被检查人账号可多选或留空后现场签署')
            ids = managers + recipients
        else:
            ids = data.get('coSignerIds', [p['userId'] for p in value.get('coSigners', [])])
        if not isinstance(ids, list) or len(ids) > 100 or any(not isinstance(uid, str) for uid in ids) or len(set(ids)) != len(ids):
            w.fail('请选择不重复的会签人，最多100名')
        recipient = (recipients[0] if recipients else '') if typed else w.member(value['projectId'], w.text(data, 'recipientId', 100))
        if not typed and recipient in ids:
            w.fail('受检单位负责人已单独列为签署人，请勿重复选择')
        people = []
        for uid in ids:
            w.member(value['projectId'], uid)
            if uid == recipient:
                continue
            name = w.c.execute('SELECT name FROM users WHERE id=?', (uid,)).fetchone()[0]
            membership = w.c.execute('SELECT role FROM memberships WHERE project_id=? AND user_id=?', (value['projectId'], uid)).fetchone()
            role = ('项目负责人' if uid in managers else '被检查人') if typed else ('项目负责人' if uid == value['createdBy'] or membership and membership[0] == 'manager' else '检查人')
            people.append(dict(userId=uid, name=name, role=role, signature=None))
        value['coSigners'] = people
        value['recipientId'] = recipient
        value['recipientName'] = w.c.execute('SELECT name FROM users WHERE id=?', (recipient,)).fetchone()[0] if recipient else ''
    else:
        if mine['signature']:
            w.fail('你已签署，不能覆盖签字；内容变更请重新生成报告', 409)
        if data.get('assignmentHash') and data['assignmentHash'] != assignment_hash(value):
            w.fail('会签人员已调整，请重新核对后签署', 409)
        if data.get('contentHash') != value['contentHash']:
            w.fail('签署的报告内容不一致，请重新打开报告核对', 409)
        if data.get('confirmed') is not True:
            w.fail('请本人核对整份报告后确认签署')
        # Upload through this operation: never accept another person's existing signature ID.
        ev, method = signature_image(w, value, data, mine['role'])
        signature = dict(evidenceId=ev['id'], name=w.user['name'], userId=w.user['id'], role=mine['role'],
                         signedAt=w.s.now(), contentHash=value['contentHash'], assignmentHash=assignment_hash(value), signMethod=method, channel='account')
        if w.user['id'] == value['recipientId']:
            value['recipientSignature'] = signature
        else:
            next(p for p in value['coSigners'] if p['userId'] == w.user['id'])['signature'] = signature
    value['revision'] += 1
    value['history'].append(dict(action=action, actorId=w.user['id'], actorName=w.user['name'],
                                 at=w.s.now(), recipientId=value['recipientId'], revision=value['revision']))
    w.c.execute('UPDATE combined_reports SET payload=? WHERE id=?', (encode(value), value['id']))
    return public(w, value)


def guest(w, action, data):
    value = get(w, w.text(data, 'combinedId', 100))
    if not can_collect(w, value):
        w.fail('仅本项目检查人或负责人可采集现场签字', 403)
    people = value.setdefault('guestSigners', [])
    if action == 'combined-guest-add':
        if not any(p['role'] == '项目负责人' for p in signers(value)):
            w.fail('请项目负责人先设置会签名单，再采集现场签字')
        if len(people) >= 100:
            w.fail('每份报告最多100个现场签字位置')
        name, unit = w.text(data, 'name', 100), w.text(data, 'unit', 200)
        if any(p['name'] == name and p['unit'] == unit for p in people):
            w.fail('该单位和姓名已有签字位置，请选择已有位置', 409)
        person = dict(id=w.s.uid(), name=name, unit=unit, role='被检查人', signature=None,
                      createdBy=w.user['id'], createdAt=w.s.now())
        people.append(person)
    else:
        person = next((p for p in people if p['id'] == data.get('guestSignerId')), None)
        if not person:
            w.fail('现场签字位置不存在', 404)
        if person['signature']:
            w.fail('该人员已签署，不能覆盖签字', 409)
        if data.get('contentHash') != value['contentHash'] or data.get('slotHash') != guest_hash(person):
            w.fail('报告或签字人信息已变化，请重新核对', 409)
        if data.get('confirmed') is not True:
            w.fail('请被检查人本人核对报告、姓名和单位后确认签署')
        ev, method = signature_image(w, value, data, person['role'])
        person['signature'] = dict(evidenceId=ev['id'], name=person['name'], unit=person['unit'], role=person['role'],
                                   signedAt=w.s.now(), contentHash=value['contentHash'], slotHash=guest_hash(person),
                                   signMethod=method, channel='onsite', collectedBy=w.user['id'], collectedByName=w.user['name'])
    value['revision'] += 1
    value['history'].append(dict(action=action, actorId=w.user['id'], actorName=w.user['name'],
                                 guestSignerId=person['id'], at=w.s.now(), revision=value['revision']))
    w.c.execute('UPDATE combined_reports SET payload=? WHERE id=?', (encode(value), value['id']))
    return public(w, value)


def export(w, value):
    import notice_docx
    report = copy.deepcopy(value['report'])
    report['sources'] = value['sources']
    report['contentHash'] = value['contentHash']
    report['coSignatures'] = [dict(p, signature='evidence:'+p['signature']['evidenceId'],
                                  signedAt=p['signature']['signedAt']) for p in value.get('coSigners', []) if p['signature']]
    report['pendingCoSigners'] = [p for p in value.get('coSigners', []) if not p['signature']]
    report['guestSigners'] = [dict(p, signature=dict(p['signature'], signature='evidence:'+p['signature']['evidenceId']) if p['signature'] else None) for p in value.get('guestSigners', [])]
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
