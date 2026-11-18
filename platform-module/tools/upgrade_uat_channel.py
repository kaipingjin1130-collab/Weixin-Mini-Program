"""Update only the existing expiring gateway, preserving keys, deadline and production."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time
from urllib.request import Request, build_opener, ProxyHandler

FOLDER = Path('/opt/qaxc-identity-uat-20261118')
UNIT = 'qaxc-identity-uat-gateway.service'


def main(source):
    assert os.geteuid() == 0
    config = json.loads((FOLDER / 'config.json').read_text())
    assert time.time() + 60 < config['expires'], 'Channel expired or near expiry'
    compile(source, 'uat_identity_gateway.py', 'exec')
    def production_pids():
        return subprocess.check_output(['systemctl', 'show', 'qaxc-test.service',
            'qaxc-b-worker.service', 'postgresql@16-qaxcb.service', '-p', 'MainPID'], text=True)
    before = production_pids()
    path = FOLDER / 'uat_identity_gateway.py'
    original = path.read_bytes()
    def replace(data):
        pending = FOLDER / 'uat_identity_gateway.py.pending'
        pending.write_bytes(data)
        pending.chmod(0o644)
        pending.replace(path)
        subprocess.run(['systemctl', 'restart', UNIT], check=True)
    try:
        replace(source.encode())
        opener = build_opener(ProxyHandler({}))
        for attempt in range(10):
            try:
                request = Request('http://127.0.0.1:18819/internal/qaxc/identity',
                    json.dumps({'id': 'host:admin:41'}).encode(),
                    {'Content-Type': 'application/json', 'X-Qaxc-Service-Key': config['token']})
                with opener.open(request, timeout=8) as response:
                    result = json.loads(response.read(65536))
                assert result['isAdmin'] is False and result['projectAccess']['source'] == 'a.memberships'
                break
            except Exception:
                if attempt == 9: raise RuntimeError('Gateway verification failed') from None
                time.sleep(0.2)
        assert production_pids() == before, 'Production service process changed unexpectedly'
        assert json.loads((FOLDER / 'config.json').read_text()) == config
        assert subprocess.run(['systemctl', 'is-active', '--quiet', 'qaxc-identity-uat-expiry.timer']).returncode == 0
    except Exception:
        replace(original)
        raise RuntimeError('Temporary gateway update failed; original restored') from None
    projects = result['projectAccess']['projects']
    print(json.dumps(dict(updated=True, sha256=hashlib.sha256(path.read_bytes()).hexdigest(),
        expires=config['expires'], productionPidsUnchanged=True, projects=len(projects),
        memberships=sum(len(p['members']) for p in projects))))


if __name__ == '__main__':
    main(json.load(sys.stdin)['source'])
