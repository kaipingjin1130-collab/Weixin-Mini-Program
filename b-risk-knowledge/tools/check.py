"""Run real integration checks in a separate database; never clear developer data."""
import json
import os
from pathlib import Path
import subprocess
import sys
import psycopg
from psycopg import sql

ROOT = Path(__file__).resolve().parents[1]
os.chdir(ROOT)
local = json.loads((ROOT / ".local/config.json").read_text(encoding="utf-8"))
base = local["database_url"].rsplit("/", 1)[0]
with psycopg.connect(base.replace("postgresql+psycopg://", "postgresql://") + "/postgres", autocommit=True) as db:
    # This name is reserved for disposable integration checks only.
    db.execute("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='risk_b_test' AND pid<>pg_backend_pid()")
    db.execute(sql.SQL("DROP DATABASE IF EXISTS {}").format(sql.Identifier("risk_b_test")))
    db.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier("risk_b_test")))
os.environ["B_DATABASE_URL"] = base + "/risk_b_test"
os.environ["B_STORAGE"] = str(ROOT / ".local/test-storage")
for command in [
    ["-m", "alembic", "upgrade", "head"],
    ["-m", "backend.initialize"],
    ["-m", "pytest", "tests", "-q", "--tb=short"],
]:
    result = subprocess.run([sys.executable, *command])
    if result.returncode:
        sys.exit(result.returncode)
