"""One ASGI API process for the existing workflow and knowledge modules.

The legacy handler remains the contract boundary for mobile clients. It runs in
a bounded thread pool; authority callbacks have a separate pool so a request
waiting for knowledge cannot exhaust the threads needed to validate identity.
"""
from contextlib import asynccontextmanager
from email.message import Message
import hmac
import io
import os
from pathlib import Path
import sys

import anyio
from starlette.applications import Starlette
from starlette.responses import Response, JSONResponse
from starlette.routing import Mount, Route

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'platform-module/candidate'))
sys.path.insert(0, str(ROOT / 'b-risk-knowledge'))
import server
from backend.app import app as knowledge_app
from backend.config import settings


class CapturedHandler(server.Handler):
    """Reuse the HTTP contracts without opening a second listening socket."""
    def __init__(self, method, path, headers, body, peer):
        self.command, self.path = method, path
        self.headers = Message()
        for key, value in headers:
            self.headers[key] = value
        self.client_address = (peer, 0)
        self.rfile, self.wfile = io.BytesIO(body), io.BytesIO()
        self.response_status, self.response_headers = 500, []
        self.handle_request(method)

    def send_response(self, status, message=None):
        self.response_status = status

    def send_header(self, key, value):
        self.response_headers.append((key.encode('latin-1'), str(value).encode('latin-1')))

    def end_headers(self):
        pass


class InternalKnowledge:
    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http':
            return
        headers = dict(scope['headers'])
        expected = ('Bearer ' + settings.a_to_b_key).encode()
        peer = (scope.get('client') or ('', 0))[0]
        if peer not in {'127.0.0.1', '::1'} or not settings.a_to_b_key or not hmac.compare_digest(headers.get(b'authorization', b''), expected):
            await JSONResponse({'message': '接口不存在'}, status_code=404)(scope, receive, send)
            return
        await knowledge_app(scope, receive, send)


@asynccontextmanager
async def lifespan(app):
    if settings.auth_mode != 'a':
        raise RuntimeError('Unified platform requires the shared platform identity.')
    server.init()
    app.state.requests = anyio.CapacityLimiter(16)
    app.state.callbacks = anyio.CapacityLimiter(16)
    async with knowledge_app.router.lifespan_context(knowledge_app):
        yield


async def legacy(request):
    body = bytearray()
    async for chunk in request.stream():
        body.extend(chunk)
        if len(body) > 15 * 1024 * 1024:
            return JSONResponse({'message': '请求超过15MB限制'}, status_code=413)
    path = request.url.path
    if request.url.query:
        path += '?' + request.url.query
    # Use the measured body length, including chunked HTTP requests.
    headers = [(k, v) for k, v in request.headers.items() if k.lower() not in {'content-length', 'transfer-encoding'}]
    headers.append(('Content-Length', str(len(body))))
    peer = request.client.host if request.client else ''
    callback = request.url.path.startswith(server.PREFIX + '/integration/v1/identity/')
    limiter = request.app.state.callbacks if callback else request.app.state.requests
    handler = await anyio.to_thread.run_sync(
        CapturedHandler, request.method, path, headers, bytes(body), peer, limiter=limiter)
    response = Response(handler.wfile.getvalue(), status_code=handler.response_status)
    response.raw_headers = handler.response_headers
    return response


app = Starlette(routes=[Mount('/__knowledge', InternalKnowledge()),
    Route('/{path:path}', legacy, methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'])], lifespan=lifespan)
