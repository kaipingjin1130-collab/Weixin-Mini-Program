"""v1 public boundary: durable identity, live user authorization, independent jobs."""
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from ...auth import current_actor, authorize, Problem
from ...api_common import key_header
from ...db import Session
from ...models import ProcessingRun, new_id, utcnow
from ...job_service import fingerprint, enqueue
from ...modules.task_packages.service import lock, status_dto
from ...modules.task_packages.models import TaskPackage
from .models import AImport, ARequest
from .runtime import enabled, client

router = APIRouter(prefix='/integration/v1/a-imports', tags=['A integration v1'])


def identity(request: Request):
    if not enabled():
        raise Problem(404, 'NOT_FOUND', '新接入协议尚未启用。')
    return current_actor(request)


class ImportBody(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)
    source_system: str = Field(pattern='^a$')
    project_id: str = Field(min_length=1, max_length=128)
    task_id: str = Field(min_length=1, max_length=128)
    delivery_id: str = Field(min_length=1, max_length=128)
    delivery_version: int = Field(ge=1)


class VersionBody(BaseModel):
    model_config = ConfigDict(extra='forbid', strict=True)
    expected_version: int = Field(ge=1)


class WithdrawBody(VersionBody):
    reason: str = Field(min_length=1, max_length=2000)


def source_check(row):
    with client() as a:
        return a.metadata(row.delivery_id, org_id=row.org_id, project_id=row.project_id,
                          task_id=row.task_id, version=row.delivery_version)


def get_row(db, ident, actor, action, locked=False):
    query = select(AImport).where(AImport.id == ident)
    row = db.scalar(query.with_for_update() if locked else query)
    if not row:
        raise Problem(404, 'NOT_FOUND', '成果接入不存在。')
    if row.org_id != actor.org_id:
        raise Problem(403, 'FORBIDDEN', '成果组织不可访问。')
    authorize(actor, action, row.project_id)
    return row


def state(db, row, replayed=False):
    warnings, missing, caps = [], [], []
    if row.receipt_id:
        package = db.get(TaskPackage, row.receipt_id)
        if package:
            result = status_dto(db, package)
            warnings, missing, caps = result['warnings'], result['missing_fields'], result['capabilities']
    available = row.status == 'ready'
    return dict(import_id=row.id, version=row.version, project_id=row.project_id, task_id=row.task_id,
        delivery_id=row.delivery_id, delivery_version=row.delivery_version, status=row.status,
        receipt_id=row.receipt_id, warnings=warnings, missing_fields=missing,
        capabilities={'can_view_materials': available,
                      'can_generate_retrospective': available and bool({'partial_timeline', 'complete_timeline'} & set(caps)),
                      'evidence_complete': available and not any('attachment' in x or 'evidence' in x for x in missing)},
        retrospective_id=row.retrospective_id, retrospective_status=row.retrospective_status,
        updated_at=row.updated_at.isoformat(), replayed=replayed, error=row.error)


def prior_request(db, actor, key, digest):
    lock(db, f'v1-request:{actor.org_id}:{actor.id}:{key}')
    prior = db.scalar(select(ARequest).where(ARequest.org_id == actor.org_id,
        ARequest.actor_id == actor.id, ARequest.key == key))
    if prior and prior.digest != digest:
        raise Problem(409, 'IDEMPOTENCY_CONFLICT', '幂等键已用于不同请求。')
    return prior


def save_request(db, actor, key, digest, row):
    db.add(ARequest(org_id=actor.org_id, actor_id=actor.id, key=key, digest=digest, import_id=row.id))


@router.post('')
def create(data: ImportBody, request: Request, actor=Depends(identity), key=Depends(key_header)):
    authorize(actor, 'imports.create', data.project_id)
    # Source authorization happens before replay and without holding a database lock.
    from types import SimpleNamespace
    meta = source_check(SimpleNamespace(org_id=actor.org_id, **data.model_dump()))
    digest = fingerprint({'operation': 'create', **data.model_dump()})
    with Session.begin() as db:
        prior = prior_request(db, actor, key, digest)
        lock(db, f'v1-delivery:{actor.org_id}:{data.delivery_id}:{data.delivery_version}')
        row = db.scalar(select(AImport).where(AImport.org_id == actor.org_id,
            AImport.delivery_id == data.delivery_id, AImport.delivery_version == data.delivery_version))
        replayed = row is not None
        if row and (row.project_id != data.project_id or row.task_id != data.task_id):
            raise Problem(409, 'SOURCE_REFERENCE_CONFLICT', '成果版本已绑定其他任务或项目。')
        if row is None:
            ident = 'ai_' + new_id().replace('-', '')
            run = ProcessingRun(kind='a_import', object_id=ident, actor_id=actor.id, project_id=data.project_id,
                title='A归档成果接入', idempotency_key='a-import:'+ident, input_hash=digest,
                payload={'import_id': ident})
            db.add(run); db.flush()
            row = AImport(id=ident, org_id=actor.org_id, project_id=data.project_id, task_id=data.task_id,
                delivery_id=data.delivery_id, delivery_version=data.delivery_version, run_id=run.id,
                source_metadata=meta)
            db.add(row); db.flush()
            run.queue_job_id = enqueue(db, run.id)
            from ...audit import record
            record(db, actor, 'a_import_created', 'a_import', row.id, row.project_id, request.state.request_id, row.version)
        if not prior:
            save_request(db, actor, key, digest, row)
        return JSONResponse(status_code=200 if replayed else 202, content=jsonable_encoder(state(db, row, replayed)))


@router.get('')
def listing(project_id: str = Query(min_length=1, max_length=128),
            delivery_id: str = Query(min_length=1, max_length=128),
            delivery_version: int = Query(ge=1), actor=Depends(identity)):
    authorize(actor, 'imports.read', project_id)
    with Session() as db:
        rows = db.scalars(select(AImport).where(AImport.org_id == actor.org_id,
            AImport.project_id == project_id, AImport.delivery_id == delivery_id,
            AImport.delivery_version == delivery_version)).all()
        for row in rows:
            if row.status != 'withdrawn':
                source_check(row)
        return {'items': [state(db, row) for row in rows]}


@router.get('/{ident}')
def detail(ident: str, actor=Depends(identity)):
    with Session() as db:
        row = get_row(db, ident, actor, 'imports.read')
        if row.status != 'withdrawn':
            source_check(row)
        return state(db, row)


def change(ident, data, actor, key, operation, request_id):
    action = {'retry': 'imports.retry', 'withdraw': 'imports.withdraw', 'retrospective': 'retrospective.generate'}[operation]
    with Session() as db:
        source = get_row(db, ident, actor, action)
        if operation != 'withdraw':
            source_check(source)
    digest = fingerprint({'operation': operation, 'import_id': ident, **data.model_dump()})
    with Session.begin() as db:
        prior = prior_request(db, actor, key, digest)
        row = get_row(db, ident, actor, action, locked=True)
        if prior:
            return state(db, row, True)
        if row.version != data.expected_version:
            raise Problem(409, 'VERSION_CONFLICT', '接入状态已更新，请刷新后重试。')
        if row.status == 'withdrawn' and operation != 'withdraw':
            raise Problem(410, 'IMPORT_WITHDRAWN', 'B 接入已经撤回。')
        replayed = False
        if operation == 'retry':
            retry_retrospective = row.status == 'ready' and row.retrospective_status == 'failed'
            if row.status != 'failed' and not retry_retrospective:
                raise Problem(409, 'INVALID_STATE', '仅失败任务可以重试。')
            run = db.get(ProcessingRun, row.retrospective_run_id if retry_retrospective else row.run_id)
            # Retain the import and its original job identity.
            from sqlalchemy import text
            queue_state = db.scalar(text('SELECT status::text FROM procrastinate_jobs WHERE id=:id'), {'id': run.queue_job_id})
            if queue_state not in {'succeeded', 'failed', 'aborted', 'cancelled'}:
                raise Problem(409, 'QUEUE_NOT_SETTLED', '上一次处理尚未结束。')
            run.status, run.error = 'queued', None
            run.queue_job_id = enqueue(db, run.id)
            if retry_retrospective:
                row.retrospective_status = 'queued'
            else:
                row.status = 'queued'
            row.error = None
        elif operation == 'withdraw':
            if not data.reason.strip():
                raise Problem(422, 'INVALID_REASON', '撤回原因不能为空。')
            replayed = row.status == 'withdrawn'
            row.status = 'withdrawn'
            if row.retrospective_status != 'not_created':
                row.retrospective_status = 'withdrawn'
            for run_id in (row.run_id, row.retrospective_run_id):
                run = db.get(ProcessingRun, run_id) if run_id else None
                if run and run.status not in {'succeeded', 'failed'}:
                    run.status, run.error = 'failed', '成果接入已撤回，停止处理。'
                    run.row_version += 1
                    run.updated_at = utcnow()
            if row.receipt_id and not replayed:
                package = db.get(TaskPackage, row.receipt_id)
                package.state, package.withdrawn_at, package.withdrawal_reason = 'withdrawn', utcnow(), data.reason
                package.row_version += 1
        else:
            if row.status != 'ready':
                raise Problem(409, 'IMPORT_NOT_READY', '接入尚未完成。')
            if not state(db, row)['capabilities']['can_generate_retrospective']:
                raise Problem(422, 'INSUFFICIENT_PROCESS_EVIDENCE', '缺少过程事件，不能生成过程复盘。')
            replayed = row.retrospective_status != 'not_created'
            if not replayed:
                run = ProcessingRun(kind='a_retrospective', object_id=row.id, actor_id=actor.id,
                    project_id=row.project_id, title='A成果复盘生成', idempotency_key='a-retro:'+row.id,
                    input_hash=digest, payload={'import_id': row.id})
                db.add(run); db.flush()
                row.retrospective_run_id, row.retrospective_status = run.id, 'queued'
                run.queue_job_id = enqueue(db, run.id)
        if not replayed:
            row.version += 1
            row.updated_at = utcnow()
        save_request(db, actor, key, digest, row)
        from ...audit import record
        record(db, actor, 'a_import_'+operation, 'a_import', row.id, row.project_id, request_id, row.version)
        return state(db, row, replayed)


@router.post('/{ident}/retry')
def retry(ident: str, data: VersionBody, request: Request, actor=Depends(identity), key=Depends(key_header)):
    return change(ident, data, actor, key, 'retry', request.state.request_id)


@router.post('/{ident}/withdraw')
def withdraw(ident: str, data: WithdrawBody, request: Request, actor=Depends(identity), key=Depends(key_header)):
    return change(ident, data, actor, key, 'withdraw', request.state.request_id)


def retrospective_dto(db, row):
    from ...modules.retrospectives.models import Retrospective
    retro = db.get(Retrospective, row.retrospective_id) if row.retrospective_id else None
    values = state(db, row)
    return dict(import_id=row.id, receipt_id=row.receipt_id, delivery_version=row.delivery_version,
        retrospective_id=row.retrospective_id, retrospective_version=retro.current_revision if retro else None,
        status=row.retrospective_status, warnings=values['warnings'], missing_fields=values['missing_fields'],
        result_path='/quality/b/#/retrospectives/'+row.retrospective_id if row.retrospective_id else None)


@router.post('/{ident}/retrospectives')
def generate(ident: str, data: VersionBody, request: Request, actor=Depends(identity), key=Depends(key_header)):
    result = change(ident, data, actor, key, 'retrospective', request.state.request_id)
    with Session() as db:
        row = get_row(db, ident, actor, 'retrospective.generate')
        return JSONResponse(status_code=200 if result['replayed'] else 202,
                            content=jsonable_encoder(retrospective_dto(db, row)))


@router.get('/{ident}/retrospective')
def retrospective(ident: str, actor=Depends(identity)):
    with Session() as db:
        row = get_row(db, ident, actor, 'retrospective.read')
        if row.status != 'withdrawn':
            source_check(row)
        return retrospective_dto(db, row)
