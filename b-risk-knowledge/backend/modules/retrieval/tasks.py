import time
from uuid import UUID
from sqlalchemy import select, text
from ...queue import queue_app
from ...db import Session
from ...models import ProcessingRun, utcnow
from ...auth import Problem
from ..knowledge.tasks import actor_for
from .models import KnowledgeRelease, ReleaseEntry, EmbeddingSet, SearchChunk, ChunkEmbedding
from .publication import approved_for_release
from .adapters import get_embedding, terms, STRATEGY


def partition(db, embedding):
    suffix = UUID(embedding.id).hex
    dimension = int(embedding.dimension)
    if not 1 <= dimension <= 2000:
        raise ValueError('Unsupported HNSW dimension')
    name = 'emb_'+suffix
    db.execute(text(f"CREATE TABLE IF NOT EXISTS {name} PARTITION OF chunk_embeddings FOR VALUES IN ('{embedding.id}')"))
    exists = db.scalar(text('SELECT 1 FROM pg_constraint WHERE conname=:name'), {'name': name+'_dims'})
    if not exists:
        db.execute(text(f'ALTER TABLE {name} ADD CONSTRAINT {name}_dims CHECK(vector_dims(vector)={dimension})'))
    db.execute(text(f'CREATE INDEX IF NOT EXISTS {name}_hnsw ON {name} USING hnsw ((vector::vector({dimension})) vector_cosine_ops)'))


@queue_app.task(name='b04.release_build', queue='b01')
def build_release(run_id: str):
    started = time.perf_counter()
    with Session.begin() as db:
        run = db.get(ProcessingRun, run_id)
        if not run or run.status == 'succeeded':
            return
        run.status, run.error, run.attempts = 'running', None, run.attempts+1
        run.row_version += 1
        release = db.get(KnowledgeRelease, run.object_id)
        release.state = 'building'
        release.row_version += 1
        embedding = db.scalar(select(EmbeddingSet).where(EmbeddingSet.release_id == release.id))
        embedding.state = 'building'
        entry_ids = list(db.scalars(select(ReleaseEntry.id).where(ReleaseEntry.release_id == release.id).order_by(ReleaseEntry.id)))
        release_id = release.id
    try:
        with Session.begin() as db:
            embedding = db.scalar(select(EmbeddingSet).where(EmbeddingSet.release_id == release_id))
            partition(db, embedding)
        for n, ident in enumerate(entry_ids, 1):
            with Session.begin() as db:
                run = db.get(ProcessingRun, run_id)
                actor = actor_for(db, run.actor_id, run)
                entry = db.get(ReleaseEntry, ident)
                if entry.state == 'ready':
                    continue
                try:
                    with db.begin_nested():
                        if run.payload['mock_scenario'] == 'index_failure':
                            raise Problem(503, 'SIMULATED_INDEX_FAILURE', '模拟索引失败；现有发布保持启用。')
                        item, revision = approved_for_release(db, entry.knowledge_revision_id, actor, run.project_id, current=False)
                        embedding = db.scalar(select(EmbeddingSet).where(EmbeddingSet.release_id == release_id))
                        adapter = get_embedding(embedding.model)
                        claims = [(f'/facts/{i}/text',f) for i,f in enumerate(revision.content['facts'])]
                        claims += [(f'/construction_points/{i}/content',{'text':p['content'],'evidence_ids':p['evidence_ids']})
                                   for i,p in enumerate(revision.content.get('construction_points',[])) if p['claim_kind']=='source_summary']
                        for path, fact in claims:
                            db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:key,0))'), {'key': f'chunk:{revision.id}:{STRATEGY}:{path}'})
                            chunk = db.scalar(select(SearchChunk).where(SearchChunk.revision_id == revision.id,
                                SearchChunk.chunk_version == STRATEGY, SearchChunk.claim_path == path))
                            if not chunk:
                                chunk = SearchChunk(revision_id=revision.id, chunk_version=STRATEGY, claim_path=path,
                                    text=fact['text'], keywords=terms(revision.content['title']+' '+fact['text']),
                                    meta={'evidence_ids': fact['evidence_ids'], 'scene_code': item.scene_code,
                                          'object_type': item.object_type, 'type': item.type}, scope=item.project_id)
                                db.add(chunk)
                                db.flush()
                            if not db.get(ChunkEmbedding, (chunk.id, embedding.id)):
                                db.add(ChunkEmbedding(chunk_id=chunk.id, embedding_set_id=embedding.id,
                                    vector=adapter.embed(revision.content['title']+' '+fact['text'])))
                        entry.state, entry.error = 'ready', None
                except Problem as exc:
                    entry.state, entry.error = 'failed', exc.message
                run.progress = int(n/len(entry_ids)*100)
                run.updated_at = utcnow()
        with Session.begin() as db:
            run = db.get(ProcessingRun, run_id)
            release = db.get(KnowledgeRelease, release_id)
            failed = db.scalar(select(ReleaseEntry.id).where(ReleaseEntry.release_id == release_id, ReleaseEntry.state != 'ready').limit(1))
            release.state = 'failed' if failed else 'ready'
            release.row_version += 1
            release.build_ms = round((time.perf_counter()-started)*1000, 2)
            run.status, run.progress = ('failed' if failed else 'succeeded'), 100
            run.error = '部分索引项失败；请查看发布详情。' if failed else None
            run.row_version += 1
            run.updated_at = utcnow()
            db.scalar(select(EmbeddingSet).where(EmbeddingSet.release_id == release_id)).state = release.state
    except Exception:
        with Session.begin() as db:
            run = db.get(ProcessingRun, run_id)
            run.status, run.error = 'failed', '索引构建中断；可重试，现有发布不受影响。'
            run.row_version += 1
            release = db.get(KnowledgeRelease, release_id)
            release.state, release.build_ms = 'failed', round((time.perf_counter()-started)*1000, 2)
            release.row_version += 1
        raise
