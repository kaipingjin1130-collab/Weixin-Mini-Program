from sqlalchemy import select, text
from ...auth import authorize, Problem
from ...models import ProcessingRun, FileAsset
from ...db import Session
from ...job_service import fingerprint, enqueue
from ...audit import record as audit
from ..ingestion.models import SourceRecordVersion, SourceRecord, EvidenceItem
from .models import KnowledgeItem, KnowledgeRevision, KnowledgeEvidenceLink, ReviewAction, QualityIssue


def source_context(db, version_id, actor, action='knowledge.read', current=False):
    version = db.get(SourceRecordVersion, version_id)
    if not version:
        raise Problem(404, 'SOURCE_VERSION_NOT_FOUND', '来源版本不存在。')
    row = db.get(SourceRecord, version.record_id)
    authorize(actor, action, row.project_id)
    if current and row.current_version != version.version:
        raise Problem(409, 'SOURCE_VERSION_CHANGED', '来源已更新，请使用当前版本重新生成。')
    asset = db.get(FileAsset, version.provenance.get('input_asset_id'))
    if not asset or asset.project_id != row.project_id or asset.availability != 'available':
        raise Problem(410, 'SOURCE_WITHDRAWN', '来源文件已撤回或不可用。')
    evidence = db.scalars(select(EvidenceItem).where(EvidenceItem.record_version_id == version.id)).all()
    return version, row, evidence


def item_source(db, item, actor, action='knowledge.read', current=False):
    if item.retrospective_revision_id:
        authorize(actor, action, item.project_id)
        from ..retrospectives.sources import context
        return context(db, item.retrospective_revision_id, actor, current=current, action=action)
    source, row, evidence = source_context(db, item.record_version_id, actor, action, current)
    from ..extraction.models import KnowledgeSource
    extra = db.scalars(select(KnowledgeSource).where(KnowledgeSource.item_id == item.id)).all()
    if extra:
        from types import SimpleNamespace
        merged = {e.id: e for e in evidence}
        version_ids = {source.id}
        for link in extra:
            v, r, ev = source_context(db, link.record_version_id, actor, action, current)
            if r.project_id != item.project_id:
                raise Problem(403, 'SOURCE_SCOPE_MISMATCH', '知识来源不属于此项目。')
            version_ids.add(v.id)
            merged.update({e.id:e for e in ev})
        source = SimpleNamespace(id=source.id, record_id=source.record_id, version=source.version,
            effective_fields=source.effective_fields, raw_fields=source.raw_fields, provenance=source.provenance,
            knowledge_item_id=item.id, source_version_ids=sorted(version_ids))
        evidence = list(merged.values())
    return source, row, evidence


def validate_card(db, card, version, actor, approving=False):
    if hasattr(version, 'knowledge_item_id'):
        _, row, evidence = item_source(db, db.get(KnowledgeItem, version.knowledge_item_id), actor, current=approving)
    elif hasattr(version, 'retrospective_revision_id'):
        from ..retrospectives.sources import context
        _, row, evidence = context(db, version.retrospective_revision_id, actor, current=approving)
    else:
        _, row, evidence = source_context(db, version.id, actor, current=approving)
    allowed = {e.id: e for e in evidence}
    for fact in card.facts:
        for ident in fact.evidence_ids:
            if ident not in allowed:
                raise Problem(422, 'INVALID_EVIDENCE_REFERENCE', '候选引用了不存在或不属于当前来源版本的证据，已拒绝保存。')
        if approving and not any(allowed[e].relation_confidence == 'anchored' and allowed[e].evidence_type in {'source_row', 'process_event', 'historical_row', 'task_snapshot'} for e in fact.evidence_ids):
            raise Problem(422, 'UNVERIFIED_FACT', '事实性内容须引用本版本明确锚定的来源行，候选图片不能单独证明事实。')
    if card.construction_points or any(f.source_quotes for f in card.facts):
        from ..extraction.grounding import check_quotes, evidence_map
        pool = evidence_map(db, evidence)
        for fact in card.facts:
            check_quotes(fact, pool, required=card.generation_mode == 'llm')
        for point in card.construction_points:
            check_quotes(point, pool, required=point.claim_kind == 'source_summary')
    if approving and any(s.verification_status == 'pending_verification' for s in card.standards):
        raise Problem(422, 'STANDARD_UNVERIFIED', '存在待核验依据，请核查或明确标为不采用，不能自动批准为有效标准。')
    if approving and db.scalar(select(QualityIssue.id).where(QualityIssue.record_version_id.in_(getattr(version, 'source_version_ids', [version.id])),
                     QualityIssue.severity == 'error', QualityIssue.status == 'open').limit(1)):
        raise Problem(422, 'BLOCKING_QUALITY_ISSUE', '来源仍存在未处理的阻断问题。')


def link_claims(db, revision, card):
    item = db.get(KnowledgeItem, revision.item_id)
    for n, fact in enumerate(card.facts):
        for evidence_id in set(fact.evidence_ids):
            target = {'retrospective_evidence_id': evidence_id} if item.retrospective_revision_id else {'evidence_id': evidence_id}
            db.add(KnowledgeEvidenceLink(revision_id=revision.id, claim_path=f'/facts/{n}/text', **target, relation_type=fact.source_kind))
    for n, point in enumerate(card.construction_points):
        for evidence_id in set(point.evidence_ids):
            target = {'retrospective_evidence_id': evidence_id} if item.retrospective_revision_id else {'evidence_id': evidence_id}
            db.add(KnowledgeEvidenceLink(revision_id=revision.id, claim_path=f'/construction_points/{n}/content', **target, relation_type=point.claim_kind))


def generation_preview(db, data, actor):
    if len(set(data.record_version_ids)) != len(data.record_version_ids):
        raise Problem(422, 'DUPLICATE_SOURCE_VERSION', '生成范围含重复来源版本。')
    items, projects = [], set()
    for ident in data.record_version_ids:
        version, row, evidence = source_context(db, ident, actor, 'knowledge.process', current=True)
        projects.add(row.project_id)
        items.append({'record_version_id': version.id, 'record_id': row.id, 'source_version': version.version,
                      'description': version.effective_fields.get('description'), 'project_id': row.project_id,
                      'quality_issue_count': len(version.issues), 'evidence_count': len(evidence)})
    if len(projects) != 1:
        raise Problem(422, 'MIXED_PROJECTS', '每次请选择同一项目的来源范围，便于统一授权和对账。')
    return {'items': items, 'count': len(items), 'project_id': next(iter(projects)), 'is_mock': True}


def submit_generation(data, actor, key, request_id):
    digest = fingerprint(data.model_dump())
    with Session.begin() as db:
        scope = generation_preview(db, data, actor)
        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:key,0))'), {'key': f'submit:{actor.id}:{key}'})
        prior = db.scalar(select(ProcessingRun).where(ProcessingRun.actor_id == actor.id, ProcessingRun.idempotency_key == key))
        if prior:
            if prior.input_hash != digest or prior.kind != 'knowledge_generation':
                raise Problem(409, 'IDEMPOTENCY_CONFLICT', '提交标识已用于不同请求。')
            return prior, True
        run = ProcessingRun(kind='knowledge_generation', object_id='generation', project_id=scope['project_id'],
                            actor_id=actor.id, title=f"知识候选生成 · {scope['count']}条", idempotency_key=key,
                            input_hash=digest, payload=data.model_dump())
        db.add(run)
        db.flush()
        run.object_id = run.id
        run.queue_job_id = enqueue(db, run.id)
        audit(db, actor, 'knowledge_generation_submitted', 'job', run.id, run.project_id, request_id)
        return run, False


def current_item(db, item_id, actor, action='knowledge.read', lock=False):
    query = select(KnowledgeItem).where(KnowledgeItem.id == item_id)
    item = db.scalar(query.with_for_update() if lock else query)
    if not item:
        raise Problem(404, 'NOT_FOUND', '知识卡不存在。')
    authorize(actor, action, item.project_id)
    if item.withdrawn_at:
        raise Problem(410, 'KNOWLEDGE_WITHDRAWN', '此知识已撤回。')
    revision = db.scalar(select(KnowledgeRevision).where(KnowledgeRevision.item_id == item.id,
                                                        KnowledgeRevision.version == item.current_revision))
    item_source(db, item, actor)
    if action == 'knowledge.read' and not (actor.can('knowledge.process', item.project_id) or actor.can('knowledge.review', item.project_id)):
        raise Problem(403, 'FORBIDDEN', '此为尚未发布的知识加工区，需要加工或审核权限。')
    return item, revision


def check_revision(item, revision, data):
    if item.row_version != data.row_version or revision.id != data.revision_id:
        raise Problem(409, 'VERSION_CONFLICT', '内容或状态已更新，请刷新后重新操作。')


def save_draft(item_id, data, actor, request_id):
    with Session.begin() as db:
        item, prior = current_item(db, item_id, actor, 'knowledge.process', lock=True)
        check_revision(item, prior, data)
        source, _, _ = item_source(db, item, actor, 'knowledge.process', current=True)
        if data.content.type != item.type:
            raise Problem(422, 'CARD_TYPE_MISMATCH', '知识类型不能在编辑时变更。')
        old_facts = {(f['text'], tuple(f['evidence_ids'])) for f in prior.content['facts']}
        for fact in data.content.facts:
            if (fact.text, tuple(fact.evidence_ids)) not in old_facts:
                fact.source_kind = 'human_annotation'
        validate_card(db, data.content, source, actor)
        item.current_revision += 1
        item.row_version += 1
        item.title = data.content.title
        revision = KnowledgeRevision(item_id=item.id, version=item.current_revision, content=data.content.model_dump(),
                                     template_version=prior.template_version, model_ref=prior.model_ref,
                                     state='draft', row_version=item.row_version)
        db.add(revision)
        db.flush()
        link_claims(db, revision, data.content)
        db.add(ReviewAction(object_id=item.id, revision_id=revision.id, object_version=revision.version,
                            action='edited', reviewer=actor.id, reason=data.reason))
        audit(db, actor, 'knowledge_edited', 'knowledge', item.id, item.project_id, request_id, revision.version)
        return item, revision


def transition(item_id, data, actor, action, request_id, review_id=None):
    with Session.begin() as db:
        item, revision = current_item(db, item_id, actor, 'knowledge.process' if action == 'submitted' else 'knowledge.review', lock=True)
        check_revision(item, revision, data)
        if review_id and review_id != revision.id:
            raise Problem(409, 'REVIEW_VERSION_CHANGED', '审核对象已不是当前版本。')
        source, _, _ = item_source(db, item, actor, current=True)
        allowed = {'submitted': {'draft', 'changes_requested'}, 'approved': {'pending_review'}, 'changes_requested': {'pending_review'}}
        if revision.state not in allowed[action]:
            raise Problem(409, 'INVALID_STATE', '当前状态不允许此操作。')
        if action == 'approved' and not data.evidence_checked:
            raise Problem(422, 'EVIDENCE_REVIEW_REQUIRED', '请明确确认已逐条核对事实与来源证据。')
        if action in {'submitted', 'approved'}:
            from .schemas import Card
            validate_card(db, Card.model_validate(revision.content), source, actor, approving=action == 'approved')
        revision.state = 'pending_review' if action == 'submitted' else action
        item.row_version += 1
        revision.row_version = item.row_version
        db.add(ReviewAction(object_id=item.id, revision_id=revision.id, object_version=revision.version,
                            action=action, reviewer=actor.id, reason=data.reason))
        audit(db, actor, 'knowledge_' + action, 'knowledge', item.id, item.project_id, request_id, revision.version)
        return item, revision
