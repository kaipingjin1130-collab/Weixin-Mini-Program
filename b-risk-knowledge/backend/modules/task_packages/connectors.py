"""Controlled mock connector. No URL fetching or caller-supplied local paths."""
import hashlib
import os
import tempfile
from dataclasses import dataclass
from ...config import ROOT
from ...storage import asset_path
from ...auth import Problem
from .validation import LIMITS


@dataclass(frozen=True)
class MockObject:
    project_id: str
    filename: str
    mime_type: str


OBJECTS = {
    'airport-photo': MockObject('demo-airport', 'photo.svg', 'image/svg+xml'),
    'airport-log': MockObject('demo-airport', 'task-log.txt', 'text/plain'),
    'metro-log': MockObject('demo-metro', 'task-log.txt', 'text/plain'),
}
ALLOWED_MIME = {'image/svg+xml', 'image/png', 'image/jpeg', 'image/webp', 'text/plain', 'application/pdf', 'video/mp4', 'application/octet-stream'}


def resolve(access_ref, project_id, org_id):
    if access_ref.get('connector_id') != 'demo-store':
        raise Problem(422, 'CONNECTOR_UNREGISTERED', '取件连接器未注册，未执行外部读取。')
    obj = OBJECTS.get(access_ref.get('object_id'))
    if not obj:
        raise Problem(404, 'OBJECT_UNAVAILABLE', '模拟附件不存在或取件标识已失效。')
    if obj.project_id != project_id or org_id != 'demo-org':
        raise Problem(403, 'ATTACHMENT_SCOPE_DENIED', '附件不属于当前任务包的授权项目。')
    # Both directory and filename come solely from this server-owned registry.
    return obj, ROOT / 'fixtures/b05' / obj.filename


def identity_matches(access_ref, declared, project_id, org_id):
    try:
        obj, path = resolve(access_ref, project_id, org_id)
        return (obj.mime_type == declared['mime_type'] and path.stat().st_size == declared['size']
                and hashlib.sha256(path.read_bytes()).hexdigest() == declared['sha256'])
    except (Problem, OSError):
        return False


def retrieve(package, relation, declared):
    obj, path = resolve(relation.access_ref, package.project_id, package.org_id)
    if declared['mime_type'] not in ALLOWED_MIME or obj.mime_type != declared['mime_type']:
        raise Problem(422, 'ATTACHMENT_TYPE_MISMATCH', '附件类型不符合受控连接器登记信息。')
    if declared['size'] > LIMITS['attachment_bytes']:
        raise Problem(422, 'ATTACHMENT_TOO_LARGE', '附件超过合同大小限制。')
    key = f'task-packages/{package.id}/{relation.id}'
    target = asset_path(key)
    target.parent.mkdir(parents=True, exist_ok=True)
    digest, count = hashlib.sha256(), 0
    temporary = None
    try:
        with path.open('rb') as source, tempfile.NamedTemporaryFile(dir=target.parent, delete=False) as output:
            temporary = output.name
            while chunk := source.read(65536):
                count += len(chunk)
                if count > min(declared['size'], LIMITS['attachment_bytes']):
                    raise Problem(422, 'ATTACHMENT_SIZE_MISMATCH', '附件实际大小与声明不符。')
                digest.update(chunk)
                output.write(chunk)
        if count != declared['size'] or digest.hexdigest() != declared['sha256']:
            raise Problem(422, 'ATTACHMENT_CHECKSUM_MISMATCH', '附件大小或SHA256不匹配，未标记为可用。')
        os.replace(temporary, target)
        temporary = None
        return key, count
    except OSError:
        raise Problem(503, 'ATTACHMENT_UNAVAILABLE', '受控附件读取失败，未生成可用证据。')
    finally:
        if temporary:
            from pathlib import Path
            Path(temporary).unlink(missing_ok=True)
