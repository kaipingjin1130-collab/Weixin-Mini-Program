"""Persistent external identity links, with live authority checks for workers."""
from uuid import uuid5, NAMESPACE_URL
import httpx
from sqlalchemy.dialects.postgresql import insert
from .auth import Actor, Problem


def persist_actor(actor):
    from .db import Session
    from .models import UserLink
    ident = str(uuid5(NAMESPACE_URL, 'qaxc:' + actor.org_id + ':' + actor.subject))
    with Session.begin() as db:
        statement = insert(UserLink).values(id=ident, issuer='qaxc:' + actor.org_id,
            subject_id=actor.subject, display_name=actor.name, authorized_projects=sorted(actor.grants))
        db.execute(statement.on_conflict_do_update(index_elements=['issuer', 'subject_id'],
            set_={'display_name': actor.name, 'authorized_projects': sorted(actor.grants)}))
    actor.id = ident
    return actor


def worker_actor(user, run=None):
    from .config import settings
    if settings.auth_mode != 'a' or user.issuer != 'qaxc:' + settings.a_org_id:
        raise Problem(403, 'IDENTITY_REVOKED', '任务身份不属于当前平台。')
    from .integrations.a.runtime import enabled, service_actor
    if enabled():
        if run is None or run.actor_id != user.id:
            raise Problem(403, 'SERVICE_SCOPE_DENIED', '后台授权必须绑定已提交的具体任务。')
        return service_actor(user, run.project_id, run.kind)
    try:
        response = httpx.post(settings.a_base + '/integration/v1/identity/subject',
            headers={'Authorization': 'Bearer ' + settings.b_to_a_key},
            json={'subject_id': user.subject_id}, timeout=5, trust_env=False, follow_redirects=False)
        if response.status_code != 200:
            raise Problem(403, 'IDENTITY_REVOKED', '任务身份或项目权限已失效。')
        data = response.json()
        if data.get('active') is not True or data.get('subject_id') != user.subject_id or data.get('org_id') != settings.a_org_id:
            raise Problem(403, 'IDENTITY_REVOKED', '任务身份已失效。')
        permissions = {p['project_id']: set(p['permissions']) for p in data['projects']}
        roles = {p['project_id']: set(p.get('roles', [])) for p in data['projects']}
        return Actor(user.id, user.subject_id, data['display_name'], set(permissions), roles,
                     org_id=settings.a_org_id, permissions=permissions)
    except (httpx.HTTPError, ValueError, KeyError, TypeError):
        raise Problem(503, 'IDENTITY_UNAVAILABLE', '平台身份服务暂不可用。')
