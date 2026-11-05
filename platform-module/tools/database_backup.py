"""Read-only source backup. No service stops, schema edits or production cutover.

Database snapshots are individually consistent. This online backup is NOT a
cross-database cutover snapshot; final cutover needs an explicit write freeze.
Credentials are read from named environment variables, never command arguments.
"""
import argparse
from contextlib import closing
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import sqlite3
import subprocess


def digest_file(path):
    with Path(path).open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def identifier(name):
    if not re.fullmatch(r'[a-z_][a-z0-9_]*', name):
        raise ValueError('Unexpected database identifier')
    return '"' + name + '"'


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'), default=str)


def fingerprint(rows):
    encoded = sorted(canonical(list(row)) for row in rows)
    return {'rows': len(encoded), 'sha256': hashlib.sha256(canonical(encoded).encode()).hexdigest()}


def sqlite_manifest(path):
    with closing(sqlite3.connect(Path(path).resolve().as_uri() + '?mode=ro', uri=True)) as conn:
        if conn.execute('PRAGMA integrity_check').fetchall() != [('ok',)]:
            raise RuntimeError('SQLite integrity_check failed')
        if conn.execute('PRAGMA foreign_key_check').fetchall():
            raise RuntimeError('SQLite foreign_key_check failed')
        result = {}
        for (name,) in conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"):
            columns = [row[1] for row in conn.execute('PRAGMA table_info(' + identifier(name) + ')')]
            rows = conn.execute('SELECT * FROM ' + identifier(name)).fetchall()
            normalized = []
            for row in rows:
                normalized.append([json.loads(value) if col in {'payload', 'result'} and value is not None else value
                                   for col, value in zip(columns, row)])
            result[name] = {'columns': columns, **fingerprint(normalized)}
        return result


def copy_sqlite(source, target):
    source, target = Path(source).resolve(), Path(target).resolve()
    if not source.is_file() or target.exists() or source == target:
        raise ValueError('SQLite source must exist and backup destination must be new')
    # Exclusive creation prevents accidentally overwriting another backup.
    target.touch(exist_ok=False, mode=0o600)
    with closing(sqlite3.connect(source.as_uri() + '?mode=ro', uri=True)) as src:
        with closing(sqlite3.connect(target)) as dst:
            src.backup(dst, pages=256, sleep=0.05)
    return sqlite_manifest(target)


def tree_manifest(root):
    root = Path(root).resolve(strict=True)
    result = {}
    for path in sorted(root.rglob('*')):
        if path.is_symlink() or root not in path.resolve().parents:
            raise ValueError('Symlinks and paths escaping the backup tree are not supported')
        if path.is_file():
            result[path.relative_to(root).as_posix()] = {'bytes': path.stat().st_size, 'sha256': digest_file(path)}
    return result


def copy_tree(source, target):
    source, target = Path(source).resolve(strict=True), Path(target).resolve()
    if target == source or source in target.parents or target.exists():
        raise ValueError('Backup tree must be a new directory outside the source')
    before = tree_manifest(source)
    shutil.copytree(source, target)
    after = tree_manifest(source)
    if before != after or tree_manifest(target) != before:
        raise RuntimeError('Files changed during backup; retry into a fresh directory')
    return before


def verify_a_files(database, uploads):
    root = Path(uploads).resolve(strict=True)
    with closing(sqlite3.connect(Path(database).resolve().as_uri() + '?mode=ro', uri=True)) as conn:
        tables = {r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        references = []
        if 'media' in tables:
            references.extend((r[0], None) for r in conn.execute('SELECT name FROM media'))
        if 'evidence' in tables:
            for (payload,) in conn.execute('SELECT payload FROM evidence'):
                record = json.loads(payload)
                references.append((record['filename'], record.get('sha256')))
        for name, expected in references:
            path = (root / name).resolve()
            if root not in path.parents or not path.is_file():
                raise RuntimeError('Referenced attachment missing or outside uploads')
            if expected and digest_file(path) != expected:
                raise RuntimeError('Referenced attachment checksum mismatch')
        return len(references)


def pg_environment(url):
    from psycopg.conninfo import conninfo_to_dict
    fields = conninfo_to_dict(url.replace('postgresql+psycopg://', 'postgresql://', 1))
    # Do not inherit an unrelated PG target, password or options from the shell.
    env = {k: v for k, v in os.environ.items() if not k.startswith('PG')}
    for key, value in fields.items():
        env['PG' + ('DATABASE' if key == 'dbname' else key.upper())] = value
    env['PGCONNECT_TIMEOUT'] = '5'
    return env


def pg_tool(name, args, url, bin_dir=None):
    executable = str(Path(bin_dir) / (name + ('.exe' if os.name == 'nt' else ''))) if bin_dir else name
    run = subprocess.run([executable, *args], env=pg_environment(url), capture_output=True, text=True)
    if run.returncode:
        # pg_dump/restore errors can contain URLs or row values; keep them out of shared logs.
        raise RuntimeError(f'{name} failed (exit {run.returncode}); inspect privately on the host')
    return run.stdout


def pg_manifest(conn, schema='public', names=None):
    from psycopg import sql
    if names is None:
        names = [r[0] for r in conn.execute(
            "SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace "
            "WHERE n.nspname=%s AND c.relkind IN ('r','p') AND NOT c.relispartition ORDER BY c.relname", (schema,))]
    result = {}
    for name in names:
        cursor = conn.execute(sql.SQL('SELECT * FROM {}.{}').format(sql.Identifier(schema), sql.Identifier(name)))
        result[name] = {'columns': [col.name for col in cursor.description], **fingerprint(cursor.fetchall())}
    return result


def copy_pg(url, target, bin_dir=None):
    import psycopg
    if Path(target).exists():
        raise ValueError('PostgreSQL dump destination already exists')
    with psycopg.connect(url.replace('postgresql+psycopg://', 'postgresql://', 1)) as conn:
        conn.execute('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY')
        snapshot = conn.execute('SELECT pg_export_snapshot()').fetchone()[0]
        # Capture every user schema, including the queue, in the same exported snapshot.
        schemas = [r[0] for r in conn.execute("SELECT nspname FROM pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname <> 'information_schema' ORDER BY nspname")]
        data = {schema: pg_manifest(conn, schema) for schema in schemas}
        version = conn.execute('SHOW server_version').fetchone()[0]
        pg_tool('pg_dump', ['--format=custom', '--no-owner', '--no-acl', '--snapshot=' + snapshot, '--file=' + str(target)], url, bin_dir)
    pg_tool('pg_restore', ['--list', str(target)], url, bin_dir)
    return {'server_version': version, 'schemas': data, 'sha256': digest_file(target)}


def backup(a_data, destination, b_url=None, b_storage=None, bin_dir=None):
    if bool(b_url) != bool(b_storage):
        raise ValueError('B database URL and storage directory must be supplied together')
    a_data, destination = Path(a_data).resolve(strict=True), Path(destination).resolve()
    if a_data == destination or a_data in destination.parents:
        raise ValueError('Backup destination must be outside A data')
    if b_storage:
        b_root = Path(b_storage).resolve(strict=True)
        if b_root == destination or b_root in destination.parents:
            raise ValueError('Backup destination must be outside B storage')
    destination.mkdir(parents=True, exist_ok=False, mode=0o700)
    report = {'format': 1, 'created_utc': datetime.now(timezone.utc).isoformat(),
              'consistent_across_databases': False, 'cutover_authorized': False}
    report['a_tables'] = copy_sqlite(a_data / 'inspections.sqlite3', destination / 'inspections.sqlite3')
    report['a_files'] = copy_tree(a_data / 'uploads', destination / 'a-uploads')
    report['a_attachment_references'] = verify_a_files(destination / 'inspections.sqlite3', destination / 'a-uploads')
    report['a_sha256'] = digest_file(destination / 'inspections.sqlite3')
    if b_url:
        if not b_storage:
            raise ValueError('B storage is required for a complete B backup')
        report['b_database'] = copy_pg(b_url, destination / 'b.dump', bin_dir)
        report['b_files'] = copy_tree(b_storage, destination / 'b-storage')
    # This marker appears only after all validations succeed. Failed partial backups
    # remain for diagnosis and are never accepted by the migration tool.
    (destination / 'manifest.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    return report


def verify_backup(directory):
    root = Path(directory).resolve(strict=True)
    report = json.loads((root / 'manifest.json').read_text(encoding='utf-8'))
    if report.get('format') != 1:
        raise ValueError('Unsupported backup manifest')
    if digest_file(root / 'inspections.sqlite3') != report['a_sha256'] or sqlite_manifest(root / 'inspections.sqlite3') != report['a_tables']:
        raise RuntimeError('SQLite backup verification failed')
    if tree_manifest(root / 'a-uploads') != report['a_files']:
        raise RuntimeError('A attachment backup verification failed')
    verify_a_files(root / 'inspections.sqlite3', root / 'a-uploads')
    if 'b_database' in report:
        if digest_file(root / 'b.dump') != report['b_database']['sha256'] or tree_manifest(root / 'b-storage') != report['b_files']:
            raise RuntimeError('B backup verification failed')
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--a-data', type=Path)
    parser.add_argument('--destination', type=Path)
    parser.add_argument('--b-url-env', default='QAXC_BACKUP_B_URL')
    parser.add_argument('--b-storage', type=Path)
    parser.add_argument('--pg-bin', type=Path)
    parser.add_argument('--verify', type=Path)
    parser.add_argument('--a-only', action='store_true', help='Explicitly create only an A backup')
    args = parser.parse_args()
    if args.verify:
        verify_backup(args.verify)
        print('BACKUP_VERIFIED')
    else:
        if not args.a_data or not args.destination:
            parser.error('--a-data and --destination are required')
        b_url = None if args.a_only else os.environ.get(args.b_url_env)
        if not args.a_only and (not b_url or not args.b_storage):
            parser.error('A+B backup requires a configured B URL environment variable and --b-storage')
        if args.a_only and args.b_storage:
            parser.error('--a-only cannot be combined with --b-storage')
        result = backup(args.a_data, args.destination, b_url, args.b_storage, args.pg_bin)
        print(json.dumps({'result': 'BACKUP_VERIFIED', 'a_tables': len(result['a_tables']),
                          'b_included': 'b_database' in result, 'cutover_authorized': False}))


if __name__ == '__main__':
    main()
