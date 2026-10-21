"""Initialize only this project's local configuration, PostgreSQL and schemas."""
from pathlib import Path
import argparse
import json
import secrets
import subprocess
import time
import sys

ROOT = Path(__file__).resolve().parents[1]
LOCAL = ROOT / ".local"
CONTAINER = "risk-b01-postgres"


def docker(*args, check=True):
    return subprocess.run(["docker", *args], check=check, capture_output=True, text=True, encoding="utf-8")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--database-only", action="store_true")
    parser.add_argument("--config-only", action="store_true")
    args = parser.parse_args()
    LOCAL.mkdir(exist_ok=True)
    config_path = LOCAL / "config.json"
    if not config_path.exists():
        password = secrets.token_hex(24)
        (LOCAL / "postgres.env").write_text(
            f"POSTGRES_USER=risk_b\nPOSTGRES_PASSWORD={password}\nPOSTGRES_DB=risk_b\n", encoding="utf-8")
        config_path.write_text(json.dumps({
            "environment": "development", "auth_mode": "mock",
            "database_url": f"postgresql+psycopg://risk_b:{password}@127.0.0.1:55439/risk_b",
            "storage": str(LOCAL / "storage"),
        }, indent=2), encoding="utf-8")
    if args.config_only:
        return
    if docker("info", check=False).returncode:
        raise RuntimeError("Docker is not ready. Start Docker Desktop and retry.")
    inspect = docker("inspect", CONTAINER, check=False)
    if inspect.returncode:
        docker("run", "-d", "--name", CONTAINER, "--label", "com.riskb.project=B01",
               "--env-file", str(LOCAL / "postgres.env"),
               "-p", "127.0.0.1:55439:5432",
               "-v", "risk-b01-pgdata:/var/lib/postgresql/data", "pgvector/pgvector:0.8.7-pg15-trixie")
    else:
        data = json.loads(inspect.stdout)[0]
        if data["Config"].get("Labels", {}).get("com.riskb.project") != "B01":
            raise RuntimeError("Existing container is not owned by B01; will not modify it.")
        if not data["State"]["Running"]:
            docker("start", CONTAINER)
    for _ in range(60):
        if docker("exec", CONTAINER, "pg_isready", "-U", "risk_b", "-d", "risk_b", check=False).returncode == 0:
            break
        time.sleep(1)
    else:
        raise RuntimeError("B01 PostgreSQL did not become ready.")
    print("Dedicated PostgreSQL ready on 127.0.0.1:55439.", flush=True)
    if args.database_only:
        return
    subprocess.run([sys.executable, "-m", "alembic", "upgrade", "head"], cwd=ROOT, check=True)
    subprocess.run([sys.executable, "-m", "backend.initialize"], cwd=ROOT, check=True)


if __name__ == "__main__":
    main()
