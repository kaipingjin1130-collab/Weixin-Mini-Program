"""Extracted report pictures and explicit report/finding relationships."""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB
revision='0013_history_images'
down_revision='0012_history_reports'
branch_labels=depends_on=None

def upgrade():
    op.create_table('history_images',sa.Column('id',sa.String(36),primary_key=True),
        sa.Column('document_id',sa.String(36),sa.ForeignKey('history_documents.id'),nullable=False),
        sa.Column('asset_id',sa.String(36),sa.ForeignKey('file_assets.id'),nullable=False),
        sa.Column('sha256',sa.String(64),nullable=False),sa.Column('width',sa.Integer()),sa.Column('height',sa.Integer()),
        sa.UniqueConstraint('document_id','sha256'))
    op.create_table('history_image_occurrences',sa.Column('id',sa.String(36),primary_key=True),
        sa.Column('image_id',sa.String(36),sa.ForeignKey('history_images.id'),nullable=False),
        sa.Column('source_key',sa.String(64),nullable=False),sa.Column('locator',JSONB(),nullable=False),
        sa.Column('method',sa.String(64),nullable=False),sa.Column('kind',sa.String(32),nullable=False),
        sa.UniqueConstraint('image_id','source_key'))
    op.create_table('history_image_links',sa.Column('id',sa.String(36),primary_key=True),
        sa.Column('occurrence_id',sa.String(36),sa.ForeignKey('history_image_occurrences.id'),nullable=False),
        sa.Column('finding_id',sa.String(36),sa.ForeignKey('history_findings.id'),nullable=False),
        sa.Column('relation',sa.String(32),nullable=False),sa.UniqueConstraint('occurrence_id','finding_id'))
    op.create_table('history_media_runs',sa.Column('id',sa.String(36),primary_key=True),
        sa.Column('import_id',sa.String(36),sa.ForeignKey('history_imports.id'),nullable=False),
        sa.Column('version',sa.String(64),nullable=False),sa.Column('status',sa.String(32),nullable=False),
        sa.Column('counts',JSONB(),nullable=False),sa.Column('issues',JSONB(),nullable=False),
        sa.Column('created_at',sa.DateTime(timezone=True),nullable=False),sa.UniqueConstraint('import_id','version'))
    for table,columns in {'history_images':['document_id'],'history_image_occurrences':['image_id'],
        'history_image_links':['occurrence_id','finding_id'],'history_media_runs':['import_id']}.items():
        for col in columns:op.create_index('ix_'+table+'_'+col,table,[col])

def downgrade():
    for t in ('history_media_runs','history_image_links','history_image_occurrences','history_images'):op.drop_table(t)
