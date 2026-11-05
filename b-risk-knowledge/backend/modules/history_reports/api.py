import os, tempfile
from pathlib import Path
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import FileResponse
from sqlalchemy import select, func
from ...auth import Actor, current_actor, authorize, Problem
from ...db import Session
from ...models import FileAsset
from ...storage import asset_path
from .models import HistoryDocument, HistoryImport, HistoryFinding, HistoryEvidence, HistoryIssue
from .service import register_original, import_document, document_in, finding_dto
from ..report_parsing.fields import registry

router=APIRouter(prefix='/api/v1/history-reports',tags=['原报告重新解析'])

@router.get('/dictionary')
def dictionary(actor:Actor=Depends(current_actor)):
    if not actor.projects('knowledge.read'):raise Problem(403,'FORBIDDEN','无可读取项目。')
    return registry()

@router.post('/originals',status_code=201)
async def upload(request:Request,scope_id:str=Query(min_length=1,max_length=128),filename:str=Query(min_length=1,max_length=255),actor:Actor=Depends(current_actor)):
    authorize(actor,'knowledge.process',scope_id)
    # API never accepts arbitrary local paths; local bulk ingestion is a separate trusted runner.
    name=Path(filename.replace('\\','/')).name
    if request.headers.get('content-type','').startswith('multipart/'):
        raise Problem(415,'RAW_FILE_REQUIRED','请以application/octet-stream发送原文件字节。')
    fd,tmp=tempfile.mkstemp(suffix=Path(name).suffix);os.close(fd)
    try:
        total=0
        with open(tmp,'wb') as out:
            async for block in request.stream():
                total+=len(block)
                if total>250*1024*1024:raise Problem(413,'FILE_TOO_LARGE','单个原件上限250MB。')
                out.write(block)
        return register_original(tmp,actor,scope_id,original_name=name)
    finally:Path(tmp).unlink(missing_ok=True)

@router.post('/{document_id}/parse')
def parse(document_id:str,actor:Actor=Depends(current_actor)):
    return import_document(document_id,actor)

@router.get('')
def documents(limit:int=Query(50,ge=1,le=200),offset:int=Query(0,ge=0),include_deleted:bool=False,actor:Actor=Depends(current_actor)):
    with Session() as db:
        q=select(HistoryDocument).where(HistoryDocument.org_id==actor.org_id,HistoryDocument.scope_id.in_(actor.projects('knowledge.read')))
        if not include_deleted:
            from .lifecycle import active_document_predicate
            q=q.where(HistoryDocument.id.not_in(active_document_predicate()))
        rows=db.scalars(q.order_by(HistoryDocument.id).offset(offset).limit(limit))
        return {'items':[{'id':r.id,'name':r.original_name,'sha256':r.sha256,'scope_id':r.scope_id} for r in rows]}

@router.get('/{document_id}/original')
def original(document_id:str,actor:Actor=Depends(current_actor)):
    with Session() as db:
        doc=document_in(db,document_id,actor);asset=db.get(FileAsset,doc.asset_id)
        return FileResponse(asset_path(asset.storage_key),filename=doc.original_name,media_type=asset.mime_type)

@router.get('/{document_id}/findings')
def findings(document_id:str,limit:int=Query(50,ge=1,le=200),offset:int=Query(0,ge=0),actor:Actor=Depends(current_actor)):
    with Session() as db:
        doc=document_in(db,document_id,actor)
        run=db.scalar(select(HistoryImport).where(HistoryImport.document_id==document_id).order_by(HistoryImport.created_at.desc(),HistoryImport.id.desc()))
        if not run:return {'items':[],'import':None}
        from .lifecycle import deletion_info
        removed=deletion_info(run)
        if removed:return {'items':[],'import':{'id':run.id,'status':run.status,'counts':run.counts},'deletion':removed}
        rows=db.scalars(select(HistoryFinding).where(HistoryFinding.import_id==run.id).order_by(HistoryFinding.source_key).offset(offset).limit(limit))
        from .review_queue import identity_review,record_dispositions,effective_fields
        identity=identity_review(doc.sha256)
        dispositions=record_dispositions(doc.sha256)
        links={r['source_key']:r for r in (identity or {}).get('record_links',[])}
        items=[]
        for r in rows:
            row=finding_dto(r);row['source_key']=r.source_key;row['analysis_include']=r.source_key not in links
            row['effective_fields'],row['field_resolutions']=effective_fields(row['fields'],r.source_key,identity)
            if r.source_key in dispositions:
                row['analysis_include']=False;row['record_disposition']=dispositions[r.source_key]
            row['field_conflicts']=[c for c in (identity or {}).get('field_conflicts',[]) if
                (c['source_document_id']==document_id and c['source_key']==r.source_key) or
                (c['canonical_document_id']==document_id and c['canonical_source_key']==r.source_key)]
            if r.source_key in links:
                link=links[r.source_key];row['canonical_reference']={k:link[k] for k in ('canonical_document_id','canonical_source_key')}
            items.append(row)
        return {'items':items,'import':{'id':run.id,'status':run.status,'counts':run.counts},
                'content_review':{'role':identity['role'],'related_sources':identity.get('related_sources',[])} if identity else None}

@router.get('/findings/{finding_id}/evidence')
def evidence(finding_id:str,actor:Actor=Depends(current_actor)):
    with Session() as db:
        finding=db.get(HistoryFinding,finding_id)
        if not finding:raise Problem(404,'NOT_FOUND','问题记录不存在。')
        run=db.get(HistoryImport,finding.import_id);doc=document_in(db,run.document_id,actor)
        items=[]
        for e in db.scalars(select(HistoryEvidence).where(HistoryEvidence.finding_id==finding_id)):
            source=document_in(db,(e.details or {}).get('source_document_id',doc.id),actor)
            items.append({'field_key':e.field_key,'source_label':e.source_label,'quote':e.quote,
                'locator':e.locator,'source_kind':e.source_kind,'method':e.method,'details':e.details,
                'document_id':source.id,'source_sha256':source.sha256,
                'original_url':f'/api/v1/history-reports/{source.id}/original'})
        return {'document_id':doc.id,'original_url':f'/api/v1/history-reports/{doc.id}/original',
            'sha256':doc.sha256,'items':items}

@router.get('/{document_id}/issues')
def issues(document_id:str,limit:int=Query(100,ge=1,le=500),offset:int=Query(0,ge=0),actor:Actor=Depends(current_actor)):
    with Session() as db:
        document_in(db,document_id,actor)
        run=db.scalar(select(HistoryImport).where(HistoryImport.document_id==document_id).order_by(HistoryImport.created_at.desc(),HistoryImport.id.desc()))
        if not run:return {'items':[]}
        rows=db.scalars(select(HistoryIssue).where(HistoryIssue.import_id==run.id).order_by(HistoryIssue.id).offset(offset).limit(limit))
        return {'items':[{'kind':r.kind,'code':r.code,'source_label':r.source_label,'target_field':r.target_field,
            'reason':r.reason,'quote':r.quote,'locator':r.locator} for r in rows]}

@router.get('/{document_id}/review-status')
def review_status(document_id:str,actor:Actor=Depends(current_actor)):
    from .review_queue import status
    with Session() as db:
        doc=document_in(db,document_id,actor)
        run=db.scalar(select(HistoryImport).where(HistoryImport.document_id==document_id).order_by(HistoryImport.created_at.desc(),HistoryImport.id.desc()))
        return status(db,doc,run)

@router.get('/analysis-summary')
def analysis_summary(actor:Actor=Depends(current_actor)):
    from .review_queue import identity_review,record_dispositions
    with Session() as db:
        docs=list(db.scalars(select(HistoryDocument).where(HistoryDocument.org_id==actor.org_id,
          HistoryDocument.scope_id.in_(actor.projects('knowledge.read')))))
        if not docs:return {'raw_findings':0,'excluded_confirmed_process_rows':0,'excluded_non_problem_rows':0,'analysis_findings':0}
        runs=list(db.scalars(select(HistoryImport).where(HistoryImport.document_id.in_([d.id for d in docs])).distinct(HistoryImport.document_id).order_by(HistoryImport.document_id,HistoryImport.created_at.desc(),HistoryImport.id.desc())))
        counts=dict(db.execute(select(HistoryFinding.import_id,func.count()).where(HistoryFinding.import_id.in_([r.id for r in runs])).group_by(HistoryFinding.import_id)).all())
        identities={d.id:identity_review(d.sha256) or {} for d in docs}
        keys_by_run={r.id:set() for r in runs}
        for rid,key in db.execute(select(HistoryFinding.import_id,HistoryFinding.source_key).where(HistoryFinding.import_id.in_(keys_by_run))):
            keys_by_run[rid].add(key)
        excluded_docs=set();total=sum(counts.values());excluded=0
        from .lifecycle import REMOVED
        removed=[r for r in runs if r.status==REMOVED]
        bydoc={d.id:d for d in docs};nonproblem=0
        for run in runs:
            current=keys_by_run[run.id]
            duplicate={r['source_key'] for r in identities[run.document_id].get('record_links',[])}&current
            excluded+=len(duplicate)
            if duplicate:excluded_docs.add(run.document_id)
            keys=set(record_dispositions(bydoc[run.document_id].sha256))&current
            nonproblem+=len(keys-duplicate)
        return {'raw_findings':total,'excluded_confirmed_process_rows':excluded,'excluded_non_problem_rows':nonproblem,'analysis_findings':total-excluded-nonproblem,
                'removed_duplicate_reports':len(removed),'removed_duplicate_findings':sum(r.counts.get('removed_findings',0) for r in removed)+sum(r.counts.get('removed_duplicate_findings',0) for r in runs if r.status!=REMOVED),
                'excluded_source_documents':len(excluded_docs),'similarity_candidates_merged':False,
                'originals_and_images_preserved':True}
