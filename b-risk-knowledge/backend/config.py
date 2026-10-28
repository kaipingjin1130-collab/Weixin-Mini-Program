import json
import os
from pathlib import Path
from dataclasses import dataclass, field

ROOT = Path(__file__).resolve().parents[1]


@dataclass(frozen=True)
class Settings:
    database_url: str
    environment: str
    auth_mode: str
    storage: Path
    a_base: str = ''
    a_to_b_key: str = field(default='', repr=False)
    b_to_a_key: str = field(default='', repr=False)
    a_org_id: str = ''


def load_settings() -> Settings:
    path = ROOT / ".local/config.json"
    local = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    env = os.getenv("B_ENV", local.get("environment", "development"))
    auth = os.getenv("B_AUTH_MODE", local.get("auth_mode", "mock"))
    if auth not in {'mock', 'a'} or (auth == 'mock' and env != 'development'):
        raise RuntimeError('Mock authentication is allowed only in development; choose a configured authentication mode.')
    a_base = os.getenv('A_INTERNAL_BASE', local.get('a_internal_base', '')).rstrip('/')
    a_to_b = os.getenv('A_TO_B_KEY', local.get('a_to_b_key', ''))
    b_to_a = os.getenv('B_TO_A_KEY', local.get('b_to_a_key', ''))
    org_id = os.getenv('A_ORG_ID', local.get('a_org_id', ''))
    if auth == 'a' and (not a_base.startswith(('http://', 'https://')) or not a_to_b or not b_to_a or not org_id or a_to_b == b_to_a):
        raise RuntimeError('A identity mode requires a base URL, explicit organization and distinct directional keys.')
    url = os.getenv("B_DATABASE_URL", local.get("database_url", ""))
    if not url.startswith("postgresql+psycopg://"):
        raise RuntimeError("Configure a dedicated PostgreSQL URL using tools/bootstrap.py.")
    return Settings(url, env, auth, Path(os.getenv("B_STORAGE", local.get("storage", str(ROOT / ".local/storage")))).resolve(),
                    a_base, a_to_b, b_to_a, org_id)


settings = load_settings()
