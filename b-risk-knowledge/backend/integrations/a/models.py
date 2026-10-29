from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from ...db import Base
from ...models import new_id, utcnow


class AImport(Base):
    __tablename__ = 'a_imports'
    __table_args__ = (UniqueConstraint('org_id', 'delivery_id', 'delivery_version'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    org_id: Mapped[str] = mapped_column(String(128))
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    task_id: Mapped[str] = mapped_column(String(128))
    delivery_id: Mapped[str] = mapped_column(String(128))
    delivery_version: Mapped[int] = mapped_column(Integer)
    version: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(32), default='queued')
    run_id: Mapped[str] = mapped_column(ForeignKey('processing_runs.id'))
    receipt_id: Mapped[str | None] = mapped_column(ForeignKey('task_packages.id'), nullable=True)
    retrospective_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    retrospective_run_id: Mapped[str | None] = mapped_column(ForeignKey('processing_runs.id'), nullable=True)
    retrospective_status: Mapped[str] = mapped_column(String(32), default='not_created')
    source_metadata: Mapped[dict] = mapped_column(JSONB, default=dict)
    error: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class ARequest(Base):
    __tablename__ = 'a_import_requests'
    __table_args__ = (UniqueConstraint('org_id', 'actor_id', 'key'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    org_id: Mapped[str] = mapped_column(String(128))
    actor_id: Mapped[str] = mapped_column(String(36))
    key: Mapped[str] = mapped_column(String(128))
    digest: Mapped[str] = mapped_column(String(64))
    import_id: Mapped[str] = mapped_column(ForeignKey('a_imports.id'))
