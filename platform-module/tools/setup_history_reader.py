"""Provision only a dedicated SELECT role. Never migrate or initialize history data."""
import json
from pathlib import Path
import secrets

import psycopg
from psycopg import sql
from sqlalchemy.engine import make_url

ROOT = Path(__file__).resolve().parents[2]
TABLES = ('history_documents', 'history_imports', 'history_findings', 'history_evidence',
          'history_images', 'history_image_occurrences', 'history_image_links', 'file_assets')
ROLE = 'ab_history_reader'


def main():
    target = ROOT / 'b-risk-knowledge/.local/history-reader.json'
    if target.exists():
        print('Reader configuration exists; no credential or grant changes.')
        return
    config = json.loads((ROOT / 'b-risk-knowledge/.local/config.json').read_text(encoding='utf-8'))
    url = make_url(config['database_url']).set(database='risk_history_20261102_v4')
    password = secrets.token_hex(32)
    with psycopg.connect(url.set(drivername='postgresql').render_as_string(hide_password=False), connect_timeout=5) as db:
        if db.execute('SELECT 1 FROM pg_roles WHERE rolname=%s', (ROLE,)).fetchone():
            raise RuntimeError('Reader role already exists without configuration; reconcile before provisioning.')
        db.execute(sql.SQL('CREATE ROLE {} LOGIN PASSWORD {} NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION CONNECTION LIMIT 3').format(sql.Identifier(ROLE), sql.Literal(password)))
        db.execute(sql.SQL('GRANT CONNECT ON DATABASE {} TO {}').format(sql.Identifier(url.database), sql.Identifier(ROLE)))
        db.execute(sql.SQL('GRANT USAGE ON SCHEMA public TO {}').format(sql.Identifier(ROLE)))
        db.execute(sql.SQL('GRANT SELECT ON {} TO {}').format(sql.SQL(',').join(sql.Identifier('public', t) for t in TABLES), sql.Identifier(ROLE)))
        for setting, value in [('default_transaction_read_only', 'on'), ('statement_timeout', '5000'), ('lock_timeout', '500'), ('idle_in_transaction_session_timeout', '10000')]:
            db.execute(sql.SQL('ALTER ROLE {} SET {} = {}').format(sql.Identifier(ROLE), sql.Identifier(setting), sql.Literal(value)))
    reader = url.set(username=ROLE, password=password).render_as_string(hide_password=False)
    # This credential is local only and is never returned by an HTTP endpoint.
    value = {'database_url': reader, 'storage': str(ROOT / 'b-risk-knowledge/.local/history-storage'),
             'allowed_identities': [{'org_id': 'fusion-test', 'subject': 'host:admin:900001'}]}
    target.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
    print('Dedicated SELECT-only role and local reader configuration created.')


if __name__ == '__main__':
    main()
