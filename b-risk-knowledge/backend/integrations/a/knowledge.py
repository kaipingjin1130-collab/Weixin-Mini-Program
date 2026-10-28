"""Translate A's knowledge request and B's published, cited search results."""
import json
from pathlib import Path
from uuid import uuid4
from jsonschema import Draft202012Validator
from ...auth import Actor, Problem, authorize

SCHEMA = json.loads((Path(__file__).resolve().parents[3] / 'contracts/ab-integration-v1.schema.json').read_text(encoding='utf-8'))
REQUEST = Draft202012Validator({'$defs': SCHEMA['$defs'], '$ref': '#/$defs/knowledge_request'})
RESPONSE = Draft202012Validator({'$defs': SCHEMA['$defs'], '$ref': '#/$defs/knowledge_response'})


def query(data, actor, search_fn):
    if list(REQUEST.iter_errors(data)):
        raise Problem(422, 'VALIDATION_ERROR', '知识查询字段不符合合同。')
    project = data['project_id']
    authorize(actor, 'knowledge.read' if actor.permissions is not None else 'read', project)
    if data['scenario_id'] != 'inspection':
        return {'query_id': str(uuid4()), 'status': 'insufficient_evidence', 'knowledge_release_id': None,
                'items': [], 'citations': [], 'missing_conditions': ['该场景尚未支持。'],
                'warnings': [{'code': 'SCENE_UNSUPPORTED', 'path': '/scenario_id', 'message': '该场景尚未注册，不能推断为其他场景。'}],
                'requiresConfirmation': True}
    # Keep object text separate from the unclassified object type; do not infer a category.
    conditions = data['conditions']
    if any(not isinstance(k, str) or not isinstance(v, (str, int, float, bool, type(None))) for k, v in conditions.items()):
        raise Problem(422, 'VALIDATION_ERROR', '查询条件只能包含简单字段值。')
    # A read permission is scoped to this one operation and one project; it never grants mutation.
    reader = Actor(actor.id, actor.subject, actor.name, {project}, {project: {'learner'}}, org_id=actor.org_id)
    response, found, _ = search_fn(project, data, reader)
    citations = []
    for c in response['citations']:
        citations.append({'citation_id': c['citation_id'], 'source_title': c['source_title'],
                          'locator': json.dumps(c['locator'], ensure_ascii=False, sort_keys=True),
                          'knowledge_revision_id': c.get('knowledge_revision_id'), 'evidence_id': c.get('evidence_id')})
    by_id = {c['citation_id']: c for c in citations}
    items = []
    for item in found:
        ids = item['citation_ids']
        if not ids or any(i not in by_id for i in ids):
            raise Problem(503, 'RESPONSE_CONTRACT_ERROR', '查询结果缺少有效引用。')
        items.append({'title': item['title'], 'text': item['text'],
                      'reference': '; '.join(by_id[i]['source_title'] + ' ' + by_id[i]['locator'] for i in ids),
                      'citation_ids': ids})
    result = {'query_id': response['query_id'], 'status': response['status'],
              'knowledge_release_id': response['knowledge_release_id'], 'items': items, 'citations': citations,
              'missing_conditions': response['missing_conditions'], 'warnings': response['warnings'],
              'requiresConfirmation': True}
    if list(RESPONSE.iter_errors(result)) or (result['status'] == 'answered' and not items):
        raise Problem(503, 'RESPONSE_CONTRACT_ERROR', '查询响应不符合合同。')
    return result
