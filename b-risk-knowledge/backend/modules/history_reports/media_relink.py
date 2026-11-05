"""Reassociate unchanged report image locations after a new text parse version."""
from sqlalchemy import select,or_
from ...db import Session
from .models import HistoryImport,HistoryFinding
from .media_models import HistoryImage,HistoryImageOccurrence,HistoryImageLink,HistoryMediaRun
from .media import MEDIA_VERSION,relation,problem_cell_evidence
from .service import document_in,lock

def relink_existing_images(ident,actor):
    with Session.begin() as db:
        document_in(db,ident,actor,'knowledge.process');lock(db,'media:'+ident)
        current=db.scalar(select(HistoryImport).where(HistoryImport.document_id==ident).order_by(HistoryImport.created_at.desc(),HistoryImport.id.desc()))
        if not current:return {'document_id':ident,'status':'parse_required'}
        prior=db.scalar(select(HistoryMediaRun).where(HistoryMediaRun.import_id==current.id,HistoryMediaRun.version==MEDIA_VERSION))
        if prior:return {'document_id':ident,'reused':True,'counts':prior.counts}
        source=db.scalar(select(HistoryMediaRun).join(HistoryImport,HistoryImport.id==HistoryMediaRun.import_id)
            .where(HistoryImport.document_id==ident).order_by(HistoryMediaRun.created_at.desc(),HistoryMediaRun.id.desc()))
        if not source:return {'document_id':ident,'status':'image_extraction_required'}
        findings=list(db.scalars(select(HistoryFinding).where(HistoryFinding.import_id==current.id)))
        problem_cells=problem_cell_evidence(db,findings)
        existing_links=set(db.execute(select(HistoryImageLink.occurrence_id,HistoryImageLink.finding_id)
            .join(HistoryFinding,HistoryFinding.id==HistoryImageLink.finding_id).where(HistoryFinding.import_id==current.id)).all())
        occurrences=list(db.scalars(select(HistoryImageOccurrence).join(HistoryImage,HistoryImage.id==HistoryImageOccurrence.image_id).where(or_(HistoryImage.document_id==ident,HistoryImageOccurrence.locator['reviewed_target_document_id'].astext==ident))))
        issues=[i for i in source.issues if i['code']!='IMAGE_ROW_AMBIGUOUS'];linked=len(existing_links)
        for o in occurrences:
            loc=o.locator
            if loc.get('reviewed_target_document_id') not in (None,ident):continue
            allowed=(loc.get('part')=='word/document.xml' and not loc.get('floating_anchor')) or (loc.get('physical_page') and loc.get('bbox') and o.kind!='page_image')
            image={'locator':loc,'allow_row_link':allowed}
            matches=[(f,relation(image,f,problem_cells.get(f.id))) for f in findings];matches=[(f,r) for f,r in matches if r]
            if len(matches)>1:
                issues.append({'code':'IMAGE_ROW_AMBIGUOUS','locator':loc,'candidate_findings':[f.id for f,r in matches]});continue
            for f,r in matches:
                pair=(o.id,f.id)
                if pair not in existing_links:
                    db.add(HistoryImageLink(occurrence_id=o.id,finding_id=f.id,relation=r));existing_links.add(pair);linked+=1
        counts={**source.counts,'finding_links':linked,'errors':len(issues)}
        db.add(HistoryMediaRun(import_id=current.id,version=MEDIA_VERSION,status='partial' if issues else 'extracted',counts=counts,issues=issues))
        return {'document_id':ident,'reused':False,'counts':counts,'method':'original_image_locations_relinked'}
