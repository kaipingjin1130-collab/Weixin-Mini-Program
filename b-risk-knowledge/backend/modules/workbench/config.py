import json
import os
from pathlib import Path
from ...config import ROOT, settings
from ...auth import Problem
from .schemas import Settings

COMPONENT_ROOT = ROOT / '.local' / 'components'


def executable():
    return COMPONENT_ROOT / ('Scripts/python.exe' if os.name == 'nt' else 'bin/python')


def path():
    return settings.storage.parent / 'workbench.json'


def load():
    try:
        return Settings.model_validate_json(path().read_text(encoding='utf-8')) if path().exists() else Settings()
    except (OSError, ValueError):
        raise Problem(503, 'COMPONENT_CONFIG_INVALID', '组件配置不可读取，请联系管理员。')


def save(data):
    old = load()
    if not data.deepseek_api_key.get_secret_value():
        data.deepseek_api_key = old.deepseek_api_key
    target = path()
    target.parent.mkdir(parents=True, exist_ok=True)
    value = data.model_dump(mode='json')
    value['deepseek_api_key'] = data.deepseek_api_key.get_secret_value()
    temporary = target.with_suffix('.new')
    temporary.write_text(json.dumps(value, ensure_ascii=False), encoding='utf-8')
    if os.name != 'nt':
        temporary.chmod(0o600)
    temporary.replace(target)
    return public(data)


def public(data):
    value = data.model_dump(mode='json', exclude={'deepseek_api_key'})
    return {**value, 'key_configured': bool(data.deepseek_api_key.get_secret_value()), 'runtime_installed': executable().is_file()}


def require_model(data, allow):
    if not data.enabled or not data.external_calls_enabled or not allow or not data.deepseek_api_key.get_secret_value():
        raise Problem(409, 'DEEPSEEK_NOT_CONFIGURED', '需要启用组件、配置DeepSeek官方密钥，并明确允许本任务发送所选资料。')
