from datetime import datetime
from sqlalchemy import String, Integer, JSON, DateTime, UniqueConstraint, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from ...db import Base
from ...models import new_id, utcnow


class DataSource(Base):
    __tablename__ = 'data_sources'
    __table_args__ = (UniqueConstraint('project_id', 'namespace'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str] = mapped_column(String(200))
    kind: Mapped[str] = mapped_column(String(32))
    namespace: Mapped[str] = mapped_column(String(128))
    config: Mapped[dict] = mapped_column(JSONB, default=dict)
    mapping_version: Mapped[str] = mapped_column(String(64))
    cursor: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class ImportBatch(Base):
    __tablename__ = 'import_batches'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    source_id: Mapped[str] = mapped_column(ForeignKey('data_sources.id'), index=True)
    run_id: Mapped[str] = mapped_column(ForeignKey('processing_runs.id'), unique=True)
    input_asset_id: Mapped[str] = mapped_column(ForeignKey('file_assets.id'))
    input_hash: Mapped[str] = mapped_column(String(64))
    mapping: Mapped[dict] = mapped_column(JSONB)
    rule_version: Mapped[str] = mapped_column(String(64), default='b02-rules-1')
    status: Mapped[str] = mapped_column(String(32), default='queued')
    counts: Mapped[dict] = mapped_column(JSONB, default=dict)
    options: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class SourceDocument(Base):
    __tablename__ = 'source_documents'
    __table_args__ = (UniqueConstraint('source_id', 'external_report_id'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    source_id: Mapped[str] = mapped_column(ForeignKey('data_sources.id'))
    external_report_id: Mapped[str] = mapped_column(String(256))
    sha256: Mapped[str | None] = mapped_column(String(64), nullable=True)
    title: Mapped[str] = mapped_column(String(256))
    asset_id: Mapped[str | None] = mapped_column(ForeignKey('file_assets.id'), nullable=True)


class SourceRecord(Base):
    __tablename__ = 'source_records'
    __table_args__ = (UniqueConstraint('source_id', 'external_record_id'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    source_id: Mapped[str] = mapped_column(ForeignKey('data_sources.id'), index=True)
    document_id: Mapped[str] = mapped_column(ForeignKey('source_documents.id'))
    external_record_id: Mapped[str] = mapped_column(String(256))
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    record_kind: Mapped[str] = mapped_column(String(32), index=True)
    current_version: Mapped[int] = mapped_column(Integer, default=1)
    quality_status: Mapped[str] = mapped_column(String(32))
    occurred_on: Mapped[str | None] = mapped_column(String(10), nullable=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class SourceRecordVersion(Base):
    __tablename__ = 'source_record_versions'
    __table_args__ = (UniqueConstraint('record_id', 'version'), UniqueConstraint('record_id', 'content_hash'))
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    record_id: Mapped[str] = mapped_column(ForeignKey('source_records.id'), index=True)
    version: Mapped[int] = mapped_column(Integer)
    content_hash: Mapped[str] = mapped_column(String(64))
    raw_fields: Mapped[dict] = mapped_column(JSONB)
    effective_fields: Mapped[dict] = mapped_column(JSONB)
    provenance: Mapped[dict] = mapped_column(JSONB)
    issues: Mapped[list] = mapped_column(JSONB, default=list)
    batch_id: Mapped[str] = mapped_column(ForeignKey('import_batches.id'))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class EvidenceItem(Base):
    __tablename__ = 'evidence_items'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    document_id: Mapped[str] = mapped_column(ForeignKey('source_documents.id'))
    record_version_id: Mapped[str] = mapped_column(ForeignKey('source_record_versions.id'), index=True)
    locator: Mapped[dict] = mapped_column(JSONB)
    evidence_type: Mapped[str] = mapped_column(String(32))
    asset_id: Mapped[str | None] = mapped_column(ForeignKey('file_assets.id'), nullable=True)
    relation_confidence: Mapped[str] = mapped_column(String(32))


class RecordLink(Base):
    __tablename__ = 'record_links'
    __table_args__ = (UniqueConstraint('from_record', 'to_record'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    from_record: Mapped[str] = mapped_column(ForeignKey('source_records.id'), index=True)
    to_record: Mapped[str] = mapped_column(ForeignKey('source_records.id'))
    relation_type: Mapped[str] = mapped_column(String(32), default='possible_duplicate')
    method: Mapped[str] = mapped_column(String(64), default='exact_description_same_project')
    review_state: Mapped[str] = mapped_column(String(32), default='candidate')
    version_refs: Mapped[dict] = mapped_column(JSONB)
    row_version: Mapped[int] = mapped_column(Integer, default=1)


class ImportRow(Base):
    __tablename__ = 'import_rows'
    __table_args__ = (UniqueConstraint('batch_id', 'row_number'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    batch_id: Mapped[str] = mapped_column(ForeignKey('import_batches.id'), index=True)
    row_number: Mapped[int] = mapped_column(Integer)
    outcome: Mapped[str] = mapped_column(String(16))
    record_id: Mapped[str | None] = mapped_column(ForeignKey('source_records.id'), nullable=True)
    version_id: Mapped[str | None] = mapped_column(ForeignKey('source_record_versions.id'), nullable=True)
    issues: Mapped[list] = mapped_column(JSONB, default=list)
    raw_fields: Mapped[dict] = mapped_column(JSONB)
