from datetime import datetime
from uuid import UUID, uuid5
from sqlalchemy import select
from ...queue import queue_app
from ...db import Session
from ...auth import actor_for_user, Problem
from ...models import ProcessingRun, FileAsset, UserLink, utcnow
from .models import TaskPackage, TaskEvent, TaskPackageAsset, TaskStream
from .service import package_in, lock
from .validation import KNOWN_EVENTS, validate_package
from .connectors import retrieve
from .assessment import assess


def worker_package(db, ident, run, lock_row=True):
    user = db.get(UserLink, run.actor_id)
    if not user:
        raise Problem(403, 'IDENTITY_REVOKED', '提交身份已不可用。')
    actor = actor_for_user(db, user, run)
    return package_in(db, ident, actor, 'imports.create', available=True, lock_row=lock_row), actor


@queue_app.task(name='b05.task_package_import', queue='b01')
def process_package(run_id: str):
    ident = None
    try:
        with Session.begin() as db:
            run = db.get(ProcessingRun, run_id)
            if not run:
                return
            ident = run.object_id
            package = db.get(TaskPackage, ident)
            if package.state in {'withdrawn', 'ready'}:
                return
            package, actor = worker_package(db, ident, run)
            run.status, run.error, run.attempts = 'running', None, run.attempts+1
            run.row_version += 1
            run.updated_at = utcnow()
            package.state, package.validation_errors = 'validating', []
            package.row_version += 1
            validate_package(package.snapshot, actor)
        with Session.begin() as db:
            run = db.get(ProcessingRun, run_id)
            package, _ = worker_package(db, ident, run)
            package.state = 'processing'
            prior = set(db.scalars(select(TaskEvent.external_event_id).where(TaskEvent.package_id == ident)))
            for n, event in enumerate(package.snapshot['events']):
                if event['event_id'] in prior:
                    continue
                db.add(TaskEvent(package_id=ident, external_event_id=event['event_id'], position=n,
                    event_type=event['event_type'], occurred_at=datetime.fromisoformat(event['occurred_at'].replace('Z', '+00:00')) if event['occurred_at'] else None,
                    actor={'actor_id': event['actor_id'], 'actor_role': event['actor_role']}, related_object_id=event['related_object_id'],
                    payload=event['payload'], evidence_refs=event['evidence_refs'], is_known=event['event_type'] in KNOWN_EVENTS))
            run.progress = 20
            attachment_ids = [a['attachment_id'] for a in package.snapshot['attachments']]
        for n, external_id in enumerate(attachment_ids, 1):
            with Session.begin() as db:
                run = db.get(ProcessingRun, run_id)
                package, _ = worker_package(db, ident, run)
                row = db.scalar(select(TaskPackageAsset).where(TaskPackageAsset.package_id == ident,
                    TaskPackageAsset.external_attachment_id == external_id))
                if row.verification_state == 'verified':
                    continue
                declared = next(a for a in package.snapshot['attachments'] if a['attachment_id'] == external_id)
                try:
                    key, size = retrieve(package, row, declared)
                    asset_id = str(uuid5(UUID(ident), 'attachment:'+external_id))
                    asset = db.get(FileAsset, asset_id)
                    if not asset:
                        asset = FileAsset(id=asset_id, storage_key=key, sha256=declared['sha256'], mime_type=declared['mime_type'],
                                          size=size, org_id=package.org_id, project_id=package.project_id)
                        db.add(asset)
                        db.flush()
                    row.asset_id, row.verification_state, row.error = asset_id, 'verified', None
                except Problem as exc:
                    row.verification_state, row.error = 'failed', exc.message
                run.progress = 20+int(n/max(1, len(attachment_ids))*70)
                run.updated_at = utcnow()
                interrupt = package.snapshot.get('extensions', {}).get('b.mock_interrupt_once') is True and run.attempts == 1
            if interrupt:
                raise RuntimeError('MOCK_INTERRUPT_AFTER_COMMITTED_ASSET')
        with Session.begin() as db:
            run = db.get(ProcessingRun, run_id)
            # Lock stream before package, matching withdrawal and concurrent promotion.
            package = db.get(TaskPackage, ident)
            lock(db, f'stream:{package.producer}:{package.task_id}')
            package, _ = worker_package(db, ident, run)
            relations = db.scalars(select(TaskPackageAsset).where(TaskPackageAsset.package_id == ident)).all()
            package.warnings, package.missing_fields, package.capabilities = assess(db, package)
            package.state = 'ready'
            package.row_version += 1
            stream = db.get(TaskStream, package.stream_id)
            if package.package_version > stream.current_ready_version:
                stream.current_ready_version, stream.current_package_id = package.package_version, ident
            run.status, run.progress, run.error = 'succeeded', 100, None
            run.row_version += 1
            run.updated_at = utcnow()
    except Exception as exc:
        if ident:
            with Session.begin() as db:
                package = db.scalar(select(TaskPackage).where(TaskPackage.id == ident).with_for_update())
                run = db.get(ProcessingRun, run_id)
                if package and package.state != 'withdrawn':
                    package.state = 'failed'
                    package.capabilities = []
                    package.validation_errors = [{'code': 'processing_failed', 'path': '', 'message':
                        exc.message if isinstance(exc, Problem) else '模拟处理被中断，已保存事件与附件关系；可由有权限人员重试。'}]
                    package.row_version += 1
                    run.status, run.error = 'failed', '任务包处理失败，已提交结果保留；请查看任务包详情。'
                    run.row_version += 1
                    run.updated_at = utcnow()
                elif package and package.state == 'withdrawn':
                    return
        raise
