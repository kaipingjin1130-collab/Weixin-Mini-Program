"""Seed only the verified project memberships in a new local acceptance database."""
import os
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT.parent / '.local' / 'identity-uat'


def main():
    # No caller-supplied database, credentials or outbound integrations are inherited.
    for key in list(os.environ):
        if key.startswith('QAXC_'):
            del os.environ[key]
    os.environ['QAXC_DATA'] = str(TARGET)
    if (TARGET / 'inspections.sqlite3').exists():
        raise SystemExit('Acceptance database already exists; preserved without changes.')
    snapshot = json.loads((TARGET.parent / 'identity-uat-channel' / 'project.json').read_text(encoding='utf-8'))
    assert snapshot['verifiedReadOnly'] is True
    assert all(person['role'] in ('manager', 'inspector') for person in snapshot['members'])
    sys.path.insert(0, str(ROOT / 'candidate'))
    import server
    assert not server.pg_storage.enabled()
    server.init()
    with server.db() as c:
        pid = snapshot['id']
        c.execute('INSERT INTO projects VALUES(?,?,?,?)',
                  (pid, snapshot['name'] + '【本机验收】', '本机验收；未复制正式合同或业务数据', server.now()))
        for person in snapshot['members']:
            uid, name, role = person['id'], person['name'], person['role']
            server.host_auth.register(c, dict(id=uid, username=uid, name=name))
            c.execute('INSERT INTO memberships VALUES(?,?,?)', (pid, uid, role))
    print('Created local acceptance project from verified memberships; 0 tasks.')


if __name__ == '__main__':
    main()
