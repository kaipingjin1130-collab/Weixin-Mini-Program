from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy import select
from ...db import Session
from ...auth import Actor, current_actor, Problem
from ...pagination import paginate
from ..knowledge.models import ReviewAction
from ..knowledge.schemas import VersionAction
from .models import Retrospective, RetrospectiveRevision, RetrospectiveEvidence, ExperienceConversion
from .schemas import Create, Draft, Convert
from .service import generate, current, dto, edit, transition, convert
from .sources import guard_sources
from .engine import TEMPLATE

router = APIRouter(prefix='/api/v1/retrospectives', tags=['B06 过程复盘与经验'])


@router.get('/template')
def template(actor: Actor = Depends(current_actor)):
    return {**TEMPLATE, 'is_mock': True}


@router.post('')
def create(data: Create, request: Request, actor: Actor = Depends(current_actor)):
    return generate(data, actor, request.state.request_id)


@router.get('')
def listing(actor: Actor = Depends(current_actor), mode: str | None = None, state: str | None = None,
            limit: int = Query(20, ge=1, le=100), cursor: str | None = None, review_only: bool = False):
    projects = actor.projects('retrospective.review' if review_only else 'retrospective.read')
    if not projects:
        raise Problem(403, 'FORBIDDEN', '复盘加工区需要加工或审核权限。')
    with Session() as db:
        query = select(Retrospective).join(RetrospectiveRevision, (RetrospectiveRevision.parent_id == Retrospective.id) & (RetrospectiveRevision.version == Retrospective.current_revision)).where(Retrospective.project_id.in_(projects))
        if mode:
            query = query.where(Retrospective.mode == mode)
        if state:
            query = query.where(RetrospectiveRevision.state == state)
        rows, after = paginate(db, query, Retrospective, limit, cursor)
        output = []
        for parent in rows:
            try:
                output.append(dto(*current(db, parent.id, actor, 'retrospective.review' if review_only else 'retrospective.read')))
            except Problem as exc:
                if exc.status not in {403, 410}:
                    raise
        return {'items': output, 'next_cursor': after}


@router.get('/{ident}')
def detail(ident: str, revision_id: str | None = None, actor: Actor = Depends(current_actor)):
    with Session() as db:
        parent, revision = current(db, ident, actor)
        if revision_id:
            selected = db.get(RetrospectiveRevision, revision_id)
            if not selected or selected.parent_id != ident:
                raise Problem(404, 'NOT_FOUND', '复盘版本不存在。')
            guard_sources(db, selected, actor)
            revision = selected
        evidence = list(db.scalars(select(RetrospectiveEvidence).where(RetrospectiveEvidence.revision_id == revision.id)))
        versions = db.scalars(select(RetrospectiveRevision).where(RetrospectiveRevision.parent_id == ident).order_by(RetrospectiveRevision.version.desc())).all()
        actions = db.scalars(select(ReviewAction).where(ReviewAction.object_type == 'retrospective_revision', ReviewAction.object_id == ident).order_by(ReviewAction.created_at)).all()
        drafts = db.scalars(select(ExperienceConversion).where(ExperienceConversion.revision_id == revision.id)).all()
        return {**dto(parent, revision), 'is_current': revision.version == parent.current_revision, 'summary': revision.summary,
            'timeline': revision.timeline, 'findings': revision.findings, 'suggestions': revision.suggestions,
            'evidence': [{'id': e.id, 'reference': e.reference, 'type': e.kind, 'locator': e.locator, 'text': e.text,
                'asset_id': e.asset_id} for e in evidence],
            'revisions': [{'id': r.id, 'version': r.version, 'state': r.state, 'sources': r.sources, 'created_at': r.created_at} for r in versions],
            'review_actions': [{'action': a.action, 'reason': a.reason, 'version': a.object_version, 'created_at': a.created_at} for a in actions],
            'draft_ids': [d.item_id for d in drafts]}


@router.patch('/{ident}/draft')
def patch(ident: str, data: Draft, request: Request, actor: Actor = Depends(current_actor)):
    return edit(ident, data, actor, request.state.request_id)


@router.post('/{ident}/submit-review')
def submit(ident: str, data: VersionAction, request: Request, actor: Actor = Depends(current_actor)):
    return transition(ident, data, actor, 'submitted', request.state.request_id)


@router.post('/{ident}/publish-experiences')
def experiences(ident: str, data: Convert, request: Request, actor: Actor = Depends(current_actor)):
    return convert(ident, data, actor, request.state.request_id)
