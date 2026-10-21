"""Mature queue owns scheduling, locks, heartbeats and retries."""
import asyncio
import time
from uuid import UUID, uuid5
import procrastinate
from sqlalchemy import select
from .config import settings
from .db import Session
from .models import ProcessingRun, FileAsset, utcnow
from .storage import write_result

queue_app = procrastinate.App(connector=procrastinate.PsycopgConnector(
    conninfo=settings.database_url.replace("postgresql+psycopg://", "postgresql://", 1),
    min_size=1, max_size=5))


class TransientDemoError(Exception):
    pass


class ManualDemoError(Exception):
    pass


@queue_app.task(name="b01.demo_check", queue="b01", pass_context=True,
                retry=procrastinate.RetryStrategy(max_attempts=2, wait=2,
                                                 retry_exceptions=[TransientDemoError]))
def demo_check(context, run_id: str):
    with Session.begin() as db:
        run = db.scalar(select(ProcessingRun).where(ProcessingRun.id == run_id).with_for_update())
        if not run or run.status == "succeeded":
            return
        run.status, run.error = "running", None
        run.attempts += 1
        run.row_version += 1
        run.updated_at = utcnow()
        payload, attempt = dict(run.payload), run.attempts
    try:
        for index in range(1, 4):
            time.sleep(payload["duration_seconds"] / 3)
            with Session.begin() as db:
                run = db.get(ProcessingRun, run_id)
                run.progress = index * 25
                run.updated_at = utcnow()
            if index == 1 and attempt == 1:
                if payload["scenario"] == "fail_once":
                    raise TransientDemoError("演示临时故障：队列将在2秒后自动重试。")
                if payload["scenario"] == "manual_failure":
                    raise ManualDemoError("演示失败：请点击“重试任务”验证人工恢复流程。")
        content = (
            "B01任务执行验证（模拟）\n"
            f"任务：{payload['title']}\n"
            f"项目：{payload['project_id']}\n"
            "结果：队列运行、进度记录与文件存储已完成。\n"
            "此任务没有读取或判断真实工程报告，不构成风险检查结论。\n"
        ).encode("utf-8")
        key, digest, size = write_result(run_id, content)
        with Session.begin() as db:
            run = db.scalar(select(ProcessingRun).where(ProcessingRun.id == run_id).with_for_update())
            asset = db.scalar(select(FileAsset).where(FileAsset.source_run_id == run_id))
            if not asset:
                asset = FileAsset(id=str(uuid5(UUID(run_id), "result")), source_run_id=run_id,
                                  storage_key=key, sha256=digest, size=size,
                                  mime_type="text/plain", project_id=run.project_id)
                db.add(asset)
            run.result_ref = asset.id
            run.status, run.progress, run.error = "succeeded", 100, None
            run.updated_at = utcnow()
            run.row_version += 1
    except Exception as exc:
        with Session.begin() as db:
            run = db.get(ProcessingRun, run_id)
            run.status = "retrying" if isinstance(exc, TransientDemoError) and attempt == 1 else "failed"
            run.error = str(exc) if isinstance(exc, (TransientDemoError, ManualDemoError)) else "处理失败，请查看任务编号并联系管理员。"
            run.updated_at = utcnow()
            run.row_version += 1
        raise


async def recover_stalled():
    jobs = await queue_app.job_manager.get_stalled_jobs(queue="b01", seconds_since_heartbeat=10)
    for job in jobs:
        # Only this registered queue/task is recovered; no other application's jobs.
        if job.task_name in {"b01.demo_check", "b02.source_import", "b03.knowledge_generation", "b04.release_build", "b05.task_package_import"}:
            await queue_app.job_manager.retry_job(job)


@queue_app.periodic(cron="* * * * *")
@queue_app.task(name="b01.recover_stalled", queue="b01-maintenance", queueing_lock="b01-recovery")
async def periodic_recovery(timestamp):
    await recover_stalled()


# Register extension tasks in both API and worker processes.
from .modules.ingestion import tasks as ingestion_tasks  # noqa: E402,F401
from .modules.knowledge import tasks as knowledge_tasks  # noqa: E402,F401
from .modules.retrieval import tasks as retrieval_tasks  # noqa: E402,F401
from .modules.task_packages import tasks as package_tasks  # noqa: E402,F401
