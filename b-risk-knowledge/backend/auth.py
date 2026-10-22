from dataclasses import dataclass
from fastapi import Request
from sqlalchemy import select
from .db import Session
from .models import UserLink, RoleBinding


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

    def can(self, action: str, project: str) -> bool:
        if project not in self.grants:
            return False
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
    token = request.headers.get("authorization", "")
    identities = {"Bearer dev-admin": "admin", "Bearer dev-processor": "processor",
                  "Bearer dev-learner": "learner", "Bearer dev-outsider": "outsider",
                  "Bearer dev-a-service": "a-service", "Bearer dev-teacher": "teacher"}
    subject = identities.get(token)
    if subject is None:
        raise Problem(401, "UNAUTHENTICATED", "请选择本地演示身份；真实身份接入尚未配置。")
    with Session() as db:
        user = db.scalar(select(UserLink).where(UserLink.issuer == "local-demo", UserLink.subject_id == subject))
        if not user:
            raise Problem(401, "UNAUTHENTICATED", "演示身份尚未初始化。")
        return actor_for_user(db, user)


def actor_for_user(db, user):
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
