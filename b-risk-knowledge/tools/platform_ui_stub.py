"""Loopback-only UI fixture; contains no real identities or credentials."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
import json
import mimetypes

DIST = Path(__file__).resolve().parents[1] / 'frontend' / 'dist'


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        path = urlsplit(self.path).path
        if path.startswith('/quality/b/api/v1/'):
            endpoint = path.removeprefix('/quality/b/api/v1/')
            data = {'me': {'id': 'demo-user-001', 'name': '测试用户', 'subject': 'demo-user-001', 'mode': 'a',
                           'projects': [{'id': 'demo-project-001', 'name': '测试项目', 'roles': [], 'can_run': False, 'can_manage': False}]},
                    'health': {'worker_online': True},
                    'knowledge/library': {'items': [], 'next_cursor': None}}
            body = json.dumps(data.get(endpoint, {'items': [], 'next_cursor': None}), ensure_ascii=False).encode('utf-8')
            self.send_response(200); self.send_header('Content-Type', 'application/json; charset=utf-8')
        elif path == '/quality/api/csrf-token':
            body = b'{"csrf_token":"fixture-only"}'
            self.send_response(200); self.send_header('Content-Type', 'application/json')
        elif path.startswith('/quality/b/'):
            relative = path.removeprefix('/quality/b/') or 'index.html'
            target = (DIST / relative).resolve()
            if not target.is_relative_to(DIST.resolve()) or not target.is_file():
                self.send_error(404); return
            body = target.read_bytes()
            self.send_response(200); self.send_header('Content-Type', mimetypes.guess_type(target.name)[0] or 'application/octet-stream')
        else:
            self.send_error(404); return
        self.send_header('Content-Length', str(len(body))); self.end_headers(); self.wfile.write(body)


if __name__ == '__main__':
    ThreadingHTTPServer(('127.0.0.1', 18765), Handler).serve_forever()
