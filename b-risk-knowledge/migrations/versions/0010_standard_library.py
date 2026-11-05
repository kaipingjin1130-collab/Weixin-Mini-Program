"""K01a standard source versions, structured clauses and independent review ledger."""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

revision = '0010_standard_library'
down_revision = '0009_scenes_learning_scope'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('standard_revisions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('project_id', sa.String(128), nullable=False),
        sa.Column('code', sa.String(128), nullable=False),
        sa.Column('edition', sa.String(100), nullable=False),
        sa.Column('version', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(300), nullable=False),
        sa.Column('source_asset_id', sa.String(36), sa.ForeignKey('file_assets.id'), nullable=False),
        sa.Column('source_sha256', sa.String(64), nullable=False),
        sa.Column('valid_from', sa.Date(), nullable=False),
        sa.Column('valid_until', sa.Date()),
        sa.Column('scope', JSONB(), nullable=False),
        sa.Column('maintainer', sa.String(200), nullable=False),
        sa.Column('state', sa.String(32), nullable=False),
        sa.Column('verified_on', sa.Date()),
        sa.Column('reviewed_by', sa.String(36)),
        sa.Column('row_version', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('project_id', 'code', 'edition', 'version'),
        sa.CheckConstraint('valid_until IS NULL OR valid_until > valid_from', name='standard_dates_valid'),
        sa.CheckConstraint("state IN ('draft','pending_review','changes_requested','approved','published','superseded','withdrawn')", name='standard_state_valid'))
    op.create_index('ix_standard_revisions_project_id', 'standard_revisions', ['project_id'])
    op.create_index('ix_standard_revisions_state', 'standard_revisions', ['state'])
    op.create_table('standard_clauses',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('standard_revision_id', sa.String(36), sa.ForeignKey('standard_revisions.id'), nullable=False),
        sa.Column('number', sa.String(100), nullable=False),
        sa.Column('position', sa.Integer(), nullable=False),
        sa.Column('content', JSONB(), nullable=False),
        sa.UniqueConstraint('standard_revision_id', 'number'))
    op.create_index('ix_standard_clauses_standard_revision_id', 'standard_clauses', ['standard_revision_id'])
    op.create_table('standard_reviews',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('standard_revision_id', sa.String(36), sa.ForeignKey('standard_revisions.id'), nullable=False),
        sa.Column('action', sa.String(32), nullable=False),
        sa.Column('actor_id', sa.String(36), nullable=False),
        sa.Column('reason', sa.String(2000), nullable=False),
        sa.Column('row_version', sa.Integer(), nullable=False),
        sa.Column('evidence_checked', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False))
    op.create_index('ix_standard_reviews_standard_revision_id', 'standard_reviews', ['standard_revision_id'])
    op.create_table('standard_submissions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('actor_id', sa.String(36), nullable=False),
        sa.Column('idempotency_key', sa.String(128), nullable=False),
        sa.Column('input_hash', sa.String(64), nullable=False),
        sa.Column('revision_id', sa.String(36), sa.ForeignKey('standard_revisions.id'), nullable=False),
        sa.UniqueConstraint('actor_id', 'idempotency_key'))


def downgrade():
    for table in ('standard_submissions', 'standard_reviews', 'standard_clauses', 'standard_revisions'):
        op.drop_table(table)
