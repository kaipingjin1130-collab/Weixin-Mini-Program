import pytest
from backend.integrations.a.registry import SourceRegistration

CONFIG = {'source_system': 'a', 'org_id': 'demo-org', 'project_ids': ['demo-project-001'],
          'allowed_actions': ['delivery.meta', 'delivery.snapshot'], 'enabled': True}


def test_registration_requires_explicit_matching_scope():
    registration = SourceRegistration.from_config(CONFIG)
    assert registration.permits('demo-org', 'demo-project-001', 'delivery.meta')
    assert not registration.permits('demo-org', 'other', 'delivery.meta')
    assert not registration.permits('other', 'demo-project-001', 'delivery.meta')
    assert not registration.permits('demo-org', 'demo-project-001', 'delivery.attachment')
    assert not SourceRegistration.from_config({**CONFIG, 'enabled': False}).permits('demo-org', 'demo-project-001', 'delivery.meta')


@pytest.mark.parametrize('change', [{'project_ids': []}, {'allowed_actions': ['*']}, {'enabled': 1},
                                    {'org_id': ''}, {'source_system': 'other'}, {'project_ids': ['p', 'p']}])
def test_registration_rejects_ambiguous_configuration(change):
    with pytest.raises(ValueError):
        SourceRegistration.from_config({**CONFIG, **change})
