from fastapi import APIRouter,Depends,Request
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy import select
from ...auth import Actor,current_actor,authorize,Problem
from ...db import Session
from ...models import ProcessingRun
from ...api_common import key_header
from ...audit import record as audit
from .models import TaxonomyRevision,ExtractionRun
from .schemas import ModelSettings,Taxonomy,Generate
from . import llm
from .service import save_taxonomy,taxonomy_dto,DEFAULT_CATEGORIES,submit

router=APIRouter(prefix='/api/v1',tags=['知识萃取与云端模型'])


def administrator(actor):
    if not actor.projects('manage'):raise Problem(403,'FORBIDDEN','模型连接配置仅限管理员。')


@router.get('/models/settings')
def settings(actor:Actor=Depends(current_actor)):
    administrator(actor);return llm.public_settings()


@router.put('/models/settings')
def save(data:ModelSettings,request:Request,actor:Actor=Depends(current_actor)):
    administrator(actor);result=llm.save(data)
    with Session.begin() as db:audit(db,actor,'model_settings_updated','model_config','local',actor.projects('manage')[0],request.state.request_id)
    return result


@router.post('/models/test')
def test(actor:Actor=Depends(current_actor)):
    administrator(actor)
    from ..knowledge.schemas import Strict
    class Ping(Strict):
        status:str
    value,meta=llm.structured(Ping,'仅回复JSON：{"status":"ok"}。不发送业务资料。',{'connection_test':True})
    return {'status':'ok' if value.status=='ok' else 'unexpected_response','model':meta}


@router.get('/knowledge/taxonomies')
def taxonomies(project_id:str,actor:Actor=Depends(current_actor)):
    authorize(actor,'run',project_id)
    with Session() as db:
        rows=db.scalars(select(TaxonomyRevision).where(TaxonomyRevision.project_id==project_id).order_by(TaxonomyRevision.version.desc())).all()
        return {'items':[taxonomy_dto(r) for r in rows],'suggested_categories':DEFAULT_CATEGORIES}


@router.post('/knowledge/taxonomies')
def taxonomy(data:Taxonomy,request:Request,actor:Actor=Depends(current_actor)):
    return save_taxonomy(data,actor,request.state.request_id)


@router.post('/knowledge/extraction-jobs')
def create(data:Generate,request:Request,actor:Actor=Depends(current_actor),key=Depends(key_header)):
    run,replayed=submit(data,actor,key,request.state.request_id)
    return JSONResponse(status_code=200 if replayed else 202,content=jsonable_encoder({'job_id':run.id,'replayed':replayed,'generation_mode':data.mode}))


@router.get('/knowledge/extraction-jobs/{ident}')
def job(ident:str,actor:Actor=Depends(current_actor)):
    with Session() as db:
        run=db.get(ProcessingRun,ident)
        if not run or run.kind!='knowledge_extraction':raise Problem(404,'NOT_FOUND','知识萃取任务不存在。')
        authorize(actor,'run',run.project_id)
        data=db.scalar(select(ExtractionRun).where(ExtractionRun.run_id==ident))
        # Recheck selected sources before returning model-derived results.
        from .service import prepare
        prepare(db,Generate.model_validate(run.payload),actor)
        return {'job_id':ident,'status':run.status,'progress':run.progress,'row_version':run.row_version,'error':run.error,
            'taxonomy_id':data.taxonomy_id,'source_versions':data.source_versions,'prompt_version':data.prompt_version,'config_snapshot':data.config_snapshot,'result':data.result}
