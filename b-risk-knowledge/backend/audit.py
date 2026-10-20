from .models import AuditEvent


def record(db, actor, action, object_type, object_id, project, request_id, version=None):
    db.add(AuditEvent(actor_id=actor.id, action=action, object_type=object_type,
                      object_id=object_id, project_id=project, request_id=request_id,
                      object_version=version))
