"""Offline-only immutable import ledger; it is not an online queue or authorization source."""
import hashlib
import json
import sqlite3
from .mapping import convert
from .offline import read_export

SCHEMA = '''CREATE TABLE IF NOT EXISTS offline_a_exports (
    source_system TEXT NOT NULL,
    delivery_id TEXT NOT NULL,
    delivery_version INTEGER NOT NULL,
    org_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    task_id TEXT NOT NULL,
    source_content_sha256 TEXT NOT NULL,
    raw_sha256 TEXT NOT NULL,
    raw_snapshot BLOB NOT NULL,
    adapter_version TEXT NOT NULL,
    source_schema_version TEXT NOT NULL,
    contract_version TEXT NOT NULL,
    package_json TEXT NOT NULL,
    package_hash TEXT NOT NULL,
    verified_attachment_ids TEXT NOT NULL,
    PRIMARY KEY(source_system, delivery_id, delivery_version)
)'''


def save_export(db, file, *, delivery_id, org_id, project_id, is_demo):
    """Persist one validated source, returning a stable result for identical repeats."""
    raw, source, verified = read_export(file)
    mapped = convert(raw, source, org_id=org_id, project_id=project_id, is_demo=is_demo)
    version = source['version']
    deliveries = source['task'].get('deliveries', [])
    if not isinstance(delivery_id, str) or not any(
        d.get('id') == delivery_id and d.get('version') == version for d in deliveries
    ):
        raise ValueError('delivery reference does not match snapshot')
    encoded = json.dumps(source, ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False).encode('utf-8')
    source_digest = hashlib.sha256(encoded).hexdigest()
    package_json = json.dumps(mapped['package'], ensure_ascii=False, sort_keys=True, separators=(',', ':'), allow_nan=False)
    db.execute(SCHEMA)
    # One transaction serializes concurrent imports and leaves the prior record intact on failure.
    with db:
        db.execute('BEGIN IMMEDIATE')
        prior = db.execute('SELECT org_id, project_id, task_id, source_content_sha256, package_hash, verified_attachment_ids '
                           'FROM offline_a_exports WHERE source_system=? AND delivery_id=? AND delivery_version=?',
                           ('a', delivery_id, version)).fetchone()
        if prior:
            if prior[:5] != (org_id, project_id, source['task']['id'], source_digest, mapped['content_hash']):
                raise ValueError('delivery version conflicts with stored content or scope')
            # A verified ZIP may add evidence verification to an earlier JSON-only record.
            verified = sorted(set(json.loads(prior[5])) | set(verified))
            db.execute('UPDATE offline_a_exports SET verified_attachment_ids=? '
                       'WHERE source_system=? AND delivery_id=? AND delivery_version=?',
                       (json.dumps(verified), 'a', delivery_id, version))
            return {'delivery_id': delivery_id, 'delivery_version': version, 'replayed': True,
                    'content_hash': mapped['content_hash'], 'verified_attachment_ids': verified}
        db.execute('INSERT INTO offline_a_exports VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                   ('a', delivery_id, version, org_id, project_id, source['task']['id'], source_digest,
                    mapped['raw_sha256'], raw, mapped['adapter_version'], mapped['source_schema_version'],
                    mapped['contract_version'], package_json, mapped['content_hash'], json.dumps(sorted(verified))))
    return {'delivery_id': delivery_id, 'delivery_version': version, 'replayed': False,
            'content_hash': mapped['content_hash'], 'verified_attachment_ids': sorted(verified)}
