"""Backup failure cases and optional real PG16 migration/rollback rehearsal.

All records are synthetic. PostgreSQL tests require an explicit loopback test URL;
they create fresh named databases and leave them available for inspection.
"""
from contextlib import closing
import hashlib
import json
import os
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest
import uuid
from unittest.mock import patch

PLATFORM = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(PLATFORM / 'tools'), str(PLATFORM / 'candidate'), str(PLATFORM)]
import database_backup as backup
import database_rehearsal as migration
import pg_storage
import server


def seed_a(root):
    with patch.dict(os.environ, {'QAXC_DB_URL': '', 'AB_INTEGRATION_VERSION': '', 'QAXC_PASSWORD': 'synthetic-test-only'}), patch.object(server, 'DATA', root):
        server.init()
        image = b'synthetic attachment bytes; not a real photograph'
        (root / 'uploads' / 'example.bin').write_bytes(image)
        with server.db() as conn:
            conn.execute('INSERT INTO projects VALUES(?,?,?,?)', ('p1', '模拟项目', '模拟合同', '2026-11-05'))
            conn.execute('INSERT INTO tasks VALUES(?,?,?,?)', ('t1', 'p1', json.dumps({'id': 't1', 'title': '模拟巡查', 'projectId': 'p1', 'events': []}), 1))
            conn.execute('INSERT INTO deliveries VALUES(?,?,?,?)', ('d1', 't1', 1, json.dumps({'project': {'id': 'p1'}, 'task': {'id': 't1'}})))
            conn.execute('INSERT INTO evidence VALUES(?,?,?)', ('e1', 'p1', json.dumps({'filename': 'example.bin', 'sha256': hashlib.sha256(image).hexdigest()})))


class BackupTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(dir=PLATFORM)
        self.root = Path(self.temp.name)
        seed_a(self.root / 'source')

    def tearDown(self):
        self.temp.cleanup()

    def test_online_snapshot_and_attachments_are_verified(self):
        original = backup.digest_file(self.root / 'source/inspections.sqlite3')
        report = backup.backup(self.root / 'source', self.root / 'backup')
        self.assertEqual(backup.verify_backup(self.root / 'backup'), report)
        self.assertEqual(backup.digest_file(self.root / 'source/inspections.sqlite3'), original)
        self.assertEqual(report['a_attachment_references'], 1)
        self.assertFalse(report['consistent_across_databases'])

    def test_changed_attachment_and_changed_database_are_detected(self):
        backup.backup(self.root / 'source', self.root / 'backup')
        file = self.root / 'backup/a-uploads/example.bin'
        content = file.read_bytes(); file.write_bytes(b'changed')
        with self.assertRaises(RuntimeError): backup.verify_backup(self.root / 'backup')
        file.write_bytes(content)
        with closing(sqlite3.connect(self.root / 'backup/inspections.sqlite3')) as conn:
            with conn: conn.execute("UPDATE projects SET name='changed'")
        with self.assertRaises(RuntimeError): backup.verify_backup(self.root / 'backup')

    def test_missing_referenced_attachment_fails_without_success_marker(self):
        (self.root / 'source/uploads/example.bin').unlink()
        with self.assertRaises(RuntimeError): backup.backup(self.root / 'source', self.root / 'backup')
        self.assertFalse((self.root / 'backup/manifest.json').exists())

    def test_backup_cannot_overwrite_or_nest_in_source(self):
        with self.assertRaises(ValueError): backup.backup(self.root / 'source', self.root / 'source/backup')
        backup.backup(self.root / 'source', self.root / 'backup')
        with self.assertRaises(FileExistsError): backup.backup(self.root / 'source', self.root / 'backup')

    def test_invalid_foreign_keys_block_backup(self):
        with closing(sqlite3.connect(self.root / 'source/inspections.sqlite3')) as conn:
            with conn: conn.execute("UPDATE tasks SET project_id='missing'")
        with self.assertRaises(RuntimeError): backup.backup(self.root / 'source', self.root / 'backup')

    def test_wal_committed_data_is_in_backup(self):
        with closing(sqlite3.connect(self.root / 'source/inspections.sqlite3')) as conn:
            conn.execute('PRAGMA journal_mode=WAL')
            with conn: conn.execute("UPDATE projects SET name='WAL committed'")
            backup.backup(self.root / 'source', self.root / 'backup')
        with closing(sqlite3.connect(self.root / 'backup/inspections.sqlite3')) as conn:
            self.assertEqual(conn.execute('SELECT name FROM projects').fetchone()[0], 'WAL committed')


@unittest.skipUnless(os.environ.get('QAXC_PG_TEST_ADMIN_URL'), 'explicit local PG test environment required')
class PostgresTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        import psycopg
        from psycopg.conninfo import conninfo_to_dict, make_conninfo
        info = conninfo_to_dict(os.environ['QAXC_PG_TEST_ADMIN_URL'])
        if info.get('host') != '127.0.0.1' or info.get('port') != '55449' or info.get('dbname') != 'postgres':
            raise RuntimeError('Only the dedicated local PG16 test cluster is allowed')
        cls.names = ['qaxc_rehearsal_' + uuid.uuid4().hex[:12] for _ in range(2)]
        with psycopg.connect(os.environ['QAXC_PG_TEST_ADMIN_URL'], autocommit=True) as conn:
            for name in cls.names:
                conn.execute('CREATE DATABASE ' + backup.identifier(name))
        # Runtime URLs deliberately stay URI shaped, as required by application settings.
        from urllib.parse import quote
        cls.urls = [f"postgresql://{quote(info['user'],safe='')}:{quote(info['password'],safe='')}@127.0.0.1:55449/{name}" for name in cls.names]
        cls.root = PLATFORM.parent / '.local' / ('rehearsal-' + uuid.uuid4().hex[:12])
        cls.root.mkdir(parents=True)
        seed_a(cls.root / 'source-a')
        (cls.root / 'source-b').mkdir()
        (cls.root / 'source-b/result.txt').write_text('synthetic B attachment', encoding='utf-8')
        with psycopg.connect(cls.urls[0]) as conn:
            # Representative B namespace/cross-link fixtures; not full B/worker acceptance.
            conn.execute('CREATE TABLE projects(id TEXT PRIMARY KEY,name TEXT NOT NULL)')
            conn.execute("INSERT INTO projects VALUES('p1','B project fixture')")
            conn.execute('CREATE TABLE a_imports(id TEXT PRIMARY KEY,delivery_id TEXT NOT NULL,payload JSONB NOT NULL)')
            conn.execute("INSERT INTO a_imports VALUES('i1','d1','{\"status\":\"succeeded\"}')")
            conn.execute('CREATE TABLE procrastinate_rehearsal(id INT PRIMARY KEY)')
            conn.execute('INSERT INTO procrastinate_rehearsal VALUES(1)')
        cls.original = backup.backup(cls.root / 'source-a', cls.root / 'backup', cls.urls[0], cls.root / 'source-b', os.environ['QAXC_PG_TEST_BIN'])
        cls.result = migration.rehearse(cls.root / 'backup', cls.urls[1], cls.names[1], cls.root / 'restored', os.environ['QAXC_PG_TEST_BIN'])

    def test_row_fingerprints_schema_separation_and_linkage(self):
        import psycopg
        self.assertTrue(self.result['a_reverse_export_verified'])
        self.assertEqual(tuple(self.result['b_imports_total_and_linked']), (1, 1))
        with psycopg.connect(self.urls[1]) as conn:
            self.assertEqual(conn.execute('SELECT name FROM a.projects').fetchone()[0], '模拟项目')
            self.assertEqual(conn.execute('SELECT name FROM b.projects').fetchone()[0], 'B project fixture')
            self.assertIsNotNone(conn.execute("SELECT to_regclass('public.procrastinate_rehearsal')").fetchone()[0])
            self.assertEqual(conn.execute("SELECT data_type FROM information_schema.columns WHERE table_schema='a' AND table_name='tasks' AND column_name='payload'").fetchone()[0], 'jsonb')

    def test_cross_schema_transaction_rolls_back_together(self):
        import psycopg
        with psycopg.connect(self.urls[1]) as conn:
            try:
                with conn.transaction():
                    conn.execute("INSERT INTO a.projects VALUES('atomic','atomic','test','now')")
                    conn.execute("INSERT INTO b.projects VALUES('atomic','atomic')")
                    raise RuntimeError('injected failure')
            except RuntimeError: pass
            self.assertIsNone(conn.execute("SELECT id FROM a.projects WHERE id='atomic'").fetchone())
            self.assertIsNone(conn.execute("SELECT id FROM b.projects WHERE id='atomic'").fetchone())

    def test_new_pg_write_reverse_exports_without_losing_it(self):
        import psycopg
        with psycopg.connect(self.urls[1]) as conn:
            conn.execute("INSERT INTO a.projects VALUES('after-cutover','新增模拟数据','test','now')")
            expected = migration.a_manifest(conn, self.original['a_tables'])
            exported = migration.export_a_sqlite(conn, self.root / 'backup/inspections.sqlite3', self.root / 'after-write.sqlite3', self.original['a_tables'])
            self.assertEqual(exported, expected)
            # This is a reverse-export drill. No production file is ever replaced.
            conn.rollback()

    def test_runtime_adapter_reads_json_and_preserves_constraints(self):
        with patch.dict(os.environ, {'QAXC_DB_URL': self.urls[1], 'QAXC_DB_SCHEMA': 'a'}):
            with server.db() as conn:
                conn.execute('BEGIN IMMEDIATE')
                row = conn.execute('SELECT * FROM tasks WHERE id=?', ('t1',)).fetchone()
                self.assertEqual(json.loads(row['payload'])['id'], 't1')
                self.assertEqual(row[0], 't1')
                self.assertNotIn('_row_order', dict(row))
                literal = conn.execute("SELECT '50% ?' AS label, ? AS value", ('bound',)).fetchone()
                self.assertEqual(tuple(literal.values()), ('50% ?', 'bound'))
            with self.assertRaises(sqlite3.IntegrityError):
                with server.db() as conn:
                    conn.execute('INSERT INTO tasks VALUES(?,?,?,?)', ('bad', 'absent', '{}', 1))
            with server.db() as conn:
                self.assertIsNone(conn.execute('SELECT id FROM tasks WHERE id=?', ('bad',)).fetchone())
        pg_storage.close_pools()

    def test_rehearsal_refuses_nonempty_and_production_targets(self):
        with migration.guarded_target(self.urls[1], self.names[1]) as conn:
            with self.assertRaises(RuntimeError): migration.require_empty(conn)
        with self.assertRaises(ValueError): migration.guarded_target(self.urls[1], 'qaxc_b')

    def test_original_backup_remains_unchanged(self):
        self.assertEqual(backup.verify_backup(self.root / 'backup'), self.original)

    def test_b_schema_configuration_and_shared_database_guard(self):
        from sqlalchemy import create_engine, event
        sys.path.insert(0, str(PLATFORM.parent / 'b-risk-knowledge'))
        env = {'B_DATABASE_URL': self.urls[1].replace('postgresql://', 'postgresql+psycopg://', 1),
               'B_DATABASE_SCHEMA': 'b', 'B_ENV': 'development', 'B_AUTH_MODE': 'mock',
               'QAXC_DB_URL': self.urls[1], 'QAXC_DB_SCHEMA': 'a'}
        with patch.dict(os.environ, env):
            from backend.db import engine, check_schema
            with engine.connect() as conn:
                self.assertEqual(conn.exec_driver_sql('SELECT name FROM projects').fetchone()[0], 'B project fixture')
            pg_storage.verify_shared_database(engine)
            other = create_engine(self.urls[0].replace('postgresql://', 'postgresql+psycopg://', 1))
            with self.assertRaises(RuntimeError): pg_storage.verify_shared_database(other)
            other.dispose()
            missing = create_engine(env['B_DATABASE_URL'], connect_args={'options': '-csearch_path=missing_schema,public'})
            event.listen(missing, 'connect', check_schema)
            with self.assertRaises(RuntimeError):
                with missing.connect(): pass
            missing.dispose(); engine.dispose()
        pg_storage.close_pools()

    def test_postwrite_rollback_preserves_both_modules(self):
        import psycopg
        name = 'qaxc_restore_' + uuid.uuid4().hex[:12]
        with psycopg.connect(os.environ['QAXC_PG_TEST_ADMIN_URL'], autocommit=True) as conn:
            conn.execute('CREATE DATABASE ' + name)
        restore_url = self.urls[1].rsplit('/', 1)[0] + '/' + name
        with psycopg.connect(self.urls[1]) as conn:
            conn.execute("INSERT INTO a.projects VALUES('rollback-new','new A','test','now')")
            conn.execute("INSERT INTO b.projects VALUES('rollback-new','new B')")
        result = migration.rollback_drill(self.urls[1], self.names[1], restore_url, name,
            self.root / 'backup', self.root / 'restored/a-uploads', self.root / 'restored/b-storage',
            self.root / 'rollback', os.environ['QAXC_PG_TEST_BIN'])
        self.assertTrue(result['latest_a_data_verified'] and result['latest_b_data_verified'])
        with closing(sqlite3.connect(self.root / 'rollback/inspections.sqlite3')) as conn:
            self.assertEqual(conn.execute("SELECT name FROM projects WHERE id='rollback-new'").fetchone()[0], 'new A')
        with psycopg.connect(restore_url) as conn:
            self.assertEqual(conn.execute("SELECT name FROM public.projects WHERE id='rollback-new'").fetchone()[0], 'new B')
        with psycopg.connect(self.urls[1]) as conn:
            conn.execute("DELETE FROM a.projects WHERE id='rollback-new'")
            conn.execute("DELETE FROM b.projects WHERE id='rollback-new'")


if __name__ == '__main__':
    unittest.main(verbosity=2)
