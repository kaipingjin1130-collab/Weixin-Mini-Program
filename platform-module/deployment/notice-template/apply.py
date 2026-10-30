"""Deploy the verified company Word template; preserve all business data."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import time
import urllib.request
import urllib.error

STAGE = Path(__file__).resolve().parent
MANIFEST = json.loads((STAGE/'manifest.json').read_text())
FILES = list(MANIFEST['after'])


def run(*args):
    return subprocess.check_output(args, text=True).strip()


def context():
    pid = int(run('systemctl', 'show', 'qaxc-test', '-p', 'MainPID', '--value'))
    args = Path(f'/proc/{pid}/cmdline').read_bytes().decode().split('\0')
    working = Path(run('systemctl', 'show', 'qaxc-test', '-p', 'WorkingDirectory', '--value')).resolve()
    entry = working/'platform-module/run_platform.py'
    if not entry.is_file():
        entry = next(Path(arg).resolve() for arg in args if arg.endswith('/server.py'))
    target = entry.parent/'candidate' if entry.name=='run_platform.py' else entry.parent
    if not target.is_relative_to(Path('/opt/qaxc-fusion-a1b9411')):
        raise RuntimeError('Unexpected running directory: '+str(target))
    env = dict(entry.split('=', 1) for entry in Path(f'/proc/{pid}/environ').read_bytes().decode().split('\0') if '=' in entry)
    database = Path(env.get('QAXC_DATA', str(target/'data')))/'inspections.sqlite3'
    port = int(args[args.index('--port')+1]) if '--port' in args else int(env.get('QAXC_PORT', '18765' if entry.name=='run_platform.py' else '8765'))
    return target, database, port, env.get('QAXC_ROOT_PATH', '/quality' if entry.name=='run_platform.py' else '').rstrip('/')


def digest(path):
    return hashlib.sha256(path.read_bytes() if path.suffix == '.docx' else path.read_text().encode()).hexdigest()


def verify(target):
    for name, expected in MANIFEST['before'].items():
        if digest(target/name) != expected:
            raise RuntimeError('Source changed; merge required: '+name)
    for name, expected in MANIFEST['after'].items():
        path = STAGE/'source'/name
        if digest(path) != expected:
            raise RuntimeError('Staged file damaged: '+name)
        if name.endswith('.py'):
            compile(path.read_text(), str(path), 'exec')
    for name in FILES:
        if name not in MANIFEST['before'] and (target/name).exists():
            raise RuntimeError('New file already exists; review prior deployment: '+name)


def counts(database):
    with sqlite3.connect('file:'+str(database)+'?mode=ro', uri=True) as c:
        return {name:c.execute('SELECT COUNT(*) FROM '+name).fetchone()[0] for name in ['projects','users','memberships','reports','tasks','field_reports','deliveries','evidence']}


def atomic_copy(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    stat = destination.stat() if destination.exists() else None
    fd, temp = tempfile.mkstemp(dir=destination.parent, prefix='.notice-template-release-')
    try:
        with os.fdopen(fd, 'wb') as out:
            out.write(source.read_bytes())
            out.flush()
            os.fsync(out.fileno())
        os.chmod(temp, (stat.st_mode & 0o777) if stat else 0o644)
        if stat:
            os.chown(temp, stat.st_uid, stat.st_gid)
        os.replace(temp, destination)
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def main():
    target, database, port, prefix = context()
    verify(target)
    print('TARGET', target, flush=True)
    print('DATABASE', database, flush=True)
    print('BASELINE VERIFIED; DATA COUNTS', json.dumps(counts(database)), flush=True)
    if '--apply' not in sys.argv:
        print('STAGED ONLY; no production files changed', flush=True)
        return
    backup = Path('/var/backups')/('qaxc-notice-template-'+time.strftime('%Y%m%d-%H%M%S'))
    backup.mkdir(mode=0o700)
    for name in FILES:
        if (target/name).exists():
            destination = backup/'application'/name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(target/name, destination)
    run('systemctl', 'stop', 'qaxc-test')
    changed = []
    try:
        verify(target)
        before_counts = counts(database)
        with sqlite3.connect(database) as src, sqlite3.connect(backup/'inspections.sqlite3') as dest:
            src.backup(dest)
        for name in FILES:
            atomic_copy(STAGE/'source'/name, target/name)
            changed.append(name)
        run('systemctl', 'start', 'qaxc-test')
        opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
        base = f'http://127.0.0.1:{port}'+prefix
        for attempt in range(20):
            try:
                with opener.open(base+'/app.js', timeout=4) as response:
                    script = response.read().decode()
                assert 'noticeNumber' in script and '隐患清单' in script and 'restoreHostSession' in script
                break
            except Exception:
                if attempt == 19:
                    raise
                time.sleep(1)
        try:
            opener.open(base+'/api/work/leader-inbox', timeout=5)
            raise RuntimeError('Unauthenticated endpoint should be protected')
        except urllib.error.HTTPError as error:
            assert error.code == 401, error.code
        assert run('systemctl', 'is-active', 'qaxc-test') == 'active'
        after_counts = counts(database)
        assert before_counts == after_counts, 'Business row counts changed'
        with sqlite3.connect('file:'+str(database)+'?mode=ro', uri=True) as c:
            assert c.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='leader_reads'").fetchone()
            assert c.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='document_leaders'").fetchone()
        for name, expected in MANIFEST['after'].items():
            assert digest(target/name) == expected, name
        check = '''import sys, io, zipfile, sqlite3
sys.path.insert(0,sys.argv[1])
import server
c=sqlite3.connect(':memory:')
payload=server.make_docx(c,{'notice':{'noticeNumber':'template-smoke'},'issues':[]})
with zipfile.ZipFile(io.BytesIO(payload)) as z:
 assert 'word/media/image1.png' in z.namelist()
 assert 'template-smoke' in z.read('word/document.xml').decode()
 assert 'C9C9C9' in z.read('word/document.xml').decode()
 assert 'JKEC' in z.read('word/header1.xml').decode()
print('WORD_TEMPLATE_SMOKE_OK')
'''
        print(run('python3', '-c', check, str(target)), flush=True)
        record = dict(commit=MANIFEST['commit'], target=str(target), backup=str(backup), database=str(database), counts=after_counts, files=MANIFEST['after'])
        (STAGE/'deployed.json').write_text(json.dumps(record, indent=2))
        print('DEPLOYED '+MANIFEST['commit']+'; WORD TEMPLATE VERIFIED; AUTH CHECK 401; BUSINESS COUNTS UNCHANGED', flush=True)
        print('BACKUP', backup, flush=True)
        print('COUNTS', json.dumps(after_counts), flush=True)
    except Exception:
        run('systemctl', 'stop', 'qaxc-test')
        for name in reversed(changed):
            original = backup/'application'/name
            if original.exists():
                atomic_copy(original, target/name)
            elif name not in MANIFEST['before']:
                (target/name).unlink(missing_ok=True)
        run('systemctl', 'start', 'qaxc-test')
        print('ROLLED BACK application files; business database preserved; backup '+str(backup), flush=True)
        raise


if __name__ == '__main__':
    main()
