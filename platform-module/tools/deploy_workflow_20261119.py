"""Scoped cloud workflow patch; default preflight, explicit --apply for cutover.

Uses the reviewed source archive and isolated PG rehearsal on this host. B's
44 GiB storage is never copied or changed; database and A uploads are backed up.
Credentials remain in memory. Rollback restores code, never an old database.
"""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from urllib.request import urlopen
from urllib.error import HTTPError

ROOT = Path('/opt/qaxc-fusion-pg-20261105')
STAGE = Path('/tmp/qaxc-workflow-9021c22')
COMMIT = '9021c22a0aa4332b9cab3b95ac1d60f0049e6e08'
SERVICES = ('qaxc-test', 'qaxc-b-worker')
NEW_TABLES = {'combined_reports', 'mobile_settings', 'mobile_notifications', 'mobile_outbox'}


def run(*args):
    return subprocess.check_output(args, text=True, stderr=subprocess.DEVNULL).strip()


def sha(path):
    return hashlib.sha256(path.read_bytes().replace(b'\r\n', b'\n')).hexdigest() if path.exists() else None


def file_stats(root):
    return {str(p.relative_to(root)): [p.stat().st_size, p.stat().st_mtime_ns]
            for p in root.rglob('*') if p.is_file()}


def status(path):
    try:
        with urlopen('http://127.0.0.1:18765/quality' + path, timeout=3) as r:
            return r.status, r.read()
    except HTTPError as e:
        return e.code, b''


def main():
    assert sys.platform == 'linux' and os.geteuid() == 0
    os.umask(0o077)
    pid = run('systemctl', 'show', SERVICES[0], '-p', 'MainPID', '--value')
    cmd = Path('/proc/' + pid + '/cmdline').read_bytes().split(b'\0')
    assert str(ROOT / 'platform-module/serve_existing.py').encode() in cmd
    env = dict(x.decode().split('=', 1) for x in Path('/proc/' + pid + '/environ').read_bytes().split(b'\0') if b'=' in x)
    assert env.get('QAXC_UAT_PROJECT_SYNC') != '1'
    assert env.get('QAXC_DATA') == '/var/lib/qaxc-test'
    assert env.get('QAXC_DB_SCHEMA') == 'a'
    os.environ.update(env)
    sys.path.insert(0, str(STAGE / 'source/platform-module/tools'))
    from database_backup import copy_pg, copy_tree, pg_manifest, tree_manifest
    import psycopg
    from psycopg.conninfo import conninfo_to_dict
    url = env['QAXC_DB_URL']
    cfg = conninfo_to_dict(url)
    assert (cfg['host'], cfg['port'], cfg['dbname']) == ('127.0.0.1', '55440', 'qaxc_ab_20261105')
    assert json.loads((STAGE / 'pg-test.json').read_text()) == {
        'database': 'qaxc_mobile_rehearsal_20261119', 'tests': 29, 'failures': 0, 'errors': 0, 'success': True}
    for service in SERVICES:
        assert run('systemctl', 'is-active', service) == 'active'
    old = ROOT / 'platform-module/candidate'
    new = STAGE / 'source/platform-module/candidate'
    paths = list(new.glob('*.py')) + [p for p in (new / 'web').iterdir() if p.suffix in {'.js', '.css', '.html'}]
    files = {}
    for p in paths:
        name = str(p.relative_to(new))
        if p.suffix == '.py':
            compile(p.read_text(), str(p), 'exec')
        before, after = sha(old / name), sha(p)
        if before != after:
            files[name] = {'before': before, 'after': after}
    assert files and len(files) <= 20
    assert {'mobile_workflow.py', 'server.py', 'workflow.py', 'combined_reports.py'} <= set(files)
    with psycopg.connect(url) as c:
        c.execute('SET TRANSACTION READ ONLY')
        size = c.execute('SELECT pg_database_size(current_database())').fetchone()[0]
        existing = set(pg_manifest(c, 'a'))
    assert not NEW_TABLES & existing
    uploads = Path('/var/lib/qaxc-test/uploads')
    a_bytes = sum(p.stat().st_size for p in uploads.rglob('*') if p.is_file())
    required = 1024**3 + 2 * size + 2 * a_bytes
    assert shutil.disk_usage('/var/backups').free > required
    manifest = {'commit': COMMIT, 'files': files, 'required_free_bytes': required}
    manifest_path = STAGE / 'patch-manifest.json'
    if '--apply' not in sys.argv:
        manifest_path.write_text(json.dumps(manifest, indent=2))
        print('PREFLIGHT_OK', json.dumps({'files': list(files), 'database_bytes': size, 'required_free_bytes': required}), flush=True)
        return
    assert json.loads(manifest_path.read_text()) == manifest
    backup = Path('/var/backups/qaxc-workflow-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
    backup.mkdir(mode=0o700)
    for name in files:
        if (old / name).exists():
            target = backup / 'code' / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(old / name, target)
    stopped, replaced = [], []
    try:
        for service in reversed(SERVICES):
            subprocess.run(['systemctl', 'stop', service], check=True)
            stopped.append(service)
        print('WRITERS_STOPPED_BACKING_UP', flush=True)
        record = dict(manifest)
        record['database'] = copy_pg(url, backup / 'database.dump', '/usr/lib/postgresql/16/bin')
        record['a_files'] = copy_tree(uploads, backup / 'a-uploads')
        b_root = Path('/var/lib/qaxc-b/storage')
        record['b_file_stats'] = file_stats(b_root)
        (backup / 'backup-manifest.json').write_text(json.dumps(record, indent=2))
        def unchanged(c):
            for schema, before in record['database']['schemas'].items():
                assert pg_manifest(c, schema, list(before)) == before, 'Existing rows changed in ' + schema
        with psycopg.connect(url) as c:
            unchanged(c)
            c.execute('CREATE TABLE a.combined_reports(id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES a.projects(id), payload JSONB NOT NULL)')
            c.execute('CREATE TABLE a.mobile_settings(id TEXT PRIMARY KEY, payload JSONB NOT NULL)')
            c.execute('CREATE TABLE a.mobile_notifications(id TEXT PRIMARY KEY, user_id TEXT NOT NULL, payload JSONB NOT NULL)')
            c.execute('CREATE TABLE a.mobile_outbox(id TEXT PRIMARY KEY, payload JSONB NOT NULL)')
            unchanged(c)
        for name in files:
            target = old / name
            info = target.stat() if target.exists() else old.stat()
            temporary = target.with_name(target.name + '.workflow-new')
            temporary.write_bytes((new / name).read_bytes())
            os.chown(temporary, info.st_uid, info.st_gid)
            temporary.chmod(0o644)
            os.replace(temporary, target)
            replaced.append(name)
        assert tree_manifest(uploads) == record['a_files']
        subprocess.run(['systemctl', 'start', SERVICES[0]], check=True)
        ready = False
        for _ in range(40):
            try:
                ready = status('/app.js')[0] == 200 and status('/api/work/mobile-state')[0] == 401
                if ready:
                    break
            except OSError:
                pass
            time.sleep(1)
        assert ready, 'API startup check failed'
        with psycopg.connect(url) as c:
            c.execute('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY')
            unchanged(c)
            assert set(pg_manifest(c, 'a')) == existing | NEW_TABLES
            for table in NEW_TABLES:
                assert c.execute(psycopg.sql.SQL('SELECT count(*) FROM a.{}').format(psycopg.sql.Identifier(table))).fetchone()[0] == 0
        assert tree_manifest(uploads) == record['a_files']
        assert file_stats(b_root) == record['b_file_stats']
        assert all(sha(old / name) == data['after'] for name, data in files.items())
        subprocess.run(['systemctl', 'start', SERVICES[1]], check=True)
        assert all(run('systemctl', 'is-active', s) == 'active' for s in SERVICES)
        receipt = {'status': 'deployed', 'commit': COMMIT, 'backup': str(backup),
                   'existing_tables_preserved': {s: len(t) for s, t in record['database']['schemas'].items()},
                   'new_empty_tables': sorted(NEW_TABLES), 'files': list(files),
                   'authenticated_cloud_ui_check': 'pending'}
        (backup / 'deployment.json').write_text(json.dumps(receipt, indent=2))
        (STAGE / 'deployment.json').write_text(json.dumps(receipt, indent=2))
        print('DEPLOYED', json.dumps(receipt), flush=True)
    except BaseException:
        subprocess.run(['systemctl', 'stop', SERVICES[0]], check=False)
        for name in replaced:
            saved = backup / 'code' / name
            if saved.exists():
                shutil.copy2(saved, old / name)
            else:
                target = backup / 'failed-new-code' / name
                target.parent.mkdir(parents=True, exist_ok=True)
                os.replace(old / name, target)
        for service in SERVICES:
            if service in stopped:
                subprocess.run(['systemctl', 'start', service], check=False)
        print('FAILED_CODE_RESTORED_DATABASE_NOT_RESTORED', str(backup), flush=True)
        raise


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print('STOPPED', type(error).__name__, flush=True)
        sys.exit(1)
