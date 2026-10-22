from datetime import datetime
from sqlalchemy import String, Integer, DateTime, UniqueConstraint, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from ...db import Base
from ...models import new_id, utcnow


class QualityIssue(Base):
    __tablename__ = 'quality_issues'
    __table_args__ = (UniqueConstraint('record_version_id', 'rule_code'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    record_version_id: Mapped[str] = mapped_column(ForeignKey('source_record_versions.id'), index=True)
    rule_code: Mapped[str] = mapped_column(String(64))
    field: Mapped[str] = mapped_column(String(64))
    severity: Mapped[str] = mapped_column(String(32))
    message: Mapped[str] = mapped_column(String(1000))
    status: Mapped[str] = mapped_column(String(32), default='open')
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class RecordAnnotation(Base):
    __tablename__ = 'record_annotations'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    record_version_id: Mapped[str] = mapped_column(ForeignKey('source_record_versions.id'), index=True)
    issue_id: Mapped[str] = mapped_column(ForeignKey('quality_issues.id'))
    field: Mapped[str] = mapped_column(String(64))
    value: Mapped[dict] = mapped_column(JSONB)
    source_kind: Mapped[str] = mapped_column(String(32), default='human_annotation')
    actor: Mapped[str] = mapped_column(String(36))
    reason: Mapped[str] = mapped_column(String(2000))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class KnowledgeItem(Base):
    __tablename__ = 'knowledge_items'
    __table_args__ = (UniqueConstraint('record_version_id', 'type', 'template_version'),
        UniqueConstraint('retrospective_revision_id', 'type', 'template_version', name='knowledge_retro_unique'),
        CheckConstraint('(record_version_id IS NULL) <> (retrospective_revision_id IS NULL)', name='knowledge_source_xor'))
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    record_version_id: Mapped[str | None] = mapped_column(ForeignKey('source_record_versions.id'), index=True, nullable=True)
    retrospective_revision_id: Mapped[str | None] = mapped_column(ForeignKey('retrospective_revisions.id'), nullable=True, index=True)
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    type: Mapped[str] = mapped_column(String(32))
    title: Mapped[str] = mapped_column(String(200))
    scene_code: Mapped[str] = mapped_column(String(64), default='generic')
    object_type: Mapped[str] = mapped_column(String(64), default='construction_risk')
    scope: Mapped[dict] = mapped_column(JSONB)
    template_version: Mapped[str] = mapped_column(String(64))
    current_revision: Mapped[int] = mapped_column(Integer, default=1)
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    withdrawn_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    withdrawal_reason: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class KnowledgeRevision(Base):
    __tablename__ = 'knowledge_revisions'
    __table_args__ = (UniqueConstraint('item_id', 'version'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    item_id: Mapped[str] = mapped_column(ForeignKey('knowledge_items.id'), index=True)
    version: Mapped[int] = mapped_column(Integer)
    content: Mapped[dict] = mapped_column(JSONB)
    schema_version: Mapped[str] = mapped_column(String(64), default='knowledge-card-v2')
    template_version: Mapped[str] = mapped_column(String(64))
    model_ref: Mapped[str] = mapped_column(String(128))
    state: Mapped[str] = mapped_column(String(32), default='draft', index=True)
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class KnowledgeEvidenceLink(Base):
    __tablename__ = 'knowledge_evidence_links'
    __table_args__ = (UniqueConstraint('revision_id', 'claim_path', 'evidence_id'),
        UniqueConstraint('revision_id', 'claim_path', 'retrospective_evidence_id', name='knowledge_retro_evidence_unique'),
        CheckConstraint('(evidence_id IS NULL) <> (retrospective_evidence_id IS NULL)', name='knowledge_evidence_xor'))
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    revision_id: Mapped[str] = mapped_column(ForeignKey('knowledge_revisions.id'), index=True)
    claim_path: Mapped[str] = mapped_column(String(128))
    evidence_id: Mapped[str | None] = mapped_column(ForeignKey('evidence_items.id'), nullable=True)
    retrospective_evidence_id: Mapped[str | None] = mapped_column(ForeignKey('retrospective_evidence.id'), nullable=True)
    relation_type: Mapped[str] = mapped_column(String(32), default='source_fact')


class ReviewAction(Base):
    __tablename__ = 'review_actions'
    __table_args__ = (CheckConstraint("object_type IN ('knowledge_revision','retrospective_revision','question_revision')", name='review_object_type'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    object_type: Mapped[str] = mapped_column(String(64), default='knowledge_revision')
    # Shared polymorphic review ledger. Dispatch validates target type, exact revision
    # and authorization in its owning domain service; IDs are immutable UUIDs.
    object_id: Mapped[str] = mapped_column(String(36))
    revision_id: Mapped[str] = mapped_column(String(36), index=True)
    object_version: Mapped[int] = mapped_column(Integer)
    action: Mapped[str] = mapped_column(String(32))
    reviewer: Mapped[str] = mapped_column(String(36))
    reason: Mapped[str] = mapped_column(String(2000))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class GenerationEntry(Base):
    __tablename__ = 'generation_entries'
    __table_args__ = (UniqueConstraint('run_id', 'record_version_id'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    run_id: Mapped[str] = mapped_column(ForeignKey('processing_runs.id'), index=True)
    record_version_id: Mapped[str] = mapped_column(ForeignKey('source_record_versions.id'))
    outcome: Mapped[str] = mapped_column(String(32))
    item_id: Mapped[str | None] = mapped_column(ForeignKey('knowledge_items.id'), nullable=True)
    error: Mapped[str | None] = mapped_column(String(1000), nullable=True)
