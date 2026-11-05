"""Approved one-time host cutover, using the already verified release copy.

The target is a fresh formal database. Rehearsal guards remain unchanged.
Before publishing, failures restore original service configuration. After
publishing, automatic rollback is forbidden because real writes may exist.
Credentials and full diagnostics remain in the root-only backup directory.
"""
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import traceback
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, build_opener, ProxyHandler
from urllib.error import HTTPError

import psycopg
from database_backup import backup, verify_backup, digest_file, pg_tool, pg_manifest
from database_rehearsal import require_empty, migrate_a, relocate_b, a_manifest, export_a_sqlite

ROOT = Path('/var/backups/qaxc-formal-20261105')
RELEASE = Path('/opt/qaxc-fusion-pg-20261105')
OLD = Path('/opt/qaxc-fusion-b230deed-20261105-122955')
TARGET = 'qaxc_ab_20261105'
PG_BIN = Path('/usr/lib/postgresql/16/bin')
ENV_FILE = Path('/etc/qaxc-database-20261105.env')
SERVICES = ('qaxc-test', 'qaxc-b-worker')
OVERRIDES = {s: Path('/etc/systemd/system') / (s + '.service.d') / 'zzzz-database.conf' for s in SERVICES}


def run(args, **kwargs):
    return subprocess.run(args, check=True, capture_output=True, text=True, **kwargs).stdout.strip()


def show(service, prop):
    return run(['systemctl', 'show', service, '-p', prop, '--value'])


def service_env(service):
    pid = show(service, 'MainPID')
    assert int(pid) > 0 and show(service, 'ActiveState') == 'active'
    return dict(x.split('=', 1) for x in Path('/proc', pid, 'environ').read_bytes().decode().split(chr(0)) if '=' in x)


def http(path, key=None):
    headers = {'Authorization': 'Bearer ' + key} if key else {}
    req = Request('http://127.0.0.1:18765' + path, headers=headers)
    try:
        with build_opener(ProxyHandler({})).open(req, timeout=10) as response:
            return response.status, response.read(2 * 1024 * 1024)
    except HTTPError as error:
        return error.code, error.read(1024 * 1024)


def wait_api(key):
    for attempt in range(40):
        try:
            if http('/quality/')[0] == 200:
                status, body = http('/__knowledge/api/v1/health', key)
                if status == 200 and json.loads(body)['status'] == 'ok':
                    assert http('/quality/api/state')[0] == 401
                    return
        except (OSError, ValueError):
            pass
        time.sleep(1)
    raise RuntimeError('API readiness or authentication boundary check failed')


def write_env(url, bind):
    values = {'QAXC_DB_URL': url, 'QAXC_DB_SCHEMA': 'a',
              'B_DATABASE_URL': url.replace('postgresql://', 'postgresql+psycopg://', 1),
              'B_DATABASE_SCHEMA': 'b', 'QAXC_BIND_HOST': bind,
              'QAXC_B_STATIC': str(RELEASE / 'platform-module/b-web'),
              'PYTHONDONTWRITEBYTECODE': '1'}
    # systemd EnvironmentFile supports double quoted values, without shell expansion.
    def quote(value):
        assert '\n' not in value and '\r' not in value
        return '"' + value.replace('\\', '\\\\').replace('"', '\\"').replace('`', '\\`').replace('$', '\\$') + '"'
    temp = ENV_FILE.with_suffix('.tmp')
    temp.write_text(''.join(k + '=' + quote(v) + '\n' for k, v in values.items()))
    temp.chmod(0o600)
    temp.replace(ENV_FILE)


def main():
    assert sys.argv[1:] == ['--execute-approved-cutover'], 'Explicit execution flag required'
    assert os.geteuid() == 0
    os.umask(0o077)
    assert ROOT.is_dir() and RELEASE.is_dir()
    RELEASE.chmod(0o755)
    assert not (ROOT / 'cutover-started.json').exists(), 'One-shot operation already attempted'
    assert not ENV_FILE.exists() and all(not p.exists() for p in OVERRIDES.values())
    assert shutil.disk_usage('/').free > 12 * 1024**3
    expected = json.loads((ROOT / 'release-manifest.json').read_text())
    assert all(digest_file(RELEASE / name) == value for name, value in expected.items())
    run(['runuser', '-u', 'qaxc-b', '--', str(RELEASE / '.venv/bin/python'), '-c',
         'from pathlib import Path; p=Path(' + repr(str(RELEASE)) + '); '
         '[compile(f.read_bytes(),str(f),"exec") for f in p.rglob("*.py") if not f.is_symlink()]'])
    api, worker = (service_env(s) for s in SERVICES)
    assert api['B_DATABASE_URL'] == worker['B_DATABASE_URL']
    assert api.get('QAXC_DB_URL', '') == ''
    source_url = api['B_DATABASE_URL'].replace('postgresql+psycopg://', 'postgresql://', 1)
    parts = urlsplit(source_url)
    assert (parts.hostname, parts.port, parts.path, parts.username) == ('127.0.0.1', 55440, '/qaxc_b', 'qaxc_b')
    assert api['QAXC_DATA'] == '/var/lib/qaxc-test' and api['B_STORAGE'] == '/var/lib/qaxc-b/storage'
    assert show('qaxc-test', 'WorkingDirectory') == str(OLD)
    assert api['B_AUTH_MODE'] == 'a' and api['B_ENV'] == 'production'
    assert api['QAXC_AUTH_URL'] and api['QAXC_AUTH_KEY'] and api['A_TO_B_KEY']
    url = urlunsplit(parts._replace(path='/' + TARGET))
    with psycopg.connect(source_url) as conn:
        assert conn.execute('select current_database()').fetchone()[0] == 'qaxc_b'
        assert not conn.execute('select 1 from pg_database where datname=%s', (TARGET,)).fetchone()
        assert conn.execute("select count(*) from procrastinate_jobs where status in ('todo','doing')").fetchone()[0] == 0, 'Queue is not drained'
    state = {'authorized': True, 'target': TARGET, 'phase': 'prepared', 'published': False,
             'started_utc': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}
    def save():
        (ROOT / 'cutover-started.json').write_text(json.dumps(state, indent=2))
        print('PHASE', state['phase'], flush=True)
    save()
    published = False
    stopped = False
    try:
        # Stop accepting HTTP writes first; systemd lets existing requests finish.
        stopped = True
        run(['systemctl', 'stop', 'qaxc-test'], timeout=110)
        # Allow already accepted background work to finish before stopping worker.
        for attempt in range(60):
            with psycopg.connect(source_url) as conn:
                pending = conn.execute("select count(*) from procrastinate_jobs where status in ('todo','doing')").fetchone()[0]
            if not pending:
                break
            time.sleep(1)
        else:
            raise RuntimeError('Queue did not drain; abort cutover')
        run(['systemctl', 'stop', 'qaxc-b-worker'], timeout=110)
        assert all(show(s, 'ActiveState') == 'inactive' for s in SERVICES)
        assert all(show(s, 'Result') == 'success' for s in SERVICES), 'Service stop was not graceful'
        with psycopg.connect(source_url) as conn:
            assert conn.execute("select count(*) from pg_stat_activity where datname=current_database() and pid<>pg_backend_pid()").fetchone()[0] == 0, 'Other source DB clients remain'
            assert conn.execute("select count(*) from procrastinate_jobs where status in ('todo','doing')").fetchone()[0] == 0
        state['phase'] = 'writes_stopped'; save()
        report = backup(Path(api['QAXC_DATA']), ROOT / 'final-data', source_url, Path(api['B_STORAGE']), PG_BIN)
        verify_backup(ROOT / 'final-data')
        state['phase'] = 'final_backup_verified'; state['coordinated_snapshot'] = True; save()
        run(['runuser', '-u', 'postgres', '--', str(PG_BIN / 'createdb'), '-p', '55440', '-O', 'qaxc_b', TARGET])
        run(['runuser', '-u', 'postgres', '--', str(PG_BIN / 'psql'), '-p', '55440', '-d', TARGET, '-v', 'ON_ERROR_STOP=1', '-c', 'CREATE EXTENSION vector'])
        with psycopg.connect(url) as conn:
            actual, host = conn.execute('select current_database(),host(inet_server_addr())').fetchone()
            assert actual == TARGET and host == '127.0.0.1'
            require_empty(conn)
            pg_tool('pg_restore', ['--exit-on-error', '--single-transaction', '--no-owner', '--no-acl', '--no-comments', '--dbname=' + TARGET, str(ROOT / 'final-data/b.dump')], url, PG_BIN)
            assert {s: pg_manifest(conn, s) for s in report['b_database']['schemas']} == report['b_database']['schemas']
            conn.execute('CREATE SCHEMA a'); conn.execute('CREATE SCHEMA b')
            relocated = relocate_b(conn)
            migrate_a(ROOT / 'final-data/inspections.sqlite3', conn)
            assert a_manifest(conn, report['a_tables']) == report['a_tables']
            business = {k: v for k, v in report['b_database']['schemas']['public'].items() if k in relocated}
            assert pg_manifest(conn, 'b', list(business)) == business
            queue = {k: v for k, v in report['b_database']['schemas']['public'].items() if k not in relocated}
            assert pg_manifest(conn, 'public', list(queue)) == queue
            conn.commit()
            assert export_a_sqlite(conn, ROOT / 'final-data/inspections.sqlite3', ROOT / 'reverse-a.sqlite3', report['a_tables']) == report['a_tables']
            conn.rollback()
        state.update(phase='migration_verified', a_tables=len(report['a_tables']), b_tables=len(relocated),
                     a_files=len(report['a_files']), b_files=len(report['b_files']))
        save()
        write_env(url, '127.0.0.1')
        for svc, path in OVERRIDES.items():
            work = RELEASE if svc == 'qaxc-test' else RELEASE / 'b-risk-knowledge'
            entry = 'serve_existing.py' if svc == 'qaxc-test' else 'run_platform.py worker'
            path.write_text('[Service]\nEnvironmentFile=' + str(ENV_FILE) + '\nWorkingDirectory=' + str(work) + '\nExecStart=\nExecStart=' + str(RELEASE / '.venv/bin/python') + ' ' + str(RELEASE / 'platform-module') + '/' + entry + '\n')
            path.chmod(0o644)
        run(['systemctl', 'daemon-reload'])
        run(['systemctl', 'start', 'qaxc-test'])
        wait_api(api['A_TO_B_KEY'])
        runtime = service_env('qaxc-test')
        assert runtime['QAXC_BIND_HOST'] == '127.0.0.1'
        assert runtime['QAXC_DB_URL'] == url and runtime['B_DATABASE_SCHEMA'] == 'b'
        assert runtime['QAXC_AUTH_URL'] == api['QAXC_AUTH_URL'] and runtime['QAXC_AUTH_KEY'] == api['QAXC_AUTH_KEY']
        with psycopg.connect(url) as conn:
            assert a_manifest(conn, report['a_tables']) == report['a_tables']
            assert pg_manifest(conn, 'b', list(business)) == business
        state['phase'] = 'local_production_api_verified'; save()
        run(['systemctl', 'stop', 'qaxc-test'], timeout=110)
        assert show('qaxc-test', 'Result') == 'success'
        write_env(url, '0.0.0.0')
        # This boundary forbids switching back to stale databases automatically.
        published = True
        state.update(published=True, phase='publishing'); save()
        run(['systemctl', 'start', 'qaxc-test'])
        wait_api(api['A_TO_B_KEY'])
        run(['systemctl', 'start', 'qaxc-b-worker'])
        for attempt in range(30):
            status, body = http('/__knowledge/api/v1/health', api['A_TO_B_KEY'])
            if status == 200 and json.loads(body).get('worker_online'):
                break
            time.sleep(1)
        else:
            raise RuntimeError('New worker heartbeat unavailable')
        for svc in SERVICES:
            actual = service_env(svc)
            assert actual['B_DATABASE_SCHEMA'] == 'b' and actual['QAXC_DB_SCHEMA'] == 'a'
            assert actual['QAXC_DB_URL'] == url and actual['B_DATABASE_URL'].endswith('/' + TARGET)
        state.update(phase='published_and_worker_verified', finished_utc=time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
                     public_browser_acceptance='pending', old_sources_preserved=True)
        save()
        (ROOT / 'cutover-summary.json').write_text(json.dumps(state, indent=2))
        print(json.dumps(state), flush=True)
    except BaseException:
        (ROOT / 'cutover-error.log').write_text(traceback.format_exc())
        if stopped and not published:
            try:
                run(['systemctl', 'stop', 'qaxc-test', 'qaxc-b-worker'], timeout=120)
                for p in OVERRIDES.values():
                    if p.exists():
                        p.rename(ROOT / (p.parent.name + '-aborted.conf'))
                if ENV_FILE.exists():
                    ENV_FILE.rename(ROOT / 'aborted-environment.env')
                run(['systemctl', 'daemon-reload'])
                run(['systemctl', 'start', *SERVICES])
                wait_api(api['A_TO_B_KEY'])
                state.update(phase='aborted_original_services_restored', published=False)
            except BaseException:
                (ROOT / 'restore-service-error.log').write_text(traceback.format_exc())
                state['phase'] = 'aborted_service_restore_needs_attention'
        else:
            state['phase'] = 'published_needs_attention_no_stale_rollback'
        save()
        print('CUTOVER_FAILED_PRIVATE_DIAGNOSTICS', ROOT, flush=True)
        raise SystemExit(1)


if __name__ == '__main__':
    main()
