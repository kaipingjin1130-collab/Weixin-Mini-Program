import pytest
from backend.auth import Actor, Problem
from backend.integrations.a.knowledge import query

REQUEST = {'request_id': 'request-1', 'project_id': 'project-1', 'task_id': 'task-1',
           'question': '检查哪些内容？', 'scenario_id': 'inspection', 'scenario_version': 1,
           'object': '二号楼', 'stage': 'execution', 'conditions': {}}


def actor(grants):
    return Actor('u', 'u', '测试用户', {'project-1'}, {}, org_id='demo-org', permissions={'project-1': set(grants)})


def found(project, data, reader):
    assert reader.can('read', project) and not reader.can('run', project)
    assert not reader.can('read', 'other') and data['object'] == '二号楼'
    citation = {'citation_id': 'c1', 'source_title': '报告', 'locator': {'page': 2},
                'knowledge_revision_id': 'revision', 'evidence_id': 'evidence'}
    response = {'query_id': 'q1', 'status': 'answered', 'knowledge_release_id': 'release',
                'citations': [citation], 'missing_conditions': [], 'warnings': []}
    return response, [{'title': '检查', 'text': '核对防护', 'citation_ids': ['c1']}], 1


def test_result_keeps_reference_and_scope():
    result = query(REQUEST, actor(['knowledge.read']), found)
    assert result['items'][0]['citation_ids'] == ['c1']
    assert result['citations'][0]['evidence_id'] == 'evidence'
    assert result['requiresConfirmation'] is True


def test_unsupported_scene_and_denied_permission():
    value = query({**REQUEST, 'scenario_id': 'handover'}, actor(['knowledge.read']), found)
    assert value['status'] == 'insufficient_evidence' and value['items'] == []
    with pytest.raises(Problem) as error:
        query(REQUEST, actor([]), found)
    assert error.value.status == 403


def test_no_result_and_bad_citations():
    def empty(*args):
        return {'query_id': 'q', 'status': 'insufficient_evidence', 'knowledge_release_id': None,
                'citations': [], 'missing_conditions': ['缺少证据'], 'warnings': []}, [], 0
    assert query(REQUEST, actor(['knowledge.read']), empty)['items'] == []
    def bad(*args):
        response, items, elapsed = found(*args)
        items[0]['citation_ids'] = ['absent']
        return response, items, elapsed
    with pytest.raises(Problem) as error:
        query(REQUEST, actor(['knowledge.read']), bad)
    assert error.value.status == 503
