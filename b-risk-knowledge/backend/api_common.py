import re
from fastapi import Header
from .auth import Problem


def key_header(idempotency_key: str = Header(alias="Idempotency-Key")):
    if not re.fullmatch(r"[A-Za-z0-9_.:-]{1,128}", idempotency_key):
        raise Problem(422, "INVALID_IDEMPOTENCY_KEY", "提交标识格式不正确。")
    return idempotency_key
