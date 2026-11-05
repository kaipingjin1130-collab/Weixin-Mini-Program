"""Host-only backup runner; credentials stay on the host. No service changes."""
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import subprocess
import tarfile
from urllib.parse import urlsplit

from database_backup import backup, verify_backup, digest_file


def service_state(name):
    def show(prop):
        return subprocess.check_output(['systemctl', 'show', name, '-p', prop, '--value'], text=True).strip()
    pid = show('MainPID')
    if not pid.isdecimal() or int(pid) < 1 or show('ActiveState') != 'active':
        raise RuntimeError('Expected running service is unavailable')
    env = dict(x.split('=', 1) for x in Path('/proc', pid, 'environ').read_bytes().decode().split(chr(0)) if '=' in x)
    return env, Path('/proc', pid, 'cwd').resolve(), show('FragmentPath')


def main():
    os.umask(0o077)
    api, api_cwd, api_unit = service_state('qaxc-test')
    worker, worker_cwd, worker_unit = service_state('qaxc-b-worker')
    u = urlsplit(api['B_DATABASE_URL'])
    if (u.hostname, u.port, u.path, u.username) != ('127.0.0.1', 55440, '/qaxc_b', 'qaxc_b'):
        raise RuntimeError('Production database differs from reviewed target')
    if api['B_DATABASE_URL'] != worker['B_DATABASE_URL']:
        raise RuntimeError('API and worker database configurations differ')
    if api.get('QAXC_DATA') != '/var/lib/qaxc-test' or api.get('B_STORAGE') != '/var/lib/qaxc-b/storage':
        raise RuntimeError('Data paths differ from reviewed target')
    if shutil.disk_usage('/var/backups').free < 10 * 1024**3:
        raise RuntimeError('Less than 10 GiB free; refuse backup and rehearsal')
    roots = sorted({api_cwd.parent, worker_cwd.parent})
    if any(p.parent != Path('/opt') or not p.name.startswith('qaxc-fusion-') for p in roots):
        raise RuntimeError('Unexpected release directory')
    root = Path('/var/backups') / ('qaxc-fusion-rehearsal-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
    root.mkdir(mode=0o700, exist_ok=False)
    cfg = root / 'runtime-config'
    cfg.mkdir(mode=0o700)
    for p in [Path(api_unit), Path(worker_unit), Path('/etc/qaxc-b.env'), Path('/etc/qaxc-b-bridge.env'), Path('/etc/qaxc-v1-runtime.env')]:
        if p.is_file():
            shutil.copy2(p, cfg / p.name)
            (cfg / p.name).chmod(0o600)
    for svc in ['qaxc-test', 'qaxc-b-worker']:
        (cfg / (svc + '.effective-unit')).write_bytes(subprocess.check_output(['systemctl', 'cat', svc]))
    ignored = {'.venv', 'venv', '.git', 'node_modules', '.local', '__pycache__', 'uploads', 'storage', '.pytest_cache'}
    source_info = []
    for src in roots:
        files = [p for p in src.rglob('*') if p.is_file() and not p.is_symlink() and not (set(p.relative_to(src).parts) & ignored)]
        if sum(p.stat().st_size for p in files) > 1024**3:
            raise RuntimeError('Source snapshot exceeds reviewed 1 GiB cap')
        archive = root / (src.name + '.tar.gz')
        before = {str(p.relative_to(src)): digest_file(p) for p in files}
        with tarfile.open(archive, 'w:gz') as tar:
            for p in files:
                tar.add(p, arcname=str(p.relative_to(src)), recursive=False)
        if before != {str(p.relative_to(src)): digest_file(p) for p in files}:
            raise RuntimeError('Release files changed while backing up')
        source_info.append({'source': str(src), 'archive': archive.name, 'sha256': digest_file(archive), 'files': before})
    (root / 'source-manifest.json').write_text(json.dumps(source_info, indent=2), encoding='utf8')
    report = backup(Path(api['QAXC_DATA']), root / 'data', api['B_DATABASE_URL'], Path(api['B_STORAGE']), Path('/usr/lib/postgresql/16/bin'))
    verify_backup(root / 'data')
    summary = {'backup_root': str(root), 'verified': True, 'a_tables': len(report['a_tables']),
               'a_files': len(report['a_files']), 'b_files': len(report['b_files']),
               'b_tables': {s: {t: v['rows'] for t, v in tables.items()} for s, tables in report['b_database']['schemas'].items()},
               'source_releases': [str(p) for p in roots], 'production_switched': False,
               'consistent_across_databases': False}
    (root / 'backup-summary.json').write_text(json.dumps(summary, indent=2), encoding='utf8')
    print(json.dumps(summary))


if __name__ == '__main__':
    main()
