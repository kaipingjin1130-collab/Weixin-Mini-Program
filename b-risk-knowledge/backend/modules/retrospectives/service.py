from copy import deepcopy
from sqlalchemy import select, text
from ...db import Session
from ...auth import authorize, Problem
from ...models import new_id
from ...job_service import fingerprint
from ...audit import record as audit
from ..knowledge.service import source_context, check_revision, link_claims
from ..knowledge.models import KnowledgeItem, KnowledgeRevision, ReviewAction
from ..knowledge.schemas import Card
from ..task_packages.service import ready_snapshot, package_in
from ..task_packages.models import TaskPackageAsset, PackageInvalidation
from ..task_packages.assessment import available_relation
from .models import Retrospective, RetrospectiveRevision, RetrospectiveSource, RetrospectiveEvidence, ExperienceConversion
from .sources import guard_sources
from .engine import build_task, TEMPLATE


def current(db, ident, actor, action='read', lock=False):
    q = select(Retrospective).where(Retrospective.id == ident)
    parent = db.scalar(q.with_for_update() if lock else q)
    if not parent:
        raise Problem(404, 'NOT_FOUND', '复盘不存在。')
    authorize(actor, action, parent.project_id)
    if action == 'read' and not (actor.can('run', parent.project_id) or actor.can('audit', parent.project_id)):
        raise Problem(403, 'FORBIDDEN', '复盘加工区需要加工或审核权限。')
    revision = db.scalar(select(RetrospectiveRevision).where(RetrospectiveRevision.parent_id == ident, RetrospectiveRevision.version == parent.current_revision))
    guard_sources(db, revision, actor)
    return parent, revision


def dto(parent, revision):
    return {'id': parent.id, 'title': parent.title, 'project_id': parent.project_id, 'mode': parent.mode,
        'revision_id': revision.id, 'version': revision.version, 'row_version': parent.row_version, 'state': revision.state,
        'sources': revision.sources, 'template_version': revision.template_version, 'model_ref': revision.model_ref,
        'input_fingerprint': revision.input_fingerprint, 'created_at': parent.created_at, 'is_mock': True, 'object_type': 'retrospective_revision'}


def source_edges(db, revision):
    for ident in revision.sources.get('record_version_ids', []):
        db.add(RetrospectiveSource(revision_id=revision.id, record_version_id=ident))
    if revision.sources.get('task_package_id'):
        db.add(RetrospectiveSource(revision_id=revision.id, task_package_id=revision.sources['task_package_id']))


def generate(data, actor, request_id):
    with Session.begin() as db:
        evidence_specs = []
        if data.mode == 'task_process':
            snapshot, caps = ready_snapshot(db, data.task_package_id, actor)
            if len(snapshot['events']) > 500 or len(snapshot['attachments']) > 100:
                raise Problem(422, 'B06_SCOPE_TOO_LARGE', '当前复盘同步处理范围为500条事件、100个附件以内；大包需接入既有后台队列后处理，未截断来源。')
            package = package_in(db, data.task_package_id, actor)
            project, title = package.project_id, snapshot['task']['name']
            key = 'task:'+package.stream_id+':'+data.template_version
            sources = {'task_package_id': package.id, 'package_version': package.package_version, 'content_hash': package.content_hash,
                'capabilities': caps, 'scene_code': package.scene_code, 'record_version_ids': []}
            summary, timeline, findings, suggestions = build_task(snapshot)
            evidence_specs.append(('task:snapshot', 'task_snapshot', {'section': '固定任务快照'}, '任务名称：'+title, None))
            for e in snapshot['events']:
                evidence_specs.append(('event:'+e['event_id'], 'process_event', {'event_id': e['event_id']},
                    (e['event_type']+' · '+str(e.get('occurred_at') or '实际时间未知')+' · '+str(e.get('payload', {}).get('note', '')))[:4000], None))
            for relation in db.scalars(select(TaskPackageAsset).where(TaskPackageAsset.package_id == package.id)):
                if available_relation(db, relation).verification_state == 'verified':
                    evidence_specs.append(('attachment:'+relation.external_attachment_id, 'task_attachment', {'section': '任务附件：'+relation.external_attachment_id}, relation.external_attachment_id, relation.asset_id))
        else:
            rows = [source_context(db, ident, actor, 'run', current=True) for ident in sorted(data.record_version_ids)]
            if len({r.project_id for _, r, _ in rows}) != 1:
                raise Problem(422, 'MIXED_PROJECTS', '历史复盘只接受同一项目的固定来源版本。')
            project, title = rows[0][1].project_id, '历史案例复盘'
            sources = {'record_version_ids': sorted(data.record_version_ids), 'task_package_id': None, 'scene_code': 'generic'}
            key = 'history:'+fingerprint(sources)+':'+data.template_version
            summary = f'基于{len(rows)}条固定历史记录的案例摘要。未发现完整过程记录，不生成过程时长或整改超期结论。'
            timeline = {'known': [], 'unknown_time': [], 'intervals': [], 'deadlines': []}
            findings = []
            for n, (version, row, evidence) in enumerate(rows):
                refs = []
                for e in evidence:
                    if e.relation_confidence == 'anchored' and e.evidence_type == 'source_row':
                        ref = 'history:'+e.id
                        evidence_specs.append((ref, 'historical_row', {**e.locator, 'source_record_id': row.id}, str(version.effective_fields.get('description') or '来源未填写描述')[:4000], e.asset_id))
                        refs.append(ref)
                if not refs:
                    raise Problem(422, 'UNANCHORED_SOURCE', '历史案例须有锚定的来源行。')
                findings.append({'id': f'history-{n}', 'type': 'historical_fact', 'claim_kind': 'fact',
                    'text': str(version.effective_fields.get('description') or '来源未填写描述')[:4000], 'event_refs': [], 'evidence_refs': refs[:10], 'review_state': 'unconfirmed'})
            suggestions = [{'id': 'historical-suggestion', 'type': 'mock_suggestion', 'claim_kind': 'suggestion', 'text': '建议将本组历史问题用于新人识别风险的案例练习；原始描述不能证明整改与复核已经发生。', 'event_refs': [], 'evidence_refs': [], 'review_state': 'unconfirmed'}]
        authorize(actor, 'run', project)
        digest = fingerprint({'sources': {k: v for k, v in sources.items() if k != 'capabilities'}, 'template': TEMPLATE})
        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'), {'k': 'retro:'+key})
        parent = db.scalar(select(Retrospective).where(Retrospective.source_key == key).with_for_update())
        if parent:
            prior = db.scalar(select(RetrospectiveRevision).where(RetrospectiveRevision.parent_id == parent.id, RetrospectiveRevision.version == parent.current_revision))
            if prior.input_fingerprint == digest:
                return {**dto(parent, prior), 'replayed': True}
            if sources.get('package_version', 0) < prior.sources.get('package_version', 0):
                raise Problem(409, 'SOURCE_VERSION_CHANGED', '不能用较旧任务包覆盖新的复盘版本。')
            parent.current_revision += 1
            parent.row_version += 1
        else:
            parent = Retrospective(source_key=key, mode=data.mode, project_id=project, title=('复盘 · '+title)[:200], scope={'project_id': project})
            db.add(parent)
            db.flush()
        revision = RetrospectiveRevision(parent_id=parent.id, version=parent.current_revision, generation_key=digest,
            input_fingerprint=digest, sources=sources, summary=summary, timeline=timeline, findings=[], suggestions=suggestions,
            template_version=data.template_version, row_version=parent.row_version)
        db.add(revision)
        db.flush()
        source_edges(db, revision)
        mapping = {}
        for ref, kind, locator, value, asset in evidence_specs:
            evidence = RetrospectiveEvidence(revision_id=revision.id, reference=ref, kind=kind, locator=locator, text=value, asset_id=asset)
            db.add(evidence)
            db.flush()
            mapping[ref] = evidence.id
        for f in findings:
            f['evidence_refs'] = [mapping[e] for e in f['evidence_refs']]
        revision.findings = findings
        audit(db, actor, 'retrospective_generated', 'retrospective', parent.id, project, request_id, revision.version)
        return {**dto(parent, revision), 'replayed': False}


def validate(db, revision, findings, suggestions, approving=False):
    allowed = {e.id: e for e in db.scalars(select(RetrospectiveEvidence).where(RetrospectiveEvidence.revision_id == revision.id))}
    event_ids = {e.locator['event_id'] for e in allowed.values() if e.kind == 'process_event'}
    all_items = findings+suggestions
    if len({f['id'] for f in all_items}) != len(all_items):
        raise Problem(422, 'DUPLICATE_FINDING', '复盘条目标识不能重复。')
    if any(f['claim_kind'] != 'suggestion' for f in suggestions) or not any(f['claim_kind'] == 'fact' for f in findings):
        raise Problem(422, 'CLAIM_KIND_INVALID', '事实与建议必须分开，至少保留一项有证据的事实。')
    for f in all_items:
        if not set(f['event_refs']) <= event_ids or not set(f['evidence_refs']) <= set(allowed):
            raise Problem(422, 'INVALID_EVIDENCE_REFERENCE', '引用必须属于此固定复盘来源版本。')
        if f['claim_kind'] == 'fact' and not f['evidence_refs']:
            raise Problem(422, 'UNVERIFIED_FACT', '事实必须引用可核查证据。')
        if f['claim_kind'] == 'fact' and any('event:'+ident not in {allowed[e].reference for e in f['evidence_refs']} for ident in f['event_refs']):
            raise Problem(422, 'INVALID_EVENT_REFERENCE', '事实的事件引用须与证据对应。')
        for ident in f['evidence_refs']:
            e = allowed[ident]
            if e.asset_id:
                from ...models import FileAsset
                if db.get(FileAsset, e.asset_id).availability != 'available':
                    raise Problem(410, 'EVIDENCE_UNAVAILABLE', '条目引用的附件或来源行已经不可用。')
        if approving and f['review_state'] != 'confirmed':
            raise Problem(422, 'ITEM_REVIEW_REQUIRED', '请逐项确认事实、推断和建议后再批准。')


def edit(ident, data, actor, request_id):
    with Session.begin() as db:
        parent, prior = current(db, ident, actor, 'run', lock=True)
        check_revision(parent, prior, data)
        guard_sources(db, prior, actor, current=True)
        findings, suggestions = [f.model_dump() for f in data.findings], [f.model_dump() for f in data.suggestions]
        validate(db, prior, findings, suggestions)
        parent.current_revision += 1
        parent.row_version += 1
        revision = RetrospectiveRevision(parent_id=ident, version=parent.current_revision, input_fingerprint=prior.input_fingerprint,
            sources=deepcopy(prior.sources), summary=data.summary, timeline=deepcopy(prior.timeline), findings=[], suggestions=[],
            template_version=prior.template_version, model_ref=prior.model_ref, row_version=parent.row_version)
        db.add(revision)
        db.flush()
        source_edges(db, revision)
        mapping = {}
        for e in db.scalars(select(RetrospectiveEvidence).where(RetrospectiveEvidence.revision_id == prior.id)):
            copied = RetrospectiveEvidence(revision_id=revision.id, reference=e.reference, kind=e.kind, locator=deepcopy(e.locator), text=e.text, asset_id=e.asset_id)
            db.add(copied)
            db.flush()
            mapping[e.id] = copied.id
        for f in findings+suggestions:
            f['evidence_refs'] = [mapping[x] for x in f['evidence_refs']]
        revision.findings, revision.suggestions = findings, suggestions
        db.add(ReviewAction(object_type='retrospective_revision', object_id=ident, revision_id=revision.id, object_version=revision.version, action='edited', reviewer=actor.id, reason=data.reason))
        audit(db, actor, 'retrospective_edited', 'retrospective', ident, parent.project_id, request_id, revision.version)
        return dto(parent, revision)


def transition(ident, data, actor, action, request_id, review_id=None):
    with Session.begin() as db:
        parent, revision = current(db, ident, actor, 'run' if action == 'submitted' else 'audit', lock=True)
        check_revision(parent, revision, data)
        if review_id and review_id != revision.id:
            raise Problem(409, 'REVIEW_VERSION_CHANGED', '审核对象不是当前复盘版本。')
        guard_sources(db, revision, actor, current=True)
        allowed = {'submitted': {'draft', 'changes_requested'}, 'approved': {'pending_review'}, 'changes_requested': {'pending_review'}}
        if revision.state not in allowed[action]:
            raise Problem(409, 'INVALID_STATE', '当前状态不允许此操作。')
        if action == 'approved' and not data.evidence_checked:
            raise Problem(422, 'EVIDENCE_REVIEW_REQUIRED', '请确认已核对事实与证据。')
        if action != 'changes_requested':
            validate(db, revision, revision.findings, revision.suggestions, approving=action == 'approved')
        revision.state = 'pending_review' if action == 'submitted' else action
        parent.row_version += 1
        revision.row_version = parent.row_version
        db.add(ReviewAction(object_type='retrospective_revision', object_id=ident, revision_id=revision.id, object_version=revision.version, action=action, reviewer=actor.id, reason=data.reason))
        audit(db, actor, 'retrospective_'+action, 'retrospective', ident, parent.project_id, request_id, revision.version)
        return dto(parent, revision)


def convert(ident, data, actor, request_id):
    with Session.begin() as db:
        parent, revision = current(db, ident, actor, 'run', lock=True)
        check_revision(parent, revision, data)
        guard_sources(db, revision, actor, current=True)
        if revision.state != 'approved':
            raise Problem(409, 'RETROSPECTIVE_NOT_APPROVED', '仅能从已批准的当前复盘版本创建经验草稿。')
        validate(db, revision, revision.findings, revision.suggestions, approving=True)
        prior = db.scalar(select(ExperienceConversion).where(ExperienceConversion.revision_id == revision.id, ExperienceConversion.type == data.type))
        if prior:
            return {'draft_ids': [prior.item_id], 'replayed': True, 'state': 'drafts_created'}
        facts = [{'text': f['text'], 'evidence_ids': f['evidence_refs'][:10], 'source_kind': 'human_annotation'} for f in revision.findings if f['claim_kind'] == 'fact'][:30]
        card = Card(title=('经验 · '+parent.title)[:200], type=data.type, facts=facts,
            suggestions=[f['text'] for f in revision.suggestions][:30]+[f['text'] for f in revision.findings if f['claim_kind'] != 'fact'][:max(0, 30-len(revision.suggestions))], standards=[], project_name=parent.project_id)
        item = KnowledgeItem(retrospective_revision_id=revision.id, project_id=parent.project_id, type=data.type, title=card.title,
            template_version=revision.template_version, scene_code=revision.sources['scene_code'], scope={'project_id': parent.project_id})
        db.add(item)
        db.flush()
        candidate = KnowledgeRevision(item_id=item.id, version=1, content=card.model_dump(), template_version=revision.template_version,
            model_ref=revision.model_ref, state='draft')
        db.add(candidate)
        db.flush()
        link_claims(db, candidate, card)
        db.add(ExperienceConversion(revision_id=revision.id, type=data.type, item_id=item.id))
        audit(db, actor, 'experience_draft_created', 'knowledge', item.id, parent.project_id, request_id, 1)
        return {'draft_ids': [item.id], 'replayed': False, 'state': 'drafts_created'}
