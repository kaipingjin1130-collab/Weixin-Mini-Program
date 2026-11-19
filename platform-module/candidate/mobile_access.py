"""Task-scoped participation for platform-wide mobile signup; no project grants."""
import json
import host_auth


def enabled(task):
    return task.get('workflowVersion') == 2


def users(w):
    rows = w.c.execute('SELECT id,name FROM users ORDER BY name,id')
    return [dict(id=r['id'], name=r['name']) for r in rows
            if not host_auth.enabled() or r['id'].startswith('host:admin:')]


def person(w, uid):
    if not isinstance(uid, str) or not any(p['id'] == uid for p in users(w)):
        w.fail('请选择已用平台账号登录过的人员')
    return uid


def project_role(w, pid):
    if host_auth.is_admin(w.user): return 'admin'
    row = w.c.execute('SELECT role FROM memberships WHERE project_id=? AND user_id=?', (pid, w.user['id'])).fetchone()
    return row[0] if row else ''


def roster_manager(w, task):
    return w.user['id'] == task['createdBy'] or project_role(w, task['projectId']) in ('admin', 'manager')


def can_review(w, task):
    return roster_manager(w, task) or w.user['id'] == task.get('leaderId')


def can_read(w, task):
    return (project_role(w, task['projectId']) != '' or can_review(w, task)
            or w.user['id'] in task.get('confirmedIds', [])
            or task.get('stage') == 'dispatch')


def check(w, task):
    if not can_read(w, task): w.fail('未入选本任务，不能查看检查内容', 403)
    w.mobile_task = task


def role(w, task):
    if roster_manager(w, task): return 'manager'
    if w.user['id'] == task.get('leaderId') or w.user['id'] in task.get('confirmedIds', []): return 'inspector'
    return 'receiver'


def require_roster_manager(w, task):
    if not roster_manager(w, task): w.fail('仅任务发起人或项目负责人可确认名单、移除报名', 403)


def raw_task(w, task_id):
    row = w.c.execute('SELECT payload FROM tasks WHERE id=?', (task_id,)).fetchone()
    if not row: w.fail('任务不存在', 404)
    return json.loads(row[0])


def project(w, data):
    if data.get('projectName'):
        name = w.text(data, 'projectName', 300)
        pid = w.s.uid()
        w.c.execute('INSERT INTO projects VALUES(?,?,?,?)', (pid, name, '', w.s.now()))
        return pid
    pid = w.text(data, 'projectId')
    if not w.c.execute('SELECT 1 FROM projects WHERE id=?', (pid,)).fetchone(): w.fail('项目不存在', 404)
    return pid


def summary(task):
    keys = ('id', 'number', 'projectId', 'title', 'site', 'workDate', 'requiredPeople', 'stage', 'status',
            'revision', 'workflowVersion', 'leaderId', 'createdBy', 'createdByName', 'source',
            'acceptedIds', 'confirmedIds', 'removedApplicantIds', 'rosterConfirmedAt')
    value = {key: task[key] for key in keys if key in task}
    value.update(publicSummary=True, issues=[], records=[])
    return value


def decorate(w, task):
    uid = w.user['id']
    task.update(canManage=can_review(w, task), canConfirmRoster=roster_manager(w, task),
                canCollect=not task.get('publicSummary') and uid in task.get('confirmedIds', []) and task.get('stage') == 'inspection')
    return task
