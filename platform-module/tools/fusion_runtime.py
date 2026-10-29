"""Local fusion acceptance runtime. Identity is a labelled fixture; business services are real."""
import json
import os
from pathlib import Path
import secrets
import sys
import time
from http.cookies import SimpleCookie

ROOT = Path(__file__).resolve().parents[2]
B = ROOT / 'b-risk-knowledge'
LOCAL = ROOT / '.local/fusion-integration'
LOCAL.mkdir(parents=True, exist_ok=True)
keys_file = LOCAL / 'keys.json'
if not keys_file.exists():
    keys_file.write_text(json.dumps({'a': secrets.token_hex(32), 'b': secrets.token_hex(32)}), encoding='utf-8')
keys = json.loads(keys_file.read_text(encoding='utf-8'))
os.environ.update(A_TO_B_KEY=keys['a'], B_TO_A_KEY=keys['b'], A_ORG_ID='fusion-test',
    A_INTERNAL_BASE='http://127.0.0.1:18771/quality', B_AUTH_MODE='a', B_ENV='development')
mode = sys.argv[1]
if mode in {'a', 'unified'}:
    os.environ.update(QAXC_DATA=str(LOCAL / 'a-data'), QAXC_ROOT_PATH='/quality',
        QAXC_PASSWORD=secrets.token_hex(32), QAXC_B_URL='http://127.0.0.1:18187',
        QAXC_B_STATIC=str(ROOT / 'platform-module/b-web'))
    sys.path.insert(0, str(ROOT / 'platform-module/candidate'))
    import server
    # This fixture listens only on loopback HTTP. Production retains Secure
    # cookies; use a separate name so local testing cannot replace A's session.
    server.COOKIE_SECURE = ''
    server.COOKIE_NAME = 'qaxc_fusion_session'
    from server import host_auth
    def fixture(action, data=None, cookie=''):
        if action == 'session':
            # Automatic entry exists only in this loopback test runtime. Keep
            # an explicitly selected test member when opening another module.
            cookies = SimpleCookie(cookie)
            token = cookies[server.COOKIE_NAME].value if server.COOKIE_NAME in cookies else ''
            with server.SESSION_LOCK:
                existing = server.SESSION_USERS.get(token) if server.SESSIONS.get(token, 0) > time.time() else None
            data = {'id': existing['id']} if existing else {'id': 'host:admin:900001'}
        if action == 'login' and (data or {}).get('password') != 'fusion-test-only':
            raise host_auth.AuthError('测试账号或密码不正确', 401)
        if action == 'identity' and (data or {}).get('id') not in {'host:admin:900001', 'host:admin:900002'}:
            raise host_auth.AuthError('测试身份无效', 401)
        member = (data or {}).get('id') == 'host:admin:900002' or (data or {}).get('username') == 'fusion-member'
        return {'aud': 'qaxc', 'active': True, 'id': 'host:admin:900002' if member else 'host:admin:900001', 'name': '融合验收普通成员' if member else '融合验收测试管理员', 'isAdmin': not member}
    host_auth.enabled = lambda: True
    host_auth.call = fixture
    if mode == 'unified':
        os.environ.update(QAXC_PORT='18771', QAXC_B_URL='http://127.0.0.1:18771/__knowledge')
        sys.path.insert(0, str(ROOT / 'platform-module'))
        from run_platform import configure
        configure()
        import uvicorn
        uvicorn.run('fusion_app:app', host='127.0.0.1', port=18771, proxy_headers=False, access_log=False)
        raise SystemExit(0)
    server.init()
    print('A test runtime on 18771; fixture identity, isolated data.', flush=True)
    server.ThreadingHTTPServer(('127.0.0.1', 18771), server.Handler).serve_forever()
else:
    os.chdir(B)
    sys.path.insert(0, str(B))
    if mode == 'init':
        from alembic.config import Config
        from alembic import command
        command.upgrade(Config('alembic.ini'), 'head')
        from backend.initialize import main
        main()
    elif mode == 'api':
        import uvicorn
        uvicorn.run('backend.app:app', host='127.0.0.1', port=18187, access_log=False)
    elif mode == 'worker':
        import runpy
        runpy.run_module('backend.worker', run_name='__main__')
    else:
        raise ValueError('Expected a, init, api, worker')
