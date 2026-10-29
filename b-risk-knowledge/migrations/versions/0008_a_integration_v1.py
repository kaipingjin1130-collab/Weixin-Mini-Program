"""Durable v1 import identity and operation idempotency ledger."""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql as pg

revision = '0008_a_integration_v1'
down_revision = '0007_b07_training_extraction'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('a_imports',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('org_id', sa.String(128), nullable=False),
        sa.Column('project_id', sa.String(128), nullable=False),
        sa.Column('task_id', sa.String(128), nullable=False),
        sa.Column('delivery_id', sa.String(128), nullable=False),
        sa.Column('delivery_version', sa.Integer(), nullable=False),
        sa.Column('version', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(32), nullable=False),
        sa.Column('run_id', sa.String(36), sa.ForeignKey('processing_runs.id'), nullable=False),
        sa.Column('receipt_id', sa.String(36), sa.ForeignKey('task_packages.id')),
        sa.Column('retrospective_id', sa.String(36)),
        sa.Column('retrospective_run_id', sa.String(36), sa.ForeignKey('processing_runs.id')),
        sa.Column('retrospective_status', sa.String(32), nullable=False),
        sa.Column('source_metadata', pg.JSONB(), nullable=False),
        sa.Column('error', pg.JSONB()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('org_id', 'delivery_id', 'delivery_version'))
    op.create_index('ix_a_imports_project_id', 'a_imports', ['project_id'])
    op.create_table('a_import_requests',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('org_id', sa.String(128), nullable=False),
        sa.Column('actor_id', sa.String(36), nullable=False),
        sa.Column('key', sa.String(128), nullable=False),
        sa.Column('digest', sa.String(64), nullable=False),
        sa.Column('import_id', sa.String(36), sa.ForeignKey('a_imports.id'), nullable=False),
        sa.UniqueConstraint('org_id', 'actor_id', 'key'))


def downgrade():
    op.drop_table('a_import_requests')
    op.drop_table('a_imports')
