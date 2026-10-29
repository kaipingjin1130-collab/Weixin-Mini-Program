from sqlalchemy import select
from ...queue import queue_app
from ...db import Session
from ...models import ProcessingRun,utcnow
from ...auth import Problem
from ..knowledge.tasks import actor_for
from ..extraction.llm import grade_case,require_config
from .models import TrainingAttempt,TrainingAnswer,QuestionRevision,TrainingQuestion
from .service import attempt_in,package_rows,recompute


@queue_app.task(name='b07.training_grading',queue='b01')
def grade_attempt(run_id:str):
    with Session.begin() as db:
        run=db.get(ProcessingRun,run_id)
        if not run or run.status=='succeeded':return
        run.status='running';run.error=None;run.attempts+=1;run.row_version+=1
        attempt_id=run.object_id;actor_id=run.actor_id;expected=run.payload['config_fingerprint']
    try:
        with Session() as db:
            actor=actor_for(db,actor_id,db.get(ProcessingRun,run_id));attempt,package=attempt_in(db,attempt_id,actor)
            rows=package_rows(db,package,actor)
            ids=list(db.scalars(select(TrainingAnswer.id).where(TrainingAnswer.attempt_id==attempt_id)))
        require_config(expected)
        for ident in ids:
            with Session() as db:
                answer=db.get(TrainingAnswer,ident);rev=db.get(QuestionRevision,answer.question_revision_id);parent=db.get(TrainingQuestion,rev.question_id)
                if parent.type!='case_answer' or answer.confirmed_score is not None or answer.suggested_score is not None:continue
                original_version=answer.row_version;value=answer.answer['text'];rubric=rev.rubric
            require_config(expected)
            score,message,model=grade_case(value,rubric)
            with Session.begin() as db:
                actor=actor_for(db,actor_id,db.get(ProcessingRun,run_id));attempt,package=attempt_in(db,attempt_id,actor,lock=True);package_rows(db,package,actor)
                answer=db.get(TrainingAnswer,ident)
                if answer.row_version!=original_version or answer.confirmed_score is not None:continue
                answer.suggested_score=score;answer.model_ref=model;answer.score_kind='model_suggestion';answer.row_version+=1
                answer.feedback={**answer.feedback,'message':message}
        with Session.begin() as db:
            run=db.get(ProcessingRun,run_id);attempt=db.get(TrainingAttempt,attempt_id)
            recompute(attempt,list(db.scalars(select(TrainingAnswer).where(TrainingAnswer.attempt_id==attempt_id))))
            run.status='succeeded';run.progress=100;run.row_version+=1;run.updated_at=utcnow()
    except Exception as exc:
        with Session.begin() as db:
            run=db.get(ProcessingRun,run_id);run.status='failed';run.row_version+=1;run.updated_at=utcnow()
            run.error=exc.message if isinstance(exc,Problem) else '后台评分中断，作答与已完成的分项评分保留。'
        raise
