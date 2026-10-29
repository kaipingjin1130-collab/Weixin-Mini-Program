from sqlalchemy import select, text
from pydantic import ValidationError
from ...queue import queue_app
from ...db import Session
from ...models import ProcessingRun, UserLink, RoleBinding, utcnow
from ...auth import Actor, Problem
from .adapter import get_adapter
from .schemas import Card
from .models import KnowledgeItem, KnowledgeRevision, GenerationEntry
from .service import source_context, validate_card, link_claims


def actor_for(db, ident, run=None):
    user = db.get(UserLink, ident)
    from ...auth import actor_for_user
    return actor_for_user(db, user, run)


@queue_app.task(name='b03.knowledge_generation', queue='b01')
def generate(run_id: str):
    with Session.begin() as db:
        run = db.get(ProcessingRun, run_id)
        if not run or run.status == 'succeeded':
            return
        run.status, run.error, run.attempts = 'running', None, run.attempts + 1
        run.row_version += 1
        payload = dict(run.payload)
    try:
        for index, ident in enumerate(payload['record_version_ids'], 1):
            with Session.begin() as db:
                if db.scalar(select(GenerationEntry.id).where(GenerationEntry.run_id == run_id, GenerationEntry.record_version_id == ident)):
                    continue
                run = db.get(ProcessingRun, run_id)
                actor = actor_for(db, run.actor_id, run)
                try:
                    with db.begin_nested():
                        source, row, evidence = source_context(db, ident, actor, 'knowledge.process', current=True)
                        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:key,0))'),
                                   {'key': f"knowledge:{ident}:{payload['type']}:{payload['template_version']}"})
                        existing = db.scalar(select(KnowledgeItem).where(KnowledgeItem.record_version_id == ident,
                            KnowledgeItem.type == payload['type'], KnowledgeItem.template_version == payload['template_version']))
                        if existing:
                            entry = GenerationEntry(run_id=run_id, record_version_id=ident, outcome='skipped', item_id=existing.id)
                        else:
                            adapter = get_adapter()
                            anchored = [e.id for e in evidence if e.evidence_type == 'source_row']
                            card = Card.model_validate(adapter.generate(source, row, anchored, payload['type'], payload['mock_scenario']))
                            validate_card(db, card, source, actor)
                            item = KnowledgeItem(record_version_id=ident, project_id=row.project_id, type=card.type,
                                                 title=card.title, scope={'project_id': row.project_id}, template_version=payload['template_version'])
                            db.add(item)
                            db.flush()
                            revision = KnowledgeRevision(item_id=item.id, version=1, content=card.model_dump(),
                                template_version=payload['template_version'], model_ref=adapter.model_ref)
                            db.add(revision)
                            db.flush()
                            link_claims(db, revision, card)
                            entry = GenerationEntry(run_id=run_id, record_version_id=ident, outcome='created', item_id=item.id)
                        db.add(entry)
                except (Problem, ValidationError) as exc:
                    message = exc.message if isinstance(exc, Problem) else '模型候选未通过结构校验。'
                    db.add(GenerationEntry(run_id=run_id, record_version_id=ident, outcome='failed', error=message))
                run.progress = int(index / len(payload['record_version_ids']) * 100)
                run.updated_at = utcnow()
        with Session.begin() as db:
            run = db.get(ProcessingRun, run_id)
            run.status, run.progress = 'succeeded', 100
            run.row_version += 1
            run.updated_at = utcnow()
    except Exception:
        with Session.begin() as db:
            run = db.get(ProcessingRun, run_id)
            run.status, run.error = 'failed', '生成任务中断，可重试；已保存的单项结果不会重复生成。'
            run.row_version += 1
        raise
