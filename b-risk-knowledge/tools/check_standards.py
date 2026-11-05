"""K01a isolated checks. Create a fresh owned database; never reset existing databases."""
import json
import os
from pathlib import Path
import subprocess
import sys
from uuid import uuid4
import psycopg
from psycopg import sql

ROOT = Path(__file__).resolve().parents[1]


def main():
    local = json.loads((ROOT / '.local/config.json').read_text(encoding='utf-8'))
    base = local['database_url'].rsplit('/', 1)[0]
    from urllib.parse import urlsplit
    if urlsplit(base).hostname not in {'127.0.0.1', 'localhost'}:
        raise SystemExit('Only local PostgreSQL is allowed for K01 checks.')
    name = 'risk_b_k01_' + uuid4().hex[:12]
    work = ROOT / '.local' / name
    work.mkdir(parents=True)
    url = base.replace('postgresql+psycopg://', 'postgresql://')
    env = dict(os.environ, B_DATABASE_URL=base + '/' + name, B_STORAGE=str(work / 'storage'),
        B_AUTH_MODE='mock', B_ENV='development', PYTHONUTF8='1')
    # CREATE without IF NOT EXISTS ensures we own this exact new database.
    with psycopg.connect(url + '/postgres', autocommit=True) as db:
        db.execute(sql.SQL('CREATE DATABASE {}').format(sql.Identifier(name)))
    passed = False
    def run(*args):
        subprocess.run([sys.executable, *args], cwd=ROOT, env=env, check=True)
    def counts():
        with psycopg.connect(url + '/' + name) as db:
            return db.execute('SELECT (SELECT count(*) FROM user_links), (SELECT count(*) FROM file_assets)').fetchone()
    try:
        run('-m', 'alembic', 'upgrade', '0009_scenes_learning_scope')
        run('-m', 'backend.initialize')
        before = counts()
        run('-m', 'alembic', 'upgrade', 'head')
        run('-m', 'alembic', 'upgrade', 'head')
        assert counts() == before, 'Upgrade altered existing assets or users'
        selected = sys.argv[1:] or ['tests/test_standard_library.py']
        if any(not p.startswith('tests/test_') or not p.endswith('.py') or '..' in p for p in selected):
            raise ValueError('Only explicit project test files are accepted')
        run('-m', 'pytest', *selected, '-q', '-p', 'no:cacheprovider',
            '--basetemp', str(work / 'pytest'), '--junitxml', str(work / 'results.xml'))
        after = counts()
        run('-m', 'alembic', 'downgrade', '0009_scenes_learning_scope')
        assert counts() == after, 'Downgrade altered shared data'
        run('-m', 'alembic', 'upgrade', 'head')
        assert counts() == after, 'Re-upgrade altered shared data'
        passed = True
        (work / 'checks.json').write_text(json.dumps({'status': 'passed', 'existing_data_preserved': True,
            'idempotent_upgrade': True, 'downgrade_reupgrade': True, 'report': str(work / 'results.xml')}, indent=2), encoding='utf-8')
        print('K01 checks passed; report:', work / 'checks.json')
    finally:
        if passed:
            # Only the name generated and successfully CREATEd in this invocation.
            with psycopg.connect(url + '/postgres', autocommit=True) as db:
                db.execute(sql.SQL('DROP DATABASE {}').format(sql.Identifier(name)))
        else:
            print('Failed check database retained for diagnosis:', name)


if __name__ == '__main__':
    main()
