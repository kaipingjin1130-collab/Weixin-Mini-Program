"""Same-origin B gateway; the existing platform remains the identity authority."""
import hashlib
import base64
import hmac
import json
import mimetypes
import os
import secrets
import time
from pathlib import Path
from urllib.parse import urlsplit, unquote
from urllib.request import Request, build_opener, ProxyHandler, HTTPRedirectHandler
from urllib.error import HTTPError, URLError


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def project_permissions(role):
    # Existing project membership permits reading and learning. Only existing
    # administrators/managers curate data; B cannot grant new platform access.
    result = {'read', 'knowledge.read', 'package_read'}
    if role in {'admin', 'manager'}:
        result |= {'run', 'audit', 'training_manage', 'training_review',
                   'package_receive', 'package_withdraw'}
    if role == 'admin':
        result.add('manage')
    return sorted(result)


def identity(s, user):
    projects = []
    with s.db() as db:
        for p in db.execute('SELECT id,name FROM projects'):
            if s.host_auth.is_admin(user):
                role = 'admin'
            else:
                row = db.execute('SELECT role FROM memberships WHERE project_id=? AND user_id=?',
                                 (p['id'], user['id'])).fetchone()
                if not row:
                    continue
                role = row['role']
            projects.append({'project_id': p['id'], 'name': p['name'],
                             'permissions': project_permissions(role),
                             'roles': ['admin'] if role in {'admin', 'manager'} else ['learner']})
    return {'active': True, 'subject_id': user['id'], 'display_name': user['name'],
            'org_id': os.environ.get('A_ORG_ID', 'qaxc'), 'projects': projects}


def install(s):
    original = s.Handler.handle_request
    csrf_secret = secrets.token_bytes(32)

    def csrf(token):
        return hmac.new(csrf_secret, token.encode(), hashlib.sha256).hexdigest()

    s.ab_csrf = csrf

    def error(self, message, status):
        if os.environ.get('AB_INTEGRATION_VERSION') == '1.0':
            self.send({'code': {401:'UNAUTHENTICATED',403:'FORBIDDEN',404:'NOT_FOUND',413:'PAYLOAD_TOO_LARGE',503:'DEPENDENCY_UNAVAILABLE'}.get(status,'REQUEST_FAILED'),
                       'message':message,'details':[], 'request_id':self.headers.get('X-Request-ID') or secrets.token_hex(16)},status)
        else:
            self.send({'message':message},status)

    def handle(self, method):
        path = urlsplit(self.path).path
        prefix = s.PREFIX
        local = path[len(prefix):] if path.startswith(prefix + '/') else ''
        if not (local.startswith('/b/') or local == '/b' or local == '/api/csrf-token'
                or local.startswith('/integration/v1/identity/')):
            return original(self, method)
        self.db_connection = None
        try:
            if local.startswith('/integration/v1/identity/'):
                key = os.environ.get('B_TO_A_KEY', '')
                if (method != 'POST' or self.client_address[0] not in {'127.0.0.1', '::1'} or not key
                    or not hmac.compare_digest(self.headers.get('Authorization', ''), 'Bearer ' + key)):
                    raise s.Problem('接口不存在', 404)
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 <= length <= 4096:
                    raise s.Problem('请求过大', 413)
                data = json.loads(self.rfile.read(length) or b'{}')
                if local.endswith('/resolve'):
                    token = self.headers.get('X-AB-Session', '')
                    with s.SESSION_LOCK:
                        user = s.SESSION_USERS.get(token) if s.SESSIONS.get(token, 0) > time.time() else None
                    if not user:
                        raise s.Problem('登录已失效', 401)
                elif local.endswith(('/subject', '/archives', '/archive', '/attachment')):
                    # Worker revalidation uses stable identity, never a stored session.
                    subject = data.get('subject_id')
                    if not isinstance(subject, str) or not subject.startswith('host:admin:'):
                        raise s.Problem('身份无效', 401)
                    user = {'id': subject}
                else:
                    raise s.Problem('接口不存在', 404)
                if s.host_auth.enabled():
                    user = s.host_auth.identity(s.host_auth.call('identity', {'id': user['id']}))
                operation = local.rsplit('/', 1)[-1]
                if operation in {'archives', 'archive', 'attachment'}:
                    self.send(archive_data(s, user, operation, data)); return
                self.send(identity(s, user)); return
            token = self.auth()
            if local == '/api/csrf-token' and method == 'GET':
                self.send({'csrf_token': csrf(token)}); return
            if local == '/b':
                self.send('', 302, mime='text/plain', headers={'Location': prefix + '/b/'}); return
            target = local[2:]
            if target.startswith(('/api/v1/', '/integration/v1/')):
                if method not in {'GET', 'POST', 'PUT', 'PATCH', 'DELETE'}:
                    raise s.Problem('不支持此操作', 405)
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 <= length <= 15 * 1024 * 1024:
                    raise s.Problem('请求超过15MB限制', 413)
                body = None
                if method != 'GET':
                    if not hmac.compare_digest(self.headers.get('X-CSRF-Token', ''), csrf(token)):
                        raise s.Problem('安全校验失败，请刷新页面', 403)
                    origin = self.headers.get('Origin')
                    if os.environ.get('AB_INTEGRATION_VERSION') == '1.0' and not origin:
                        raise s.Problem('写请求缺少同源Origin', 403)
                    if origin and urlsplit(origin).netloc != self.headers.get('Host'):
                        raise s.Problem('不接受跨站请求', 403)
                    body = self.rfile.read(length)
                base = os.environ.get('QAXC_B_URL', '')
                key = os.environ.get('A_TO_B_KEY', '')
                if not base or not key:
                    raise s.Problem('知识中心服务尚未配置', 503)
                headers = {'Authorization': 'Bearer ' + key, 'X-AB-Session': token,
                           'Content-Type': self.headers.get('Content-Type', 'application/json')}
                for name in ('Idempotency-Key', 'X-Request-ID', 'X-Project-ID'):
                    if self.headers.get(name): headers[name] = self.headers[name]
                query = urlsplit(self.path).query
                req = Request(base.rstrip('/') + target + ('?' + query if query else ''),
                              data=body, headers=headers, method=method)
                try:
                    timeout = 15 if target == '/integration/v1/a-knowledge/query' else 45
                    response = build_opener(ProxyHandler({}), NoRedirect()).open(req, timeout=timeout)
                except HTTPError as exc:
                    response = exc
                with response:
                    content = response.read(32 * 1024 * 1024 + 1)
                    if len(content) > 32 * 1024 * 1024:
                        raise s.Problem('响应超过限制', 502)
                    self.send(content, response.code, mime=response.headers.get('Content-Type', 'application/json'),
                              headers={k: response.headers[k] for k in ('Content-Disposition',) if response.headers.get(k)})
                return
            if method != 'GET':
                raise s.Problem('接口不存在', 404)
            root = Path(os.environ.get('QAXC_B_STATIC', s.ROOT / 'web/b')).resolve()
            relative = unquote(target).lstrip('/') or 'index.html'
            file = (root / relative).resolve()
            if root not in file.parents or not file.is_file():
                raise s.Problem('页面不存在', 404)
            self.send(file.read_bytes(), mime=mimetypes.guess_type(file.name)[0] or 'application/octet-stream')
        except s.host_auth.AuthError as exc:
            error(self, exc.message, exc.status)
        except s.Problem as exc:
            error(self, exc.message, exc.status)
        except (ValueError, TypeError, KeyError):
            error(self, '请求格式无效', 400)
        except (URLError, TimeoutError, OSError):
            error(self, '知识中心暂时无法连接，请稍后重试', 503)

    s.Handler.handle_request = handle
    for verb in ('PUT', 'PATCH', 'DELETE'):
        setattr(s.Handler, 'do_' + verb, lambda self, v=verb: self.handle_request(v))


def archive_data(s, user, operation, data):
    grants = {p['project_id']: p for p in identity(s, user)['projects']}
    with s.db() as db:
        if operation == 'archives':
            items = []
            for row in db.execute('SELECT payload FROM tasks'):
                task = json.loads(row['payload'])
                project = grants.get(task['projectId'])
                if project and 'package_receive' in project['permissions'] and task['status'] == 'archived' and task.get('deliveries'):
                    items.append({'id': task['deliveries'][-1]['id'], 'title': task['title'],
                                  'project_id': task['projectId'], 'version': task['deliveries'][-1]['version']})
            return {'items': items}
        row = db.execute('SELECT * FROM deliveries WHERE id=?', (data.get('delivery_id'),)).fetchone()
        if not row:
            raise s.Problem('成果不存在', 404)
        task_row = db.execute('SELECT payload FROM tasks WHERE id=?', (row['task_id'],)).fetchone()
        task = json.loads(task_row['payload']) if task_row else {}
        if task.get('projectId') not in grants:
            raise s.Problem('无权访问此项目', 403)
        if task.get('status') != 'archived' or not task.get('deliveries') or task['deliveries'][-1]['id'] != row['id']:
            raise s.Problem('成果已补正或被新版本替代，请重新接入最新归档版本', 410)
        snapshot = json.loads(row['payload'])
        if operation == 'attachment':
            evidence = next((e for e in snapshot.get('evidence', []) if e['id'] == data.get('evidence_id')), None)
            if not evidence or evidence['projectId'] != task['projectId']:
                raise s.Problem('附件不属于此成果', 403)
            root = (s.DATA / 'uploads').resolve()
            path = (root / evidence['filename']).resolve()
            if root not in path.parents or not path.is_file() or path.stat().st_size > 10 * 1024 * 1024:
                raise s.Problem('附件不可用', 410)
            content = path.read_bytes()
            if len(content) != evidence['size'] or hashlib.sha256(content).hexdigest() != evidence['sha256']:
                raise s.Problem('附件校验失败', 409)
            return {'base64': base64.b64encode(content).decode()}
        for evidence in snapshot.get('evidence', []):
            evidence.pop('filename', None)
        return {'snapshot': snapshot}
