"""Crash-resumable v1 jobs; payload contains references, never a user session."""
from sqlalchemy import select
from ...queue import queue_app
from ...db import Session
from ...auth import Problem
from ...models import ProcessingRun, UserLink, utcnow
from ...modules.task_packages.models import TaskPackage
from ...modules.task_packages.service import receive
from ...modules.task_packages.tasks import process_package
from .models import AImport
from .runtime import service_actor, client


def advance(db, row, run, status, retrospective=False):
    if row.status == 'withdrawn':
        raise Problem(410, 'IMPORT_WITHDRAWN', '接入已撤回。')
    if retrospective:
        row.retrospective_status = status
    else:
        row.status = status
    row.version += 1
    row.updated_at = utcnow()
    run.status = 'succeeded' if status == 'ready' else 'running'
    run.updated_at = utcnow()
    run.row_version += 1
    if status == 'ready':
        run.progress, run.error = 100, None


def failed(run_id, exc, retrospective=False):
    with Session.begin() as db:
        run = db.get(ProcessingRun, run_id)
        if not run:
            return
        row = db.scalar(select(AImport).where(AImport.id == run.object_id).with_for_update())
        if row and row.status != 'withdrawn':
            if retrospective:
                row.retrospective_status = 'failed'
            else:
                row.status = 'failed'
            row.error = {'code': exc.code if isinstance(exc, Problem) else 'PROCESSING_FAILED',
                         'message': exc.message if isinstance(exc, Problem) else '后台处理失败，可由授权用户重试。',
                         'details': [], 'request_id': run.id}
            row.version += 1
            row.updated_at = utcnow()
        run.status, run.error = 'failed', 'A 接入处理失败，请查看接入状态。'
        run.row_version += 1


@queue_app.task(name='a.v1.import', queue='b01')
def import_job(run_id: str):
    try:
        with Session.begin() as db:
            run = db.get(ProcessingRun, run_id)
            row = db.scalar(select(AImport).where(AImport.id == run.object_id).with_for_update())
            if row.status in {'withdrawn', 'ready'}:
                return
            actor = service_actor(db.get(UserLink, run.actor_id), row.project_id, run.kind)
            advance(db, row, run, 'fetching')
            run.attempts += 1
        with client() as a:
            _, result, meta = a.prepare(row.delivery_id, org_id=row.org_id, project_id=row.project_id,
                                        task_id=row.task_id, version=row.delivery_version)
        data = result['package']
        data['package_id'] = 'qaxc:' + row.delivery_id
        for attachment in data['attachments']:
            attachment['access_ref'] = {'connector_id': 'qaxc', 'object_id': row.delivery_id + ':' + attachment['attachment_id']}
        with Session.begin() as db:
            fresh = db.scalar(select(AImport).where(AImport.id == row.id).with_for_update())
            advance(db, fresh, db.get(ProcessingRun, run_id), 'validating')
        package, _ = receive(data, actor, 'a-v1:'+row.id, run_id, enqueue_processing=False)
        with Session.begin() as db:
            fresh = db.scalar(select(AImport).where(AImport.id == row.id).with_for_update())
            if fresh.status == 'withdrawn':
                stored = db.get(TaskPackage, package.id)
                stored.state, stored.withdrawn_at = 'withdrawn', utcnow()
                return
            fresh.receipt_id, fresh.source_metadata = package.id, meta
            advance(db, fresh, db.get(ProcessingRun, run_id), 'processing')
        # Existing idempotent processor commits verified files/events incrementally.
        process_package(package.run_id)
        from .imports import source_check
        source_check(row)
        with Session.begin() as db:
            fresh = db.scalar(select(AImport).where(AImport.id == row.id).with_for_update())
            stored = db.get(TaskPackage, package.id)
            if stored.state != 'ready':
                raise Problem(409, 'PACKAGE_NOT_READY', '任务包处理尚未完成。')
            advance(db, fresh, db.get(ProcessingRun, run_id), 'ready')
            fresh.error = None
    except Exception as exc:
        failed(run_id, exc)
        raise


@queue_app.task(name='a.v1.retrospective', queue='b01')
def retrospective_job(run_id: str):
    try:
        with Session.begin() as db:
            run = db.get(ProcessingRun, run_id)
            row = db.scalar(select(AImport).where(AImport.id == run.object_id).with_for_update())
            if row.status == 'withdrawn' or row.retrospective_status == 'ready':
                return
            actor = service_actor(db.get(UserLink, run.actor_id), row.project_id, run.kind)
            advance(db, row, run, 'processing', retrospective=True)
            receipt = row.receipt_id
        from ...modules.retrospectives.schemas import Create
        from ...modules.retrospectives.service import generate
        result = generate(Create(mode='task_process', task_package_id=receipt), actor, run_id)
        from .imports import source_check
        source_check(row)
        with Session.begin() as db:
            fresh = db.scalar(select(AImport).where(AImport.id == row.id).with_for_update())
            advance(db, fresh, db.get(ProcessingRun, run_id), 'ready', retrospective=True)
            fresh.retrospective_id, fresh.error = result['id'], None
    except Exception as exc:
        failed(run_id, exc, retrospective=True)
        raise
