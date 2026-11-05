import hashlib
import json
from sqlalchemy import select, text, func
from ...auth import authorize, Problem
from ...audit import record as audit
from ...db import Session
from ...models import FileAsset
from ...job_service import fingerprint
from ...storage import asset_path
from ..knowledge.service import source_context
from ..standards.models import StandardRevision, StandardClause
from ..standards import service as standards
from .models import WorkRevision, WorkDependency, WorkReview, WorkSubmission, EventRecord
from .schemas import Draft, Guide, Hazard, Question


def permission(kind, action):
    if kind == 'question':
        return 'training.review' if action in {'approve', 'request_changes', 'publish', 'withdraw'} else 'training.manage'
    return 'knowledge.review' if action in {'approve', 'request_changes'} else 'knowledge.publish' if action in {'publish', 'withdraw'} else 'knowledge.process'


def check_scope(row, actor, action='knowledge.read'):
    authorize(actor, action, row.project_id)
    if row.org_id != actor.org_id:
        raise Problem(403, 'ORG_FORBIDDEN', '对象不属于当前组织。')


def can_manage(row, actor):
    return any(actor.can(permission(row.kind, a), row.project_id) for a in ('submit', 'approve', 'publish'))


def get(db, ident, actor, public=False):
    row = db.get(WorkRevision, ident)
    if not row:
        raise Problem(404, 'NOT_FOUND', '知识业务版本不存在。')
    check_scope(row, actor)
    # Questions are exclusively an authoring source here. Learners use training APIs.
    if (row.kind == 'question' or row.state != 'published' or public) and not can_manage(row, actor):
        raise Problem(403, 'DRAFT_FORBIDDEN', '该内容需相应加工或审核权限。')
    return row


def asset_context(db, ident, actor, project):
    asset = db.get(FileAsset, ident)
    if not asset or asset.availability != 'available':
        raise Problem(410, 'SOURCE_WITHDRAWN', '来源文件已撤回或不存在。')
    if asset.project_id != project or asset.org_id != actor.org_id:
        raise Problem(403, 'SOURCE_SCOPE_MISMATCH', '来源不属于当前项目和组织。')
    from ..ingestion.package_projection import guard_snapshot_asset
    guard_snapshot_asset(db, asset.id, actor)
    path = asset_path(asset.storage_key)
    if not path.is_file() or path.stat().st_size != asset.size or hashlib.sha256(path.read_bytes()).hexdigest() != asset.sha256:
        raise Problem(409, 'SOURCE_CHANGED', '来源文件缺失或内容校验失败。')
    return asset, path


def resolve(db, kind, ident, actor, project, seen=None):
    """Resolve every read against live authorization and immutable upstream versions."""
    if kind == 'asset':
        asset, path = asset_context(db, ident, actor, project)
        body = path.read_text(encoding='utf-8-sig') if asset.mime_type == 'text/plain' else None
        return asset.sha256, body
    if kind == 'record':
        version, parent, _ = source_context(db, ident, actor)
        if parent.project_id != project:
            raise Problem(403, 'SOURCE_SCOPE_MISMATCH', '记录不属于当前项目。')
        asset_context(db, version.provenance.get('input_asset_id'), actor, project)
        return version.content_hash, json.dumps(version.raw_fields, ensure_ascii=False) + json.dumps(version.effective_fields, ensure_ascii=False)
    if kind == 'standard':
        row = standards.visible(db, ident, actor)
        if row.project_id != project or row.state != 'published':
            raise Problem(409, 'STANDARD_UNAVAILABLE', '引用需为本项目已发布规范。')
        clauses = db.scalars(select(StandardClause).where(StandardClause.standard_revision_id == ident)).all()
        return fingerprint([row.source_sha256, row.version]), json.dumps([c.content for c in clauses], ensure_ascii=False)
    row = db.get(WorkRevision, ident)
    if not row:
        raise Problem(404, 'UPSTREAM_NOT_FOUND', '引用版本不存在。')
    check_scope(row, actor)
    if row.project_id != project or row.state != 'published':
        raise Problem(409, 'UPSTREAM_UNAVAILABLE', '引用需为本项目已发布成果固定版本。')
    get(db, ident, actor)
    guard(db, row, actor, seen)
    return fingerprint(row.content), json.dumps(row.content, ensure_ascii=False)


def guard(db, row, actor, seen=None):
    check_scope(row, actor)
    seen = set(seen or ())
    if row.id in seen or len(seen) >= 20:
        raise Problem(409, 'DEPENDENCY_CYCLE', '来源关系循环或超过层级限制。')
    seen.add(row.id)
    for dep in db.scalars(select(WorkDependency).where(WorkDependency.revision_id == row.id)):
        digest, _ = resolve(db, dep.source_kind, dep.source_id, actor, row.project_id, seen)
        if digest != dep.fingerprint:
            raise Problem(409, 'SOURCE_CHANGED', '上游内容已变化，请另存新版本重新核验。')


def evidence_in(value):
    if isinstance(value, dict):
        if set(value) == {'kind', 'id', 'quote', 'locator'}:
            yield value
        else:
            for child in value.values():
                yield from evidence_in(child)
    elif isinstance(value, list):
        for child in value:
            yield from evidence_in(child)


def dependencies(db, data, actor):
    content = data.content.model_dump(mode='json')
    refs = {}
    for e in evidence_in(content):
        digest, original = resolve(db, e['kind'], e['id'], actor, data.project_id)
        if original is not None and e['quote'] not in original:
            raise Problem(422, 'QUOTE_NOT_FOUND', '引用摘录不在指定版本原文中。')
        refs[(e['kind'], e['id'])] = digest
    ids = []
    if isinstance(data.content, Hazard):
        ids = [data.content.taxonomy_id] + ([data.content.related_event_id] if data.content.related_event_id else [])
        taxonomy = get(db, data.content.taxonomy_id, actor)
        if taxonomy.kind != 'taxonomy':
            raise Problem(422, 'INVALID_TAXONOMY', '请选择分类字典固定版本。')
        categories = {c['code']: c for c in taxonomy.content['categories']}
        if data.content.category not in categories:
            raise Problem(422, 'INVALID_CATEGORY', '主分类不属于所选规则版本。')
        if data.content.subcategory and (data.content.subcategory not in categories or categories[data.content.subcategory]['parent'] != data.content.category):
            raise Problem(422, 'INVALID_SUBCATEGORY', '子分类不属于主分类。')
        if data.content.related_event_id:
            related = get(db, data.content.related_event_id, actor)
            if related.kind != 'hazard' or related.series == data.series:
                raise Problem(422, 'INVALID_EVENT_RELATION', '再次发生/疑似重复必须引用另一事件。')
    elif content['kind'] == 'compilation':
        ids = content['event_ids']
        if content['mode'] == 'single' and len(ids) != 1:
            raise Problem(422, 'INVALID_CASE_SCOPE', '单案例必须选择一个事件。')
        events = [get(db, i, actor) for i in ids]
        if any(e.kind != 'hazard' for e in events) or len(set(ids)) != len(ids):
            raise Problem(422, 'INVALID_EVENTS', '请选择不重复的隐患事件版本。')
        if content['mode'] == 'category' and len({e.content['category'] for e in events}) != 1:
            raise Problem(422, 'MIXED_CATEGORIES', '类别汇编请选择同一主分类。')
    elif isinstance(data.content, Question):
        ids = [content['guide_id'], *content['historical_case_ids']]
        guide = get(db, content['guide_id'], actor)
        if guide.kind != 'guide' or content['step'] not in {s['number'] for s in guide.content['steps']}:
            raise Problem(422, 'INVALID_GUIDE_STEP', '题目步骤必须属于指定指导书版本。')
        if not any(e['kind'] == 'work' and e['id'] == guide.id for e in content['evidence']):
            raise Problem(422, 'GUIDE_EVIDENCE_REQUIRED', '每题必须引用指定指导书原文。')
        if any(get(db, i, actor).kind not in {'hazard', 'compilation'} for i in content['historical_case_ids']):
            raise Problem(422, 'INVALID_CASE', '历史案例必须为事件或汇编。')
    for ident in ids:
        refs[('work', ident)], _ = resolve(db, 'work', ident, actor, data.project_id)
    return refs


def lock(db, value):
    db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'), {'k': 'workflow:' + fingerprint(value)})


def series_query(row):
    return select(WorkRevision).where(WorkRevision.org_id == row.org_id, WorkRevision.project_id == row.project_id,
        WorkRevision.kind == row.kind, WorkRevision.series == row.series)


def dto(row, content=True):
    return {**{k: getattr(row, k) for k in ('id', 'project_id', 'kind', 'series', 'version', 'title', 'state', 'row_version', 'created_at')},
            **({'content': row.content} if content else {})}


def log(db, row, actor, action, reason, request_id):
    db.add(WorkReview(revision_id=row.id, action=action, actor_id=actor.id, reason=reason, row_version=row.row_version))
    audit(db, actor, 'work_' + action, row.kind, row.id, row.project_id, request_id, row.version)


def create(data: Draft, actor, key, request_id):
    authorize(actor, permission(data.content.kind, 'submit'), data.project_id)
    with Session.begin() as db:
        lock(db, [actor.id, key])
        digest = fingerprint(data.model_dump(mode='json'))
        old = db.scalar(select(WorkSubmission).where(WorkSubmission.actor_id == actor.id, WorkSubmission.key == key))
        if old:
            if old.digest != digest:
                raise Problem(409, 'IDEMPOTENCY_CONFLICT', '同一提交标识对应不同内容。')
            row = get(db, old.revision_id, actor)
            guard(db, row, actor)
            return {**dto(row), 'replayed': True}
        lock(db, [actor.org_id, data.project_id, data.content.kind, data.series])
        row = WorkRevision(org_id=actor.org_id, project_id=data.project_id, kind=data.content.kind, series=data.series,
            version=data.expected_version + 1, title=data.title, content=data.content.model_dump(mode='json'), created_by=actor.id)
        prior = db.scalar(series_query(row).order_by(WorkRevision.version.desc()).limit(1))
        if (prior.version if prior else 0) != data.expected_version:
            raise Problem(409, 'VERSION_CONFLICT', '已有新版本，请刷新；原版本不会覆盖。')
        deps = dependencies(db, data, actor)
        db.add(row)
        db.flush()
        for (kind, ident), hash_ in deps.items():
            db.add(WorkDependency(revision_id=row.id, source_kind=kind, source_id=ident, fingerprint=hash_))
        if isinstance(data.content, Hazard):
            for r in data.content.records:
                db.add(EventRecord(revision_id=row.id, record_key=r.record_key, kind=r.kind, content=r.model_dump(mode='json')))
        db.add(WorkSubmission(actor_id=actor.id, key=key, digest=digest, revision_id=row.id))
        log(db, row, actor, 'created', data.reason, request_id)
        return {**dto(row), 'replayed': False}


def missing(row):
    content = row.content
    if row.kind == 'guide':
        return list(dict.fromkeys(content['missing'] + content['conflicts'] +
            [k for k in content['required_conditions'] if not content['conditions'].get(k)] +
            [p['name'] for p in content['parameters'] if not p['value']]))
    return content.get('missing', [])


def transition(ident, data, actor, request_id):
    with Session.begin() as db:
        row = get(db, ident, actor)
        check_scope(row, actor, permission(row.kind, data.action))
        lock(db, [row.org_id, row.project_id, row.kind, row.series])
        db.refresh(row, with_for_update=True)
        allowed = {'submit': {'draft'}, 'approve': {'pending_review'}, 'request_changes': {'pending_review'},
            'publish': {'approved'}, 'withdraw': {'published', 'approved', 'superseded'}}
        if row.row_version != data.row_version or row.state not in allowed[data.action]:
            raise Problem(409, 'VERSION_CONFLICT', '内容状态已变化或不允许此操作，请刷新。')
        if data.action != 'withdraw':
            guard(db, row, actor)
            latest = db.scalar(series_query(row).order_by(WorkRevision.version.desc()).limit(1))
            if latest.id != row.id:
                raise Problem(409, 'REVISION_SUPERSEDED', '已有修订稿，请审核最新修订。')
        if data.action in {'approve', 'publish'}:
            if missing(row):
                raise Problem(422, 'UNRESOLVED_ITEMS', '必填条件、参数、冲突或缺项尚未解决。')
            if row.kind == 'question':
                duplicate = db.scalar(select(WorkRevision.id).where(WorkRevision.kind == 'question',
                    WorkRevision.org_id == row.org_id, WorkRevision.project_id == row.project_id,
                    WorkRevision.series != row.series, WorkRevision.state.in_(['approved', 'published']),
                    WorkRevision.content['stem'].astext == row.content['stem']).limit(1))
                if duplicate:
                    raise Problem(422, 'DUPLICATE_QUESTION', '已有相同题干的审核题，请检查重复。')
        if data.action == 'approve':
            if not data.evidence_checked:
                raise Problem(422, 'REVIEW_REQUIRED', '请核对来源、事实、分类/条件及业务结论后确认。')
            row.reviewed_by = actor.id
        if data.action == 'publish':
            if not row.reviewed_by:
                raise Problem(422, 'REVIEW_REQUIRED', '发布前须审核。')
            for prior in db.scalars(series_query(row).where(WorkRevision.state == 'published')):
                prior.state, prior.row_version = 'superseded', prior.row_version + 1
                log(db, prior, actor, 'superseded', '被修订版本替代：' + row.id, request_id)
        row.state = {'submit': 'pending_review', 'approve': 'approved', 'request_changes': 'changes_requested',
            'publish': 'published', 'withdraw': 'withdrawn'}[data.action]
        row.row_version += 1
        log(db, row, actor, data.action, data.reason, request_id)
        return dto(row)


def visible_ids(db, actor, project, kind='hazard'):
    authorize(actor, 'knowledge.read', project)
    rows = db.scalars(select(WorkRevision).where(WorkRevision.org_id == actor.org_id,
        WorkRevision.project_id == project, WorkRevision.kind == kind, WorkRevision.state == 'published')).all()
    valid, unavailable = [], 0
    for row in rows:
        try:
            guard(db, row, actor)
            valid.append(row.id)
        except Problem as e:
            if e.status not in {403, 404, 409, 410}:
                raise
            unavailable += 1
    return valid, unavailable


def hazard_query(db, actor, project, category=None, status=None, nature='observed_hazard', tag=None):
    ids, unavailable = visible_ids(db, actor, project)
    query = select(WorkRevision).where(WorkRevision.id.in_(ids), WorkRevision.content['nature'].astext == nature)
    for key, value in [('category', category), ('status', status)]:
        if value:
            query = query.where(WorkRevision.content[key].astext == value)
    if tag:
        query = query.where(WorkRevision.content['tags'].contains([tag]))
    return query, unavailable


def aggregate(db, actor, project, **filters):
    query, unavailable = hazard_query(db, actor, project, **filters)
    scope = query.subquery()
    count = db.scalar(select(func.count()).select_from(scope))
    records = db.scalar(select(func.count(func.distinct(EventRecord.record_key))).where(
        EventRecord.revision_id.in_(select(scope.c.id)), EventRecord.kind == 'inspection'))
    categories = db.execute(select(scope.c.content['category'].astext.label('category'), func.count()).group_by('category')).all()
    states = db.execute(select(scope.c.content['status'].astext.label('status'), func.count()).group_by('status')).all()
    relations = db.execute(select(scope.c.content['relation'].astext.label('relation'), func.count()).group_by('relation')).all()
    return {'event_count': count, 'inspection_record_count': records, 'project_count': int(count > 0),
        'categories': [{'category': k, 'count': v} for k, v in categories],
        'states': [{'status': k, 'count': v} for k, v in states], 'relations': dict(relations),
        'unavailable_count': unavailable, 'filters': filters,
        'definition': '仅计本项目当前已发布且来源可用的事件；检查记录按原记录键去重。标签可交叉，疑似重复不合并。',
        'ranking': None, 'ranking_reason': '缺少检查次数/规模分母，不生成项目安全排名。'}
