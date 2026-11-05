from fastapi import APIRouter,Depends,Query
from fastapi.responses import FileResponse
from sqlalchemy import select
from ...auth import Actor,current_actor,Problem
from ...db import Session
from ...models import FileAsset
from ...storage import asset_path
from .models import HistoryImport,HistoryFinding
from .media_models import HistoryImage,HistoryImageOccurrence,HistoryImageLink,HistoryMediaRun
from .service import document_in
from .media import extract_document_images

router=APIRouter(prefix='/api/v1/history-reports',tags=['原报告图片证据'])

@router.post('/{document_id}/extract-images')
def extract(document_id:str,actor:Actor=Depends(current_actor)):
    return extract_document_images(document_id,actor)

@router.get('/{document_id}/images')
def list_images(document_id:str,limit:int=Query(100,ge=1,le=200),offset:int=Query(0,ge=0),actor:Actor=Depends(current_actor)):
    with Session() as db:
        document_in(db,document_id,actor)
        run=db.scalar(select(HistoryImport).where(HistoryImport.document_id==document_id).order_by(HistoryImport.created_at.desc(),HistoryImport.id.desc()))
        media=db.scalar(select(HistoryMediaRun).where(HistoryMediaRun.import_id==run.id).order_by(HistoryMediaRun.created_at.desc())) if run else None
        rows=db.execute(select(HistoryImage,HistoryImageOccurrence).join(HistoryImageOccurrence,HistoryImageOccurrence.image_id==HistoryImage.id)
            .where(HistoryImage.document_id==document_id).order_by(HistoryImageOccurrence.id).offset(offset).limit(limit))
        items=[]
        for im,occ in rows:
            links=list(db.execute(select(HistoryImageLink.finding_id,HistoryImageLink.relation).join(HistoryFinding,HistoryFinding.id==HistoryImageLink.finding_id)
                .where(HistoryImageLink.occurrence_id==occ.id,HistoryFinding.import_id==run.id))) if run else []
            items.append({'image_id':im.id,'occurrence_id':occ.id,'sha256':im.sha256,'width':im.width,'height':im.height,
                'locator':occ.locator,'kind':occ.kind,'method':occ.method,'finding_links':[{'finding_id':f,'relation':r} for f,r in links],
                'association_state':'linked_to_finding' if links else 'report_only_unconfirmed',
                'url':f'/api/v1/history-reports/images/{im.id}/content'})
        return {'items':items,'media':{'status':media.status,'counts':media.counts,'issues':media.issues} if media else None}

@router.get('/findings/{finding_id}/images')
def finding_images(finding_id:str,actor:Actor=Depends(current_actor)):
    with Session() as db:
        finding=db.get(HistoryFinding,finding_id)
        if not finding:raise Problem(404,'NOT_FOUND','问题不存在。')
        run=db.get(HistoryImport,finding.import_id);document_in(db,run.document_id,actor)
        rows=db.execute(select(HistoryImage,HistoryImageOccurrence,HistoryImageLink).join(HistoryImageOccurrence,HistoryImageOccurrence.image_id==HistoryImage.id)
            .join(HistoryImageLink,HistoryImageLink.occurrence_id==HistoryImageOccurrence.id).where(HistoryImageLink.finding_id==finding_id))
        return {'items':[{'image_id':i.id,'sha256':i.sha256,'locator':o.locator,'relation':l.relation,
            'url':f'/api/v1/history-reports/images/{i.id}/content'} for i,o,l in rows]}

@router.get('/images/{image_id}/content')
def image_content(image_id:str,actor:Actor=Depends(current_actor)):
    with Session() as db:
        im=db.get(HistoryImage,image_id)
        if not im:raise Problem(404,'NOT_FOUND','图片不存在。')
        document_in(db,im.document_id,actor);asset=db.get(FileAsset,im.asset_id);path=asset_path(asset.storage_key)
        safe_mime=asset.mime_type if asset.mime_type in ('image/jpeg','image/png','image/gif','image/webp') else 'application/octet-stream'
        return FileResponse(path,media_type=safe_mime,headers={'X-Content-Type-Options':'nosniff'})
