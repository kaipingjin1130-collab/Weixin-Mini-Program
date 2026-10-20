from sqlalchemy import select, text
from .db import engine, Session
from .models import UserLink, RoleBinding
from .queue import queue_app


def main():
    with engine.connect() as conn:
        exists = conn.scalar(text("SELECT to_regclass('public.procrastinate_jobs') IS NOT NULL"))
    if not exists:
        queue_app.open()
        try:
            queue_app.schema_manager.apply_schema()
        finally:
            queue_app.close()
    # Seed only missing identities. Repeated startup must NOT restore revoked roles.
    profiles = [
        ("admin", "本地管理员", ["demo-airport", "demo-metro"], "admin"),
        ("processor", "资料加工员", ["demo-airport"], "processor"),
        ("learner", "新成员", ["demo-airport"], "learner"),
        ("outsider", "其他项目成员", ["demo-metro"], "learner"),
    ]
    with Session.begin() as db:
        for subject, name, projects, role in profiles:
            user = db.scalar(select(UserLink).where(UserLink.issuer == "local-demo", UserLink.subject_id == subject))
            if user:
                continue
            user = UserLink(issuer="local-demo", subject_id=subject, display_name=name, authorized_projects=projects)
            db.add(user)
            db.flush()
            for project in projects:
                db.add(RoleBinding(user_id=user.id, role=role, scope_type="project", scope_id=project))
    from .modules.ingestion.fixtures import seed_assets
    seed_assets()
    from .modules.knowledge.quality import backfill
    backfill()
    print("B01/B02 schemas and explicit mock identities ready. Existing roles unchanged.")


if __name__ == "__main__":
    main()
