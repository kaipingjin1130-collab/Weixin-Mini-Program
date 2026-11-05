"""Durable queue entry points for long-running retrospective/question generation."""
from fastapi import APIRouter, Depends, Request
from sqlalchemy import select, text
from ...auth import current_actor, authorize, Problem
from ...api_common import key_header
from ...db import Session
from ...models import ProcessingRun, utcnow
from ...job_service import fingerprint, enqueue
from ...queue import queue_app
from ..knowledge.service import source_context
from ..retrieval.publication import public_revision
from ..task_packages.service import package_in
from ..training.schemas import Generate
from ..retrospectives.schemas import Create
from .llm import require_config, metadata

router=APIRouter(prefix='/api/v1',tags=['后台模型生成'])
ACTIONS={'training_generation':'training.manage','retrospective_generation':'retrospective.generate'}


def scope(db,kind,data,actor):
    if kind=='training_generation':
        projects={public_revision(db,i,actor,allow_history=True,action='training.manage')[0].project_id for i in data.knowledge_revision_ids}
    elif data.mode=='task_process':
        projects={package_in(db,data.task_package_id,actor,'retrospective.generate',available=True).project_id}
    else:
        projects={source_context(db,i,actor,'retrospective.generate',current=True)[1].project_id for i in data.record_version_ids}
    if len(projects)!=1:raise Problem(422,'MIXED_PROJECTS','一次加工请选择同一项目的来源。')
    project=next(iter(projects));authorize(actor,ACTIONS[kind],project)
    return project


def submit(kind,data,actor,key):
    config=fingerprint(metadata(require_config())) if data.generation_mode=='llm' else None
    payload={'request':data.model_dump(),'config_fingerprint':config}
    digest=fingerprint(payload)
    with Session.begin() as db:
        project=scope(db,kind,data,actor)
        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'),{'k':'generate:'+actor.id+':'+key})
        prior=db.scalar(select(ProcessingRun).where(ProcessingRun.actor_id==actor.id,ProcessingRun.idempotency_key==key))
        if prior:
            if prior.kind!=kind or prior.input_hash!=digest:raise Problem(409,'IDEMPOTENCY_CONFLICT','同一提交标识对应不同任务。')
            return {'job_id':prior.id,'replayed':True}
        row=ProcessingRun(kind=kind,object_id='generation',project_id=project,actor_id=actor.id,
            title='培训题目生成' if kind=='training_generation' else '案例复盘生成',idempotency_key=key,input_hash=digest,payload=payload)
        db.add(row);db.flush();row.object_id=row.id;row.queue_job_id=enqueue(db,row.id)
        return {'job_id':row.id,'replayed':False}


@router.post('/training/generation-jobs',status_code=202)
def training(data:Generate,actor=Depends(current_actor),key=Depends(key_header)):
    return submit('training_generation',data,actor,key)


@router.post('/retrospective-generation-jobs',status_code=202)
def retrospective(data:Create,actor=Depends(current_actor),key=Depends(key_header)):
    return submit('retrospective_generation',data,actor,key)


@router.get('/model-generation-jobs/{ident}')
def detail(ident:str,actor=Depends(current_actor)):
    with Session() as db:
        row=db.get(ProcessingRun,ident)
        if not row or row.kind not in ACTIONS:raise Problem(404,'NOT_FOUND','生成任务不存在。')
        authorize(actor,ACTIONS[row.kind],row.project_id)
        return {'job_id':row.id,'status':row.status,'row_version':row.row_version,'error':row.error,
                'result':row.payload.get('result',{})}


@queue_app.task(name='b07.model_generation',queue='b01')
def generate(run_id:str):
    from ..knowledge.tasks import actor_for
    with Session.begin() as db:
        row=db.get(ProcessingRun,run_id)
        if not row or row.status=='succeeded':return
        row.status='running';row.error=None;row.attempts+=1;row.row_version+=1
    try:
        with Session() as db:
            row=db.get(ProcessingRun,run_id);actor=actor_for(db,row.actor_id,row)
            data=(Generate if row.kind=='training_generation' else Create).model_validate(row.payload['request'])
            scope(db,row.kind,data,actor)
            if row.payload['config_fingerprint']:require_config(row.payload['config_fingerprint'])
            kind=row.kind
        if kind=='training_generation':
            from ..training.service import generate as generate_content
        else:
            from ..retrospectives.service import generate as generate_content
        result=generate_content(data,actor,run_id)
        # Keep only navigation identifiers; detail endpoints recheck source state.
        refs={'items':[{'id':x['id']} for x in result['items']]} if kind=='training_generation' else {'id':result['id']}
        with Session.begin() as db:
            row=db.get(ProcessingRun,run_id)
            row.payload={**row.payload,'result':refs};row.status='succeeded';row.progress=100;row.row_version+=1;row.updated_at=utcnow()
    except Exception as exc:
        with Session.begin() as db:
            row=db.get(ProcessingRun,run_id);row.status='failed';row.row_version+=1;row.updated_at=utcnow()
            row.error=exc.message if isinstance(exc,Problem) else '模型生成失败，未自动批准或发布；请核对来源后重试。'
        raise
