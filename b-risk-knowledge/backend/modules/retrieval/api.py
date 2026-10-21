import json
import hashlib
from pathlib import Path
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import JSONResponse, FileResponse
from fastapi.encoders import jsonable_encoder
from jsonschema import Draft202012Validator, FormatChecker
from contracts.tools.contract_rules import validate as validate_contract
from sqlalchemy import select, and_, or_
from ...auth import Actor, current_actor, authorize, Problem
from ...db import Session
from ...api_common import key_header
from ...pagination import paginate
from ...models import FileAsset
from ...storage import asset_path
from ..ingestion.models import EvidenceItem
from ..knowledge.models import KnowledgeItem, KnowledgeRevision, KnowledgeEvidenceLink
from ..knowledge.service import source_context, item_source
from .models import KnowledgeRelease, SearchRun
from .schemas import CreateRelease, Activation, Withdrawal, SearchInput, Feedback
from .publication import create_release, activate, release_dto, active_release, withdraw, public_query, public_revision, card_dto
from .search import search, citation_for

router = APIRouter(prefix='/api/v1', tags=['B04 发布检索'])
integration_router = APIRouter(prefix='/integration/v1', tags=['B04 A集成（proposed / mock身份）'])


@router.post('/releases')
def submit(data: CreateRelease, request: Request, actor: Actor = Depends(current_actor), key=Depends(key_header)):
    release, replayed = create_release(data, actor, key, request.state.request_id)
    return JSONResponse(status_code=200 if replayed else 202, content=jsonable_encoder({'id': release.id, 'job_id': release.run_id, 'replayed': replayed}))


@router.get('/releases')
def releases(actor: Actor = Depends(current_actor), project_id: str | None = None,
             limit: int = Query(20, ge=1, le=100), cursor: str | None = None):
    with Session() as db:
        projects = actor.projects('audit')
        if not projects:
            raise Problem(403, 'FORBIDDEN', '发布管理需要审核权限。')
        if project_id:
            authorize(actor, 'audit', project_id)
            projects = [project_id]
        rows, after = paginate(db, select(KnowledgeRelease).where(KnowledgeRelease.active_scope.in_(projects)), KnowledgeRelease, limit, cursor)
        return {'items': [release_dto(db, row, actor) for row in rows], 'next_cursor': after,
                'active_ids': {p: (r.id if (r := active_release(db, p)) else None) for p in projects}}


@router.get('/releases/options')
def options(actor: Actor = Depends(current_actor), project_id: str = Query(...)):
    authorize(actor, 'audit', project_id)
    with Session() as db:
        rows = db.execute(select(KnowledgeItem, KnowledgeRevision).join(KnowledgeRevision,
            (KnowledgeRevision.item_id == KnowledgeItem.id) & (KnowledgeRevision.version == KnowledgeItem.current_revision)).where(
            KnowledgeItem.project_id == project_id, KnowledgeItem.withdrawn_at.is_(None), KnowledgeRevision.state == 'approved')
            .order_by(KnowledgeItem.id).limit(101)).all()
        items = []
        for item, revision in rows[:100]:
            try:
                item_source(db, item, actor)
                items.append({'id': item.id, 'revision_id': revision.id, 'title': revision.content['title'], 'version': revision.version, 'type': item.type})
            except Problem as exc:
                if exc.status not in {403, 410}:
                    raise
        return {'items': items, 'limit': 100, 'truncated': len(rows) > 100}


@router.get('/releases/{ident}')
def release_detail(ident: str, actor: Actor = Depends(current_actor)):
    with Session() as db:
        release = db.get(KnowledgeRelease, ident)
        if not release:
            raise Problem(404, 'NOT_FOUND', '发布批次不存在。')
        return release_dto(db, release, actor)


@router.post('/releases/{ident}/activate')
def activation(ident: str, data: Activation, request: Request, actor: Actor = Depends(current_actor)):
    result = activate(ident, data, actor, request.state.request_id)
    return {'id': result.id, 'state': result.state, 'row_version': result.row_version}


@router.post('/knowledge/{ident}/withdraw')
def withdrawal(ident: str, data: Withdrawal, request: Request, actor: Actor = Depends(current_actor)):
    return withdraw(ident, data, actor, request.state.request_id)


@router.get('/knowledge/library')
def library(actor: Actor = Depends(current_actor), project_id: str | None = None, scene_code: str | None = None,
            card_type: str | None = None, after_id: str = '', limit: int = Query(20, ge=1, le=100)):
    with Session() as db:
        rows = db.execute(public_query(actor, project_id, scene_code, card_type).where(KnowledgeRevision.id > after_id)
                          .order_by(KnowledgeRevision.id).limit(limit+1)).all()
        return {'items': [card_dto(*r) for r in rows[:limit]],
                'next_cursor': rows[limit-1][1].id if len(rows) > limit else None}


def published_detail(ident, actor, revision_id=None):
    with Session() as db:
        rows = db.execute(public_query(actor, include_history=True).where(KnowledgeItem.id == ident)
                          .order_by(KnowledgeRevision.version.desc(), KnowledgeRelease.published_at.desc())).all()
        row = next((r for r in rows if (r[1].id == revision_id if revision_id else r[2].state == 'active')), None)
        if not row:
            item = db.get(KnowledgeItem, ident)
            if item:
                authorize(actor, 'read', item.project_id)
                if item.withdrawn_at:
                    raise Problem(410, 'KNOWLEDGE_WITHDRAWN', '此知识已撤回。')
            raise Problem(404, 'NOT_PUBLISHED', '当前范围内没有可用的已发布版本。')
        item, revision, release = row
        public_revision(db, revision.id, actor, release.id, allow_history=bool(revision_id))
        versions = {r.id: {'id': r.id, 'version': r.version, 'state': 'published'} for _, r, _ in rows}
        return {**card_dto(*row), 'content': revision.content, 'row_version': item.row_version,
                'is_current_release': release.state == 'active', 'versions': list(versions.values()),
                'history_note': '历史仅包含曾启用发布的审核版本；未发布草稿不可见。历史证据仍需实时授权和来源可用。'}


@router.get('/published/knowledge/{ident}')
def public_detail(ident: str, revision_id: str | None = None, actor: Actor = Depends(current_actor)):
    return published_detail(ident, actor, revision_id)


@router.get('/published/evidence/{ident}')
def public_evidence(ident: str, revision_id: str, historical: bool = False, actor: Actor = Depends(current_actor)):
    with Session() as db:
        item, revision, source, evidence_rows, _ = public_revision(db, revision_id, actor, allow_history=historical)
        link = db.scalar(select(KnowledgeEvidenceLink).where(KnowledgeEvidenceLink.revision_id == revision.id,
                         or_(KnowledgeEvidenceLink.evidence_id == ident, KnowledgeEvidenceLink.retrospective_evidence_id == ident)).order_by(KnowledgeEvidenceLink.claim_path))
        if not link:
            raise Problem(404, 'NOT_FOUND', '此版本没有该证据引用。')
        citation = citation_for(db, ident, revision, actor, link.claim_path, allow_history=historical)
        evidence = next((e for e in evidence_rows if e.id == ident), None)
        if not evidence:
            raise Problem(410, 'EVIDENCE_UNAVAILABLE', '证据不可用。')
        asset = db.get(FileAsset, evidence.asset_id) if evidence.asset_id else None
        # Minimal anchored row content; never expose the whole import file or other rows.
        return {**citation, 'description': evidence.text if item.retrospective_revision_id else source.effective_fields.get('description'), 'source_version': source.version,
                'type': evidence.evidence_type, 'has_image': bool(asset and asset.mime_type.startswith('image/')),
                'is_mock': True, 'note': '模拟证据示意图，非真实现场照片。' if asset and asset.mime_type.startswith('image/') else '结构化来源行；当前未提供原报告附件。'}


@router.get('/published/evidence/{ident}/content')
def public_evidence_content(ident: str, revision_id: str, historical: bool = False, actor: Actor = Depends(current_actor)):
    # Revalidate the publication and source on every binary request. The generic
    # assets endpoint is never used to bypass this citation-specific permission.
    public_evidence(ident, revision_id, historical, actor)
    with Session() as db:
        from ..retrospectives.models import RetrospectiveEvidence
        evidence = db.get(EvidenceItem, ident) or db.get(RetrospectiveEvidence, ident)
        asset = db.get(FileAsset, evidence.asset_id) if evidence and evidence.asset_id else None
        if not asset or not asset.mime_type.startswith('image/'):
            raise Problem(422, 'NO_PREVIEW', '此证据只提供结构化来源行，没有可预览图片。')
        authorize(actor, 'read', asset.project_id)
        if asset.availability != 'available':
            raise Problem(410, 'ASSET_UNAVAILABLE', '图片已撤回或不可用。')
        path = asset_path(asset.storage_key)
        if not path.is_file():
            raise Problem(404, 'ASSET_MISSING', '图片文件缺失。')
        if path.stat().st_size != asset.size or hashlib.sha256(path.read_bytes()).hexdigest() != asset.sha256:
            raise Problem(409, 'ASSET_INTEGRITY_ERROR', '图片内容校验失败。')
        return FileResponse(path, media_type=asset.mime_type, filename=path.name)


@router.post('/search')
def internal_search(data: SearchInput, actor: Actor = Depends(current_actor)):
    response, results, elapsed = search(data, actor)
    return {**response, 'results': results, 'latency_ms': elapsed, 'answer_method': 'extractive', 'is_mock': True}


@router.post('/search/{ident}/feedback')
def feedback(ident: str, data: Feedback, actor: Actor = Depends(current_actor)):
    with Session.begin() as db:
        run = db.get(SearchRun, ident)
        if not run:
            raise Problem(404, 'NOT_FOUND', '查询记录不存在。')
        authorize(actor, 'read', run.project_id)
        if run.actor_id != actor.id:
            raise Problem(403, 'FORBIDDEN', '只能反馈自己的查询。')
        run.feedback = data.model_dump()
        return {'id': run.id, 'saved': True}


CONTRACT_ROOT = Path(__file__).resolve().parents[3] / 'contracts'
QUERY_VALIDATOR = Draft202012Validator(json.loads((CONTRACT_ROOT/'knowledge-query.schema.json').read_text(encoding='utf-8')), format_checker=FormatChecker())
RESPONSE_VALIDATOR = Draft202012Validator(json.loads((CONTRACT_ROOT/'knowledge-response.schema.json').read_text(encoding='utf-8')), format_checker=FormatChecker())


@integration_router.post('/knowledge/query')
async def integration_query(request: Request, actor: Actor = Depends(current_actor)):
    try:
        data = await request.json()
    except ValueError:
        raise Problem(422, 'VALIDATION_ERROR', '请求须为合法JSON。')
    errors, _ = validate_contract('knowledge-query.schema.json', data)
    if errors:
        raise Problem(422, 'VALIDATION_ERROR', '请求不符合B00知识查询合同。')
    # B03's original generic pack is the internal alias of B00 general_inspection.
    scene = 'generic' if data['scene_code'] == 'general_inspection' else data['scene_code']
    payload = SearchInput(project_id=data['project_id'], question=data['question'], scene_code=scene,
        object_type=data['context']['object_type'], stage=data['context']['stage'],
        conditions=data['context']['conditions'], limit=data['limit'])
    response, _, _ = search(payload, actor, data['output_types'])
    errors, _ = validate_contract('knowledge-response.schema.json', response)
    if errors:
        raise Problem(503, 'RESPONSE_CONTRACT_ERROR', '检索响应未通过合同校验。')
    return response
