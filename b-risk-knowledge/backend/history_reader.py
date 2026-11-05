"""Separate SELECT-only connection; no parser, migration, initialization or worker."""
from functools import lru_cache
import json
from pathlib import Path

from fastapi import APIRouter, Depends, Query
from fastapi.responses import FileResponse, HTMLResponse
import html as html_lib
from urllib.parse import quote
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from .auth import Actor, Problem, current_actor
from .modules.report_parsing.fields import FIELDS

CONFIG = Path(__file__).resolve().parents[1] / '.local/history-reader.json'
router = APIRouter(prefix='/api/v1/history-reader', tags=['解析成果只读'])
LATEST = '''WITH latest AS (
    SELECT DISTINCT ON (document_id) id, document_id, status, created_at
    FROM history_imports ORDER BY document_id, created_at DESC, id DESC
) '''


@lru_cache(maxsize=1)
def configuration():
    if not CONFIG.is_file():
        raise Problem(503, 'READER_UNAVAILABLE', '解析成果只读连接尚未配置。')
    return json.loads(CONFIG.read_text(encoding='utf-8'))


@lru_cache(maxsize=1)
def engine():
    return create_engine(configuration()['database_url'], pool_size=1, max_overflow=1, pool_timeout=3,
                         pool_pre_ping=True, connect_args={'connect_timeout': 3,
                         'options': '-c default_transaction_read_only=on -c statement_timeout=5000 -c lock_timeout=500'})


def reader(actor: Actor = Depends(current_actor)):
    allowed = configuration()['allowed_identities']
    if actor.is_service or not any(v['org_id'] == actor.org_id and v['subject'] == actor.subject for v in allowed):
        raise Problem(403, 'READER_FORBIDDEN', '解析成果只读入口仅向获授权的本机管理员开放。')
    return actor


def rows(query, parameters=None):
    try:
        with engine().connect() as connection:
            return [dict(r) for r in connection.execute(text(query), parameters or {}).mappings()]
    except SQLAlchemyError:
        raise Problem(503, 'READER_BUSY', '解析成果暂时繁忙，请稍后重试。') from None


@router.get('/summary')
def summary(actor=Depends(reader)):
    result = rows(LATEST + '''SELECT (SELECT count(*) FROM latest WHERE status<>'merged_duplicate') AS documents,
        (SELECT count(*) FROM latest WHERE status='merged_duplicate') AS removed_duplicate_reports,
        (SELECT count(*) FROM latest l JOIN history_findings f ON f.import_id=l.id) AS raw_findings,
        count(*) AS findings, count(*) FILTER (WHERE consolidation_id IS NOT NULL) AS consolidated_findings,
        max(parsed_at) AS parsed_at FROM history_current_consolidated_findings''')[0]
    return {**result, 'read_only': True, 'notice': '已核实为同一次检查同一隐患的重复出处合为一条，字段和照片互补；其他条目仍在核验。',
            'fields': [{'key': k, 'label': v[0]} for k, v in FIELDS.items()]}


@router.get('/findings')
def findings(q: str = Query('', max_length=100), offset: int = Query(0, ge=0, le=200000),
             limit: int = Query(20, ge=1, le=50), actor=Depends(reader)):
    result = rows(LATEST + '''SELECT f.id, f.project_name, f.engineering_project_name,
        f.inspection_date, f.problem_description, f.source_category, f.review_state,
        d.original_name, d.id AS document_id
        FROM history_current_consolidated_findings f
        JOIN LATERAL (SELECT hd.id, hd.original_name FROM history_documents hd
            WHERE hd.id=f.document_id LIMIT 1) d ON true
        WHERE (:q='' OR position(lower(:q) in lower(concat_ws(' ', f.project_name,
            f.engineering_project_name,f.problem_description,d.original_name)))>0)
        ORDER BY d.id,f.source_key,f.id LIMIT :limit OFFSET :offset''',
        {'q': q.strip(), 'limit': limit + 1, 'offset': offset})
    return {'items': result[:limit], 'has_more': len(result) > limit}


@router.get('/findings/{finding_id}')
def detail(finding_id: str, actor=Depends(reader)):
    found = rows('''SELECT f.*, d.original_name FROM history_current_consolidated_findings f
        JOIN history_documents d ON d.id=f.document_id WHERE f.id=:id''', {'id': finding_id})
    if not found:
        raise Problem(404, 'NOT_FOUND', '当前解析版本中没有此条目，请刷新列表。')
    item = found[0]
    evidence = rows('''SELECT field_key,source_label,quote,locator,method,details FROM history_evidence
        WHERE finding_id=:id ORDER BY field_key,id LIMIT 100''', {'id': finding_id})
    member_ids=[finding_id];sources=[{'document_id':item['document_id'],'original_name':item['original_name']}]
    group=item.get('consolidation')
    if group:
        evidence=group['evidence']
        members=rows(LATEST+'''SELECT f.id,d.id AS document_id,d.original_name FROM history_finding_consolidation_members m
            JOIN latest l ON l.document_id=m.document_id JOIN history_findings f ON f.import_id=l.id AND f.source_key=m.source_key
            JOIN history_documents d ON d.id=m.document_id WHERE m.group_id=:gid''',{'gid':item['consolidation_id']})
        member_ids=[m['id'] for m in members]
        source_ids=sorted({e['document_id'] for e in evidence}|{m['document_id'] for m in members})
        sources=rows('SELECT id AS document_id,original_name FROM history_documents WHERE id=ANY(:ids)',{'ids':source_ids})
    else:
        for e in evidence:
            did=(e.get('details') or {}).get('source_document_id',item['document_id'])
            e['document_id']=did
            e['original_url']=f'/api/v1/history-reader/documents/{did}/original'
        source_ids=sorted({e['document_id'] for e in evidence}|{item['document_id']})
        sources=rows('SELECT id AS document_id,original_name FROM history_documents WHERE id=ANY(:ids)',{'ids':source_ids})
    images = rows('''SELECT DISTINCT i.id, i.document_id, i.width, i.height, o.locator, l.relation FROM history_image_links l
        JOIN history_image_occurrences o ON o.id=l.occurrence_id
        JOIN history_images i ON i.id=o.image_id WHERE l.finding_id=ANY(:ids) LIMIT 100''', {'ids': member_ids})
    images.extend((group or {}).get('images',[]))
    # A reply/photo volume may contribute images without supplying a business field.
    image_sources={i['document_id'] for i in images if i.get('document_id')}
    missing_sources=image_sources-{s['document_id'] for s in sources}
    if missing_sources:
        sources.extend(rows('SELECT id AS document_id,original_name FROM history_documents WHERE id=ANY(:ids)',{'ids':sorted(missing_sources)}))
    return {'id': item['id'], 'document_id': item['document_id'], 'original_name': item['original_name'],
            'parsed_at': item['parsed_at'], 'review_state': item['review_state'], 'locator': item['locator'],
            'fields': {k: item[k] for k in FIELDS}, 'evidence': evidence, 'images': images,
            'consolidation_id':item.get('consolidation_id'),'sources':sources,'field_variants':(group or {}).get('field_variants',{})}


def file_response(asset, filename=None, inline=False):
    root = Path(configuration()['storage']).resolve()
    path = (root / asset['storage_key']).resolve()
    if not path.is_relative_to(root) or not path.is_file():
        raise Problem(404, 'ASSET_UNAVAILABLE', '原件或图片当前不可用。')
    inline_types = {'application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'}
    if inline:
        mime = asset['mime_type'] if asset['mime_type'] in inline_types else 'application/octet-stream'
        disposition = 'inline; filename*=UTF-8\'\'' + quote(filename or 'report')
    else:
        mime = asset['mime_type'] if asset['mime_type'] in {'image/jpeg', 'image/png', 'image/gif', 'image/webp'} else 'application/octet-stream'
        disposition = None
    headers = {'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store'}
    if disposition:
        headers['Content-Disposition'] = disposition
    return FileResponse(path, media_type=mime, headers=headers)


@router.get('/documents/{document_id}/original')
def original(document_id: str, actor=Depends(reader)):
    found = rows('''SELECT a.storage_key,a.mime_type,d.original_name FROM history_documents d
        JOIN file_assets a ON a.id=d.asset_id WHERE d.id=:id''', {'id': document_id})
    if not found:
        raise Problem(404, 'NOT_FOUND', '原件不存在。')
    return file_response(found[0], found[0]['original_name'])


@router.get('/images/{image_id}')
def image(image_id: str, actor=Depends(reader)):
    found = rows('''SELECT a.storage_key,a.mime_type FROM history_images i
        JOIN file_assets a ON a.id=i.asset_id WHERE i.id=:id''', {'id': image_id})
    if not found:
        raise Problem(404, 'NOT_FOUND', '图片不存在。')
    return file_response(found[0])

def document_asset(document_id):
    found = rows('''SELECT a.storage_key,a.mime_type,d.original_name FROM history_documents d
        JOIN file_assets a ON a.id=d.asset_id WHERE d.id=:id''', {'id': document_id})
    if not found:
        raise Problem(404, 'NOT_FOUND', '原件不存在。')
    return found[0]


@router.get('/documents/{document_id}/raw')
def raw(document_id: str, actor=Depends(reader)):
    asset = document_asset(document_id)
    return file_response(asset, asset['original_name'], inline=True)


@router.get('/documents/{document_id}/view', response_class=HTMLResponse)
def view(document_id: str, actor=Depends(reader)):
    asset = document_asset(document_id)
    name = asset['original_name']
    escaped = html_lib.escape(name)
    mime = asset.get('mime_type') or ''
    if mime == 'application/pdf':
        body = '<iframe src="raw" title="报告原件"></iframe>'
    elif mime in {'image/jpeg', 'image/png', 'image/gif', 'image/webp'}:
        body = '<img src="raw" alt="报告原件">'
    else:
        photos = rows('''SELECT i.id FROM history_images i WHERE i.document_id=:id ORDER BY i.id LIMIT 40''', {'id': document_id})
        gallery = ''.join(f'<a href="../../images/{p["id"]}" target="_blank"><img src="../../images/{p["id"]}" alt="报告关联照片"></a>' for p in photos)
        body = ('<p class="muted">该格式（' + html_lib.escape(mime or '未知') + '）无法在浏览器内直接渲染，请下载原件查看；下面是该报告中关联的照片。</p>'
                + ('<div class="strip">' + gallery + '</div>' if gallery else ''))
    page = f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escaped}</title><style>
*{{box-sizing:border-box}}body{{margin:0;background:#f3f6f9;color:#253c48;font-family:"Microsoft YaHei UI","Microsoft YaHei",sans-serif}}
header{{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 22px;background:#fff;border-bottom:1px solid #dfe8e2;flex-wrap:wrap}}
h1{{font-size:16px;margin:0;line-height:1.6;overflow-wrap:anywhere}}header div{{display:flex;gap:10px;flex-wrap:wrap}}
a.button{{display:inline-flex;align-items:center;padding:9px 14px;border-radius:7px;background:#176b53;color:#fff;text-decoration:none;font-size:13px}}
a.ghost{{background:#fff;border:1px solid #dbe4e9;color:#57707e}}
main{{padding:16px 22px 30px}}iframe{{width:100%;height:calc(100vh - 110px);border:1px solid #dfe8e2;border-radius:8px;background:#fff}}
img{{max-width:100%;max-height:calc(100vh - 110px);display:block;margin:0 auto;border-radius:8px;background:#fff}}
.muted{{color:#6b8490;font-size:13px;line-height:1.8}}.strip{{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin-top:14px}}
.strip img{{width:100%;height:170px;object-fit:cover;border:1px solid #e2e8f0;border-radius:8px;margin:0}}
</style></head><body>
<header><h1>{escaped}</h1><div><a class="ghost" href="original">下载原件</a><a class="ghost" href="raw" target="_blank">浏览器打开</a></div></header>
<main>{body}</main></body></html>'''
    return HTMLResponse(page, headers={'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff'})

