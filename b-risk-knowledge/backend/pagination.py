import base64
import json
from datetime import datetime
from sqlalchemy import and_, or_
from .auth import Problem


def paginate(db, statement, model, limit, cursor):
    if cursor:
        try:
            stamp, ident = json.loads(base64.urlsafe_b64decode(cursor + "=" * (-len(cursor) % 4)))
            when = datetime.fromisoformat(stamp)
        except (ValueError, TypeError, KeyError):
            raise Problem(422, "INVALID_CURSOR", "分页标识无效，请重新加载列表。")
        statement = statement.where(or_(model.created_at < when,
                                        and_(model.created_at == when, model.id < ident)))
    rows = db.scalars(statement.order_by(model.created_at.desc(), model.id.desc()).limit(limit + 1)).all()
    more = len(rows) > limit
    rows = rows[:limit]
    next_cursor = None
    if more:
        next_cursor = base64.urlsafe_b64encode(json.dumps(
            [rows[-1].created_at.isoformat(), rows[-1].id]).encode()).decode().rstrip("=")
    return rows, next_cursor
