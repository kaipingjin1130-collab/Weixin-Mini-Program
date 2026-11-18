"""Temporary loopback gateway; production credentials never leave the server."""
import collections
import hmac
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
import re
from pathlib import Path
import subprocess
import time
from urllib.error import HTTPError
from urllib.request import Request, build_opener, ProxyHandler, HTTPRedirectHandler


SUBJECT = re.compile(r'host:admin:[1-9][0-9]*\Z')
# Fixed, minimal projection. Never accept SQL, database names or roles from requests.
PERMISSION_QUERY = """
import json, os, psycopg
with psycopg.connect(os.environ['QAXC_DB_URL'], connect_timeout=2,
                    options='-c default_transaction_read_only=on -c statement_timeout=2000') as c:
    with c.cursor() as cur:
        cur.execute('SET TRANSACTION READ ONLY')
        cur.execute("SELECT p.id,p.name,u.id,m.role FROM a.memberships m "
                    "JOIN a.users u ON u.id=m.user_id JOIN a.projects p ON p.id=m.project_id "
                    "WHERE u.id ~ '^host:admin:[1-9][0-9]*$' ORDER BY p.id,u.id LIMIT 2001")
        rows=cur.fetchall()
        if len(rows)>2000: raise ValueError('Acceptance roster too large')
        print(json.dumps(rows,ensure_ascii=False))
"""


def valid_identity(result, expected=None):
    return (isinstance(result, dict) and isinstance(result.get('id'), str)
            and SUBJECT.fullmatch(result['id']) and result.get('active') is True
            and result.get('aud') == 'qaxc' and (expected is None or result['id'] == expected))


def project_access(python, env, actor, identity_lookup):
    """The source A membership table is authoritative; identity alone grants nothing."""
    output = subprocess.check_output([python, '-c', PERMISSION_QUERY], env=env,
                                     timeout=4, stderr=subprocess.DEVNULL)
    if len(output) > 58000:
        raise ValueError('Acceptance roster too large')
    rows = json.loads(output)
    users = {actor['id']: actor}
    projects = {}
    for pid, project_name, uid, role in rows:
        if uid not in users:
            users[uid] = identity_lookup(uid)
        person = users[uid]
        if not valid_identity(person, uid):
            continue
        project = projects.setdefault(pid, dict(id=pid, name=project_name, members=[]))
        project['members'].append(dict(id=uid, name=person.get('name') or uid, role=role))
    snapshot = dict(source='a.memberships', version=1, checkedAt=time.time(), projects=list(projects.values()))
    if len(json.dumps(snapshot, ensure_ascii=False).encode()) > 58000:
        raise ValueError('Acceptance roster too large')
    return snapshot


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def main():
    folder = Path(__file__).resolve().parent
    config = json.loads((folder / 'config.json').read_text())
    deadline = config['expires']
    pid = subprocess.check_output(['systemctl', 'show', 'qaxc-test', '-p', 'MainPID', '--value'], text=True).strip()
    env = dict(item.decode().split('=', 1) for item in Path('/proc/' + pid + '/environ').read_bytes().split(b'\0') if b'=' in item)
    upstream = env['QAXC_AUTH_URL'].rstrip('/')
    if upstream != 'http://172.21.0.2:18082/internal/qaxc':
        raise SystemExit('Unexpected identity upstream')
    key = env['QAXC_AUTH_KEY']
    python = Path('/proc/' + pid + '/cmdline').read_bytes().split(b'\0')[0].decode()
    attempts = collections.deque()
    opener = build_opener(ProxyHandler({}), NoRedirect())

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def respond(self, status, value):
            data = json.dumps(value, ensure_ascii=False).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def do_POST(self):
            if time.time() >= deadline or not hmac.compare_digest(self.headers.get('X-Qaxc-Service-Key', ''), config['token']):
                return self.respond(403, {'active': False})
            action = self.path.removeprefix('/internal/qaxc/')
            if self.path != '/internal/qaxc/' + action or action not in ('identity', 'login'):
                return self.respond(404, {'active': False})
            try:
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 < length <= 4096:
                    return self.respond(400, {'active': False})
                payload = json.loads(self.rfile.read(length))
                if not isinstance(payload, dict):
                    return self.respond(400, {'active': False})
                if action == 'identity' and not SUBJECT.fullmatch(str(payload.get('id', ''))):
                    return self.respond(403, {'active': False})
                if action == 'identity':
                    payload = {'id': payload['id']}
                if action == 'login':
                    while attempts and attempts[0] < time.monotonic() - 60:
                        attempts.popleft()
                    if len(attempts) >= 10:
                        return self.respond(429, {'active': False})
                    attempts.append(time.monotonic())
                    payload = {name: payload.get(name, '') for name in ('username', 'password')}
                until = time.monotonic() + 6
                request = Request(upstream + '/' + action, json.dumps(payload).encode(),
                                  {'Content-Type': 'application/json', 'X-Qaxc-Service-Key': key})
                with opener.open(request, timeout=3) as response:
                    result = json.loads(response.read(65536))
                if not valid_identity(result, payload.get('id') if action == 'identity' else None):
                    return self.respond(403, {'active': False})
                def lookup(uid):
                    remaining = until - time.monotonic()
                    if remaining <= 0: raise TimeoutError('Permission check timed out')
                    req = Request(upstream + '/identity', json.dumps({'id': uid}).encode(),
                                  {'Content-Type': 'application/json', 'X-Qaxc-Service-Key': key})
                    try:
                        with opener.open(req, timeout=min(2, remaining)) as res:
                            return json.loads(res.read(65536))
                    except HTTPError as error:
                        if error.code in (401, 403, 404): return {'active': False}
                        raise
                access = project_access(python, env, result, lookup)
                if time.monotonic() >= until: raise TimeoutError('Permission check timed out')
                return self.respond(200, dict(id=result['id'], name=result['name'], active=True, aud='qaxc',
                                             isAdmin=False, projectAccess=access))
            except HTTPError as error:
                return self.respond(401 if error.code in (401, 403) else 503, {'active': False})
            except Exception:
                return self.respond(503, {'active': False})

    server = HTTPServer(('127.0.0.1', 18819), Handler)
    server.timeout = 1
    while time.time() < deadline:
        server.handle_request()
    server.server_close()


if __name__ == '__main__':
    main()
