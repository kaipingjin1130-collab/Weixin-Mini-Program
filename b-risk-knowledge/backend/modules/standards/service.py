import hashlib
from datetime import datetime
from zoneinfo import ZoneInfo
from sqlalchemy import select, text
from ...auth import authorize, Problem
from ...audit import record as audit
from ...db import Session
from ...models import FileAsset
from ...storage import asset_path
from ...job_service import fingerprint
from .models import StandardRevision, StandardClause, StandardReview, StandardSubmission


def today():
    return datetime.now(ZoneInfo('Asia/Shanghai')).date()


def curator(actor, project):
    authorize(actor, 'knowledge.read', project)
    if not any(actor.can(a, project) for a in ('knowledge.process', 'knowledge.review', 'knowledge.publish')):
        raise Problem(403, 'FORBIDDEN', '规范加工区需要加工、审核或发布权限。')


def source(db, asset_id, actor, project, expected_hash=None):
    asset = db.get(FileAsset, asset_id)
    if not asset:
        raise Problem(404, 'SOURCE_NOT_FOUND', '规范来源文件不存在，请先上传资料。')
    if asset.project_id != project or asset.org_id != actor.org_id:
        raise Problem(403, 'SOURCE_SCOPE_MISMATCH', '来源文件不属于当前项目与组织。')
    if asset.availability != 'available':
        raise Problem(410, 'SOURCE_WITHDRAWN', '规范来源文件已撤回或不可用。')
    if expected_hash is not None and asset.sha256 != expected_hash:
        raise Problem(409, 'SOURCE_CHANGED', '来源内容指纹已变化，请创建新版本并重新核验。')
    if asset.mime_type not in {'application/pdf', 'text/plain',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}:
        raise Problem(422, 'INVALID_STANDARD_SOURCE', '规范原件须为PDF、DOCX或UTF-8文本。')
    path = asset_path(asset.storage_key)
    if not path.is_file():
        raise Problem(404, 'ASSET_MISSING', '规范原件缺失，请联系维护人员。')
    if path.stat().st_size != asset.size or hashlib.sha256(path.read_bytes()).hexdigest() != asset.sha256:
        raise Problem(409, 'ASSET_INTEGRITY_ERROR', '规范原件内容校验失败。')
    # A-derived snapshots must retain their live revocation checks as sources.
    from ..ingestion.package_projection import guard_snapshot_asset
    guard_snapshot_asset(db, asset.id, actor)
    return asset


def visible(db, ident, actor, action='knowledge.read', lock=False):
    query = select(StandardRevision).where(StandardRevision.id == ident)
    row = db.scalar(query.with_for_update() if lock else query)
    if row is None:
        raise Problem(404, 'NOT_FOUND', '规范版本不存在。')
    authorize(actor, action, row.project_id)
    if row.state != 'published' and action == 'knowledge.read':
        curator(actor, row.project_id)
    source(db, row.source_asset_id, actor, row.project_id, row.source_sha256)
    return row


def dto(row):
    return {key: getattr(row, key) for key in (
        'id', 'project_id', 'code', 'edition', 'version', 'title', 'source_asset_id',
        'source_sha256', 'valid_from', 'valid_until', 'scope', 'maintainer', 'state',
        'verified_on', 'row_version', 'created_at')}


def guard_asset(db, asset, actor):
    """The generic asset endpoint must not bypass draft/published visibility."""
    if not asset.storage_key.startswith('standard-inputs/'):
        return
    authorize(actor, 'knowledge.read', asset.project_id)
    if not any(actor.can(a, asset.project_id) for a in ('knowledge.process', 'knowledge.review', 'knowledge.publish')):
        published = db.scalar(select(StandardRevision.id).where(
            StandardRevision.source_asset_id == asset.id, StandardRevision.project_id == asset.project_id,
            StandardRevision.source_sha256 == asset.sha256, StandardRevision.state == 'published').limit(1))
        if not published:
            raise Problem(403, 'STANDARD_SOURCE_NOT_PUBLISHED', '该原件尚无可访问的已发布规范版本。')
    source(db, asset.id, actor, asset.project_id)


def create(data, actor, request_id, key):
    authorize(actor, 'knowledge.process', data.project_id)
    with Session.begin() as db:
        asset = source(db, data.source_asset_id, actor, data.project_id)
        digest = fingerprint(data.model_dump(mode='json'))
        db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'),
            {'k': 'standard-request:' + fingerprint([actor.id, key])})
        submitted = db.scalar(select(StandardSubmission).where(
            StandardSubmission.actor_id == actor.id, StandardSubmission.idempotency_key == key))
        if submitted:
            if submitted.input_hash != digest:
                raise Problem(409, 'IDEMPOTENCY_CONFLICT', '同一提交标识对应不同内容。')
            previous = db.get(StandardRevision, submitted.revision_id)
            source(db, previous.source_asset_id, actor, previous.project_id, previous.source_sha256)
            return {**dto(previous), 'replayed': True}
        # Same project+code serializes all edition publication decisions too.
        lock_series(db, data.project_id, data.code)
        prior = db.scalar(select(StandardRevision).where(
            StandardRevision.project_id == data.project_id, StandardRevision.code == data.code,
            StandardRevision.edition == data.edition).order_by(StandardRevision.version.desc()).limit(1))
        if (prior.version if prior else 0) != data.expected_version:
            raise Problem(409, 'VERSION_CONFLICT', '规范已有更新，请刷新版本后保存；不会覆盖旧内容。')
        row = StandardRevision(project_id=data.project_id, code=data.code, edition=data.edition,
            version=data.expected_version + 1, title=data.title, source_asset_id=asset.id,
            source_sha256=asset.sha256, valid_from=data.valid_from, valid_until=data.valid_until,
            scope=data.scope.model_dump(), maintainer=data.maintainer)
        db.add(row)
        db.flush()
        for index, clause in enumerate(data.clauses):
            db.add(StandardClause(standard_revision_id=row.id, number=clause.number,
                position=index, content=clause.model_dump()))
        log(db, row, actor, 'created', data.reason, False, request_id)
        db.add(StandardSubmission(actor_id=actor.id, idempotency_key=key, input_hash=digest, revision_id=row.id))
        return {**dto(row), 'replayed': False}


def lock_series(db, project, code):
    key = fingerprint({'project': project, 'code': code})
    db.execute(text('SELECT pg_advisory_xact_lock(hashtextextended(:k,0))'), {'k': 'standard:' + key})


def log(db, row, actor, action, reason, checked, request_id):
    db.add(StandardReview(standard_revision_id=row.id, action=action, actor_id=actor.id,
        reason=reason, row_version=row.row_version, evidence_checked=checked))
    audit(db, actor, 'standard_' + action, 'standard_revision', row.id,
        row.project_id, request_id, row.version)


def transition(ident, data, actor, request_id):
    permission = {'submit': 'knowledge.process', 'approve': 'knowledge.review',
        'request_changes': 'knowledge.review', 'publish': 'knowledge.publish', 'withdraw': 'knowledge.publish'}[data.action]
    with Session.begin() as db:
        # Series lock before row lock keeps concurrent publish/create lock order consistent.
        row = db.get(StandardRevision, ident)
        if row is None:
            raise Problem(404, 'NOT_FOUND', '规范版本不存在。')
        authorize(actor, permission, row.project_id)
        lock_series(db, row.project_id, row.code)
        db.expire(row)
        row = db.scalar(select(StandardRevision).where(StandardRevision.id == ident).with_for_update())
        if row.row_version != data.row_version:
            raise Problem(409, 'VERSION_CONFLICT', '规范状态已变化，请刷新后操作。')
        allowed = {'submit': {'draft'}, 'approve': {'pending_review'},
            'request_changes': {'pending_review'}, 'publish': {'approved'},
            'withdraw': {'published', 'approved', 'superseded'}}
        if row.state not in allowed[data.action]:
            raise Problem(409, 'INVALID_STATE', '当前规范状态不允许此操作；退回后请另存修订版。')
        # Withdrawal must remain possible even after the source has been revoked.
        if data.action != 'withdraw':
            source(db, row.source_asset_id, actor, row.project_id, row.source_sha256)
            latest = db.scalar(select(StandardRevision.version).where(
                StandardRevision.project_id == row.project_id, StandardRevision.code == row.code,
                StandardRevision.edition == row.edition).order_by(StandardRevision.version.desc()).limit(1))
            if row.version != latest:
                raise Problem(409, 'REVISION_SUPERSEDED', '已有新修订稿，不能再审核或发布旧稿。')
        if data.action == 'approve':
            if not data.evidence_checked:
                raise Problem(422, 'EVIDENCE_REVIEW_REQUIRED', '请确认条号、原文、上下文、适用范围和有效日期均已核对来源。')
            row.verified_on, row.reviewed_by = today(), actor.id
        if data.action == 'publish':
            if not row.reviewed_by or not row.verified_on:
                raise Problem(422, 'STANDARD_UNVERIFIED', '规范未经来源核验。')
            published = db.scalars(select(StandardRevision).where(
                StandardRevision.project_id == row.project_id, StandardRevision.code == row.code,
                StandardRevision.state == 'published')).all()
            for other in published:
                overlap = ((row.valid_until is None or other.valid_from < row.valid_until)
                    and (other.valid_until is None or row.valid_from < other.valid_until))
                if other.edition != row.edition and overlap:
                    raise Problem(409, 'EDITION_PERIOD_OVERLAP', '同一规范其他版本有效期重叠，请先修订并核验有效日期。')
            for other in published:
                if other.edition == row.edition:
                    other.state = 'superseded'
                    other.row_version += 1
                    log(db, other, actor, 'superseded', '由已审核修订版本替代：' + row.id, False, request_id)
        row.state = {'submit': 'pending_review', 'approve': 'approved', 'request_changes': 'changes_requested',
            'publish': 'published', 'withdraw': 'withdrawn'}[data.action]
        row.row_version += 1
        log(db, row, actor, data.action, data.reason, data.evidence_checked, request_id)
        return dto(row)


def applicability(row, data):
    if row.state != 'published':
        return {'status': 'unavailable', 'reasons': ['该版本尚未发布或已失效。'], 'missing': []}
    day = data.event_date if data.purpose == 'historical_review' else today()
    missing, reasons = [], []
    if day is None:
        missing.append('event_date')
    elif day < row.valid_from or (row.valid_until is not None and day >= row.valid_until):
        reasons.append('指定时点不在本版本有效区间内。')
    for field, name in [('project_types', 'project_type'), ('regions', 'region'),
                        ('object_types', 'object_type'), ('stages', 'stage')]:
        options = row.scope.get(field, [])
        value = getattr(data, name)
        if options and not value:
            missing.append(name)
        elif options and value not in options:
            reasons.append(name + '不在已核验的适用范围。')
    return {'status': 'not_applicable' if reasons else 'needs_information' if missing else 'candidate',
        'as_of': day, 'reasons': reasons, 'missing': missing,
        'note': '仅核对版本日期和已登记范围；具体条文前置条件与例外仍须专业核验，不等同推荐结论。'}
