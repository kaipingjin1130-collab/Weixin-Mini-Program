"""Explicit local adapter. Never sends source data to external services."""
from .schemas import Card


class MockKnowledgeAdapter:
    model_ref = 'local-structured-mock-v1'

    def generate(self, version, row, evidence_ids, kind, scenario):
        fields = version.effective_fields
        evidence = ['00000000-0000-0000-0000-000000000000'] if scenario == 'bad_evidence' else evidence_ids[:1]
        standards = []
        if version.raw_fields.get('standard_reference'):
            standards.append({'name': str(version.raw_fields['standard_reference']), 'origin': 'source_unverified'})
        if scenario == 'unverified_standard':
            standards.append({'name': '模拟系统补充依据（未核验）', 'origin': 'system_supplement'})
        return Card(title=f"{'案例卡' if kind == 'case_card' else '检查要点卡'} · {fields.get('description', '')}"[:200],
                    type=kind, facts=[{'text': fields.get('description', ''), 'evidence_ids': evidence}],
                    suggestions=['模拟建议：复核对应来源和整改材料；需人工判断，不作为安全处置指令。'],
                    standards=standards, project_name=version.raw_fields.get('project_name') or row.project_id,
                    occurred_on=fields.get('occurred_on'))


def get_adapter(model_ref='local-structured-mock-v1'):
    if model_ref != MockKnowledgeAdapter.model_ref:
        raise ValueError('Model adapter is not configured')
    return MockKnowledgeAdapter()
