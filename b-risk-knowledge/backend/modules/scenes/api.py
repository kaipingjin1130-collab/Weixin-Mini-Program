from typing import Literal
from fastapi import APIRouter, Depends, Request
from pydantic import Field, model_validator
from sqlalchemy import select, text
from ...auth import current_actor, authorize, Problem
from ...db import Session
from ...audit import record as audit
from ..knowledge.schemas import Strict
from ..extraction.schemas import Category
from .models import SceneRevision

router=APIRouter(prefix='/api/v1/scenes',tags=['场景配置'])
EVENTS = ('task_started','inspection_recorded','issue_created','rectification_submitted','review_rejected','review_accepted','task_completed')


class Step(Strict):
    event_type: Literal['task_started','inspection_recorded','issue_created','rectification_submitted','review_rejected','review_accepted','task_completed']
    name: str = Field(min_length=1,max_length=100)
    scope: Literal['task','issue']


class Payload(Strict):
    name: str = Field(min_length=1,max_length=100)
    categories: list[Category] = Field(min_length=1,max_length=100)
    steps: list[Step] = Field(min_length=1,max_length=20)
    compare_deadline: bool = False

    @model_validator(mode='after')
    def unique(self):
        if len({c.code for c in self.categories}) != len(self.categories) or len({s.event_type for s in self.steps}) != len(self.steps):
            raise ValueError('duplicate category or step')
        for step in self.steps:
            expected='issue' if step.event_type in {'issue_created','rectification_submitted','review_rejected','review_accepted'} else 'task'
            if step.scope != expected:raise ValueError('event scope mismatch')
        return self


class Save(Strict):
    project_id: str = Field(min_length=1,max_length=128)
    code: str = Field(pattern=r'^[a-z][a-z0-9_]{0,63}$')
    expected_version: int = Field(ge=0)
    payload: Payload


class Activate(Strict):
    expected_active_id: str | None


def dto(row):
    return {'id':row.id,'project_id':row.project_id,'code':row.code,'version':row.version,
            'payload':row.payload,'active':bool(row.active_scope)}


@router.get('')
def listing(project_id:str,actor=Depends(current_actor)):
    authorize(actor,'knowledge.read',project_id)
    with Session() as db:
        return {'items':[dto(r) for r in db.scalars(select(SceneRevision).where(SceneRevision.project_id==project_id).order_by(SceneRevision.code,SceneRevision.version.desc()))]}


@router.post('')
def save(data:Save,request:Request,actor=Depends(current_actor)):
    authorize(actor,'knowledge.process',data.project_id)
    with Session.begin() as db:
        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'),{'k':'scene:'+data.project_id+':'+data.code})
        previous=db.scalar(select(SceneRevision).where(SceneRevision.project_id==data.project_id,SceneRevision.code==data.code).order_by(SceneRevision.version.desc()).limit(1))
        if (previous.version if previous else 0)!=data.expected_version:raise Problem(409,'VERSION_CONFLICT','场景已更新，请刷新再保存。')
        row=SceneRevision(project_id=data.project_id,code=data.code,version=data.expected_version+1,payload=data.payload.model_dump())
        db.add(row);db.flush();audit(db,actor,'scene_revision_created','scene',row.id,data.project_id,request.state.request_id,row.version)
        return dto(row)


@router.post('/{ident}/activate')
def activate(ident:str,data:Activate,request:Request,actor=Depends(current_actor)):
    with Session.begin() as db:
        row=db.get(SceneRevision,ident)
        if not row:raise Problem(404,'NOT_FOUND','场景不存在。')
        authorize(actor,'knowledge.review',row.project_id)
        key=row.project_id+':'+row.code
        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'),{'k':'scene:'+key})
        active=db.scalar(select(SceneRevision).where(SceneRevision.active_scope==key))
        if (active.id if active else None)!=data.expected_active_id:raise Problem(409,'VERSION_CONFLICT','启用版本已变化，请刷新。')
        Payload.model_validate(row.payload)
        if active:active.active_scope=None;db.flush()
        row.active_scope=key
        audit(db,actor,'scene_revision_activated','scene',row.id,row.project_id,request.state.request_id,row.version)
        return dto(row)


def active_template(db,project,code):
    row=db.scalar(select(SceneRevision).where(SceneRevision.active_scope==project+':'+code))
    if not row:return None
    payload=Payload.model_validate(row.payload)
    return {'id':row.id,'code':code,'version':row.version,'name':payload.name,'categories':row.payload['categories'],
        'steps':row.payload['steps'],'deadline_rule':{'id':'accepted-by-due-v1','applicable_scenes':[code] if payload.compare_deadline else [],'completion_event':'review_accepted'}}
