"""Run one platform API plus the shared durable worker; configure via environment."""
import os
from pathlib import Path
import runpy
import sys

ROOT = Path(__file__).resolve().parents[1]


def configure():
    port = int(os.environ.get('QAXC_PORT', '18765'))
    if not 1 <= port <= 65535:
        raise ValueError('Invalid QAXC_PORT')
    prefix = os.environ.setdefault('QAXC_ROOT_PATH', '/quality').rstrip('/')
    if prefix != '/quality':
        raise RuntimeError('The unified browser build uses /quality; keep its public prefix stable.')
    if os.environ.get('B_ENV') == 'production' and not all(os.environ.get(k) for k in ('QAXC_AUTH_URL','QAXC_AUTH_KEY')):
        raise RuntimeError('Production requires the configured host identity service.')
    os.environ.setdefault('B_AUTH_MODE', 'a')
    os.environ.setdefault('A_INTERNAL_BASE', f'http://127.0.0.1:{port}{prefix}')
    os.environ.setdefault('QAXC_B_URL', f'http://127.0.0.1:{port}/__knowledge')
    os.environ.setdefault('QAXC_B_STATIC', str(ROOT / 'platform-module/b-web'))
    sys.path.insert(0, str(ROOT / 'b-risk-knowledge'))
    sys.path.insert(0, str(ROOT / 'platform-module'))
    os.chdir(ROOT / 'b-risk-knowledge')
    return port


def main():
    port = configure()
    mode = sys.argv[1] if len(sys.argv) == 2 else ''
    if mode == 'api':
        import uvicorn
        # No forwarded client-IP trust: internal routes must originate on loopback.
        # Exactly one API worker owns the existing in-memory platform sessions.
        uvicorn.run('fusion_app:app', host='127.0.0.1', port=port, proxy_headers=False, access_log=False)
    elif mode == 'worker':
        runpy.run_module('backend.worker', run_name='__main__')
    elif mode == 'init':
        from alembic import command
        from alembic.config import Config
        command.upgrade(Config('alembic.ini'), 'head')
        runpy.run_module('backend.initialize', run_name='__main__')
        sys.path.insert(0, str(ROOT / 'platform-module/candidate'))
        import server
        server.init()
    else:
        raise SystemExit('Usage: python platform-module/run_platform.py init|api|worker')


if __name__ == '__main__':
    main()
