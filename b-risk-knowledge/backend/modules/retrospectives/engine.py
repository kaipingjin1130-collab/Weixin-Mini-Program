"""Pure deterministic calculations; suggestions are a labelled local mock adapter."""
import json
from datetime import datetime
from ...config import ROOT

TEMPLATE = json.loads((ROOT/'scene-packs/generic/retrospective-v1.json').read_text(encoding='utf-8'))


def instant(value):
    return datetime.fromisoformat(value.replace('Z', '+00:00')) if value else None


def build_task(snapshot):
    events = snapshot['events']
    known, unknown = [], []
    for pos, event in enumerate(events):
        row = {**event, 'source_position': pos, 'reference': 'event:'+event['event_id']}
        (known if event.get('occurred_at') else unknown).append(row)
    known.sort(key=lambda e: (instant(e['occurred_at']), e['source_position'], e['event_id']))
    intervals, deadlines, findings = [], [], []
    starts = [e for e in known if e['event_type'] == 'task_started' and e['related_object_id'] == snapshot['task_id']]
    ends = [e for e in known if e['event_type'] == 'task_completed' and e['related_object_id'] == snapshot['task_id']]
    if len(starts) == len(ends) == 1 and instant(ends[0]['occurred_at']) >= instant(starts[0]['occurred_at']):
        intervals.append({'name': '开始至结束的记录时间差', 'seconds': (instant(ends[0]['occurred_at'])-instant(starts[0]['occurred_at'])).total_seconds(), 'event_refs': [starts[0]['event_id'], ends[0]['event_id']]})
    for step in TEMPLATE['steps']:
        matches = [e for e in events if e['event_type'] == step['event_type'] and
                   (e['related_object_id'] == snapshot['task_id'] if step['scope'] == 'task' else e['related_object_id'] in {i['issue_id'] for i in snapshot['issues']})]
        na = step['scope'] == 'issue' and not snapshot['issues'] and snapshot.get('data_completeness', {}).get('issues') == 'complete'
        status = '有记录' if matches else '不适用' if na else '缺记录'
        notes = '；'.join(str(e.get('payload', {}).get('note') or e['event_type'])[:500] for e in matches[:5])
        text = f"{step['name']}：{status}。" + (f'共{len(matches)}条，来源摘录：{notes}。' if matches else '本包明确声明无问题记录。' if na else '未发现相关记录；不据此判断现场是否执行。')
        findings.append({'id': 'step-'+step['event_type'], 'type': 'template_comparison', 'claim_kind': 'fact' if matches else 'inference',
            'text': text, 'event_refs': [e['event_id'] for e in matches[:100]],
            'evidence_refs': ['event:'+e['event_id'] for e in matches[:100]], 'review_state': 'unconfirmed', 'record_status': status})
    rejected = [e for e in events if e['event_type'] == 'review_rejected' and e['related_object_id'] in {i['issue_id'] for i in snapshot['issues']}]
    if rejected:
        findings.append({'id': 'review-rejections', 'type': 'recorded_rework', 'claim_kind': 'fact',
            'text': f'发现{len(rejected)}条复核退回记录。来源摘录：'+'；'.join(str(e.get('payload', {}).get('note') or '未提供退回说明')[:500] for e in rejected[:5]),
            'event_refs': [e['event_id'] for e in rejected[:100]], 'evidence_refs': ['event:'+e['event_id'] for e in rejected[:100]], 'review_state': 'unconfirmed'})
    rule = TEMPLATE['deadline_rule']
    applicable = snapshot['scene_code'] in rule['applicable_scenes']
    for issue in snapshot['issues']:
        related = [e for e in events if e['related_object_id'] == issue['issue_id'] and e['event_type'] in {'review_accepted', 'review_rejected', 'rectification_submitted'}]
        accepted = [e for e in related if e['event_type'] == rule['completion_event']]
        # A terminal known acceptance, no unknown-time closure actions, and a closed snapshot
        # are required. A deadline alone never establishes overdue on missing records.
        last = max(related, key=lambda e: (instant(e['occurred_at']), events.index(e))) if related and all(e.get('occurred_at') for e in related) else None
        complete = applicable and issue.get('due_at') and issue.get('status') == 'closed' and len(accepted) == 1 and last == accepted[0]
        if complete:
            delta = (instant(accepted[0]['occurred_at'])-instant(issue['due_at'])).total_seconds()
            deadlines.append({'issue_id': issue['issue_id'], 'rule_id': rule['id'], 'due_at': issue['due_at'],
                'accepted_at': accepted[0]['occurred_at'], 'late_seconds': max(0, delta), 'result': '晚于期限' if delta > 0 else '未晚于期限',
                'event_refs': [accepted[0]['event_id']]})
        else:
            deadlines.append({'issue_id': issue['issue_id'], 'result': '不判定', 'reason': '缺少明确期限、适用规则或可核对的终态复核时间。', 'event_refs': []})
    summary = f"已读取{len(events)}条过程事件，其中{len(known)}条具有实际时间，{len(unknown)}条时间未知；记录包含{len(rejected)}条复核退回。具体作业、整改与复核说明已从原事件摘录并关联证据。" if events else '只有任务快照，未发现相关过程记录；仅提供历史资料摘要，不生成过程时长。'
    if not events:
        findings.insert(0, {'id': 'snapshot', 'type': 'task_snapshot', 'text': '任务快照名称：'+snapshot['task']['name'], 'claim_kind': 'fact', 'event_refs': [], 'evidence_refs': ['task:snapshot'], 'review_state': 'unconfirmed'})
    suggestions = [{'id': 'suggestion-1', 'type': 'mock_suggestion', 'claim_kind': 'suggestion', 'text': '建议复用本次检查、整改和复核记录开展新人演练，缺失记录由负责人核实后补充。', 'event_refs': [], 'evidence_refs': [], 'review_state': 'unconfirmed'}]
    return summary, {'known': known, 'unknown_time': unknown, 'intervals': intervals, 'deadlines': deadlines}, findings, suggestions
