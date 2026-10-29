from starlette.requests import Request
import pytest
from backend.auth import Actor, Problem, scope_actor


def actor():
    return Actor('u','u','成员',{'a','b'},{'a':{'admin'},'b':{'learner'}},
        permissions={'a':{'read','run'},'b':{'read'}})


def request(project):
    return Request({'type':'http','headers':[(b'x-project-id',project.encode())]})


def test_selection_narrows_lists_and_operations():
    scoped=scope_actor(actor(),request('b'))
    assert scoped.projects()==['b'] and not scoped.can('read','a')
    assert not scoped.can('run','b') and set(scoped.permissions)=={'b'}


def test_selection_cannot_create_access():
    with pytest.raises(Problem) as exc:scope_actor(actor(),request('other'))
    assert exc.value.status==403


def test_no_selection_preserves_live_scope():
    assert scope_actor(actor(),request('')).projects()==['a','b']
