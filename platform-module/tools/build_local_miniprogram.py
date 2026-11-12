"""Build a separate local client without changing the cloud upload project."""
import argparse
import json
from pathlib import Path
import re
import shutil
from urllib.parse import urlsplit


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--server', default='http://127.0.0.1:8767')
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    url = args.server.rstrip('/')
    parsed = urlsplit(url)
    if parsed.scheme not in ('http', 'https') or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment:
        raise SystemExit('Use an HTTP(S) backend URL without credentials, query or fragment.')
    source = Path(__file__).resolve().parents[1] / 'miniprogram'
    output = args.output.resolve()
    if output == source or source in output.parents or output in source.parents:
        raise SystemExit('Local output must be separate from the cloud source directory.')
    if output.exists() and any(output.iterdir()):
        raise SystemExit('Choose a new empty output directory; existing builds are preserved.')
    output.mkdir(parents=True, exist_ok=True)
    for path in source.rglob('*'):
        if not path.is_file() or path.name == 'project.private.config.json':
            continue
        if path.suffix not in ('.js', '.json', '.wxml', '.wxss'):
            continue
        destination = output / path.relative_to(source)
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, destination)
        if path.suffix == '.js':
            text = destination.read_text(encoding='utf-8')
            # Keep local logins and offline drafts separate from the cloud client.
            text = text.replace("'token'", "'localToken'").replace("'rememberedAccount'", "'localRememberedAccount'")
            text = text.replace("'qaxc.offline.v1'", "'qaxc.local.offline.v1'")
            destination.write_text(text, encoding='utf-8')
    api = output / 'utils/api.js'
    text = api.read_text(encoding='utf-8')
    pattern = r'''function base\(\)\{return (?:'[^']*'|"[^"]*")\}'''
    if len(re.findall(pattern, text)) != 1:
        raise SystemExit('Backend address implementation changed; review local build logic.')
    # Also supports rebuilding an existing local package for a different LAN IP.
    api.write_text(re.sub(pattern, lambda _: 'function base(){return ' + json.dumps(url) + '}', text), encoding='utf-8')
    config_path = output / 'project.config.json'
    config = json.loads(config_path.read_text(encoding='utf-8'))
    config.update(projectname='quality-safety-local-20261112', description='质量安全小察 本地部署客户端')
    config.setdefault('setting', {})['urlCheck'] = False
    config_path.write_text(json.dumps(config, ensure_ascii=False, indent=2), encoding='utf-8')
    (output / 'LOCAL-BUILD.txt').write_text('本地服务地址：' + url + '\n仅用于本地部署，请勿作为云端体验版上传。\n', encoding='utf-8')
    print('LOCAL_BUILD', output)
    print('BACKEND', url)


if __name__ == '__main__':
    main()
