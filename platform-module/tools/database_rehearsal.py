"""Restore verified backups into a NEW rehearsal database, never switch production.

Target must be on loopback and named qaxc_rehearsal_* or qaxc_restore_*.
No DROP DATABASE, production configuration edits, or service restarts exist here.
"""
import argparse
from contextlib import closing
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import shutil
import sqlite3
import sys

from database_backup import (canonical, fingerprint, identifier, pg_manifest, pg_tool,
                             sqlite_manifest, tree_manifest, verify_backup, copy_pg, copy_tree, verify_a_files)


def guarded_target(url, expected_name):
    import psycopg
    from psycopg.conninfo import conninfo_to_dict
    url = url.replace('postgresql+psycopg://', 'postgresql://', 1)
    info = conninfo_to_dict(url)
    if not re.fullmatch(r'qaxc_(rehearsal|restore)_[a-z0-9_]+', expected_name):
        raise ValueError('Target must have a qaxc_rehearsal_ or qaxc_restore_ prefix')
    if info.get('dbname') != expected_name or info.get('host') not in {'127.0.0.1', 'localhost', '::1'}:
        raise ValueError('Target must be the explicitly named local rehearsal database')
    connection = psycopg.connect(url, connect_timeout=5)
    actual, address = connection.execute('SELECT current_database(),host(inet_server_addr())').fetchone()
    connection.rollback()
    if actual != expected_name or address not in {'127.0.0.1', '::1'}:
        connection.close()
        raise ValueError('Connected database identity does not match rehearsal target')
    return connection


def require_empty(conn):
    exists = conn.execute("SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace "
                          "WHERE n.nspname NOT LIKE 'pg_%' AND n.nspname<>'information_schema' "
                          "AND c.relkind IN ('r','p','v','m','S') LIMIT 1").fetchone()
    conn.rollback()
    if exists:
        raise RuntimeError('Target is not empty; use a new rehearsal database')


def sqlite_schema(source):
    tables = [r[0] for r in source.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")]
    specs = {}
    for name in tables:
        identifier(name)
        columns = source.execute('PRAGMA table_info(' + identifier(name) + ')').fetchall()
        if any(c[4] is not None for c in columns):
            raise ValueError('Column defaults need explicit migration review')
        foreign_keys = source.execute('PRAGMA foreign_key_list(' + identifier(name) + ')').fetchall()
        if any(row[1] != 0 or row[5:7] != ('NO ACTION', 'NO ACTION') for row in foreign_keys):
            raise ValueError('Composite/cascading foreign key needs explicit review')
        unique = []
        for ix in source.execute('PRAGMA index_list(' + identifier(name) + ')').fetchall():
            if ix[3] == 'u':
                unique.append([r[2] for r in source.execute('PRAGMA index_info(' + identifier(ix[1]) + ')')])
            elif ix[3] != 'pk':
                raise ValueError('Custom indexes need explicit migration review')
        specs[name] = dict(columns=columns, foreign_keys=foreign_keys, unique=unique)
    if source.execute("SELECT 1 FROM sqlite_master WHERE type IN ('trigger','view') LIMIT 1").fetchone():
        raise ValueError('SQLite views/triggers need explicit migration review')
    return specs


def ordered_tables(specs):
    ordered, remaining = [], set(specs)
    while remaining:
        ready = sorted(name for name in remaining if not ({r[2] for r in specs[name]['foreign_keys']} - set(ordered)))
        if not ready:
            raise ValueError('Cyclic or unknown foreign keys need explicit migration review')
        ordered.extend(ready)
        remaining.difference_update(ready)
    return ordered


def migrate_a(database, conn):
    from psycopg import sql
    from psycopg.types.json import Jsonb
    types = {'TEXT': 'TEXT', 'INTEGER': 'BIGINT', 'REAL': 'DOUBLE PRECISION', 'BLOB': 'BYTEA'}
    with closing(sqlite3.connect(Path(database).resolve().as_uri() + '?mode=ro', uri=True)) as source:
        specs = sqlite_schema(source)
        for name in ordered_tables(specs):
            spec = specs[name]
            parts = []
            for _, col, kind, required, _, primary in spec['columns']:
                kind = 'JSONB' if col in {'payload', 'result'} else types[kind.upper()]
                parts.append(f'{identifier(col)} {kind}' + (' NOT NULL' if required or primary else ''))
            primary = [c[1] for c in sorted(spec['columns'], key=lambda c: c[5]) if c[5]]
            if primary:
                parts.append('PRIMARY KEY (' + ','.join(map(identifier, primary)) + ')')
            for columns in spec['unique']:
                parts.append('UNIQUE (' + ','.join(map(identifier, columns)) + ')')
            for fk in spec['foreign_keys']:
                parts.append(f'FOREIGN KEY ({identifier(fk[3])}) REFERENCES a.{identifier(fk[2])}({identifier(fk[4])})')
            if name == 'tasks':
                parts.append('_row_order BIGINT GENERATED BY DEFAULT AS IDENTITY')
            conn.execute('CREATE TABLE a.' + identifier(name) + '(' + ','.join(parts) + ')')
            cols = [c[1] for c in spec['columns']]
            select_cols = ','.join(map(identifier, cols))
            if name == 'tasks':
                select_cols += ',rowid'; cols.append('_row_order')
            statement = sql.SQL('INSERT INTO a.{} ({}) VALUES ({})').format(
                sql.Identifier(name), sql.SQL(',').join(map(sql.Identifier, cols)),
                sql.SQL(',').join(sql.Placeholder() for _ in cols))
            for row in source.execute('SELECT ' + select_cols + ' FROM ' + identifier(name)):
                values = [Jsonb(json.loads(v)) if col in {'payload', 'result'} and v is not None else v for col, v in zip(cols, row)]
                conn.execute(statement, values)
            if name == 'tasks':
                conn.execute("SELECT setval(pg_get_serial_sequence('a.tasks','_row_order'),COALESCE(max(_row_order),1),count(*)>0) FROM a.tasks")


def a_manifest(conn, expected):
    result = {}
    for table, spec in expected.items():
        columns = spec['columns']
        rows = conn.execute('SELECT ' + ','.join(map(identifier, columns)) + ' FROM a.' + identifier(table)).fetchall()
        result[table] = {'columns': columns, **fingerprint(rows)}
    return result


def relocate_b(conn):
    from psycopg import sql
    # Queue functions retain their existing public namespace. They are shared
    # infrastructure, not A/B business tables. pgvector remains in public too.
    tables = [r[0] for r in conn.execute(
        "SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace "
        "WHERE n.nspname='public' AND c.relkind IN ('r','p') AND c.relname NOT LIKE 'procrastinate_%' "
        "AND NOT EXISTS (SELECT 1 FROM pg_depend d WHERE d.objid=c.oid AND d.deptype='e') ORDER BY c.relname")]
    # Fail closed if future releases add business views/functions with explicit public references.
    views = conn.execute("SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace "
                         "WHERE n.nspname='public' AND c.relkind IN ('v','m') "
                         "AND c.relname NOT LIKE 'procrastinate_%' "
                         "AND NOT EXISTS (SELECT 1 FROM pg_depend d WHERE d.objid=c.oid AND d.deptype='e') LIMIT 1").fetchone()
    if views:
        raise RuntimeError('B business views require explicit schema relocation review')
    for name in tables:
        conn.execute(sql.SQL('ALTER TABLE public.{} SET SCHEMA b').format(sql.Identifier(name)))
    return tables


def export_a_sqlite(conn, template, output, expected):
    """Reverse export current PG A data to a NEW SQLite file, never over the source."""
    if Path(output).exists():
        raise ValueError('Reverse export destination already exists')
    with closing(sqlite3.connect(Path(template).resolve().as_uri() + '?mode=ro', uri=True)) as source:
        order = ordered_tables(sqlite_schema(source))
        create = {row[0]: row[1] for row in source.execute("SELECT name,sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")}
    Path(output).touch(mode=0o600, exist_ok=False)
    with closing(sqlite3.connect(output)) as restored:
        restored.execute('PRAGMA foreign_keys=ON')
        with restored:
            for table in order:
                restored.execute(create[table])
                cols = expected[table]['columns']
                query = 'SELECT ' + ','.join(map(identifier, cols)) + ' FROM a.' + identifier(table)
                if table == 'tasks':
                    query += ' ORDER BY _row_order'
                for row in conn.execute(query):
                    values = [canonical(v) if c in {'payload', 'result'} and v is not None else v for c, v in zip(cols, row)]
                    restored.execute('INSERT INTO ' + identifier(table) + ' VALUES(' + ','.join('?' for _ in cols) + ')', values)
    return sqlite_manifest(output)


def rehearse(backup_dir, url, target_name, output, bin_dir=None):
    source = Path(backup_dir).resolve(strict=True)
    output = Path(output).resolve()
    report = verify_backup(source)
    if 'b_database' not in report:
        raise ValueError('A+B rehearsal requires a complete A+B backup')
    if output == source or source in output.parents:
        raise ValueError('Rehearsal output must not alter the backup directory')
    output.mkdir(parents=True, exist_ok=False, mode=0o700)
    with guarded_target(url, target_name) as conn:
        require_empty(conn)
        pg_tool('pg_restore', ['--exit-on-error', '--single-transaction', '--no-owner', '--no-acl', '--no-comments',
                              '--dbname=' + target_name, str(source / 'b.dump')], url, bin_dir)
        restored_b = {schema: pg_manifest(conn, schema) for schema in report['b_database']['schemas']}
        if restored_b != report['b_database']['schemas']:
            raise RuntimeError('Restored B table fingerprints do not match backup')
        conn.execute('CREATE SCHEMA a')
        conn.execute('CREATE SCHEMA b')
        relocated = relocate_b(conn)
        migrate_a(source / 'inspections.sqlite3', conn)
        if a_manifest(conn, report['a_tables']) != report['a_tables']:
            raise RuntimeError('A migration fingerprints do not match backup')
        b_business = {k: v for k, v in report['b_database']['schemas'].get('public', {}).items() if k in relocated}
        if pg_manifest(conn, 'b', list(b_business)) != b_business:
            raise RuntimeError('B relocation fingerprints do not match backup')
        conn.commit()
        # A SQL-level link check is supplementary, not a substitute for HTTP/worker acceptance.
        imports_exist = conn.execute("SELECT to_regclass('b.a_imports') IS NOT NULL").fetchone()[0]
        linkage = None
        if imports_exist:
            linkage = conn.execute('SELECT count(*),count(d.id) FROM b.a_imports i LEFT JOIN a.deliveries d ON d.id=i.delivery_id').fetchone()
        reverse = export_a_sqlite(conn, source / 'inspections.sqlite3', output / 'reverse-a.sqlite3', report['a_tables'])
        if reverse != report['a_tables']:
            raise RuntimeError('Reverse-exported SQLite does not match the original A data')
        conn.commit()
    shutil.copytree(source / 'a-uploads', output / 'a-uploads')
    shutil.copytree(source / 'b-storage', output / 'b-storage')
    if tree_manifest(output / 'a-uploads') != report['a_files'] or tree_manifest(output / 'b-storage') != report['b_files']:
        raise RuntimeError('Rehearsal attachment copy mismatch')
    result = {'created_utc': datetime.now(timezone.utc).isoformat(), 'target': target_name,
              'a_tables_verified': len(report['a_tables']), 'b_tables_relocated': len(relocated),
              'a_reverse_export_verified': True, 'attachment_copies_verified': True,
              'b_imports_total_and_linked': linkage, 'http_worker_acceptance': 'not_run',
              'production_changed': False, 'cutover_authorized': False}
    (output / 'rehearsal.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
    return result


def rollback_drill(current_url, current_name, restore_url, restore_name, template_backup,
                   a_uploads, b_storage, output, bin_dir=None):
    """Rehearse post-write rollback using a FRESH dump, not the stale pre-cutover DB.

Run against a stopped isolated API/worker, with frozen attachment directories.
It only constructs recovery artifacts and never replaces a running database.
"""
    from psycopg import sql
    if current_name == restore_name:
        raise ValueError('Rollback restore target must be a different fresh database')
    template = Path(template_backup).resolve(strict=True)
    original = verify_backup(template)
    output = Path(output).resolve()
    roots = [template, Path(a_uploads).resolve(strict=True), Path(b_storage).resolve(strict=True)]
    if any(output == root or root in output.parents for root in roots):
        raise ValueError('Rollback output must be outside all input directories')
    with guarded_target(current_url, current_name): pass
    with guarded_target(restore_url, restore_name) as restored:
        require_empty(restored)
    output.mkdir(parents=True, exist_ok=False, mode=0o700)
    before = copy_pg(current_url, output / 'latest-combined.dump', bin_dir)
    a_files = copy_tree(a_uploads, output / 'a-uploads')
    b_files = copy_tree(b_storage, output / 'b-storage')
    pg_tool('pg_restore', ['--exit-on-error', '--single-transaction', '--no-owner', '--no-acl', '--no-comments',
                          '--dbname=' + restore_name, str(output / 'latest-combined.dump')], restore_url, bin_dir)
    with guarded_target(restore_url, restore_name) as restored:
        after = {schema: pg_manifest(restored, schema) for schema in before['schemas']}
        if after != before['schemas']:
            raise RuntimeError('Rollback clone does not match the latest combined snapshot')
        current_a = a_manifest(restored, original['a_tables'])
        reverse = export_a_sqlite(restored, template / 'inspections.sqlite3', output / 'inspections.sqlite3', original['a_tables'])
        if reverse != current_a:
            raise RuntimeError('Rollback SQLite lost current PostgreSQL A data')
        tables = [r[0] for r in restored.execute("SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='b' AND c.relkind IN ('r','p') ORDER BY c.relname")]
        for name in tables:
            restored.execute(sql.SQL('ALTER TABLE b.{} SET SCHEMA public').format(sql.Identifier(name)))
        expected_b = before['schemas'].get('b', {})
        if pg_manifest(restored, 'public', list(expected_b)) != expected_b:
            raise RuntimeError('Rollback B schema lost data')
        restored.commit()
    references = verify_a_files(output / 'inspections.sqlite3', output / 'a-uploads')
    result = {'restore_database': restore_name, 'latest_a_data_verified': True,
              'latest_b_data_verified': True, 'attachment_references_verified': references,
              'a_file_count': len(a_files), 'b_file_count': len(b_files),
              'online_service_switch_executed': False, 'production_changed': False,
              'requires_frozen_writes': True}
    (output / 'rollback.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--backup', type=Path, required=True)
    parser.add_argument('--target-url-env', default='QAXC_REHEARSAL_URL')
    parser.add_argument('--target-name', required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--pg-bin', type=Path)
    parser.add_argument('--rollback-target-name')
    parser.add_argument('--rollback-url-env', default='QAXC_RESTORE_URL')
    parser.add_argument('--a-uploads', type=Path)
    parser.add_argument('--b-storage', type=Path)
    args = parser.parse_args()
    if args.rollback_target_name:
        if not args.a_uploads or not args.b_storage:
            parser.error('Rollback rehearsal requires current --a-uploads and --b-storage')
        result = rollback_drill(os.environ[args.target_url_env], args.target_name,
                                os.environ[args.rollback_url_env], args.rollback_target_name,
                                args.backup, args.a_uploads, args.b_storage, args.output, args.pg_bin)
    else:
        result = rehearse(args.backup, os.environ[args.target_url_env], args.target_name, args.output, args.pg_bin)
    print(json.dumps(result))


if __name__ == '__main__':
    main()
