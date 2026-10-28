"""Read verified current archives from the platform; no caller supplied URLs."""
import base64
import hashlib
import json
import httpx
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, Field
from .auth import current_actor, authorize, Problem
from .config import settings
from .api_common import key_header
from .integrations.a.mapping import convert

router = APIRouter(prefix='/api/v1/platform-archives')

def call(subject, operation, **data):
    if settings.auth_mode != 'a':
        raise Problem(404, 'NOT_FOUND', '此接口仅用于小察平台。')
    try:
        with httpx.Client(timeout=30, trust_env=False, follow_redirects=False) as client:
            response = client.post(settings.a_base + '/integration/v1/identity/' + operation,
                headers={'Authorization': 'Bearer ' + settings.b_to_a_key},
                json={'subject_id': subject, **data})
        if response.status_code != 200:
            code = response.status_code if response.status_code in {401,403,404,409,410} else 503
            raise Problem(code, 'SOURCE_UNAVAILABLE', '平台成果不可用、已补正或权限已变更，请刷新归档列表。')
        return response.json()
    except (httpx.HTTPError, ValueError):
        raise Problem(503, 'SOURCE_UNAVAILABLE', '平台成果服务暂不可用。')

def mapped(subject, delivery_id, org_id):
    snapshot = call(subject, 'archive', delivery_id=delivery_id)['snapshot']
    raw = json.dumps(snapshot, ensure_ascii=False).encode()
    try:
        package = convert(raw, snapshot, org_id=org_id, project_id=snapshot['project']['id'], is_demo=False)['package']
    except (ValueError, KeyError, TypeError):
        raise Problem(422, 'ARCHIVE_UNSUPPORTED', '此成果暂不符合接入要求，请检查场景、记录和附件。')
    # A delivery row is the stable retrievable version identity.
    package['package_id'] = 'qaxc:' + delivery_id
    for attachment in package['attachments']:
        attachment['access_ref'] = {'connector_id': 'qaxc', 'object_id': delivery_id + ':' + attachment['attachment_id']}
    return package

def verify(data, actor):
    if not data['package_id'].startswith('qaxc:'):
        raise Problem(403, 'SOURCE_UNVERIFIED', '仅接收平台已核验的归档成果。')
    expected = mapped(actor.subject, data['package_id'][5:], actor.org_id)
    if expected != data:
        raise Problem(409, 'SOURCE_CHANGED', '成果内容与平台归档版本不一致。')

def guard(package, actor):
    snapshot = call(actor.subject, 'archive', delivery_id=package.package_id[5:])['snapshot']
    if snapshot['project']['id'] != package.project_id:
        raise Problem(403, 'SOURCE_SCOPE_DENIED', '成果项目不一致。')

def retrieve(package, relation, declared):
    from .db import Session
    from .models import UserLink
    from .storage import asset_path
    from .auth import actor_for_user
    with Session() as db:
        actor = actor_for_user(db, db.get(UserLink, package.actor_id))
    authorize(actor, 'package_receive', package.project_id)
    delivery = package.package_id[5:]
    if relation.access_ref != {'connector_id':'qaxc','object_id':delivery + ':' + declared['attachment_id']}:
        raise Problem(403, 'ATTACHMENT_SCOPE_DENIED', '附件引用与归档成果不一致。')
    content = base64.b64decode(call(actor.subject, 'attachment', delivery_id=delivery,
        evidence_id=declared['attachment_id'])['base64'], validate=True)
    if len(content) != declared['size'] or hashlib.sha256(content).hexdigest() != declared['sha256']:
        raise Problem(409, 'ATTACHMENT_CHECKSUM_MISMATCH', '附件校验失败。')
    key = f'task-packages/{package.id}/{relation.id}'
    path = asset_path(key)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    return key, len(content)

@router.get('')
def archives(actor=Depends(current_actor)):
    return call(actor.subject, 'archives')

class Import(BaseModel):
    delivery_id: str = Field(min_length=1, max_length=128)

@router.post('', status_code=202)
def receive_archive(data: Import, request: Request, actor=Depends(current_actor), key=Depends(key_header)):
    from .modules.task_packages.service import receive, receipt
    package = mapped(actor.subject, data.delivery_id, actor.org_id)
    authorize(actor, 'package_receive', package['project_id'])
    stored, replayed = receive(package, actor, key, request.state.request_id)
    return receipt(stored, replayed)
