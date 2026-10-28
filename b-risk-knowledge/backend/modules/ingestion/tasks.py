from sqlalchemy import select
from ...db import Session
from ...models import ProcessingRun, utcnow, UserLink
from ...queue import queue_app
from ...auth import Actor, authorize
from ...models import RoleBinding
from .models import DataSource, ImportBatch, ImportRow
from .service import get_input, apply_row, recompute_counts


@queue_app.task(name='b02.source_import', queue='b01')
def source_import(run_id: str):
    with Session.begin() as db:
        run = db.scalar(select(ProcessingRun).where(ProcessingRun.id == run_id).with_for_update())
        if not run or run.status == 'succeeded':
            return
        run.status, run.error, run.attempts = 'running', None, run.attempts + 1
        run.row_version += 1
        run.updated_at = utcnow()
        batch = db.get(ImportBatch, run.object_id)
        batch.status = 'running'
        source_id, batch_id, attempt = batch.source_id, batch.id, run.attempts
    try:
        with Session() as db:
            source, batch = db.get(DataSource, source_id), db.get(ImportBatch, batch_id)
            _, rows = get_input(db, source, batch.input_asset_id)
        for number, raw, governed, locator in rows:
            with Session.begin() as db:
                source = db.scalar(select(DataSource).where(DataSource.id == source_id).with_for_update())
                batch, run = db.get(ImportBatch, batch_id), db.get(ProcessingRun, run_id)
                # Revocation also stops new background consumption, not just API access.
                user = db.get(UserLink, run.actor_id)
                from ...auth import actor_for_user
                authorize(actor_for_user(db, user), 'run', source.project_id)
                if db.scalar(select(ImportRow.id).where(ImportRow.batch_id == batch_id, ImportRow.row_number == number)):
                    continue
                apply_row(db, source, batch, number, raw, governed, locator)
                db.flush()
                item = db.scalar(select(ImportRow).where(ImportRow.batch_id == batch_id, ImportRow.row_number == number))
                counts = {**batch.counts, 'kinds': dict(batch.counts.get('kinds', {}))}
                counts['processed'] += 1
                counts[item.outcome] += 1
                counts['warning_rows'] += int(bool(item.issues) and item.outcome != 'failed')
                from .models import SourceRecordVersion
                if item.version_id:
                    kind = db.get(SourceRecordVersion, item.version_id).effective_fields['record_kind']
                    counts['kinds'][kind] = counts['kinds'].get(kind, 0) + 1
                batch.counts = counts
                run.progress = int(counts['processed'] / max(counts['total'], 1) * 100)
                run.updated_at = utcnow()
                fault = batch.options.get('fail_after')
            if fault and attempt == 1 and counts['processed'] >= fault:
                raise RuntimeError('MOCK_INTERRUPT')
        with Session.begin() as db:
            batch, run, source = db.get(ImportBatch, batch_id), db.get(ProcessingRun, run_id), db.get(DataSource, source_id)
            counts = recompute_counts(db, batch)
            batch.status = 'completed_with_errors' if counts['failed'] else 'completed'
            source.cursor = {'batch_id': batch.id, 'input_hash': batch.input_hash, 'synced_at': utcnow().isoformat()}
            run.status, run.progress, run.error = 'succeeded', 100, None
            run.row_version += 1
            run.updated_at = utcnow()
    except Exception:
        with Session.begin() as db:
            batch, run = db.get(ImportBatch, batch_id), db.get(ProcessingRun, run_id)
            batch.status, run.status = 'failed', 'failed'
            run.error = '接入中断，已提交行已保留。恢复权限或输入后可重试，继续未完成行。'
            run.row_version += 1
            run.updated_at = utcnow()
        raise
