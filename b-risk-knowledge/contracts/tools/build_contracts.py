"""Authoring source for generated B00 schemas, OpenAPI and synthetic examples.

Run with the contract venv. Generates only named machine artifacts, not prose,
tests, or reports. Edit this source before regenerating those artifacts.
"""
from copy import deepcopy
from pathlib import Path
import json
import sys
import yaml
sys.path.insert(0, str(Path(__file__).resolve().parent / "vendor"))
import rfc8785
import hashlib

ROOT = Path(__file__).resolve().parents[1]
DIALECT = "https://json-schema.org/draft/2020-12/schema"


def string(maximum=128, minimum=1, **kw):
    return {"type": "string", "minLength": minimum, "maxLength": maximum, **kw}


def obj(properties, required=None):
    return {"type": "object", "properties": properties,
            "required": list(properties) if required is None else required,
            "additionalProperties": False}


def array(items, maximum=1000, minimum=0, unique=False):
    out = {"type": "array", "items": items, "minItems": minimum, "maxItems": maximum}
    if unique:
        out["uniqueItems"] = True
    return out


def enum(*values):
    return {"type": "string", "enum": list(values)}


def nullable(value):
    return {"anyOf": [value, {"type": "null"}]}


ID = string(pattern=r"^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$")
UUID = string(36, format="uuid")
TIME = string(40, format="date-time", pattern=r"(Z|[+-][0-9]{2}:[0-9]{2})$")
TEXT = string(20000)
CODE = string(64, pattern=r"^[a-z][a-z0-9_]{0,63}$")
EXT = {"type": "object", "maxProperties": 32,
       "propertyNames": {"pattern": r"^[a-z][a-z0-9_]*\.[a-z][a-z0-9_.]*$"},
       "additionalProperties": True}
WARNING = obj({"code": CODE, "path": string(512, 0), "message": string(2000)})
REFS = array(ID, 1000, unique=True)
EVENTS = [
    ("task_started", "任务开始"), ("inspection_recorded", "检查记录"),
    ("issue_created", "发现问题"), ("rectification_submitted", "提交整改"),
    ("review_rejected", "复核退回"), ("review_accepted", "复核通过"),
    ("task_completed", "任务完成"),
]
SCENES = [("lifting_supervision", "吊装旁站"), ("fire_inspection", "消防检查"),
          ("structural_inspection", "结构检查"), ("mep_inspection", "机电检查"),
          ("general_inspection", "一般巡查")]
EVENT = obj({
    "event_id": ID, "event_type": CODE, "occurred_at": nullable(TIME),
    "actor_id": nullable(ID), "actor_role": string(64),
    "related_object_id": ID,
    "payload": {"type": "object", "maxProperties": 64, "additionalProperties": True},
    "evidence_refs": REFS,
})
PARTICIPANT = obj({"actor_id": ID, "role": string(64)})
ISSUE = obj({
    "issue_id": ID, "description": TEXT,
    "status": enum("open", "rectifying", "pending_review", "closed", "unknown"),
    "responsible_actor_id": nullable(ID), "due_at": nullable(TIME),
    "rectification": nullable(TEXT), "review_conclusion": nullable(TEXT),
    "evidence_refs": REFS,
})
ATTACHMENT = obj({
    "attachment_id": ID,
    "sha256": string(64, pattern=r"^[0-9a-f]{64}$"),
    "mime_type": string(128, pattern=r"^[a-z0-9.+-]+/[a-z0-9.+-]+$"),
    "size": {"type": "integer", "minimum": 0, "maximum": 104857600},
    "evidence_type": enum("site_photo", "text_screenshot", "source_document",
                          "video", "other", "unknown"),
    "access_ref": obj({"connector_id": ID, "object_id": ID}),
})
COMPLETE = enum("complete", "partial", "missing", "not_applicable")
package = obj({
    "schema_version": {"const": "1.0"},
    "producer": ID, "package_id": ID, "task_id": ID,
    "package_version": {"type": "integer", "minimum": 1, "maximum": 9007199254740991},
    "exported_at": TIME, "project_id": ID, "org_id": ID, "scene_code": CODE,
    "task": obj({"name": string(500), "status": enum("completed", "cancelled", "archived"),
                 "started_at": nullable(TIME), "completed_at": nullable(TIME)}),
    "participants": array(PARTICIPANT, 200),
    "events": array(EVENT, 10000),
    "issues": array(ISSUE, 2000),
    "attachments": array(ATTACHMENT, 200),
    "data_completeness": obj({key: COMPLETE for key in
                              ["participants", "events", "issues", "attachments", "event_times"]}),
    "is_demo": {"type": "boolean"}, "extensions": EXT,
}, required=["schema_version", "producer", "package_id", "task_id", "package_version",
             "exported_at", "project_id", "org_id", "scene_code", "task", "participants",
             "events", "issues", "attachments", "data_completeness", "is_demo"])

SCALAR = {"anyOf": [string(2000, 0), {"type": "number"}, {"type": "boolean"}, {"type": "null"}]}
query = obj({
    "request_id": ID, "project_id": ID, "task_id": nullable(ID), "scene_code": CODE,
    "question": string(4000),
    "context": obj({"object_type": CODE, "stage": enum("preparation", "execution", "review", "training"),
                    "conditions": {"type": "object", "maxProperties": 32,
                                   "propertyNames": CODE, "additionalProperties": SCALAR}}),
    "output_types": array(enum("answer", "checkpoints", "cases"), 3, 1, True),
    "limit": {"type": "integer", "minimum": 1, "maximum": 20},
    "extensions": EXT,
}, required=["request_id", "project_id", "scene_code", "question", "context", "output_types", "limit"])

locator = obj({
    "page": {"type": "integer", "minimum": 1},
    "table": {"type": "integer", "minimum": 1},
    "row": {"type": "integer", "minimum": 1}, "cell": string(128),
    "event_id": ID, "source_record_id": ID, "section": string(500),
}, required=[])
locator["minProperties"] = 1
citation = obj({
    "citation_id": ID, "knowledge_revision_id": UUID, "evidence_id": UUID,
    "source_title": string(500), "locator": locator,
    "review_status": enum("approved", "published"),
})
block = obj({"text": TEXT, "citation_ids": array(ID, 100, 1, True)})
checkpoint = obj({"checkpoint_id": ID, "text": TEXT, "citation_ids": array(ID, 100, 1, True)})
case = obj({"knowledge_revision_id": UUID, "title": string(500), "summary": TEXT,
            "citation_ids": array(ID, 100, 1, True)})
query_response = obj({
    "query_id": UUID, "status": enum("answered", "insufficient_evidence", "degraded"),
    "knowledge_release_id": nullable(UUID),
    "answer_blocks": array(block, 100), "checkpoints": array(checkpoint, 100),
    "cases": array(case, 20), "citations": array(citation, 200),
    "missing_conditions": array(string(500), 100, unique=True),
    "warnings": array(WARNING, 100),
})
STATUS = enum("received", "validating", "processing", "ready", "failed", "withdrawn")
PATH = string(200, pattern=r"^/integration/v1/task-packages/[0-9a-f-]{36}$")
receipt = obj({
    "receipt_id": UUID, "job_id": UUID, "status": STATUS, "status_url": PATH,
    "replayed": {"type": "boolean"},
})
status = obj({
    "receipt_id": UUID, "job_id": UUID, "status": STATUS,
    "is_current": {"type": "boolean"},
    "validation_errors": array(WARNING, 100),
    "missing_fields": array(string(512), 100, unique=True),
    "warnings": array(WARNING, 100),
    "retrospective_id": nullable(UUID),
    "capabilities": array(enum("historical_summary", "partial_timeline", "complete_timeline"), 3, unique=True),
})
withdraw = obj({"reason": string(2000)})
withdraw_response = obj({"receipt_id": UUID, "status": {"const": "withdrawn"},
                         "withdrawn_at": TIME, "replayed": {"type": "boolean"}})
error = obj({"code": string(128, pattern=r"^[A-Z][A-Z0-9_]+$"), "message": string(2000),
             "details": array(WARNING, 100), "request_id": ID})
SCHEMAS = {
    "task-package": package, "knowledge-query": query,
    "knowledge-response": query_response, "task-receipt": receipt,
    "task-status": status, "withdraw-request": withdraw,
    "withdraw-response": withdraw_response, "error": error,
}


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


def content_hash(value):
    projected = deepcopy(value)
    projected.pop("exported_at", None)
    for item in projected.get("attachments", []):
        item.pop("access_ref", None)
    return hashlib.sha256(rfc8785.dumps(projected)).hexdigest()


def main():
    ROOT.mkdir(parents=True, exist_ok=True)
    for name, body in SCHEMAS.items():
        write_json(ROOT / f"{name}.schema.json",
                   {"$schema": DIALECT, "title": name, "x-contract-status": "proposed", **body})
    write_json(ROOT / "event-types.json", {"version": "1.0", "status": "proposed",
               "unknown_policy": "retain_and_warn",
               "items": [{"code": code, "label": label} for code, label in EVENTS]})
    write_json(ROOT / "scene-codes.json", {"version": "1.0", "status": "proposed",
               "unknown_policy": "reject_unregistered",
               "items": [{"code": code, "label": label} for code, label in SCENES]})
    write_json(ROOT / "limits.json", {
        "status": "proposed", "profile": "1.0-default", "request_bytes": 5242880,
        "attachment_bytes": 104857600, "attachments_per_package": 200,
        "total_attachment_bytes": 1073741824, "events_per_package": 10000,
        "issues_per_package": 2000, "query_characters": 4000, "query_limit": 20,
        "text_characters": 20000, "json_depth": 20, "json_nodes": 300000,
        "idempotency_key_characters": 128,
    })
    examples = {}
    p = {
        "schema_version": "1.0", "producer": "a-demo", "package_id": "pkg-demo-1",
        "task_id": "task-demo", "package_version": 1, "exported_at": "2026-10-20T10:00:00+08:00",
        "project_id": "project-demo", "org_id": "org-demo", "scene_code": "lifting_supervision",
        "task": {"name": "演示吊装旁站任务（模拟）", "status": "completed",
                 "started_at": "2026-10-19T08:00:00+08:00", "completed_at": "2026-10-19T10:00:00+08:00"},
        "participants": [{"actor_id": "user-demo", "role": "supervisor"}],
        "events": [
            {"event_id": "event-start", "event_type": "task_started",
             "occurred_at": "2026-10-19T08:00:00+08:00", "actor_id": "user-demo",
             "actor_role": "supervisor", "related_object_id": "task-demo", "payload": {}, "evidence_refs": []},
            {"event_id": "event-end", "event_type": "task_completed",
             "occurred_at": "2026-10-19T10:00:00+08:00", "actor_id": "user-demo",
             "actor_role": "supervisor", "related_object_id": "task-demo",
             "payload": {"note": "仅供合同测试，无实际工程结论"}, "evidence_refs": ["attachment-demo"]},
        ],
        "issues": [],
        "attachments": [{"attachment_id": "attachment-demo", "sha256": "a" * 64,
                         "mime_type": "image/jpeg", "size": 1024, "evidence_type": "site_photo",
                         "access_ref": {"connector_id": "demo-store", "object_id": "demo-object"}}],
        "data_completeness": {"participants": "complete", "events": "complete", "issues": "not_applicable",
                              "attachments": "complete", "event_times": "complete"},
        "is_demo": True,
    }
    examples["package-valid"] = ("task-package", p, True, [])
    missing = deepcopy(p)
    missing["events"][0]["occurred_at"] = None
    missing["data_completeness"]["event_times"] = "partial"
    examples["package-no-time"] = ("task-package", missing, True, ["missing_event_time"])
    no_asset = deepcopy(p)
    no_asset["attachments"] = []
    no_asset["events"][1]["evidence_refs"] = []
    no_asset["data_completeness"]["attachments"] = "missing"
    examples["package-missing-attachments"] = ("task-package", no_asset, True, ["missing_attachments"])
    unknown = deepcopy(p)
    unknown["events"][1]["event_type"] = "custom_observation"
    examples["package-unknown-event"] = ("task-package", unknown, True, ["unknown_event_type"])
    examples["package-repeat"] = ("task-package", deepcopy(p), True, [])
    changed = deepcopy(p)
    changed["task"]["name"] = "同版本的不同内容（预期冲突）"
    examples["package-same-version-conflict"] = ("task-package", changed, True, [])
    v2 = deepcopy(p)
    v2["package_id"] = "pkg-demo-2"
    v2["package_version"] = 2
    examples["package-v2"] = ("task-package", v2, True, [])
    examples["package-old-arrival"] = ("task-package", deepcopy(p), True, [])
    invalid = deepcopy(p)
    invalid.pop("project_id")
    examples["package-invalid-missing-project"] = ("task-package", invalid, False, [])
    broken = deepcopy(p)
    broken["events"][1]["evidence_refs"] = ["nonexistent-attachment"]
    examples["package-invalid-reference"] = ("task-package", broken, False, [])
    bad_time = deepcopy(p)
    bad_time["events"][0]["occurred_at"] = "2026-10-19T08:00:00"
    examples["package-invalid-timezone"] = ("task-package", bad_time, False, [])
    q = {"request_id": "req-demo-001", "project_id": "project-demo", "task_id": None,
         "scene_code": "lifting_supervision", "question": "本次旁站有哪些历史案例可以参考？",
         "context": {"object_type": "lifting", "stage": "preparation", "conditions": {}},
         "output_types": ["answer", "cases"], "limit": 5}
    examples["query-valid"] = ("knowledge-query", q, True, [])
    qbad = deepcopy(q)
    qbad["limit"] = 21
    examples["query-invalid-limit"] = ("knowledge-query", qbad, False, [])
    uid = "11111111-1111-4111-8111-111111111111"
    uid2 = "22222222-2222-4222-8222-222222222222"
    ans = {
        "query_id": uid, "status": "answered", "knowledge_release_id": uid2,
        "answer_blocks": [{"text": "此为合同演示案例，不构成工程指导。", "citation_ids": ["cite-demo"]}],
        "checkpoints": [], "cases": [],
        "citations": [{"citation_id": "cite-demo", "knowledge_revision_id": uid,
                      "evidence_id": uid2, "source_title": "模拟报告", "locator": {"page": 1},
                      "review_status": "approved"}],
        "missing_conditions": [], "warnings": [],
    }
    examples["response-answered"] = ("knowledge-response", ans, True, [])
    insufficient = deepcopy(ans)
    insufficient.update(status="insufficient_evidence", knowledge_release_id=None,
                        answer_blocks=[], citations=[], missing_conditions=["无可用授权证据"])
    examples["response-no-evidence"] = ("knowledge-response", insufficient, True, [])
    degraded = deepcopy(ans)
    degraded.update(status="degraded", answer_blocks=[],
                    warnings=[{"code": "generation_failed", "path": "", "message": "模型不可用，仅返回证据"}])
    examples["response-degraded"] = ("knowledge-response", degraded, True, [])
    invalid_cite = deepcopy(ans)
    invalid_cite["answer_blocks"][0]["citation_ids"] = ["missing-citation"]
    examples["response-invalid-citation"] = ("knowledge-response", invalid_cite, False, [])
    rec = {"receipt_id": uid, "job_id": uid2, "status": "received",
           "status_url": f"/integration/v1/task-packages/{uid}", "replayed": False}
    examples["receipt-accepted"] = ("task-receipt", rec, True, [])
    stat = {"receipt_id": uid, "job_id": uid2, "status": "ready", "is_current": True,
            "validation_errors": [], "missing_fields": [], "warnings": [],
            "retrospective_id": None, "capabilities": ["historical_summary", "complete_timeline"]}
    examples["status-ready"] = ("task-status", stat, True, [])
    partial = deepcopy(stat)
    partial.update(capabilities=["historical_summary", "partial_timeline"],
                   missing_fields=["attachments/attachment-demo"],
                   warnings=[{"code": "attachment_unavailable", "path": "/attachments/0", "message": "模拟下载失败"}])
    examples["status-partial-evidence"] = ("task-status", partial, True, [])
    examples["withdraw-request"] = ("withdraw-request", {"reason": "模拟数据撤回"}, True, [])
    examples["withdraw-response"] = ("withdraw-response", {
        "receipt_id": uid, "status": "withdrawn", "withdrawn_at": "2026-10-20T11:00:00+08:00",
        "replayed": False}, True, [])
    examples["error-conflict"] = ("error", {
        "code": "PACKAGE_VERSION_CONFLICT", "message": "同版本内容不同，请提交更高版本",
        "details": [], "request_id": "req-demo-001"}, True, [])
    manifest = []
    for name, (schema, value, valid, warnings) in examples.items():
        write_json(ROOT / "examples" / f"{name}.json", value)
        manifest.append({"file": f"{name}.json", "schema": f"{schema}.schema.json",
                         "valid": valid, "expected_warnings": warnings})
    write_json(ROOT / "examples" / "manifest.json", manifest)
    # Fixed hash vector: consumed, never recomputed as expected by validation tests.
    write_json(ROOT / "examples" / "hash-vectors.json", {
        "algorithm": "sha256-jcs-task-package-v1",
        "vectors": [{"file": "package-valid.json", "sha256": content_hash(p)}],
    })
    write_json(ROOT / "examples" / "state-scenarios.json", [
        {"name": "same-key-same-body", "steps": [
            {"file": "package-valid.json", "key": "k1", "expected_status": 202, "current": 1},
            {"file": "package-repeat.json", "key": "k1", "expected_status": 200, "current": 1}]},
        {"name": "same-version-new-key", "steps": [
            {"file": "package-valid.json", "key": "k1", "expected_status": 202, "current": 1},
            {"file": "package-repeat.json", "key": "k2", "expected_status": 200, "current": 1}]},
        {"name": "same-key-different-content", "steps": [
            {"file": "package-valid.json", "key": "k1", "expected_status": 202, "current": 1},
            {"file": "package-same-version-conflict.json", "key": "k1", "expected_status": 409,
             "expected_code": "IDEMPOTENCY_CONFLICT", "current": 1}]},
        {"name": "same-version-different-content", "steps": [
            {"file": "package-valid.json", "key": "k1", "expected_status": 202, "current": 1},
            {"file": "package-same-version-conflict.json", "key": "k2", "expected_status": 409,
             "expected_code": "PACKAGE_VERSION_CONFLICT", "current": 1}]},
        {"name": "new-version", "steps": [
            {"file": "package-valid.json", "key": "k1", "expected_status": 202, "current": 1},
            {"file": "package-v2.json", "key": "k2", "expected_status": 202, "current": 2}]},
        {"name": "old-arrives-late", "steps": [
            {"file": "package-v2.json", "key": "k2", "expected_status": 202, "current": 2},
            {"file": "package-old-arrival.json", "key": "k1", "expected_status": 202, "current": 2}]},
    ])

    names = {n: "".join(x.title() for x in n.split("-")) for n in SCHEMAS}

    def ref(name):
        return {"$ref": f"#/components/schemas/{names[name]}"}

    def response(name, description, example):
        return {"description": description, "content": {"application/json": {
            "schema": ref(name), "example": deepcopy(examples[example][1])}}}

    errors = {str(code): response("error", label, "error-conflict") for code, label in [
        (400, "Malformed JSON / duplicate keys"), (401, "Missing or invalid identity"),
        (403, "Insufficient scope"), (404, "Resource not available"),
        (409, "Identity, version or idempotency conflict"),
        (413, "Request exceeds byte limit"), (422, "Schema or semantic validation failure"),
        (429, "Rate limited"), (503, "Required dependency unavailable")]}
    # Give error examples accurate codes rather than copying conflict to every status.
    for code, item in errors.items():
        item["content"]["application/json"]["example"]["code"] = {
            "400": "INVALID_JSON", "401": "UNAUTHENTICATED", "403": "FORBIDDEN",
            "404": "NOT_FOUND", "409": "PACKAGE_VERSION_CONFLICT", "413": "PAYLOAD_TOO_LARGE",
            "422": "VALIDATION_ERROR", "429": "RATE_LIMITED", "503": "DEPENDENCY_UNAVAILABLE",
        }[code]
        item["content"]["application/json"]["example"]["message"] = item["description"]

    def operation(opid, schema=None, example=None, idem=False, path_param=False):
        op = {"operationId": opid, "x-contract-status": "proposed", "responses": deepcopy(errors)}
        params = []
        if idem:
            params.append({"name": "Idempotency-Key", "in": "header", "required": True,
                           "schema": string(128, pattern=r"^[A-Za-z0-9][A-Za-z0-9_.:-]*$")})
        if path_param:
            params.append({"name": "receipt_id", "in": "path", "required": True, "schema": UUID})
        if params:
            op["parameters"] = params
        if schema:
            op["requestBody"] = {"required": True, "content": {"application/json": {
                "schema": ref(schema), "example": deepcopy(examples[example][1])}}}
        return op

    qop = operation("queryKnowledge", "knowledge-query", "query-valid")
    qop["responses"]["200"] = response("knowledge-response", "Answer, insufficient evidence or degraded", "response-answered")
    pop = operation("submitTaskPackage", "task-package", "package-valid", idem=True)
    pop["responses"]["202"] = response("task-receipt", "New package accepted for processing", "receipt-accepted")
    pop["responses"]["200"] = response("task-receipt", "Existing receipt returned without new processing", "receipt-accepted")
    pop["responses"]["200"]["content"]["application/json"]["example"]["replayed"] = True
    sop = operation("getTaskPackageStatus", path_param=True)
    sop["responses"]["200"] = response("task-status", "Current processing status", "status-ready")
    wop = operation("withdrawTaskPackage", "withdraw-request", "withdraw-request", idem=True, path_param=True)
    wop["responses"]["200"] = response("withdraw-response", "Access blocked; downstream invalidation may still run", "withdraw-response")
    spec = {
        "openapi": "3.1.0", "jsonSchemaDialect": DIALECT,
        "info": {"title": "B模块集成合同（proposed）", "version": "0.1.0",
                 "description": "B00本地合同，未实现服务、未与A联调。Bearer传输方案待确认。"},
        "x-contract-status": "proposed",
        "security": [{"BearerAuth": []}],
        "paths": {
            "/integration/v1/knowledge/query": {"post": qop},
            "/integration/v1/task-packages": {"post": pop},
            "/integration/v1/task-packages/{receipt_id}": {"get": sop},
            "/integration/v1/task-packages/{receipt_id}/withdraw": {"post": wop},
        },
        "components": {
            "securitySchemes": {"BearerAuth": {"type": "http", "scheme": "bearer",
                                              "description": "可信用户或服务令牌；issuer/audience/代用户方式待A确认"}},
            "schemas": {names[n]: deepcopy(v) for n, v in SCHEMAS.items()},
        },
    }
    (ROOT / "openapi-integration.yaml").write_text(
        yaml.safe_dump(spec, allow_unicode=True, sort_keys=False), encoding="utf-8", newline="\n")
    print(f"Generated {len(SCHEMAS)} schemas, {len(examples)} examples, OpenAPI and dictionaries.")


if __name__ == "__main__":
    main()
