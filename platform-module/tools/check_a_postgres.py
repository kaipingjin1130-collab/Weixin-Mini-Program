"""Run existing A HTTP-handler regression suites on a fresh local PostgreSQL DB.

Uses synthetic data only. Does not connect to the production identity provider.
Credentials are supplied through QAXC_PG_TEST_ADMIN_URL, never logged.
"""
import os
from pathlib import Path
import sys
import unittest
import uuid


def main():
    import psycopg
    from psycopg import sql
    from psycopg.conninfo import conninfo_to_dict
    from urllib.parse import quote
    config = conninfo_to_dict(os.environ['QAXC_PG_TEST_ADMIN_URL'])
    if config.get('host') != '127.0.0.1' or config.get('port') != '55449' or config.get('dbname') != 'postgres':
        raise RuntimeError('This runner is restricted to the dedicated local test cluster')
    name = 'qaxc_rehearsal_api_' + uuid.uuid4().hex[:10]
    with psycopg.connect(os.environ['QAXC_PG_TEST_ADMIN_URL'], autocommit=True) as conn:
        conn.execute(sql.SQL('CREATE DATABASE {}').format(sql.Identifier(name)))
    url = f"postgresql://{quote(config['user'],safe='')}:{quote(config['password'],safe='')}@127.0.0.1:55449/{name}"
    with psycopg.connect(url) as conn:
        conn.execute('CREATE SCHEMA a')
    os.environ['QAXC_DB_URL'], os.environ['QAXC_DB_SCHEMA'] = url, 'a'
    os.environ['QAXC_ROOT_PATH'] = '/quality'
    os.environ.pop('AB_INTEGRATION_VERSION', None)
    platform = Path(__file__).resolve().parents[1]
    sys.path[:0] = [str(platform), str(platform / 'tests')]
    import test_integration as integration
    original = integration.Integration.setUp

    def isolated_set_up(self):
        # These test-owned tables are reset between synthetic cases. No other
        # schema or database can be reached through this connection.
        with psycopg.connect(url) as conn:
            tables = [r[0] for r in conn.execute("SELECT tablename FROM pg_tables WHERE schemaname='a'")]
            if tables:
                conn.execute(sql.SQL('TRUNCATE {} RESTART IDENTITY CASCADE').format(
                    sql.SQL(',').join(sql.Identifier('a', table) for table in tables)))
        original(self)

    integration.Integration.setUp = isolated_set_up
    suite = unittest.defaultTestLoader.loadTestsFromNames([
        'test_integration', 'test_notice', 'test_leader_reports', 'test_combined_reports'])
    try:
        result = unittest.TextTestRunner(verbosity=2).run(suite)
        print('TEST_DATABASE', name)
        return 0 if result.wasSuccessful() else 1
    finally:
        integration.s.pg_storage.close_pools()


if __name__ == '__main__':
    raise SystemExit(main())
