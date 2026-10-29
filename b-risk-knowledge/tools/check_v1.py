"""Real A/B integration in the dedicated, localhost-only risk_b_v1_test DB.

Uses .local/config.json or B_V1_TEST_DATABASE_URL. Never clears developer data.
"""
import json
import os
from pathlib import Path
import subprocess
import sys
from urllib.parse import urlsplit
import psycopg

ROOT = Path(__file__).resolve().parents[1]
local_path = ROOT / '.local/config.json'
local = json.loads(local_path.read_text(encoding='utf-8')) if local_path.exists() else {}
value = os.environ.get('B_V1_TEST_DATABASE_URL', local.get('database_url', ''))
parsed = urlsplit(value)
if parsed.scheme != 'postgresql+psycopg' or parsed.hostname not in {'localhost', '127.0.0.1', '::1'}:
    raise SystemExit('Configure a dedicated localhost PostgreSQL instance for v1 tests.')
base = value.rsplit('/', 1)[0]
with psycopg.connect(base.replace('postgresql+psycopg://', 'postgresql://')+'/postgres', autocommit=True) as db:
    if not db.execute("SELECT 1 FROM pg_database WHERE datname='risk_b_v1_test'").fetchone():
        db.execute('CREATE DATABASE risk_b_v1_test')
os.environ.update(B_DATABASE_URL=base+'/risk_b_v1_test', B_STORAGE=str(ROOT/'.local/v1-test-storage'),
                  B_ENV='development', B_AUTH_MODE='mock')
os.chdir(ROOT)
for args in [
    ['-m', 'alembic', 'upgrade', 'head'],
    ['-m', 'backend.initialize'],
    ['-m', 'pytest', 'tests/test_a_v1_flow.py', '-q', '--tb=short', '-p', 'no:cacheprovider',
     '--basetemp=.local/v1-pytest', '--junitxml=.local/v1-results.xml'],
]:
    result = subprocess.run([sys.executable, *args])
    if result.returncode:
        sys.exit(result.returncode)
