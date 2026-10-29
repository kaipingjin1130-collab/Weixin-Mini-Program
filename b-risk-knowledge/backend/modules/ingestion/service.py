import hashlib
from sqlalchemy import select, func, text
from ...auth import authorize, Problem
from ...audit import record as audit
from ...db import Session
from ...models import FileAsset, ProcessingRun, utcnow
from ...storage import asset_path
from ...job_service import fingerprint
from .models import DataSource, ImportBatch, SourceDocument, SourceRecord, SourceRecordVersion, EvidenceItem, RecordLink, ImportRow
from .adapters import read_rows, normalize, MIME
from .fixtures import fixture_id
from ...config import settings


def get_input(db, source, asset_id):
    asset = db.get(FileAsset, asset_id)
    if not asset or asset.project_id != source.project_id:
        raise Problem(403, 'INPUT_SCOPE_DENIED', '输入文件不属于此来源项目。')
    if asset.availability != 'available':
        raise Problem(410, 'INPUT_UNAVAILABLE', '输入文件已撤回。')
    if asset.mime_type != MIME[source.kind]:
        raise Problem(422, 'INPUT_TYPE_MISMATCH', '文件类型与接入器不一致。')
    path = asset_path(asset.storage_key)
    if not path.is_file():
        raise Problem(404, 'INPUT_MISSING', '输入文件不存在。')
    content = path.read_bytes()
    if hashlib.sha256(content).hexdigest() != asset.sha256:
        raise Problem(409, 'INPUT_CHANGED', '输入文件校验失败，请重新接入。')
    rows = read_rows(source.kind, content)
    if len(rows) > 10000:
        raise Problem(422, 'ROW_LIMIT', '首版每批最多10000条。')
    if rows:
        missing = [v for k, v in source.config['mapping'].items() if k in {'project_id', 'report_id', 'description', 'record_kind'} and v not in rows[0][1]]
        if missing:
            raise Problem(422, 'MAPPING_COLUMNS_MISSING', '缺少映射列，请选择对应模板的输入文件。')
    return asset, rows


def preview(source, asset_id, actor):
    authorize(actor, 'knowledge.process', source.project_id)
    with Session() as db:
        asset, rows = get_input(db, source, asset_id)
        output = []
        warnings, failures = 0, 0
        for n, raw, governed, locator in rows:
            norm = normalize(raw, governed, source.config['mapping'], source.project_id)
            warnings += bool(norm['issues'])
            failures += bool(norm['errors'])
            if len(output) < 20:
                output.append({'row_number': n, 'external_id': norm['external_id'],
                               'effective_fields': norm['effective'] if not norm['errors'] else {},
                               'issues': norm['issues'], 'errors': norm['errors'], 'locator': locator})
        return {'input_hash': asset.sha256, 'total': len(rows), 'warning_rows': warnings,
                'failed_rows': failures, 'mapping_version': source.mapping_version,
                'mapping': source.config['mapping'], 'preview': output, 'is_mock': source.config.get('is_mock', True),
                'raw_columns': list(rows[0][1]) if rows else []}


def submit_import(source, data, actor, key, request_id):
    authorize(actor, 'knowledge.process', source.project_id)
    digest = fingerprint(data.model_dump())
    from ...job_service import enqueue
    with Session.begin() as db:
        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:key,0))'),
                   {'key': f'submit:{actor.id}:{key}'})
        prior = db.scalar(select(ProcessingRun).where(ProcessingRun.actor_id == actor.id,
                                                     ProcessingRun.idempotency_key == key))
        if prior:
            if prior.input_hash != digest or prior.kind != 'source_import':
                raise Problem(409, 'IDEMPOTENCY_CONFLICT', '此提交标识已用于其他内容。')
            batch = db.scalar(select(ImportBatch).where(ImportBatch.run_id == prior.id))
            return batch, prior, True
        asset, rows = get_input(db, source, data.input_asset_id)
        if asset.sha256 != data.input_hash:
            raise Problem(409, 'PREVIEW_STALE', '预览与当前输入不一致，请重新预览。')
        run = ProcessingRun(kind='source_import', object_id='pending', project_id=source.project_id,
                            actor_id=actor.id, title=f'历史数据接入 · {source.name}', idempotency_key=key,
                            input_hash=digest, payload={'source_id': source.id})
        db.add(run)
        db.flush()
        batch = ImportBatch(source_id=source.id, run_id=run.id, input_asset_id=asset.id,
                            input_hash=asset.sha256, mapping=dict(source.config['mapping']),
                            rule_version='b02-rules-1', options={'fail_after': data.fail_after},
                            counts={'total': len(rows), 'processed': 0, 'created': 0, 'updated': 0, 'skipped': 0, 'failed': 0, 'warning_rows': 0, 'kinds': {}})
        db.add(batch)
        db.flush()
        run.object_id = batch.id
        run.queue_job_id = enqueue(db, run.id)
        audit(db, actor, 'import_submitted', 'import_batch', batch.id, source.project_id, request_id)
        return batch, run, False


def apply_row(db, source, batch, n, raw, governed, locator):
    norm = normalize(raw, governed, batch.mapping, source.project_id)
    if norm['errors']:
        safe_raw = raw if norm['effective'].get('project_id') == source.project_id else {'redacted': '项目范围不匹配，隐藏该行字段'}
        db.add(ImportRow(batch_id=batch.id, row_number=n, outcome='failed', raw_fields=safe_raw,
                         issues=norm['errors'] + norm['issues']))
        return
    effective = norm['effective']
    doc = db.scalar(select(SourceDocument).where(SourceDocument.source_id == source.id,
                                                SourceDocument.external_report_id == norm['report_id']))
    if not doc:
        doc = SourceDocument(source_id=source.id, external_report_id=norm['report_id'], title=norm['report_id'])
        db.add(doc)
        db.flush()
    row = db.scalar(select(SourceRecord).where(SourceRecord.source_id == source.id,
                                               SourceRecord.external_record_id == norm['external_id']))
    created = row is None
    if created:
        row = SourceRecord(source_id=source.id, document_id=doc.id, external_record_id=norm['external_id'],
                           project_id=source.project_id, record_kind=effective['record_kind'], quality_status='valid')
        db.add(row)
        db.flush()
    # Input snapshot hash is provenance, not content identity: one changed row must not version every row.
    digest = fingerprint({'raw': raw, 'effective': effective, 'governance': governed})
    version = db.scalar(select(SourceRecordVersion).where(SourceRecordVersion.record_id == row.id,
                                                          SourceRecordVersion.content_hash == digest))
    previous_version = row.current_version
    outcome = 'created' if created else 'updated'
    if version:
        if row.current_version == version.version:
            outcome = 'skipped'
    else:
        next_version = (db.scalar(select(func.max(SourceRecordVersion.version)).where(SourceRecordVersion.record_id == row.id)) or 0) + 1
        version = SourceRecordVersion(record_id=row.id, version=next_version, content_hash=digest,
                                      raw_fields=raw, effective_fields=effective, issues=norm['issues'],
                                      provenance={'kind': source.kind, 'namespace': source.namespace, 'external_record_id': norm['external_id'],
                                                  'locator': locator, 'input_asset_id': batch.input_asset_id, 'input_hash': batch.input_hash,
                                                  'mapping_version': source.mapping_version, 'rule_version': batch.rule_version,
                                                  'governance': governed, 'is_mock': source.config.get('is_mock', True)}, batch_id=batch.id)
        db.add(version)
        db.flush()
        from ..knowledge.quality import ensure_issues
        ensure_issues(db, version)
        db.add(EvidenceItem(document_id=doc.id, record_version_id=version.id, locator=locator,
                            evidence_type='source_row', asset_id=batch.input_asset_id, relation_confidence='anchored'))
        for image in effective['images']:
            asset = db.get(FileAsset, fixture_id(image.get('ref', '')))
            image_id = asset.id if asset and asset.project_id == source.project_id and asset.mime_type.startswith('image/') else None
            db.add(EvidenceItem(document_id=doc.id, record_version_id=version.id,
                                locator={**locator, 'ref': image.get('ref'), 'row_anchor': image.get('row_anchor')},
                                evidence_type=image['type'], asset_id=image_id,
                                relation_confidence=image['relation_confidence']))
    if not created and previous_version != version.version:
        # Confirmed decisions stay bound to the exact compared versions, never silently apply to new content.
        for link in db.scalars(select(RecordLink).where((RecordLink.from_record == row.id) | (RecordLink.to_record == row.id))):
            link.review_state = 'stale'
            link.row_version += 1
    row.current_version = version.version
    row.document_id, row.record_kind = doc.id, effective['record_kind']
    row.quality_status = 'needs_review' if norm['issues'] else 'valid'
    row.occurred_on = effective.get('occurred_on')
    db.add(ImportRow(batch_id=batch.id, row_number=n, outcome=outcome, record_id=row.id,
                     version_id=version.id, issues=norm['issues'], raw_fields=raw))
    if outcome != 'skipped':
        candidates = db.execute(select(SourceRecord, SourceRecordVersion).join(SourceRecordVersion,
                    (SourceRecordVersion.record_id == SourceRecord.id) & (SourceRecordVersion.version == SourceRecord.current_version)).where(
                        SourceRecord.project_id == source.project_id, SourceRecord.source_id != source.id,
                        SourceRecord.record_kind == row.record_kind)).all()
        descriptions = {str(effective.get('description', '')).strip(), str(raw.get(batch.mapping['description'], '')).strip()} - {''}
        for other, other_version in candidates:
            other_descriptions = {str(other_version.effective_fields.get('description', '')).strip()}
            other_source = db.get(DataSource, other.source_id)
            other_descriptions.add(str(other_version.raw_fields.get(other_source.config['mapping']['description'], '')).strip())
            if descriptions & other_descriptions:
                left, right = sorted([row.id, other.id])
                link = db.scalar(select(RecordLink).where(RecordLink.from_record == left, RecordLink.to_record == right))
                refs = {row.id: version.id, other.id: other_version.id}
                if not link:
                    db.add(RecordLink(from_record=left, to_record=right, version_refs=refs))
                elif link.review_state == 'stale':
                    # Re-propose changed comparison but preserve old decision in audit history.
                    link.version_refs, link.review_state = refs, 'candidate'


def recompute_counts(db, batch):
    rows = db.scalars(select(ImportRow).where(ImportRow.batch_id == batch.id)).all()
    counts = {'total': batch.counts['total'], 'processed': len(rows), 'created': 0, 'updated': 0,
              'skipped': 0, 'failed': 0, 'warning_rows': 0, 'kinds': {}}
    for row in rows:
        counts[row.outcome] += 1
        counts['warning_rows'] += bool(row.issues) and row.outcome != 'failed'
        if row.version_id:
            version = db.get(SourceRecordVersion, row.version_id)
            kind = version.effective_fields['record_kind']
            counts['kinds'][kind] = counts['kinds'].get(kind, 0) + 1
    batch.counts = counts
    return counts


def prepare_retry(db, run):
    batch = db.get(ImportBatch, run.object_id)
    batch.status = 'queued'
    run.progress = int(batch.counts['processed'] / max(batch.counts['total'], 1) * 100)
