"""Explicit service authorization configuration, independent of request bodies."""
from dataclasses import dataclass

ALLOWED_ACTIONS = frozenset({'delivery.meta', 'delivery.snapshot', 'delivery.attachment'})


@dataclass(frozen=True)
class SourceRegistration:
    org_id: str
    project_ids: frozenset[str]
    allowed_actions: frozenset[str]
    enabled: bool

    @classmethod
    def from_config(cls, value):
        if not isinstance(value, dict) or set(value) != {'source_system', 'org_id', 'project_ids', 'allowed_actions', 'enabled'}:
            raise ValueError('invalid A source registration fields')
        projects, actions = value['project_ids'], value['allowed_actions']
        if (value['source_system'] != 'a' or not isinstance(value['org_id'], str) or not value['org_id']
            or type(value['enabled']) is not bool or not isinstance(projects, list) or not projects
            or any(not isinstance(p, str) or not p for p in projects) or len(set(projects)) != len(projects)
            or not isinstance(actions, list) or not actions or any(not isinstance(a, str) for a in actions)
            or len(set(actions)) != len(actions) or not set(actions) <= ALLOWED_ACTIONS):
            raise ValueError('invalid A source registration')
        return cls(value['org_id'], frozenset(projects), frozenset(actions), value['enabled'])

    def permits(self, org_id, project_id, action):
        return (self.enabled and org_id == self.org_id and project_id in self.project_ids
                and action in self.allowed_actions)
