import hashlib
import io
from pathlib import Path
from uuid import uuid4
from zipfile import ZipFile, BadZipFile
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import JSONResponse, FileResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, text
from ...auth import current_actor, authorize, Problem
from ...api_common import key_header
from ...audit import record as audit
from ...db import Session
from ...models import FileAsset
from ...storage import asset_path
from ...pagination import paginate
from ...job_service import fingerprint
from .models import StandardRevision, StandardClause, StandardReview
from .schemas import Draft, Transition, Applicability
from . import service

router = APIRouter(prefix='/api/v1/standards', tags=['规范原文与版本'])
LIMIT = 5_000_000


def file_type(name, content):
    extension = Path(name).suffix.lower()
    if extension == '.pdf' and content.startswith(b'%PDF-'):
        return 'application/pdf'
    if extension == '.txt':
        try:
            value = content.decode('utf-8-sig')
            if not value.strip() or '\x00' in value:
                raise ValueError()
            return 'text/plain'
        except (UnicodeError, ValueError):
            pass
    if extension == '.docx':
        try:
            with ZipFile(io.BytesIO(content)) as archive:
                names = set(archive.namelist())
                if {'[Content_Types].xml', 'word/document.xml'} <= names and len(names) <= 5000:
                    if sum(item.file_size for item in archive.infolist()) <= 50_000_000:
                        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        except (BadZipFile, OSError):
            pass
    raise Problem(422, 'INVALID_STANDARD_FILE', '请选择PDF、DOCX或UTF-8文本原件，文件内容须与类型一致。')


@router.post('/source-files')
async def upload(request: Request, project_id: str = Query(min_length=1, max_length=128),
                 name: str = Query(min_length=1, max_length=200), actor=Depends(current_actor)):
    authorize(actor, 'knowledge.process', project_id)
    content = bytearray()
    async for chunk in request.stream():
        if len(content) + len(chunk) > LIMIT:
            raise Problem(413, 'FILE_TOO_LARGE', '首版每份规范原件最多5MB。')
        content.extend(chunk)
    if not content:
        raise Problem(422, 'EMPTY_FILE', '文件不能为空。')
    mime = file_type(name, content)
    digest = hashlib.sha256(content).hexdigest()
    created_path = None
    try:
        with Session.begin() as db:
            lock = fingerprint([actor.org_id, project_id, digest, mime])
            db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'), {'k': 'standard-file:' + lock})
            old = db.scalar(select(FileAsset).where(FileAsset.project_id == project_id,
                FileAsset.org_id == actor.org_id, FileAsset.sha256 == digest, FileAsset.mime_type == mime,
                FileAsset.storage_key.startswith('standard-inputs/'), FileAsset.availability == 'available'))
            if old:
                return {'asset_id': old.id, 'sha256': digest, 'replayed': True}
            ident = str(uuid4())
            # Store with server-generated basename: no client paths or reserved Windows filenames.
            key = 'standard-inputs/' + ident + '/original' + Path(name).suffix.lower()
            created_path = asset_path(key)
            created_path.parent.mkdir(parents=True, exist_ok=True)
            created_path.write_bytes(content)
            db.add(FileAsset(id=ident, storage_key=key, sha256=digest, size=len(content),
                mime_type=mime, org_id=actor.org_id, project_id=project_id))
            audit(db, actor, 'standard_source_uploaded', 'asset', ident, project_id, request.state.request_id)
        return JSONResponse(status_code=201, content={'asset_id': ident, 'sha256': digest, 'replayed': False})
    except Exception:
        if created_path is not None:
            created_path.unlink(missing_ok=True)
        raise


@router.post('')
def create(data: Draft, request: Request, actor=Depends(current_actor), key=Depends(key_header)):
    result = service.create(data, actor, request.state.request_id, key)
    return JSONResponse(status_code=200 if result['replayed'] else 201, content=jsonable_encoder(result))


@router.get('')
def listing(project_id: str, actor=Depends(current_actor), view: str = Query('published', pattern='^(published|manage)$'),
            limit: int = Query(20, ge=1, le=100), cursor: str | None = Query(None, max_length=512)):
    authorize(actor, 'knowledge.read', project_id)
    if view == 'manage':
        service.curator(actor, project_id)
    with Session() as db:
        query = select(StandardRevision).join(FileAsset, FileAsset.id == StandardRevision.source_asset_id).where(
            StandardRevision.project_id == project_id, FileAsset.org_id == actor.org_id)
        if view == 'published':
            query = query.where(StandardRevision.state == 'published', FileAsset.availability == 'available',
                FileAsset.sha256 == StandardRevision.source_sha256)
        rows, cursor = paginate(db, query, StandardRevision, limit, cursor)
        items = []
        for row in rows:
            try:
                service.source(db, row.source_asset_id, actor, row.project_id, row.source_sha256)
                available = True
            except Problem as error:
                if error.status not in {403, 404, 409, 410}:
                    raise
                if view == 'published':
                    continue
                available = False
            items.append({**service.dto(row), 'source_available': available})
        return {'items': items, 'next_cursor': cursor}


@router.get('/{ident}')
def detail(ident: str, actor=Depends(current_actor)):
    with Session() as db:
        row = service.visible(db, ident, actor)
        clauses = db.scalars(select(StandardClause).where(StandardClause.standard_revision_id == ident)
            .order_by(StandardClause.position)).all()
        reviews = db.scalars(select(StandardReview).where(StandardReview.standard_revision_id == ident)
            .order_by(StandardReview.created_at, StandardReview.id)).all()
        return {**service.dto(row), 'clauses': [{'id': c.id, **c.content} for c in clauses],
            'history': [{'action': r.action, 'reason': r.reason, 'evidence_checked': r.evidence_checked,
                         'row_version': r.row_version, 'created_at': r.created_at} for r in reviews],
            'source_url': '/api/v1/standards/' + ident + '/source'}


@router.get('/{ident}/source')
def original(ident: str, actor=Depends(current_actor)):
    with Session() as db:
        row = service.visible(db, ident, actor)
        asset = service.source(db, row.source_asset_id, actor, row.project_id, row.source_sha256)
        path = asset_path(asset.storage_key)
        if not path.is_file():
            raise Problem(404, 'ASSET_MISSING', '规范原件缺失，请联系维护人员。')
        if path.stat().st_size != asset.size or hashlib.sha256(path.read_bytes()).hexdigest() != row.source_sha256:
            raise Problem(409, 'ASSET_INTEGRITY_ERROR', '规范原件内容校验失败。')
        return FileResponse(path, media_type=asset.mime_type, filename='规范原件' + path.suffix)


@router.post('/{ident}/actions')
def transition(ident: str, data: Transition, request: Request, actor=Depends(current_actor)):
    return service.transition(ident, data, actor, request.state.request_id)


@router.post('/{ident}/applicability')
def applicability(ident: str, data: Applicability, actor=Depends(current_actor)):
    with Session() as db:
        row = service.visible(db, ident, actor)
        return service.applicability(row, data)
