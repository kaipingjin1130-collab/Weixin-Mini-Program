from pathlib import Path
import hashlib
import os
import tempfile
from .config import settings
from .auth import Problem


def asset_path(key: str) -> Path:
    root = settings.storage.resolve()
    path = (root / key).resolve()
    if path == root or not path.is_relative_to(root):
        raise Problem(400, "INVALID_STORAGE_KEY", "文件路径不在受控目录内。")
    return path


def write_result(run_id: str, content: bytes):
    target = asset_path(f"results/{run_id}.txt")
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=target.parent, delete=False) as tmp:
        temporary = Path(tmp.name)
        tmp.write(content)
    try:
        os.replace(temporary, target)
    finally:
        temporary.unlink(missing_ok=True)
    return f"results/{run_id}.txt", hashlib.sha256(content).hexdigest(), len(content)
