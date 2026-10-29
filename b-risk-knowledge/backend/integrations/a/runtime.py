"""Explicit v1 switch and independently registered background service scope."""
import json
import os
from contextlib import contextmanager
from pathlib import Path
from ...auth import Actor, Problem
from ...config import settings
from .client import AClient, AClientError
from .registry import SourceRegistration


def enabled():
    return os.environ.get('AB_INTEGRATION_VERSION') == '1.0'


def registration():
    try:
        value = json.loads(Path(os.environ['B_A_SOURCE_REGISTRATION']).read_text(encoding='utf-8'))
        result = SourceRegistration.from_config(value)
        if result.org_id != settings.a_org_id:
            raise ValueError('organization mismatch')
        return result
    except (KeyError, OSError, ValueError, TypeError):
        raise Problem(503, 'SERVICE_NOT_CONFIGURED', 'A 来源服务登记缺失或无效。')


@contextmanager
def client():
    connection = AClient(settings.a_base, settings.b_to_a_key, registration=registration())
    try:
        yield connection
    except AClientError as exc:
        raise Problem(exc.status, exc.code, 'A 来源不可用或不符合已登记的范围，请检查指定成果版本。') from exc
    finally:
        connection.close()


WORK_ACTIONS = {
    'a_import': {'imports.create', 'imports.read'},
    'task_package_import': {'imports.create', 'imports.read'},
    'a_retrospective': {'retrospective.generate', 'retrospective.read'},
    'source_import': {'knowledge.process', 'knowledge.read'},
    'knowledge_generation': {'knowledge.process', 'knowledge.read'},
    'knowledge_extraction': {'knowledge.process', 'knowledge.read'},
    'release_build': {'knowledge.publish', 'knowledge.read'},
    'training_grading': {'training.learn', 'knowledge.read'},
}


def service_actor(user, project, kind='a_import'):
    """No browser token or identity/subject callback; scope is operator configured."""
    reg = registration()
    if not user or not reg.enabled or project not in reg.project_ids or kind not in WORK_ACTIONS:
        raise Problem(403, 'SERVICE_SCOPE_DENIED', '后台任务不在登记项目范围。')
    actions = WORK_ACTIONS[kind]
    if kind not in {'a_import', 'task_package_import', 'a_retrospective'}:
        # Other B background operations need their own explicit operator policy.
        try:
            policy = json.loads(Path(os.environ['B_WORKER_AUTHORIZATION']).read_text(encoding='utf-8'))
            allowed = policy['projects'][project]
            if policy['org_id'] != reg.org_id or not isinstance(allowed, list) or not actions <= set(allowed):
                raise ValueError('work scope denied')
        except (KeyError, OSError, ValueError, TypeError):
            raise Problem(403, 'SERVICE_SCOPE_DENIED', '此后台业务尚未登记项目和动作权限。')
    return Actor(user.id, 'b-service', '登记的后台处理服务', {project}, {}, org_id=reg.org_id,
                 is_service=True, producers=frozenset({'a'}), permissions={project: set(actions)})
