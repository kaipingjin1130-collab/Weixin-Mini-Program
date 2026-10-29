"""A-owned ab-integration/1.0 endpoints. Enable explicitly after B is compatible."""
import hashlib
import hmac
import json
import os
import time
import uuid
from urllib.error import HTTPError, URLError
from urllib.request import Request, build_opener, ProxyHandler
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

PERMISSIONS = {f'{group}.{action}' for group, actions in {
    'knowledge': ('read', 'process', 'review', 'publish'),
    'imports': ('read', 'create', 'retry', 'withdraw'),
    'retrospective': ('read', 'generate', 'edit', 'review'),
    'training': ('learn', 'manage', 'review'),
}.items() for action in actions}
SERVICE_ACTIONS = {'metadata.read', 'snapshot.read', 'evidence.read'}


def enabled():
    return os.environ.get('AB_INTEGRATION_VERSION') == '1.0'


def config():
    """No implicit organization, administrator grants, or service scopes."""
    value = json.loads(Path(os.environ['AB_AUTHORIZATION_FILE']).read_text(encoding='utf-8'))
    if not isinstance(value.get('org_id'), str) or not value['org_id'].strip():
        raise ValueError('org_id required')
    if type(value.get('is_demo')) is not bool:
        raise ValueError('is_demo required')
    service = value['service']
    if service['org_id'] != value['org_id'] or not isinstance(service['project_ids'], list):
        raise ValueError('invalid service scope')
    if not set(service['allowed_actions']) <= SERVICE_ACTIONS:
        raise ValueError('unknown service action')
    for projects in value['grants'].values():
        for permissions in projects.values():
            if not isinstance(permissions, list) or not set(permissions) <= PERMISSIONS:
                raise ValueError('unknown permission')
    return value


def init(db):
    db.execute('''CREATE TABLE IF NOT EXISTS ab_source_withdrawals(
        delivery_id TEXT PRIMARY KEY REFERENCES deliveries(id),
        withdrawn_at TEXT NOT NULL, reason TEXT NOT NULL, actor_id TEXT NOT NULL)''')


def identity(s, user, settings, project_id=None):
    projects = []
    with s.db() as db:
        for pid, permissions in settings['grants'].get(user['id'], {}).items():
            exists = db.execute('SELECT id FROM projects WHERE id=?', (pid,)).fetchone()
            member = s.host_auth.is_admin(user) or db.execute(
                'SELECT 1 FROM memberships WHERE project_id=? AND user_id=?', (pid, user['id'])).fetchone()
            if exists and member and permissions and (project_id is None or project_id == pid):
                projects.append({'project_id': pid, 'permissions': sorted(set(permissions))})
    if project_id is not None and not projects:
        raise s.Problem('无项目权限', 403)
    return dict(active=True, subject_id=user['id'], display_name=user['name'],
                org_id=settings['org_id'], projects=projects)


def delivery(s, did, settings, action):
    with s.db() as db:
        row = db.execute('SELECT * FROM deliveries WHERE id=?', (did,)).fetchone()
        if not row:
            raise s.Problem('成果不存在', 404)
        snap = json.loads(row['payload'])
        pid = snap['project']['id']
        service = settings['service']
        if pid not in service['project_ids'] or action not in service['allowed_actions']:
            raise s.Problem('服务无成果访问权限', 403)
        withdrawn = db.execute('SELECT * FROM ab_source_withdrawals WHERE delivery_id=?', (did,)).fetchone()
    # Eligibility belongs to this immutable snapshot, not the mutable task head.
    archived = snap.get('task', {}).get('status') == 'archived'
    meta = dict(source_system='a', org_id=settings['org_id'], project_id=pid,
                task_id=row['task_id'], delivery_id=did, delivery_version=row['version'],
                eligible=archived and not withdrawn,
                ineligible_reason='SOURCE_WITHDRAWN' if withdrawn else (None if archived else 'NOT_ARCHIVED'),
                withdrawn=bool(withdrawn), withdrawn_at=withdrawn['withdrawn_at'] if withdrawn else None,
                withdraw_reason=withdrawn['reason'] if withdrawn else None, is_demo=settings['is_demo'])
    meta['eligible'] = bool(meta['eligible'])
    return meta, snap


def evidence(s, snap, eid):
    item = next((x for x in snap.get('evidence', []) if x['id'] == eid), None)
    if not item or item.get('projectId') != snap['project']['id']:
        raise s.Problem('附件不属于指定成果', 403)
    root = (s.DATA / 'uploads').resolve()
    path = (root / item['filename']).resolve()
    if root not in path.parents or not path.is_file():
        raise s.Problem('附件不存在', 404)
    if path.stat().st_size > 10 * 1024 * 1024:
        raise s.Problem('附件超过10MiB', 413)
    content = path.read_bytes()
    if len(content) != item['size'] or hashlib.sha256(content).hexdigest() != item['sha256']:
        raise s.Problem('附件与冻结清单不一致', 409)
    return {k: v for k, v in item.items() if k != 'filename'}, content


def install(s):
    previous = s.Handler.handle_request

    def handle(self, method):
        if not enabled():
            return previous(self, method)
        path = urlsplit(self.path).path
        prefix = s.PREFIX
        local = path[len(prefix):] if path.startswith(prefix + '/') else ''
        service_get = method == 'GET' and local.startswith(('/api/work/delivery-meta/',
            '/api/work/snapshot/', '/api/work/evidence-meta/', '/api/work/evidence/'))
        resolve = local == '/integration/v1/identity/resolve'
        legacy_identity = local.startswith('/integration/v1/identity/') and not resolve
        knowledge = local == '/api/work/knowledge' and method == 'POST'
        context = local == '/api/work/integration-context' and method == 'GET'
        user_meta = local.startswith('/api/work/integration-delivery/') and method == 'GET'
        # Ordinary users retain existing snapshot and attachment behavior.
        if not resolve and not legacy_identity and not knowledge and not context and not user_meta and not (service_get and (local.startswith('/api/work/delivery-meta/')
                or self.headers.get('Authorization', '').startswith('Bearer '))):
            return previous(self, method)
        self.db_connection = None
        rid = self.headers.get('X-Request-ID') or str(uuid.uuid4())
        try:
            if legacy_identity:
                raise s.Problem('v1模式请使用约定的成果与附件接口', 404)
            settings = config()
            if context or knowledge or user_meta:
                token = self.auth()
                user = s.SESSION_USERS[token]
                if context:
                    self.send(identity(s, user, settings))
                    return
                if user_meta:
                    did = local.rsplit('/', 1)[-1]
                    meta, snap = delivery(s, did, settings, 'metadata.read')
                    grant = identity(s, user, settings, meta['project_id'])['projects'][0]
                    if 'imports.read' not in grant['permissions']:
                        raise s.Problem('无接入查看权限', 403)
                    self.send(dict(meta=meta, permissions=grant['permissions']))
                    return
                self.send(query_knowledge(s, self, token, user, settings, rid))
                return
            key = os.environ.get('B_TO_A_KEY', '')
            if not key or not hmac.compare_digest(self.headers.get('Authorization', ''), 'Bearer ' + key):
                # Existing bearer user sessions remain supported on old routes.
                token = self.headers.get('Authorization', '').removeprefix('Bearer ')
                with s.SESSION_LOCK:
                    is_user = s.SESSIONS.get(token, 0) > time.time()
                if is_user and not resolve and not local.startswith('/api/work/delivery-meta/'):
                    return previous(self, method)
                raise s.Problem('服务凭据无效', 403)
            if resolve:
                if method != 'POST':
                    raise s.Problem('请求方法错误', 405)
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 <= length <= 4096:
                    raise s.Problem('请求过大', 413)
                body = json.loads(self.rfile.read(length) or b'{}')
                if not isinstance(body, dict) or set(body) - {'project_id'} or (body.get('project_id') is not None and not isinstance(body['project_id'], str)):
                    raise s.Problem('身份请求字段无效', 422)
                token = self.headers.get('X-AB-Session', '')
                with s.SESSION_LOCK:
                    user = s.SESSION_USERS.get(token) if s.SESSIONS.get(token, 0) > time.time() else None
                if not user:
                    raise s.Problem('登录已失效', 401)
                if s.host_auth.enabled():
                    user = s.host_auth.identity(s.host_auth.call('identity', {'id': user['id']}, timeout=3))
                self.send(identity(s, user, settings, body.get('project_id')))
                return
            kind, identifier = local.removeprefix('/api/work/').split('/', 1)
            attachment = kind in {'evidence', 'evidence-meta'}
            query = parse_qs(urlsplit(self.path).query)
            did = query.get('deliveryId', [''])[0] if attachment else identifier
            if not did:
                raise s.Problem('服务取件必须提供deliveryId', 422)
            action = 'evidence.read' if attachment else ('metadata.read' if kind == 'delivery-meta' else 'snapshot.read')
            meta, snap = delivery(s, did, settings, action)
            if kind == 'delivery-meta':
                self.send(meta)
                return
            if meta['withdrawn']:
                raise s.Problem('来源成果已撤回', 410)
            if not meta['eligible']:
                raise s.Problem('成果尚未归档', 422)
            if attachment:
                item, content = evidence(s, snap, identifier)
                if kind == 'evidence-meta':
                    self.send(item)
                else:
                    self.send(content, mime=item['mime'])
                return
            for item in snap.get('evidence', []):
                item.pop('filename', None)
            if len(snap.get('evidence', [])) > 100 or len(snap.get('task', {}).get('events', [])) > 500:
                raise s.Problem('成果超过合同容量限制', 413)
            content = json.dumps(snap, ensure_ascii=False).encode('utf-8')
            if len(content) > 5 * 1024 * 1024:
                raise s.Problem('快照超过5MiB', 413)
            self.send(content)
        except (s.Problem, s.host_auth.AuthError) as exc:
            self.send(dict(code={401:'UNAUTHENTICATED',403:'FORBIDDEN',404:'NOT_FOUND',409:'CONFLICT',410:'SOURCE_WITHDRAWN',413:'PAYLOAD_TOO_LARGE',422:'VALIDATION_ERROR',503:'DEPENDENCY_UNAVAILABLE'}.get(exc.status, 'REQUEST_FAILED'),
                           message=exc.message, details=[], request_id=rid), exc.status)
        except (KeyError, OSError):
            self.send(dict(code='CONFIGURATION_UNAVAILABLE', message='联调配置或资料不可用', details=[], request_id=rid), 503)
        except (ValueError, TypeError):
            self.send(dict(code='VALIDATION_ERROR', message='配置或请求格式无效', details=[], request_id=rid), 422)

    s.Handler.handle_request = handle


def query_knowledge(s, handler, token, user, settings, rid):
    # Browser writes need CSRF; existing native bearer clients retain their API.
    if not handler.headers.get('Authorization', '').startswith('Bearer '):
        origin = handler.headers.get('Origin', '')
        if not origin or urlsplit(origin).netloc != handler.headers.get('Host') or not hmac.compare_digest(
                handler.headers.get('X-CSRF-Token', ''), s.ab_csrf(token)):
            raise s.Problem('知识查询安全校验失败', 403)
    length = int(handler.headers.get('Content-Length', '0'))
    if not 0 <= length <= 65536:
        raise s.Problem('知识查询过大', 413)
    body = json.loads(handler.rfile.read(length) or b'{}')
    if not isinstance(body, dict) or not isinstance(body.get('question'), str) or not body['question'].strip():
        raise s.Problem('请填写查询问题', 422)
    with s.db() as db:
        row = db.execute('SELECT payload FROM tasks WHERE id=?', (body.get('taskId'),)).fetchone()
        if not row:
            raise s.Problem('任务不存在', 404)
        task = json.loads(row['payload'])
    grant = identity(s, user, settings, task['projectId'])['projects'][0]
    if 'knowledge.read' not in grant['permissions']:
        raise s.Problem('无知识查询权限', 403)
    payload = dict(request_id=rid, project_id=task['projectId'], task_id=task['id'],
                   question=body['question'], scenario_id=task['scenario']['id'],
                   scenario_version=task['scenario']['version'], object=task['object'],
                   stage='review' if task['status'] in {'handover','accepted','archived'} else 'execution', conditions={})
    key, base = os.environ.get('A_TO_B_KEY'), os.environ.get('QAXC_B_URL')
    if not key or not base:
        raise s.Problem('知识服务未配置', 503)
    from ab_gateway import NoRedirect
    request = Request(base.rstrip('/')+'/integration/v1/a-knowledge/query',
                      data=json.dumps(payload).encode(), headers={'Authorization':'Bearer '+key,
                      'X-AB-Session':token,'X-Request-ID':rid,'Content-Type':'application/json'}, method='POST')
    # No SQLite transaction or session lock spans this call; B may call A back.
    try:
        with build_opener(ProxyHandler({}), NoRedirect()).open(request, timeout=15) as response:
            raw = response.read(5 * 1024 * 1024 + 1)
            if len(raw) > 5 * 1024 * 1024:
                raise s.Problem('知识服务响应超限', 503)
            result = json.loads(raw)
    except HTTPError as exc:
        raise s.Problem('知识服务拒绝请求' if exc.code in (401,403) else '知识服务暂不可用', exc.code if exc.code in (401,403) else 503)
    except (URLError, OSError, ValueError):
        raise s.Problem('知识服务暂不可用', 503)
    if not isinstance(result, dict) or result.get('status') not in {'answered','insufficient_evidence','degraded'} or not isinstance(result.get('items'), list) or result.get('requiresConfirmation') is not True:
        raise s.Problem('知识服务响应不符合约定', 503)
    citations = result.get('citations')
    if not isinstance(citations, list):
        raise s.Problem('知识服务缺少引用', 503)
    ids = {item.get('citation_id') for item in citations if isinstance(item, dict)}
    for item in result['items']:
        if not isinstance(item, dict) or not all(isinstance(item.get(k),str) for k in ('title','text','reference')) or not isinstance(item.get('citation_ids'),list) or any(cid not in ids for cid in item['citation_ids']):
            raise s.Problem('知识条目引用无效', 503)
    result['version'] = result.get('knowledge_release_id') or 'ab-integration/1.0'
    return result
