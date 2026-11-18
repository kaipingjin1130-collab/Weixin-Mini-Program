"""Loopback HTTP transport over an expiring, forced-command-only SSH key."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import hmac
import json
from pathlib import Path
import subprocess
import time

FOLDER = Path(__file__).resolve().parents[2] / '.local' / 'identity-uat-channel'


def ssh_args():
    return ['ssh', '-T', '-i', str(FOLDER / 'id_ed25519'),
            '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes',
            '-o', 'StrictHostKeyChecking=yes',
            '-o', 'UserKnownHostsFile=' + str(FOLDER / 'known_hosts'),
            '-o', 'ConnectTimeout=5', '-o', 'ForwardAgent=no',
            '-o', 'ClearAllForwardings=yes', 'ubuntu@101.34.72.70']


def main():
    config = json.loads((FOLDER / 'config.json').read_text())

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def do_POST(self):
            if time.time() >= config['expires'] or not hmac.compare_digest(
                    self.headers.get('X-Qaxc-Service-Key', ''), config['token']):
                self.send_error(403)
                return
            if self.path not in ('/internal/qaxc/identity', '/internal/qaxc/login'):
                self.send_error(404)
                return
            try:
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 < length <= 4096:
                    self.send_error(400)
                    return
                body = self.rfile.read(length)
                request = (f'POST {self.path} HTTP/1.0\r\nHost: 127.0.0.1\r\n'
                           f'Content-Type: application/json\r\nContent-Length: {length}\r\n'
                           f'X-Qaxc-Service-Key: {config["token"]}\r\n\r\n').encode() + body
                proc = subprocess.run(ssh_args(), input=request, capture_output=True, timeout=12,
                                      creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
                if proc.returncode or not proc.stdout.startswith(b'HTTP/1.'):
                    raise ValueError('Identity channel unavailable')
                self.wfile.write(proc.stdout)
                self.close_connection = True
            except Exception:
                self.send_error(503, 'Identity channel unavailable')

    server = ThreadingHTTPServer(('127.0.0.1', 18819), Handler)
    server.timeout = 1
    while time.time() < config['expires']:
        server.handle_request()
    server.server_close()


if __name__ == '__main__':
    main()
