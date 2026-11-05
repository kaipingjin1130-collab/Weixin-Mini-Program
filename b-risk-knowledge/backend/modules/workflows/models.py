from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from ...db import Base
from ...models import new_id, utcnow


class WorkRevision(Base):
    __tablename__ = 'work_revisions'
    __table_args__ = (UniqueConstraint('org_id', 'project_id', 'kind', 'series', 'version'),
        CheckConstraint("state IN ('draft','pending_review','approved','published','changes_requested','superseded','withdrawn')", name='work_state_valid'))
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    org_id: Mapped[str] = mapped_column(String(128), index=True)
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    kind: Mapped[str] = mapped_column(String(32), index=True)
    series: Mapped[str] = mapped_column(String(128))
    version: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(300))
    content: Mapped[dict] = mapped_column(JSONB)
    state: Mapped[str] = mapped_column(String(32), default='draft', index=True)
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_by: Mapped[str] = mapped_column(String(36))
    reviewed_by: Mapped[str | None] = mapped_column(String(36), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)


class WorkDependency(Base):
    __tablename__ = 'work_dependencies'
    __table_args__ = (UniqueConstraint('revision_id', 'source_kind', 'source_id'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    revision_id: Mapped[str] = mapped_column(ForeignKey('work_revisions.id'), index=True)
    source_kind: Mapped[str] = mapped_column(String(32))
    source_id: Mapped[str] = mapped_column(String(128), index=True)
    fingerprint: Mapped[str] = mapped_column(String(64))


class WorkReview(Base):
    __tablename__ = 'work_reviews'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    revision_id: Mapped[str] = mapped_column(ForeignKey('work_revisions.id'), index=True)
    action: Mapped[str] = mapped_column(String(32))
    actor_id: Mapped[str] = mapped_column(String(36))
    reason: Mapped[str] = mapped_column(String(2000))
    row_version: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class WorkSubmission(Base):
    __tablename__ = 'work_submissions'
    __table_args__ = (UniqueConstraint('actor_id', 'key'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    actor_id: Mapped[str] = mapped_column(String(36))
    key: Mapped[str] = mapped_column(String(128))
    digest: Mapped[str] = mapped_column(String(64))
    revision_id: Mapped[str] = mapped_column(ForeignKey('work_revisions.id'))


class EventRecord(Base):
    """One source record may describe multiple events; distinct grain is explicit."""
    __tablename__ = 'event_records'
    __table_args__ = (UniqueConstraint('revision_id', 'record_key', 'kind'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    revision_id: Mapped[str] = mapped_column(ForeignKey('work_revisions.id'), index=True)
    record_key: Mapped[str] = mapped_column(String(200), index=True)
    kind: Mapped[str] = mapped_column(String(32))
    content: Mapped[dict] = mapped_column(JSONB)
