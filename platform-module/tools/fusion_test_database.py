"""Prepare an isolated local database for fusion checks; never reuse B01 storage."""
import json
from pathlib import Path
import secrets
import subprocess
import time

ROOT = Path(__file__).resolve().parents[2]
LOCAL = ROOT / 'b-risk-knowledge/.local'
CONTAINER = 'qaxc-fusion-test-postgres'

def run(*args, check=True):
    return subprocess.run(args, check=check, capture_output=True, text=True, encoding='utf-8')

def main():
    LOCAL.mkdir(parents=True, exist_ok=True)
    config = LOCAL / 'config.json'
    if not config.exists():
        password = secrets.token_hex(24)
        (LOCAL / 'fusion-postgres.env').write_text(f'POSTGRES_USER=fusion\nPOSTGRES_PASSWORD={password}\nPOSTGRES_DB=fusion\n', encoding='utf-8')
        config.write_text(json.dumps({'environment': 'development', 'auth_mode': 'mock',
            'database_url': f'postgresql+psycopg://fusion:{password}@127.0.0.1:55447/fusion',
            'storage': str(LOCAL / 'fusion-storage')}, ensure_ascii=False, indent=2), encoding='utf-8')
    data = json.loads(config.read_text(encoding='utf-8'))
    if '@127.0.0.1:55447/fusion' not in data['database_url']:
        raise RuntimeError('Existing config is not the isolated fusion database; refusing to modify it.')
    existing = run('docker', 'inspect', CONTAINER, check=False)
    if existing.returncode:
        run('docker', 'run', '-d', '--name', CONTAINER, '--label', 'com.qaxc.purpose=fusion-test',
            '--env-file', str(LOCAL / 'fusion-postgres.env'), '-p', '127.0.0.1:55447:5432',
            '-v', 'qaxc-fusion-test-pgdata:/var/lib/postgresql/data', 'pgvector/pgvector:0.8.7-pg15-trixie')
    else:
        item = json.loads(existing.stdout)[0]
        if item['Config'].get('Labels', {}).get('com.qaxc.purpose') != 'fusion-test':
            raise RuntimeError('Container ownership mismatch')
        if not item['State']['Running']:
            run('docker', 'start', CONTAINER)
    for _ in range(30):
        if run('docker', 'exec', CONTAINER, 'pg_isready', '-U', 'fusion', '-d', 'fusion', check=False).returncode == 0:
            print('Isolated fusion database ready on loopback port 55447; B01 data untouched.')
            return
        time.sleep(1)
    raise RuntimeError('Database did not become ready')

if __name__ == '__main__':
    main()
