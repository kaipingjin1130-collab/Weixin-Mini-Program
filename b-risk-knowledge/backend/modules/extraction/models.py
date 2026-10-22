from datetime import datetime
from sqlalchemy import String,Integer,DateTime,ForeignKey,UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped,mapped_column
from ...db import Base
from ...models import new_id,utcnow


class TaxonomyRevision(Base):
    __tablename__='knowledge_taxonomy_revisions'
    __table_args__=(UniqueConstraint('project_id','version'),)
    id:Mapped[str]=mapped_column(String(36),primary_key=True,default=new_id)
    project_id:Mapped[str]=mapped_column(String(128),index=True)
    version:Mapped[int]=mapped_column(Integer)
    categories:Mapped[list]=mapped_column(JSONB)
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=utcnow)


class KnowledgeSource(Base):
    __tablename__='knowledge_source_versions'
    __table_args__=(UniqueConstraint('item_id','record_version_id'),)
    id:Mapped[str]=mapped_column(String(36),primary_key=True,default=new_id)
    item_id:Mapped[str]=mapped_column(ForeignKey('knowledge_items.id'),index=True)
    record_version_id:Mapped[str]=mapped_column(ForeignKey('source_record_versions.id'),index=True)


class ExtractionRun(Base):
    __tablename__='knowledge_extraction_runs'
    id:Mapped[str]=mapped_column(String(36),primary_key=True,default=new_id)
    run_id:Mapped[str]=mapped_column(ForeignKey('processing_runs.id'),unique=True)
    taxonomy_id:Mapped[str]=mapped_column(ForeignKey('knowledge_taxonomy_revisions.id'))
    source_versions:Mapped[list]=mapped_column(JSONB)
    config_fingerprint:Mapped[str]=mapped_column(String(64))
    config_snapshot:Mapped[dict]=mapped_column(JSONB)
    prompt_version:Mapped[str]=mapped_column(String(64),default='construction-extraction-v1')
    result:Mapped[dict]=mapped_column(JSONB,default=dict)
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=utcnow)
