"""Repeatable offline contract verification. Does not start any business service."""
from copy import deepcopy
from datetime import datetime, timezone
from pathlib import Path
from importlib.metadata import version
import hashlib
import json
import sys
import tempfile

import yaml
from jsonschema import Draft202012Validator

from contract_rules import ROOT, FORMATS, ReferenceLedger, canonical_bytes, content_hash, load_json, validate

results = []


def check(name, fn):
    try:
        fn()
        results.append({"name": name, "passed": True})
    except Exception as exc:
        results.append({"name": name, "passed": False, "error": str(exc)})


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def main():
    for path in sorted(ROOT.glob("*.schema.json")):
        check("schema:" + path.name, lambda path=path: Draft202012Validator.check_schema(load_json(path)))
    spec = yaml.safe_load((ROOT / "openapi-integration.yaml").read_text(encoding="utf-8"))
    official_schema = load_json(ROOT / "tools/vendor/openapi-3.1-schema.json")
    check("openapi:official-meta-schema",
          lambda: Draft202012Validator(official_schema, format_checker=FORMATS).validate(spec))

    def references():
        def walk(value):
            if isinstance(value, dict):
                if "$ref" in value:
                    ref = value["$ref"]
                    require(ref.startswith("#/"), "Unexpected external OpenAPI reference")
                    target = spec
                    for key in ref[2:].split("/"):
                        target = target[key.replace("~1", "/").replace("~0", "~")]
                for item in value.values():
                    walk(item)
            elif isinstance(value, list):
                for item in value:
                    walk(item)
        walk(spec)
    check("openapi:all-references-resolve", references)

    def schema_parity():
        for path in ROOT.glob("*.schema.json"):
            schema = load_json(path)
            for key in ["$schema", "title", "x-contract-status"]:
                schema.pop(key, None)
            name = "".join(part.title() for part in path.name.removesuffix(".schema.json").split("-"))
            require(schema == spec["components"]["schemas"][name], f"Schema drift: {name}")
    check("openapi:standalone-schema-parity", schema_parity)

    def inline_examples():
        for path, methods in spec["paths"].items():
            for method, operation in methods.items():
                bodies = []
                if "requestBody" in operation:
                    bodies.append(operation["requestBody"])
                bodies.extend(operation["responses"].values())
                for body in bodies:
                    for media in body.get("content", {}).values():
                        if "example" in media:
                            name = media["schema"]["$ref"].split("/")[-1]
                            schema = spec["components"]["schemas"][name]
                            Draft202012Validator(schema, format_checker=FORMATS).validate(media["example"])
        require(len(spec["paths"]) == 4, "Expected four integration paths")
    check("openapi:all-inline-examples", inline_examples)

    for example in load_json(ROOT / "examples" / "manifest.json"):
        def run(example=example):
            errors, warnings = validate(example["schema"], load_json(ROOT / "examples" / example["file"]))
            require((not errors) == example["valid"], f"Expected valid={example['valid']}; errors={errors}")
            require(set(example["expected_warnings"]).issubset(warnings), f"Missing warning: {warnings}")
        check("fixture:" + example["file"], run)

    base = load_json(ROOT / "examples/package-valid.json")
    for scenario in load_json(ROOT / "examples/state-scenarios.json"):
        def run(scenario=scenario):
            ledger = ReferenceLedger()
            for step in scenario["steps"]:
                p = load_json(ROOT / "examples" / step["file"])
                actual = ledger.submit(p, step["key"])
                require(actual["status"] == step["expected_status"], str(actual))
                if "expected_code" in step:
                    require(actual["code"] == step["expected_code"], str(actual))
                require(ledger.latest_received[(p["producer"], p["task_id"])] == step["current"],
                        "Latest received version was overwritten incorrectly")
        check("state:" + scenario["name"], run)

    def fixed_hash():
        for vector in load_json(ROOT / "examples/hash-vectors.json")["vectors"]:
            require(content_hash(load_json(ROOT / "examples" / vector["file"])) == vector["sha256"],
                    "Fixed hash mismatch; do not regenerate expected values just to pass")
    check("hash:fixed-vector", fixed_hash)
    check("hash:sha256-library-known-vector",
          lambda: require(hashlib.sha256(b"abc").hexdigest() ==
                          "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
                          "SHA256 known vector mismatch"))

    def hash_invariants():
        p = deepcopy(base)
        p["exported_at"] = "2026-10-20T12:00:00+08:00"
        p["attachments"][0]["access_ref"]["object_id"] = "refreshed-object"
        require(content_hash(p) == content_hash(base), "Transport fields changed identity")
        require(content_hash(dict(reversed(list(base.items())))) == content_hash(base), "Key order changed hash")
        require(canonical_bytes({"z": 1.0, "a": "中", "attachments": []}) ==
                '{"a":"中","attachments":[],"z":1}'.encode("utf-8"), "JCS numeric/UTF8 mismatch")
        p = deepcopy(base)
        p["events"].reverse()
        require(content_hash(p) != content_hash(base), "Array order must remain significant")
        p = deepcopy(base)
        p["task"]["name"] += "更正"
        require(content_hash(p) != content_hash(base), "Business change missed")
    check("hash:invariants-and-jcs-bytes", hash_invariants)

    def mutation(name, mutate, schema="task-package.schema.json", source=None):
        def run():
            p = deepcopy(base if source is None else source)
            mutate(p)
            errors, _ = validate(schema, p)
            require(bool(errors), "Invalid mutation unexpectedly accepted")
        check("negative:" + name, run)

    mutation("duplicate-event-id", lambda p: p["events"].append(deepcopy(p["events"][0])))
    mutation("dangling-actor", lambda p: p["events"][0].update(actor_id="missing-person"))
    mutation("dangling-object", lambda p: p["events"][0].update(related_object_id="missing-object"))
    mutation("unknown-top-level-field", lambda p: p.update(allowed_projects=["anything"]))
    mutation("unsupported-schema-version", lambda p: p.update(schema_version="2.0"))
    mutation("unregistered-scene", lambda p: p.update(scene_code="unregistered"))
    mutation("contradictory-completeness", lambda p: p["data_completeness"].update(events="missing"))
    mutation("timezone-with-impossible-date", lambda p: p.update(exported_at="2026-02-30T10:00:00+08:00"))
    mutation("inverted-task-time", lambda p: p["task"].update(completed_at="2026-10-18T08:00:00+08:00"))
    mutation("unsafe-file-path", lambda p: p["attachments"][0]["access_ref"].update(object_id=r"D:\secret.txt"))
    mutation("unsafe-url", lambda p: p["attachments"][0]["access_ref"].update(object_id="https://example.invalid/a"))
    mutation("attachment-over-limit", lambda p: p["attachments"][0].update(size=104857601))
    mutation("oversized-nested-text", lambda p: p["events"][0]["payload"].update(note="x" * 20001))
    mutation("unsafe-jcs-integer", lambda p: p["events"][0]["payload"].update(value=9007199254740992))
    mutation("non-finite", lambda p: p["events"][0]["payload"].update(value=float("nan")))
    mutation("invalid-extension-namespace", lambda p: p.update(extensions={"plain": 1}))
    query = load_json(ROOT / "examples/query-valid.json")
    mutation("query-duplicate-output", lambda p: p.update(output_types=["cases", "cases"]),
             "knowledge-query.schema.json", query)
    answer = load_json(ROOT / "examples/response-answered.json")
    mutation("answered-without-content", lambda p: p.update(answer_blocks=[]),
             "knowledge-response.schema.json", answer)
    mutation("unsupported-claim-in-insufficient", lambda p: p.update(status="insufficient_evidence"),
             "knowledge-response.schema.json", answer)
    mutation("citation-without-release", lambda p: p.update(knowledge_release_id=None),
             "knowledge-response.schema.json", answer)

    def package_id_conflict():
        ledger = ReferenceLedger()
        ledger.submit(base, "a")
        p = deepcopy(base)
        p["package_version"] = 2
        require(ledger.submit(p, "b").get("code") == "PACKAGE_ID_CONFLICT", "Reused package ID accepted")
    check("state:package-id-conflict", package_id_conflict)

    def activation_withdrawal():
        ledger = ReferenceLedger()
        ledger.submit(base, "a")
        key1 = (base["producer"], base["task_id"], 1)
        key2 = (base["producer"], base["task_id"], 2)
        require(not ledger.active, "Pending package prematurely active")
        ledger.mark_ready(key1)
        v2 = load_json(ROOT / "examples/package-v2.json")
        ledger.submit(v2, "b")
        require(ledger.active[key1[:2]] == 1, "Pending v2 replaced usable v1")
        ledger.mark_ready(key2)
        ledger.mark_ready(key1)
        require(ledger.active[key1[:2]] == 2, "Older completion overwrote newer version")
        ledger.withdraw(key2)
        ledger.withdraw(key2)
        require(key1[:2] not in ledger.active, "Withdrawal revived old version")
        require(not ledger.mark_ready(key2), "Withdrawn package reactivated")
        require(ledger.submit(v2, "b")["record"]["withdrawn"], "Retry resurrected withdrawn package")
    check("state:ready-order-and-withdrawal", activation_withdrawal)

    def scope_check():
        ledger = ReferenceLedger()
        require(ledger.submit(base, "a", projects=set())["status"] == 403, "Unauthorized project accepted")
        require(ledger.submit(base, "a", org="other-org")["status"] == 403, "Unauthorized org accepted")
        require(not ledger.by_version, "Denied request mutated reference state")
        require(ledger.submit(base, "a")["status"] == 202, "Authorized seed rejected")
        require(ledger.submit(base, "a", projects=set())["status"] == 403, "Replay bypassed revocation")
    check("reference-only:trusted-scope-denial", scope_check)

    def strict_json():
        with tempfile.TemporaryDirectory(dir=ROOT, prefix=".validation-") as tmp:
            path = Path(tmp) / "invalid.json"
            for text in ['{"x":1,"x":2}', '{"x":NaN}', '{"x":Infinity}']:
                path.write_text(text, encoding="utf-8")
                try:
                    load_json(path)
                except ValueError:
                    continue
                raise AssertionError("Ambiguous/non-finite JSON accepted")
    check("parser:duplicate-keys-and-nonfinite", strict_json)

    def depth_limit():
        p = deepcopy(base)
        value = {}
        for _ in range(25):
            value = {"nested": value}
        p["events"][0]["payload"] = value
        require(bool(validate("task-package.schema.json", p)[0]), "Deep payload accepted")
    check("negative:nested-depth-limit", depth_limit)

    def manifest_assets_exist():
        for item in load_json(ROOT / "examples/manifest.json"):
            require((ROOT / "examples" / item["file"]).is_file(), item["file"])
            require((ROOT / item["schema"]).is_file(), item["schema"])
        require(spec["security"] == [{"BearerAuth": []}], "Missing security declaration")
        for path, methods in spec["paths"].items():
            for op in methods.values():
                if "security" in op:
                    require(op["security"] != [], "Unexpected unauthenticated operation")
                if op["operationId"] in {"submitTaskPackage", "withdrawTaskPackage"}:
                    require(any(p["name"] == "Idempotency-Key" and p["required"]
                                for p in op["parameters"]), "Missing idempotency header")
    check("contract:assets-security-and-idempotency-headers", manifest_assets_exist)

    inputs = [p for p in ROOT.rglob("*") if p.is_file() and
              p.suffix in {".json", ".yaml", ".py", ".md", ".txt"} and "reports" not in p.parts]
    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "scope": "offline contract validation only; no HTTP, JWT, DB, worker, attachment download or A integration",
        "contract_status": "proposed",
        "python": sys.version.split()[0],
        "dependencies": {p: version(p) for p in ["jsonschema", "PyYAML", "referencing"]},
        "vendored": ["rfc8785.py upstream implementation snapshot", "OpenAPI 3.1 official 2022-10-07 meta-schema"],
        "passed": sum(r["passed"] for r in results), "failed": sum(not r["passed"] for r in results),
        "results": results,
        "input_sha256": {p.relative_to(ROOT).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
                         for p in sorted(inputs)},
    }
    reports = ROOT / "reports"
    reports.mkdir(exist_ok=True)
    (reports / "validation.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    lines = ["# B00本地合同验证", "",
             f"- 通过：{report['passed']}；失败：{report['failed']}",
             "- 合同状态：proposed；未与A确认。",
             "- 范围：Schema、OpenAPI、样例、引用和内存参考模型；不等于服务/数据库/权限系统/真实联调验收。",
             "", "| 检查 | 结果 |", "|---|---|"]
    lines += [f"| {r['name']} | {'通过' if r['passed'] else '失败：' + r['error'].replace('|', '/')} |" for r in results]
    (reports / "validation.md").write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    print(json.dumps({"passed": report["passed"], "failed": report["failed"],
                      "failures": [r for r in results if not r["passed"]]}, ensure_ascii=False))
    return 1 if report["failed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
