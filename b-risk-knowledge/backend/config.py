import json
import os
from pathlib import Path
from dataclasses import dataclass

ROOT = Path(__file__).resolve().parents[1]


@dataclass(frozen=True)
class Settings:
    database_url: str
    environment: str
    auth_mode: str
    storage: Path


def load_settings() -> Settings:
    path = ROOT / ".local/config.json"
    local = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    env = os.getenv("B_ENV", local.get("environment", "development"))
    auth = os.getenv("B_AUTH_MODE", local.get("auth_mode", "mock"))
    if env != "development" or auth != "mock":
        raise RuntimeError("B01 only supports explicit local development/mock mode. Production identity is not configured.")
    url = os.getenv("B_DATABASE_URL", local.get("database_url", ""))
    if not url.startswith("postgresql+psycopg://"):
        raise RuntimeError("Configure a dedicated PostgreSQL URL using tools/bootstrap.py.")
    return Settings(url, env, auth, Path(os.getenv("B_STORAGE", local.get("storage", str(ROOT / ".local/storage")))).resolve())


settings = load_settings()
