from sqlalchemy import String, Integer, UniqueConstraint, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from ...db import Base
from ...models import new_id, utcnow
from datetime import datetime


class SceneRevision(Base):
    __tablename__ = 'scene_revisions'
    __table_args__ = (UniqueConstraint('project_id','code','version'),)
    id: Mapped[str] = mapped_column(String(36),primary_key=True,default=new_id)
    project_id: Mapped[str] = mapped_column(String(128),index=True)
    code: Mapped[str] = mapped_column(String(64))
    version: Mapped[int] = mapped_column(Integer)
    payload: Mapped[dict] = mapped_column(JSONB)
    active_scope: Mapped[str | None] = mapped_column(String(200),nullable=True,unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True),default=utcnow)
