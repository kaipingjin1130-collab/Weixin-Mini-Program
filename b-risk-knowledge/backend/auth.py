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

    def can(self, action: str, project: str) -> bool:
        if project not in self.grants:
            return False
        allowed = {
            "read": {"admin", "processor", "reviewer", "teacher", "learner"},
            "run": {"admin", "processor"},
            "manage": {"admin"},
            "audit": {"admin", "reviewer"},
        }
        return bool(self.roles.get(project, set()) & allowed[action])

    def projects(self, action="read"):
        return sorted(p for p in self.grants if self.can(action, p))


def current_actor(request: Request) -> Actor:
    token = request.headers.get("authorization", "")
    identities = {"Bearer dev-admin": "admin", "Bearer dev-processor": "processor",
                  "Bearer dev-learner": "learner", "Bearer dev-outsider": "outsider"}
    subject = identities.get(token)
    if subject is None:
        raise Problem(401, "UNAUTHENTICATED", "请选择本地演示身份；真实身份接入尚未配置。")
    with Session() as db:
        user = db.scalar(select(UserLink).where(UserLink.issuer == "local-demo", UserLink.subject_id == subject))
        if not user:
            raise Problem(401, "UNAUTHENTICATED", "演示身份尚未初始化。")
        bindings = db.scalars(select(RoleBinding).where(RoleBinding.user_id == user.id)).all()
        roles = {}
        for b in bindings:
            roles.setdefault(b.scope_id, set()).add(b.role)
        return Actor(user.id, user.subject_id, user.display_name, set(user.authorized_projects), roles)


def authorize(actor: Actor, action: str, project: str):
    if not actor.can(action, project):
        raise Problem(403, "FORBIDDEN", "当前身份没有此项目的操作权限。")
