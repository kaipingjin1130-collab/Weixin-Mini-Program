from copy import deepcopy
import hashlib
from uuid import uuid4
from ...config import ROOT
from ...auth import authorize, Problem
from .connectors import OBJECTS

SCENARIOS = {
    'complete': '完整作业过程（含整改与复核）',
    'v2': '相同任务的第2版',
    'no-time': '缺少实际时间',
    'unknown-event': '保留未知事件',
    'bad-attachment': '附件校验失败',
    'expired-ref': '模拟取件标识过期',
    'summary-only': '只有任务资料，无过程事件',
    'interrupt-once': '中断后重试，验证不重复产出',
}


def attachment(object_id, attachment_id, evidence_type):
    obj = OBJECTS[object_id]
    content = (ROOT/'fixtures/b05'/obj.filename).read_bytes()
    return {'attachment_id': attachment_id, 'sha256': hashlib.sha256(content).hexdigest(), 'size': len(content),
            'mime_type': obj.mime_type, 'evidence_type': evidence_type,
            'access_ref': {'connector_id': 'demo-store', 'object_id': object_id}}


def sample(name='complete', project_id='demo-airport', task_id='b05-demo-task'):
    if name not in SCENARIOS or project_id not in {'demo-airport', 'demo-metro'}:
        raise Problem(422, 'UNKNOWN_DEMO', '请选择已登记的模拟任务包。')
    photo = attachment('airport-photo' if project_id == 'demo-airport' else 'metro-log', 'evidence-photo',
                       'site_photo' if project_id == 'demo-airport' else 'source_document')
    log = attachment('airport-log' if project_id == 'demo-airport' else 'metro-log', 'evidence-log', 'source_document')
    version = 2 if name == 'v2' else 1
    package = {'schema_version': '1.0', 'producer': 'a-demo', 'package_id': f'{task_id}.v{version}',
        'task_id': task_id, 'package_version': version, 'exported_at': '2026-10-21T09:00:00+08:00',
        'org_id': 'demo-org', 'project_id': project_id, 'scene_code': 'lifting_supervision',
        'task': {'name': '模拟吊装监护任务', 'status': 'completed', 'started_at': '2026-10-19T08:00:00+08:00',
                 'completed_at': '2026-10-19T10:00:00+08:00'},
        'participants': [{'actor_id': 'supervisor-demo', 'role': 'supervisor'}, {'actor_id': 'contractor-demo', 'role': 'contractor'}],
        'events': [], 'issues': [{'issue_id': 'issue-demo', 'description': '模拟问题：作业区隔离措施需完善。',
            'status': 'closed', 'responsible_actor_id': 'contractor-demo', 'due_at': '2026-10-19T09:30:00+08:00',
            'rectification': '模拟整改：补充隔离设施与现场核对。', 'review_conclusion': '模拟复核通过，不代表实际工程结论。',
            'evidence_refs': ['evidence-photo', 'evidence-log']}], 'attachments': [photo, log],
        'data_completeness': {k: 'complete' for k in ['participants', 'events', 'issues', 'attachments', 'event_times']}, 'is_demo': True}
    stages = [('task_started', '08:00', '任务开始'), ('inspection_recorded', '08:15', '完成模拟现场检查'),
        ('issue_created', '08:20', '提出模拟问题'), ('rectification_submitted', '08:45', '提交第一次整改'),
        ('review_rejected', '09:00', '模拟复核退回，补充隔离措施'), ('rectification_submitted', '09:15', '补充整改材料'),
        ('review_accepted', '09:30', '模拟复核通过'), ('task_completed', '10:00', '任务结束')]
    for i, (event_type, time, note) in enumerate(stages):
        package['events'].append({'event_id': f'event-{i+1}', 'event_type': event_type,
            'occurred_at': f'2026-10-19T{time}:00+08:00',
            'actor_id': 'contractor-demo' if event_type == 'rectification_submitted' else 'supervisor-demo',
            'actor_role': 'contractor' if event_type == 'rectification_submitted' else 'supervisor',
            'related_object_id': task_id if event_type in {'task_started', 'task_completed', 'inspection_recorded'} else 'issue-demo',
            'payload': {'note': note}, 'evidence_refs': [] if i == 0 else ['evidence-photo' if i < 3 else 'evidence-log']})
    if name == 'v2':
        package['issues'][0]['review_conclusion'] += ' 第2版补充说明。'
        package['events'][-2]['payload']['note'] = '第2版补充复核说明，原版保持可追溯。'
    elif name == 'no-time':
        package['events'][3]['occurred_at'] = None
        package['data_completeness']['event_times'] = 'partial'
    elif name == 'unknown-event':
        package['events'][2]['event_type'] = 'a_custom_observation'
    elif name == 'bad-attachment':
        package['attachments'][0]['sha256'] = 'a'*64
    elif name == 'expired-ref':
        package['attachments'][0]['access_ref']['object_id'] = 'expired-airport-photo'
    elif name == 'summary-only':
        package['events'] = []
        package['data_completeness']['events'] = 'missing'
        package['data_completeness']['event_times'] = 'not_applicable'
    elif name == 'interrupt-once':
        package['extensions'] = {'b.mock_interrupt_once': True}
    return package
