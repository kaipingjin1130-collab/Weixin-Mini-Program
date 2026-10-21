import hashlib
import time
from sqlalchemy import select, cast, literal, or_
from sqlalchemy.dialects.postgresql import JSONB
from pgvector.sqlalchemy import Vector
from ...db import Session
from ...auth import authorize, Problem
from ...models import utcnow, FileAsset
from ..knowledge.models import KnowledgeItem, KnowledgeRevision, KnowledgeEvidenceLink
from ..ingestion.models import EvidenceItem, SourceDocument, SourceRecordVersion, SourceRecord
from .models import KnowledgeRelease, ReleaseEntry, SearchChunk, ChunkEmbedding, EmbeddingSet, SearchRun
from .publication import active_release, public_query, public_revision
from .adapters import get_embedding, terms, standards, normalize, extract_answer


def citation_for(db, evidence_id, revision, actor, claim_path, allow_history=False):
    item, _, source, evidence, release = public_revision(db, revision.id, actor, allow_history=allow_history)
    linked = db.scalar(select(KnowledgeEvidenceLink.id).where(KnowledgeEvidenceLink.revision_id == revision.id,
        or_(KnowledgeEvidenceLink.evidence_id == evidence_id, KnowledgeEvidenceLink.retrospective_evidence_id == evidence_id), KnowledgeEvidenceLink.claim_path == claim_path))
    row = next((e for e in evidence if e.id == evidence_id), None)
    if item.retrospective_revision_id:
        if not linked or not row:
            raise Problem(410, 'EVIDENCE_UNAVAILABLE', '复盘证据不可用。')
        locator = {k: v for k, v in row.locator.items() if k in {'page', 'table', 'row', 'cell', 'event_id', 'source_record_id', 'section'} and v is not None}
        return {'citation_id': 'cite-'+revision.id+'-'+evidence_id, 'knowledge_revision_id': revision.id,
            'evidence_id': evidence_id, 'source_title': '已审核复盘 · '+item.title[:480], 'locator': locator, 'review_status': 'published'}
    if not linked or not row or row.relation_confidence != 'anchored' or row.evidence_type not in {'source_row', 'site_photo', 'text_screenshot'}:
        raise Problem(410, 'EVIDENCE_UNAVAILABLE', '此事实缺少可打开的已审核行证据。')
    asset = db.get(FileAsset, row.asset_id) if row.asset_id else None
    if not asset or asset.availability != 'available' or asset.project_id != item.project_id:
        raise Problem(410, 'EVIDENCE_UNAVAILABLE', '来源证据不可用。')
    document = db.get(SourceDocument, row.document_id)
    # Adapter locators may have ingestion-only fields. Contract locator is a safe subset.
    locator = {k: v for k, v in row.locator.items() if k in {'page', 'table', 'row', 'cell', 'event_id', 'source_record_id', 'section'} and v is not None}
    source_record = db.get(SourceRecord, source.record_id)
    locator['source_record_id'] = source_record.id
    if 'line' in row.locator:
        locator['row'] = row.locator['line']
    if 'range' in row.locator:
        locator['cell'] = row.locator['range']
    if 'sheet' in row.locator:
        locator['section'] = '工作表：'+str(row.locator['sheet'])
    if 'export_index' in row.locator:
        locator['section'] = '治理导出记录索引：'+str(row.locator['export_index'])
    return {'citation_id': 'cite-'+revision.id+'-'+evidence_id, 'knowledge_revision_id': revision.id,
            'evidence_id': evidence_id, 'source_title': document.title[:500], 'locator': locator, 'review_status': 'published'}


def search(data, actor, output_types=None):
    authorize(actor, 'read', data.project_id)
    started = time.perf_counter()
    output_types = output_types or ['answer', 'checkpoints', 'cases']
    with Session.begin() as db:
        release = active_release(db, data.project_id)
        found, citations = [], {}
        warnings = [{'code': 'mock_embedding', 'path': '', 'message': '向量为本地特征哈希模拟，非训练语义模型；答案直接摘录审核事实，未调用大模型。'}]
        if release:
            embedding = db.scalar(select(EmbeddingSet).where(EmbeddingSet.release_id == release.id, EmbeddingSet.state == 'ready'))
            if not embedding:
                raise Problem(503, 'INDEX_UNAVAILABLE', '当前发布索引不可用，请联系管理员。')
            adapter = get_embedding(embedding.model)
            query_vector = adapter.embed(data.question)
            allowed = public_query(actor, data.project_id, data.scene_code, data.card_type)
            if data.object_type:
                allowed = allowed.where(KnowledgeItem.object_type == data.object_type)
            if data.stage:
                allowed = allowed.where(or_(KnowledgeItem.scope['stages'].astext.is_(None),
                                            KnowledgeItem.scope['stages'].contains([data.stage])))
            else:
                allowed = allowed.where(KnowledgeItem.scope['stages'].astext.is_(None))
            allowed = allowed.where(or_(KnowledgeItem.scope['conditions'].astext.is_(None),
                literal(data.conditions, type_=JSONB).contains(KnowledgeItem.scope['conditions'])))
            # Permissions, state, scene and source availability filter BOTH retrieval lanes.
            allowed_ids = allowed.with_only_columns(KnowledgeRevision.id).subquery()
            base = select(SearchChunk).where(SearchChunk.revision_id.in_(select(allowed_ids.c.id)))
            query_terms = terms(data.question)
            lexical = db.scalars(base.where(SearchChunk.keywords.overlap(query_terms)).order_by(SearchChunk.id).limit(200)).all() if query_terms else []
            distance = cast(ChunkEmbedding.vector, Vector(embedding.dimension)).cosine_distance(query_vector)
            vector_rows = db.execute(base.add_columns(distance.label('distance')).join(ChunkEmbedding,
                ChunkEmbedding.chunk_id == SearchChunk.id).where(ChunkEmbedding.embedding_set_id == embedding.id)
                .order_by(distance, SearchChunk.id).limit(100)).all()
            vector_rank = {row.id: (i, float(dist)) for i, (row, dist) in enumerate(vector_rows, 1)}
            chunks = {c.id: c for c in lexical}
            chunks.update({c.id: c for c, dist in vector_rows if dist <= .72})
            exact = [normalize(s) for s in standards(data.question)]
            ranked = []
            for chunk in chunks.values():
                revision = db.get(KnowledgeRevision, chunk.revision_id)
                title = revision.content['title']
                exact_hit = bool(exact) and any(s in normalize(title+' '+chunk.text) for s in exact)
                # A standard-code question never substitutes an unrelated nearby vector.
                if exact and not exact_hit:
                    continue
                overlap = len(set(query_terms) & set(chunk.keywords))
                vrank, dist = vector_rank.get(chunk.id, (1000, 2.0))
                score = (10 if exact_hit else 0) + overlap / max(1, len(query_terms)) + 1/(60+vrank)
                ranked.append((score, chunk, revision, dist, exact_hit))
            ranked.sort(key=lambda row: (-row[0], row[1].id))
            seen_revisions = set()
            for score, chunk, revision, dist, exact_hit in ranked:
                if revision.id in seen_revisions:
                    continue
                item = db.get(KnowledgeItem, revision.item_id)
                kind = 'cases' if item.type == 'case_card' else 'checkpoints'
                if 'answer' not in output_types and kind not in output_types:
                    continue
                try:
                    refs = [citation_for(db, ident, revision, actor, chunk.claim_path) for ident in dict.fromkeys(chunk.meta['evidence_ids'])]
                except Problem as exc:
                    if exc.status in {403, 409, 410}:
                        continue
                    raise
                if not refs:
                    continue
                for ref in refs:
                    citations[ref['citation_id']] = ref
                found.append({'id': item.id, 'revision_id': revision.id, 'title': revision.content['title'],
                    'type': item.type, 'text': chunk.text, 'citation_ids': [r['citation_id'] for r in refs],
                    'match': 'exact_standard' if exact_hit else 'hybrid', 'score': round(score, 4)})
                seen_revisions.add(revision.id)
                if len(found) >= data.limit:
                    break
        blocks = extract_answer(found) if 'answer' in output_types else []
        status = 'answered' if found else 'insufficient_evidence'
        if found and data.answer_mode == 'simulate_timeout':
            status, blocks = 'degraded', []
            warnings.append({'code': 'answer_timeout_simulated', 'path': '/answer_blocks', 'message': '模拟回答服务超时：保留检索结果和证据，不生成结论。'})
        cases = [{'knowledge_revision_id': r['revision_id'], 'title': r['title'], 'summary': r['text'], 'citation_ids': r['citation_ids']}
                 for r in found if r['type'] == 'case_card' and 'cases' in output_types]
        checkpoints = [{'checkpoint_id': r['revision_id'], 'text': r['text'], 'citation_ids': r['citation_ids']}
                       for r in found if r['type'] == 'checkpoint_card' and 'checkpoints' in output_types]
        missing = [] if found else ['当前项目、场景和对象范围内没有足够的已发布证据，请补充条件或先审核发布相关知识。']
        elapsed = round((time.perf_counter()-started)*1000, 2)
        run = SearchRun(actor_id=actor.id, project_id=data.project_id,
            query=hashlib.sha256(data.question.encode('utf-8')).hexdigest(),
            parameters={'scene_code': data.scene_code, 'object_type': data.object_type, 'stage': data.stage, 'limit': data.limit,
                        'card_type': data.card_type, 'output_types': output_types, 'answer_mode': data.answer_mode},
            release_id=release.id if release else None, result_refs=[r['revision_id'] for r in found],
            latency=elapsed, model_ref=release.index_config['model'] if release else 'none')
        db.add(run)
        db.flush()
        response = {'query_id': run.id, 'status': status, 'knowledge_release_id': release.id if release else None,
            'answer_blocks': blocks, 'checkpoints': checkpoints, 'cases': cases, 'citations': list(citations.values()),
            'missing_conditions': missing, 'warnings': warnings}
        return response, found, elapsed
