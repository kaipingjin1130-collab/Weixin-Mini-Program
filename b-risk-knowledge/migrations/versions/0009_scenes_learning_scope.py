"""Versioned scenes and explicitly assigned learning audiences; additive only."""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB
revision='0009_scenes_learning_scope'
down_revision='0008_a_integration_v1'
branch_labels=None
depends_on=None


def upgrade():
    op.create_table('scene_revisions',sa.Column('id',sa.String(36),primary_key=True),
        sa.Column('project_id',sa.String(128),nullable=False),sa.Column('code',sa.String(64),nullable=False),
        sa.Column('version',sa.Integer(),nullable=False),sa.Column('payload',JSONB(),nullable=False),
        sa.Column('active_scope',sa.String(200),unique=True),sa.Column('created_at',sa.DateTime(timezone=True),nullable=False),
        sa.UniqueConstraint('project_id','code','version'))
    op.create_index('ix_scene_revisions_project_id','scene_revisions',['project_id'])
    op.add_column('learning_packages',sa.Column('audience_subjects',JSONB(),nullable=False,server_default=sa.text("'[]'::jsonb")))


def downgrade():
    op.drop_column('learning_packages','audience_subjects')
    op.drop_table('scene_revisions')
