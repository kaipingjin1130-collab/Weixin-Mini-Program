"""Preserve source-backed photographs belonging to a reviewed, possibly cross-page finding."""
import hashlib,io,json,os,tempfile,math
from pathlib import Path
from sqlalchemy import select,func
from ...db import Session
from ...models import FileAsset
from ...storage import asset_path
from .models import HistoryFinding,HistoryEvidence
from .media_models import HistoryImage,HistoryImageOccurrence,HistoryImageLink,HistoryMediaRun
from .service import document_in,lock,digest
from .lifecycle import latest_run,REMOVED
from .engine import hash_json

def validate_association(proof,photo,source_sha,record):
    """A numbered attachment or a visually checked continuous row, never image similarity."""
    assert proof['source_sha256']==source_sha and proof['canonical_source_key']==record['key']
    assert proof['photo']==photo and proof['reason']
    assert proof['status'] in {'confirmed_numbered_attachment','confirmed_continuous_row'}
    assert str(proof['original_problem_number'])==str(record['locator']['original_problem_number'])
    evidence=proof['association_evidence'];assert evidence
    for e in evidence:
        assert e['source_sha256']==source_sha and e['review_method']=='assistant_visual_readback'
        assert e['locator']['units']=='pt' and e['locator']['origin']=='top_left'
        assert e['quote'] and e['quote'][slice(*e['span'])]==e['value']
        assert digest(Path(e['preview_path']))==e['preview_sha256']
    if not any(e['locator']['physical_page']==photo['locator']['physical_page'] for e in evidence):
        assert proof['status']=='confirmed_continuous_row'
        scope=proof['scope_evidence'];assert scope['scope_kind']=='same_report_explicit_number_or_continuous_row'
        assert scope['boundary_reason'] and scope['counterexample_check']
        target=photo['locator']['physical_page'];assert target in scope['target_pages']
        endpoints=[scope['problem_page'],target]+[e['locator']['physical_page'] for e in evidence]
        needed=set(range(min(endpoints),max(endpoints)+1));assert needed<=set(scope['visual_reviewed_pages'])
        previews={p['physical_page']:p for p in proof['page_previews']};assert needed<=set(previews)
        for pn in needed:assert digest(Path(previews[pn]['path']))==previews[pn]['sha256']
    return evidence

def validate_region(photo,source_sha,page_size,problem_pages,association=None,record=None):
    assert photo['source_sha256']==source_sha and photo['review_method']=='assistant_visual_readback'
    loc=photo['locator'];assert loc['kind']=='pdf_region' and loc['units']=='pt' and loc['origin']=='top_left'
    assert type(loc['physical_page']) is int
    if loc['physical_page'] not in problem_pages:
        assert association is not None and record is not None
        validate_association(association,photo,source_sha,record)
    box=loc['bbox'];assert len(box)==4 and all(isinstance(x,(int,float)) and math.isfinite(x) for x in box)
    x0,y0,x1,y1=box;w,h=page_size
    assert 0<=x0<x1<=w and 0<=y0<y1<=h
    assert (x1-x0)*(y1-y0)<w*h*.65,'A scanned full page is not an individual photo'
    preview=Path(photo['preview_path']);assert preview.is_file() and digest(preview)==photo['preview_sha256']
    return box

def attach_reviewed_photos(document_id,records,actor):
    import pypdfium2 as pdfium
    specs=[r for r in records if r.get('photo_evidence')]
    if not specs:return {'document_id':document_id,'reviewed_photos':0,'new_links':0}
    with Session.begin() as db:
        doc=document_in(db,document_id,actor,'knowledge.process');lock(db,'media:'+document_id)
        run=latest_run(db,document_id);assert run and run.status!=REMOVED
        assert doc.source_format=='.pdf'
        source=asset_path(db.get(FileAsset,doc.asset_id).storage_key);assert digest(source)==doc.sha256
        proof_path=asset_path(f'history/reviewed-photo-associations/{doc.sha256}.json')
        proofs=json.loads(proof_path.read_text(encoding='utf-8')) if proof_path.exists() else []
        findings={f.source_key:f for f in db.scalars(select(HistoryFinding).where(HistoryFinding.import_id==run.id))}
        pdf=pdfium.PdfDocument(source);new_links=0;receipts=[]
        try:
            for r in specs:
                finding=findings[r['key']];assert finding.problem_description==r['values']['problem_description']
                evidence=[e for e in r['evidence'] if e['field_key']=='problem_description' and e['source_kind']=='report'
                    and e.get('details',{}).get('source_document_id',document_id)==document_id]
                problem_pages={e['locator'].get('physical_page') for e in evidence}
                for photo in r['photo_evidence']:
                    proof=next((p for p in proofs if p['photo']==photo and (p.get('canonical_source_key')==r['key'] or p['status']=='report_only')),None)
                    if proof and proof['status']=='report_only':continue
                    pn=photo['locator']['physical_page'];assert 1<=pn<=len(pdf);page=pdf[pn-1]
                    box=validate_region(photo,doc.sha256,page.get_size(),problem_pages,proof,r)
                    x0,y0,x1,y1=box;w,h=page.get_size()
                    # Render the explicitly reviewed source rectangle; no generative restoration.
                    bitmap=page.render(scale=2,crop=(x0,h-y1,w-x1,y0));pil=bitmap.to_pil().convert('RGB')
                    out=io.BytesIO();pil.save(out,format='PNG');payload=out.getvalue();width,height=pil.size
                    pil.close();bitmap.close();page.close()
                    sha=hashlib.sha256(payload).hexdigest();storage=f'history/images/{sha[:2]}/{sha}.png';dest=asset_path(storage)
                    if dest.exists():assert digest(dest)==sha
                    else:
                        dest.parent.mkdir(parents=True,exist_ok=True);fd,tmp=tempfile.mkstemp(dir=dest.parent,suffix='.pending');os.close(fd)
                        try:Path(tmp).write_bytes(payload);os.replace(tmp,dest)
                        finally:Path(tmp).unlink(missing_ok=True)
                    image=db.scalar(select(HistoryImage).where(HistoryImage.document_id==document_id,HistoryImage.sha256==sha))
                    if image is None:
                        asset=FileAsset(storage_key=storage,sha256=sha,mime_type='image/png',size=len(payload),org_id=doc.org_id,project_id=doc.scope_id,availability='available')
                        db.add(asset);db.flush();image=HistoryImage(document_id=document_id,asset_id=asset.id,sha256=sha,width=width,height=height);db.add(image);db.flush()
                    locator={**photo['locator'],'kind':'reviewed_photo_region','source_sha256':doc.sha256,
                        'reviewed_finding_source_key':finding.source_key,'review_method':'assistant_visual_readback',
                        'photo_role':photo.get('photo_role','source_photo_role_unspecified'),'preview_sha256':photo['preview_sha256'],
                        'source_problem_evidence':[{'quote':e['quote'],'locator':e['locator'],'source_sha256':doc.sha256} for e in evidence if e['locator'].get('physical_page')==pn]}
                    if pn not in problem_pages:
                        locator['source_problem_evidence']=[{'quote':e['quote'],'locator':e['locator'],'source_sha256':doc.sha256} for e in evidence]
                        locator['association_evidence']=proof['association_evidence']
                        locator['association_reason']=proof['reason'];locator['association_method']=proof['status']
                        if proof.get('scope_evidence'):
                            locator['association_scope']=proof['scope_evidence'];locator['association_page_previews']=proof['page_previews']
                    key=hash_json({'source_sha256':doc.sha256,'page':pn,'bbox':box,'finding_source_key':finding.source_key,'method':'pdf_reviewed_region_v1'})
                    occurrence=db.scalar(select(HistoryImageOccurrence).where(HistoryImageOccurrence.image_id==image.id,HistoryImageOccurrence.source_key==key))
                    if occurrence is None:
                        occurrence=HistoryImageOccurrence(image_id=image.id,source_key=key,locator=locator,method='pdf_reviewed_region_v1',kind='reviewed_photo_region');db.add(occurrence);db.flush()
                    elif occurrence.locator!=locator:
                        # Append newly verified continuity provenance; never replace a prior coordinate or fact.
                        assert all(locator.get(k)==v for k,v in occurrence.locator.items())
                        assert set(locator)-set(occurrence.locator)<={'association_scope','association_page_previews'}
                        occurrence.locator=locator
                    if not db.scalar(select(HistoryImageLink.id).where(HistoryImageLink.occurrence_id==occurrence.id,HistoryImageLink.finding_id==finding.id)):
                        db.add(HistoryImageLink(occurrence_id=occurrence.id,finding_id=finding.id,relation='reviewed_same_problem_photo'));db.flush();new_links+=1
                    receipts.append({'source_key':finding.source_key,'image_id':image.id,'occurrence_id':occurrence.id,'sha256':sha,'storage_key':storage,'locator':locator})
            media=db.scalar(select(HistoryMediaRun).where(HistoryMediaRun.import_id==run.id).order_by(HistoryMediaRun.created_at.desc(),HistoryMediaRun.id.desc()))
            assert media is not None
            count=db.scalar(select(func.count()).select_from(HistoryImageLink).join(HistoryFinding,HistoryFinding.id==HistoryImageLink.finding_id).where(HistoryFinding.import_id==run.id))
            reviewed_count=db.scalar(select(func.count(func.distinct(HistoryImageLink.occurrence_id))).join(HistoryFinding,HistoryFinding.id==HistoryImageLink.finding_id).join(HistoryImageOccurrence,HistoryImageOccurrence.id==HistoryImageLink.occurrence_id).where(HistoryFinding.import_id==run.id,HistoryImageOccurrence.kind=='reviewed_photo_region'))
            media.counts={**media.counts,'finding_links':count,'reviewed_photo_regions':reviewed_count}
        finally:pdf.close()
        return {'document_id':document_id,'import_id':run.id,'reviewed_photos':len(receipts),'new_links':new_links,'items':receipts}
