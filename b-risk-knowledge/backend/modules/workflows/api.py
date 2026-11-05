import json
from fastapi import APIRouter, Depends, Request, Query
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse, Response
from sqlalchemy import select, text
from ...auth import current_actor, authorize, Problem
from ...api_common import key_header
from ...db import Session
from ...pagination import paginate
from .schemas import Draft, Action, Kind
from .models import WorkRevision, WorkReview, WorkDependency
from . import service

router = APIRouter(prefix='/api/v1/workflows', tags=['隐患分析、指导书及知识成果'])


@router.get('/catalog')
def catalog(project_id: str, actor=Depends(current_actor)):
    from ...models import FileAsset
    from ..standards.models import StandardRevision
    from ..ingestion.models import SourceRecordVersion, SourceRecord
    authorize(actor, 'knowledge.read', project_id)
    if not any(actor.can(a, project_id) for a in ('knowledge.process','training.manage','knowledge.review','training.review')):
        raise Problem(403,'FORBIDDEN','资料选择需加工或教员权限。')
    with Session() as db:
        assets = db.scalars(select(FileAsset).where(FileAsset.project_id==project_id,FileAsset.org_id==actor.org_id,
            FileAsset.availability=='available').order_by(FileAsset.id).limit(200)).all()
        works = db.scalars(select(WorkRevision).where(WorkRevision.project_id==project_id,WorkRevision.org_id==actor.org_id,
            WorkRevision.state=='published',WorkRevision.kind!='question').order_by(WorkRevision.created_at.desc()).limit(200)).all()
        standards = db.scalars(select(StandardRevision).join(FileAsset,FileAsset.id==StandardRevision.source_asset_id).where(
            StandardRevision.project_id==project_id,FileAsset.org_id==actor.org_id,StandardRevision.state=='published').limit(200)).all()
        records = db.execute(select(SourceRecordVersion.id,SourceRecord.external_record_id).join(SourceRecord,SourceRecord.id==SourceRecordVersion.record_id)
            .join(FileAsset,FileAsset.id==SourceRecordVersion.provenance['input_asset_id'].astext).where(
                SourceRecord.project_id==project_id,FileAsset.org_id==actor.org_id,FileAsset.availability=='available',
                SourceRecord.current_version==SourceRecordVersion.version).limit(200)).all()
        return {'items': [{'kind':'asset','id':a.id,'label':'原件 '+a.id[:8]+' · '+a.mime_type} for a in assets] +
            [{'kind':'work','id':w.id,'label':w.title+' v'+str(w.version),'work_kind':w.kind} for w in works] +
            [{'kind':'standard','id':s.id,'label':s.title+' '+s.edition} for s in standards] +
            [{'kind':'record','id':i,'label':label} for i,label in records], 'limit_per_kind':200}


@router.post('')
def create(data: Draft, request: Request, actor=Depends(current_actor), key=Depends(key_header)):
    result = service.create(data, actor, key, request.state.request_id)
    return JSONResponse(status_code=200 if result['replayed'] else 201, content=jsonable_encoder(result))


@router.get('')
def listing(project_id: str, kind: Kind, actor=Depends(current_actor), view: str = Query('published', pattern='^(published|manage)$'),
            limit: int = Query(20, ge=1, le=100), cursor: str | None = None):
    authorize(actor, 'knowledge.read', project_id)
    managed = any(actor.can(service.permission(kind, a), project_id) for a in ('submit', 'approve', 'publish'))
    if (view == 'manage' or kind == 'question') and not managed:
        raise Problem(403, 'FORBIDDEN', '需要相应加工或审核权限。')
    with Session() as db:
        query = select(WorkRevision).where(WorkRevision.project_id == project_id, WorkRevision.org_id == actor.org_id, WorkRevision.kind == kind)
        if view == 'published':
            query = query.where(WorkRevision.state == 'published')
        rows, cursor = paginate(db, query, WorkRevision, limit, cursor)
        items = []
        for row in rows:
            try:
                service.guard(db, row, actor)
                available = True
            except Problem as e:
                if e.status not in {403, 404, 409, 410}:
                    raise
                available = False
            if available or view == 'manage':
                items.append({**service.dto(row, content=False), 'source_available': available})
        return {'items': items, 'next_cursor': cursor}


@router.get('/hazards/statistics')
def statistics(project_id: str, actor=Depends(current_actor), category: str | None = None, status: str | None = None,
               nature: str = Query('observed_hazard', pattern='^(observed_hazard|potential_source)$'), tag: str | None = None):
    with Session() as db:
        return service.aggregate(db, actor, project_id, category=category, status=status, nature=nature, tag=tag)


@router.get('/hazards/drilldown')
def drilldown(project_id: str, actor=Depends(current_actor), category: str | None = None, status: str | None = None,
              nature: str = Query('observed_hazard', pattern='^(observed_hazard|potential_source)$'), tag: str | None = None,
              limit: int = Query(20, ge=1, le=100), cursor: str | None = None):
    with Session() as db:
        query, _ = service.hazard_query(db, actor, project_id, category, status, nature, tag)
        rows, cursor = paginate(db, query, WorkRevision, limit, cursor)
        return {'items': [service.dto(row) for row in rows], 'next_cursor': cursor}


@router.get('/impacts')
def impacts(project_id: str, source_kind: str = Query(pattern='^(asset|record|standard|work)$'), source_id: str = Query(max_length=128),
            actor=Depends(current_actor)):
    authorize(actor, 'knowledge.process', project_id)
    with Session() as db:
        # Traverse only rows in this organization/project. Live guard is authoritative;
        # the graph reports versions to re-review without changing prior approvals.
        ids = db.execute(text('''WITH RECURSIVE affected(id) AS (
            SELECT d.revision_id FROM work_dependencies d JOIN work_revisions w ON w.id=d.revision_id
            WHERE d.source_kind=:kind AND d.source_id=:source AND w.org_id=:org AND w.project_id=:project
            UNION SELECT d.revision_id FROM work_dependencies d JOIN affected a ON d.source_id=a.id
            JOIN work_revisions w ON w.id=d.revision_id
            WHERE d.source_kind='work' AND w.org_id=:org AND w.project_id=:project
        ) SELECT id FROM affected'''), {'kind': source_kind, 'source': source_id, 'org': actor.org_id, 'project': project_id}).scalars().all()
        items = []
        for row in db.scalars(select(WorkRevision).where(WorkRevision.id.in_(ids))):
            if not service.can_manage(row, actor):
                continue
            try:
                service.guard(db, row, actor)
                availability = 'available_fixed_version'
            except Problem:
                availability = 'needs_review'
            items.append({**service.dto(row, False), 'impact': availability})
        return {'items': items, 'count': len(items), 'policy': '原审核记录保留；旧版本依赖失效时禁止继续使用，修改后重新审核。'}


@router.get('/{ident}')
def detail(ident: str, actor=Depends(current_actor)):
    with Session() as db:
        row = service.get(db, ident, actor)
        service.guard(db, row, actor)
        history = db.scalars(select(WorkReview).where(WorkReview.revision_id == ident).order_by(WorkReview.created_at, WorkReview.id)).all()
        deps = db.scalars(select(WorkDependency).where(WorkDependency.revision_id == ident)).all()
        return {**service.dto(row), 'missing': service.missing(row),
            'history': [{'action': h.action, 'reason': h.reason, 'row_version': h.row_version, 'created_at': h.created_at} for h in history],
            'dependencies': [{'kind': d.source_kind, 'id': d.source_id, 'fingerprint': d.fingerprint} for d in deps]}


@router.get('/{ident}/blueprint')
def blueprint(ident: str, actor=Depends(current_actor)):
    with Session() as db:
        row = service.get(db, ident, actor)
        authorize(actor, 'training.manage', row.project_id)
        service.guard(db, row, actor)
        if row.kind != 'guide' or row.state != 'published':
            raise Problem(409, 'GUIDE_NOT_PUBLISHED', '请先选择已发布指导书。')
        questions = db.scalars(select(WorkRevision).where(WorkRevision.org_id == actor.org_id,
            WorkRevision.project_id == row.project_id, WorkRevision.kind == 'question',
            WorkRevision.state == 'published', WorkRevision.content['guide_id'].astext == ident)).all()
        return {'guide_id': ident, 'guide_version': row.version, 'steps': [
            {'number': s['number'], 'title': s['title'], 'risks': s['risks'],
             'question_count': sum(q.content['step'] == s['number'] for q in questions),
             'points': [{'role':q.content['role'],'point':q.content['point'],'type':q.content['type'],
                        'level':q.content['cognitive_level'],'difficulty':q.content['difficulty']} for q in questions if q.content['step'] == s['number']]}
            for s in row.content['steps']], 'note':'统计已审核发布的固定版本题目；预设难度不是实测难度。'}


@router.post('/{ident}/training-bank')
def training_bank(ident: str, request: Request, actor=Depends(current_actor)):
    from ...job_service import fingerprint
    from ...audit import record as audit
    from ..training.models import TrainingQuestion, QuestionRevision
    from ..training.service import validate
    from ..training.schemas import Content
    with Session.begin() as db:
        row = service.get(db, ident, actor)
        authorize(actor, 'training.manage', row.project_id)
        service.guard(db, row, actor)
        if row.kind != 'question' or row.state != 'published':
            raise Problem(409, 'QUESTION_NOT_PUBLISHED', '仅可将已审核发布的指导书题目加入题库。')
        key = fingerprint(['guide-question', ident])
        service.lock(db, key)
        prior = db.scalar(select(TrainingQuestion).where(TrainingQuestion.generation_key == key))
        if prior:
            rev = db.scalar(select(QuestionRevision).where(QuestionRevision.question_id == prior.id, QuestionRevision.version == prior.current_revision))
            return {'id': prior.id, 'revision_id': rev.id, 'replayed': True}
        q = row.content
        kind = {'single':'single_choice','multiple':'multiple_choice','judgment':'single_choice','case':'case_answer'}[q['type']]
        options = [{'id':k,'text':v} for k,v in q['options'].items()]
        answers = q['answer']
        if q['type'] == 'judgment':
            options, answers = [{'id':'a','text':'正确'},{'id':'b','text':'错误'}], ['a' if q['answer'][0]=='true' else 'b']
        rubric = [{'point':p, 'keywords':[p], 'points':100/len(q['rubric'])} for p in q['rubric']] if kind=='case_answer' else []
        content = Content(stem=q['stem'],options=options,answer={'selected':answers} if kind!='case_answer' else {'text':'；'.join(answers)},rubric=rubric)
        validate(content,kind)
        parent = TrainingQuestion(generation_key=key, project_id=row.project_id, type=kind, scene_code='guide',
            scope={'project_id':row.project_id,'guide_id':q['guide_id'],'blueprint':{k:q[k] for k in ('role','step','risk','point','difficulty','cognitive_level')}})
        db.add(parent)
        db.flush()
        rev = QuestionRevision(question_id=parent.id,version=1,stem=content.stem,options=[o.model_dump() for o in content.options],
            answer=content.answer,rubric=[r.model_dump() for r in content.rubric],source_versions=['work:'+row.id],state='approved',model_ref='reviewed-guide-question-v1')
        db.add(rev)
        db.flush()
        audit(db,actor,'guide_question_banked','question',parent.id,row.project_id,request.state.request_id,1)
        return {'id':parent.id,'revision_id':rev.id,'replayed':False}


@router.post('/{ident}/actions')
def transition(ident: str, data: Action, request: Request, actor=Depends(current_actor)):
    return service.transition(ident, data, actor, request.state.request_id)


@router.get('/{ident}/export')
def export(ident: str, actor=Depends(current_actor)):
    with Session() as db:
        row = service.get(db, ident, actor)
        service.guard(db, row, actor)
        from .export import make_docx
        return Response(make_docx(row), media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            headers={'Content-Disposition': 'attachment; filename="knowledge-' + row.id + '.docx"'})
