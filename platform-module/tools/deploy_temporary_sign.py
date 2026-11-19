"""Temporary inspection signing code-only patch, isolated PG rehearsal, backup and row preservation.

Run with the existing service virtualenv on the authorized host. --rehearse
writes synthetic fixtures only to the existing rehearsal database. Default is
read-only preflight; --apply replaces baseline-checked backend files.
"""
import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import unittest
import uuid
from urllib.parse import urlsplit, urlunsplit

from deploy_workflow_20261119 import ROOT, SERVICES, run, sha, status, file_stats

SOURCE = Path(__file__).resolve().parents[1]
OUT = SOURCE.parent.parent
BASELINE = {'mobile_workflow.py': '5bfac663be3841622b8d77e63cdab0f15cd08a284d9ea4d9e0329897fe640058', 'combined_reports.py': 'e3a4175e7dc7e05a80200f323fad06faf595a0cacd09d8e850454281383c64cb'}
TEST_MODULES = ['test_mobile_workflow','test_mobile_open','test_leader_reports','test_combined_reports','test_integration']
EXPECTED_TESTS = 98
TEST_DB = 'qaxc_mobile_rehearsal_20261119'


def main():
    parser = argparse.ArgumentParser()
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument('--rehearse', action='store_true')
    modes.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    assert sys.platform == 'linux' and os.geteuid() == 0
    assert SOURCE != ROOT / 'platform-module' and str(OUT).startswith('/tmp/qaxc-temporary-sign-')
    os.umask(0o077)
    import psycopg
    from psycopg.conninfo import conninfo_to_dict
    from database_backup import copy_pg, copy_tree, pg_manifest, tree_manifest
    pid = run('systemctl', 'show', SERVICES[0], '-p', 'MainPID', '--value')
    assert str(ROOT / 'platform-module/serve_existing.py').encode() in Path('/proc/' + pid + '/cmdline').read_bytes().split(b'\0')
    env = dict(x.decode().split('=', 1) for x in Path('/proc/' + pid + '/environ').read_bytes().split(b'\0') if b'=' in x)
    url = env['QAXC_DB_URL']
    cfg = conninfo_to_dict(url)
    assert (cfg['host'], cfg['port'], cfg['dbname']) == ('127.0.0.1', '55440', 'qaxc_ab_20261105')
    assert env.get('QAXC_UAT_PROJECT_SYNC') != '1' and env.get('QAXC_DB_SCHEMA') == 'a'
    assert env.get('QAXC_DATA') == '/var/lib/qaxc-test'
    hashes = {name: sha(SOURCE / 'candidate' / name) for name in BASELINE}
    if args.rehearse:
        test_url = urlunsplit(urlsplit(url)._replace(path='/' + TEST_DB))
        assert conninfo_to_dict(test_url)['dbname'] == TEST_DB
        with psycopg.connect(test_url) as c:
            assert c.execute('SELECT current_database()').fetchone()[0] == TEST_DB
        for key in list(os.environ):
            if key.startswith(('QAXC_', 'AB_', 'B_', 'PG')):
                os.environ.pop(key)
        os.environ.update(QAXC_DB_URL=test_url, QAXC_ROOT_PATH='/quality')
        sys.path[:0] = [str(SOURCE), str(SOURCE / 'tests'), str(SOURCE / 'candidate')]
        import test_integration as integration
        original, teardown = integration.Integration.setUp, integration.Integration.tearDown
        def setup(test):
            schema = 'rehearsal_' + uuid.uuid4().hex
            with psycopg.connect(test_url, autocommit=True) as c:
                c.execute(psycopg.sql.SQL('CREATE SCHEMA {}').format(psycopg.sql.Identifier(schema)))
            os.environ['QAXC_DB_SCHEMA'] = schema
            original(test)
        def cleanup(test):
            try:
                teardown(test)
            finally:
                integration.s.pg_storage.close_pools()
        integration.Integration.setUp = setup
        integration.Integration.tearDown = cleanup
        result = unittest.TextTestRunner(verbosity=1).run(unittest.defaultTestLoader.loadTestsFromNames(TEST_MODULES))
        receipt = dict(tests=result.testsRun, success=result.wasSuccessful(), files=hashes)
        (OUT / 'pg-test.json').write_text(json.dumps(receipt))
        print('PG_REHEARSAL', json.dumps(receipt), flush=True)
        assert result.wasSuccessful() and result.testsRun == EXPECTED_TESTS
        return
    assert json.loads((OUT / 'pg-test.json').read_text()) == dict(tests=EXPECTED_TESTS, success=True, files=hashes)
    live = ROOT / 'platform-module/candidate'
    for name, before in BASELINE.items():
        assert sha(live / name) == before, 'Live baseline differs: ' + name
        compile((SOURCE / 'candidate' / name).read_text(), name, 'exec')
    assert all(run('systemctl', 'is-active', s) == 'active' for s in SERVICES)
    with psycopg.connect(url) as c:
        c.execute('SET TRANSACTION READ ONLY')
        db_bytes = c.execute('SELECT pg_database_size(current_database())').fetchone()[0]
    uploads = Path(env['QAXC_DATA']) / 'uploads'
    assert shutil.disk_usage('/var/backups').free > 1024**3 + db_bytes * 2 + sum(p.stat().st_size for p in uploads.rglob('*') if p.is_file()) * 2
    if not args.apply:
        print('PREFLIGHT_OK', json.dumps({'files': list(hashes), 'pg_tests': EXPECTED_TESTS, 'schema_changes': False}), flush=True)
        return
    backup = Path('/var/backups/qaxc-temporary-sign-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ'))
    backup.mkdir(mode=0o700)
    for name in BASELINE:
        if (live / name).exists(): shutil.copy2(live / name, backup / name)
    stopped, changed = [], []
    try:
        for service in reversed(SERVICES):
            subprocess.run(['systemctl', 'stop', service], check=True)
            stopped.append(service)
        print('WRITERS_STOPPED_BACKING_UP', flush=True)
        record = {'files': hashes, 'baseline': BASELINE}
        record['database'] = copy_pg(url, backup / 'database.dump', '/usr/lib/postgresql/16/bin')
        record['uploads'] = copy_tree(uploads, backup / 'uploads')
        b_root = Path('/var/lib/qaxc-b/storage')
        record['b_files'] = file_stats(b_root)
        (backup / 'backup-manifest.json').write_text(json.dumps(record, indent=2))
        for name in BASELINE:
            target = live / name
            temporary = target.with_name(target.name + '.temporary-new')
            temporary.write_bytes((SOURCE / 'candidate' / name).read_bytes())
            info = target.stat() if target.exists() else (live / 'server.py').stat()
            os.chown(temporary, info.st_uid, info.st_gid)
            temporary.chmod(info.st_mode & 0o777)
            os.replace(temporary, target)
            changed.append(name)
        subprocess.run(['systemctl', 'start', SERVICES[0]], check=True)
        ready = False
        for _ in range(40):
            try:
                ready = status('/app.js')[0] == 200 and status('/api/work/mobile-state')[0] == 401
                if ready: break
            except OSError:
                pass
            time.sleep(1)
        assert ready
        with psycopg.connect(url) as c:
            c.execute('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY')
            for schema, before in record['database']['schemas'].items():
                assert pg_manifest(c, schema) == before, 'Database changed: ' + schema
        assert tree_manifest(uploads) == record['uploads'] and file_stats(b_root) == record['b_files']
        assert all(sha(live / name) == after for name, after in hashes.items())
        subprocess.run(['systemctl', 'start', SERVICES[1]], check=True)
        assert all(run('systemctl', 'is-active', s) == 'active' for s in SERVICES)
        receipt = dict(status='deployed', files=hashes, backup=str(backup),
                       original_tables_preserved={s: len(t) for s, t in record['database']['schemas'].items()})
        (backup / 'deployment.json').write_text(json.dumps(receipt, indent=2))
        (OUT / 'deployment.json').write_text(json.dumps(receipt, indent=2))
        print('DEPLOYED', json.dumps(receipt), flush=True)
    except BaseException:
        subprocess.run(['systemctl', 'stop', SERVICES[0]], check=False)
        for name in changed:
            if (backup / name).exists(): shutil.copy2(backup / name, live / name)
            elif BASELINE[name] is None: (live / name).unlink()
        for service in SERVICES:
            if service in stopped:
                subprocess.run(['systemctl', 'start', service], check=False)
        print('FAILED_CODE_RESTORED_DATABASE_UNCHANGED', flush=True)
        raise


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print('STOPPED', type(error).__name__, flush=True)
        sys.exit(1)
