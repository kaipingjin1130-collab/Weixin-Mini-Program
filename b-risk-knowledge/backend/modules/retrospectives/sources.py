from types import SimpleNamespace
from sqlalchemy import select, exists, or_, and_
from ...auth import authorize, Problem
from ...models import FileAsset
from ..ingestion.models import SourceRecordVersion
from ..task_packages.models import TaskPackage
from ..task_packages.service import ready_snapshot
from ..knowledge.service import source_context
from .models import Retrospective, RetrospectiveRevision, RetrospectiveSource, RetrospectiveEvidence


def guard_sources(db, revision, actor, current=False):
    parent = db.get(Retrospective, revision.parent_id)
    authorize(actor, 'read', parent.project_id)
    if revision.sources.get('task_package_id'):
        return ready_snapshot(db, revision.sources['task_package_id'], actor, require_current=current)
    for ident in revision.sources['record_version_ids']:
        source_context(db, ident, actor, current=current)
    return None


def context(db, revision_id, actor, current=False):
    revision = db.get(RetrospectiveRevision, revision_id)
    if not revision:
        raise Problem(404, 'SOURCE_VERSION_NOT_FOUND', '复盘来源版本不存在。')
    parent = db.get(Retrospective, revision.parent_id)
    guard_sources(db, revision, actor, current)
    if revision.state != 'approved':
        raise Problem(409, 'RETROSPECTIVE_NOT_APPROVED', '经验来源复盘尚未审核通过。')
    descriptors = []
    for e in db.scalars(select(RetrospectiveEvidence).where(RetrospectiveEvidence.revision_id == revision.id)):
        if e.asset_id:
            asset = db.get(FileAsset, e.asset_id)
            if not asset or asset.availability != 'available':
                continue
        descriptors.append(SimpleNamespace(id=e.id, evidence_type=e.kind, relation_confidence='anchored',
            asset_id=e.asset_id, locator=e.locator, text=e.text, document_id=None, reference=e.reference))
    source = SimpleNamespace(id=revision.id, retrospective_revision_id=revision.id, record_id=parent.id,
        version=revision.version, effective_fields={'description': revision.summary}, raw_fields={}, provenance=revision.sources)
    row = SimpleNamespace(id=parent.id, project_id=parent.project_id, current_version=parent.current_revision)
    return source, row, descriptors


def availability_sql(item):
    """Correlated SQL filter used by both retrieval lanes, before ranking/limits."""
    ref = item.retrospective_revision_id
    invalid = exists(select(RetrospectiveSource.id).outerjoin(TaskPackage, TaskPackage.id == RetrospectiveSource.task_package_id)
        .outerjoin(SourceRecordVersion, SourceRecordVersion.id == RetrospectiveSource.record_version_id)
        .outerjoin(FileAsset, FileAsset.id == SourceRecordVersion.provenance['input_asset_id'].astext)
        .where(RetrospectiveSource.revision_id == ref, or_(
            and_(RetrospectiveSource.task_package_id.is_not(None), or_(TaskPackage.state != 'ready', TaskPackage.withdrawn_at.is_not(None))),
            and_(RetrospectiveSource.record_version_id.is_not(None), or_(FileAsset.id.is_(None), FileAsset.availability != 'available', FileAsset.project_id != item.project_id)))))
    return and_(ref.is_not(None), exists(select(RetrospectiveRevision.id).where(RetrospectiveRevision.id == ref, RetrospectiveRevision.state == 'approved')),
        exists(select(RetrospectiveSource.id).where(RetrospectiveSource.revision_id == ref)), ~invalid)
