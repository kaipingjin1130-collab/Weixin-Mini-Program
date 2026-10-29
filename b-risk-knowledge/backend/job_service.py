import hashlib
import json
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from .auth import authorize, Problem
from .audit import record
from .models import ProcessingRun, RetryRequest, new_id, utcnow
from .db import Session


JOB_READ = {'a_import': 'imports.read', 'task_package_import': 'imports.read',
            'a_retrospective': 'retrospective.read', 'source_import': 'knowledge.process',
            'knowledge_generation': 'knowledge.process', 'knowledge_extraction': 'knowledge.process',
            'release_build': 'knowledge.publish', 'training_grading': 'training.manage'}


def job_action(run, retry=False):
    from .integrations.a.runtime import enabled
    if not enabled():
        return ('training_manage' if run.kind == 'training_grading' else 'audit' if run.kind == 'release_build'
                else 'package_receive' if run.kind == 'task_package_import' else 'run') if retry else 'read'
    if retry and run.kind in {'a_import', 'a_retrospective', 'task_package_import'}:
        raise Problem(409, 'USE_IMPORT_RETRY', '请从成果接入详情重试，以同步接入与复盘状态。')
    return JOB_READ.get(run.kind, 'run')


def visible_jobs(actor):
    from .integrations.a.runtime import enabled
    from sqlalchemy import and_, or_, false
    if not enabled():
        return ProcessingRun.project_id.in_(actor.projects())
    return or_(false(), *(and_(ProcessingRun.kind == kind, ProcessingRun.project_id.in_(actor.projects(action)))
                         for kind, action in JOB_READ.items()))


def fingerprint(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def enqueue(db, run_id):
    from .queue import demo_check
    run = db.get(ProcessingRun, run_id)
    task = demo_check
    lock = f'b01:{run_id}'
    if run.kind == 'source_import':
        from .modules.ingestion.tasks import source_import
        task, lock = source_import, f"source:{run.payload['source_id']}"
    elif run.kind == 'knowledge_generation':
        from .modules.knowledge.tasks import generate
        task = generate
    elif run.kind == 'release_build':
        from .modules.retrieval.tasks import build_release
        task = build_release
    elif run.kind == 'task_package_import':
        from .modules.task_packages.tasks import process_package
        task = process_package
    elif run.kind == 'knowledge_extraction':
        from .modules.extraction.tasks import extract
        task = extract
    elif run.kind == 'training_grading':
        from .modules.training.tasks import grade_attempt
        task = grade_attempt
    elif run.kind in {'a_import', 'a_retrospective'}:
        from .integrations.a.tasks import import_job, retrospective_job
        task = import_job if run.kind == 'a_import' else retrospective_job
    # The library INSERT and the SQLAlchemy ORM flush share one physical transaction.
    connection = db.connection().connection.driver_connection
    return task.configure(connection=connection, lock=lock).defer(run_id=run_id)


def create_run(actor, data, key, request_id):
    authorize(actor, "run", data.project_id)
    payload = data.model_dump()
    digest = fingerprint(payload)
    try:
        with Session.begin() as db:
            existing = db.scalar(select(ProcessingRun).where(
                ProcessingRun.actor_id == actor.id, ProcessingRun.idempotency_key == key))
            if existing:
                if existing.input_hash != digest:
                    raise Problem(409, "IDEMPOTENCY_CONFLICT", "同一提交标识对应的内容不同。")
                return existing, True
            run = ProcessingRun(id=new_id(), object_id=new_id(), project_id=data.project_id,
                                actor_id=actor.id, title=data.title, idempotency_key=key,
                                input_hash=digest, payload=payload)
            db.add(run)
            db.flush()
            run.queue_job_id = enqueue(db, run.id)
            record(db, actor, "job_created", "job", run.id, run.project_id, request_id)
            db.flush()
            return run, False
    except IntegrityError:
        # Competing identical inserts are resolved through the DB uniqueness constraint.
        with Session() as db:
            prior = db.scalar(select(ProcessingRun).where(
                ProcessingRun.actor_id == actor.id, ProcessingRun.idempotency_key == key))
            if not prior:
                raise
            if prior.input_hash != digest:
                raise Problem(409, "IDEMPOTENCY_CONFLICT", "同一提交标识对应的内容不同。")
            return prior, True


def retry_run(actor, run_id, version, key, request_id):
    digest = fingerprint({"run_id": run_id, "row_version": version})
    with Session.begin() as db:
        # Serialize reuse of one retry key even when requests target different runs.
        from sqlalchemy import text
        db.execute(text("SELECT pg_advisory_xact_lock(hashtextextended(:key, 0))"),
                   {"key": f"retry:{actor.id}:{key}"})
        run = db.scalar(select(ProcessingRun).where(ProcessingRun.id == run_id).with_for_update())
        if not run:
            raise Problem(404, "NOT_FOUND", "任务不存在。")
        authorize(actor, job_action(run, retry=True), run.project_id)
        prior = db.scalar(select(RetryRequest).where(RetryRequest.actor_id == actor.id,
                                                     RetryRequest.idempotency_key == key))
        if prior:
            if prior.input_hash != digest:
                raise Problem(409, "IDEMPOTENCY_CONFLICT", "重试标识已用于其他请求。")
            return run, True
        if run.row_version != version:
            raise Problem(409, "VERSION_CONFLICT", "任务已更新，请刷新后重试。")
        if run.status != "failed":
            raise Problem(409, "INVALID_JOB_STATE", "只有失败的任务可以手动重试。")
        # Wait until the queue has finished the failed execution before replacing its job.
        queue_state = db.scalar(text("SELECT status::text FROM procrastinate_jobs WHERE id=:id"),
                                {"id": run.queue_job_id})
        if queue_state not in {"failed", "succeeded", "cancelled", "aborted"}:
            raise Problem(409, "QUEUE_NOT_SETTLED", "处理服务正在结束上次运行，请稍后重试。")
        if run.kind == 'task_package_import':
            from .modules.task_packages.service import prepare_retry as prepare_package_retry
            prepare_package_retry(db, run, actor)
        if run.kind == 'training_grading':
            from .modules.training.service import prepare_grading_retry
            prepare_grading_retry(db,run,actor)
        run.queue_job_id = enqueue(db, run.id)
        run.status, run.error, run.progress = "queued", None, 0
        if run.kind == 'source_import':
            from .modules.ingestion.service import prepare_retry
            prepare_retry(db, run)
        run.row_version += 1
        run.updated_at = utcnow()
        db.add(RetryRequest(actor_id=actor.id, idempotency_key=key, run_id=run.id, input_hash=digest))
        record(db, actor, "job_retried", "job", run.id, run.project_id, request_id, run.row_version)
        return run, False
