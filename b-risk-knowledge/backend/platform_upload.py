"""Authenticated, project-scoped source files for existing ingestion workflow."""
import base64
import hashlib
from uuid import uuid4
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select
from .auth import current_actor, authorize, Problem
from .db import Session
from .models import FileAsset
from .storage import asset_path
from .modules.ingestion.adapters import MIME, read_rows

router = APIRouter(prefix='/api/v1')

class Upload(BaseModel):
    project_id: str = Field(min_length=1, max_length=128)
    name: str = Field(min_length=1, max_length=200)
    kind: str
    base64: str = Field(max_length=7_000_000)

@router.post('/platform-inputs', status_code=201)
def upload(data: Upload, actor=Depends(current_actor)):
    authorize(actor, 'run', data.project_id)
    if data.kind not in MIME:
        raise Problem(422, 'INVALID_FILE_TYPE', '请选择CSV、Excel或JSON治理文件。')
    try:
        content = base64.b64decode(data.base64, validate=True)
    except ValueError:
        raise Problem(422, 'INVALID_FILE', '文件编码错误。')
    if not content or len(content) > 5_000_000:
        raise Problem(413, 'FILE_TOO_LARGE', '文件大小须在5MB以内。')
    # Parse before persistence, with the same validation used by the importer.
    if len(read_rows(data.kind, content)) > 10000:
        raise Problem(422, 'ROW_LIMIT', '每批最多10000条记录。')
    ident = str(uuid4())
    name = data.name.replace('/', '_').replace('\\', '_')
    key = 'platform-inputs/' + ident + '/' + name
    path = asset_path(key)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    with Session.begin() as db:
        db.add(FileAsset(id=ident, storage_key=key, sha256=hashlib.sha256(content).hexdigest(),
            size=len(content), mime_type=MIME[data.kind], project_id=data.project_id, org_id=actor.org_id))
    return {'asset_id': ident, 'label': name, 'kind': data.kind, 'project_id': data.project_id, 'is_mock': False}

def catalog(actor):
    reverse = {v: k for k, v in MIME.items()}
    with Session() as db:
        rows = db.scalars(select(FileAsset).where(FileAsset.project_id.in_(actor.projects('run')),
            FileAsset.org_id == actor.org_id, FileAsset.storage_key.startswith('platform-inputs/'),
            FileAsset.availability == 'available')).all()
        return [{'asset_id': r.id, 'label': r.storage_key.rsplit('/', 1)[-1],
                 'kind': reverse[r.mime_type], 'project_id': r.project_id, 'is_mock': False}
                for r in rows if r.mime_type in reverse]
