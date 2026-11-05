"""Delete approved duplicate reports from the current working set, retain audit versions."""
from sqlalchemy import select
from .models import HistoryImport,HistoryFinding

REMOVED='merged_duplicate'

def latest_run(db,document_id):
    return db.scalar(select(HistoryImport).where(HistoryImport.document_id==document_id)
        .order_by(HistoryImport.created_at.desc(),HistoryImport.id.desc()))

def deletion_info(run):
    if run is None or run.status!=REMOVED:return None
    info=run.context['duplicate_deletion']
    assert info['canonical_document_id']!=run.document_id and run.counts['findings']==0
    return {**info,'deletion_import_id':run.id,'state':REMOVED,'original_audit_preserved':True}

def active_document_predicate():
    # Select the latest version before checking status, so future explicit restores work.
    latest=select(HistoryImport.document_id,HistoryImport.status).distinct(HistoryImport.document_id).order_by(
        HistoryImport.document_id,HistoryImport.created_at.desc(),HistoryImport.id.desc()).subquery()
    return select(latest.c.document_id).where(latest.c.status==REMOVED)

def removed_receipt(run):
    info=deletion_info(run)
    if info is None:return None
    return {'document_id':run.document_id,'import_id':run.id,'status':REMOVED,'reused':True,
        'counts':run.counts,'canonical_document_id':info['canonical_document_id'],
        'notice':'该重复报告已从当前工作集删除，请使用保留的完整报告。','original_audit_preserved':True}

def validate_mapping(source_keys,target_keys,mapping):
    assert source_keys and len(mapping)==len(source_keys)
    assert {x['source_key'] for x in mapping}==set(source_keys)
    assert len({x['canonical_source_key'] for x in mapping})==len(mapping),'Mapping must be one-to-one'
    assert {x['canonical_source_key'] for x in mapping}<=set(target_keys)

def comparison_value(field,value):
    import re
    if value is None:return None
    text=re.sub(r'\s+','',str(value))
    # Reviewed punctuation-only copies: retain words, figures, units and grades.
    if field=='problem_description':text=re.sub(r'。(?=[（(])','',text)
    return text

def business_gaps(source_fields,target_fields):
    def description(fields,other):
        text=comparison_value('problem_description',fields.get('problem_description'))
        category=comparison_value('source_category',fields.get('source_category') or other.get('source_category'))
        if text and category:
            for suffix in ('（'+category+'）','('+category+')'):
                if text.endswith(suffix):text=text[:-len(suffix)].rstrip('。')
        return text.rstrip('。') if text else text
    gaps=[]
    for k,v in source_fields.items():
        if v is None:continue
        if comparison_value(k,v)==comparison_value(k,target_fields.get(k)):continue
        if k=='problem_description' and description(source_fields,target_fields)==description(target_fields,source_fields):continue
        gaps.append(k)
    return gaps

def retire_duplicate(selection,actor):
    """An empty current version removes business rows while audit versions stay intact."""
    from ...db import Session
    from ...models import FileAsset
    from ...storage import asset_path
    from .service import document_in,lock,digest
    from .engine import hash_json
    from .media_models import HistoryImage,HistoryMediaRun
    from .media import MEDIA_VERSION
    from ..report_parsing.fields import FIELDS
    from .review_queue import identity_review,effective_fields
    sid=selection['source_document_id'];cid=selection['canonical_document_id'];assert sid!=cid
    assert selection['safe_to_retire'] is True and selection['reason']
    assert selection['unique_business_fields']==[] and selection['unique_image_sha256']==[]
    assert selection['original_content_review_passed'] is True
    with Session.begin() as db:
        # Common lock order and the same parse locks avoid stale parses resurrecting a report.
        for did in sorted((sid,cid)):lock(db,did)
        source=document_in(db,sid,actor,'knowledge.process');canonical=document_in(db,cid,actor,'knowledge.process')
        old=latest_run(db,sid);target=latest_run(db,cid)
        if old.status==REMOVED:
            assert deletion_info(old)['canonical_document_id']==cid
            return {**removed_receipt(old),'deleted_now':False}
        assert target.status!=REMOVED,'Canonical report must remain active'
        assert old.id==selection['source_import_id'] and target.id==selection['target_import_id'],'Review is stale'
        assert source.sha256==selection['source_sha256'] and canonical.sha256==selection['canonical_sha256']
        for doc in (source,canonical):
            path=asset_path(db.get(FileAsset,doc.asset_id).storage_key)
            assert digest(path)==doc.sha256,'Source bytes changed since review'
        sf=list(db.scalars(select(HistoryFinding).where(HistoryFinding.import_id==old.id)))
        tf=list(db.scalars(select(HistoryFinding).where(HistoryFinding.import_id==target.id)))
        validate_mapping({f.source_key for f in sf},{f.source_key for f in tf},selection['mapping'])
        source_review=identity_review(source.sha256);target_review=identity_review(canonical.sha256)
        source_fields={f.source_key:effective_fields({k:getattr(f,k) for k in FIELDS},f.source_key,source_review)[0] for f in sf}
        target_fields={f.source_key:effective_fields({k:getattr(f,k) for k in FIELDS},f.source_key,target_review)[0] for f in tf}
        for m in selection['mapping']:
            gaps=business_gaps(source_fields[m['source_key']],target_fields[m['canonical_source_key']])
            assert not gaps,('Retained report has unique or conflicting business fields',m['source_key'],gaps)
        sm=set(db.scalars(select(HistoryImage.sha256).where(HistoryImage.document_id==sid)))
        tm=set(db.scalars(select(HistoryImage.sha256).where(HistoryImage.document_id==cid)))
        assert sm<=tm,'Retained report does not cover all original images'
        prior_media=db.scalar(select(HistoryMediaRun).where(HistoryMediaRun.import_id==old.id).order_by(HistoryMediaRun.created_at.desc(),HistoryMediaRun.id.desc()))
        assert prior_media is not None and not prior_media.issues,'Unresolved media evidence blocks deletion'
        info={**selection,'previous_import_id':old.id,'source_images_covered':len(sm),'removed_findings':len(sf),
              'deletion_method':'empty_current_version','original_files_deleted':False}
        run=HistoryImport(document_id=sid,config_hash=hash_json({'operation':'delete_confirmed_duplicate_v1','selection':selection}),
            parser_version='history-dedup-selection-v1',dictionary_version=old.dictionary_version,status=REMOVED,
            counts={'findings':0,'issues':0,'removed_findings':len(sf)},context={**old.context,'duplicate_deletion':info},created_by=actor.id)
        db.add(run);db.flush()
        db.add(HistoryMediaRun(import_id=run.id,version=MEDIA_VERSION,status='extracted',
            counts={**prior_media.counts,'finding_links':0,'errors':0,'retained_for_audit':True},issues=[]))
        return {**removed_receipt(run),'deleted_now':True,'previous_import_id':old.id}
