"""Idempotent risk-record projection of verified task snapshots, not a second source."""
import hashlib
import json
from uuid import UUID, uuid5
from sqlalchemy import select
from ...auth import Problem
from ...models import FileAsset
from ...storage import asset_path
from .models import DataSource, ImportBatch, SourceRecordVersion
from .service import apply_row


def project_package(db, package):
    if package.state != 'ready':
        raise Problem(409, 'PACKAGE_NOT_READY', '任务包尚未完成核验。')
    namespace = 'task-stream:' + package.stream_id
    source = db.scalar(select(DataSource).where(DataSource.project_id == package.project_id, DataSource.namespace == namespace))
    mapping = {k: k for k in ['record_id', 'report_id', 'project_id', 'description', 'record_kind', 'occurred_on', 'images']}
    if not source:
        source = DataSource(project_id=package.project_id, namespace=namespace, kind='governance_export',
            name=('A 成果 · '+package.snapshot['task']['name'])[:200], mapping_version='task-risk-v1',
            config={'mapping': mapping, 'is_mock': package.is_demo, 'task_stream_id': package.stream_id})
        db.add(source); db.flush()
    prior = db.scalar(select(ImportBatch).where(ImportBatch.run_id == package.run_id))
    if prior:
        return prior
    # Only the validated immutable snapshot is stored. Transport credentials and
    # access references are excluded from the user-downloadable input artifact.
    snapshot = {k: package.snapshot[k] for k in ['producer', 'task_id', 'package_version', 'project_id', 'task', 'issues']}
    raw = json.dumps(snapshot, ensure_ascii=False, sort_keys=True).encode('utf-8')
    digest = hashlib.sha256(raw).hexdigest()
    asset_id = str(uuid5(UUID(package.id), 'risk-snapshot'))
    key = 'task-risk/'+package.id+'/'+digest+'.json'
    path = asset_path(key); path.parent.mkdir(parents=True, exist_ok=True); path.write_bytes(raw)
    asset = db.get(FileAsset, asset_id)
    if not asset:
        asset = FileAsset(id=asset_id, storage_key=key, sha256=digest, size=len(raw), mime_type='application/json',
                          project_id=package.project_id, org_id=package.org_id)
        db.add(asset); db.flush()
    batch = ImportBatch(source_id=source.id, run_id=package.run_id, input_asset_id=asset_id, input_hash=digest,
                        mapping=mapping, rule_version='task-risk-v1', status='succeeded', options={'task_package_id': package.id})
    db.add(batch); db.flush()
    from ..task_packages.models import TaskPackageAsset, TaskStream
    relations = {r.external_attachment_id:r for r in db.scalars(select(TaskPackageAsset).where(TaskPackageAsset.package_id == package.id))}
    # A late older snapshot is retained in TaskPackage but must not replace the
    # risk pool's latest source. The stream watermark also survives withdrawal.
    stream = db.get(TaskStream, package.stream_id)
    if package.package_version < stream.current_ready_version:
        batch.counts = {'skipped_old_package': len(package.snapshot['issues'])}
        return batch
    for n, issue in enumerate(package.snapshot['issues'], 1):
        images = []
        for ref in issue.get('evidence_refs', []):
            relation = relations.get(ref)
            attached = db.get(FileAsset, relation.asset_id) if relation and relation.asset_id else None
            if attached and attached.mime_type.startswith('image/') and relation.verification_state == 'verified':
                images.append({'ref':attached.id,'type':'site_photo','relation_confidence':'anchored','row_anchor':issue['issue_id']})
        row = {'record_id': issue['issue_id'], 'report_id':package.task_id, 'project_id':package.project_id,
               'description':issue['description'], 'record_kind':'detail', 'occurred_on':None, 'images':images,
               'original_issue':issue, 'task_package_id':package.id, 'source_package_version':package.package_version}
        apply_row(db, source, batch, n, row, {}, {'task_package_id':package.id,'issue_id':issue['issue_id'],'row':n})
    db.flush()
    for version in db.scalars(select(SourceRecordVersion).where(SourceRecordVersion.batch_id == batch.id)):
        version.provenance = {**version.provenance, 'task_package_id':package.id, 'source_package_version':package.package_version}
    batch.counts = {'source_issues': len(package.snapshot['issues'])}
    return batch


def guard_projected(db, version, actor, action='knowledge.read'):
    ident = version.provenance.get('task_package_id')
    if ident:
        from ..task_packages.service import package_in
        package = package_in(db, ident, actor, action, available=True)
        if package.state != 'ready':
            raise Problem(410, 'SOURCE_UNAVAILABLE', '风险来源任务包已不可用。')
        from ..task_packages.models import TaskStream
        stream=db.get(TaskStream,package.stream_id)
        if stream.current_ready_version>package.package_version:
            if not stream.current_package_id:
                raise Problem(410,'SOURCE_UNAVAILABLE','更新后的任务来源已撤回。')
            latest=package_in(db,stream.current_package_id,actor,action,available=True)
            external=version.provenance.get('external_record_id')
            if external not in {issue['issue_id'] for issue in latest.snapshot['issues']}:
                raise Problem(410,'SOURCE_RECORD_REMOVED','该风险已从新任务版本移除，不再作为有效来源。')


def guard_snapshot_asset(db, asset_id, actor):
    batches = db.scalars(select(ImportBatch).where(ImportBatch.input_asset_id == asset_id))
    for batch in batches:
        if batch.options.get('task_package_id'):
            from ..task_packages.service import package_in
            package_in(db, batch.options['task_package_id'], actor, 'knowledge.read', available=True)
