from datetime import date
from typing import Literal
from fastapi import APIRouter, Depends, Request, Query
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select, func, case
from sqlalchemy.exc import IntegrityError
from ...auth import Actor, current_actor, authorize, Problem
from ...db import Session
from ...models import FileAsset, ProcessingRun
from ...audit import record as audit
from ...pagination import paginate
from ...api_common import key_header
from .models import DataSource, ImportBatch, SourceDocument, SourceRecord, SourceRecordVersion, EvidenceItem, RecordLink, ImportRow
from .adapters import TEMPLATES, DEFAULT_TEMPLATE
from .fixtures import catalog
from .service import preview, submit_import

router = APIRouter(prefix='/api/v1', tags=['历史接入与证据'])


class SourceInput(BaseModel):
    model_config = ConfigDict(extra='forbid')
    name: str = Field(min_length=1, max_length=200)
    namespace: str = Field(min_length=1, max_length=128, pattern=r'^[A-Za-z0-9_.:-]+$')
    kind: Literal['csv', 'excel', 'governance_export']
    project_id: Literal['demo-airport', 'demo-metro']
    mapping_template: str = Field(max_length=64)


class PreviewInput(BaseModel):
    model_config = ConfigDict(extra='forbid')
    source_id: str = Field(max_length=36)
    input_asset_id: str = Field(max_length=36)


class ImportInput(PreviewInput):
    input_hash: str = Field(pattern=r'^[0-9a-f]{64}$')
    fail_after: int | None = Field(default=None, ge=1, le=10000)


class ConfirmInput(BaseModel):
    model_config = ConfigDict(extra='forbid')
    row_version: int = Field(ge=1)
    decision: Literal['confirmed', 'rejected']


def source_in(db, ident, actor, action='read'):
    source = db.get(DataSource, ident)
    if not source:
        raise Problem(404, 'NOT_FOUND', '来源不存在。')
    authorize(actor, action, source.project_id)
    return source


def source_dto(s):
    return {'id': s.id, 'name': s.name, 'kind': s.kind, 'project_id': s.project_id,
            'namespace': s.namespace, 'mapping_version': s.mapping_version, 'mapping': s.config['mapping'],
            'cursor': s.cursor, 'created_at': s.created_at, 'is_mock': True}


def record_dto(row, version):
    return {'id': row.id, 'source_id': row.source_id, 'project_id': row.project_id,
            'external_record_id': row.external_record_id, 'record_kind': version.effective_fields['record_kind'],
            'current_version': row.current_version, 'quality_status': 'needs_review' if version.issues else 'valid',
            'occurred_on': version.effective_fields.get('occurred_on'), 'description': version.effective_fields.get('description'),
            'created_at': row.created_at, 'is_mock': True}


@router.get('/input-files')
def inputs(actor: Actor = Depends(current_actor)):
    return {'items': catalog(actor), 'templates': TEMPLATES}


@router.post('/sources', status_code=201)
def add_source(data: SourceInput, request: Request, actor: Actor = Depends(current_actor)):
    authorize(actor, 'run', data.project_id)
    if data.mapping_template != DEFAULT_TEMPLATE[data.kind]:
        raise Problem(422, 'MAPPING_KIND_MISMATCH', '映射模板与来源类型不匹配。')
    try:
        with Session.begin() as db:
            source = DataSource(name=data.name, namespace=data.namespace, project_id=data.project_id,
                                kind=data.kind, mapping_version=data.mapping_template,
                                config={'mapping': TEMPLATES[data.mapping_template], 'is_mock': True})
            db.add(source)
            db.flush()
            audit(db, actor, 'source_created', 'source', source.id, source.project_id, request.state.request_id)
            return source_dto(source)
    except IntegrityError:
        raise Problem(409, 'SOURCE_EXISTS', '同一项目的来源命名空间已存在，请复用已有来源。')


@router.get('/sources')
def sources(actor: Actor = Depends(current_actor), limit: int = Query(50, ge=1, le=100), cursor: str | None = None):
    with Session() as db:
        rows, next_cursor = paginate(db, select(DataSource).where(DataSource.project_id.in_(actor.projects())), DataSource, limit, cursor)
        return {'items': [source_dto(s) for s in rows], 'next_cursor': next_cursor}


@router.post('/imports/preview')
def import_preview(data: PreviewInput, actor: Actor = Depends(current_actor)):
    with Session() as db:
        source = source_in(db, data.source_id, actor, 'run')
        return preview(source, data.input_asset_id, actor)


@router.post('/imports')
def import_submit(data: ImportInput, request: Request, actor: Actor = Depends(current_actor), key=Depends(key_header)):
    with Session() as db:
        source = source_in(db, data.source_id, actor, 'run')
        batch, run, replayed = submit_import(source, data, actor, key, request.state.request_id)
        return JSONResponse(status_code=200 if replayed else 202, content=jsonable_encoder({
            'id': batch.id, 'job_id': run.id, 'replayed': replayed}))


@router.get('/imports')
def imports(actor: Actor = Depends(current_actor), limit: int = Query(20, ge=1, le=100), cursor: str | None = None):
    with Session() as db:
        query = select(ImportBatch).join(DataSource).where(DataSource.project_id.in_(actor.projects()))
        rows, next_cursor = paginate(db, query, ImportBatch, limit, cursor)
        return {'items': [{'id': b.id, 'source_id': b.source_id, 'source_name': db.get(DataSource, b.source_id).name,
                           'status': b.status, 'counts': b.counts, 'created_at': b.created_at} for b in rows], 'next_cursor': next_cursor}


@router.get('/imports/{ident}')
def import_detail(ident: str, actor: Actor = Depends(current_actor), limit: int = Query(30, ge=1, le=100), after_row: int = Query(0, ge=0), only_issues: bool = False):
    with Session() as db:
        joined = db.execute(select(ImportBatch, ProcessingRun).join(ProcessingRun, ProcessingRun.id == ImportBatch.run_id).where(ImportBatch.id == ident)).first()
        if not joined:
            raise Problem(404, 'NOT_FOUND', '批次不存在。')
        batch, run = joined
        source = source_in(db, batch.source_id, actor)
        query = select(ImportRow).where(ImportRow.batch_id == batch.id, ImportRow.row_number > after_row)
        if only_issues:
            query = query.where(func.jsonb_array_length(ImportRow.issues) > 0)
        rows = db.scalars(query.order_by(ImportRow.row_number).limit(limit + 1)).all()
        more = len(rows) > limit
        rows = rows[:limit]
        return {'id': batch.id, 'source': source_dto(source), 'input_hash': batch.input_hash, 'rule_version': batch.rule_version,
                'mapping': batch.mapping, 'status': batch.status, 'counts': batch.counts, 'job_id': run.id,
                'job_status': run.status, 'row_version': run.row_version, 'error': run.error, 'progress': run.progress,
                'created_at': batch.created_at, 'next_row': rows[-1].row_number if more else None,
                'rows': [{'row_number': r.row_number, 'outcome': r.outcome, 'record_id': r.record_id, 'issues': r.issues} for r in rows]}


@router.get('/records')
def records(actor: Actor = Depends(current_actor), project_id: str | None = None, source_id: str | None = None,
            document_id: str | None = None,
            record_kind: Literal['detail', 'review', 'summary'] | None = None,
            quality_status: Literal['valid', 'needs_review'] | None = None, from_date: date | None = None,
            to_date: date | None = None, limit: int = Query(20, ge=1, le=100), cursor: str | None = None):
    with Session() as db:
        query = select(SourceRecord).where(SourceRecord.project_id.in_(actor.projects()))
        if project_id:
            authorize(actor, 'read', project_id)
            query = query.where(SourceRecord.project_id == project_id)
        if source_id:
            source_in(db, source_id, actor)
            query = query.where(SourceRecord.source_id == source_id)
        if document_id:
            doc = db.get(SourceDocument, document_id)
            if not doc:
                raise Problem(404, 'NOT_FOUND', '报告不存在。')
            source_in(db, doc.source_id, actor)
            query = query.where(SourceRecord.document_id == document_id)
        for column, value in [(SourceRecord.record_kind, record_kind), (SourceRecord.quality_status, quality_status)]:
            if value:
                query = query.where(column == value)
        if from_date:
            query = query.where(SourceRecord.occurred_on >= from_date.isoformat())
        if to_date:
            query = query.where(SourceRecord.occurred_on <= to_date.isoformat())
        totals = dict(db.execute(select(SourceRecord.record_kind, func.count()).where(
            SourceRecord.project_id.in_(actor.projects())).group_by(SourceRecord.record_kind)).all())
        parents = {}
        merges = 0
        def root(ident):
            parents.setdefault(ident, ident)
            while parents[ident] != ident:
                ident = parents[ident]
            return ident
        confirmed = db.scalars(select(RecordLink).join(SourceRecord, SourceRecord.id == RecordLink.from_record).where(
            SourceRecord.project_id.in_(actor.projects()), SourceRecord.record_kind == 'detail', RecordLink.review_state == 'confirmed')).all()
        for link in confirmed:
            a, b = root(link.from_record), root(link.to_record)
            if a != b:
                parents[a] = b
                merges += 1
        rows, next_cursor = paginate(db, query, SourceRecord, limit, cursor)
        output = []
        for row in rows:
            version = db.scalar(select(SourceRecordVersion).where(SourceRecordVersion.record_id == row.id, SourceRecordVersion.version == row.current_version))
            output.append(record_dto(row, version))
        return {'items': output, 'next_cursor': next_cursor, 'totals_by_kind': totals,
                'detail_groups_after_confirmed_links': totals.get('detail', 0) - merges,
                'counting_note': '原始记录按明细/复查/汇总分别统计，不能相加当独立隐患数。'}


@router.get('/reports')
def reports(actor: Actor = Depends(current_actor), project_id: str | None = None, source_id: str | None = None,
            record_kind: Literal['detail', 'review', 'summary'] | None = None,
            quality_status: Literal['valid', 'needs_review'] | None = None, from_date: date | None = None,
            to_date: date | None = None, limit: int = Query(20, ge=1, le=100), after_id: str = ''):
    with Session() as db:
        filters = [SourceRecord.project_id.in_(actor.projects())]
        if project_id:
            authorize(actor, 'read', project_id)
            filters.append(SourceRecord.project_id == project_id)
        if source_id:
            source_in(db, source_id, actor)
            filters.append(SourceRecord.source_id == source_id)
        if record_kind:
            filters.append(SourceRecord.record_kind == record_kind)
        if quality_status:
            filters.append(SourceRecord.quality_status == quality_status)
        if from_date:
            filters.append(SourceRecord.occurred_on >= from_date.isoformat())
        if to_date:
            filters.append(SourceRecord.occurred_on <= to_date.isoformat())
        counts = select(SourceRecord.document_id.label('document_id'), func.count().label('count'),
                        func.sum(case((SourceRecord.record_kind == 'detail', 1), else_=0)).label('details'),
                        func.sum(case((SourceRecord.record_kind == 'review', 1), else_=0)).label('reviews'),
                        func.sum(case((SourceRecord.record_kind == 'summary', 1), else_=0)).label('summaries')).where(*filters).group_by(SourceRecord.document_id).subquery()
        rows = db.execute(select(SourceDocument, counts.c.count, counts.c.details, counts.c.reviews, counts.c.summaries)
                          .join(counts, counts.c.document_id == SourceDocument.id).where(SourceDocument.id > after_id)
                          .order_by(SourceDocument.id).limit(limit + 1)).all()
        more = len(rows) > limit
        rows = rows[:limit]
        return {'items': [{'id': doc.id, 'report_id': doc.external_report_id, 'title': doc.title,
                           'source_id': doc.source_id, 'source_name': db.get(DataSource, doc.source_id).name,
                           'project_id': db.get(DataSource, doc.source_id).project_id, 'count': count,
                           'counts': {'detail': details, 'review': reviews, 'summary': summaries}, 'is_mock': True}
                          for doc, count, details, reviews, summaries in rows],
                'next_cursor': rows[-1][0].id if more else None}


def evidence_dto(db, evidence, actor):
    version = db.get(SourceRecordVersion, evidence.record_version_id)
    row = db.get(SourceRecord, version.record_id)
    authorize(actor, 'read', row.project_id)
    asset = db.get(FileAsset, evidence.asset_id) if evidence.asset_id else None
    allowed = asset and asset.project_id == row.project_id and asset.availability == 'available'
    return {'id': evidence.id, 'record_version_id': version.id, 'type': evidence.evidence_type,
            'locator': evidence.locator, 'relation_confidence': evidence.relation_confidence,
            'availability': 'available' if allowed else 'unavailable', 'asset_id': asset.id if allowed else None,
            'is_mock': True, 'note': '模拟资料，图片为标注示意图；缺失附件不生成伪预览。'}


@router.get('/records/{ident}')
def record_detail(ident: str, actor: Actor = Depends(current_actor), version: int | None = Query(None, ge=1)):
    with Session() as db:
        row = db.get(SourceRecord, ident)
        if not row:
            raise Problem(404, 'NOT_FOUND', '记录不存在。')
        source = source_in(db, row.source_id, actor)
        versions = db.scalars(select(SourceRecordVersion).where(SourceRecordVersion.record_id == row.id).order_by(SourceRecordVersion.version.desc())).all()
        selected = next((v for v in versions if v.version == (version or row.current_version)), None)
        if not selected:
            raise Problem(404, 'VERSION_NOT_FOUND', '版本不存在。')
        evidence = db.scalars(select(EvidenceItem).where(EvidenceItem.record_version_id == selected.id)).all()
        document_id = evidence[0].document_id if evidence else row.document_id
        links = db.scalars(select(RecordLink).where((RecordLink.from_record == row.id) | (RecordLink.to_record == row.id))).all()
        return {**record_dto(row, selected), 'source': source_dto(source), 'selected_version': selected.version,
                'raw_fields': selected.raw_fields, 'effective_fields': selected.effective_fields,
                'provenance': selected.provenance, 'issues': selected.issues,
                'document': {'id': document_id, 'report_id': db.get(SourceDocument, document_id).external_report_id,
                             'availability': 'unavailable', 'note': '只提供了结构化导出，未提供原报告附件。'},
                'versions': [{'version': v.version, 'content_hash': v.content_hash, 'created_at': v.created_at, 'batch_id': v.batch_id} for v in versions],
                'evidence': [evidence_dto(db, e, actor) for e in evidence],
                'links': [{'id': l.id, 'other_record_id': l.to_record if l.from_record == row.id else l.from_record,
                           'review_state': l.review_state, 'method': l.method, 'row_version': l.row_version,
                           'version_refs': l.version_refs} for l in links]}


@router.get('/evidence/{ident}')
def evidence(ident: str, actor: Actor = Depends(current_actor)):
    with Session() as db:
        item = db.get(EvidenceItem, ident)
        if not item:
            raise Problem(404, 'NOT_FOUND', '证据不存在。')
        return evidence_dto(db, item, actor)


@router.post('/record-links/{ident}/confirm')
def confirm_link(ident: str, data: ConfirmInput, request: Request, actor: Actor = Depends(current_actor)):
    with Session.begin() as db:
        link = db.scalar(select(RecordLink).where(RecordLink.id == ident).with_for_update())
        if not link:
            raise Problem(404, 'NOT_FOUND', '关联不存在。')
        # Lock records in fixed order so confirmation cannot race a version replacement.
        rows = db.scalars(select(SourceRecord).where(SourceRecord.id.in_([link.from_record, link.to_record])).order_by(SourceRecord.id).with_for_update()).all()
        for row in rows:
            authorize(actor, 'audit', row.project_id)
            current = db.scalar(select(SourceRecordVersion.id).where(SourceRecordVersion.record_id == row.id, SourceRecordVersion.version == row.current_version))
            if link.version_refs.get(row.id) != current:
                raise Problem(409, 'COMPARISON_STALE', '来源版本已变化，请重新比较。')
        if link.row_version != data.row_version:
            raise Problem(409, 'VERSION_CONFLICT', '候选已更新，请刷新后再确认。')
        link.review_state = data.decision
        link.row_version += 1
        audit(db, actor, 'record_link_' + data.decision, 'record_link', link.id, rows[0].project_id,
              request.state.request_id, link.row_version)
        return {'id': link.id, 'review_state': link.review_state, 'row_version': link.row_version,
                'note': '确认仅改变统计关联，不删除或合并原始记录。'}
