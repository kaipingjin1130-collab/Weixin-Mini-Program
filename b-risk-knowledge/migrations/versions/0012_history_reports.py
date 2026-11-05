"""Original report library, fixed canonical fields and field-level provenance."""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB

revision = '0012_history_reports'
down_revision = '0011_knowledge_workflows'
branch_labels = depends_on = None


def upgrade():
    # Frozen migration definition, independent of future ORM changes.
    op.create_table('history_documents', sa.Column('id',sa.String(36),primary_key=True),
        sa.Column('org_id',sa.String(128),nullable=False),sa.Column('scope_id',sa.String(128),nullable=False),
        sa.Column('asset_id',sa.String(36),sa.ForeignKey('file_assets.id'),nullable=False),
        sa.Column('sha256',sa.String(64),nullable=False),sa.Column('original_name',sa.Text(),nullable=False),
        sa.Column('source_format',sa.String(16),nullable=False),sa.Column('created_at',sa.DateTime(timezone=True),nullable=False),
        sa.UniqueConstraint('org_id','scope_id','sha256'))
    op.create_table('history_origins',sa.Column('id',sa.String(36),primary_key=True),
        sa.Column('document_id',sa.String(36),sa.ForeignKey('history_documents.id'),nullable=False),
        sa.Column('origin_key',sa.String(64),nullable=False),sa.Column('provenance',JSONB(),nullable=False),
        sa.UniqueConstraint('document_id','origin_key'))
    op.create_table('history_imports',sa.Column('id',sa.String(36),primary_key=True),
        sa.Column('document_id',sa.String(36),sa.ForeignKey('history_documents.id'),nullable=False),
        sa.Column('config_hash',sa.String(64),nullable=False),sa.Column('parser_version',sa.String(80),nullable=False),
        sa.Column('dictionary_version',sa.String(80),nullable=False),sa.Column('status',sa.String(32),nullable=False),
        sa.Column('counts',JSONB(),nullable=False),sa.Column('context',JSONB(),nullable=False),
        sa.Column('created_by',sa.String(128),nullable=False),sa.Column('created_at',sa.DateTime(timezone=True),nullable=False),
        sa.UniqueConstraint('document_id','config_hash'))
    op.create_table('history_findings',sa.Column('id',sa.String(36),primary_key=True),
        sa.Column('import_id',sa.String(36),sa.ForeignKey('history_imports.id'),nullable=False),
        sa.Column('source_key',sa.String(64),nullable=False),sa.Column('locator',JSONB(),nullable=False),
        sa.Column('review_state',sa.String(32),nullable=False),
        *[sa.Column(k,sa.Text(),nullable=k!='problem_description') for k in (
            'project_name','engineering_project_name','inspection_date','inspection_location','problem_description',
            'source_category','source_grade','basis_or_clause','rectification_requirement','rectification_advice',
            'rectification_deadline','reported_response','reinspection_conclusion','hazard_category')],
        sa.UniqueConstraint('import_id','source_key'),sa.CheckConstraint('length(trim(problem_description)) > 0'))
    op.create_table('history_evidence',sa.Column('id',sa.String(36),primary_key=True),
        sa.Column('finding_id',sa.String(36),sa.ForeignKey('history_findings.id'),nullable=False),
        sa.Column('field_key',sa.String(64),nullable=False),sa.Column('source_label',sa.Text()),
        sa.Column('quote',sa.Text(),nullable=False),sa.Column('locator',JSONB(),nullable=False),
        sa.Column('source_kind',sa.String(32),nullable=False),sa.Column('method',sa.String(64),nullable=False),
        sa.Column('details',JSONB(),nullable=False))
    op.create_table('history_issues',sa.Column('id',sa.String(36),primary_key=True),
        sa.Column('import_id',sa.String(36),sa.ForeignKey('history_imports.id'),nullable=False),
        sa.Column('finding_id',sa.String(36),sa.ForeignKey('history_findings.id')),
        sa.Column('kind',sa.String(32),nullable=False),sa.Column('code',sa.String(80),nullable=False),
        sa.Column('source_label',sa.Text()),sa.Column('target_field',sa.String(64)),
        sa.Column('reason',sa.Text(),nullable=False),sa.Column('quote',sa.Text()),sa.Column('locator',JSONB(),nullable=False))
    for table, cols in {'history_documents':['scope_id'],'history_origins':['document_id'],'history_imports':['document_id'],
        'history_findings':['import_id'],'history_evidence':['finding_id'],'history_issues':['import_id','finding_id','kind','code']}.items():
        for col in cols:op.create_index('ix_'+table+'_'+col,table,[col])


def downgrade():
    for table in ['history_issues','history_evidence','history_findings','history_imports','history_origins','history_documents']:
        op.drop_table(table)
