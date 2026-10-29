import json
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, func
from ...auth import Actor, current_actor, authorize, Problem
from ...api_common import key_header
from ...db import Session
from ...models import ProcessingRun, FileAsset
from ...config import ROOT
from ...pagination import paginate
from ...audit import record as audit
from ..ingestion.models import SourceRecord, SourceRecordVersion
from ..ingestion.api import record_dto
from .models import QualityIssue, RecordAnnotation, KnowledgeItem, KnowledgeRevision, ReviewAction, GenerationEntry
from .schemas import GenerateInput, PatchIssue, PatchDraft, VersionAction
from .service import source_context, item_source, generation_preview, submit_generation, current_item, save_draft, transition

router = APIRouter(prefix='/api/v1', tags=['质量核查与知识加工'])


def curate_projects(actor):
    projects = [p for p in actor.projects('knowledge.read') if actor.can('knowledge.process', p) or actor.can('knowledge.review', p)]
    if not projects:
        raise Problem(403, 'FORBIDDEN', '当前身份没有质量加工或审核权限。')
    return projects


def item_dto(item, revision, db=None):
    published = False
    if db is not None:
        from ..retrieval.models import KnowledgeRelease, ReleaseEntry
        published = bool(db.scalar(select(ReleaseEntry.id).join(KnowledgeRelease).where(
            ReleaseEntry.knowledge_revision_id == revision.id, ReleaseEntry.state == 'ready',
            KnowledgeRelease.state == 'active', KnowledgeRelease.active_scope == item.project_id).limit(1)))
    return {'id': item.id, 'title': item.title, 'type': item.type, 'project_id': item.project_id,
            'record_version_id': item.record_version_id, 'retrospective_revision_id': item.retrospective_revision_id,
            'revision_id': revision.id, 'version': revision.version, 'object_type': 'knowledge_revision',
            'state': revision.state, 'row_version': item.row_version, 'model_ref': revision.model_ref,
            'schema_version': revision.schema_version, 'template_version': revision.template_version,
            'created_at': item.created_at, 'is_mock': revision.content.get('is_mock',True), 'generation_mode':revision.content.get('generation_mode','mock'), 'published': published}


@router.get('/quality/issues')
def issues(actor: Actor = Depends(current_actor), status: str | None = None, rule_code: str | None = None,
           project_id: str | None = None, limit: int = Query(30, ge=1, le=100), cursor: str | None = None):
    projects = curate_projects(actor)
    with Session() as db:
        base = select(QualityIssue).join(SourceRecordVersion).join(SourceRecord).where(
            SourceRecord.project_id.in_(projects), SourceRecord.current_version == SourceRecordVersion.version)
        base = base.join(FileAsset, FileAsset.id == SourceRecordVersion.provenance['input_asset_id'].astext).where(FileAsset.availability == 'available')
        if project_id:
            if project_id not in projects:
                raise Problem(403, 'FORBIDDEN', '没有此项目的加工权限。')
            base = base.where(SourceRecord.project_id == project_id)
        if status:
            base = base.where(QualityIssue.status == status)
        if rule_code:
            base = base.where(QualityIssue.rule_code == rule_code)
        rows, next_cursor = paginate(db, base, QualityIssue, limit, cursor)
        totals = db.execute(select(QualityIssue.rule_code, QualityIssue.status, func.count()).join(SourceRecordVersion).join(SourceRecord)
            .join(FileAsset, FileAsset.id == SourceRecordVersion.provenance['input_asset_id'].astext).where(FileAsset.availability == 'available',
            SourceRecord.project_id.in_(projects), SourceRecord.current_version == SourceRecordVersion.version).group_by(QualityIssue.rule_code, QualityIssue.status)).all()
        output = []
        for issue in rows:
            version = db.get(SourceRecordVersion, issue.record_version_id)
            row = db.get(SourceRecord, version.record_id)
            notes = db.scalars(select(RecordAnnotation).where(RecordAnnotation.issue_id == issue.id).order_by(RecordAnnotation.created_at)).all()
            output.append({'id': issue.id, 'record_version_id': version.id, 'record_id': row.id,
                'project_id': row.project_id, 'description': version.effective_fields.get('description'),
                'rule_code': issue.rule_code, 'field': issue.field, 'severity': issue.severity, 'message': issue.message,
                'status': issue.status, 'row_version': issue.row_version,
                'annotations': [{'value': n.value, 'reason': n.reason, 'source_kind': n.source_kind, 'created_at': n.created_at} for n in notes]})
        return {'items': output, 'next_cursor': next_cursor, 'summary': [{'rule_code': c, 'status': s, 'count': n} for c, s, n in totals]}


@router.patch('/quality/issues/{ident}')
def update_issue(ident: str, data: PatchIssue, request: Request, actor: Actor = Depends(current_actor)):
    with Session.begin() as db:
        issue = db.scalar(select(QualityIssue).where(QualityIssue.id == ident).with_for_update())
        if not issue:
            raise Problem(404, 'NOT_FOUND', '质量问题不存在。')
        version, row, _ = source_context(db, issue.record_version_id, actor, 'knowledge.process', current=True)
        if issue.row_version != data.row_version:
            raise Problem(409, 'VERSION_CONFLICT', '问题已被其他成员处理，请刷新。')
        issue.status, issue.row_version = data.status, issue.row_version + 1
        db.add(RecordAnnotation(record_version_id=version.id, issue_id=issue.id, field=issue.field,
                               value={'annotation': data.annotation, 'resolution_status': data.status}, actor=actor.id, reason=data.reason))
        audit(db, actor, 'quality_issue_updated', 'quality_issue', issue.id, row.project_id, request.state.request_id, issue.row_version)
        return {'id': issue.id, 'status': issue.status, 'row_version': issue.row_version}


@router.get('/knowledge/schema')
def schema(actor: Actor = Depends(current_actor), version: str = 'knowledge-card-v2'):
    if version not in {'knowledge-card-v1','knowledge-card-v2'}:
        raise Problem(422,'UNKNOWN_SCHEMA','未知知识结构版本。')
    return json.loads((ROOT/f'scene-packs/generic/{version}.schema.json').read_text(encoding='utf-8'))


@router.get('/knowledge/source-options')
def source_options(actor: Actor = Depends(current_actor), project_id: str | None = None,
                   limit: int = Query(20, ge=1, le=100), cursor: str | None = None):
    projects = [p for p in actor.projects('knowledge.process')]
    if not projects:
        raise Problem(403, 'FORBIDDEN', '当前身份不能生成候选。')
    with Session() as db:
        query = select(SourceRecord).where(SourceRecord.project_id.in_(projects))
        if project_id:
            authorize(actor, 'knowledge.process', project_id)
            query = query.where(SourceRecord.project_id == project_id)
        rows, next_cursor = paginate(db, query, SourceRecord, limit, cursor)
        output = []
        for row in rows:
            version = db.scalar(select(SourceRecordVersion).where(SourceRecordVersion.record_id == row.id, SourceRecordVersion.version == row.current_version))
            try:
                source_context(db, version.id, actor, 'knowledge.process')
            except Problem as exc:
                if exc.status == 410:
                    continue
                raise
            output.append({**record_dto(row, version), 'record_version_id': version.id})
        return {'items': output, 'next_cursor': next_cursor}


@router.post('/knowledge/generation-preview')
def preview_generation(data: GenerateInput, actor: Actor = Depends(current_actor)):
    with Session() as db:
        return generation_preview(db, data, actor)


@router.post('/knowledge/generation-jobs')
def generate(data: GenerateInput, request: Request, actor: Actor = Depends(current_actor), key=Depends(key_header)):
    run, replayed = submit_generation(data, actor, key, request.state.request_id)
    return JSONResponse(status_code=200 if replayed else 202, content=jsonable_encoder({'job_id': run.id, 'replayed': replayed, 'is_mock': True}))


@router.get('/knowledge/generation-jobs/{ident}')
def generation(ident: str, actor: Actor = Depends(current_actor)):
    with Session() as db:
        run = db.get(ProcessingRun, ident)
        if not run or run.kind != 'knowledge_generation':
            raise Problem(404, 'NOT_FOUND', '生成任务不存在。')
        authorize(actor, 'knowledge.process', run.project_id)
        entries = db.scalars(select(GenerationEntry).where(GenerationEntry.run_id == run.id)).all()
        counts = {'created': 0, 'skipped': 0, 'failed': 0}
        for entry in entries:
            counts[entry.outcome] += 1
        return {'job_id': run.id, 'status': run.status, 'progress': run.progress, 'error': run.error,
                'row_version': run.row_version, 'counts': counts, 'total': len(run.payload['record_version_ids']),
                'items': [{'record_version_id': e.record_version_id, 'outcome': e.outcome, 'item_id': e.item_id, 'error': e.error} for e in entries], 'is_mock': True}


@router.get('/knowledge')
def knowledge(actor: Actor = Depends(current_actor), state: str | None = None, project_id: str | None = None,
              limit: int = Query(20, ge=1, le=100), cursor: str | None = None):
    with Session() as db:
        query = select(KnowledgeItem).join(KnowledgeRevision, (KnowledgeRevision.item_id == KnowledgeItem.id) &
               (KnowledgeRevision.version == KnowledgeItem.current_revision)).where(KnowledgeItem.project_id.in_(actor.projects('knowledge.read')))
        if state:
            query = query.where(KnowledgeRevision.state == state)
        if project_id:
            authorize(actor, 'knowledge.read', project_id)
            query = query.where(KnowledgeItem.project_id == project_id)
        editable = [p for p in actor.projects('knowledge.read') if actor.can('knowledge.process', p) or actor.can('knowledge.review', p)]
        if not editable:
            raise Problem(403, 'FORBIDDEN', '此为知识加工区，学员请等待审核发布后的知识入口。')
        query = query.where(KnowledgeItem.project_id.in_(editable))
        rows, next_cursor = paginate(db, query, KnowledgeItem, limit, cursor)
        output = []
        for item in rows:
            try:
                item, revision = current_item(db, item.id, actor)
                output.append(item_dto(item, revision, db))
            except Problem as exc:
                if exc.status not in {403, 410}:
                    raise
        return {'items': output, 'next_cursor': next_cursor}


@router.get('/knowledge/{ident}')
def knowledge_detail(ident: str, actor: Actor = Depends(current_actor)):
    with Session() as db:
        item, revision = current_item(db, ident, actor)
        source, row, evidence = item_source(db, item, actor)
        revisions = db.scalars(select(KnowledgeRevision).where(KnowledgeRevision.item_id == item.id).order_by(KnowledgeRevision.version.desc())).all()
        actions = db.scalars(select(ReviewAction).where(ReviewAction.object_id == item.id).order_by(ReviewAction.created_at)).all()
        annotations = db.scalars(select(RecordAnnotation).where(RecordAnnotation.record_version_id == source.id)).all()
        source_versions = []
        if hasattr(source, 'source_version_ids'):
            for version_id in source.source_version_ids:
                v, record, _ = source_context(db,version_id,actor)
                source_versions.append({'record_version_id':v.id,'record_id':record.id,'version':v.version,'effective_fields':v.effective_fields})
        return {**item_dto(item, revision, db), 'content': revision.content,
                'source': {'record_id': row.id, 'kind': 'retrospective' if item.retrospective_revision_id else 'historical',
                           'version': source.version, 'current_version': source.version if item.retrospective_revision_id else row.current_version,
                           'versions': source_versions,
                           'effective_fields': source.effective_fields, 'raw_fields': source.raw_fields, 'provenance': source.provenance,
                           'evidence': [{'id': e.id, 'type': e.evidence_type, 'locator': e.locator, 'relation_confidence': e.relation_confidence} for e in evidence],
                           'annotations': [{'field': n.field, 'value': n.value, 'reason': n.reason, 'source_kind': n.source_kind} for n in annotations]},
                'revisions': [{'id': r.id, 'version': r.version, 'state': r.state, 'content': r.content, 'created_at': r.created_at} for r in revisions],
                'review_actions': [{'revision_id': a.revision_id, 'version': a.object_version, 'action': a.action,
                                    'reason': a.reason, 'reviewer': a.reviewer, 'created_at': a.created_at} for a in actions]}


@router.patch('/knowledge/{ident}/draft')
def patch_draft(ident: str, data: PatchDraft, request: Request, actor: Actor = Depends(current_actor)):
    return item_dto(*save_draft(ident, data, actor, request.state.request_id))


@router.post('/knowledge/{ident}/submit-review')
def submit_review(ident: str, data: VersionAction, request: Request, actor: Actor = Depends(current_actor)):
    return item_dto(*transition(ident, data, actor, 'submitted', request.state.request_id))


@router.get('/reviews')
def reviews(actor: Actor = Depends(current_actor), state: str = 'pending_review',
            limit: int = Query(20, ge=1, le=100), cursor: str | None = None, object_type: str = 'knowledge_revision'):
    if object_type == 'question_revision':
        from ..training.api import questions
        result = questions(actor=actor,state=state,type=None,scene_code=None,source_version=None,limit=limit,cursor=cursor,review_only=True)
        result['items'] = [{**i,'review_id':i['revision_id']} for i in result['items']]
        return result
    projects = actor.projects('retrospective.review' if object_type == 'retrospective_revision' else 'knowledge.review')
    if not projects:
        raise Problem(403, 'FORBIDDEN', '当前身份没有审核权限。')
    if object_type == 'retrospective_revision':
        from ..retrospectives.api import listing
        result = listing(actor=actor, mode=None, state=state, limit=limit, cursor=cursor, review_only=True)
        result['items'] = [{**i, 'review_id': i['revision_id'], 'type': 'retrospective_revision'} for i in result['items'] if i['project_id'] in projects]
        return result
    if object_type != 'knowledge_revision':
        raise Problem(422, 'UNKNOWN_REVIEW_TYPE', '未知审核对象类型。')
    with Session() as db:
        query = select(KnowledgeItem).join(KnowledgeRevision, (KnowledgeRevision.item_id == KnowledgeItem.id) &
                (KnowledgeRevision.version == KnowledgeItem.current_revision)).where(KnowledgeItem.project_id.in_(projects), KnowledgeRevision.state == state)
        rows, next_cursor = paginate(db, query, KnowledgeItem, limit, cursor)
        output = []
        for item in rows:
            try:
                current, revision = current_item(db, item.id, actor)
                output.append({**item_dto(current, revision, db), 'review_id': revision.id})
            except Problem as exc:
                if exc.status not in {403, 410}:
                    raise
        return {'items': output, 'next_cursor': next_cursor}


def retrospective_review(ident, data, actor, action, request_id):
    from ..retrospectives.models import RetrospectiveRevision
    from ..retrospectives.service import transition as retro_transition
    with Session() as db:
        revision = db.get(RetrospectiveRevision, ident)
        parent_id = revision.parent_id if revision else None
    if parent_id:
        return retro_transition(parent_id, data, actor, action, request_id, review_id=ident)
    return None


def training_review(ident, data, actor, action, request_id):
    from ..training.models import QuestionRevision
    from ..training.service import transition as question_transition
    with Session() as db:
        revision = db.get(QuestionRevision,ident)
        parent_id = revision.question_id if revision else None
    return question_transition(parent_id,data,actor,action,request_id,review_id=ident) if parent_id else None


def review_object(ident, actor):
    with Session() as db:
        revision = db.get(KnowledgeRevision, ident)
        if not revision:
            raise Problem(404, 'REVIEW_NOT_FOUND', '审核待办不存在。')
        item, current = current_item(db, revision.item_id, actor, 'knowledge.review')
        return item.id


@router.post('/reviews/{ident}/approve')
def approve(ident: str, data: VersionAction, request: Request, actor: Actor = Depends(current_actor)):
    result = training_review(ident,data,actor,'approved',request.state.request_id)
    if result is not None:return result
    result = retrospective_review(ident, data, actor, 'approved', request.state.request_id)
    if result is not None:
        return result
    return item_dto(*transition(review_object(ident, actor), data, actor, 'approved', request.state.request_id, review_id=ident))


@router.post('/reviews/{ident}/request-changes')
def request_changes(ident: str, data: VersionAction, request: Request, actor: Actor = Depends(current_actor)):
    result = training_review(ident,data,actor,'changes_requested',request.state.request_id)
    if result is not None:return result
    result = retrospective_review(ident, data, actor, 'changes_requested', request.state.request_id)
    if result is not None:
        return result
    return item_dto(*transition(review_object(ident, actor), data, actor, 'changes_requested', request.state.request_id, review_id=ident))
