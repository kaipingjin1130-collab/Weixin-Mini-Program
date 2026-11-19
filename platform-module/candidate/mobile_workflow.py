"""Four-stage mobile workflow. All mutations share the HTTP transaction/idempotency boundary."""
import copy
import json
from datetime import date
import combined_reports as combined
from host_auth import is_admin

STAGES = {'dispatch': '工地信息填写 / 任务派发', 'inspection': '现场检查 · 草稿箱',
          'review': '现场检查 · 组长筛选', 'signing': '报告生成 · 各方签字',
          'published': '报告已发布 · 待工作认定', 'recognized': '工作认定完成'}


def init(c):
    c.executescript('''
    CREATE TABLE IF NOT EXISTS mobile_settings(id TEXT PRIMARY KEY, payload TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS mobile_notifications(id TEXT PRIMARY KEY, user_id TEXT NOT NULL, payload TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS mobile_outbox(id TEXT PRIMARY KEY, payload TEXT NOT NULL);
    ''')


def setting(w, key):
    row = w.c.execute('SELECT payload FROM mobile_settings WHERE id=?', (key,)).fetchone()
    return json.loads(row[0]) if row else {}


def save_setting(w, key, value):
    w.c.execute('INSERT INTO mobile_settings VALUES(?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload', (key, json.dumps(value, ensure_ascii=False)))


def integer(w, value, label, minimum=1, maximum=100):
    if type(value) is not int or not minimum <= value <= maximum:
        w.fail(label + f'须为 {minimum} 至 {maximum} 的整数')
    return value


def people(w, pid, value, allow_empty=False):
    if not isinstance(value, list) or (not value and not allow_empty) or len(value) > 100 or any(not isinstance(x, str) for x in value) or len(set(value)) != len(value):
        w.fail('请选择不重复的项目人员')
    for uid in value:
        w.member(pid, uid, ['manager', 'inspector'])
    return value


def manage(w, t):
    role = w.role(t['projectId'])
    if role not in ('admin', 'manager') and not (role == 'inspector' and w.user['id'] == t['leaderId']):
        w.fail('仅指定组长或项目经理可操作', 403)


def leader_start_authority(w, t):
    if w.user['id'] != t.get('leaderId'):
        w.fail('仅本任务指定组长本人可直接开始巡查', 403)
    w.member(t['projectId'], w.user['id'], ['manager', 'inspector'])
    if w.user['id'] in t.get('removedApplicantIds', []):
        w.fail('项目负责人已移除你的报名，请先联系项目负责人核对安排', 403)


def project_people(w, pid, roles):
    return [r['user_id'] for r in w.c.execute('SELECT user_id,role FROM memberships WHERE project_id=?', (pid,))
            if r['role'] in roles]


def notify(w, t, uids, kind, text):
    for uid in set(uids) - {''}:
        nid = w.s.uid()
        value = dict(id=nid, taskId=t['id'], projectId=t['projectId'], kind=kind, text=text,
                     createdAt=w.s.now(), readAt='', pushStatus='pending')
        w.c.execute('INSERT INTO mobile_notifications VALUES(?,?,?)', (nid, uid, json.dumps(value, ensure_ascii=False)))


def queue(w, t):
    """Persist desired state; external IO runs only after commit in the explicit sync worker."""
    job = dict(taskId=t['id'], revision=t['revision'], actor=w.user, status='pending', attempts=0, task=copy.deepcopy(t))
    key = t['id'] + ':' + str(t['revision'])
    w.c.execute('INSERT INTO mobile_outbox VALUES(?,?) ON CONFLICT DO NOTHING', (key, json.dumps(job, ensure_ascii=False)))


def save(w, t, action, detail=''):
    w.stamp(t, action, detail)
    w.persist(t)
    if action in ('mobile-roster', 'mobile-leader-start', 'mobile-recognize'): queue(w, t)
    return t


def initialize(w, t, d, adhoc=False):
    t.update(workflowVersion=2, stage='dispatch', site=w.text(d, 'site', 300),
             workDate=w.checkdate(d.get('workDate')), requiredPeople=integer(w, d.get('requiredPeople'), '任务需求人数'),
             invitedIds=people(w, t['projectId'], d.get('invitedIds', []), allow_empty=True),
             signupMode='project-open', removedApplicantIds=[], applicantRemovals=[],
             acceptedIds=[w.user['id']] if adhoc else [], confirmedIds=[], rosterConfirmedAt='',
             workType=w.optional(d, 'workType', 100) or '现场巡查', catalogId=setting(w, 'project:'+t['projectId']).get('catalogId'),
             syncStatus='pending')
    if not t.get('leaderId'):
        w.fail('请选择组长 / 项目负责人')
    w.member(t['projectId'], t['leaderId'], ['manager', 'inspector'])
    # A confirmed roster is required even for self-initiated inspections.
    t['status'] = 'ready'
    t['object'] = t['site']
    t['dueDate'] = t['workDate']
    notify(w, t, project_people(w, t['projectId'], ['manager', 'inspector']) + [t['leaderId']],
           'dispatch', '巡查任务已发布，可自主报名接单，待项目负责人确定名单：' + t['title'])


def guard(w, t, action, d):
    if t.get('workflowVersion') != 2:
        return
    if action in ('submit-field', 'receive-field', 'handover', 'deliver', 'archive', 'reopen', 'import-report', 'assign-leader'):
        w.fail('请按任务工作台的草稿筛选、各方签字、确认发布和工作认定流程办理', 409)
    if action in ('start', 'materials', 'record', 'issue', 'edit-issue', 'delete-issue'):
        if t['stage'] != 'inspection' or not t.get('rosterConfirmedAt'):
            w.fail('须先接单并由组长 / 项目经理确认最终名单', 409)
        if not is_admin(w.user) and w.user['id'] not in t['confirmedIds']:
            w.fail('当前账号不在已确认检查名单内', 403)
        if action == 'record':
            d['confirm'] = False
        if action in ('issue', 'edit-issue') and (d.get('assignee') or d.get('reviewer')):
            w.fail('现场记录须先进入草稿箱，再由组长筛选')


def state(w, query):
    source = w.state()
    start, end = query.get('from', [''])[0], query.get('to', [''])[0]
    if start: w.checkdate(start)
    if end: w.checkdate(end)
    if start and end and start > end: w.fail('开始日期不能晚于结束日期')
    tasks = [t for t in source['tasks'] if t.get('workflowVersion') == 2]
    scoped = [t for t in tasks if (not start or t['workDate'] >= start) and (not end or t['workDate'] <= end)]
    all_people = is_admin(w.user)
    scope = query.get('scope', ['self'])[0]
    if scope not in ('self', 'all'): w.fail('统计范围无效')
    if scope == 'all' and not all_people: w.fail('全部人员统计仅向管理员开放', 403)
    names = {m['id']: m['name'] for p in source['projects'] for m in p['members']}
    names[w.user['id']] = w.user['name']
    ids = set(names) if scope == 'all' else {w.user['id']}
    rows = []
    for uid in sorted(ids):
        mine = [t for t in scoped if uid in t['confirmedIds']]
        accepted = [t for t in scoped if uid in t['acceptedIds']]
        recognized = [t for t in mine if t.get('recognition') and uid in t['recognition']['actualIds']]
        rows.append(dict(id=uid, name=names[uid], accepted=len(accepted), confirmed=len(mine),
                         published=sum(t['stage'] in ('published', 'recognized') for t in mine),
                         recognized=len(recognized), hours=sum(t['recognition']['hoursPerPerson'] for t in recognized),
                         workDays=len({t['workDate'] for t in recognized})))
    project_rows = []
    for p in source['projects']:
        config = setting(w, 'project:'+p['id'])
        pt = [t for t in scoped if t['projectId'] == p['id']]
        # Contract per-visit headcount and period person-visits are deliberately separate units.
        limit = config.get('contractPeople')
        project_rows.append(dict(id=p['id'], name=p['name'], contract=p['contract'], config=config,
            demand=sum(t['requiredPeople'] for t in pt), confirmed=sum(len(t['confirmedIds']) for t in pt),
            actual=sum(len(t.get('recognition', {}).get('actualIds', [])) for t in pt),
            distinctPeople=len({u for t in pt for u in t.get('recognition', {}).get('actualIds', [])}),
            overTasks=sum(t['requiredPeople'] > limit for t in pt) if limit is not None else None,
            maxDemand=max([t['requiredPeople'] for t in pt], default=0)))
    notifications = []
    visible = {p['id'] for p in source['projects']}
    for row in w.c.execute('SELECT payload FROM mobile_notifications WHERE user_id=?', (w.user['id'],)):
        n = json.loads(row[0])
        if n['projectId'] in visible: notifications.append(n)
    for t in tasks:
        t['stageName'] = STAGES[t['stage']]
        role = next(p['role'] for p in source['projects'] if p['id'] == t['projectId'])
        t['canManage'] = role in ('admin', 'manager') or (role == 'inspector' and w.user['id'] == t['leaderId'])
        t['canConfirmRoster'] = role in ('admin', 'manager')
        t['signupRemoved'] = w.user['id'] in t.get('removedApplicantIds', [])
        t['hasApplied'] = w.user['id'] in t['acceptedIds']
        t['canAccept'] = role in ('manager', 'inspector') and t['stage'] == 'dispatch' and not t['signupRemoved'] and not t['hasApplied']
        t['canLeaderStart'] = (w.user['id'] == t['leaderId'] and role in ('admin', 'manager', 'inspector')
                               and t['stage'] == 'dispatch' and not t['signupRemoved'])
        t['confirmedNames'] = '、'.join(names.get(uid, uid) for uid in t['confirmedIds'])
        t['acceptedPeople'] = [dict(id=uid, name=names.get(uid, uid)) for uid in t['acceptedIds']]
        t['overContract'] = next((p['config'].get('contractPeople') is not None and t['requiredPeople'] > p['config']['contractPeople'] for p in project_rows if p['id'] == t['projectId']), False)
    from mobile_push import config as push_config
    return dict(user=source['user'], projects=source['projects'], tasks=tasks, statistics=rows, pushConfig=push_config(),
                projectStatistics=project_rows, canViewAll=all_people, scope=scope,
                notifications=sorted(notifications, key=lambda n:n['createdAt'], reverse=True)[:100])


def dispatch(w, action, d):
    if action == 'mobile-project-config':
        pid = w.text(d, 'projectId'); w.allow(pid, ['manager'])
        old = setting(w, 'project:'+pid)
        if d.get('revision', 0) != old.get('revision', 0): w.fail('合同人数配置已变化，请刷新', 409)
        value = dict(contractPeople=integer(w, d.get('contractPeople'), '合同每次要求人数', 0),
                     basis=w.text(d, 'basis', 1000), revision=old.get('revision', 0)+1,
                     catalogId=integer(w, d['catalogId'], '老平台合同目录ID', 1, 2147483647) if d.get('catalogId') else None,
                     updatedBy=w.user['id'], updatedAt=w.s.now())
        if value['catalogId']:
            for row in w.c.execute("SELECT id,payload FROM mobile_settings WHERE id LIKE 'project:%'"):
                if row['id'] != 'project:'+pid and json.loads(row['payload']).get('catalogId') == value['catalogId']:
                    w.fail('该老平台合同目录已绑定其他小察项目，请核对，避免重复导入', 409)
        if old.get('catalogId') != value['catalogId'] and any(json.loads(r[0]).get('legacyTaskId') for r in w.c.execute('SELECT payload FROM tasks WHERE project_id=?', (pid,))):
            w.fail('该项目已有互通任务，不能直接改变合同绑定', 409)
        value['history'] = old.get('history', []) + [{k:v for k,v in old.items() if k != 'history'}] if old else []
        save_setting(w, 'project:'+pid, value)
        return value
    if action == 'mobile-notification-read':
        row = w.c.execute('SELECT payload FROM mobile_notifications WHERE id=? AND user_id=?', (d.get('id'), w.user['id'])).fetchone()
        if not row: w.fail('提醒不存在', 404)
        value = json.loads(row[0]); w.role(value['projectId']); value['readAt'] = w.s.now()
        w.c.execute('UPDATE mobile_notifications SET payload=? WHERE id=?', (json.dumps(value, ensure_ascii=False), d['id']))
        return value
    if action == 'mobile-create':
        pid = w.text(d, 'projectId'); w.allow(pid, ['manager'])
        t = w.dispatch('tasks', dict(d, scenarioId='inspection', assignee=d.get('leaderId'), receiverName='待各方签字确认', workflowVersion=2))
        return t
    t = w.task(d.get('taskId'))
    if t.get('workflowVersion') != 2: w.fail('历史任务保留原流程，不能转换已签署内容', 409)
    if d.get('revision') != t['revision']: w.fail('任务已变化，请刷新后重试', 409)
    stage = t['stage']; pid = t['projectId']
    if action == 'mobile-accept':
        if stage != 'dispatch': w.fail('报名已结束，最终检查名单已锁定', 409)
        w.member(pid, w.user['id'], ['manager', 'inspector'])
        if w.user['id'] in t.get('removedApplicantIds', []): w.fail('项目负责人已移除你的报名，本任务不能重复报名', 403)
        if w.user['id'] in t['acceptedIds']: return t
        t['acceptedIds'].append(w.user['id'])
        notify(w, t, project_people(w, pid, ['manager']) + [t['leaderId'], t['createdBy']],
               'accepted', w.user['name']+'已报名接单，待项目负责人确定名单：'+t['title'])
    elif action == 'mobile-remove-applicant':
        w.allow(pid, ['manager'])
        if stage != 'dispatch': w.fail('最终名单已锁定，不能移除报名人员', 409)
        uid = w.text(d, 'userId', 100)
        if uid not in t['acceptedIds']: w.fail('该人员已不在报名名单，请刷新', 409)
        t['acceptedIds'].remove(uid)
        t.setdefault('removedApplicantIds', []).append(uid)
        t.setdefault('applicantRemovals', []).append(dict(userId=uid, actor=w.user['id'],
                                                         at=w.s.now(), reason=w.optional(d, 'reason', 1000)))
        notify(w, t, [uid], 'signup-removed', '项目负责人已移除你的报名：'+t['title'])
    elif action == 'mobile-leader-start':
        leader_start_authority(w, t)
        if stage != 'dispatch': w.fail('巡查已经开始，最终名单已锁定，请刷新任务', 409)
        reason = w.optional(d, 'reason', 1000)
        if t['requiredPeople'] != 1 and not reason:
            w.fail('需求超过1人，组长提前单人开始须填写原因')
        uid = w.user['id']
        if uid not in t['acceptedIds']: t['acceptedIds'].append(uid)
        t.update(confirmedIds=[uid], rosterConfirmedAt=w.s.now(), rosterConfirmedBy=uid,
                 rosterReason=reason, rosterMode='leader-solo', stage='inspection', status='active',
                 assignee=uid, inspectors=w.user['name'])
        notify(w, t, t['acceptedIds'] + t.get('invitedIds', []) + project_people(w, pid, ['manager']) + [t['createdBy']],
               'roster', '组长已确认仅本人参加并开始巡查，报名已结束：'+t['title'])
    elif action == 'mobile-roster':
        w.allow(pid, ['manager'])
        if stage != 'dispatch': w.fail('检查开始后名单已锁定', 409)
        chosen = people(w, pid, d.get('confirmedIds'))
        if not set(chosen) <= set(t['acceptedIds']): w.fail('最终名单只能选择已经本人接单的人员')
        if len(chosen) != t['requiredPeople'] and not w.optional(d, 'reason', 1000): w.fail('最终人数与需求人数不一致，请填写原因')
        t.update(confirmedIds=chosen, rosterConfirmedAt=w.s.now(), rosterConfirmedBy=w.user['id'],
                 rosterReason=w.optional(d, 'reason', 1000), stage='inspection', status='active', assignee=chosen[0])
        t['inspectors']='、'.join(w.c.execute('SELECT name FROM users WHERE id=?',(uid,)).fetchone()[0] for uid in chosen)
        notify(w, t, t['acceptedIds'] + t.get('invitedIds', []), 'roster', '项目负责人已确认最终名单，请查看是否入选：'+t['title'])
    elif action == 'mobile-complete':
        if stage != 'inspection': w.fail('当前不在现场检查阶段', 409)
        if w.user['id'] not in t['confirmedIds']: manage(w, t)
        t.update(stage='review', fieldStatus='review', fieldSummary=w.optional(d, 'text'), noHazard=d.get('noHazard') is True)
        if not t['issues'] and not t['records'] and not (t['noHazard'] and t['fieldSummary']): w.fail('请保存检查记录，或填写无隐患结论')
        notify(w, t, [t['leaderId']], 'review', '检查草稿待筛选：'+t['title'])
    elif action == 'mobile-return':
        manage(w, t)
        if stage != 'review': w.fail('仅待筛选草稿可退回', 409)
        t.update(stage='inspection', fieldStatus='collecting', returnReason=w.text(d, 'text', 1000))
        notify(w, t, t['confirmedIds'], 'returned', '检查草稿已退回：'+t['title'])
    elif action == 'mobile-select':
        manage(w, t)
        if stage != 'review': w.fail('须先完成检查再筛选清单', 409)
        selected = d.get('selectedIds')
        items = t['issues'] + t['records']; ids = {i['id'] for i in items}
        if not isinstance(selected, list) or any(not isinstance(x, str) for x in selected) or len(set(selected)) != len(selected) or not set(selected) <= ids: w.fail('筛选清单无效')
        reason = w.optional(d, 'reason', 1000)
        if set(selected) != ids and not reason: w.fail('排除记录须填写筛选理由')
        selected_issues = {i['id'] for i in t['issues']}.intersection(selected)
        if not selected_issues and not (d.get('noHazard') is True and w.optional(d, 'text')): w.fail('无入选隐患时必须明确无隐患并填写检查结论')
        t.update(selectedIds=selected, selectionReason=reason, selectedBy=w.user['id'], selectedAt=w.s.now(),
                 noHazard=not selected_issues, fieldSummary=w.optional(d, 'text') or t.get('fieldSummary', ''), stage='signing', fieldStatus='submitted')
        t['fieldSummary']='工地：'+t['site']+'；工作日期：'+t['workDate']+'\n'+t['fieldSummary']
        bid=w.s.uid(); t['fieldBriefs'].append(dict(id=bid,version=1,createdAt=w.s.now()))
        snap=w.snapshot(t,1); snap['documentKind']='field-brief'
        snap['task']['issues']=[i for i in snap['task']['issues'] if i['id'] in selected]
        snap['task']['records']=[dict(i,status='confirmed') for i in snap['task']['records'] if i['id'] in selected]
        snap['task']['handoverSummary']=t['fieldSummary']
        w.c.execute('INSERT INTO field_reports VALUES(?,?,?)',(bid,t['id'],json.dumps(snap,ensure_ascii=False)))
        # Manager selection freezes a review copy; original drafts remain intact.
        w.persist(t)
        report=combined.create(w,dict(keys=['brief:'+bid]))
        t['combinedId']=report['id']
        notify(w,t,t['confirmedIds']+[t['leaderId']],'signing','清单已确定，请在报告页核对并签字：'+t['title'])
    elif action == 'mobile-publish':
        manage(w,t)
        if stage!='signing': w.fail('报告已发布或尚未生成',409)
        report=combined.get(w,t['combinedId'])
        persons=combined.signers(report)+report.get('guestSigners',[])
        if not persons or any(not p['signature'] for p in persons): w.fail('须全部指定人员签字后才可确认发布',409)
        signed={p.get('userId') for p in persons if p['signature']}
        if not set(t['confirmedIds']) <= signed or t['leaderId'] not in signed: w.fail('检查名单全员和组长须本人签字',409)
        if not any(p['role'] in ('被检查人','被检查单位负责人') for p in persons): w.fail('请增加至少一位被检查人并完成签字',409)
        if d.get('contentHash') != report['contentHash'] or d.get('reportRevision') != report['revision']: w.fail('报告签字状态已变化，请重新核对后发布',409)
        t.update(stage='published',publishedAt=w.s.now(),publishedBy=w.user['id'])
        report.update(publishedAt=t['publishedAt'],publishedBy=w.user['id']);report['revision']+=1
        w.c.execute('UPDATE combined_reports SET payload=? WHERE id=?',(combined.encode(report),report['id']))
        notify(w,t,t['confirmedIds']+[t['leaderId']],'published','报告已确认发布，待工作认定：'+t['title'])
    elif action == 'mobile-recognize':
        manage(w,t)
        if stage!='published': w.fail('报告发布后才能认定工作，已认定任务不能重复计量',409)
        actual=people(w,pid,d.get('actualIds'))
        if not set(actual) <= set(t['confirmedIds']): w.fail('实际人员须来自最终检查名单')
        hours=d.get('hoursPerPerson')
        if type(hours) not in (int,float) or not 0 < hours <= 24: w.fail('每人实际工时须大于0且不超过24')
        t.update(stage='recognized',recognition=dict(actualIds=actual,hoursPerPerson=hours,note=w.text(d,'text',1000),
                                                    actor=w.user['id'],at=w.s.now()),status='archived',archivedAt=w.s.now())
        notify(w,t,actual,'recognized','工作已认定：'+t['title'])
    else: w.fail('接口不存在',404)
    return save(w,t,action,w.optional(d,'reason',1000))
