"""Temporary loopback gateway; production credentials never leave the server."""
import collections
import hmac
from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os
from pathlib import Path
import subprocess
import time
from urllib.error import HTTPError
from urllib.request import Request, build_opener, ProxyHandler, HTTPRedirectHandler


ALLOWED = {'host:admin:41', 'host:admin:42'}


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
                if action == 'identity' and payload.get('id') not in ALLOWED:
                    return self.respond(403, {'active': False})
                if action == 'login':
                    while attempts and attempts[0] < time.monotonic() - 60:
                        attempts.popleft()
                    if len(attempts) >= 10:
                        return self.respond(429, {'active': False})
                    attempts.append(time.monotonic())
                    payload = {name: payload.get(name, '') for name in ('username', 'password')}
                request = Request(upstream + '/' + action, json.dumps(payload).encode(),
                                  {'Content-Type': 'application/json', 'X-Qaxc-Service-Key': key})
                with opener.open(request, timeout=8) as response:
                    result = json.loads(response.read(65536))
                if result.get('id') not in ALLOWED or result.get('active') is not True or result.get('aud') != 'qaxc':
                    return self.respond(403, {'active': False})
                return self.respond(200, dict(id=result['id'], name=result['name'], active=True, aud='qaxc', isAdmin=False))
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
