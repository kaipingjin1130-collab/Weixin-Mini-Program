"""B06 pinned retrospectives, generic review ledger and knowledge provenance."""
from alembic import op
revision = '0006_b06_retrospectives'
down_revision = '0005_b05_task_packages'
branch_labels = None
depends_on = None

def upgrade():
    op.execute('\nCREATE TABLE retrospectives (\n\tid VARCHAR(36) NOT NULL, \n\tsource_key VARCHAR(200) NOT NULL, \n\tmode VARCHAR(32) NOT NULL, \n\tproject_id VARCHAR(128) NOT NULL, \n\ttitle VARCHAR(200) NOT NULL, \n\tcurrent_revision INTEGER NOT NULL, \n\trow_version INTEGER NOT NULL, \n\tscope JSONB NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (source_key)\n)\n\n')
    op.execute('CREATE INDEX ix_retrospectives_created_at ON retrospectives (created_at)')
    op.execute('CREATE INDEX ix_retrospectives_project_id ON retrospectives (project_id)')
    op.execute('\nCREATE TABLE retrospective_revisions (\n\tid VARCHAR(36) NOT NULL, \n\tparent_id VARCHAR(36) NOT NULL, \n\tversion INTEGER NOT NULL, \n\tgeneration_key VARCHAR(64), \n\tinput_fingerprint VARCHAR(64) NOT NULL, \n\tsources JSONB NOT NULL, \n\tsummary VARCHAR(4000) NOT NULL, \n\ttimeline JSONB NOT NULL, \n\tfindings JSONB NOT NULL, \n\tsuggestions JSONB NOT NULL, \n\ttemplate_version VARCHAR(64) NOT NULL, \n\tmodel_ref VARCHAR(128) NOT NULL, \n\tstate VARCHAR(32) NOT NULL, \n\trow_version INTEGER NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (parent_id, version), \n\tUNIQUE (parent_id, generation_key), \n\tFOREIGN KEY(parent_id) REFERENCES retrospectives (id)\n)\n\n')
    op.execute('CREATE INDEX ix_retrospective_revisions_parent_id ON retrospective_revisions (parent_id)')
    op.execute('\nCREATE TABLE retrospective_sources (\n\tid VARCHAR(36) NOT NULL, \n\trevision_id VARCHAR(36) NOT NULL, \n\ttask_package_id VARCHAR(36), \n\trecord_version_id VARCHAR(36), \n\tPRIMARY KEY (id), \n\tCONSTRAINT retro_source_xor CHECK ((task_package_id IS NULL) <> (record_version_id IS NULL)), \n\tFOREIGN KEY(revision_id) REFERENCES retrospective_revisions (id), \n\tFOREIGN KEY(task_package_id) REFERENCES task_packages (id), \n\tFOREIGN KEY(record_version_id) REFERENCES source_record_versions (id)\n)\n\n')
    op.execute('CREATE INDEX ix_retrospective_sources_revision_id ON retrospective_sources (revision_id)')
    op.execute('CREATE INDEX ix_retrospective_sources_task_package_id ON retrospective_sources (task_package_id)')
    op.execute('\nCREATE TABLE retrospective_evidence (\n\tid VARCHAR(36) NOT NULL, \n\trevision_id VARCHAR(36) NOT NULL, \n\treference VARCHAR(200) NOT NULL, \n\tkind VARCHAR(32) NOT NULL, \n\tlocator JSONB NOT NULL, \n\ttext VARCHAR(4000) NOT NULL, \n\tasset_id VARCHAR(36), \n\tPRIMARY KEY (id), \n\tUNIQUE (revision_id, reference), \n\tFOREIGN KEY(revision_id) REFERENCES retrospective_revisions (id), \n\tFOREIGN KEY(asset_id) REFERENCES file_assets (id)\n)\n\n')
    op.execute('CREATE INDEX ix_retrospective_evidence_revision_id ON retrospective_evidence (revision_id)')
    op.execute('ALTER TABLE knowledge_items ALTER COLUMN record_version_id DROP NOT NULL')
    op.execute('ALTER TABLE knowledge_items ADD COLUMN retrospective_revision_id VARCHAR(36) REFERENCES retrospective_revisions(id)')
    op.execute('CREATE INDEX ix_knowledge_items_retrospective_revision_id ON knowledge_items(retrospective_revision_id)')
    op.execute('ALTER TABLE knowledge_items ADD CONSTRAINT knowledge_source_xor CHECK ((record_version_id IS NULL) <> (retrospective_revision_id IS NULL))')
    op.execute('ALTER TABLE knowledge_items ADD CONSTRAINT knowledge_retro_unique UNIQUE(retrospective_revision_id,type,template_version)')
    op.execute('ALTER TABLE knowledge_evidence_links ALTER COLUMN evidence_id DROP NOT NULL')
    op.execute('ALTER TABLE knowledge_evidence_links ADD COLUMN retrospective_evidence_id VARCHAR(36) REFERENCES retrospective_evidence(id)')
    op.execute('ALTER TABLE knowledge_evidence_links ADD CONSTRAINT knowledge_evidence_xor CHECK ((evidence_id IS NULL) <> (retrospective_evidence_id IS NULL))')
    op.execute('ALTER TABLE knowledge_evidence_links ADD CONSTRAINT knowledge_retro_evidence_unique UNIQUE(revision_id,claim_path,retrospective_evidence_id)')
    op.execute('ALTER TABLE review_actions DROP CONSTRAINT review_actions_object_id_fkey')
    op.execute('ALTER TABLE review_actions DROP CONSTRAINT review_actions_revision_id_fkey')
    op.execute("ALTER TABLE review_actions ADD CONSTRAINT review_object_type CHECK (object_type IN ('knowledge_revision','retrospective_revision'))")
    op.execute('\nCREATE TABLE retrospective_experience_conversions (\n\tid VARCHAR(36) NOT NULL, \n\trevision_id VARCHAR(36) NOT NULL, \n\ttype VARCHAR(32) NOT NULL, \n\titem_id VARCHAR(36) NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (revision_id, type), \n\tFOREIGN KEY(revision_id) REFERENCES retrospective_revisions (id), \n\tFOREIGN KEY(item_id) REFERENCES knowledge_items (id)\n)\n\n')

def downgrade():
    # Refuse to silently destroy reviewed content or its evidence.
    op.execute("DO $$ BEGIN IF EXISTS (SELECT 1 FROM retrospectives) THEN RAISE EXCEPTION 'Export/remove B06 domain data explicitly before downgrade'; END IF; END $$")
    op.execute('DROP TABLE retrospective_experience_conversions')
    op.execute('ALTER TABLE review_actions DROP CONSTRAINT review_object_type')
    op.execute('ALTER TABLE review_actions ADD FOREIGN KEY(object_id) REFERENCES knowledge_items(id)')
    op.execute('ALTER TABLE review_actions ADD FOREIGN KEY(revision_id) REFERENCES knowledge_revisions(id)')
    op.execute('ALTER TABLE knowledge_evidence_links DROP CONSTRAINT knowledge_evidence_xor')
    op.execute('ALTER TABLE knowledge_evidence_links DROP CONSTRAINT knowledge_retro_evidence_unique')
    op.execute('ALTER TABLE knowledge_evidence_links DROP COLUMN retrospective_evidence_id')
    op.execute('ALTER TABLE knowledge_evidence_links ALTER COLUMN evidence_id SET NOT NULL')
    op.execute('ALTER TABLE knowledge_items DROP CONSTRAINT knowledge_source_xor')
    op.execute('ALTER TABLE knowledge_items DROP COLUMN retrospective_revision_id')
    op.execute('ALTER TABLE knowledge_items ALTER COLUMN record_version_id SET NOT NULL')
    op.execute('DROP TABLE retrospective_evidence')
    op.execute('DROP TABLE retrospective_sources')
    op.execute('DROP TABLE retrospective_revisions')
    op.execute('DROP TABLE retrospectives')
