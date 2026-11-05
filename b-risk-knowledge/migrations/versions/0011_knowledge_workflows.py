"""Add immutable business revisions, evidence graph and event records."""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

revision = '0011_knowledge_workflows'
down_revision = '0010_standard_library'
branch_labels = depends_on = None


def upgrade():
    op.create_table('work_revisions',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('org_id', sa.String(128), nullable=False), sa.Column('project_id', sa.String(128), nullable=False),
        sa.Column('kind', sa.String(32), nullable=False), sa.Column('series', sa.String(128), nullable=False),
        sa.Column('version', sa.Integer(), nullable=False), sa.Column('title', sa.String(300), nullable=False),
        sa.Column('content', JSONB(), nullable=False), sa.Column('state', sa.String(32), nullable=False),
        sa.Column('row_version', sa.Integer(), nullable=False), sa.Column('created_by', sa.String(36), nullable=False),
        sa.Column('reviewed_by', sa.String(36)), sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint('org_id', 'project_id', 'kind', 'series', 'version'),
        sa.CheckConstraint("state IN ('draft','pending_review','approved','published','changes_requested','superseded','withdrawn')", name='work_state_valid'))
    for field in ('org_id','project_id','kind','state','created_at'):
        op.create_index('ix_work_revisions_' + field, 'work_revisions', [field])
    op.create_table('work_dependencies', sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('revision_id', sa.String(36), sa.ForeignKey('work_revisions.id'), nullable=False),
        sa.Column('source_kind', sa.String(32), nullable=False), sa.Column('source_id', sa.String(128), nullable=False),
        sa.Column('fingerprint', sa.String(64), nullable=False), sa.UniqueConstraint('revision_id','source_kind','source_id'))
    for field in ('revision_id','source_id'):
        op.create_index('ix_work_dependencies_' + field, 'work_dependencies', [field])
    op.create_table('work_reviews', sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('revision_id', sa.String(36), sa.ForeignKey('work_revisions.id'), nullable=False),
        sa.Column('action', sa.String(32), nullable=False), sa.Column('actor_id', sa.String(36), nullable=False),
        sa.Column('reason', sa.String(2000), nullable=False), sa.Column('row_version', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False))
    op.create_index('ix_work_reviews_revision_id','work_reviews',['revision_id'])
    op.create_table('work_submissions', sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('actor_id', sa.String(36), nullable=False), sa.Column('key', sa.String(128), nullable=False),
        sa.Column('digest', sa.String(64), nullable=False),
        sa.Column('revision_id', sa.String(36), sa.ForeignKey('work_revisions.id'), nullable=False), sa.UniqueConstraint('actor_id','key'))
    op.create_table('event_records', sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('revision_id', sa.String(36), sa.ForeignKey('work_revisions.id'), nullable=False),
        sa.Column('record_key', sa.String(200), nullable=False), sa.Column('kind', sa.String(32), nullable=False),
        sa.Column('content', JSONB(), nullable=False), sa.UniqueConstraint('revision_id','record_key','kind'))
    for field in ('revision_id','record_key'):
        op.create_index('ix_event_records_' + field, 'event_records', [field])


def downgrade():
    for table in ('event_records','work_submissions','work_reviews','work_dependencies','work_revisions'):
        op.drop_table(table)
