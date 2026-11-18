"""Run the field workflow on loopback, using only explicitly configured UAT identity."""
import os
from pathlib import Path
import subprocess
import sys
from urllib.parse import urlsplit


MODULE = Path(__file__).resolve().parents[1]


def settings(source):
    url = source.get('QAXC_UAT_AUTH_URL', '').strip().rstrip('/')
    key = source.get('QAXC_UAT_AUTH_KEY', '').strip()
    if not url or not key or 'REPLACE' in url or 'REPLACE' in key:
        raise ValueError('缺少验收专用 QAXC_UAT_AUTH_URL / QAXC_UAT_AUTH_KEY。不会启用演示登录。')
    parsed = urlsplit(url)
    if (not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment
            or not (parsed.scheme == 'https' or
                    (parsed.scheme == 'http' and parsed.hostname in ('127.0.0.1', '::1')))):
        raise ValueError('认证入口必须是管理员提供的 HTTPS 地址或本机回环隧道。')
    keep = {'SYSTEMROOT', 'WINDIR', 'PATH', 'TEMP', 'TMP', 'LANG', 'HOME', 'USERPROFILE', 'PROGRAMDATA'}
    env = {name: value for name, value in source.items() if name.upper() in keep}
    env.update(QAXC_DATA=str(MODULE.parent / '.local' / 'identity-uat'),
               QAXC_AUTH_URL=url, QAXC_AUTH_KEY=key, PYTHONIOENCODING='utf-8')
    return env


def main():
    try:
        env = settings(os.environ)
    except ValueError as error:
        raise SystemExit(str(error)) from None
    return subprocess.call([sys.executable, str(MODULE / 'candidate' / 'server.py'),
                            '--host', '127.0.0.1', '--port', '18818'], env=env, cwd=MODULE)


if __name__ == '__main__':
    sys.exit(main())
