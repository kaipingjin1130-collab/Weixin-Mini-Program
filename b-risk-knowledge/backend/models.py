from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import String, Integer, DateTime, JSON, UniqueConstraint, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .db import Base


def new_id():
    return str(uuid4())


def utcnow():
    return datetime.now(timezone.utc)


class UserLink(Base):
    __tablename__ = "user_links"
    __table_args__ = (UniqueConstraint("issuer", "subject_id"),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    issuer: Mapped[str] = mapped_column(String(128))
    subject_id: Mapped[str] = mapped_column(String(128))
    display_name: Mapped[str] = mapped_column(String(128))
    authorized_projects: Mapped[list] = mapped_column(JSON, default=list)


class RoleBinding(Base):
    __tablename__ = "role_bindings"
    __table_args__ = (UniqueConstraint("user_id", "role", "scope_type", "scope_id"),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    user_id: Mapped[str] = mapped_column(ForeignKey("user_links.id"))
    role: Mapped[str] = mapped_column(String(32))
    scope_type: Mapped[str] = mapped_column(String(32), default="project")
    scope_id: Mapped[str] = mapped_column(String(128))
    row_version: Mapped[int] = mapped_column(Integer, default=1)


class AuditEvent(Base):
    __tablename__ = "audit_events"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    actor_id: Mapped[str] = mapped_column(String(36))
    object_type: Mapped[str] = mapped_column(String(64))
    object_id: Mapped[str] = mapped_column(String(128))
    action: Mapped[str] = mapped_column(String(64))
    project_id: Mapped[str] = mapped_column(String(128))
    object_version: Mapped[int | None] = mapped_column(Integer, nullable=True)
    request_id: Mapped[str] = mapped_column(String(128))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class ProcessingRun(Base):
    __tablename__ = "processing_runs"
    __table_args__ = (UniqueConstraint("actor_id", "idempotency_key"),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    kind: Mapped[str] = mapped_column(String(64), default="demo_check")
    object_id: Mapped[str] = mapped_column(String(128))
    project_id: Mapped[str] = mapped_column(String(128), index=True)
    actor_id: Mapped[str] = mapped_column(ForeignKey("user_links.id"))
    title: Mapped[str] = mapped_column(String(200))
    idempotency_key: Mapped[str] = mapped_column(String(128))
    input_hash: Mapped[str] = mapped_column(String(64))
    payload: Mapped[dict] = mapped_column(JSON)
    queue_job_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(32), default="queued")
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    result_ref: Mapped[str | None] = mapped_column(String(36), nullable=True)
    error: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class FileAsset(Base):
    __tablename__ = "file_assets"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    source_run_id: Mapped[str | None] = mapped_column(ForeignKey("processing_runs.id"), unique=True, nullable=True)
    storage_key: Mapped[str] = mapped_column(String(256))
    sha256: Mapped[str] = mapped_column(String(64))
    mime_type: Mapped[str] = mapped_column(String(128))
    size: Mapped[int] = mapped_column(Integer)
    org_id: Mapped[str] = mapped_column(String(128), default="demo-org")
    project_id: Mapped[str] = mapped_column(String(128))
    availability: Mapped[str] = mapped_column(String(32), default="available")


class RetryRequest(Base):
    __tablename__ = "retry_requests"
    __table_args__ = (UniqueConstraint("actor_id", "idempotency_key"),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    actor_id: Mapped[str] = mapped_column(ForeignKey("user_links.id"))
    idempotency_key: Mapped[str] = mapped_column(String(128))
    run_id: Mapped[str] = mapped_column(ForeignKey("processing_runs.id"))
    input_hash: Mapped[str] = mapped_column(String(64))
