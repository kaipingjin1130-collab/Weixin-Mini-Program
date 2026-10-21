"""B05 frozen package ingestion/version DDL."""
from alembic import op
revision = '0005_b05_task_packages'
down_revision = '0004_b04_retrieval'
branch_labels = None
depends_on = None

def upgrade():
    op.execute('\nCREATE TABLE task_package_streams (\n\tid VARCHAR(36) NOT NULL, \n\tproducer VARCHAR(128) NOT NULL, \n\ttask_id VARCHAR(128) NOT NULL, \n\torg_id VARCHAR(128) NOT NULL, \n\tproject_id VARCHAR(128) NOT NULL, \n\tlatest_received_version BIGINT NOT NULL, \n\tcurrent_ready_version BIGINT NOT NULL, \n\tcurrent_package_id VARCHAR(36), \n\tPRIMARY KEY (id), \n\tUNIQUE (producer, task_id)\n)\n\n')
    op.execute('CREATE INDEX ix_task_package_streams_project_id ON task_package_streams (project_id)')
    op.execute('\nCREATE TABLE task_packages (\n\tid VARCHAR(36) NOT NULL, \n\tstream_id VARCHAR(36) NOT NULL, \n\tproducer VARCHAR(128) NOT NULL, \n\tpackage_id VARCHAR(128) NOT NULL, \n\ttask_id VARCHAR(128) NOT NULL, \n\tpackage_version BIGINT NOT NULL, \n\tcontent_hash VARCHAR(64) NOT NULL, \n\tschema_version VARCHAR(32) NOT NULL, \n\torg_id VARCHAR(128) NOT NULL, \n\tproject_id VARCHAR(128) NOT NULL, \n\tscene_code VARCHAR(64) NOT NULL, \n\tstate VARCHAR(32) NOT NULL, \n\tsnapshot JSONB NOT NULL, \n\tis_demo BOOLEAN NOT NULL, \n\trun_id VARCHAR(36) NOT NULL, \n\tactor_id VARCHAR(36) NOT NULL, \n\tvalidation_errors JSONB NOT NULL, \n\twarnings JSONB NOT NULL, \n\tmissing_fields JSONB NOT NULL, \n\tcapabilities JSONB NOT NULL, \n\trow_version INTEGER NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\twithdrawn_at TIMESTAMP WITH TIME ZONE, \n\twithdrawal_reason VARCHAR(2000), \n\tPRIMARY KEY (id), \n\tUNIQUE (producer, task_id, package_version), \n\tUNIQUE (producer, package_id), \n\tFOREIGN KEY(stream_id) REFERENCES task_package_streams (id), \n\tUNIQUE (run_id), \n\tFOREIGN KEY(run_id) REFERENCES processing_runs (id)\n)\n\n')
    op.execute('CREATE INDEX ix_task_packages_created_at ON task_packages (created_at)')
    op.execute('CREATE INDEX ix_task_packages_project_id ON task_packages (project_id)')
    op.execute('CREATE INDEX ix_task_packages_state ON task_packages (state)')
    op.execute('CREATE INDEX ix_task_packages_stream_id ON task_packages (stream_id)')
    op.execute('CREATE INDEX ix_task_packages_task_id ON task_packages (task_id)')
    op.execute('\nCREATE TABLE task_events (\n\tid VARCHAR(36) NOT NULL, \n\tpackage_id VARCHAR(36) NOT NULL, \n\texternal_event_id VARCHAR(128) NOT NULL, \n\tposition INTEGER NOT NULL, \n\tevent_type VARCHAR(64) NOT NULL, \n\toccurred_at TIMESTAMP WITH TIME ZONE, \n\tactor JSONB NOT NULL, \n\trelated_object_id VARCHAR(128) NOT NULL, \n\tpayload JSONB NOT NULL, \n\tevidence_refs JSONB NOT NULL, \n\tis_known BOOLEAN NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (package_id, external_event_id), \n\tFOREIGN KEY(package_id) REFERENCES task_packages (id)\n)\n\n')
    op.execute('CREATE INDEX ix_task_events_package_id ON task_events (package_id)')
    op.execute('\nCREATE TABLE task_package_assets (\n\tid VARCHAR(36) NOT NULL, \n\tpackage_id VARCHAR(36) NOT NULL, \n\texternal_attachment_id VARCHAR(128) NOT NULL, \n\tasset_id VARCHAR(36), \n\taccess_ref JSONB NOT NULL, \n\tverification_state VARCHAR(32) NOT NULL, \n\terror VARCHAR(1000), \n\tPRIMARY KEY (id), \n\tUNIQUE (package_id, external_attachment_id), \n\tFOREIGN KEY(package_id) REFERENCES task_packages (id), \n\tUNIQUE (asset_id), \n\tFOREIGN KEY(asset_id) REFERENCES file_assets (id)\n)\n\n')
    op.execute('CREATE INDEX ix_task_package_assets_package_id ON task_package_assets (package_id)')
    op.execute('\nCREATE TABLE task_package_invalidations (\n\tid VARCHAR(36) NOT NULL, \n\tpackage_id VARCHAR(36) NOT NULL, \n\tevent_type VARCHAR(64) NOT NULL, \n\tstate VARCHAR(32) NOT NULL, \n\tpayload JSONB NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (package_id, event_type), \n\tFOREIGN KEY(package_id) REFERENCES task_packages (id)\n)\n\n')
    op.execute('CREATE INDEX ix_task_package_invalidations_package_id ON task_package_invalidations (package_id)')
    op.execute('\nCREATE TABLE task_package_requests (\n\tid VARCHAR(36) NOT NULL, \n\tactor_id VARCHAR(36) NOT NULL, \n\tproducer VARCHAR(128) NOT NULL, \n\toperation VARCHAR(32) NOT NULL, \n\tidempotency_key VARCHAR(128) NOT NULL, \n\tcontent_hash VARCHAR(64) NOT NULL, \n\tpackage_id VARCHAR(36) NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (actor_id, producer, operation, idempotency_key), \n\tFOREIGN KEY(package_id) REFERENCES task_packages (id)\n)\n\n')

def downgrade():
    op.drop_table('task_package_requests')
    op.drop_table('task_package_invalidations')
    op.drop_table('task_package_assets')
    op.drop_table('task_events')
    op.drop_table('task_packages')
    op.drop_table('task_package_streams')
