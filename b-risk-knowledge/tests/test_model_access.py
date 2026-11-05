import json
import pytest
from backend.auth import Actor, Problem
from backend.model_access import can_manage_models, require_model_admin


def identity(subject='host:admin:42', org='org', service=False):
    return Actor(subject, subject, '管理员', {'p'}, {'p': {'admin'}}, org_id=org,
                 is_service=service, permissions={'p': {'knowledge.process', 'knowledge.publish'}})


def test_explicit_global_authority_does_not_follow_project_role(monkeypatch):
    monkeypatch.delenv('B_MODEL_ADMIN_IDENTITIES', raising=False)
    assert not can_manage_models(identity())
    with pytest.raises(Problem) as exc:
        require_model_admin(identity())
    assert exc.value.status == 403
    monkeypatch.setenv('B_MODEL_ADMIN_IDENTITIES', json.dumps([{'org_id': 'org', 'subject_id': 'host:admin:42'}]))
    assert can_manage_models(identity())
    assert not can_manage_models(identity(org='other'))
    assert not can_manage_models(identity(subject='someone'))
    assert not can_manage_models(identity(service=True))
    revoked = identity(); revoked.grants = set()
    assert not can_manage_models(revoked)


@pytest.mark.parametrize('value', ['bad-json', '{}', '["host:admin:42"]'])
def test_invalid_operator_config_fails_closed(monkeypatch, value):
    monkeypatch.setenv('B_MODEL_ADMIN_IDENTITIES', value)
    assert not can_manage_models(identity())


def test_legacy_admin_and_processor():
    actor = identity(); actor.permissions = None
    assert can_manage_models(actor)
    actor.roles = {'p': {'processor'}}
    assert not can_manage_models(actor)
