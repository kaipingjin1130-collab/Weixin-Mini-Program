"""Real PostgreSQL + queue tests; run only through tools/check.py."""
import os
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select, text, func

from backend.app import app
from backend.db import Session
from backend.models import ProcessingRun, FileAsset
from backend import job_service
from backend.config import load_settings

assert os.environ.get("B_DATABASE_URL", "").endswith("/risk_b_test"), "Use isolated test database"


def headers(role="admin", key=None):
    result = {"Authorization": f"Bearer dev-{role}"}
    if key:
        result["Idempotency-Key"] = key
    return result


@pytest.fixture(scope="module")
def client():
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c


def submit(c, scenario="success", duration=1, key=None, role="admin"):
    return c.post("/api/v1/jobs", headers=headers(role, key or str(uuid4())), json={
        "title": "集成验证", "project_id": "demo-airport", "scenario": scenario,
        "duration_seconds": duration})


def wait(c, ident, status, timeout=30):
    until = time.monotonic() + timeout
    while time.monotonic() < until:
        job = c.get(f"/api/v1/jobs/{ident}", headers=headers()).json()
        if job["status"] == status:
            return job
        time.sleep(.2)
    pytest.fail(f"Job did not reach {status}; last={job}")


def start_worker():
    return subprocess.Popen([sys.executable, "-m", "backend.worker"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def test_identity_and_scope(client):
    assert client.get("/api/v1/me").status_code == 401
    assert client.get("/api/v1/access", headers=headers("learner")).status_code == 403
    assert submit(client, role="learner").status_code == 403
    job = submit(client).json()["job"]
    assert client.get(f"/api/v1/jobs/{job['id']}", headers=headers("outsider")).status_code == 403
    assert client.get("/api/v1/jobs", headers=headers("outsider")).json()["items"] == []
    assert client.get("/api/v1/jobs?cursor=invalid", headers=headers()).status_code == 422


def test_production_fails_closed(monkeypatch):
    monkeypatch.setenv("B_ENV", "production")
    with pytest.raises(RuntimeError):
        load_settings()


def test_idempotency_and_concurrency(client):
    key = str(uuid4())
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(lambda _: submit(client, key=key), range(4)))
    assert sorted(r.status_code for r in results) == [200, 200, 200, 202]
    assert len({r.json()["job"]["id"] for r in results}) == 1
    assert submit(client, key=key, duration=2).status_code == 409


def test_enqueue_transaction_rollback(client, monkeypatch):
    original = job_service.enqueue
    captured = []

    def broken(db, run_id):
        captured.append((run_id, original(db, run_id)))
        raise RuntimeError("Injected failure after queue insert")

    monkeypatch.setattr(job_service, "enqueue", broken)
    assert submit(client).status_code == 503
    with Session() as db:
        assert db.get(ProcessingRun, captured[0][0]) is None
        assert db.scalar(text("SELECT count(*) FROM procrastinate_jobs WHERE id=:id"),
                         {"id": captured[0][1]}) == 0


def test_real_worker_retries_assets_and_revocation(client):
    worker = start_worker()
    try:
        automatic = submit(client, "fail_once").json()["job"]
        done = wait(client, automatic["id"], "succeeded")
        assert done["attempts"] == 2
        url = f"/api/v1/assets/{done['result_ref']}/content"
        assert client.get(url, headers=headers("learner")).status_code == 200
        assert client.get(url, headers=headers("outsider")).status_code == 403
        access = client.get("/api/v1/access", headers=headers()).json()
        learner = next(u for u in access["users"] if u["name"] == "新成员")
        binding = next(b for b in access["bindings"] if b["user_id"] == learner["id"])
        assert client.request("DELETE", f"/api/v1/role-bindings/{binding['id']}",
                              headers=headers(), json={"row_version": binding["row_version"]}).status_code == 200
        assert client.get(url, headers=headers("learner")).status_code == 403
        subprocess.run([sys.executable, "-m", "backend.initialize"], check=True, capture_output=True)
        assert client.get(url, headers=headers("learner")).status_code == 403
        assert client.post("/api/v1/role-bindings", headers=headers(), json={
            "user_id": learner["id"], "project_id": "demo-metro", "role": "learner"}).status_code == 403
        client.post("/api/v1/role-bindings", headers=headers(), json={
            "user_id": learner["id"], "project_id": "demo-airport", "role": "learner"})
        with Session.begin() as db:
            asset = db.get(FileAsset, done["result_ref"])
            key = asset.storage_key
            asset.storage_key = "../config.json"
        traversal = client.get(url, headers=headers())
        assert traversal.status_code == 400
        assert traversal.json()["code"] == "INVALID_STORAGE_KEY"
        with Session.begin() as db:
            asset = db.get(FileAsset, done["result_ref"])
            asset.storage_key, asset.availability = key, "withdrawn"
        assert client.get(url, headers=headers()).status_code == 410
        manual = submit(client, "manual_failure").json()["job"]
        failed = wait(client, manual["id"], "failed")
        time.sleep(1)
        endpoint = f"/api/v1/jobs/{manual['id']}/retry"
        assert client.post(endpoint, headers=headers(key=str(uuid4())),
                           json={"row_version": 1}).status_code == 409
        retry_key = str(uuid4())
        body = {"row_version": failed["row_version"]}
        assert client.post(endpoint, headers=headers(key=retry_key), json=body).status_code == 200
        assert client.post(endpoint, headers=headers(key=retry_key), json=body).json()["replayed"]
        wait(client, manual["id"], "succeeded")
        assert client.get("/api/v1/audit-events", headers=headers()).json()["items"]
    finally:
        worker.kill()
        worker.wait(timeout=10)


def test_worker_crash_recovers_one_result(client):
    worker = start_worker()
    job = submit(client, duration=6).json()["job"]
    try:
        wait(client, job["id"], "running")
    finally:
        worker.kill()
        worker.wait(timeout=10)
    time.sleep(12)
    replacement = start_worker()
    try:
        done = wait(client, job["id"], "succeeded", timeout=40)
        assert done["attempts"] == 2
        with Session() as db:
            assert db.scalar(select(func.count()).select_from(FileAsset).where(
                FileAsset.source_run_id == job["id"])) == 1
    finally:
        replacement.kill()
        replacement.wait(timeout=10)
