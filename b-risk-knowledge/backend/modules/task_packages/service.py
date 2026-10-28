from copy import deepcopy
from sqlalchemy import select, text
from ...auth import authorize, Problem
from ...db import Session
from ...models import ProcessingRun, FileAsset, new_id, utcnow
from ...job_service import enqueue, fingerprint
from ...audit import record as audit
from .models import TaskStream, TaskPackage, TaskPackageAsset, PackageRequest, PackageInvalidation
from .validation import validate_package, scope, contract_response
from .connectors import identity_matches


def lock(db, key):
    db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:key,0))'), {'key': 'b05:'+key})


def package_in(db, ident, actor, action='package_read', available=False, lock_row=False):
    query = select(TaskPackage).where(TaskPackage.id == ident)
    package = db.scalar(query.with_for_update() if lock_row else query)
    if not package:
        raise Problem(404, 'NOT_FOUND', '任务包不存在。')
    scope(actor, {'project_id': package.project_id, 'org_id': package.org_id, 'producer': package.producer}, action)
    if available and package.state == 'withdrawn':
        raise Problem(410, 'PACKAGE_WITHDRAWN', '此任务包已撤回，正文和附件不能继续使用。')
    if package.producer == 'a' and (available or action == 'package_read') and package.state != 'withdrawn':
        from ...platform_archives import guard
        guard(package, actor)
    return package


def refresh_transport(db, package, data, actor, request_id):
    if package.state == 'withdrawn':
        return
    for declared in data['attachments']:
        row = db.scalar(select(TaskPackageAsset).where(TaskPackageAsset.package_id == package.id,
                TaskPackageAsset.external_attachment_id == declared['attachment_id']))
        if row and row.access_ref != declared['access_ref'] and identity_matches(declared['access_ref'], declared, package.project_id, package.org_id):
            row.access_ref = deepcopy(declared['access_ref'])
            audit(db, actor, 'package_transport_ref_refreshed', 'task_package', package.id, package.project_id, request_id)


def receive(data, actor, key, request_id):
    digest, notices = validate_package(data, actor)
    with Session.begin() as db:
        lock(db, f"request:{actor.id}:{data['producer']}:submit:{key}")
        lock(db, f"stream:{data['producer']}:{data['task_id']}")
        lock(db, f"identity:{data['producer']}:{data['package_id']}")
        prior = db.scalar(select(PackageRequest).where(PackageRequest.actor_id == actor.id,
            PackageRequest.producer == data['producer'], PackageRequest.operation == 'submit', PackageRequest.idempotency_key == key))
        if prior:
            if prior.content_hash != digest:
                raise Problem(409, 'IDEMPOTENCY_CONFLICT', '同一提交标识对应不同业务内容。')
            package = package_in(db, prior.package_id, actor, 'package_receive')
            refresh_transport(db, package, data, actor, request_id)
            return package, True
        stream = db.scalar(select(TaskStream).where(TaskStream.producer == data['producer'], TaskStream.task_id == data['task_id']))
        if stream and (stream.project_id != data['project_id'] or stream.org_id != data['org_id']):
            raise Problem(403, 'TASK_SCOPE_CONFLICT', '同一来源任务不能迁移到其他项目或组织。')
        existing = db.scalar(select(TaskPackage).where(TaskPackage.producer == data['producer'],
            TaskPackage.task_id == data['task_id'], TaskPackage.package_version == data['package_version']))
        identity = db.scalar(select(TaskPackage).where(TaskPackage.producer == data['producer'], TaskPackage.package_id == data['package_id']))
        if existing:
            if existing.content_hash != digest:
                raise Problem(409, 'PACKAGE_VERSION_CONFLICT', '同任务同版本内容不同，请由A递交更高版本。')
            refresh_transport(db, existing, data, actor, request_id)
            package, replayed = existing, True
        elif identity:
            raise Problem(409, 'PACKAGE_ID_CONFLICT', 'package_id已用于其他任务或版本。')
        else:
            if not stream:
                stream = TaskStream(producer=data['producer'], task_id=data['task_id'], org_id=data['org_id'], project_id=data['project_id'])
                db.add(stream)
                db.flush()
            ident = new_id()
            run = ProcessingRun(kind='task_package_import', object_id=ident, actor_id=actor.id, project_id=data['project_id'],
                title=('任务包接入 · '+data['task']['name'])[:200], idempotency_key='b05:'+ident,
                input_hash=digest, payload={'receipt_id': ident})
            db.add(run)
            db.flush()
            package = TaskPackage(id=ident, stream_id=stream.id, producer=data['producer'], package_id=data['package_id'],
                task_id=data['task_id'], package_version=data['package_version'], content_hash=digest, schema_version=data['schema_version'],
                org_id=data['org_id'], project_id=data['project_id'], scene_code=data['scene_code'], snapshot=deepcopy(data),
                is_demo=data['is_demo'], run_id=run.id, actor_id=actor.id)
            db.add(package)
            db.flush()
            for declared in data['attachments']:
                db.add(TaskPackageAsset(package_id=ident, external_attachment_id=declared['attachment_id'], access_ref=deepcopy(declared['access_ref'])))
            stream.latest_received_version = max(stream.latest_received_version, data['package_version'])
            run.queue_job_id = enqueue(db, run.id)
            audit(db, actor, 'task_package_received', 'task_package', ident, data['project_id'], request_id)
            replayed = False
        db.add(PackageRequest(actor_id=actor.id, producer=data['producer'], operation='submit', idempotency_key=key,
                              content_hash=digest, package_id=package.id))
        return package, replayed


def receipt(package, replayed):
    return contract_response('task-receipt.schema.json', {'receipt_id': package.id, 'job_id': package.run_id,
        'status': package.state, 'status_url': '/integration/v1/task-packages/'+package.id, 'replayed': replayed})


def status_dto(db, package):
    stream = db.get(TaskStream, package.stream_id)
    warnings, missing, caps = package.warnings, package.missing_fields, []
    if package.state == 'ready':
        from .assessment import assess
        warnings, missing, caps = assess(db, package)
    from ..retrospectives.models import Retrospective, RetrospectiveRevision, RetrospectiveSource
    retrospective_id = db.scalar(select(Retrospective.id).join(RetrospectiveRevision,
        (RetrospectiveRevision.parent_id == Retrospective.id) & (RetrospectiveRevision.version == Retrospective.current_revision))
        .join(RetrospectiveSource, RetrospectiveSource.revision_id == RetrospectiveRevision.id)
        .where(RetrospectiveSource.task_package_id == package.id).limit(1)) if package.state == 'ready' else None
    return contract_response('task-status.schema.json', {'receipt_id': package.id, 'job_id': package.run_id,
        'status': package.state, 'is_current': package.state == 'ready' and stream.current_package_id == package.id,
        'validation_errors': package.validation_errors, 'missing_fields': missing,
        'warnings': warnings, 'retrospective_id': retrospective_id, 'capabilities': caps})


def withdraw(ident, reason, actor, key, request_id):
    with Session.begin() as db:
        package = package_in(db, ident, actor, 'package_withdraw')
        lock(db, f'request:{actor.id}:{package.producer}:withdraw:{key}')
        # Same lock order as final pointer promotion: stream, then package.
        lock(db, f'stream:{package.producer}:{package.task_id}')
        db.refresh(package, with_for_update=True)
        digest = fingerprint({'receipt_id': ident, 'reason': reason})
        prior = db.scalar(select(PackageRequest).where(PackageRequest.actor_id == actor.id,
            PackageRequest.producer == package.producer, PackageRequest.operation == 'withdraw', PackageRequest.idempotency_key == key))
        if prior and prior.content_hash != digest:
            raise Problem(409, 'IDEMPOTENCY_CONFLICT', '同一撤回标识对应不同任务包或原因。')
        replayed = package.state == 'withdrawn'
        if not replayed:
            package.state, package.withdrawn_at, package.withdrawal_reason = 'withdrawn', utcnow(), reason
            package.capabilities = []
            package.row_version += 1
            stream = db.get(TaskStream, package.stream_id)
            if stream.current_package_id == ident:
                stream.current_package_id = None
            for relation in db.scalars(select(TaskPackageAsset).where(TaskPackageAsset.package_id == ident)):
                if relation.asset_id:
                    db.get(FileAsset, relation.asset_id).availability = 'withdrawn'
            run = db.get(ProcessingRun, package.run_id)
            if run.status != 'succeeded':
                run.status, run.error = 'failed', '任务包已撤回，不再继续处理或重试。'
                run.row_version += 1
            db.add(PackageInvalidation(package_id=ident, state='handled', payload={'source_type': 'task_package', 'receipt_id': ident,
                'package_version': package.package_version, 'pending_consumers': [],
                'consumed_by': ['B06','B07'], 'B06_policy': 'live-source-guard', 'B07_policy': 'live-publication-source-guard'}))
            audit(db, actor, 'task_package_withdrawn', 'task_package', ident, package.project_id, request_id)
        if not prior:
            db.add(PackageRequest(actor_id=actor.id, producer=package.producer, operation='withdraw', idempotency_key=key,
                                  content_hash=digest, package_id=ident))
        return contract_response('withdraw-response.schema.json', {'receipt_id': ident, 'status': 'withdrawn',
            'withdrawn_at': package.withdrawn_at.isoformat(), 'replayed': replayed})


def prepare_retry(db, run, actor):
    package = package_in(db, run.object_id, actor, 'package_receive', available=True, lock_row=True)
    package.state = 'received'
    package.validation_errors = []
    package.row_version += 1


def ready_snapshot(db, ident, actor, require_current=True):
    package = package_in(db, ident, actor, available=True)
    if package.state != 'ready':
        raise Problem(409, 'PACKAGE_NOT_READY', '任务包尚未处理完成。')
    stream = db.get(TaskStream, package.stream_id)
    if require_current and stream.current_package_id != ident:
        raise Problem(409, 'PACKAGE_NOT_CURRENT', '任务包已不是当前可用版本。')
    return deepcopy(package.snapshot), status_dto(db, package)['capabilities']


def guard_asset(db, asset_id, actor):
    relation = db.scalar(select(TaskPackageAsset).where(TaskPackageAsset.asset_id == asset_id))
    if relation:
        package_in(db, relation.package_id, actor, available=True)
        if relation.verification_state != 'verified':
            raise Problem(410, 'ATTACHMENT_UNVERIFIED', '附件尚未通过校验，不能使用。')
