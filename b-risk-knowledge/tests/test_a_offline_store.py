import io
import json
import sqlite3
from pathlib import Path
import pytest
from backend.integrations.a.offline_store import save_export

FIXTURES = Path(__file__).resolve().parent / 'fixtures/a-export'


def test_offline_ledger_replay_conflict_and_verified_zip():
    raw = (FIXTURES / 'completed-task-demo.json').read_bytes()
    snapshot = json.loads(raw)
    delivery = snapshot['task']['deliveries'][-1]['id']
    kwargs = {'delivery_id': delivery, 'org_id': 'demo-org', 'project_id': snapshot['project']['id'], 'is_demo': True}
    db = sqlite3.connect(':memory:')
    try:
        first = save_export(db, io.BytesIO(raw), **kwargs)
        assert not first['replayed'] and first['verified_attachment_ids'] == []
        second = save_export(db, FIXTURES / 'completed-task-demo.zip', **kwargs)
        assert second['replayed'] and second['verified_attachment_ids'] == [snapshot['evidence'][0]['id']]
        row = db.execute('SELECT raw_snapshot, adapter_version, package_hash FROM offline_a_exports').fetchone()
        assert row[0] == raw and row[1] == 'a-offline/1.0' and row[2] == first['content_hash']
        snapshot['task']['title'] = '改变的内容'
        changed = json.dumps(snapshot, ensure_ascii=False).encode('utf-8')
        with pytest.raises(ValueError, match='conflicts'):
            save_export(db, io.BytesIO(changed), **kwargs)
        assert db.execute('SELECT count(*) FROM offline_a_exports').fetchone()[0] == 1
    finally:
        db.close()


def test_offline_ledger_rejects_wrong_delivery():
    raw = (FIXTURES / 'completed-task-demo.json').read_bytes()
    project = json.loads(raw)['project']['id']
    db = sqlite3.connect(':memory:')
    try:
        with pytest.raises(ValueError, match='delivery reference'):
            save_export(db, io.BytesIO(raw), delivery_id='other', org_id='demo-org', project_id=project, is_demo=True)
    finally:
        db.close()
