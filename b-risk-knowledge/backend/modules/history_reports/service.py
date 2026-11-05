import hashlib, json, mimetypes, os, shutil, tempfile, uuid
from pathlib import Path
from sqlalchemy import select, text, insert, func
from ...db import Session
from ...auth import authorize, Problem
from ...models import FileAsset, new_id
from ...storage import asset_path
from ..report_parsing.fields import FIELDS, VERSION, registry
from .models import HistoryDocument, HistoryOrigin, HistoryImport, HistoryFinding, HistoryEvidence, HistoryIssue
from .engine import PARSER_VERSION, hash_json, parse_original, parent_from_folders, last_saved

def digest(path):
    h=hashlib.sha256()
    with Path(path).open('rb') as stream:
        for block in iter(lambda:stream.read(1024*1024),b''):h.update(block)
    return h.hexdigest()

def lock(db,key):
    db.execute(text('SELECT pg_advisory_xact_lock(:key)'),{'key':int(hashlib.sha256(key.encode()).hexdigest()[:15],16)})

def document_in(db,ident,actor,action='knowledge.read'):
    doc=db.get(HistoryDocument,ident)
    if not doc:raise Problem(404,'NOT_FOUND','原报告不存在。')
    authorize(actor,action,doc.scope_id)
    if doc.org_id!=actor.org_id:raise Problem(403,'FORBIDDEN','原报告不属于当前组织。')
    return doc

def register_original(path,actor,scope,origins=(),original_name=None,expected_hash=None):
    authorize(actor,'knowledge.process',scope)
    path=Path(path);sha=digest(path)
    if expected_hash and expected_hash!=sha:raise Problem(409,'SOURCE_CHANGED','原件哈希与盘点不一致，已停止该文件导入。')
    name=original_name or path.name;suffix=Path(name).suffix.lower()
    if suffix not in ('.docx','.doc','.wps','.pdf','.pptx','.xlsx','.xls'):raise Problem(422,'UNSUPPORTED_FORMAT','不支持的原报告格式。')
    key=f'history/originals/{sha[:2]}/{sha}{suffix}'
    dest=asset_path(key);dest.parent.mkdir(parents=True,exist_ok=True)
    if dest.exists():
        if digest(dest)!=sha:raise Problem(409,'ARCHIVE_CORRUPTED','已存原件校验失败，未覆盖。')
    else:
        fd,tmp=tempfile.mkstemp(dir=dest.parent,suffix='.pending');os.close(fd)
        try:
            shutil.copyfile(path,tmp)
            if digest(tmp)!=sha:raise Problem(409,'SOURCE_CHANGED','复制时原文件变化，未完成归档。')
            os.replace(tmp,dest)
        finally:Path(tmp).unlink(missing_ok=True)
    with Session.begin() as db:
        lock(db,actor.org_id+scope+sha)
        doc=db.scalar(select(HistoryDocument).where(HistoryDocument.org_id==actor.org_id,HistoryDocument.scope_id==scope,HistoryDocument.sha256==sha))
        reused=doc is not None
        if not doc:
            asset=FileAsset(storage_key=key,sha256=sha,mime_type=mimetypes.guess_type(name)[0] or 'application/octet-stream',
                size=dest.stat().st_size,org_id=actor.org_id,project_id=scope,availability='available')
            db.add(asset);db.flush()
            doc=HistoryDocument(org_id=actor.org_id,scope_id=scope,asset_id=asset.id,sha256=sha,original_name=name,source_format=suffix)
            db.add(doc);db.flush()
        for origin in origins:
            ident=hash_json(origin)
            if not db.scalar(select(HistoryOrigin.id).where(HistoryOrigin.document_id==doc.id,HistoryOrigin.origin_key==ident)):
                db.add(HistoryOrigin(document_id=doc.id,origin_key=ident,provenance=origin))
        return {'document_id':doc.id,'asset_id':doc.asset_id,'sha256':sha,'reused':reused,'storage_key':key}

def get_context(db,doc,path):
    origins=[r.provenance for r in db.scalars(select(HistoryOrigin).where(HistoryOrigin.document_id==doc.id))]
    chosen=sorted(origins,key=lambda x:x.get('path',''))
    parents=[parent_from_folders(x) for x in chosen];parents=[p for p in parents if p]
    values={p['value'] for p in parents}
    parent=parents[0] if len(values)==1 else None
    item=chosen[0] if chosen else {'path':doc.original_name,'original_name':doc.original_name,'suffix':doc.source_format,'sha256':doc.sha256}
    context={'parent':parent,'parent_candidates':sorted(values),'saved_times':last_saved(path,item),
        'source_paths':[x.get('path') for x in chosen],'old_confirmations_imported':False,'classification_enabled':False}
    from .visual_supplement import supplement_path
    supplement=supplement_path(doc.sha256)
    if supplement.is_file():context['visual_supplement_sha256']=digest(supplement)
    from .page_reuse import context_hash as page_reuse_hash
    reuse=page_reuse_hash(doc.sha256)
    if reuse:context['page_review_reuse_sha256']=reuse
    from .scope_supplement import supplement_path as scope_path
    scope=scope_path(doc.sha256)
    if scope.is_file():context['scope_supplement_sha256']=digest(scope)
    from .mapping_review import review_path
    mapping=review_path(doc.sha256)
    if mapping.is_file():context['mapping_review_sha256']=digest(mapping)
    from .reviewed_scope import review_path
    scope_review=review_path(doc.sha256)
    if scope_review.is_file():context['reviewed_scope_sha256']=digest(scope_review)
    from .record_removals import removal_path
    from .native_supplement import supplement_path as native_supplement_path
    native_supplement=native_supplement_path(doc.sha256)
    if native_supplement.is_file():context['native_supplement_sha256']=digest(native_supplement)
    else:
        from .lifecycle import latest_run
        current=latest_run(db,doc.id)
        if current and current.context.get('native_supplement_sha256'):
            raise Problem(409,'NATIVE_SUPPLEMENT_MISSING','已核原生补录文件缺失，暂停重解析以避免丢失已核内容。')
    from .external_supplement import supplement_path as external_path
    external=external_path(doc.sha256)
    if external.is_file():context['external_supplement_sha256']=digest(external)
    else:
        from .lifecycle import latest_run
        current=latest_run(db,doc.id)
        if current and current.context.get('external_supplement_sha256'):
            raise Problem(409,'EXTERNAL_SUPPLEMENT_MISSING','已验收回传文件缺失，暂停重解析以避免丢失已核内容。')
    removals=removal_path(doc.sha256)
    if removals.is_file():context['record_removals_sha256']=digest(removals)
    else:
        from .lifecycle import latest_run
        current=latest_run(db,doc.id)
        if current and current.context.get('record_removals_sha256'):
            raise Problem(409,'DELETION_POLICY_MISSING','重复内容删除记录缺失，暂停重解析以避免恢复已删除内容。')
    return item,context

def validate_result(result):
    for record in result['records']:
        assert set(record['values'])<=set(FIELDS)
        assert record['values'].get('problem_description') and not record['values'].get('hazard_category')
        evfields={e['field_key'] for e in record['evidence']}
        assert all(k in evfields for k,v in record['values'].items() if v is not None)
        for e in record['evidence']:
            assert e['field_key'] in FIELDS and e['locator']
            span=e.get('details',{}).get('span')
            if span is not None:assert e['quote'][span[0]:span[1]]==e['value']
            elif e['source_kind']=='report':assert e['quote']==e['value']
            assert e['source_kind']=='report' or e['field_key'] in ('project_name','inspection_date')

def import_document(ident,actor,prepared=None):
    with Session() as db:
        doc=document_in(db,ident,actor,'knowledge.process');asset=db.get(FileAsset,doc.asset_id)
        from .lifecycle import latest_run,removed_receipt
        removed=removed_receipt(latest_run(db,ident))
        if removed:return removed
        path=asset_path(asset.storage_key)
        item,context=get_context(db,doc,path)
        sha=doc.sha256
        config_hash=hash_json({'parser':PARSER_VERSION,'dictionary':registry(),'context':context})
        previous=db.scalar(select(HistoryImport).where(HistoryImport.document_id==ident,HistoryImport.config_hash==config_hash))
        if previous:return {'import_id':previous.id,'document_id':ident,'reused':True,'status':previous.status,'counts':previous.counts}
    if digest(path)!=sha:raise Problem(409,'ARCHIVE_CORRUPTED','原件校验失败，未解析写入。')
    result=prepared or parse_original(path,{**item,'original_name':doc.original_name,'sha256':sha},context)
    if prepared and (result.get('source_sha256')!=sha or result.get('parser_version')!=PARSER_VERSION):
        raise Problem(422,'RESULT_MISMATCH','解析结果与原件或规则版本不一致。')
    if prepared:
        from .native_supplement import validate_prepared
        validate_prepared(result,path,{**item,'original_name':doc.original_name,'sha256':sha},context)
        from .external_supplement import validate_prepared as validate_external
        validate_external(result,path,{**item,'original_name':doc.original_name,'sha256':sha},context)
    validate_result(result)
    with Session.begin() as db:
        document_in(db,ident,actor,'knowledge.process');lock(db,ident)
        removed=removed_receipt(latest_run(db,ident))
        if removed:return removed
        previous=db.scalar(select(HistoryImport).where(HistoryImport.document_id==ident,HistoryImport.config_hash==config_hash))
        if previous:return {'import_id':previous.id,'document_id':ident,'reused':True,'status':previous.status,'counts':previous.counts}
        run=HistoryImport(document_id=ident,config_hash=config_hash,parser_version=PARSER_VERSION,dictionary_version=VERSION,
            status=result['status'],counts=result['counts'],context=context,created_by=actor.id)
        db.add(run);db.flush();record_ids={};evidence_rows=[]
        for rec in result['records']:
            fid=new_id();record_ids[rec['key']]=fid
            finding=HistoryFinding(id=fid,import_id=run.id,source_key=rec['key'],locator=rec['locator'],
                review_state=rec.get('review_state','source_extracted'),**rec['values'])
            db.add(finding)
            for e in rec['evidence']:
                evidence_rows.append({'id':new_id(),'finding_id':fid,'field_key':e['field_key'],'source_label':e.get('source_label'),
                    'quote':e['quote'],'locator':e['locator'],'source_kind':e['source_kind'],'method':e['method'],'details':e.get('details',{})})
        db.flush()
        for i in range(0,len(evidence_rows),500):db.execute(insert(HistoryEvidence),evidence_rows[i:i+500])
        for issue in result['issues']:
            db.add(HistoryIssue(import_id=run.id,finding_id=record_ids.get(issue.get('record_key')),
                kind=issue.get('kind','technical'),code=issue['code'],reason=issue.get('reason',issue.get('detail','需核对原件')),
                source_label=issue.get('source_label'),target_field=issue.get('target_field'),quote=issue.get('quote'),locator=issue.get('locator',{})))
        return {'import_id':run.id,'document_id':ident,'reused':False,'status':run.status,'counts':run.counts}

def finding_dto(row):
    return {'id':row.id,'import_id':row.import_id,'locator':row.locator,'review_state':row.review_state,
        'fields':{k:getattr(row,k) for k in FIELDS},
        'images_url':f'/api/v1/history-reports/findings/{row.id}/images',
        'evidence_url':f'/api/v1/history-reports/findings/{row.id}/evidence'}
