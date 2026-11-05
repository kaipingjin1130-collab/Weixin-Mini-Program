"""Report image evidence. No changes to the 14 business fields."""
from sqlalchemy import Column,String,Integer,Text,ForeignKey,UniqueConstraint,DateTime
from sqlalchemy.dialects.postgresql import JSONB
from ...db import Base
from ...models import new_id,utcnow

class HistoryImage(Base):
    __tablename__='history_images'
    id=Column(String(36),primary_key=True,default=new_id)
    document_id=Column(ForeignKey('history_documents.id'),nullable=False,index=True)
    asset_id=Column(ForeignKey('file_assets.id'),nullable=False)
    sha256=Column(String(64),nullable=False)
    width=Column(Integer)
    height=Column(Integer)
    __table_args__=(UniqueConstraint('document_id','sha256'),)

class HistoryImageOccurrence(Base):
    __tablename__='history_image_occurrences'
    id=Column(String(36),primary_key=True,default=new_id)
    image_id=Column(ForeignKey('history_images.id'),nullable=False,index=True)
    source_key=Column(String(64),nullable=False)
    locator=Column(JSONB,nullable=False)
    method=Column(String(64),nullable=False)
    kind=Column(String(32),nullable=False)
    __table_args__=(UniqueConstraint('image_id','source_key'),)

class HistoryImageLink(Base):
    __tablename__='history_image_links'
    id=Column(String(36),primary_key=True,default=new_id)
    occurrence_id=Column(ForeignKey('history_image_occurrences.id'),nullable=False,index=True)
    finding_id=Column(ForeignKey('history_findings.id'),nullable=False,index=True)
    relation=Column(String(32),nullable=False)
    __table_args__=(UniqueConstraint('occurrence_id','finding_id'),)

class HistoryMediaRun(Base):
    __tablename__='history_media_runs'
    id=Column(String(36),primary_key=True,default=new_id)
    import_id=Column(ForeignKey('history_imports.id'),nullable=False,index=True)
    version=Column(String(64),nullable=False)
    status=Column(String(32),nullable=False)
    counts=Column(JSONB,nullable=False)
    issues=Column(JSONB,nullable=False)
    created_at=Column(DateTime(timezone=True),default=utcnow,nullable=False)
    __table_args__=(UniqueConstraint('import_id','version'),)
