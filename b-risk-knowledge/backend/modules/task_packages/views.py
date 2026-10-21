from sqlalchemy import select
from ...models import ProcessingRun
from .models import TaskPackage, TaskStream, TaskEvent, TaskPackageAsset, PackageInvalidation
from .service import status_dto
from .assessment import available_relation


def summary(db, package):
    stream = db.get(TaskStream, package.stream_id)
    return {**status_dto(db, package), 'id': package.id, 'producer': package.producer,
        'task_id': package.task_id, 'package_id': package.package_id, 'package_version': package.package_version,
        'project_id': package.project_id, 'scene_code': package.scene_code, 'is_demo': package.is_demo,
        'name': package.snapshot['task']['name'] if package.state != 'withdrawn' else '已撤回任务包',
        'created_at': package.created_at, 'row_version': package.row_version,
        'latest_received_version': stream.latest_received_version, 'current_ready_version': stream.current_ready_version,
        'current_package_id': stream.current_package_id}


def difference(current, previous):
    if not previous:
        return {'previous_receipt_id': None, 'changes': []}
    changes = []
    for name in ('task', 'participants', 'issues', 'data_completeness', 'scene_code', 'extensions'):
        if current.snapshot.get(name) != previous.snapshot.get(name):
            changes.append({'section': name, 'before': previous.snapshot.get(name), 'after': current.snapshot.get(name)})
    for name, field in [('events', 'event_id'), ('attachments', 'attachment_id')]:
        before = {x[field]: x for x in previous.snapshot[name]}
        after = {x[field]: x for x in current.snapshot[name]}
        # Excluded transport fields must not masquerade as business changes.
        if name == 'attachments':
            before = {k: {f: v for f, v in x.items() if f != 'access_ref'} for k, x in before.items()}
            after = {k: {f: v for f, v in x.items() if f != 'access_ref'} for k, x in after.items()}
        added, removed = sorted(set(after)-set(before)), sorted(set(before)-set(after))
        changed = [k for k in sorted(set(before)&set(after)) if before[k] != after[k]]
        before_order = [x[field] for x in previous.snapshot[name]]
        after_order = [x[field] for x in current.snapshot[name]]
        order_changed = before_order != after_order
        if added or removed or changed or order_changed:
            changes.append({'section': name, 'added': added[:20], 'removed': removed[:20],
                            'changed': [{'id': k, 'before': before[k], 'after': after[k]} for k in changed[:20]],
                            'counts': {'added': len(added), 'removed': len(removed), 'changed': len(changed)},
                            'order_changed': order_changed, 'before_order': before_order[:20], 'after_order': after_order[:20]})
    return {'previous_receipt_id': previous.id, 'previous_version': previous.package_version, 'changes': changes}


def detail(db, package, event_after=0):
    result = summary(db, package)
    invalidations = db.scalars(select(PackageInvalidation).where(PackageInvalidation.package_id == package.id)).all()
    result['invalidations'] = [{'id': e.id, 'state': e.state, 'pending_consumers': e.payload['pending_consumers']} for e in invalidations]
    if package.state == 'withdrawn':
        return {**result, 'withdrawn_at': package.withdrawn_at, 'snapshot_available': False}
    run = db.get(ProcessingRun, package.run_id)
    events = db.scalars(select(TaskEvent).where(TaskEvent.package_id == package.id, TaskEvent.position >= event_after)
                         .order_by(TaskEvent.position).limit(101)).all()
    rows = db.scalars(select(TaskPackageAsset).where(TaskPackageAsset.package_id == package.id).order_by(TaskPackageAsset.external_attachment_id)).all()
    assets = {a['attachment_id']: a for a in package.snapshot['attachments']}
    previous = db.scalar(select(TaskPackage).where(TaskPackage.stream_id == package.stream_id,
        TaskPackage.package_version < package.package_version, TaskPackage.state != 'withdrawn').order_by(TaskPackage.package_version.desc()).limit(1))
    versions = db.scalars(select(TaskPackage).where(TaskPackage.stream_id == package.stream_id).order_by(TaskPackage.package_version.desc())).all()
    return {**result, 'snapshot_available': True, 'task': package.snapshot['task'], 'participants': package.snapshot['participants'],
        'issues': package.snapshot['issues'], 'data_completeness': package.snapshot['data_completeness'],
        'content_hash': package.content_hash, 'progress': run.progress, 'job_status': run.status, 'job_row_version': run.row_version,
        'events': [{'event_id': e.external_event_id, 'event_type': e.event_type, 'occurred_at': e.occurred_at,
                    'related_object_id': e.related_object_id,
                    'actor': e.actor, 'payload': e.payload, 'evidence_refs': e.evidence_refs,
                    'is_known': e.is_known, 'position': e.position} for e in events[:100]],
        'event_next': events[100].position if len(events)>100 else None,
        'attachments': [{'attachment_id': r.external_attachment_id, 'state': available_relation(db, r).verification_state, 'error': available_relation(db, r).error,
            'evidence_type': assets[r.external_attachment_id]['evidence_type'], 'size': assets[r.external_attachment_id]['size'],
            'mime_type': assets[r.external_attachment_id]['mime_type'], 'asset_id': r.asset_id if r.verification_state == 'verified' else None,
            'event_ids': [e['event_id'] for e in package.snapshot['events'] if r.external_attachment_id in e['evidence_refs']],
            'issue_ids': [i['issue_id'] for i in package.snapshot['issues'] if r.external_attachment_id in i['evidence_refs']]}
            for r in rows], 'diff': difference(package, previous),
        'versions': [{'id': v.id, 'package_version': v.package_version, 'state': v.state,
                      'is_current': v.id == result['current_package_id']} for v in versions]}
