import copy
import json
import os
from pathlib import Path
import sys
import time
import unittest
import uuid
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tools'))
import test_integration as integration
import uat_identity_gateway as gateway
s = integration.s


class PermissionMirror(unittest.TestCase):
    request = integration.Integration.request
    login = integration.Integration.login

    def setUp(self):
        integration.Integration.setUp(self)
        self.addCleanup(integration.Integration.tearDown, self)
        for context in (patch.dict(os.environ, {'QAXC_UAT_PROJECT_SYNC': '1'}),
                        patch.object(s.uat_permissions, 'TARGET', s.DATA)):
            context.start()
            self.addCleanup(context.stop)
        self.projects = [dict(id='p1', name='原项目', members=[
            dict(id='host:admin:7', name='经理', role='manager'),
            dict(id='host:admin:8', name='检查员', role='inspector'),
            dict(id='host:admin:9', name='查看者', role='viewer')])]
        self.failure = False
        self.disabled = False
        self.missing = False
        def bridge(action, data=None, cookie=''):
            if self.failure: raise s.host_auth.AuthError('认证通道不可用')
            if self.disabled: raise s.host_auth.AuthError('账号已停用', 401)
            uid = (data or {}).get('id') or {'owner':'host:admin:7', 'worker':'host:admin:8',
                    'viewer':'host:admin:9', 'outsider':'host:admin:10'}[data['username']]
            result = dict(active=True, aud='qaxc', id=uid, name=uid, isAdmin=False)
            if not self.missing:
                result['projectAccess'] = dict(source='a.memberships', version=1, checkedAt=time.time(), projects=copy.deepcopy(self.projects))
            return result
        s.host_auth.call.side_effect = bridge

    def post(self, action, token, **data):
        return self.request('/quality/api/work/' + action, dict(requestId=uuid.uuid4().hex, **data), token)

    def state(self, token):
        return self.request('/quality/api/work/mobile-state', token=token)

    def create(self, token):
        return self.post('mobile-create', token, projectId='p1', title='验收巡查', site='测试工地',
                         workDate='2026-11-18', requiredPeople=1, leaderId='host:admin:7', invitedIds=['host:admin:8'])

    def test_other_account_login_does_not_grant_any_project(self):
        token, _ = self.login('outsider')
        self.assertEqual(self.state(token)[1]['projects'], [])
        self.assertEqual(self.create(token)[0], 403)
        with s.db() as c:
            self.assertIsNotNone(c.execute("SELECT id FROM users WHERE id='host:admin:10'").fetchone())
            self.assertIsNone(c.execute("SELECT role FROM memberships WHERE user_id='host:admin:10'").fetchone())

    def test_manager_dispatch_inspector_accept_no_login_needed_to_list_member(self):
        manager, _ = self.login()
        state = self.state(manager)[1]
        self.assertFalse(state['user']['isAdmin'])
        self.assertEqual(len(state['projects'][0]['members']), 3)
        status, task, _ = self.create(manager)
        self.assertEqual(status, 200, task)
        worker, _ = self.login('worker')
        self.assertEqual(self.create(worker)[0], 403)
        accepted = self.post('mobile-accept', worker, taskId=task['id'], revision=task['revision'])
        self.assertEqual(accepted[0], 200, accepted[1])
        self.assertEqual(accepted[1]['acceptedIds'], ['host:admin:8'])
        self.assertEqual(self.post('add-member', manager, projectId='p1', userId='host:admin:10', role='inspector')[0], 403)

    def test_viewer_and_other_project_cannot_dispatch_or_accept(self):
        manager, _ = self.login()
        task = self.create(manager)[1]
        viewer, _ = self.login('viewer')
        self.assertEqual(self.state(viewer)[1]['projects'][0]['role'], 'viewer')
        self.assertEqual(self.create(viewer)[0], 403)
        self.assertEqual(self.post('mobile-accept', viewer, taskId=task['id'], revision=task['revision'])[0], 403)
        self.projects.append(dict(id='p2', name='其他项目', members=[dict(id='host:admin:10', name='他人', role='manager')]))
        outsider, _ = self.login('outsider')
        self.assertEqual([p['id'] for p in self.state(outsider)[1]['projects']], ['p2'])
        self.assertEqual(self.post('mobile-accept', outsider, taskId=task['id'], revision=task['revision'])[0], 403)

    def test_revoked_and_downgraded_permissions_apply_to_existing_session(self):
        manager, _ = self.login()
        task = self.create(manager)[1]
        worker, _ = self.login('worker')
        self.projects[0]['members'][1]['role'] = 'viewer'
        self.assertFalse(self.state(worker)[1]['tasks'][0]['canAccept'])
        self.assertEqual(self.post('mobile-accept', worker, taskId=task['id'], revision=task['revision'])[0], 403)
        self.projects[0]['members'][0]['role'] = 'viewer'
        self.assertFalse(self.state(manager)[1]['tasks'][0]['canManage'])
        self.assertEqual(self.post('mobile-roster', manager, taskId=task['id'], revision=task['revision'], confirmedIds=[])[0], 403)
        self.projects[0]['members'] = []
        self.assertEqual(self.state(manager)[1]['projects'], [])
        with s.db() as c:
            self.assertEqual(c.execute('SELECT COUNT(*) FROM tasks').fetchone()[0], 1)

    def test_missing_invalid_unavailable_permissions_fail_closed(self):
        token, _ = self.login()
        self.failure = True
        self.assertEqual(self.create(token)[0], 503)
        self.failure = False
        self.missing = True
        self.assertEqual(self.state(token)[0], 503)
        self.assertEqual(self.request('/quality/api/login', dict(username='outsider', password='fixture'))[0], 503)
        self.missing = False
        self.projects[0]['members'][0]['role'] = 'admin'
        self.assertEqual(self.state(token)[0], 503)
        self.disabled = True
        self.assertEqual(self.state(token)[0], 401)

    def test_override_is_explicit_local_and_does_not_resurrect_revoked_member(self):
        exception = dict(scope='local-acceptance-only', projectId='p1', userId='host:admin:8',
                         before='inspector', after='manager', reason='Explicit test authorization')
        (s.DATA / 'role-overrides.jsonl').write_text(json.dumps(exception), encoding='utf-8')
        worker, _ = self.login('worker')
        self.assertEqual(self.state(worker)[1]['projects'][0]['role'], 'manager')
        self.projects[0]['members'] = [x for x in self.projects[0]['members'] if x['id'] != 'host:admin:8']
        self.assertEqual(self.state(worker)[1]['projects'], [])

    def test_wrong_database_path_and_stale_snapshot_are_rejected(self):
        with patch.object(s.uat_permissions, 'TARGET', s.DATA / 'not-acceptance'):
            self.assertEqual(self.request('/quality/api/login', dict(username='owner', password='fixture'))[0], 503)
        with self.assertRaises(ValueError):
            s.uat_permissions.validate(dict(source='a.memberships', version=1, checkedAt=time.time()-31, projects=[]))

    def test_out_of_order_snapshot_does_not_restore_revoked_grants(self):
        stamp = time.time()
        with s.db() as c:
            s.uat_permissions.apply(c, dict(source='a.memberships', version=1, checkedAt=stamp, projects=self.projects))
            s.uat_permissions.apply(c, dict(source='a.memberships', version=1, checkedAt=stamp+1, projects=[]))
            s.uat_permissions.apply(c, dict(source='a.memberships', version=1, checkedAt=stamp, projects=self.projects))
            self.assertEqual(c.execute('SELECT COUNT(*) FROM memberships').fetchone()[0], 0)


class ReadOnlyGateway(unittest.TestCase):
    def test_valid_other_identity_without_admin_privileges(self):
        self.assertTrue(gateway.valid_identity(dict(id='host:admin:51', active=True, aud='qaxc')))
        for uid in ('admin', 'host:admin:0', 'host:admin:51\n', 'host:admin:41/anything'):
            self.assertFalse(gateway.valid_identity(dict(id=uid, active=True, aud='qaxc')))

    def test_roster_has_only_active_users_and_explicit_roles(self):
        rows = [['p1', '项目', 'host:admin:7', 'manager'], ['p1', '项目', 'host:admin:51', 'viewer'],
                ['p1', '项目', 'host:admin:99', 'inspector']]
        actor = dict(id='host:admin:7', name='经理', active=True, aud='qaxc')
        def lookup(uid): return dict(id=uid, name='成员', active=uid!='host:admin:99', aud='qaxc')
        with patch.object(gateway.subprocess, 'check_output', return_value=json.dumps(rows).encode()) as reader:
            snapshot = gateway.project_access('python', {}, actor, lookup)
        self.assertEqual([(x['id'], x['role']) for x in snapshot['projects'][0]['members']],
                         [('host:admin:7','manager'), ('host:admin:51','viewer')])
        command = reader.call_args.args[0][2]
        self.assertIn('SET TRANSACTION READ ONLY', command)
        self.assertIn('default_transaction_read_only=on', command)
        for field in ('password', 'digest', 'salt', 'contract'):
            self.assertNotIn(field, command)


if __name__ == '__main__':
    unittest.main()
