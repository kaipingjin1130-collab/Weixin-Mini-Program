from dataclasses import dataclass
import hmac
import httpx
from fastapi import Request


class Problem(Exception):
    def __init__(self, status, code, message):
        self.status, self.code, self.message = status, code, message


@dataclass
class Actor:
    id: str
    subject: str
    name: str
    grants: set[str]
    roles: dict[str, set[str]]
    org_id: str = 'demo-org'
    is_service: bool = False
    producers: frozenset[str] = frozenset()
    permissions: dict[str, set[str]] | None = None

    def can(self, action: str, project: str) -> bool:
        if project not in self.grants:
            return False
        if self.permissions is not None:
            # Coarse legacy actions remain closed until each route is mapped individually.
            return action in self.permissions.get(project, set())
        allowed = {
            "read": {"admin", "processor", "reviewer", "teacher", "learner"},
            "run": {"admin", "processor"},
            "manage": {"admin"},
            "audit": {"admin", "reviewer"},
            "training_manage": {"admin", "teacher"},
            "training_review": {"admin", "reviewer", "teacher"},
            "package_read": {"admin", "processor", "reviewer", "teacher", "learner", "a_service"},
            "package_receive": {"admin", "processor", "a_service"},
            "package_withdraw": {"admin", "reviewer", "a_service"},
        }
        return bool(self.roles.get(project, set()) & allowed[action])

    def projects(self, action="read"):
        return sorted(p for p in self.grants if self.can(action, p))


def current_actor(request: Request) -> Actor:
    from .config import settings
    if settings.auth_mode == 'a':
        from .platform_identity import persist_actor
        return scope_actor(persist_actor(resolve_a_actor(request, settings)), request)
    token = request.headers.get("authorization", "")
    identities = {"Bearer dev-admin": "admin", "Bearer dev-processor": "processor",
                  "Bearer dev-learner": "learner", "Bearer dev-outsider": "outsider",
                  "Bearer dev-a-service": "a-service", "Bearer dev-teacher": "teacher"}
    subject = identities.get(token)
    if subject is None:
        raise Problem(401, "UNAUTHENTICATED", "请选择本地演示身份；真实身份接入尚未配置。")
    from sqlalchemy import select
    from .db import Session
    from .models import UserLink
    with Session() as db:
        user = db.scalar(select(UserLink).where(UserLink.issuer == "local-demo", UserLink.subject_id == subject))
        if not user:
            raise Problem(401, "UNAUTHENTICATED", "演示身份尚未初始化。")
        return scope_actor(actor_for_user(db, user), request)


def scope_actor(actor: Actor, request: Request) -> Actor:
    """A selected project can narrow live grants, never add permissions.

    Persist the full authority response before narrowing this request so a UI
    filter cannot change the stable identity used by already queued work.
    """
    selected = request.headers.get('x-project-id', '')
    if selected:
        if selected not in actor.grants:
            raise Problem(403, 'PROJECT_FORBIDDEN', '当前项目不可访问，请重新选择项目。')
        actor.grants = {selected}
        actor.roles = {selected: actor.roles.get(selected, set())}
        if actor.permissions is not None:
            actor.permissions = {selected: actor.permissions.get(selected, set())}
    return actor


def resolve_a_actor(request: Request, settings) -> Actor:
    authorization = request.headers.get('authorization', '')
    expected = 'Bearer ' + settings.a_to_b_key
    if not hmac.compare_digest(authorization.encode('utf-8'), expected.encode('utf-8')):
        raise Problem(401, 'UNAUTHENTICATED', '代理认证失败。')
    session = request.headers.get('x-ab-session', '')
    if not session or len(session) > 4096 or '\r' in session or '\n' in session:
        raise Problem(401, 'UNAUTHENTICATED', '会话引用无效。')
    try:
        response = httpx.post(settings.a_base + '/integration/v1/identity/resolve',
            headers={'Authorization': 'Bearer ' + settings.b_to_a_key, 'X-AB-Session': session,
                     'X-Request-ID': getattr(request.state, 'request_id', '')},
            json={'project_id': None}, timeout=3.0, follow_redirects=False, trust_env=False)
        if response.status_code == 401:
            raise Problem(401, 'UNAUTHENTICATED', '会话已失效，请返回平台重新登录。')
        if response.status_code == 403:
            raise Problem(403, 'FORBIDDEN', '当前身份没有访问权限。')
        if response.status_code != 200 or len(response.content) > 1024 * 1024:
            raise Problem(503, 'IDENTITY_UNAVAILABLE', '身份服务暂不可用。')
        value = response.json()
        if not isinstance(value, dict) or type(value.get('active')) is not bool:
            raise ValueError('invalid identity')
        if not value['active']:
            raise Problem(401, 'UNAUTHENTICATED', '会话已停用。')
        if any(not isinstance(value.get(k), str) or not value[k] for k in ('subject_id', 'org_id', 'display_name')):
            raise ValueError('invalid identity fields')
        if value['org_id'] != settings.a_org_id or not isinstance(value.get('projects'), list):
            raise ValueError('invalid organization or projects')
        permissions = {}
        for project in value['projects']:
            if (not isinstance(project, dict) or not isinstance(project.get('project_id'), str) or not project['project_id']
                or project['project_id'] in permissions or not isinstance(project.get('permissions'), list)
                or any(not isinstance(p, str) for p in project['permissions'])):
                raise ValueError('invalid project permissions')
            permissions[project['project_id']] = set(project['permissions'])
        actor = Actor(value['subject_id'], value['subject_id'], value['display_name'], set(permissions),
                      {p['project_id']: set(p.get('roles', [])) for p in value['projects']},
                      org_id=value['org_id'], permissions=permissions)
        actor.project_names = {p['project_id']: p.get('name', p['project_id']) for p in value['projects']}
        return actor
    except (httpx.HTTPError, ValueError, TypeError):
        raise Problem(503, 'IDENTITY_UNAVAILABLE', '身份服务暂不可用或返回无效数据。')


def actor_for_user(db, user):
    if user is None:
        raise Problem(403, 'IDENTITY_REVOKED', '任务身份已不可用。')
    if user.issuer.startswith('qaxc:'):
        from .platform_identity import worker_actor
        return worker_actor(user)
    from sqlalchemy import select
    from .models import RoleBinding
    roles = {}
    for binding in db.scalars(select(RoleBinding).where(RoleBinding.user_id == user.id)):
        roles.setdefault(binding.scope_id, set()).add(binding.role)
    service = user.issuer == 'local-demo' and user.subject_id == 'a-service'
    return Actor(user.id, user.subject_id, user.display_name, set(user.authorized_projects), roles,
                 is_service=service, producers=frozenset({'a-demo'}) if service else frozenset())


def package_service_actor(request: Request) -> Actor:
    actor = current_actor(request)
    if not actor.is_service:
        raise Problem(403, 'SERVICE_IDENTITY_REQUIRED', '此任务包集成接口需要已登记的服务身份；本地可用dev-a-service模拟。')
    return actor


def authorize(actor: Actor, action: str, project: str):
    if not actor.can(action, project):
        raise Problem(403, "FORBIDDEN", "当前身份没有此项目的操作权限。")
