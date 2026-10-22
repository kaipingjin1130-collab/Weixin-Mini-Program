from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy import select,exists
from ...db import Session
from ...auth import Actor,current_actor,authorize,Problem
from ...api_common import key_header
from ...pagination import paginate
from ..knowledge.schemas import VersionAction
from ..knowledge.models import ReviewAction
from .models import TrainingQuestion,QuestionRevision,LearningPackage,LearningPackageItem,TrainingAttempt,TrainingAnswer,TrainingScoreReview
from .schemas import Generate,Draft,Package,Publish,Start,Answer,ScoreReview,Feedback,LearnerQuestion
from . import service as s

router=APIRouter(prefix='/api/v1',tags=['B07 培训与学习记录'])


@router.post('/training/questions/generate')
def generate(data:Generate,request:Request,actor:Actor=Depends(current_actor)):
    return s.generate(data,actor,request.state.request_id)


@router.get('/training/questions')
def questions(actor:Actor=Depends(current_actor),state:str|None=None,type:str|None=None,scene_code:str|None=None,
              source_version:str|None=None,limit:int=Query(20,ge=1,le=100),cursor:str|None=None,review_only:bool=False):
    projects=actor.projects('training_review' if review_only else 'training_manage')
    if not projects:raise Problem(403,'FORBIDDEN','当前身份没有题库管理或审核权限。')
    with Session() as db:
        query=select(TrainingQuestion).join(QuestionRevision,(QuestionRevision.question_id==TrainingQuestion.id)&(QuestionRevision.version==TrainingQuestion.current_revision)).where(TrainingQuestion.project_id.in_(projects))
        if state=='published':query=query.where(exists(select(LearningPackageItem.id).join(LearningPackage).where(
            LearningPackageItem.question_revision_id==QuestionRevision.id,LearningPackage.state=='published')))
        elif state:query=query.where(QuestionRevision.state==state)
        if type:query=query.where(TrainingQuestion.type==type)
        if scene_code:query=query.where(TrainingQuestion.scene_code==scene_code)
        if source_version:query=query.where(QuestionRevision.source_versions.contains([source_version]))
        rows,after=paginate(db,query,TrainingQuestion,limit,cursor);output=[]
        for parent in rows:
            try:output.append(s.dto(*s.question(db,parent.id,actor,'training_review' if review_only else 'training_manage'),db=db))
            except Problem as exc:
                if exc.status not in {403,409,410}:raise
        return {'items':output,'next_cursor':after}


@router.get('/training/questions/{ident}')
def detail(ident:str,actor:Actor=Depends(current_actor)):
    with Session() as db:
        action='training_manage' if actor.projects('training_manage') else 'training_review'
        parent,rev=s.question(db,ident,actor,action)
        revisions=db.scalars(select(QuestionRevision).where(QuestionRevision.question_id==ident).order_by(QuestionRevision.version.desc())).all()
        actions=db.scalars(select(ReviewAction).where(ReviewAction.object_type=='question_revision',ReviewAction.object_id==ident).order_by(ReviewAction.created_at)).all()
        return {**s.dto(parent,rev,db),'content':{'stem':rev.stem,'options':rev.options,'answer':rev.answer,'rubric':rev.rubric},
            'revisions':[{'id':r.id,'version':r.version,'state':r.state,'stem':r.stem} for r in revisions],
            'review_actions':[{'version':a.object_version,'action':a.action,'reason':a.reason,'created_at':a.created_at} for a in actions]}


@router.patch('/training/questions/{ident}/draft')
def edit(ident:str,data:Draft,request:Request,actor:Actor=Depends(current_actor)):
    return s.edit(ident,data,actor,request.state.request_id)


@router.post('/training/questions/{ident}/submit-review')
def submit_question(ident:str,data:VersionAction,request:Request,actor:Actor=Depends(current_actor)):
    return s.transition(ident,data,actor,'submitted',request.state.request_id)


@router.get('/training/packages')
def packages(actor:Actor=Depends(current_actor),learner:bool=False,limit:int=Query(20,ge=1,le=100),cursor:str|None=None):
    projects=actor.projects('read' if learner else 'training_manage')
    if not projects:raise Problem(403,'FORBIDDEN','当前身份没有学习包管理权限。')
    with Session() as db:
        query=select(LearningPackage).where(LearningPackage.project_id.in_(projects))
        if learner:query=query.where(LearningPackage.state=='published')
        rows,after=paginate(db,query,LearningPackage,limit,cursor);output=[]
        for package in rows:
            try:
                if learner:s.learner_scope(package,actor)
                count=len(s.package_rows(db,package,actor));output.append(s.package_dto(package,count))
            except Problem as exc:
                if exc.status not in {403,409,410}:raise
        return {'items':output,'next_cursor':after}


@router.post('/training/packages')
def create_package(data:Package,request:Request,actor:Actor=Depends(current_actor)):
    return s.create_package(data,actor,request.state.request_id)


@router.get('/training/packages/{ident}')
def package_detail(ident:str,actor:Actor=Depends(current_actor)):
    with Session() as db:
        package=db.get(LearningPackage,ident)
        if not package:raise Problem(404,'NOT_FOUND','学习包不存在。')
        authorize(actor,'training_manage',package.project_id)
        rows=s.package_rows(db,package,actor)
        return {**s.package_dto(package,len(rows)),'questions':[{'position':row.position,**s.dto(parent,rev)} for row,parent,rev in rows]}


@router.post('/training/packages/{ident}/publish')
def publish(ident:str,data:Publish,request:Request,actor:Actor=Depends(current_actor)):
    return s.publish(ident,data,actor,request.state.request_id)


@router.post('/training/attempts')
def start(data:Start,request:Request,actor:Actor=Depends(current_actor),key=Depends(key_header)):
    return s.start(data,actor,key,request.state.request_id)


@router.get('/training/attempts')
def my_attempts(actor:Actor=Depends(current_actor),limit:int=Query(20,ge=1,le=100),cursor:str|None=None):
    with Session() as db:
        query=select(TrainingAttempt).join(LearningPackage).where(TrainingAttempt.learner_id==actor.id,LearningPackage.project_id.in_(actor.projects()))
        # paginate uses created_at; attempts use started_at, so stable ID/keyset order here.
        if cursor:query=query.where(TrainingAttempt.id>cursor)
        rows=db.scalars(query.order_by(TrainingAttempt.id).limit(limit+1)).all()
        return {'items':[{'id':a.id,'state':a.state,'result_state':a.result_state,'package_version_id':a.package_version_id,'started_at':a.started_at} for a in rows[:limit]],'next_cursor':rows[limit-1].id if len(rows)>limit else None}


@router.get('/training/attempts/{ident}')
def attempt(ident:str,actor:Actor=Depends(current_actor)):
    with Session() as db:
        attempt,package=s.attempt_in(db,ident,actor)
        if attempt.state=='submitted':return {'id':ident,'state':'submitted','package_title':package.title,'questions':[],'saved_answers':[]}
        rows=s.package_rows(db,package,actor)
        safe=[LearnerQuestion(question_id=p.id,revision_id=r.id,type=p.type,stem=r.stem,options=r.options,max_score=100,position=row.position).model_dump() for row,p,r in rows]
        saved=db.scalars(select(TrainingAnswer).where(TrainingAnswer.attempt_id==ident)).all()
        return {'id':ident,'state':attempt.state,'package_title':package.title,'package_version':package.version,'questions':safe,
            'saved_answers':[{'question_revision_id':a.question_revision_id,'answer':a.answer,'row_version':a.row_version} for a in saved]}


@router.put('/training/attempts/{ident}/answers/{question_id}')
def save(ident:str,question_id:str,data:Answer,request:Request,actor:Actor=Depends(current_actor)):
    return s.save_answer(ident,question_id,data,actor,request.state.request_id)


@router.post('/training/attempts/{ident}/submit')
def submit(ident:str,request:Request,actor:Actor=Depends(current_actor)):
    return s.submit(ident,actor,request.state.request_id)


@router.get('/training/attempts/{ident}/result')
def result(ident:str,teacher:bool=False,actor:Actor=Depends(current_actor)):
    with Session() as db:return s.result(db,ident,actor,teacher)


@router.post('/training/answers/{ident}/review-score')
def score_review(ident:str,data:ScoreReview,request:Request,actor:Actor=Depends(current_actor)):
    return s.confirm_score(ident,data,actor,request.state.request_id)


@router.post('/training/attempts/{ident}/feedback')
def feedback(ident:str,data:Feedback,actor:Actor=Depends(current_actor)):
    with Session.begin() as db:
        attempt,package=s.attempt_in(db,ident,actor,lock=True);s.package_rows(db,package,actor)
        if attempt.state!='submitted':raise Problem(409,'NOT_SUBMITTED','提交后再反馈。')
        for answer in db.scalars(select(TrainingAnswer).where(TrainingAnswer.attempt_id==ident)):
            answer.feedback={**answer.feedback,'learner_feedback':data.model_dump()}
        return {'id':ident,'saved':True}


@router.get('/training/results')
def results(actor:Actor=Depends(current_actor),project_id:str|None=None,limit:int=Query(20,ge=1,le=100),cursor:str|None=None):
    projects=actor.projects('training_manage')
    if not projects:raise Problem(403,'FORBIDDEN','当前身份没有教学结果查看权限。')
    if project_id:authorize(actor,'training_manage',project_id);projects=[project_id]
    with Session() as db:
        query=select(TrainingAttempt).join(LearningPackage).where(LearningPackage.project_id.in_(projects))
        if cursor:query=query.where(TrainingAttempt.id>cursor)
        rows=db.scalars(query.order_by(TrainingAttempt.id).limit(limit+1)).all();items=[]
        for a in rows[:limit]:
            package=db.get(LearningPackage,a.package_version_id)
            items.append({'id':a.id,'learner_id':a.learner_id,'title':package.title,'package_version':package.version,'project_id':package.project_id,
                'state':a.state,'result_state':a.result_state,'started_at':a.started_at,'submitted_at':a.submitted_at})
        return {'items':items,'next_cursor':rows[limit-1].id if len(rows)>limit else None}
