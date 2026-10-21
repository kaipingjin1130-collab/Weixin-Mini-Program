from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, UniqueConstraint, Float, Index, text
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector
from ...db import Base
from ...models import new_id, utcnow


class KnowledgeRelease(Base):
    __tablename__ = 'knowledge_releases'
    __table_args__ = (Index('uq_active_release_project', 'active_scope', unique=True,
                            postgresql_where=text("state = 'active'")),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    version: Mapped[str] = mapped_column(String(128), unique=True)
    state: Mapped[str] = mapped_column(String(32), default='queued')
    active_scope: Mapped[str] = mapped_column(String(128), index=True)
    index_config: Mapped[dict] = mapped_column(JSONB)
    run_id: Mapped[str] = mapped_column(ForeignKey('processing_runs.id'), unique=True)
    actor_id: Mapped[str] = mapped_column(String(36))
    row_version: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    build_ms: Mapped[float | None] = mapped_column(Float, nullable=True)


class ReleaseEntry(Base):
    __tablename__ = 'release_entries'
    __table_args__ = (UniqueConstraint('release_id', 'knowledge_revision_id'),)
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    release_id: Mapped[str] = mapped_column(ForeignKey('knowledge_releases.id'), index=True)
    knowledge_revision_id: Mapped[str] = mapped_column(ForeignKey('knowledge_revisions.id'))
    state: Mapped[str] = mapped_column(String(32), default='pending')
    error: Mapped[str | None] = mapped_column(String(1000), nullable=True)


class SearchChunk(Base):
    __tablename__ = 'search_chunks'
    __table_args__ = (UniqueConstraint('revision_id', 'chunk_version', 'claim_path'),
                      Index('ix_search_chunks_keywords', 'keywords', postgresql_using='gin'))
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    revision_id: Mapped[str] = mapped_column(ForeignKey('knowledge_revisions.id'), index=True)
    chunk_version: Mapped[str] = mapped_column(String(64))
    claim_path: Mapped[str] = mapped_column(String(128))
    text: Mapped[str] = mapped_column(String(20000))
    keywords: Mapped[list] = mapped_column(ARRAY(String))
    meta: Mapped[dict] = mapped_column('metadata', JSONB)
    scope: Mapped[str] = mapped_column(String(128), index=True)


class EmbeddingSet(Base):
    __tablename__ = 'embedding_sets'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    release_id: Mapped[str] = mapped_column(ForeignKey('knowledge_releases.id'), unique=True)
    model: Mapped[str] = mapped_column(String(128))
    model_version: Mapped[str] = mapped_column(String(64))
    dimension: Mapped[int] = mapped_column(Integer)
    chunk_strategy: Mapped[str] = mapped_column(String(64))
    state: Mapped[str] = mapped_column(String(32), default='building')


class ChunkEmbedding(Base):
    __tablename__ = 'chunk_embeddings'
    __table_args__ = ({'postgresql_partition_by': 'LIST (embedding_set_id)'},)
    chunk_id: Mapped[str] = mapped_column(ForeignKey('search_chunks.id'), primary_key=True)
    embedding_set_id: Mapped[str] = mapped_column(ForeignKey('embedding_sets.id'), primary_key=True)
    # Each set has its own partition, dimension CHECK and typed HNSW index.
    vector: Mapped[list] = mapped_column(Vector())


class SearchRun(Base):
    __tablename__ = 'search_runs'
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    actor_id: Mapped[str] = mapped_column(String(36), index=True)
    project_id: Mapped[str] = mapped_column(String(128))
    query: Mapped[str] = mapped_column(String(64))  # SHA256 only; never persist query body.
    parameters: Mapped[dict] = mapped_column(JSONB)
    release_id: Mapped[str | None] = mapped_column(ForeignKey('knowledge_releases.id'), nullable=True)
    result_refs: Mapped[list] = mapped_column(JSONB)
    latency: Mapped[float] = mapped_column(Float)
    model_ref: Mapped[str] = mapped_column(String(128))
    feedback: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, index=True)
