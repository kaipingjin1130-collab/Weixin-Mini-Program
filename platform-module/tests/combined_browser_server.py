"""Synthetic localhost fixture; never connects to an external identity service."""
import json
import os
import sys
import threading
from test_combined_reports import CombinedReports, s

test = CombinedReports()
test.setUp()
os.environ['QAXC_LOOPBACK_HTTP_DEV'] = '1'
try:
    test.combined()
    server = s.ThreadingHTTPServer(('127.0.0.1', 0), s.Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    print(json.dumps({'port': server.server_port}), flush=True)
    sys.stdin.readline()
    server.shutdown()
    server.server_close()
finally:
    test.tearDown()
