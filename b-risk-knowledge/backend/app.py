import base64
import hashlib
import json
import re
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from uuid import uuid4

from fastapi import FastAPI, Depends, Request, Header, Query
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, FileResponse
from starlette.middleware.trustedhost import TrustedHostMiddleware
from sqlalchemy import select, func, text, and_, or_
from sqlalchemy.exc import SQLAlchemyError, IntegrityError

from .config import settings
from .db import Session
from .models import UserLink, RoleBinding, ProcessingRun, FileAsset, AuditEvent
from .auth import Actor, current_actor, authorize, Problem
from .schemas import CreateRun, RetryRun, CreateBinding, DeleteBinding
from .job_service import create_run, retry_run
from .storage import asset_path
from .audit import record

from .pagination import paginate
from .api_common import key_header

PROJECTS = {"demo-airport": "机场检查 · 演示项目", "demo-metro": "地铁监护 · 演示项目"}


@asynccontextmanager
async def lifespan(app):
    from .queue import queue_app
    queue_app.open()
    yield
    queue_app.close()


app = FastAPI(title="工程风险知识中心 B07", version="0.7.0", lifespan=lifespan)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["127.0.0.1", "localhost", "testserver"])


@app.middleware("http")
async def request_context(request, call_next):
    value = request.headers.get("x-request-id", "")
    request.state.request_id = value if re.fullmatch(r"[A-Za-z0-9_.:-]{1,128}", value) else str(uuid4())
    response = await call_next(request)
    response.headers["X-Request-ID"] = request.state.request_id
    response.headers["Cache-Control"] = "no-store"
    return response


def problem_response(request, status, code, message):
    return JSONResponse(status_code=status, content={
        "code": code, "message": message, "details": [],
        "request_id": getattr(request.state, "request_id", str(uuid4()))})


@app.exception_handler(Problem)
async def business_error(request, exc):
    return problem_response(request, exc.status, exc.code, exc.message)


@app.exception_handler(RequestValidationError)
async def validation_error(request, exc):
    # Do not echo request bodies or tokens from Pydantic validation input.
    return problem_response(request, 422, "VALIDATION_ERROR", "请求字段不正确，请检查输入。")


@app.exception_handler(SQLAlchemyError)
async def database_error(request, exc):
    logging.getLogger("b01").error("Database operation failed; request_id=%s type=%s",
                                  request.state.request_id, type(exc).__name__)
    return problem_response(request, 503, "DATABASE_UNAVAILABLE", "数据服务暂不可用，请稍后重试。")


@app.exception_handler(Exception)
async def unexpected_error(request, exc):
    logging.getLogger("b01").error("Operation failed; request_id=%s type=%s",
                                  request.state.request_id, type(exc).__name__)
    return problem_response(request, 503, "SERVICE_UNAVAILABLE", "处理服务暂不可用，请稍后重试。")




def job_dto(run):
    fields = ["id", "kind", "title", "project_id", "status", "attempts", "progress",
              "result_ref", "error", "row_version", "created_at", "updated_at"]
    return {**{k: getattr(run, k) for k in fields}, "is_demo": run.kind == "demo_check"}




@app.get("/api/v1/health")
def health():
    with Session() as db:
        db.execute(text("SELECT 1"))
        workers = db.scalar(text("SELECT count(*) FROM procrastinate_workers WHERE last_heartbeat > now() - interval '30 seconds'"))
    return {"app": "risk-b01", "status": "ok", "environment": settings.environment,
            "auth_mode": settings.auth_mode, "worker_online": bool(workers)}


@app.get("/api/v1/me")
def me(actor: Actor = Depends(current_actor)):
    return {"id": actor.id, "name": actor.name, "subject": actor.subject, "mode": settings.auth_mode,
            "projects": [{"id": p, "name": PROJECTS.get(p, p), "roles": sorted(actor.roles.get(p, [])),
                          "can_run": actor.can("run", p), "can_manage": actor.can("manage", p)}
                         for p in actor.projects()]}


@app.get("/api/v1/dashboard")
def dashboard(actor: Actor = Depends(current_actor)):
    with Session() as db:
        rows = db.execute(select(ProcessingRun.status, func.count()).where(
            ProcessingRun.project_id.in_(actor.projects())).group_by(ProcessingRun.status)).all()
        counts = dict(rows)
    return {"counts": counts, "review_count": 0, "review_module_available": False}


@app.post("/api/v1/jobs")
def submit(data: CreateRun, request: Request, actor: Actor = Depends(current_actor), key=Depends(key_header)):
    run, replayed = create_run(actor, data, key, request.state.request_id)
    from fastapi.encoders import jsonable_encoder
    return JSONResponse(status_code=200 if replayed else 202,
                        content=jsonable_encoder({"job": job_dto(run), "replayed": replayed}))


@app.get("/api/v1/jobs")
def jobs(actor: Actor = Depends(current_actor), limit: int = Query(20, ge=1, le=100),
         cursor: str | None = Query(None, max_length=512), status: str | None = None,
         kind: str | None = Query(None, max_length=64)):
    with Session() as db:
        query = select(ProcessingRun).where(ProcessingRun.project_id.in_(actor.projects()))
        if kind:
            query = query.where(ProcessingRun.kind == kind)
        if status:
            if status not in {"queued", "running", "retrying", "succeeded", "failed"}:
                raise Problem(422, "INVALID_STATUS", "未知任务状态。")
            query = query.where(ProcessingRun.status == status)
        rows, next_cursor = paginate(db, query, ProcessingRun, limit, cursor)
        return {"items": [job_dto(r) for r in rows], "next_cursor": next_cursor}


@app.get("/api/v1/jobs/{run_id}")
def job_detail(run_id: str, actor: Actor = Depends(current_actor)):
    with Session() as db:
        run = db.get(ProcessingRun, run_id)
        if not run:
            raise Problem(404, "NOT_FOUND", "任务不存在。")
        authorize(actor, "read", run.project_id)
        return job_dto(run)


@app.post("/api/v1/jobs/{run_id}/retry")
def retry(run_id: str, data: RetryRun, request: Request,
          actor: Actor = Depends(current_actor), key=Depends(key_header)):
    run, replayed = retry_run(actor, run_id, data.row_version, key, request.state.request_id)
    return {"job": job_dto(run), "replayed": replayed}


@app.get("/api/v1/assets/{asset_id}/content")
def asset_content(asset_id: str, actor: Actor = Depends(current_actor)):
    with Session() as db:
        asset = db.get(FileAsset, asset_id)
        if not asset:
            raise Problem(404, "NOT_FOUND", "文件不存在。")
        authorize(actor, "read", asset.project_id)
        from .modules.task_packages.service import guard_asset
        guard_asset(db, asset_id, actor)
        if asset.mime_type in {'text/csv', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}:
            authorize(actor, 'run', asset.project_id)
        if asset.availability != "available":
            raise Problem(410, "ASSET_UNAVAILABLE", "文件已撤回或暂不可用。")
        path = asset_path(asset.storage_key)
        if not path.is_file():
            raise Problem(404, "ASSET_MISSING", "文件缺失，请联系管理员。")
        if path.stat().st_size != asset.size or hashlib.sha256(path.read_bytes()).hexdigest() != asset.sha256:
            raise Problem(409, "ASSET_INTEGRITY_ERROR", "文件内容校验失败。")
        return FileResponse(path, media_type=asset.mime_type, filename=path.name)


@app.get("/api/v1/access")
def access(actor: Actor = Depends(current_actor)):
    projects = actor.projects("manage")
    if not projects:
        raise Problem(403, "FORBIDDEN", "只有项目管理员可以管理权限。")
    with Session() as db:
        users = db.scalars(select(UserLink)).all()
        bindings = db.scalars(select(RoleBinding).where(RoleBinding.scope_id.in_(projects))).all()
        return {"projects": [{"id": p, "name": PROJECTS[p]} for p in projects],
                "users": [{"id": u.id, "name": u.display_name,
                           "authorized_projects": sorted(set(u.authorized_projects) & set(projects))}
                          for u in users if set(u.authorized_projects) & set(projects)],
                "bindings": [{"id": b.id, "user_id": b.user_id, "role": b.role,
                              "project_id": b.scope_id, "row_version": b.row_version} for b in bindings]}


@app.post("/api/v1/role-bindings", status_code=201)
def add_binding(data: CreateBinding, request: Request, actor: Actor = Depends(current_actor)):
    authorize(actor, "manage", data.project_id)
    try:
        with Session.begin() as db:
            user = db.get(UserLink, data.user_id)
            if not user or data.project_id not in user.authorized_projects:
                raise Problem(403, "SCOPE_ESCALATION_DENIED", "B角色不能扩大来源系统授予的项目范围。")
            binding = RoleBinding(user_id=user.id, role=data.role, scope_type="project", scope_id=data.project_id)
            db.add(binding)
            db.flush()
            record(db, actor, "role_granted", "role_binding", binding.id, data.project_id, request.state.request_id, 1)
            return {"id": binding.id, "row_version": 1}
    except IntegrityError:
        raise Problem(409, "BINDING_EXISTS", "该项目角色已存在。")


@app.delete("/api/v1/role-bindings/{binding_id}")
def delete_binding(binding_id: str, data: DeleteBinding, request: Request,
                   actor: Actor = Depends(current_actor)):
    with Session.begin() as db:
        binding = db.scalar(select(RoleBinding).where(RoleBinding.id == binding_id).with_for_update())
        if not binding:
            raise Problem(404, "NOT_FOUND", "角色绑定不存在。")
        authorize(actor, "manage", binding.scope_id)
        if binding.role == "admin":
            raise Problem(409, "ADMIN_BINDING_PROTECTED", "演示管理员绑定由初始化管理，不能在此删除。")
        if binding.row_version != data.row_version:
            raise Problem(409, "VERSION_CONFLICT", "角色已更新，请刷新。")
        record(db, actor, "role_revoked", "role_binding", binding.id, binding.scope_id,
               request.state.request_id, binding.row_version)
        db.delete(binding)
    return {"deleted": True}


@app.get("/api/v1/audit-events")
def audit_events(actor: Actor = Depends(current_actor), limit: int = Query(20, ge=1, le=100),
                 cursor: str | None = Query(None, max_length=512)):
    projects = actor.projects("audit")
    if not projects:
        raise Problem(403, "FORBIDDEN", "当前身份无权查看操作记录。")
    with Session() as db:
        rows, next_cursor = paginate(db, select(AuditEvent).where(AuditEvent.project_id.in_(projects)),
                                    AuditEvent, limit, cursor)
        return {"items": [{"id": r.id, "action": r.action, "object_id": r.object_id,
                           "project_id": r.project_id, "created_at": r.created_at} for r in rows],
                "next_cursor": next_cursor}


from .modules.ingestion.api import router as ingestion_router
app.include_router(ingestion_router)
from .modules.retrieval.api import router as retrieval_router, integration_router
app.include_router(retrieval_router)
app.include_router(integration_router)
from .modules.extraction.api import router as extraction_router
app.include_router(extraction_router)
from .modules.knowledge.api import router as knowledge_router
app.include_router(knowledge_router)
from .modules.task_packages.api import router as package_router, integration_router as package_integration_router
app.include_router(package_router)
app.include_router(package_integration_router)
from .modules.retrospectives.api import router as retrospective_router
app.include_router(retrospective_router)
from .modules.training.api import router as training_router
app.include_router(training_router)
