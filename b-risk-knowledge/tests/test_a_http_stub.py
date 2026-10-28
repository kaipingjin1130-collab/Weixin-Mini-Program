"""Loopback HTTP fixture for A delivery and attachment service paths."""
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.parse import urlsplit, parse_qs
import pytest
from backend.integrations.a.client import AClient, AClientError
from backend.integrations.a.registry import SourceRegistration

ROOT = Path(__file__).resolve().parent / 'fixtures/a-export'


def test_real_http_fixture_end_to_end():
    raw = (ROOT / 'completed-task-demo.json').read_bytes()
    source = json.loads(raw)
    evidence = source['evidence'][0]
    delivery = source['task']['deliveries'][-1]
    import zipfile
    with zipfile.ZipFile(ROOT / 'completed-task-demo.zip') as archive:
        photo = archive.read(evidence['packagePath'])
    state = {'withdrawn': False, 'requests': []}
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            url = urlsplit(self.path)
            state['requests'].append((url.path, parse_qs(url.query), self.headers.get('X-AB-Session')))
            if self.headers.get('Authorization') != 'Bearer fixture-service-key':
                self.send_response(401); self.end_headers(); return
            if '/delivery-meta/' in url.path:
                data = {'source_system': 'a', 'org_id': 'demo-org', 'project_id': source['project']['id'],
                        'task_id': source['task']['id'], 'delivery_id': delivery['id'], 'delivery_version': delivery['version'],
                        'eligible': True, 'ineligible_reason': None, 'withdrawn': state['withdrawn'],
                        'withdrawn_at': None, 'withdraw_reason': None, 'is_demo': True}
                content = json.dumps(data).encode()
            elif '/snapshot/' in url.path:
                content = raw
            elif '/evidence-meta/' in url.path:
                content = json.dumps({k: evidence[k] for k in ('id', 'name', 'mime', 'size', 'sha256')}).encode()
            elif '/evidence/' in url.path:
                content = photo
            else:
                self.send_response(404); self.end_headers(); return
            self.send_response(200); self.send_header('Content-Length', str(len(content)))
            self.end_headers(); self.wfile.write(content)
        def log_message(self, *args):
            pass
    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    thread = Thread(target=server.serve_forever, daemon=True); thread.start()
    registry = SourceRegistration.from_config({'source_system': 'a', 'org_id': 'demo-org',
        'project_ids': [source['project']['id']], 'allowed_actions': ['delivery.meta', 'delivery.snapshot', 'delivery.attachment'], 'enabled': True})
    client = AClient(f'http://127.0.0.1:{server.server_port}/quality', 'fixture-service-key', registration=registry)
    scope = {'org_id': 'demo-org', 'project_id': source['project']['id'], 'task_id': source['task']['id'], 'version': delivery['version']}
    try:
        _, result, _ = client.prepare(delivery['id'], **scope)
        assert result['raw_snapshot'] == source
        assert client.attachment(delivery['id'], evidence, org_id='demo-org', project_id=source['project']['id']) == photo
        assert all(session is None for _, _, session in state['requests'])
        assert state['requests'][-1][1]['deliveryId'] == [delivery['id']]
        state['withdrawn'] = True
        with pytest.raises(AClientError) as error:
            client.prepare(delivery['id'], **scope)
        assert error.value.status == 410
    finally:
        client.close(); server.shutdown(); server.server_close(); thread.join(timeout=5)
