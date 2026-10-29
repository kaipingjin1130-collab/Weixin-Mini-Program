import hashlib
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import JSONResponse, FileResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select
from ...auth import Actor, current_actor, package_service_actor, authorize, Problem
from ...db import Session
from ...api_common import key_header
from ...pagination import paginate
from ...models import FileAsset
from ...storage import asset_path
from .models import TaskPackage, TaskPackageAsset
from .service import receive, receipt, status_dto, package_in, withdraw, guard_asset
from .validation import body_json, validate_package
from .views import summary, detail
from .fixtures import sample, SCENARIOS

router = APIRouter(prefix='/api/v1/task-packages', tags=['B05 模拟A任务包'])
integration_router = APIRouter(prefix='/integration/v1/task-packages', tags=['B05 A任务包集成（mock服务身份）'])


async def submit_shared(request, actor, key):
    from ...integrations.a.runtime import enabled
    if enabled():
        raise Problem(409, 'USE_A_IMPORTS', '请从 A 成果页面创建 v1 成果接入。')
    data = await body_json(request)
    package, replayed = receive(data, actor, key, request.state.request_id)
    return JSONResponse(status_code=200 if replayed else 202, content=jsonable_encoder(receipt(package, replayed)))


@router.post('')
async def offline_import(request: Request, actor: Actor = Depends(current_actor), key=Depends(key_header)):
    return await submit_shared(request, actor, key)


@integration_router.post('')
async def integration_import(request: Request, actor: Actor = Depends(package_service_actor), key=Depends(key_header)):
    return await submit_shared(request, actor, key)


@router.post('/preview')
async def preview(request: Request, actor: Actor = Depends(current_actor)):
    data = await body_json(request)
    digest, warnings = validate_package(data, actor)
    return {'is_demo': True, 'content_hash': digest, 'name': data['task']['name'], 'task_id': data['task_id'],
        'package_version': data['package_version'], 'project_id': data['project_id'], 'warnings': warnings,
        'counts': {name: len(data[name]) for name in ['participants', 'events', 'issues', 'attachments']},
        'data_completeness': data['data_completeness'], 'note': '仅结构与引用预检，尚未创建包或读取附件。'}


@router.get('/samples')
def samples(actor: Actor = Depends(current_actor)):
    return {'items': [{'id': name, 'label': label} for name, label in SCENARIOS.items()], 'is_demo': True}


@router.get('/samples/{name}')
def sample_data(name: str, project_id: str = 'demo-airport', task_id: str = Query('b05-demo-task', max_length=100,
                pattern=r'^[A-Za-z0-9][A-Za-z0-9_.:-]*$'), actor: Actor = Depends(current_actor)):
    authorize(actor, 'imports.create', project_id)
    return sample(name, project_id, task_id)


@router.get('')
def packages(actor: Actor = Depends(current_actor), project_id: str | None = None, state: str | None = None,
             limit: int = Query(20, ge=1, le=100), cursor: str | None = None):
    projects = actor.projects('imports.read')
    if project_id:
        authorize(actor, 'imports.read', project_id)
        projects = [project_id]
    if state and state not in {'received', 'validating', 'processing', 'ready', 'failed', 'withdrawn'}:
        raise Problem(422, 'INVALID_STATUS', '未知任务包状态。')
    with Session() as db:
        query = select(TaskPackage).where(TaskPackage.project_id.in_(projects), TaskPackage.org_id == actor.org_id)
        if state:
            query = query.where(TaskPackage.state == state)
        rows, after = paginate(db, query, TaskPackage, limit, cursor)
        output = []
        for package in rows:
            try:
                package_in(db, package.id, actor)
                output.append(summary(db, package))
            except Problem as exc:
                if exc.status not in {403, 410}:
                    raise
        return {'items': output, 'next_cursor': after}


@integration_router.get('/{ident}')
def integration_status(ident: str, actor: Actor = Depends(package_service_actor)):
    with Session() as db:
        return status_dto(db, package_in(db, ident, actor))


async def withdraw_shared(ident, request, actor, key):
    from ...integrations.a.runtime import enabled
    if enabled():
        raise Problem(409, 'USE_A_IMPORTS', '请从 v1 成果接入详情撤回，以保持状态一致。')
    data = await body_json(request)
    from .validation import contract_response
    # Reuse the exact B00 body; do not add internal row_version requirements.
    from contracts.tools.contract_rules import validate
    errors, _ = validate('withdraw-request.schema.json', data)
    if errors or not data['reason'].strip():
        raise Problem(422, 'VALIDATION_ERROR', '撤回原因必填且须符合B00合同。')
    return withdraw(ident, data['reason'], actor, key, request.state.request_id)


@integration_router.post('/{ident}/withdraw')
async def integration_withdraw(ident: str, request: Request, actor: Actor = Depends(package_service_actor), key=Depends(key_header)):
    return await withdraw_shared(ident, request, actor, key)


@router.post('/{ident}/withdraw')
async def internal_withdraw(ident: str, request: Request, actor: Actor = Depends(current_actor), key=Depends(key_header)):
    return await withdraw_shared(ident, request, actor, key)


@router.get('/{ident}')
def package_detail(ident: str, actor: Actor = Depends(current_actor), event_after: int = Query(0, ge=0)):
    with Session() as db:
        return detail(db, package_in(db, ident, actor), event_after)


@router.get('/{ident}/snapshot')
def snapshot(ident: str, actor: Actor = Depends(current_actor)):
    with Session() as db:
        return package_in(db, ident, actor, available=True).snapshot


@router.get('/{ident}/assets/{external_id}/content')
def package_asset(ident: str, external_id: str, actor: Actor = Depends(current_actor)):
    with Session() as db:
        package_in(db, ident, actor, available=True)
        row = db.scalar(select(TaskPackageAsset).where(TaskPackageAsset.package_id == ident,
            TaskPackageAsset.external_attachment_id == external_id))
        if not row or row.verification_state != 'verified' or not row.asset_id:
            raise Problem(410, 'ATTACHMENT_UNAVAILABLE', '该附件未通过校验或暂不可用。')
        guard_asset(db, row.asset_id, actor)
        asset = db.get(FileAsset, row.asset_id)
        if not asset or asset.availability != 'available':
            raise Problem(410, 'ASSET_UNAVAILABLE', '文件已撤回或不可用。')
        path = asset_path(asset.storage_key)
        if not path.is_file():
            raise Problem(404, 'ASSET_MISSING', '文件缺失。')
        if path.stat().st_size != asset.size or hashlib.sha256(path.read_bytes()).hexdigest() != asset.sha256:
            raise Problem(409, 'ASSET_INTEGRITY_ERROR', '文件内容校验失败。')
        suffix = {'image/svg+xml': '.svg', 'text/plain': '.txt', 'image/png': '.png', 'image/jpeg': '.jpg', 'application/pdf': '.pdf'}.get(asset.mime_type, '.bin')
        return FileResponse(path, media_type=asset.mime_type, filename='simulated-evidence'+suffix)
