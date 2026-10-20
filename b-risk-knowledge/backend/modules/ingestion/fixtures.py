import hashlib
from uuid import uuid5, NAMESPACE_URL
from pathlib import Path
from sqlalchemy import select
from ...config import ROOT, settings
from ...models import FileAsset
from ...storage import asset_path
from ...db import Session

CATALOG = [
    ('airport-v1', 'airport-v1.csv', 'demo-airport', 'csv', 'CSV初始版本 · 6条'),
    ('airport-v2', 'airport-v2.csv', 'demo-airport', 'csv', 'CSV更新版本 · 仅修改1条'),
    ('mixed-errors', 'mixed-errors.csv', 'demo-airport', 'csv', 'CSV异常演示 · 3条'),
    ('metro-v1', 'metro-v1.csv', 'demo-metro', 'csv', '地铁项目 · 相同描述'),
    ('airport-excel', 'airport.xlsx', 'demo-airport', 'excel', '机场Excel · 2条'),
    ('governance', 'governance.json', 'demo-airport', 'governance_export', '治理导出 · 人工修订第7版'),
    ('photo-airport', 'photo.svg', 'demo-airport', 'image', '模拟现场示意图'),
    ('screenshot-airport', 'screenshot.svg', 'demo-airport', 'image', '模拟文字截图'),
]


def fixture_id(ref):
    return str(uuid5(NAMESPACE_URL, f'risk-b02-fixture:{ref}'))


def seed_assets():
    from .adapters import MIME
    with Session.begin() as db:
        for ref, filename, project, kind, title in CATALOG:
            if db.get(FileAsset, fixture_id(ref)):
                continue
            content = (ROOT/'fixtures/b02'/filename).read_bytes()
            digest = hashlib.sha256(content).hexdigest()
            key = f'mock-inputs/{digest}/{filename}'
            path = asset_path(key)
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(content)
            db.add(FileAsset(id=fixture_id(ref), storage_key=key, sha256=digest, size=len(content),
                             mime_type=MIME.get(kind, 'image/svg+xml'), project_id=project))


def catalog(actor):
    return [{'asset_id': fixture_id(ref), 'label': title, 'kind': kind, 'project_id': project, 'is_mock': True}
            for ref, filename, project, kind, title in CATALOG if project in actor.projects() and kind != 'image']
