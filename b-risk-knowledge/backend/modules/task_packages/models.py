from datetime import datetime
from sqlalchemy import String, Integer, BigInteger, DateTime, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from ...db import Base
from ...models import new_id, utcnow


class TaskStream(Base):
    __tablename__ = 'task_package_streams'
    __table_args__ = (UniqueConstraint('producer', 'task_id'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    producer: Mapped[str] = mapped_column(String(128))
    task_id: Mapped[str] = mapped_column(String(128))
    org_id: Mapped[str] = mapped_column(String(128))
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    latest_received_version: Mapped[int] = mapped_column(BigInteger, default=0)
    # This watermark never decreases, including after withdrawal of the pointer.
    current_ready_version: Mapped[int] = mapped_column(BigInteger, default=0)
    current_package_id: Mapped[str | None] = mapped_column(String(36), nullable=True)


class TaskPackage(Base):
    __tablename__ = 'task_packages'
    __table_args__ = (UniqueConstraint('producer', 'task_id', 'package_version'),
                      UniqueConstraint('producer', 'package_id'))
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    stream_id: Mapped[str] = mapped_column(ForeignKey('task_package_streams.id'), index=True)
    producer: Mapped[str] = mapped_column(String(128))
    package_id: Mapped[str] = mapped_column(String(128))
    task_id: Mapped[str] = mapped_column(String(128), index=True)
    package_version: Mapped[int] = mapped_column(BigInteger)
    content_hash: Mapped[str] = mapped_column(String(64))
    schema_version: Mapped[str] = mapped_column(String(32))
    org_id: Mapped[str] = mapped_column(String(128))
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    scene_code: Mapped[str] = mapped_column(String(64))
    state: Mapped[str] = mapped_column(String(32), default='received', index=True)
    snapshot: Mapped[dict] = mapped_column(JSONB)
    is_demo: Mapped[bool] = mapped_column(Boolean)
    run_id: Mapped[str] = mapped_column(ForeignKey('processing_runs.id'), unique=True)
    actor_id: Mapped[str] = mapped_column(String(36))
    validation_errors: Mapped[list] = mapped_column(JSONB, default=list)
    warnings: Mapped[list] = mapped_column(JSONB, default=list)
    missing_fields: Mapped[list] = mapped_column(JSONB, default=list)
    capabilities: Mapped[list] = mapped_column(JSONB, default=list)
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    withdrawn_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    withdrawal_reason: Mapped[str | None] = mapped_column(String(2000), nullable=True)


class TaskEvent(Base):
    __tablename__ = 'task_events'
    __table_args__ = (UniqueConstraint('package_id', 'external_event_id'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    package_id: Mapped[str] = mapped_column(ForeignKey('task_packages.id'), index=True)
    external_event_id: Mapped[str] = mapped_column(String(128))
    position: Mapped[int] = mapped_column(Integer)
    event_type: Mapped[str] = mapped_column(String(64))
    occurred_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    actor: Mapped[dict] = mapped_column(JSONB)
    related_object_id: Mapped[str] = mapped_column(String(128))
    payload: Mapped[dict] = mapped_column(JSONB)
    evidence_refs: Mapped[list] = mapped_column(JSONB)
    is_known: Mapped[bool] = mapped_column(Boolean)


class TaskPackageAsset(Base):
    __tablename__ = 'task_package_assets'
    __table_args__ = (UniqueConstraint('package_id', 'external_attachment_id'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    package_id: Mapped[str] = mapped_column(ForeignKey('task_packages.id'), index=True)
    external_attachment_id: Mapped[str] = mapped_column(String(128))
    asset_id: Mapped[str | None] = mapped_column(ForeignKey('file_assets.id'), nullable=True, unique=True)
    access_ref: Mapped[dict] = mapped_column(JSONB)
    verification_state: Mapped[str] = mapped_column(String(32), default='pending')
    error: Mapped[str | None] = mapped_column(String(1000), nullable=True)


class PackageRequest(Base):
    __tablename__ = 'task_package_requests'
    __table_args__ = (UniqueConstraint('actor_id', 'producer', 'operation', 'idempotency_key'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    actor_id: Mapped[str] = mapped_column(String(36))
    producer: Mapped[str] = mapped_column(String(128))
    operation: Mapped[str] = mapped_column(String(32))
    idempotency_key: Mapped[str] = mapped_column(String(128))
    content_hash: Mapped[str] = mapped_column(String(64))
    package_id: Mapped[str] = mapped_column(ForeignKey('task_packages.id'))


class PackageInvalidation(Base):
    __tablename__ = 'task_package_invalidations'
    __table_args__ = (UniqueConstraint('package_id', 'event_type'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    package_id: Mapped[str] = mapped_column(ForeignKey('task_packages.id'), index=True)
    event_type: Mapped[str] = mapped_column(String(64), default='source_withdrawn')
    state: Mapped[str] = mapped_column(String(32), default='pending')
    payload: Mapped[dict] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
