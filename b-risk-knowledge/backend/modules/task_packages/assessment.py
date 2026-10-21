from types import SimpleNamespace
from sqlalchemy import select
from ...models import FileAsset
from ...storage import asset_path
from ...auth import Problem
from .models import TaskPackageAsset
from .validation import KNOWN_EVENTS


def fitness(package, relations):
    data = package.snapshot
    warnings, missing = [], []
    def warn(code, path, message):
        warnings.append({'code': code, 'path': path, 'message': message})
    for name, state in data['data_completeness'].items():
        if state in {'missing', 'partial'}:
            missing.append(name)
    if not data['events']:
        warn('no_process_events', '/events', '未提供过程事件，只可作为历史资料输入，不能还原作业流程。')
    if any(e['occurred_at'] is None for e in data['events']):
        missing.append('events[].occurred_at')
        warn('missing_event_time', '/events', '部分事件实际时间未知，已保持为空，未使用导出时间代替。')
    if any(e['event_type'] not in KNOWN_EVENTS for e in data['events']):
        warn('unknown_event_type', '/events', '含未知事件类型，已保留原文；不用于确定性流程判断。')
    failed = [r for r in relations if r.verification_state != 'verified']
    for row in failed[:80]:
        path = '/attachments/'+row.external_attachment_id
        missing.append('attachments.'+row.external_attachment_id)
        warn('attachment_unavailable', path, row.error or '附件尚不可用。')
    if len(failed) > 80:
        missing.append('attachments.other_unavailable')
        warn('more_missing_attachments', '/attachments', '另有附件未通过校验，请查看附件清单。')
    caps = ['historical_summary']
    if data['events']:
        full = (not failed and not any(e['event_type'] not in KNOWN_EVENTS for e in data['events'])
                and all(state in {'complete', 'not_applicable'} for state in data['data_completeness'].values())
                and data['data_completeness']['events'] == 'complete' and data['data_completeness']['event_times'] == 'complete'
                and all(e['occurred_at'] is not None for e in data['events']))
        caps.append('complete_timeline' if full else 'partial_timeline')
    return warnings, sorted(set(missing)), caps


def available_relation(db, row):
    if row.verification_state != 'verified':
        return row
    asset = db.get(FileAsset, row.asset_id) if row.asset_id else None
    try:
        available = asset and asset.availability == 'available' and asset_path(asset.storage_key).is_file()
    except Problem:
        available = False
    if available:
        return row
    return SimpleNamespace(external_attachment_id=row.external_attachment_id,
                           verification_state='unavailable', error='已校验附件当前不可用，不能视为证据完整。')


def assess(db, package):
    rows = db.scalars(select(TaskPackageAsset).where(TaskPackageAsset.package_id == package.id)).all()
    return fitness(package, [available_relation(db, r) for r in rows])
