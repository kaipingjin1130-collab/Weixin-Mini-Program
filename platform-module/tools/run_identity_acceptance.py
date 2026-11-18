"""Start only the local acceptance backend and restricted identity transport."""
import json
import os
from pathlib import Path
import subprocess
import sys
import time

from start_identity_uat import settings

TOOLS = Path(__file__).resolve().parent
CHANNEL = TOOLS.parents[1] / '.local' / 'identity-uat-channel'


def main():
    config = json.loads((CHANNEL / 'config.json').read_text())
    if time.time() >= config['expires']:
        raise SystemExit('验收认证通道已到期，需重新授权。')
    env = settings(dict(os.environ, QAXC_UAT_AUTH_URL='http://127.0.0.1:18819/internal/qaxc',
                        QAXC_UAT_AUTH_KEY=config['token']))
    children = []
    try:
        for script, args in ((TOOLS / 'uat_local_channel.py', []),
                             (TOOLS.parent / 'candidate' / 'server.py', ['--host', '127.0.0.1', '--port', '18818'])):
            children.append(subprocess.Popen([sys.executable, str(script), *args], env=env,
                            cwd=TOOLS.parent, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0)))
        (CHANNEL / 'local-pids.json').write_text(json.dumps([os.getpid(), *[p.pid for p in children]]))
        while time.time() < config['expires'] and all(p.poll() is None for p in children):
            time.sleep(1)
    finally:
        for child in children:
            if child.poll() is None:
                child.terminate()
            child.wait(timeout=10)


if __name__ == '__main__':
    main()
