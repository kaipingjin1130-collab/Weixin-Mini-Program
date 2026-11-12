"""Narrow, fail-closed patch for the existing November 2026 production release.

Run from an unpacked release bundle on the authorized Tencent host, as root.
Default is read-only preflight. --apply performs backup, additive schema update,
five-file replacement and restart. No credentials or business rows are printed.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
from urllib.error import HTTPError
from urllib.request import urlopen

ROOT = Path('/opt/qaxc-fusion-pg-20261105')
FILES = ('server.py', 'workflow.py', 'notice_docx.py', 'web/app.js', 'combined_reports.py')
SERVICES = ('qaxc-test', 'qaxc-b-worker')


def run(*args):
    return subprocess.check_output(args, text=True, stderr=subprocess.DEVNULL).strip()


def sha(path):
    return hashlib.sha256(path.read_bytes().replace(b'\r\n', b'\n')).hexdigest()


def service_env():
    pid = int(run('systemctl', 'show', SERVICES[0], '-p', 'MainPID', '--value'))
    if pid < 2:
        raise RuntimeError('API must be running for verified preflight')
    cmd = Path(f'/proc/{pid}/cmdline').read_bytes().split(b'\0')
    if str(ROOT / 'platform-module/serve_existing.py').encode() not in cmd:
        raise RuntimeError('Unexpected running API entry point')
    env = dict(item.decode().split('=', 1) for item in Path(f'/proc/{pid}/environ').read_bytes().split(b'\0') if b'=' in item)
    python = cmd[0].decode()
    if not os.path.isabs(python):
        raise RuntimeError('Expected absolute virtualenv Python')
    if os.path.abspath(sys.executable) != python:
        os.execve(python, [python, str(Path(__file__).resolve()), *sys.argv[1:]], env)
    return env


def http_status(path):
    try:
        with urlopen('http://127.0.0.1:18765/quality' + path, timeout=5) as response:
            return response.status, response.read()
    except HTTPError as error:
        return error.code, b''


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    if sys.platform != 'linux' or os.geteuid() != 0:
        raise RuntimeError('Run on the authorized Linux server as root')
    os.umask(0o077)
    stage = Path(__file__).resolve().parent
    manifest = json.loads((stage / 'manifest.json').read_text())
    if set(manifest['files']) != set(FILES):
        raise RuntimeError('Unexpected package scope')
    env = service_env()
    os.environ.update(env)
    sys.path.insert(0, str(ROOT / 'platform-module/tools'))
    from database_backup import copy_pg, copy_tree, pg_manifest, tree_manifest
    import psycopg
    from psycopg.conninfo import conninfo_to_dict
    url = env.get('QAXC_DB_URL', '')
    cfg = conninfo_to_dict(url)
    if cfg.get('dbname') != 'qaxc_ab_20261105' or cfg.get('host') != '127.0.0.1' or cfg.get('port') != '55440' or env.get('QAXC_DB_SCHEMA') != 'a':
        raise RuntimeError('Unexpected live database configuration')
    if env.get('QAXC_DATA') != '/var/lib/qaxc-test':
        raise RuntimeError('Unexpected attachment directory')
    for service in SERVICES:
        if run('systemctl', 'is-active', service) != 'active':
            raise RuntimeError('Both existing services must be active')
    candidate = ROOT / 'platform-module/candidate'
    for name, hashes in manifest['files'].items():
        live, new = candidate / name, stage / 'candidate' / name
        if sha(new) != hashes['after']:
            raise RuntimeError('Package checksum mismatch: ' + name)
        if (sha(live) if live.exists() else None) != hashes['before']:
            raise RuntimeError('Live baseline differs; inspect before deploying: ' + name)
        if name.endswith('.py'):
            compile(new.read_text(), str(new), 'exec')
    with psycopg.connect(url) as conn:
        if conn.execute('SELECT current_database()').fetchone()[0] != cfg['dbname']:
            raise RuntimeError('Database identity mismatch')
        before = pg_manifest(conn, 'a')
    if shutil.disk_usage('/var/backups').free < 5 * 1024**3:
        raise RuntimeError('Less than 5 GiB available for backup')
    print(json.dumps({'preflight': 'ok', 'root': str(ROOT), 'commit': manifest['commit'], 'a_tables': len(before), 'apply': args.apply}), flush=True)
    if not args.apply:
        return
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    backup = Path('/var/backups') / ('qaxc-mobile-' + stamp)
    backup.mkdir(mode=0o700)
    (backup / 'code').mkdir()
    for name in FILES:
        if (candidate / name).exists():
            target = backup / 'code' / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(candidate / name, target)
    changed = False
    stopped = []
    try:
        for service in reversed(SERVICES):
            subprocess.run(['systemctl', 'stop', service], check=True)
            stopped.append(service)
        # Full shared database plus both attachment trees, after writers stop.
        record = {'commit': manifest['commit'], 'root': str(ROOT), 'files': manifest['files']}
        pg_bin = '/usr/lib/postgresql/16/bin' if Path('/usr/lib/postgresql/16/bin/pg_dump').exists() else None
        record['database'] = copy_pg(url, backup / 'database.dump', pg_bin)
        record['a_files'] = copy_tree('/var/lib/qaxc-test/uploads', backup / 'a-uploads')
        record['b_files'] = copy_tree('/var/lib/qaxc-b/storage', backup / 'b-storage')
        (backup / 'backup-manifest.json').write_text(json.dumps(record, ensure_ascii=False, indent=2))
        with psycopg.connect(url) as conn:
            frozen = pg_manifest(conn, 'a')
            conn.execute('CREATE TABLE IF NOT EXISTS a.combined_reports (id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES a.projects(id), payload JSONB NOT NULL)')
            if pg_manifest(conn, 'a', list(frozen)) != frozen:
                raise RuntimeError('Original A data changed during additive schema update')
        changed = True
        for name in FILES:
            target = candidate / name
            temporary = target.with_name(target.name + '.mobile-new')
            temporary.write_bytes((stage / 'candidate' / name).read_bytes())
            info = target.stat() if target.exists() else candidate.stat()
            os.chown(temporary, info.st_uid, info.st_gid)
            temporary.chmod(0o644)
            os.replace(temporary, target)
        if tree_manifest('/var/lib/qaxc-test/uploads') != record['a_files']:
            raise RuntimeError('Attachments changed while service was stopped')
        subprocess.run(['systemctl', 'start', SERVICES[0]], check=True)
        ready = False
        for _ in range(30):
            try:
                status, body = http_status('/app.js')
                ready = status == 200 and b'leaderCombine' in body and b'combined-sign' in body and http_status('/api/work/combined-list')[0] == 401
                if ready:
                    break
            except OSError:
                pass
            time.sleep(1)
        if not ready:
            raise RuntimeError('Post-deployment API checks failed')
        subprocess.run(['systemctl', 'start', SERVICES[1]], check=True)
        for service in SERVICES:
            if run('systemctl', 'is-active', service) != 'active':
                raise RuntimeError('Service did not stay active')
        receipt = {'status': 'deployed', 'commit': manifest['commit'], 'backup': str(backup), 'root': str(ROOT), 'utc': datetime.now(timezone.utc).isoformat(), 'a_tables_preserved': len(frozen), 'files': manifest['files']}
        (backup / 'deployment.json').write_text(json.dumps(receipt, indent=2))
        print(json.dumps(receipt), flush=True)
    except BaseException:
        if changed:
            subprocess.run(['systemctl', 'stop', SERVICES[0]], check=False)
            for name in FILES:
                old = backup / 'code' / name
                if old.exists():
                    shutil.copy2(old, candidate / name)
            # Keep additive table and uploaded data; never restore a stale dump.
        for service in SERVICES:
            if service in stopped:
                subprocess.run(['systemctl', 'start', service], check=False)
        print('DEPLOYMENT_FAILED; original code restored if changed; backup=' + str(backup), flush=True)
        raise


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        # Third-party exception strings can contain connection credentials.
        print('STOPPED: ' + type(error).__name__, file=sys.stderr)
        sys.exit(1)
