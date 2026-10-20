"""Offline B00 semantic checks/reference ledger; NOT a server or auth system."""
from copy import deepcopy
from datetime import datetime
import hashlib
import json
from pathlib import Path
import sys
import re

sys.path.insert(0, str(Path(__file__).resolve().parent / "vendor"))
import rfc8785
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
FORMATS = FormatChecker()


@FORMATS.checks("date-time", raises=(ValueError, TypeError))
def check_datetime(value):
    """Explicit finite RFC3339 profile; stdlib rejects impossible dates."""
    if not isinstance(value, str):
        return True
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})", value):
        return False
    return datetime.fromisoformat(value.replace("Z", "+00:00")).tzinfo is not None


def load_json(path):
    def pairs(items):
        result = {}
        for key, value in items:
            if key in result:
                raise ValueError(f"Duplicate JSON key: {key}")
            result[key] = value
        return result
    return json.loads(Path(path).read_text(encoding="utf-8"), object_pairs_hook=pairs,
                      parse_constant=lambda value: (_ for _ in ()).throw(ValueError(f"Non-finite: {value}")))


def canonical_bytes(package):
    result = deepcopy(package)
    result.pop("exported_at", None)
    for asset in result.get("attachments", []):
        asset.pop("access_ref", None)
    return rfc8785.dumps(result)


def content_hash(package):
    return hashlib.sha256(canonical_bytes(package)).hexdigest()


def validate(schema_name, value):
    schema = load_json(ROOT / schema_name)
    errors = [f"schema:{'/'.join(map(str, e.absolute_path))}:{e.message}"
              for e in Draft202012Validator(schema, format_checker=FORMATS).iter_errors(value)]
    warnings = []
    if errors:
        return errors, warnings
    limits = load_json(ROOT / "limits.json")
    count = 0

    def walk(v, depth=0):
        nonlocal count
        count += 1
        if depth > limits["json_depth"]:
            raise ValueError("json_depth")
        if count > limits["json_nodes"]:
            raise ValueError("json_nodes")
        if isinstance(v, str) and len(v) > limits["text_characters"]:
            raise ValueError("text_characters")
        if isinstance(v, dict):
            for k, item in v.items():
                if len(k) > 128:
                    raise ValueError("json_key_length")
                walk(item, depth + 1)
        elif isinstance(v, list):
            for item in v:
                walk(item, depth + 1)
    try:
        walk(value)
        # JCS also rejects unsafe integers, non-finite numbers and lone surrogates.
        rfc8785.dumps(value)
        if len(json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8")) > limits["request_bytes"]:
            errors.append("payload_too_large")
    except (ValueError, UnicodeError, rfc8785.CanonicalizationError) as exc:
        errors.append(f"json_domain:{exc}")
    if errors:
        return errors, warnings

    if schema_name in {"task-package.schema.json", "knowledge-query.schema.json"}:
        scenes = {item["code"] for item in load_json(ROOT / "scene-codes.json")["items"]}
        if value["scene_code"] not in scenes:
            errors.append("unregistered_scene")

    if schema_name == "task-package.schema.json":
        indexes = {}
        for collection, field in [("participants", "actor_id"), ("events", "event_id"),
                                   ("issues", "issue_id"), ("attachments", "attachment_id")]:
            ids = [item[field] for item in value[collection]]
            if len(ids) != len(set(ids)):
                errors.append(f"duplicate_id:{collection}")
            indexes[collection] = set(ids)
        if value["task_id"] in indexes["issues"]:
            errors.append("ambiguous_related_object_id")
        completeness = value["data_completeness"]
        known_events = {item["code"] for item in load_json(ROOT / "event-types.json")["items"]}
        for collection in ["participants", "events", "issues", "attachments"]:
            state = completeness[collection]
            if state in {"missing", "not_applicable"} and value[collection]:
                errors.append(f"completeness_conflict:{collection}")
        if completeness["attachments"] == "missing":
            warnings.append("missing_attachments")
        if not value["events"]:
            warnings.append("no_process_events")
        missing_times = any(event["occurred_at"] is None for event in value["events"])
        if missing_times:
            warnings.append("missing_event_time")
        if completeness["event_times"] == "complete" and (missing_times or not value["events"]):
            errors.append("completeness_conflict:event_times")
        if completeness["event_times"] in {"missing", "not_applicable"} and any(
                e["occurred_at"] is not None for e in value["events"]):
            errors.append("completeness_conflict:event_times")
        for event in value["events"]:
            if event["event_type"] not in known_events:
                warnings.append("unknown_event_type")
            if event["actor_id"] is not None and event["actor_id"] not in indexes["participants"]:
                errors.append("dangling_actor")
            if event["related_object_id"] not in {value["task_id"]} | indexes["issues"]:
                errors.append("dangling_related_object")
        for item in value["events"] + value["issues"]:
            if not set(item["evidence_refs"]).issubset(indexes["attachments"]):
                errors.append("dangling_evidence")
        for issue in value["issues"]:
            if issue["responsible_actor_id"] is not None and issue["responsible_actor_id"] not in indexes["participants"]:
                errors.append("dangling_responsible_actor")
        if sum(a["size"] for a in value["attachments"]) > limits["total_attachment_bytes"]:
            errors.append("total_attachments_too_large")
        start, end = value["task"]["started_at"], value["task"]["completed_at"]
        if start and end and datetime.fromisoformat(start.replace("Z", "+00:00")) > datetime.fromisoformat(end.replace("Z", "+00:00")):
            errors.append("task_time_inverted")
    elif schema_name == "knowledge-response.schema.json":
        ids = [c["citation_id"] for c in value["citations"]]
        if len(ids) != len(set(ids)):
            errors.append("duplicate_citation")
        for item in value["answer_blocks"] + value["checkpoints"] + value["cases"]:
            if not set(item["citation_ids"]).issubset(set(ids)):
                errors.append("dangling_citation")
        content = value["answer_blocks"] + value["checkpoints"] + value["cases"]
        if value["status"] == "answered" and not content:
            errors.append("empty_answer")
        if value["status"] == "insufficient_evidence" and content:
            errors.append("insufficient_with_claims")
        if value["citations"] and value["knowledge_release_id"] is None:
            errors.append("citations_without_release")
        if value["status"] == "degraded" and not value["warnings"]:
            errors.append("degraded_without_reason")
    elif schema_name == "task-receipt.schema.json":
        if not value["status_url"].endswith("/" + value["receipt_id"]):
            errors.append("receipt_url_mismatch")
    elif schema_name == "task-status.schema.json":
        if value["status"] == "withdrawn" and value["capabilities"]:
            errors.append("withdrawn_with_capabilities")
        if value["status"] == "failed" and not value["validation_errors"]:
            errors.append("failure_without_reason")
        if {"complete_timeline", "partial_timeline"}.issubset(value["capabilities"]):
            errors.append("conflicting_capabilities")
    return errors, sorted(set(warnings))


class ReferenceLedger:
    """In-memory acceptance oracle for contract examples, no HTTP/DB/worker."""

    def __init__(self):
        self.by_key = {}
        self.by_version = {}
        self.by_package = {}
        self.latest_received = {}
        self.active = {}

    def submit(self, package, key, principal="service-demo", projects=None, org="org-demo"):
        # Simulates a trusted caller's project grants, NOT token verification.
        projects = {"project-demo"} if projects is None else projects
        if package.get("project_id") not in projects or package.get("org_id") != org:
            return {"status": 403, "code": "FORBIDDEN"}
        errors, _ = validate("task-package.schema.json", package)
        if errors:
            return {"status": 422, "code": "VALIDATION_ERROR"}
        digest = content_hash(package)
        idem = (principal, package["producer"], "submitTaskPackage", key)
        identity = (package["producer"], package["task_id"], package["package_version"])
        pid = (package["producer"], package["package_id"])
        if idem in self.by_key:
            prior_digest, record = self.by_key[idem]
            if prior_digest != digest:
                return {"status": 409, "code": "IDEMPOTENCY_CONFLICT"}
            return {"status": 200, "record": record}
        if identity in self.by_version:
            record = self.by_version[identity]
            if record["digest"] != digest:
                return {"status": 409, "code": "PACKAGE_VERSION_CONFLICT"}
            self.by_key[idem] = (digest, record)
            return {"status": 200, "record": record}
        if pid in self.by_package:
            return {"status": 409, "code": "PACKAGE_ID_CONFLICT"}
        record = {"digest": digest, "identity": identity, "withdrawn": False, "ready": False}
        self.by_version[identity] = record
        self.by_package[pid] = record
        self.by_key[idem] = (digest, record)
        task = identity[:2]
        self.latest_received[task] = max(identity[2], self.latest_received.get(task, 0))
        return {"status": 202, "record": record}

    def mark_ready(self, identity):
        record = self.by_version[identity]
        if record["withdrawn"]:
            return False
        record["ready"] = True
        task = identity[:2]
        if identity[2] > self.active.get(task, 0):
            self.active[task] = identity[2]
        return True

    def withdraw(self, identity):
        record = self.by_version[identity]
        record["withdrawn"] = True
        if self.active.get(identity[:2]) == identity[2]:
            self.active.pop(identity[:2])
        # Do not auto-reactivate an older snapshot.
