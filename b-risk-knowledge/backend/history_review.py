"""历史报告核验编辑：只读列表复用解析成果视图，修改/日志/批量确认写入独立复核表。

设计要点：
- 读连接与写连接共用同一条本地只读/写库配置，写库为解析成果库（risk_history_20261102_v4）。
- 所有人工修改先落“待确认草稿”，批量确认时才覆盖 history_findings 对应行；
  每次保存/确认/放弃都写 history_review_logs，便于追溯。
- 仅 14 个业务字段可改；problem_description 不允许为空；旧值做乐观并发校验。
"""
from functools import lru_cache
import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

from .auth import Actor, Problem, current_actor
from .modules.report_parsing.fields import FIELDS

CONFIG = Path(__file__).resolve().parents[1] / '.local/history-review.json'
router = APIRouter(prefix='/api/v1/history-review', tags=['历史报告核验'])
EDITABLE = tuple(FIELDS.keys())
LATEST = '''WITH latest AS (
    SELECT DISTINCT ON (document_id) id, document_id, status
    FROM history_imports ORDER BY document_id, created_at DESC, id DESC
) '''

DDL = '''
CREATE TABLE IF NOT EXISTS history_review_drafts (
    id varchar(36) PRIMARY KEY,
    finding_id varchar(36) NOT NULL,
    document_id varchar(36),
    changes jsonb NOT NULL,
    old_values jsonb NOT NULL DEFAULT '{}'::jsonb,
    status varchar(16) NOT NULL DEFAULT 'pending',
    actor text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS ux_history_review_drafts_pending
    ON history_review_drafts(finding_id) WHERE status='pending';
CREATE TABLE IF NOT EXISTS history_review_logs (
    id varchar(36) PRIMARY KEY,
    finding_id varchar(36) NOT NULL,
    document_id varchar(36),
    action varchar(16) NOT NULL,
    changes jsonb,
    old_values jsonb,
    actor text,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_history_review_logs_finding ON history_review_logs(finding_id);
'''


class DraftIn(BaseModel):
    finding_id: str = Field(min_length=1, max_length=36)
    changes: dict[str, str | None]


class DraftIds(BaseModel):
    ids: list[str] = Field(min_length=1, max_length=500)


@lru_cache(maxsize=1)
def configuration():
    if not CONFIG.is_file():
        raise Problem(503, 'REVIEW_UNAVAILABLE', '历史报告核验写入连接尚未配置。')
    return json.loads(CONFIG.read_text(encoding='utf-8'))


@lru_cache(maxsize=1)
def engine():
    return create_engine(configuration()['database_url'], pool_size=2, max_overflow=2, pool_timeout=5,
                         pool_pre_ping=True, connect_args={'connect_timeout': 5})


def reviewer(actor: Actor = Depends(current_actor)):
    allowed = configuration()['allowed_identities']
    if actor.is_service or not any(v['org_id'] == actor.org_id and v['subject'] == actor.subject for v in allowed):
        raise Problem(403, 'REVIEW_FORBIDDEN', '历史报告修改入口仅向获授权的本机管理员开放。')
    return actor


def actor_name(actor: Actor) -> str:
    return f'{actor.org_id}:{actor.subject}'


def ensure_schema():
    try:
        with engine().begin() as connection:
            connection.execute(text(DDL))
    except SQLAlchemyError:
        raise Problem(503, 'REVIEW_UNAVAILABLE', '历史报告核验写入表初始化失败。') from None


def rows(query, parameters=None):
    try:
        with engine().connect() as connection:
            return [dict(r) for r in connection.execute(text(query), parameters or {}).mappings()]
    except SQLAlchemyError:
        raise Problem(503, 'REVIEW_BUSY', '历史报告核验库暂时繁忙，请稍后重试。') from None


def check_changes(changes: dict) -> dict:
    if not changes:
        raise Problem(400, 'EMPTY_CHANGES', '没有需要保存的字段。')
    unknown = [key for key in changes if key not in EDITABLE]
    if unknown:
        raise Problem(400, 'FIELD_NOT_EDITABLE', '不可修改字段：' + ', '.join(sorted(unknown)))
    clean: dict[str, str | None] = {}
    for key, value in changes.items():
        if value is not None:
            if not isinstance(value, str):
                raise Problem(400, 'VALUE_NOT_TEXT', f'{FIELDS[key][0]}必须是文本。')
            if len(value) > 20000:
                raise Problem(400, 'VALUE_TOO_LONG', f'{FIELDS[key][0]}超过20000字。')
        clean[key] = value
    if 'problem_description' in clean and not (clean['problem_description'] or '').strip():
        raise Problem(400, 'PROBLEM_DESCRIPTION_REQUIRED', '问题描述不能为空。')
    return clean


def log(connection, finding_id, document_id, action, changes, old_values, actor):
    connection.execute(text('''INSERT INTO history_review_logs
        (id, finding_id, document_id, action, changes, old_values, actor)
        VALUES (:id, :finding_id, :document_id, :action, CAST(:changes AS jsonb),
                CAST(:old_values AS jsonb), :actor)'''),
        dict(id=str(uuid4()), finding_id=finding_id, document_id=document_id, action=action,
             changes=json.dumps(changes, ensure_ascii=False), old_values=json.dumps(old_values, ensure_ascii=False),
             actor=actor))


@router.get('/summary')
def summary(actor=Depends(reviewer)):
    ensure_schema()
    result = rows('''SELECT (SELECT count(*) FROM history_current_consolidated_findings) AS findings,
        (SELECT count(DISTINCT document_id) FROM history_current_consolidated_findings) AS reports,
        (SELECT count(DISTINCT COALESCE(engineering_project_name, project_name))
            FROM history_current_consolidated_findings
            WHERE COALESCE(engineering_project_name, project_name) IS NOT NULL) AS projects,
        (SELECT count(*) FROM history_review_drafts WHERE status='pending') AS pending_drafts''')[0]
    return {**result, 'editable_fields': [{'key': k, 'label': v[0]} for k, v in FIELDS.items()],
            'notice': '修改先保存为待确认草稿，批量确认后才覆盖解析成果库；所有操作写入修改日志。'}


@router.get('/projects')
def projects(q: str = Query('', max_length=100), limit: int = Query(1000, ge=1, le=3000),
             field: str = Query('', max_length=32), actor=Depends(reviewer)):
    expression = 'project_name' if field == 'project_name' else 'COALESCE(engineering_project_name, project_name)'
    result = rows(f'''SELECT {expression} AS name, count(*) AS findings
        FROM history_current_consolidated_findings
        WHERE {expression} IS NOT NULL
          AND (:q = '' OR position(lower(:q) in lower({expression})) > 0)
        GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT :limit''', {'q': q.strip(), 'limit': limit})
    return {'items': result}


@router.get('/reports')
def reports(q: str = Query('', max_length=100), project: str = Query('', max_length=200),
            project_name: str = Query('', max_length=200),
            offset: int = Query(0, ge=0, le=200000), limit: int = Query(30, ge=1, le=100),
            actor=Depends(reviewer)):
    ensure_schema()
    result = rows('''WITH agg AS (
            SELECT document_id, count(*) AS findings,
                   max(project_name) AS parent_project_name,
                   max(COALESCE(engineering_project_name, project_name)) AS engineering_project_name,
                   min(inspection_date) AS inspection_date
            FROM history_current_consolidated_findings GROUP BY document_id)
        SELECT d.id AS document_id, d.original_name, a.findings, a.parent_project_name AS project_name,
               a.engineering_project_name, a.inspection_date
        FROM agg a JOIN history_documents d ON d.id = a.document_id
        WHERE (:q = '' OR position(lower(:q) in lower(concat_ws(' ', d.original_name, a.parent_project_name, a.engineering_project_name))) > 0)
          AND (:project = '' OR a.engineering_project_name = :project)
          AND (:project_name = '' OR a.parent_project_name = :project_name)
        ORDER BY d.id LIMIT :limit OFFSET :offset''',
        {'q': q.strip(), 'project': project.strip(), 'project_name': project_name.strip(),
         'limit': limit + 1, 'offset': offset})
    return {'items': result[:limit], 'has_more': len(result) > limit}


@router.get('/reports/{document_id}/findings')
def report_findings(document_id: str, actor=Depends(reviewer)):
    result = rows('''SELECT f.id, f.document_id, f.project_name, f.engineering_project_name, f.inspection_date,
        f.inspection_location, f.problem_description, f.source_category, f.hazard_category, f.source_grade,
        f.basis_or_clause, f.rectification_requirement, f.rectification_advice, f.rectification_deadline,
        f.reported_response, f.reinspection_conclusion, f.review_state, f.consolidation_id
        FROM history_current_consolidated_findings f WHERE f.document_id = :id
        ORDER BY f.source_key, f.id''', {'id': document_id})
    if not result:
        raise Problem(404, 'NOT_FOUND', '报告或问题条目不存在。')
    return {'items': result}


@router.get('/findings')
def findings(q: str = Query('', max_length=100), project: str = Query('', max_length=200),
             document_id: str = Query('', max_length=36),
             offset: int = Query(0, ge=0, le=200000), limit: int = Query(20, ge=1, le=200),
             actor=Depends(reviewer)):
    ensure_schema()
    result = rows('''SELECT f.id, f.document_id, d.original_name, f.project_name, f.engineering_project_name,
        f.inspection_date, f.inspection_location, f.problem_description, f.source_category, f.hazard_category,
        f.source_grade, f.basis_or_clause, f.rectification_requirement, f.rectification_advice,
        f.rectification_deadline, f.reported_response, f.reinspection_conclusion, f.review_state,
        f.consolidation_id, dr.id AS draft_id,
        (SELECT count(*) FROM history_image_links l
            JOIN history_image_occurrences o ON o.id = l.occurrence_id
            WHERE l.finding_id = f.id) AS image_count
        FROM history_current_consolidated_findings f
        LEFT JOIN history_documents d ON d.id = f.document_id
        LEFT JOIN history_review_drafts dr ON dr.finding_id = f.id AND dr.status='pending'
        WHERE (:q = '' OR position(lower(:q) in lower(concat_ws(' ', f.project_name,
            f.engineering_project_name, f.problem_description, d.original_name))) > 0)
          AND (:project = '' OR COALESCE(f.engineering_project_name, f.project_name) = :project)
          AND (:document_id = '' OR f.document_id = :document_id)
        ORDER BY f.document_id, f.source_key, f.id LIMIT :limit OFFSET :offset''',
        {'q': q.strip(), 'project': project.strip(), 'document_id': document_id.strip(),
         'limit': limit + 1, 'offset': offset})
    return {'items': result[:limit], 'has_more': len(result) > limit}


@router.post('/drafts')
def save_draft(payload: DraftIn, actor=Depends(reviewer)):
    ensure_schema()
    changes = check_changes(payload.changes)
    current = rows('''SELECT f.id, i.document_id, f.review_state,
        ''' + ', '.join(f'f.{key}' for key in EDITABLE) + '''
        FROM history_findings f JOIN history_imports i ON i.id = f.import_id WHERE f.id = :id''', {'id': payload.finding_id})
    if not current:
        raise Problem(404, 'NOT_FOUND', '问题条目不存在。')
    row = current[0]
    with engine().begin() as connection:
        existing = connection.execute(text('''SELECT id, changes, old_values FROM history_review_drafts
            WHERE finding_id = :f AND status='pending' FOR UPDATE'''), {'f': payload.finding_id}).mappings().first()
        old_values = dict(existing['old_values']) if existing else {}
        for key in changes:
            if key not in old_values:
                old_values[key] = row[key]
        merged = dict(existing['changes']) if existing else {}
        merged.update(changes)
        if existing:
            draft_id = existing['id']
            connection.execute(text('''UPDATE history_review_drafts SET changes=CAST(:changes AS jsonb),
                old_values=CAST(:old AS jsonb), actor=:actor, updated_at=now() WHERE id=:id'''),
                dict(id=draft_id, changes=json.dumps(merged, ensure_ascii=False),
                     old=json.dumps(old_values, ensure_ascii=False), actor=actor_name(actor)))
        else:
            draft_id = str(uuid4())
            connection.execute(text('''INSERT INTO history_review_drafts
                (id, finding_id, document_id, changes, old_values, status, actor)
                VALUES (:id, :f, :d, CAST(:changes AS jsonb), CAST(:old AS jsonb), 'pending', :actor)'''),
                dict(id=draft_id, f=payload.finding_id, d=row['document_id'],
                     changes=json.dumps(merged, ensure_ascii=False),
                     old=json.dumps(old_values, ensure_ascii=False), actor=actor_name(actor)))
        log(connection, payload.finding_id, row['document_id'], 'save_draft', changes, old_values, actor_name(actor))
    return {'draft_id': draft_id, 'finding_id': payload.finding_id, 'changes': merged}


@router.get('/drafts')
def drafts(offset: int = Query(0, ge=0, le=200000), limit: int = Query(50, ge=1, le=200), actor=Depends(reviewer)):
    ensure_schema()
    result = rows('''SELECT dr.id, dr.finding_id, dr.document_id, dr.changes, dr.old_values, dr.updated_at,
        d.original_name, f.problem_description AS current_problem_description,
        f.engineering_project_name AS current_engineering_project_name
        FROM history_review_drafts dr
        LEFT JOIN history_documents d ON d.id = dr.document_id
        LEFT JOIN history_findings f ON f.id = dr.finding_id
        WHERE dr.status='pending' ORDER BY dr.updated_at DESC, dr.id LIMIT :limit OFFSET :offset''',
        {'limit': limit + 1, 'offset': offset})
    return {'items': result[:limit], 'has_more': len(result) > limit}


@router.post('/drafts/confirm')
def confirm_drafts(payload: DraftIds, actor=Depends(reviewer)):
    ensure_schema()
    applied, conflicts = [], []
    with engine().begin() as connection:
        claimed = connection.execute(text('''SELECT dr.id, dr.finding_id, dr.document_id, dr.changes, dr.old_values,
            f.review_state, ''' + ', '.join(f'f.{key} AS cur_{key}' for key in EDITABLE) + '''
            FROM history_review_drafts dr JOIN history_findings f ON f.id = dr.finding_id
            WHERE dr.status='pending' AND dr.id = ANY(:ids) FOR UPDATE OF dr, f'''),
            {'ids': payload.ids}).mappings().all()
        found = {row['id'] for row in claimed}
        for missing in [i for i in payload.ids if i not in found]:
            conflicts.append({'draft_id': missing, 'reason': 'draft_not_found'})
        for draft in claimed:
            changes = dict(draft['changes'])
            old = dict(draft['old_values'] or {})
            drift = [key for key in changes if draft[f'cur_{key}'] != old.get(key)]
            if drift:
                conflicts.append({'draft_id': draft['id'], 'finding_id': draft['finding_id'],
                                  'reason': 'value_changed_since_draft', 'fields': drift})
                connection.execute(text("UPDATE history_review_drafts SET status='conflict', updated_at=now() WHERE id=:id"),
                                   {'id': draft['id']})
                log(connection, draft['finding_id'], draft['document_id'], 'conflict', changes,
                    {key: draft[f'cur_{key}'] for key in changes}, actor_name(actor))
                continue
            assignments = ', '.join(f'{key} = :v_{key}' for key in changes)
            params = {f'v_{key}': changes[key] for key in changes}
            params['id'] = draft['finding_id']
            connection.execute(text(f'UPDATE history_findings SET {assignments} WHERE id = :id'), params)
            connection.execute(text("UPDATE history_review_drafts SET status='confirmed', updated_at=now() WHERE id=:id"),
                               {'id': draft['id']})
            log(connection, draft['finding_id'], draft['document_id'], 'confirm', changes,
                {key: draft[f'cur_{key}'] for key in changes}, actor_name(actor))
            applied.append({'draft_id': draft['id'], 'finding_id': draft['finding_id'], 'fields': sorted(changes)})
    return {'applied': applied, 'conflicts': conflicts}


@router.post('/drafts/discard')
def discard_drafts(payload: DraftIds, actor=Depends(reviewer)):
    ensure_schema()
    discarded = []
    with engine().begin() as connection:
        for draft_id in payload.ids:
            draft = connection.execute(text("SELECT finding_id, document_id, changes, old_values FROM history_review_drafts WHERE id=:id AND status='pending' FOR UPDATE"),
                                       {'id': draft_id}).mappings().first()
            if not draft:
                continue
            connection.execute(text("UPDATE history_review_drafts SET status='discarded', updated_at=now() WHERE id=:id"),
                               {'id': draft_id})
            log(connection, draft['finding_id'], draft['document_id'], 'discard', draft['changes'],
                draft['old_values'] or {}, actor_name(actor))
            discarded.append(draft_id)
    return {'discarded': discarded}


@router.get('/logs')
def logs(finding_id: str = Query('', max_length=36), document_id: str = Query('', max_length=36),
         offset: int = Query(0, ge=0, le=200000), limit: int = Query(50, ge=1, le=200),
         actor=Depends(reviewer)):
    ensure_schema()
    result = rows('''SELECT l.id, l.finding_id, l.document_id, l.action, l.changes, l.old_values, l.actor, l.created_at,
        d.original_name
        FROM history_review_logs l LEFT JOIN history_documents d ON d.id = l.document_id
        WHERE (:finding_id = '' OR l.finding_id = :finding_id)
          AND (:document_id = '' OR l.document_id = :document_id)
        ORDER BY l.created_at DESC, l.id LIMIT :limit OFFSET :offset''',
        {'finding_id': finding_id.strip(), 'document_id': document_id.strip(),
         'limit': limit + 1, 'offset': offset})
    return {'items': result[:limit], 'has_more': len(result) > limit}
