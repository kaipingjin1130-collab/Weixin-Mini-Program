"""Authoritative project ACL mirror, enabled only for the isolated local UAT database."""
import json
import os
from pathlib import Path
import re
import sqlite3
import time

import host_auth

TARGET = Path(__file__).resolve().parents[2] / '.local' / 'identity-uat'
ROLES = {'manager', 'inspector', 'viewer', 'rectifier', 'reviewer', 'receiver'}


def enabled():
    return os.environ.get('QAXC_UAT_PROJECT_SYNC') == '1'


def validate(snapshot):
    if (not isinstance(snapshot, dict) or snapshot.get('source') != 'a.memberships'
            or snapshot.get('version') != 1 or type(snapshot.get('checkedAt')) not in (int, float)
            or not -30 <= time.time() - snapshot['checkedAt'] <= 30
            or not isinstance(snapshot.get('projects'), list)):
        raise ValueError('Missing or stale authoritative permissions')
    project_ids, pairs = set(), set()
    for project in snapshot['projects']:
        pid = project['id']
        if (not isinstance(pid, str) or not re.fullmatch(r'[a-zA-Z0-9_-]{1,100}', pid)
                or pid in project_ids or not isinstance(project['name'], str)
                or not 0 < len(project['name']) <= 300 or not isinstance(project['members'], list)):
            raise ValueError('Invalid project')
        project_ids.add(pid)
        for member in project['members']:
            uid = member['id']
            if (not isinstance(uid, str) or not re.fullmatch(r'host:admin:[1-9][0-9]*', uid)
                    or (pid, uid) in pairs or member['role'] not in ROLES
                    or not isinstance(member['name'], str) or not 0 < len(member['name']) <= 100):
                raise ValueError('Invalid member')
            pairs.add((pid, uid))


def apply(c, snapshot, overrides=()):
    """Caller owns the transaction. Replace grants, preserve all local test records."""
    validate(snapshot)
    c.execute('CREATE TABLE IF NOT EXISTS uat_permission_sync(id INTEGER PRIMARY KEY, checked_at REAL NOT NULL)')
    previous = c.execute('SELECT checked_at FROM uat_permission_sync WHERE id=1').fetchone()
    # Concurrent identity requests can finish out of order; never restore an older grant.
    if previous and snapshot['checkedAt'] < previous[0]:
        return
    exceptions = {(x['projectId'], x['userId']): x for x in overrides
                  if x.get('scope') == 'local-acceptance-only' and x.get('reason')
                  and x.get('before') in ROLES and x.get('after') in ROLES}
    # This database is dedicated to acceptance. No local account or stale grant survives.
    c.execute('DELETE FROM memberships')
    for project in snapshot['projects']:
        c.execute('INSERT INTO projects(id,name,contract,created) VALUES(?,?,?,?) '
                  'ON CONFLICT(id) DO UPDATE SET name=excluded.name',
                  (project['id'], project['name'] + '【本机验收】',
                   '本机验收；未复制正式合同或业务数据', time.strftime('%Y-%m-%dT%H:%M:%S')))
        for member in project['members']:
            host_auth.register(c, dict(id=member['id'], username=member['id'], name=member['name']))
            role = member['role']
            exception = exceptions.get((project['id'], member['id']))
            # Explicit test override applies only while the original membership still exists unchanged.
            if exception and role == exception['before']:
                role = exception['after']
            c.execute('INSERT INTO memberships VALUES(?,?,?)', (project['id'], member['id'], role))
    c.execute('INSERT INTO uat_permission_sync VALUES(1,?) ON CONFLICT(id) DO UPDATE SET checked_at=excluded.checked_at',
              (snapshot['checkedAt'],))


def sync(c, result, data):
    if not enabled():
        return
    try:
        actual = c.execute('PRAGMA database_list').fetchone()[2] if isinstance(c, sqlite3.Connection) else ''
        if (Path(data).resolve() != TARGET.resolve() or not actual
                or Path(actual).resolve() != (TARGET / 'inspections.sqlite3').resolve()
                or os.environ.get('QAXC_DB_URL') or result.get('isAdmin') is not False):
            raise ValueError('UAT isolation required')
        path = TARGET / 'role-overrides.jsonl'
        overrides = [json.loads(line) for line in path.read_text(encoding='utf-8').splitlines() if line.strip()] if path.exists() else []
        c.execute('BEGIN IMMEDIATE')
        apply(c, result.get('projectAccess'), overrides)
    except Exception:
        raise host_auth.AuthError('原平台项目权限核对失败，已停止本次操作，请稍后重试') from None


def guard_write(w, data):
    """A former leader/assignee downgraded to viewer must also become read-only."""
    if not enabled():
        return
    projects = {data['projectId']} if data.get('projectId') else set()
    for key, table in (('taskId', 'tasks'), ('combinedId', 'combined_reports')):
        if data.get(key):
            row = w.c.execute('SELECT project_id FROM ' + table + ' WHERE id=?', (data[key],)).fetchone()
            if row:
                projects.add(row[0])
    for pid in projects:
        w.allow(pid, sorted(ROLES - {'viewer'}))
