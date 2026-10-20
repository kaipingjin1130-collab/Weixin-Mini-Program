"""B02 immutable source, version and evidence schema."""
from alembic import op
revision = '0002_b02_sources'
down_revision = '0001_b01'
branch_labels = None
depends_on = None

def upgrade():
    op.execute('\nCREATE TABLE data_sources (\n\tid VARCHAR(36) NOT NULL, \n\tproject_id VARCHAR(128) NOT NULL, \n\tname VARCHAR(200) NOT NULL, \n\tkind VARCHAR(32) NOT NULL, \n\tnamespace VARCHAR(128) NOT NULL, \n\tconfig JSONB NOT NULL, \n\tmapping_version VARCHAR(64) NOT NULL, \n\tcursor JSONB NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (project_id, namespace)\n)\n\n')
    op.execute('CREATE INDEX ix_data_sources_project_id ON data_sources (project_id)')
    op.execute('\nCREATE TABLE import_batches (\n\tid VARCHAR(36) NOT NULL, \n\tsource_id VARCHAR(36) NOT NULL, \n\trun_id VARCHAR(36) NOT NULL, \n\tinput_asset_id VARCHAR(36) NOT NULL, \n\tinput_hash VARCHAR(64) NOT NULL, \n\tmapping JSONB NOT NULL, \n\trule_version VARCHAR(64) NOT NULL, \n\tstatus VARCHAR(32) NOT NULL, \n\tcounts JSONB NOT NULL, \n\toptions JSONB NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tFOREIGN KEY(source_id) REFERENCES data_sources (id), \n\tUNIQUE (run_id), \n\tFOREIGN KEY(run_id) REFERENCES processing_runs (id), \n\tFOREIGN KEY(input_asset_id) REFERENCES file_assets (id)\n)\n\n')
    op.execute('CREATE INDEX ix_import_batches_created_at ON import_batches (created_at)')
    op.execute('CREATE INDEX ix_import_batches_source_id ON import_batches (source_id)')
    op.execute('\nCREATE TABLE source_documents (\n\tid VARCHAR(36) NOT NULL, \n\tsource_id VARCHAR(36) NOT NULL, \n\texternal_report_id VARCHAR(256) NOT NULL, \n\tsha256 VARCHAR(64), \n\ttitle VARCHAR(256) NOT NULL, \n\tasset_id VARCHAR(36), \n\tPRIMARY KEY (id), \n\tUNIQUE (source_id, external_report_id), \n\tFOREIGN KEY(source_id) REFERENCES data_sources (id), \n\tFOREIGN KEY(asset_id) REFERENCES file_assets (id)\n)\n\n')
    op.execute('\nCREATE TABLE source_records (\n\tid VARCHAR(36) NOT NULL, \n\tsource_id VARCHAR(36) NOT NULL, \n\tdocument_id VARCHAR(36) NOT NULL, \n\texternal_record_id VARCHAR(256) NOT NULL, \n\tproject_id VARCHAR(128) NOT NULL, \n\trecord_kind VARCHAR(32) NOT NULL, \n\tcurrent_version INTEGER NOT NULL, \n\tquality_status VARCHAR(32) NOT NULL, \n\toccurred_on VARCHAR(10), \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (source_id, external_record_id), \n\tFOREIGN KEY(source_id) REFERENCES data_sources (id), \n\tFOREIGN KEY(document_id) REFERENCES source_documents (id)\n)\n\n')
    op.execute('CREATE INDEX ix_source_records_created_at ON source_records (created_at)')
    op.execute('CREATE INDEX ix_source_records_occurred_on ON source_records (occurred_on)')
    op.execute('CREATE INDEX ix_source_records_project_id ON source_records (project_id)')
    op.execute('CREATE INDEX ix_source_records_record_kind ON source_records (record_kind)')
    op.execute('CREATE INDEX ix_source_records_source_id ON source_records (source_id)')
    op.execute('\nCREATE TABLE record_links (\n\tid VARCHAR(36) NOT NULL, \n\tfrom_record VARCHAR(36) NOT NULL, \n\tto_record VARCHAR(36) NOT NULL, \n\trelation_type VARCHAR(32) NOT NULL, \n\tmethod VARCHAR(64) NOT NULL, \n\treview_state VARCHAR(32) NOT NULL, \n\tversion_refs JSONB NOT NULL, \n\trow_version INTEGER NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (from_record, to_record), \n\tFOREIGN KEY(from_record) REFERENCES source_records (id), \n\tFOREIGN KEY(to_record) REFERENCES source_records (id)\n)\n\n')
    op.execute('CREATE INDEX ix_record_links_from_record ON record_links (from_record)')
    op.execute('\nCREATE TABLE source_record_versions (\n\tid VARCHAR(36) NOT NULL, \n\trecord_id VARCHAR(36) NOT NULL, \n\tversion INTEGER NOT NULL, \n\tcontent_hash VARCHAR(64) NOT NULL, \n\traw_fields JSONB NOT NULL, \n\teffective_fields JSONB NOT NULL, \n\tprovenance JSONB NOT NULL, \n\tissues JSONB NOT NULL, \n\tbatch_id VARCHAR(36) NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (record_id, version), \n\tUNIQUE (record_id, content_hash), \n\tFOREIGN KEY(record_id) REFERENCES source_records (id), \n\tFOREIGN KEY(batch_id) REFERENCES import_batches (id)\n)\n\n')
    op.execute('CREATE INDEX ix_source_record_versions_record_id ON source_record_versions (record_id)')
    op.execute('\nCREATE TABLE evidence_items (\n\tid VARCHAR(36) NOT NULL, \n\tdocument_id VARCHAR(36) NOT NULL, \n\trecord_version_id VARCHAR(36) NOT NULL, \n\tlocator JSONB NOT NULL, \n\tevidence_type VARCHAR(32) NOT NULL, \n\tasset_id VARCHAR(36), \n\trelation_confidence VARCHAR(32) NOT NULL, \n\tPRIMARY KEY (id), \n\tFOREIGN KEY(document_id) REFERENCES source_documents (id), \n\tFOREIGN KEY(record_version_id) REFERENCES source_record_versions (id), \n\tFOREIGN KEY(asset_id) REFERENCES file_assets (id)\n)\n\n')
    op.execute('CREATE INDEX ix_evidence_items_record_version_id ON evidence_items (record_version_id)')
    op.execute('\nCREATE TABLE import_rows (\n\tid VARCHAR(36) NOT NULL, \n\tbatch_id VARCHAR(36) NOT NULL, \n\trow_number INTEGER NOT NULL, \n\toutcome VARCHAR(16) NOT NULL, \n\trecord_id VARCHAR(36), \n\tversion_id VARCHAR(36), \n\tissues JSONB NOT NULL, \n\traw_fields JSONB NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (batch_id, row_number), \n\tFOREIGN KEY(batch_id) REFERENCES import_batches (id), \n\tFOREIGN KEY(record_id) REFERENCES source_records (id), \n\tFOREIGN KEY(version_id) REFERENCES source_record_versions (id)\n)\n\n')
    op.execute('CREATE INDEX ix_import_rows_batch_id ON import_rows (batch_id)')

def downgrade():
    op.drop_table('import_rows')
    op.drop_table('evidence_items')
    op.drop_table('source_record_versions')
    op.drop_table('record_links')
    op.drop_table('source_records')
    op.drop_table('source_documents')
    op.drop_table('import_batches')
    op.drop_table('data_sources')
