"""B03 immutable quality and knowledge workflow schema."""
from alembic import op
revision = '0003_b03_knowledge'
down_revision = '0002_b02_sources'
branch_labels = None
depends_on = None

def upgrade():
    op.execute('\nCREATE TABLE knowledge_items (\n\tid VARCHAR(36) NOT NULL, \n\trecord_version_id VARCHAR(36) NOT NULL, \n\tproject_id VARCHAR(128) NOT NULL, \n\ttype VARCHAR(32) NOT NULL, \n\ttitle VARCHAR(200) NOT NULL, \n\tscene_code VARCHAR(64) NOT NULL, \n\tobject_type VARCHAR(64) NOT NULL, \n\tscope JSONB NOT NULL, \n\ttemplate_version VARCHAR(64) NOT NULL, \n\tcurrent_revision INTEGER NOT NULL, \n\trow_version INTEGER NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (record_version_id, type, template_version), \n\tFOREIGN KEY(record_version_id) REFERENCES source_record_versions (id)\n)\n\n')
    op.execute('CREATE INDEX ix_knowledge_items_created_at ON knowledge_items (created_at)')
    op.execute('CREATE INDEX ix_knowledge_items_project_id ON knowledge_items (project_id)')
    op.execute('CREATE INDEX ix_knowledge_items_record_version_id ON knowledge_items (record_version_id)')
    op.execute('\nCREATE TABLE quality_issues (\n\tid VARCHAR(36) NOT NULL, \n\trecord_version_id VARCHAR(36) NOT NULL, \n\trule_code VARCHAR(64) NOT NULL, \n\tfield VARCHAR(64) NOT NULL, \n\tseverity VARCHAR(32) NOT NULL, \n\tmessage VARCHAR(1000) NOT NULL, \n\tstatus VARCHAR(32) NOT NULL, \n\trow_version INTEGER NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (record_version_id, rule_code), \n\tFOREIGN KEY(record_version_id) REFERENCES source_record_versions (id)\n)\n\n')
    op.execute('CREATE INDEX ix_quality_issues_record_version_id ON quality_issues (record_version_id)')
    op.execute('\nCREATE TABLE generation_entries (\n\tid VARCHAR(36) NOT NULL, \n\trun_id VARCHAR(36) NOT NULL, \n\trecord_version_id VARCHAR(36) NOT NULL, \n\toutcome VARCHAR(32) NOT NULL, \n\titem_id VARCHAR(36), \n\terror VARCHAR(1000), \n\tPRIMARY KEY (id), \n\tUNIQUE (run_id, record_version_id), \n\tFOREIGN KEY(run_id) REFERENCES processing_runs (id), \n\tFOREIGN KEY(record_version_id) REFERENCES source_record_versions (id), \n\tFOREIGN KEY(item_id) REFERENCES knowledge_items (id)\n)\n\n')
    op.execute('CREATE INDEX ix_generation_entries_run_id ON generation_entries (run_id)')
    op.execute('\nCREATE TABLE knowledge_revisions (\n\tid VARCHAR(36) NOT NULL, \n\titem_id VARCHAR(36) NOT NULL, \n\tversion INTEGER NOT NULL, \n\tcontent JSONB NOT NULL, \n\tschema_version VARCHAR(64) NOT NULL, \n\ttemplate_version VARCHAR(64) NOT NULL, \n\tmodel_ref VARCHAR(128) NOT NULL, \n\tstate VARCHAR(32) NOT NULL, \n\trow_version INTEGER NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (item_id, version), \n\tFOREIGN KEY(item_id) REFERENCES knowledge_items (id)\n)\n\n')
    op.execute('CREATE INDEX ix_knowledge_revisions_item_id ON knowledge_revisions (item_id)')
    op.execute('CREATE INDEX ix_knowledge_revisions_state ON knowledge_revisions (state)')
    op.execute('\nCREATE TABLE record_annotations (\n\tid VARCHAR(36) NOT NULL, \n\trecord_version_id VARCHAR(36) NOT NULL, \n\tissue_id VARCHAR(36) NOT NULL, \n\tfield VARCHAR(64) NOT NULL, \n\tvalue JSONB NOT NULL, \n\tsource_kind VARCHAR(32) NOT NULL, \n\tactor VARCHAR(36) NOT NULL, \n\treason VARCHAR(2000) NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tFOREIGN KEY(record_version_id) REFERENCES source_record_versions (id), \n\tFOREIGN KEY(issue_id) REFERENCES quality_issues (id)\n)\n\n')
    op.execute('CREATE INDEX ix_record_annotations_record_version_id ON record_annotations (record_version_id)')
    op.execute('\nCREATE TABLE knowledge_evidence_links (\n\tid VARCHAR(36) NOT NULL, \n\trevision_id VARCHAR(36) NOT NULL, \n\tclaim_path VARCHAR(128) NOT NULL, \n\tevidence_id VARCHAR(36) NOT NULL, \n\trelation_type VARCHAR(32) NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (revision_id, claim_path, evidence_id), \n\tFOREIGN KEY(revision_id) REFERENCES knowledge_revisions (id), \n\tFOREIGN KEY(evidence_id) REFERENCES evidence_items (id)\n)\n\n')
    op.execute('CREATE INDEX ix_knowledge_evidence_links_revision_id ON knowledge_evidence_links (revision_id)')
    op.execute('\nCREATE TABLE review_actions (\n\tid VARCHAR(36) NOT NULL, \n\tobject_type VARCHAR(64) NOT NULL, \n\tobject_id VARCHAR(36) NOT NULL, \n\trevision_id VARCHAR(36) NOT NULL, \n\tobject_version INTEGER NOT NULL, \n\taction VARCHAR(32) NOT NULL, \n\treviewer VARCHAR(36) NOT NULL, \n\treason VARCHAR(2000) NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tFOREIGN KEY(object_id) REFERENCES knowledge_items (id), \n\tFOREIGN KEY(revision_id) REFERENCES knowledge_revisions (id)\n)\n\n')
    op.execute('CREATE INDEX ix_review_actions_revision_id ON review_actions (revision_id)')

def downgrade():
    op.drop_table('review_actions')
    op.drop_table('knowledge_evidence_links')
    op.drop_table('record_annotations')
    op.drop_table('knowledge_revisions')
    op.drop_table('generation_entries')
    op.drop_table('quality_issues')
    op.drop_table('knowledge_items')
