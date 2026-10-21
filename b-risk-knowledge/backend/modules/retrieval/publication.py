from sqlalchemy import select, text, func, or_, and_
from ...db import Session
from ...auth import authorize, Problem
from ...models import ProcessingRun, FileAsset, utcnow, new_id
from ...job_service import fingerprint, enqueue
from ...audit import record as audit
from ..knowledge.models import KnowledgeItem, KnowledgeRevision, KnowledgeEvidenceLink
from ..knowledge.service import source_context, item_source, validate_card
from ..knowledge.schemas import Card
from ..ingestion.models import SourceRecordVersion, SourceRecord, EvidenceItem
from .models import KnowledgeRelease, ReleaseEntry, EmbeddingSet, SearchChunk, ChunkEmbedding
from .adapters import get_embedding, STRATEGY, TOKENIZER


def active_release(db, project):
    return db.scalar(select(KnowledgeRelease).where(KnowledgeRelease.active_scope == project, KnowledgeRelease.state == 'active'))


def publication_source(db, revision, actor):
    item = db.get(KnowledgeItem, revision.item_id)
    authorize(actor, 'read', item.project_id)
    if item.withdrawn_at:
        raise Problem(410, 'KNOWLEDGE_WITHDRAWN', '此知识已撤回，不能继续查看或引用。')
    if revision.state != 'approved':
        raise Problem(409, 'REVISION_NOT_APPROVED', '只能发布已审核通过的固定版本。')
    source, row, evidence = item_source(db, item, actor)
    return item, source, evidence


def public_revision(db, revision_id, actor, release_id=None, allow_history=False):
    revision = db.get(KnowledgeRevision, revision_id)
    if not revision:
        raise Problem(404, 'NOT_FOUND', '知识版本不存在。')
    item, source, evidence = publication_source(db, revision, actor)
    release = active_release(db, item.project_id)
    if allow_history:
        query = select(KnowledgeRelease).join(ReleaseEntry).where(ReleaseEntry.knowledge_revision_id == revision.id,
            ReleaseEntry.state == 'ready', KnowledgeRelease.state.in_(['active', 'inactive']), KnowledgeRelease.published_at.is_not(None))
        if release_id:
            query = query.where(KnowledgeRelease.id == release_id)
        release = db.scalar(query.order_by(KnowledgeRelease.published_at.desc()).limit(1))
    if not release or (release_id and release.id != release_id) or not db.scalar(select(ReleaseEntry.id).where(
            ReleaseEntry.release_id == release.id, ReleaseEntry.knowledge_revision_id == revision.id, ReleaseEntry.state == 'ready')):
        raise Problem(410, 'PUBLICATION_UNAVAILABLE', '此知识版本不在当前启用的发布中。')
    return item, revision, source, evidence, release


def approved_for_release(db, ident, actor, project, current=True):
    revision = db.get(KnowledgeRevision, ident)
    if not revision:
        raise Problem(404, 'REVISION_NOT_FOUND', '知识版本不存在。')
    item, source, _ = publication_source(db, revision, actor)
    authorize(actor, 'audit', item.project_id)
    if project != item.project_id:
        raise Problem(422, 'MIXED_PROJECTS', '发布批次只允许同一项目的知识。')
    if current and revision.version != item.current_revision:
        raise Problem(409, 'REVISION_CHANGED', '知识已编辑，请审核当前版本后重新发布。')
    validate_card(db, Card.model_validate(revision.content), source, actor, approving=True)
    return item, revision


def create_release(data, actor, key, request_id):
    authorize(actor, 'audit', data.project_id)
    digest = fingerprint(data.model_dump())
    with Session.begin() as db:
        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:key,0))'), {'key': f'submit:{actor.id}:{key}'})
        prior = db.scalar(select(ProcessingRun).where(ProcessingRun.actor_id == actor.id, ProcessingRun.idempotency_key == key))
        if prior:
            if prior.kind != 'release_build' or prior.input_hash != digest:
                raise Problem(409, 'IDEMPOTENCY_CONFLICT', '提交标识已用于不同内容。')
            return db.scalar(select(KnowledgeRelease).where(KnowledgeRelease.run_id == prior.id)), True
        for ident in data.revision_ids:
            approved_for_release(db, ident, actor, data.project_id)
        ident = new_id()
        adapter = get_embedding(data.embedding_model)
        config = {'model': adapter.model, 'model_version': adapter.model_version, 'dimension': adapter.dimension,
                  'chunk_strategy': STRATEGY, 'tokenizer': TOKENIZER, 'is_mock': True}
        run = ProcessingRun(kind='release_build', object_id=ident, project_id=data.project_id, actor_id=actor.id,
                            title=f'发布索引构建 · {len(data.revision_ids)}张卡片', idempotency_key=key,
                            input_hash=digest, payload={**data.model_dump(), 'release_id': ident})
        db.add(run)
        db.flush()
        release = KnowledgeRelease(id=ident, version='release-'+ident, active_scope=data.project_id,
                                   index_config=config, run_id=run.id, actor_id=actor.id)
        db.add(release)
        db.flush()
        db.add(EmbeddingSet(release_id=ident, model=adapter.model, model_version=adapter.model_version,
                            dimension=adapter.dimension, chunk_strategy=STRATEGY))
        for revision_id in data.revision_ids:
            db.add(ReleaseEntry(release_id=ident, knowledge_revision_id=revision_id))
        run.queue_job_id = enqueue(db, run.id)
        audit(db, actor, 'release_created', 'release', ident, data.project_id, request_id)
        return release, False


def activate(ident, data, actor, request_id):
    with Session.begin() as db:
        release = db.get(KnowledgeRelease, ident)
        if not release:
            raise Problem(404, 'NOT_FOUND', '发布批次不存在。')
        authorize(actor, 'audit', release.active_scope)
        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:key,0))'), {'key': 'active-release:'+release.active_scope})
        db.refresh(release, with_for_update=True)
        active = active_release(db, release.active_scope)
        if release.row_version != data.row_version or (active.id if active else None) != data.expected_active_id:
            raise Problem(409, 'ACTIVE_VERSION_CONFLICT', '发布状态已改变，请刷新后再启用。')
        if release.state not in {'ready', 'inactive'}:
            raise Problem(409, 'INDEX_NOT_READY', '索引尚未完整构建，不能启用。')
        entries = db.scalars(select(ReleaseEntry).where(ReleaseEntry.release_id == ident)).all()
        embedding = db.scalar(select(EmbeddingSet).where(EmbeddingSet.release_id == ident))
        if not entries or any(e.state != 'ready' for e in entries) or embedding.state != 'ready':
            raise Problem(409, 'INDEX_NOT_READY', '存在失败或未完成的索引项。')
        for entry in entries:
            # Snapshot may remain active while a later draft is prepared. Re-check all
            # approval evidence, current source availability and permission at activation.
            approved_for_release(db, entry.knowledge_revision_id, actor, release.active_scope, current=False)
        if active:
            active.state = 'inactive'
            active.row_version += 1
            db.flush()  # Release partial unique index before activating successor.
        release.state, release.published_at = 'active', utcnow()
        release.row_version += 1
        audit(db, actor, 'release_activated', 'release', ident, release.active_scope, request_id)
        return release


def release_dto(db, release, actor):
    authorize(actor, 'audit', release.active_scope)
    run = db.get(ProcessingRun, release.run_id)
    entries = db.scalars(select(ReleaseEntry).where(ReleaseEntry.release_id == release.id)).all()
    return {'id': release.id, 'version': release.version, 'project_id': release.active_scope,
            'state': release.state, 'row_version': release.row_version, 'index_config': release.index_config,
            'job_id': run.id, 'progress': run.progress, 'error': run.error, 'job_row_version': run.row_version,
            'build_ms': release.build_ms, 'created_at': release.created_at, 'published_at': release.published_at,
            'entries': [{'revision_id': e.knowledge_revision_id, 'state': e.state, 'error': e.error} for e in entries]}


def withdraw(ident, data, actor, request_id):
    with Session.begin() as db:
        item = db.scalar(select(KnowledgeItem).where(KnowledgeItem.id == ident).with_for_update())
        if not item:
            raise Problem(404, 'NOT_FOUND', '知识不存在。')
        authorize(actor, 'audit', item.project_id)
        if item.row_version != data.row_version:
            raise Problem(409, 'VERSION_CONFLICT', '知识已更新，请刷新后再撤回。')
        if not item.withdrawn_at:
            item.withdrawn_at, item.withdrawal_reason = utcnow(), data.reason
            item.row_version += 1
            audit(db, actor, 'knowledge_withdrawn', 'knowledge', item.id, item.project_id, request_id)
        return {'id': item.id, 'state': 'withdrawn', 'row_version': item.row_version}


def public_query(actor, project=None, scene=None, card_type=None, include_history=False):
    projects = actor.projects()
    if project:
        authorize(actor, 'read', project)
        projects = [project]
    query = select(KnowledgeItem, KnowledgeRevision, KnowledgeRelease).select_from(KnowledgeItem).join(KnowledgeRevision,
        KnowledgeRevision.item_id == KnowledgeItem.id).join(ReleaseEntry,
        ReleaseEntry.knowledge_revision_id == KnowledgeRevision.id).join(KnowledgeRelease,
        KnowledgeRelease.id == ReleaseEntry.release_id).outerjoin(SourceRecordVersion,
        SourceRecordVersion.id == KnowledgeItem.record_version_id).outerjoin(FileAsset,
        FileAsset.id == SourceRecordVersion.provenance['input_asset_id'].astext).where(
        KnowledgeRelease.state.in_(['active', 'inactive'] if include_history else ['active']),
        KnowledgeRelease.published_at.is_not(None), ReleaseEntry.state == 'ready', KnowledgeItem.withdrawn_at.is_(None),
        KnowledgeItem.project_id.in_(projects), KnowledgeRevision.state == 'approved')
    from ..retrospectives.sources import availability_sql
    query = query.where(or_(and_(KnowledgeItem.record_version_id.is_not(None), FileAsset.availability == 'available',
        FileAsset.project_id == KnowledgeItem.project_id), availability_sql(KnowledgeItem)))
    if scene:
        query = query.where(KnowledgeItem.scene_code == scene)
    if card_type:
        query = query.where(KnowledgeItem.type == card_type)
    return query


def card_dto(item, revision, release):
    return {'id': item.id, 'revision_id': revision.id, 'version': revision.version, 'title': revision.content['title'],
            'type': item.type, 'project_id': item.project_id, 'scene_code': item.scene_code, 'object_type': item.object_type,
            'scope': item.scope, 'release_id': release.id, 'state': 'published', 'is_mock': True}
