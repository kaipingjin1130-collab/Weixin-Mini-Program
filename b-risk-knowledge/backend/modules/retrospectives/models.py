from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from ...db import Base
from ...models import new_id, utcnow


class Retrospective(Base):
    __tablename__ = 'retrospectives'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    source_key: Mapped[str] = mapped_column(String(200), unique=True)
    mode: Mapped[str] = mapped_column(String(32))
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    title: Mapped[str] = mapped_column(String(200))
    current_revision: Mapped[int] = mapped_column(Integer, default=1)
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    scope: Mapped[dict] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class RetrospectiveRevision(Base):
    __tablename__ = 'retrospective_revisions'
    __table_args__ = (UniqueConstraint('parent_id', 'version'), UniqueConstraint('parent_id', 'generation_key'))
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    parent_id: Mapped[str] = mapped_column(ForeignKey('retrospectives.id'), index=True)
    version: Mapped[int] = mapped_column(Integer)
    generation_key: Mapped[str | None] = mapped_column(String(64), nullable=True)
    input_fingerprint: Mapped[str] = mapped_column(String(64))
    sources: Mapped[dict] = mapped_column(JSONB)
    summary: Mapped[str] = mapped_column(String(4000))
    timeline: Mapped[dict] = mapped_column(JSONB)
    findings: Mapped[list] = mapped_column(JSONB)
    suggestions: Mapped[list] = mapped_column(JSONB)
    template_version: Mapped[str] = mapped_column(String(64))
    model_ref: Mapped[str] = mapped_column(String(128), default='deterministic-mock-summary-v1')
    state: Mapped[str] = mapped_column(String(32), default='draft')
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class RetrospectiveSource(Base):
    __tablename__ = 'retrospective_sources'
    __table_args__ = (CheckConstraint('(task_package_id IS NULL) <> (record_version_id IS NULL)', name='retro_source_xor'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    revision_id: Mapped[str] = mapped_column(ForeignKey('retrospective_revisions.id'), index=True)
    task_package_id: Mapped[str | None] = mapped_column(ForeignKey('task_packages.id'), nullable=True, index=True)
    record_version_id: Mapped[str | None] = mapped_column(ForeignKey('source_record_versions.id'), nullable=True)


class RetrospectiveEvidence(Base):
    __tablename__ = 'retrospective_evidence'
    __table_args__ = (UniqueConstraint('revision_id', 'reference'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    revision_id: Mapped[str] = mapped_column(ForeignKey('retrospective_revisions.id'), index=True)
    reference: Mapped[str] = mapped_column(String(200))
    kind: Mapped[str] = mapped_column(String(32))
    locator: Mapped[dict] = mapped_column(JSONB)
    text: Mapped[str] = mapped_column(String(4000))
    asset_id: Mapped[str | None] = mapped_column(ForeignKey('file_assets.id'), nullable=True)


class ExperienceConversion(Base):
    __tablename__ = 'retrospective_experience_conversions'
    __table_args__ = (UniqueConstraint('revision_id', 'type'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    revision_id: Mapped[str] = mapped_column(ForeignKey('retrospective_revisions.id'))
    type: Mapped[str] = mapped_column(String(32))
    item_id: Mapped[str] = mapped_column(ForeignKey('knowledge_items.id'))
