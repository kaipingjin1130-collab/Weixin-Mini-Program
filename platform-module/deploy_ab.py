"""Run on the authorized Linux host: prepare, check, activate, or rollback.

Separate B storage/database. Existing A authentication and nginx stay in place.
Never prints credentials. Activation checks the known A server baseline.
"""
import hashlib
import json
import os
from pathlib import Path
import secrets
import shutil
import sqlite3
import subprocess
import sys
import time
import urllib.request

SOURCE = Path(__file__).resolve().parents[1]
ROOT = Path('/opt/qaxc-ab')
B = ROOT / 'b-risk-knowledge'
STATIC = ROOT / 'platform-module/b-web'
STATE = Path('/var/lib/qaxc-b')
BACKUP = Path('/var/backups/qaxc-ab-20261028')
CONTAINER = 'qaxc-b-postgres'
PY = str(B / '.venv/bin/python')
BASELINE = 'ba4114c47c46443a1e745f74be75524e74d23eca8aa2fa2d10b0300725edf9a6'

def run(*args, **kwargs):
    subprocess.run(list(args), check=True, **kwargs)

def write(path, content, mode=0o600):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content)
    path.chmod(mode)

def load_env(path):
    return dict(line.split('=',1) for line in path.read_text().splitlines() if line and not line.startswith('#'))

def environment():
    return {**os.environ, **load_env(Path('/etc/qaxc-b.env'))}

def native_database():
    # Ubuntu's configured package archive avoids dependency on Docker Hub.
    env={**os.environ, 'DEBIAN_FRONTEND':'noninteractive', 'NEEDRESTART_MODE':'l'}
    run('apt-get','install','-y','postgresql-16','postgresql-16-pgvector','python3-venv',env=env)
    cluster=Path('/etc/postgresql/16/qaxcb/postgresql.conf')
    if not cluster.exists():
        run('pg_createcluster','16','qaxcb','--port','55440','--start')
    if subprocess.run(['pg_isready','-h','127.0.0.1','-p','55440'],stdout=subprocess.DEVNULL).returncode:
        run('pg_ctlcluster','16','qaxcb','start')
    password=load_env(Path('/etc/qaxc-b-postgres.env'))['POSTGRES_PASSWORD']
    exists=subprocess.run(['runuser','-u','postgres','--','psql','-p','55440','-tAc',"SELECT 1 FROM pg_roles WHERE rolname='qaxc_b'"],capture_output=True,text=True,check=True)
    if not exists.stdout.strip():
        # Password is generated hex; pass through stdin, never logs or shell arguments.
        run('runuser','-u','postgres','--','psql','-p','55440','-v','ON_ERROR_STOP=1',
            input=f"CREATE ROLE qaxc_b LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '{password}';\nCREATE DATABASE qaxc_b OWNER qaxc_b;\n",text=True,stdout=subprocess.DEVNULL)
    run('runuser','-u','postgres','--','psql','-p','55440','-d','qaxc_b','-v','ON_ERROR_STOP=1','-c','CREATE EXTENSION IF NOT EXISTS vector',stdout=subprocess.DEVNULL)

def service(name, command):
    write(Path('/etc/systemd/system/'+name+'.service'), f'''[Unit]
Description=Quality inspector knowledge service {name}
After=network.target postgresql.service
[Service]
Type=simple
User=qaxc-b
Group=qaxc-b
WorkingDirectory={B}
EnvironmentFile=/etc/qaxc-b.env
Environment=PYTHONDONTWRITEBYTECODE=1
ExecStart={command}
Restart=on-failure
RestartSec=5
UMask=0077
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths={STATE}
MemoryMax=768M
[Install]
WantedBy=multi-user.target
''',0o644)

def prepare():
    if SOURCE != ROOT:
        raise RuntimeError('Extract release into /opt/qaxc-ab first')
    if subprocess.run(['id','qaxc-b'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode:
        run('useradd','--system','--home-dir',str(STATE),'--shell','/usr/sbin/nologin','qaxc-b')
    STATE.mkdir(parents=True,exist_ok=True)
    run('chown','qaxc-b:qaxc-b',str(STATE))
    if not Path('/etc/qaxc-b.env').exists():
        password,a_to_b,b_to_a=secrets.token_hex(24),secrets.token_hex(32),secrets.token_hex(32)
        write(Path('/etc/qaxc-b-postgres.env'),f'POSTGRES_USER=qaxc_b\nPOSTGRES_PASSWORD={password}\nPOSTGRES_DB=qaxc_b\n')
        write(Path('/etc/qaxc-b.env'),f'B_ENV=production\nB_AUTH_MODE=a\nB_DATABASE_URL=postgresql+psycopg://qaxc_b:{password}@127.0.0.1:55440/qaxc_b\nB_STORAGE={STATE}/storage\nA_INTERNAL_BASE=http://127.0.0.1:18765/quality\nA_ORG_ID=qaxc\nA_TO_B_KEY={a_to_b}\nB_TO_A_KEY={b_to_a}\n')
        write(Path('/etc/qaxc-b-bridge.env'),f'QAXC_B_URL=http://127.0.0.1:18181\nQAXC_B_STATIC={STATIC}\nA_ORG_ID=qaxc\nA_TO_B_KEY={a_to_b}\nB_TO_A_KEY={b_to_a}\n')
    native_database()
    if not Path(PY).exists():
        run('python3','-m','venv',str(B/'.venv'))
    run(PY,'-m','pip','install','-r',str(B/'requirements.txt'),'--disable-pip-version-check')
    env=environment()
    run(PY,'-m','alembic','upgrade','head',cwd=B,env=env)
    run(PY,'-m','backend.initialize',cwd=B,env=env)
    service('qaxc-b-api',f'{PY} -m uvicorn backend.app:app --host 127.0.0.1 --port 18181 --no-access-log')
    service('qaxc-b-worker',f'{PY} -m backend.worker')
    run('systemctl','daemon-reload')
    run('systemctl','enable','--now','qaxc-b-api','qaxc-b-worker')
    print('PREPARED: B services created; A files untouched.',flush=True)

def check():
    env=environment()
    (B/'.local').mkdir(exist_ok=True)
    # An isolated, newly created test database. Application role has no CREATEDB.
    run('runuser','-u','postgres','--','createdb','-p','55440','-O','qaxc_b','risk_b_test')
    run('runuser','-u','postgres','--','psql','-p','55440','-d','risk_b_test','-v','ON_ERROR_STOP=1','-c','CREATE EXTENSION vector',stdout=subprocess.DEVNULL)
    env.update(B_AUTH_MODE='mock',B_ENV='development',
        B_DATABASE_URL=env['B_DATABASE_URL'].rsplit('/',1)[0]+'/risk_b_test', B_STORAGE=str(STATE/'test-storage'))
    run(PY,'-m','alembic','upgrade','head',cwd=B,env=env)
    run(PY,'-m','backend.initialize',cwd=B,env=env)
    run(PY,'-m','pytest','tests','-q','--tb=short',cwd=B,env=env)
    run(PY,'-m','pytest',str(ROOT/'platform-module/tests/test_ab_gateway.py'),'-q',cwd=B,env=env)
    write(ROOT/'checks-passed.txt',time.strftime('%Y-%m-%d %H:%M:%S'))
    print('CHECKS PASSED',flush=True)

def activate():
    if not (ROOT/'checks-passed.txt').exists():
        raise RuntimeError('Run checks first')
    target=Path('/opt/qaxc-test')
    if hashlib.sha256((target/'server.py').read_bytes()).hexdigest()!=BASELINE:
        raise RuntimeError('A source changed: review before activation')
    if BACKUP.exists():
        raise RuntimeError('Backup already exists; inspect prior activation before proceeding')
    BACKUP.mkdir(parents=True,mode=0o700)
    shutil.copytree(target,BACKUP/'application')
    with sqlite3.connect('/var/lib/qaxc-test/inspections.sqlite3') as src, sqlite3.connect(BACKUP/'inspections.sqlite3') as dest:
        src.backup(dest)
    for filename in ('server.py','ab_gateway.py','knowledge_service.py','ab_v1.py','ab_admin.py','host_auth.py'):
        shutil.copy2(ROOT/'platform-module/candidate'/filename,target/filename)
    for filename in ('app.js', 'work.js', 'style.css', 'ab-client.js', 'index.html', 'work.html'):
        shutil.copy2(ROOT/'platform-module/candidate/web'/filename, target/'web'/filename)
    write(Path('/etc/systemd/system/qaxc-test.service.d/ab.conf'),'[Service]\nEnvironmentFile=/etc/qaxc-b-bridge.env\n',0o644)
    run('systemctl','daemon-reload')
    try:
        run('systemctl','restart','qaxc-test')
        time.sleep(2)
        run('systemctl','is-active','qaxc-test','qaxc-b-api','qaxc-b-worker')
        opener=urllib.request.build_opener(urllib.request.ProxyHandler({}))
        with opener.open('http://127.0.0.1:18181/api/v1/health') as response:
            health=json.load(response)
        if not health.get('worker_online'):
            raise RuntimeError('Worker not ready')
    except Exception:
        rollback()
        raise
    print('ACTIVATED: verify platform login, menus, permissions and workflows.',flush=True)

def rollback():
    if not (BACKUP/'application/server.py').exists():
        raise RuntimeError('No backup available')
    target=Path('/opt/qaxc-test')
    for filename in ('server.py','web/app.js'):
        shutil.copy2(BACKUP/'application'/filename,target/filename)
    Path('/etc/systemd/system/qaxc-test.service.d/ab.conf').unlink(missing_ok=True)
    run('systemctl','daemon-reload')
    run('systemctl','restart','qaxc-test')
    print('ROLLED BACK: A source restored; production data preserved.')

if __name__=='__main__':
    if os.geteuid()!=0 or len(sys.argv)!=2 or sys.argv[1] not in {'prepare','check','activate','rollback'}:
        raise SystemExit('sudo python3 platform-module/deploy_ab.py prepare|check|activate|rollback')
    globals()[sys.argv[1]]()
