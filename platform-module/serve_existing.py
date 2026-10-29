"""Unified API entry point for an existing reverse-proxy deployment."""
import os

import uvicorn

from run_platform import configure


if __name__ == '__main__':
    port = configure()
    uvicorn.run(
        'fusion_app:app',
        host=os.environ.get('QAXC_BIND_HOST', '127.0.0.1'),
        port=port,
        proxy_headers=False,
        access_log=False,
    )
