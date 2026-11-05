"""Provision the least-privilege writer for the 历史报告 editable review feature.

Creates/updates review tables and a dedicated role, then writes a local
`.local/history-review.json` with the writer URL. Idempotent: if the
configuration exists it reports and exits without changing credentials.
"""
import json
import secrets
from pathlib import Path

import psycopg
from psycopg import sql
from sqlalchemy.engine import make_url

ROOT = Path(__file__).resolve().parents[2]
ROLE = 'ab_history_editor'
TABLES_SELECT = ('history_documents', 'history_imports', 'history_findings',
                 'history_current_consolidated_findings', 'history_image_links',
                 'history_image_occurrences')
TABLES_WRITE = ('history_review_drafts', 'history_review_logs')

DDL = '''
CREATE TABLE IF NOT EXISTS history_review_drafts (
    id varchar(36) PRIMARY KEY,
    finding_id varchar(36) NOT NULL,
    document_id varchar(36),
    changes jsonb NOT NULL,
    old_values jsonb NOT NULL DEFAULT '{}'::jsonb,
    status varchar(16) NOT NULL DEFAULT 'pending',
    actor text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_history_review_drafts_pending
    ON history_review_drafts(finding_id) WHERE status='pending';
CREATE TABLE IF NOT EXISTS history_review_logs (
    id varchar(36) PRIMARY KEY,
    finding_id varchar(36) NOT NULL,
    document_id varchar(36),
    action varchar(16) NOT NULL,
    changes jsonb,
    old_values jsonb,
    actor text,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_history_review_logs_finding ON history_review_logs(finding_id);
'''


def main():
    target = ROOT / 'b-risk-knowledge/.local/history-review.json'
    if target.exists():
        print('History review configuration exists; no credential or grant changes.')
        return
    config = json.loads((ROOT / 'b-risk-knowledge/.local/config.json').read_text(encoding='utf-8'))
    url = make_url(config['database_url']).set(database='risk_history_20261102_v4')
    password = secrets.token_hex(32)
    with psycopg.connect(url.set(drivername='postgresql').render_as_string(hide_password=False), connect_timeout=5) as db:
        for statement in [s.strip() for s in DDL.split(';') if s.strip()]:
            db.execute(statement)
        if db.execute('SELECT 1 FROM pg_roles WHERE rolname=%s', (ROLE,)).fetchone():
            raise RuntimeError('Editor role already exists without configuration; reconcile before provisioning.')
        db.execute(sql.SQL('CREATE ROLE {} LOGIN PASSWORD {} NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION CONNECTION LIMIT 3').format(sql.Identifier(ROLE), sql.Literal(password)))
        db.execute(sql.SQL('GRANT CONNECT ON DATABASE {} TO {}').format(sql.Identifier(url.database), sql.Identifier(ROLE)))
        db.execute(sql.SQL('GRANT USAGE ON SCHEMA public TO {}').format(sql.Identifier(ROLE)))
        db.execute(sql.SQL('GRANT SELECT ON {} TO {}').format(sql.SQL(',').join(sql.Identifier('public', t) for t in TABLES_SELECT), sql.Identifier(ROLE)))
        db.execute(sql.SQL('GRANT SELECT, INSERT, UPDATE ON {} TO {}').format(sql.SQL(',').join(sql.Identifier('public', t) for t in TABLES_WRITE), sql.Identifier(ROLE)))
        db.execute(sql.SQL('GRANT UPDATE ON {} TO {}').format(sql.Identifier('public', 'history_findings'), sql.Identifier(ROLE)))
        for setting, value in [('statement_timeout', '15000'), ('lock_timeout', '3000'), ('idle_in_transaction_session_timeout', '30000')]:
            db.execute(sql.SQL('ALTER ROLE {} SET {} = {}').format(sql.Identifier(ROLE), sql.Identifier(setting), sql.Literal(value)))
    editor = url.set(username=ROLE, password=password).render_as_string(hide_password=False)
    value = {'database_url': editor,
             'allowed_identities': [{'org_id': 'fusion-test', 'subject': 'host:admin:900001'}]}
    target.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
    print('Dedicated editor role, review tables and local configuration created.')


if __name__ == '__main__':
    main()
