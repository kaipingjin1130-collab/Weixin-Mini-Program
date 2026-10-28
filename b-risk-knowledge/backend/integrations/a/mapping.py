"""Conservative, deterministic mapping of A snapshots to B's proposed contract."""
import hashlib
import re
from contracts.tools.contract_rules import validate, content_hash
from .offline import _json

ADAPTER_VERSION = 'a-offline/1.0'


def convert(raw, snapshot, *, org_id, project_id, is_demo):
    if _json(raw) != snapshot:
        raise ValueError('snapshot does not match raw bytes')
    if not isinstance(is_demo, bool) or not org_id or not project_id:
        raise ValueError('explicit organization, project and data classification required')
    task, project = snapshot['task'], snapshot['project']
    if project['id'] != project_id or task['projectId'] != project_id:
        raise ValueError('project reference mismatch')
    if snapshot.get('schemaVersion') != '1.0':
        raise ValueError('unsupported snapshot version')
    if snapshot.get('scenario', {}).get('id') != 'inspection':
        raise ValueError('unsupported scenario')
    if len(task.get('events', [])) > 500 or len(snapshot.get('evidence', [])) > 100:
        raise ValueError('event or attachment limit exceeded')
    if task.get('status') != 'archived':
        raise ValueError('offline snapshot is not archived')
    members = snapshot.get('members', [])
    ids = {m['id'] for m in members}
    roles = {m['id']: m.get('role') or 'unknown' for m in members}
    participants = [{'actor_id': m['id'], 'role': m.get('role') or 'unknown'} for m in members]
    actions = {'start': 'task_started', 'record': 'inspection_recorded', 'issue': 'issue_created',
               'reply': 'rectification_submitted', 'archive': 'task_completed'}
    events = []
    for e in task.get('events', []):
        action = e.get('action', '')
        kind = actions.get(action, 'a_' + re.sub(r'[^a-z0-9_]', '_', action.lower())[:60])
        events.append({'event_id': e['id'], 'event_type': kind, 'occurred_at': None,
                       'actor_id': e.get('actor') if e.get('actor') in ids else None,
                       'actor_role': roles.get(e.get('actor'), 'unknown'), 'related_object_id': task['id'],
                       'payload': {'source_event': e, 'time_precision': 'unknown'}, 'evidence_refs': []})
    issues = []
    for issue in task.get('issues', []):
        status = issue.get('status') if issue.get('status') in {'open', 'rectifying', 'pending_review', 'closed'} else 'unknown'
        issues.append({'issue_id': issue['id'], 'description': issue['description'], 'status': status,
                       'responsible_actor_id': issue.get('assignee') if issue.get('assignee') in ids else None,
                       'due_at': None, 'rectification': None, 'review_conclusion': None,
                       'evidence_refs': list(dict.fromkeys(issue.get('evidence', [])))})
    attachments = []
    for e in snapshot.get('evidence', []):
        if e.get('projectId') != project_id or not isinstance(e.get('size'), int) or isinstance(e.get('size'), bool) or e['size'] > 10 * 1024 * 1024:
            raise ValueError('attachment project or size invalid')
        attachments.append({'attachment_id': e['id'], 'sha256': e['sha256'], 'mime_type': e['mime'],
                            'size': e['size'], 'evidence_type': 'unknown',
                            'access_ref': {'connector_id': 'a_offline', 'object_id': e['id']}})
    completeness = {name: ('partial' if values else 'missing') for name, values in
                    [('participants', participants), ('events', events), ('issues', issues), ('attachments', attachments)]}
    if 'issues' in task and not issues:
        completeness['issues'] = 'complete'
    completeness['event_times'] = 'missing'
    package = {'schema_version': '1.0', 'producer': 'a', 'package_id': 'a:' + snapshot['packageId'],
               'task_id': task['id'], 'package_version': snapshot['version'], 'exported_at': snapshot['exportedAt'],
               'project_id': project_id, 'org_id': org_id, 'scene_code': 'general_inspection',
               'task': {'name': task['title'], 'status': 'archived', 'started_at': None, 'completed_at': None},
               'participants': participants, 'events': events, 'issues': issues, 'attachments': attachments,
               'data_completeness': completeness, 'is_demo': is_demo}
    errors, warnings = validate('task-package.schema.json', package)
    if errors:
        raise ValueError('contract validation failed: ' + ', '.join(errors))
    time_precision = []
    for record in task.get('records', []):
        # A report provenance signals date-only data; otherwise precision remains unknown.
        provenance = bool(record.get('sourceReportId') or record.get('sourceReport') or
                          str(record.get('source', '')).startswith('legacy-report:'))
        time_precision.append({'record_id': record.get('id'), 'original': record.get('occurredAt'),
                               'precision': 'date' if provenance else 'unknown'})
    for evidence in snapshot.get('evidence', []):
        time_precision.append({'evidence_id': evidence.get('id'), 'original': evidence.get('occurredAt'),
                               'precision': 'date' if str(evidence.get('source', '')).startswith('legacy-report:') else 'unknown'})
    return {'adapter_version': ADAPTER_VERSION, 'source_schema_version': snapshot['schemaVersion'],
            'contract_version': '1.0', 'raw_sha256': hashlib.sha256(raw).hexdigest(),
            'raw_snapshot': snapshot, 'record_time_precision': time_precision, 'package': package,
            'content_hash': content_hash(package), 'warnings': warnings}
