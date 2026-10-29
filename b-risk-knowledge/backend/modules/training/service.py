from copy import deepcopy
from sqlalchemy import select, text
from ...db import Session
from ...auth import authorize, Problem
from ...models import utcnow,ProcessingRun
from ...job_service import fingerprint,enqueue
from ...audit import record as audit
from ..knowledge.models import ReviewAction
from ..knowledge.service import check_revision
from ..retrieval.publication import public_revision
from ..retrieval.adapters import terms
from .models import TrainingQuestion, QuestionRevision, LearningPackage, LearningPackageItem, TrainingAttempt, TrainingAnswer, TrainingScoreReview
from .schemas import Content, LearnerQuestion


def sources(db, revision, actor, action='training.learn'):
    output=[]
    for ident in revision.source_versions:
        output.append(public_revision(db, ident, actor, allow_history=True, action=action))
    return output


def question(db, ident, actor, action='training.manage', lock=False):
    q=select(TrainingQuestion).where(TrainingQuestion.id==ident)
    parent=db.scalar(q.with_for_update() if lock else q)
    if not parent:raise Problem(404,'NOT_FOUND','题目不存在。')
    authorize(actor,action,parent.project_id)
    revision=db.scalar(select(QuestionRevision).where(QuestionRevision.question_id==ident,QuestionRevision.version==parent.current_revision))
    sources(db,revision,actor,action)
    return parent,revision


def validate(content, kind):
    ids=[o.id for o in content.options]
    if kind in {'single_choice','multiple_choice'}:
        selected=content.answer.get('selected',[])
        if len(ids)<2 or len(set(ids))!=len(ids) or not isinstance(selected,list) or not selected or not all(isinstance(v,str) for v in selected) or not set(selected)<=set(ids) or len(set(selected))!=len(selected) or (kind=='single_choice' and len(selected)!=1) or content.rubric:
            raise Problem(422,'INVALID_QUESTION','客观题须有不重复选项和合法答案；单选题仅一个正确选项。')
    elif content.options or not content.rubric or sum(r.points for r in content.rubric)!=100:
        raise Problem(422,'INVALID_RUBRIC','案例问答不设选项，评分要点分值之和必须为100。')


def dto(parent,revision,db=None):
    published=bool(db.scalar(select(LearningPackageItem.id).join(LearningPackage).where(
        LearningPackageItem.question_revision_id==revision.id,LearningPackage.state=='published').limit(1))) if db is not None else False
    return {'id':parent.id,'type':parent.type,'title':revision.stem[:200],'stem':revision.stem,'project_id':parent.project_id,
        'scene_code':parent.scene_code,'revision_id':revision.id,'version':revision.version,'row_version':parent.row_version,
        'state':revision.state,'source_versions':revision.source_versions,'model_ref':revision.model_ref,'is_mock':True,
        'object_type':'question_revision','published':published}


def generate(data,actor,request_id):
    if len(set(data.knowledge_revision_ids))!=len(data.knowledge_revision_ids) or len(set(data.types))!=len(data.types):
        raise Problem(422,'DUPLICATE_INPUT','来源和题型不能重复。')
    with Session.begin() as db:
        prepared=[]
        for ident in data.knowledge_revision_ids:
            item,revision,_,_,_=public_revision(db,ident,actor,allow_history=True,action='training.manage')
            authorize(actor,'training.manage',item.project_id)
            prepared.append((item,revision))
        result=[]
        for item,source in prepared:
            facts=source.content['facts']
            for kind in data.types:
                if kind=='multiple_choice' and len(facts)<2:
                    raise Problem(422,'INSUFFICIENT_QUESTION_EVIDENCE','多选演示题至少需要两条审核事实，请选择复盘经验等更完整来源。')
                key=fingerprint({'source':source.id,'kind':kind,'template':'local-question-v1'})
                db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'),{'k':'question:'+key})
                prior=db.scalar(select(TrainingQuestion).where(TrainingQuestion.generation_key==key))
                if prior:
                    result.append({**dto(*question(db,prior.id,actor)),'replayed':True});continue
                selected=facts[:2] if kind=='multiple_choice' else facts[:1]
                options=[{'id':chr(97+n),'text':f['text'][:2000]} for n,f in enumerate(selected)]
                if kind!='case_answer':
                    options += [{'id':chr(97+len(options)),'text':'仅凭这份记录即可证明现场不存在任何风险。'}, {'id':chr(98+len(options)),'text':'没有相关记录就能断定现场没有执行。'}]
                rubric=[]
                if kind=='case_answer':
                    chosen=facts[:2]
                    for n,f in enumerate(chosen):
                        keywords=[s for s in terms(f['text']) if len(s)>=2 and s not in {'模拟','记录','来源','有记录'}][:5] or [f['text'][:20]]
                        rubric.append({'point':f['text'][:2000],'keywords':keywords,'points':100/len(chosen)})
                stem=('依据已审核来源，选择记录中实际记载的一项。' if kind=='single_choice' else '依据已审核来源，选出记录中记载的所有要点。' if kind=='multiple_choice' else '概括此案例记录中的风险或检查要点；只根据材料回答，不推断未记录的处置。')+'\n案例：'+source.content['title']
                content=Content(stem=stem,options=[] if kind=='case_answer' else options,
                    answer={'selected':[o['id'] for o in options[:len(selected)]]} if kind!='case_answer' else {'text':'；'.join(f['text'] for f in facts[:2])},rubric=rubric)
                validate(content,kind)
                parent=TrainingQuestion(generation_key=key,project_id=item.project_id,type=kind,scene_code=item.scene_code,scope={'project_id':item.project_id})
                db.add(parent);db.flush()
                revision=QuestionRevision(question_id=parent.id,version=1,stem=content.stem,options=[o.model_dump() for o in content.options],
                    answer=content.answer,rubric=[r.model_dump() for r in content.rubric],source_versions=[source.id],model_ref='local-question-template-v1')
                db.add(revision);db.flush()
                audit(db,actor,'training_question_generated','question',parent.id,item.project_id,request_id,1)
                result.append({**dto(parent,revision),'replayed':False})
        return {'items':result,'generation_mode':'mock_template','note':'题目来自本地演示模板，仍需教员逐题核对后审核。'}


def edit(ident,data,actor,request_id):
    with Session.begin() as db:
        parent,prior=question(db,ident,actor,lock=True)
        check_revision(parent,prior,data);validate(data.content,parent.type)
        parent.current_revision+=1;parent.row_version+=1
        revision=QuestionRevision(question_id=ident,version=parent.current_revision,stem=data.content.stem,
            options=[o.model_dump() for o in data.content.options],answer=data.content.answer,rubric=[r.model_dump() for r in data.content.rubric],
            source_versions=deepcopy(prior.source_versions),model_ref=prior.model_ref,row_version=parent.row_version)
        db.add(revision);db.flush()
        db.add(ReviewAction(object_type='question_revision',object_id=ident,revision_id=revision.id,object_version=revision.version,action='edited',reviewer=actor.id,reason=data.reason))
        audit(db,actor,'training_question_edited','question',ident,parent.project_id,request_id,revision.version)
        return dto(parent,revision)


def transition(ident,data,actor,action,request_id,review_id=None):
    with Session.begin() as db:
        parent,revision=question(db,ident,actor,'training.manage' if action=='submitted' else 'training.review',lock=True)
        check_revision(parent,revision,data)
        if review_id and review_id!=revision.id:raise Problem(409,'REVIEW_VERSION_CHANGED','当前题目版本已变化。')
        if revision.state not in {'submitted':{'draft','changes_requested'},'approved':{'pending_review'},'changes_requested':{'pending_review'}}[action]:
            raise Problem(409,'INVALID_STATE','当前题目状态不允许此操作。')
        if action=='approved' and not data.evidence_checked:raise Problem(422,'EVIDENCE_REVIEW_REQUIRED','请确认题面、答案和评分要点符合来源。')
        validate(Content(stem=revision.stem,options=revision.options,answer=revision.answer,rubric=revision.rubric),parent.type)
        revision.state='pending_review' if action=='submitted' else action
        parent.row_version+=1;revision.row_version=parent.row_version
        db.add(ReviewAction(object_type='question_revision',object_id=ident,revision_id=revision.id,object_version=revision.version,action=action,reviewer=actor.id,reason=data.reason))
        audit(db,actor,'training_question_'+action,'question',ident,parent.project_id,request_id,revision.version)
        return dto(parent,revision)


def package_rows(db,package,actor,current=False,action='training.learn'):
    authorize(actor,action,package.project_id)
    rows=db.scalars(select(LearningPackageItem).where(LearningPackageItem.package_version_id==package.id).order_by(LearningPackageItem.position)).all()
    output=[]
    for row in rows:
        revision=db.get(QuestionRevision,row.question_revision_id);parent=db.get(TrainingQuestion,revision.question_id)
        if parent.project_id!=package.project_id or revision.state!='approved' or (current and parent.current_revision!=revision.version):
            raise Problem(409,'QUESTION_NOT_APPROVED','学习包题目不是可用的已审核版本。')
        sources(db,revision,actor,action);output.append((row,parent,revision))
    if not output:raise Problem(409,'EMPTY_PACKAGE','学习包没有题目。')
    return output


def create_package(data,actor,request_id):
    authorize(actor,'training.manage',data.project_id)
    if len(set(data.question_revision_ids))!=len(data.question_revision_ids):raise Problem(422,'DUPLICATE_QUESTION','学习包题目不能重复。')
    with Session.begin() as db:
        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'),{'k':'learning-package:'+data.package_key})
        existing=db.scalars(select(LearningPackage).where(LearningPackage.package_key==data.package_key)).all()
        if any(p.project_id!=data.project_id for p in existing):raise Problem(403,'PACKAGE_SCOPE_CHANGED','学习包组不能跨项目。')
        if any(p.version==data.version for p in existing):raise Problem(409,'PACKAGE_VERSION_EXISTS','该学习包版本已存在。')
        package=LearningPackage(title=data.title,package_key=data.package_key,version=data.version,project_id=data.project_id,role_scope=data.role_scope)
        db.add(package);db.flush()
        for n,ident in enumerate(data.question_revision_ids):
            rev=db.get(QuestionRevision,ident)
            if not rev:raise Problem(404,'QUESTION_NOT_FOUND','题目版本不存在。')
            db.add(LearningPackageItem(package_version_id=package.id,question_revision_id=ident,position=n+1))
        db.flush();package_rows(db,package,actor,current=True,action='training.manage')
        audit(db,actor,'learning_package_created','learning_package',package.id,package.project_id,request_id,package.version)
        return package_dto(package,len(data.question_revision_ids))


def package_dto(package,count):
    return {k:getattr(package,k) for k in ['id','package_key','version','title','project_id','role_scope','state','row_version']}|{'question_count':count,'is_mock':True}


def publish(ident,data,actor,request_id):
    with Session.begin() as db:
        package=db.scalar(select(LearningPackage).where(LearningPackage.id==ident).with_for_update())
        if not package:raise Problem(404,'NOT_FOUND','学习包不存在。')
        authorize(actor,'training.manage',package.project_id)
        if package.row_version!=data.row_version:raise Problem(409,'VERSION_CONFLICT','学习包状态已变化。')
        rows=package_rows(db,package,actor,current=True,action='training.manage')
        if package.state!='published':package.state='published';package.row_version+=1
        audit(db,actor,'learning_package_published','learning_package',ident,package.project_id,request_id,package.version)
        return package_dto(package,len(rows))


def learner_scope(package,actor):
    authorize(actor,'training.learn',package.project_id)
    if actor.permissions is None and not set(package.role_scope)&actor.roles.get(package.project_id,set()):raise Problem(403,'ROLE_SCOPE_DENIED','当前项目角色不在学习包适用范围内。')
    if package.state!='published':raise Problem(409,'PACKAGE_NOT_PUBLISHED','学习包尚未发布。')


def start(data,actor,key,request_id):
    with Session.begin() as db:
        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'),{'k':'attempt:'+actor.id+':'+key})
        package=db.get(LearningPackage,data.package_version_id)
        if not package:raise Problem(404,'NOT_FOUND','学习包不存在。')
        learner_scope(package,actor);package_rows(db,package,actor)
        prior=db.scalar(select(TrainingAttempt).where(TrainingAttempt.learner_id==actor.id,TrainingAttempt.idempotency_key==key))
        if prior:
            if prior.package_version_id!=package.id or prior.grading_mode!=data.grading_mode:raise Problem(409,'IDEMPOTENCY_CONFLICT','同一开始标识用于了不同练习。')
            return {'id':prior.id,'replayed':True}
        attempt=TrainingAttempt(learner_id=actor.id,package_version_id=package.id,idempotency_key=key,grading_mode=data.grading_mode)
        db.add(attempt);db.flush()
        audit(db,actor,'training_attempt_started','training_attempt',attempt.id,package.project_id,request_id)
        return {'id':attempt.id,'replayed':False}


def attempt_in(db,ident,actor,lock=False,teacher=False):
    q=select(TrainingAttempt).where(TrainingAttempt.id==ident)
    attempt=db.scalar(q.with_for_update() if lock else q)
    if not attempt:raise Problem(404,'NOT_FOUND','学习记录不存在。')
    package=db.get(LearningPackage,attempt.package_version_id)
    authorize(actor,'training.manage' if teacher else 'training.learn',package.project_id)
    if not teacher and attempt.learner_id!=actor.id:raise Problem(403,'NOT_YOUR_ATTEMPT','不能读取其他成员的学习记录。')
    if not teacher:learner_scope(package,actor)
    return attempt,package


def save_answer(ident,question_id,data,actor,request_id):
    with Session.begin() as db:
        attempt,package=attempt_in(db,ident,actor,lock=True)
        if attempt.state!='in_progress':raise Problem(409,'ATTEMPT_LOCKED','本次作答已提交，不能修改。')
        rows=package_rows(db,package,actor)
        target=next((r for r in rows if r[1].id==question_id),None)
        if not target:raise Problem(404,'QUESTION_NOT_IN_PACKAGE','此题不在固定学习包内。')
        _,parent,revision=target
        ids={o['id'] for o in revision.options}
        if len(set(data.selected))!=len(data.selected) or not set(data.selected)<=ids or (parent.type=='single_choice' and len(data.selected)>1) or (parent.type=='case_answer' and data.selected) or (parent.type!='case_answer' and data.text):
            raise Problem(422,'INVALID_ANSWER','作答类型或选项不符合题目。')
        answer=db.scalar(select(TrainingAnswer).where(TrainingAnswer.attempt_id==ident,TrainingAnswer.question_revision_id==revision.id))
        value={'selected':data.selected,'text':data.text}
        if answer and answer.answer==value:return {'id':answer.id,'row_version':answer.row_version,'replayed':True}
        if (answer.row_version if answer else 0)!=data.row_version:raise Problem(409,'VERSION_CONFLICT','作答已在另一窗口更新。')
        if answer:answer.answer=value;answer.row_version+=1
        else:answer=TrainingAnswer(attempt_id=ident,question_revision_id=revision.id,answer=value);db.add(answer);db.flush()
        audit(db,actor,'training_answer_saved','training_attempt',ident,package.project_id,request_id,answer.row_version)
        return {'id':answer.id,'row_version':answer.row_version,'replayed':False}


def recompute(attempt,answers):
    attempt.result_state='pending_scoring' if any(a.confirmed_score is None and a.suggested_score is None for a in answers) else 'awaiting_review' if any(a.confirmed_score is None for a in answers) else 'confirmed'


def submit(ident,actor,request_id):
    with Session.begin() as db:
        attempt,package=attempt_in(db,ident,actor,lock=True)
        rows=package_rows(db,package,actor)
        if attempt.state=='submitted':return {'id':ident,'replayed':True,'result_state':attempt.result_state}
        answers=[]
        for _,parent,revision in rows:
            answer=db.scalar(select(TrainingAnswer).where(TrainingAnswer.attempt_id==ident,TrainingAnswer.question_revision_id==revision.id))
            if not answer:raise Problem(422,'INCOMPLETE_ATTEMPT','请先保存每一道题的作答。')
            answer.scoring_version=revision.scoring_version
            if parent.type!='case_answer':
                answer.confirmed_score=100.0 if set(answer.answer['selected'])==set(revision.answer['selected']) else 0.0
                answer.score_kind='rule_final';answer.model_ref='deterministic-objective-v1'
                answer.feedback={**answer.feedback,'message':'按选项集合完全一致评分，不设部分分。','error_type':'none' if answer.confirmed_score==100 else 'selection_mismatch'}
            else:
                try:
                    if attempt.grading_mode=='simulate_failure':raise Problem(503,'SIMULATED_GRADER_FAILURE','模拟评分暂不可用。')
                    if attempt.grading_mode=='llm':
                        answer.suggested_score=None;answer.model_ref='pending-model';answer.score_kind='pending'
                        answer.feedback={**answer.feedback,'message':'作答已保存，后台评分后仍需教员确认。'}
                    else:
                        hits=[{'point':r['point'],'matched':any(k.casefold() in answer.answer['text'].casefold() for k in r['keywords']), 'points':r['points']} for r in revision.rubric]
                        answer.suggested_score=sum(r['points'] for r in hits if r['matched']);answer.model_ref='keyword-rubric-v1';answer.score_kind='rule_suggestion'
                        answer.feedback={**answer.feedback,'message':'关键词覆盖建议分，无法判断回答的完整性或工程正确性，需教员复核。','rubric_results':hits}
                except Problem:
                    answer.suggested_score=None;answer.score_kind='pending';answer.model_ref='unavailable';answer.feedback={**answer.feedback,'message':'评分暂不可用，作答已保留，等待教员复核。'}
            answer.row_version+=1;answers.append(answer)
        attempt.state='submitted';attempt.submitted_at=utcnow();recompute(attempt,answers)
        if attempt.grading_mode=='llm' and any(a.confirmed_score is None for a in answers):
            from ..extraction.llm import load,metadata
            payload={'attempt_id':ident,'config_fingerprint':fingerprint(metadata(load()))}
            run=ProcessingRun(kind='training_grading',object_id=ident,project_id=package.project_id,actor_id=actor.id,
                title='案例问答建议评分',idempotency_key='b07-grade:'+ident,input_hash=fingerprint(payload),payload=payload)
            db.add(run);db.flush();run.queue_job_id=enqueue(db,run.id)
        audit(db,actor,'training_attempt_submitted','training_attempt',ident,package.project_id,request_id)
        return {'id':ident,'replayed':False,'result_state':attempt.result_state}


def result(db,ident,actor,teacher=False):
    attempt,package=attempt_in(db,ident,actor,teacher=teacher)
    if attempt.state!='submitted':raise Problem(409,'NOT_SUBMITTED','作答尚未提交，暂不开放答案。')
    available=True
    try:rows=package_rows(db,package,actor,action='training.manage' if teacher else 'training.learn')
    except Problem as exc:
        if exc.status not in {403,409,410}:raise
        rows=[];available=False
    answers=db.scalars(select(TrainingAnswer).where(TrainingAnswer.attempt_id==ident)).all()
    revisions={r.id:(p,r) for _,p,r in rows}
    output=[]
    for a in answers:
        base={'id':a.id,'question_revision_id':a.question_revision_id,'suggested_score':a.suggested_score,'confirmed_score':a.confirmed_score,
            'score_kind':a.score_kind,'row_version':a.row_version,'scoring_version':a.scoring_version,'model_ref':a.model_ref,'content_available':available}
        if available:
            parent,revision=revisions[a.question_revision_id]
            base|={'stem':revision.stem,'answer':a.answer,'reference_answer':revision.answer,'rubric':revision.rubric,'feedback':a.feedback,'source_versions':revision.source_versions,'type':parent.type}
        output.append(base)
    final=None if any(a.confirmed_score is None for a in answers) else sum(a.confirmed_score for a in answers)
    provisional=None if any(a.confirmed_score is None and a.suggested_score is None for a in answers) else sum(a.confirmed_score if a.confirmed_score is not None else a.suggested_score for a in answers)
    grading=db.scalar(select(ProcessingRun).where(ProcessingRun.kind=='training_grading',ProcessingRun.object_id==ident))
    return {'id':ident,'learner_id':attempt.learner_id,'package_version_id':package.id,'package_version':package.version,'state':attempt.state,
        'result_state':attempt.result_state,'confirmed_total':final,'provisional_total':provisional,'max_score':len(answers)*100,'content_available':available,
        'restriction_note':None if available else '来源或题目当前受限；仅保留分数与记录编号，不显示题面、答案、作答和反馈正文。','answers':output,
        'grading_job':{'id':grading.id,'status':grading.status,'row_version':grading.row_version,'error':grading.error} if grading else None}


def confirm_score(answer_id,data,actor,request_id):
    with Session.begin() as db:
        answer=db.get(TrainingAnswer,answer_id)
        if not answer:raise Problem(404,'NOT_FOUND','作答不存在。')
        attempt,package=attempt_in(db,answer.attempt_id,actor,lock=True,teacher=True)
        package_rows(db,package,actor,action='training.manage')
        if attempt.state!='submitted':raise Problem(409,'NOT_SUBMITTED','作答尚未提交。')
        db.refresh(answer,with_for_update=True)
        if answer.row_version!=data.row_version:raise Problem(409,'VERSION_CONFLICT','此评分已经被更新。')
        db.add(TrainingScoreReview(answer_id=answer.id,reviewer_id=actor.id,before_score=answer.confirmed_score,after_score=data.score,reason=data.reason))
        answer.confirmed_score=data.score;answer.row_version+=1;answer.score_kind='human_confirmed'
        answer.feedback={**answer.feedback,'human_review_reason':data.reason}
        all_answers=db.scalars(select(TrainingAnswer).where(TrainingAnswer.attempt_id==attempt.id)).all();recompute(attempt,all_answers)
        audit(db,actor,'training_score_confirmed','training_answer',answer.id,package.project_id,request_id,answer.row_version)
        return {'id':answer.id,'row_version':answer.row_version,'confirmed_score':answer.confirmed_score,'suggested_score':answer.suggested_score}


def prepare_grading_retry(db,run,actor):
    attempt,package=attempt_in(db,run.object_id,actor,teacher=True)
    package_rows(db,package,actor,action='training.manage')
    from ..extraction.llm import require_config,metadata
    run.payload={**run.payload,'config_fingerprint':fingerprint(metadata(require_config()))}
