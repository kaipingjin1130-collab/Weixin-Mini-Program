from datetime import date, datetime
from sqlalchemy import String, Integer, Date, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from ...db import Base
from ...models import new_id, utcnow


class StandardRevision(Base):
    __tablename__ = 'standard_revisions'
    __table_args__ = (
        UniqueConstraint('project_id', 'code', 'edition', 'version'),
        CheckConstraint('valid_until IS NULL OR valid_until > valid_from', name='standard_dates_valid'),
        CheckConstraint("state IN ('draft','pending_review','changes_requested','approved','published','superseded','withdrawn')", name='standard_state_valid'),
    )
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    code: Mapped[str] = mapped_column(String(128))
    edition: Mapped[str] = mapped_column(String(100))
    version: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(300))
    source_asset_id: Mapped[str] = mapped_column(ForeignKey('file_assets.id'))
    source_sha256: Mapped[str] = mapped_column(String(64))
    valid_from: Mapped[date] = mapped_column(Date)
    valid_until: Mapped[date | None] = mapped_column(Date, nullable=True)
    scope: Mapped[dict] = mapped_column(JSONB)
    maintainer: Mapped[str] = mapped_column(String(200))
    state: Mapped[str] = mapped_column(String(32), default='draft', index=True)
    verified_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    reviewed_by: Mapped[str | None] = mapped_column(String(36), nullable=True)
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class StandardClause(Base):
    __tablename__ = 'standard_clauses'
    __table_args__ = (UniqueConstraint('standard_revision_id', 'number'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    standard_revision_id: Mapped[str] = mapped_column(ForeignKey('standard_revisions.id'), index=True)
    number: Mapped[str] = mapped_column(String(100))
    position: Mapped[int] = mapped_column(Integer)
    content: Mapped[dict] = mapped_column(JSONB)


class StandardReview(Base):
    __tablename__ = 'standard_reviews'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    standard_revision_id: Mapped[str] = mapped_column(ForeignKey('standard_revisions.id'), index=True)
    action: Mapped[str] = mapped_column(String(32))
    actor_id: Mapped[str] = mapped_column(String(36))
    reason: Mapped[str] = mapped_column(String(2000))
    row_version: Mapped[int] = mapped_column(Integer)
    evidence_checked: Mapped[bool]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class StandardSubmission(Base):
    __tablename__ = 'standard_submissions'
    __table_args__ = (UniqueConstraint('actor_id', 'idempotency_key'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    actor_id: Mapped[str] = mapped_column(String(36))
    idempotency_key: Mapped[str] = mapped_column(String(128))
    input_hash: Mapped[str] = mapped_column(String(64))
    revision_id: Mapped[str] = mapped_column(ForeignKey('standard_revisions.id'))
