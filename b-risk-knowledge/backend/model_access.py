"""Operator-owned global model administration; independent of A project grants."""
import json
import os
from .auth import Problem


def can_manage_models(actor):
    if actor.is_service or not actor.grants:
        return False
    if actor.permissions is None:
        return bool(actor.projects('manage'))
    # A v1 intentionally has no global model-management permission. Never infer
    # it from knowledge.process, project roles, display name or browser headers.
    try:
        entries = json.loads(os.getenv('B_MODEL_ADMIN_IDENTITIES', '[]'))
    except (ValueError, TypeError):
        return False
    if not isinstance(entries, list):
        return False
    return any(isinstance(item, dict) and item == {'org_id': actor.org_id, 'subject_id': actor.subject}
               for item in entries)


def require_model_admin(actor):
    if not can_manage_models(actor):
        raise Problem(403, 'MODEL_ADMIN_REQUIRED', '模型配置需要单独的模型管理员授权，请联系系统管理员。')
