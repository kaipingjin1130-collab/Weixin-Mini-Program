"""B01 immutable initial schema."""
from alembic import op
import sqlalchemy as sa

revision = "0001_b01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table("user_links",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("issuer", sa.String(128), nullable=False),
        sa.Column("subject_id", sa.String(128), nullable=False),
        sa.Column("display_name", sa.String(128), nullable=False),
        sa.Column("authorized_projects", sa.JSON(), nullable=False),
        sa.UniqueConstraint("issuer", "subject_id"))
    op.create_table("role_bindings",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("user_links.id"), nullable=False),
        sa.Column("role", sa.String(32), nullable=False),
        sa.Column("scope_type", sa.String(32), nullable=False),
        sa.Column("scope_id", sa.String(128), nullable=False),
        sa.Column("row_version", sa.Integer(), nullable=False),
        sa.UniqueConstraint("user_id", "role", "scope_type", "scope_id"))
    op.create_table("audit_events",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("actor_id", sa.String(36), nullable=False),
        sa.Column("object_type", sa.String(64), nullable=False),
        sa.Column("object_id", sa.String(128), nullable=False),
        sa.Column("action", sa.String(64), nullable=False),
        sa.Column("project_id", sa.String(128), nullable=False),
        sa.Column("object_version", sa.Integer(), nullable=True),
        sa.Column("request_id", sa.String(128), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False))
    op.create_table("processing_runs",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("kind", sa.String(64), nullable=False),
        sa.Column("object_id", sa.String(128), nullable=False),
        sa.Column("project_id", sa.String(128), nullable=False),
        sa.Column("actor_id", sa.String(36), sa.ForeignKey("user_links.id"), nullable=False),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("idempotency_key", sa.String(128), nullable=False),
        sa.Column("input_hash", sa.String(64), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column("queue_job_id", sa.Integer(), nullable=True),
        sa.Column("progress", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(32), nullable=False),
        sa.Column("attempts", sa.Integer(), nullable=False),
        sa.Column("result_ref", sa.String(36), nullable=True),
        sa.Column("error", sa.String(2000), nullable=True),
        sa.Column("row_version", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("actor_id", "idempotency_key"))
    op.create_index("ix_processing_runs_project_id", "processing_runs", ["project_id"])
    op.create_index("ix_processing_runs_created_at", "processing_runs", ["created_at"])
    op.create_table("file_assets",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("source_run_id", sa.String(36), sa.ForeignKey("processing_runs.id"), nullable=True, unique=True),
        sa.Column("storage_key", sa.String(256), nullable=False),
        sa.Column("sha256", sa.String(64), nullable=False),
        sa.Column("mime_type", sa.String(128), nullable=False),
        sa.Column("size", sa.Integer(), nullable=False),
        sa.Column("org_id", sa.String(128), nullable=False),
        sa.Column("project_id", sa.String(128), nullable=False),
        sa.Column("availability", sa.String(32), nullable=False))
    op.create_table("retry_requests",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("actor_id", sa.String(36), sa.ForeignKey("user_links.id"), nullable=False),
        sa.Column("idempotency_key", sa.String(128), nullable=False),
        sa.Column("run_id", sa.String(36), sa.ForeignKey("processing_runs.id"), nullable=False),
        sa.Column("input_hash", sa.String(64), nullable=False),
        sa.UniqueConstraint("actor_id", "idempotency_key"))


def downgrade():
    for table in ["retry_requests", "file_assets", "processing_runs", "audit_events", "role_bindings", "user_links"]:
        op.drop_table(table)
