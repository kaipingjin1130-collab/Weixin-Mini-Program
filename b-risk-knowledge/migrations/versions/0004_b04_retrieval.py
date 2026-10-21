"""B04 frozen release/index DDL; do not import live models from migrations."""
from alembic import op
revision = '0004_b04_retrieval'
down_revision = '0003_b03_knowledge'
branch_labels = None
depends_on = None

def upgrade():
    op.execute('CREATE EXTENSION IF NOT EXISTS vector')
    op.execute('ALTER TABLE knowledge_items ADD COLUMN withdrawn_at TIMESTAMPTZ, ADD COLUMN withdrawal_reason VARCHAR(2000)')
    op.execute('\nCREATE TABLE knowledge_releases (\n\tid VARCHAR(36) NOT NULL, \n\tversion VARCHAR(128) NOT NULL, \n\tstate VARCHAR(32) NOT NULL, \n\tactive_scope VARCHAR(128) NOT NULL, \n\tindex_config JSONB NOT NULL, \n\trun_id VARCHAR(36) NOT NULL, \n\tactor_id VARCHAR(36) NOT NULL, \n\trow_version INTEGER NOT NULL, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tpublished_at TIMESTAMP WITH TIME ZONE, \n\tbuild_ms FLOAT, \n\tPRIMARY KEY (id), \n\tUNIQUE (version), \n\tUNIQUE (run_id), \n\tFOREIGN KEY(run_id) REFERENCES processing_runs (id)\n)\n\n')
    op.execute('CREATE INDEX ix_knowledge_releases_active_scope ON knowledge_releases (active_scope)')
    op.execute('CREATE INDEX ix_knowledge_releases_created_at ON knowledge_releases (created_at)')
    op.execute("CREATE UNIQUE INDEX uq_active_release_project ON knowledge_releases (active_scope) WHERE state = 'active'")
    op.execute('\nCREATE TABLE embedding_sets (\n\tid VARCHAR(36) NOT NULL, \n\trelease_id VARCHAR(36) NOT NULL, \n\tmodel VARCHAR(128) NOT NULL, \n\tmodel_version VARCHAR(64) NOT NULL, \n\tdimension INTEGER NOT NULL, \n\tchunk_strategy VARCHAR(64) NOT NULL, \n\tstate VARCHAR(32) NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (release_id), \n\tFOREIGN KEY(release_id) REFERENCES knowledge_releases (id)\n)\n\n')
    op.execute('\nCREATE TABLE search_runs (\n\tid VARCHAR(36) NOT NULL, \n\tactor_id VARCHAR(36) NOT NULL, \n\tproject_id VARCHAR(128) NOT NULL, \n\tquery VARCHAR(64) NOT NULL, \n\tparameters JSONB NOT NULL, \n\trelease_id VARCHAR(36), \n\tresult_refs JSONB NOT NULL, \n\tlatency FLOAT NOT NULL, \n\tmodel_ref VARCHAR(128) NOT NULL, \n\tfeedback JSONB, \n\tcreated_at TIMESTAMP WITH TIME ZONE NOT NULL, \n\tPRIMARY KEY (id), \n\tFOREIGN KEY(release_id) REFERENCES knowledge_releases (id)\n)\n\n')
    op.execute('CREATE INDEX ix_search_runs_actor_id ON search_runs (actor_id)')
    op.execute('CREATE INDEX ix_search_runs_created_at ON search_runs (created_at)')
    op.execute('\nCREATE TABLE release_entries (\n\tid VARCHAR(36) NOT NULL, \n\trelease_id VARCHAR(36) NOT NULL, \n\tknowledge_revision_id VARCHAR(36) NOT NULL, \n\tstate VARCHAR(32) NOT NULL, \n\terror VARCHAR(1000), \n\tPRIMARY KEY (id), \n\tUNIQUE (release_id, knowledge_revision_id), \n\tFOREIGN KEY(release_id) REFERENCES knowledge_releases (id), \n\tFOREIGN KEY(knowledge_revision_id) REFERENCES knowledge_revisions (id)\n)\n\n')
    op.execute('CREATE INDEX ix_release_entries_release_id ON release_entries (release_id)')
    op.execute('\nCREATE TABLE search_chunks (\n\tid VARCHAR(36) NOT NULL, \n\trevision_id VARCHAR(36) NOT NULL, \n\tchunk_version VARCHAR(64) NOT NULL, \n\tclaim_path VARCHAR(128) NOT NULL, \n\ttext VARCHAR(20000) NOT NULL, \n\tkeywords VARCHAR[] NOT NULL, \n\tmetadata JSONB NOT NULL, \n\tscope VARCHAR(128) NOT NULL, \n\tPRIMARY KEY (id), \n\tUNIQUE (revision_id, chunk_version, claim_path), \n\tFOREIGN KEY(revision_id) REFERENCES knowledge_revisions (id)\n)\n\n')
    op.execute('CREATE INDEX ix_search_chunks_keywords ON search_chunks USING gin (keywords)')
    op.execute('CREATE INDEX ix_search_chunks_revision_id ON search_chunks (revision_id)')
    op.execute('CREATE INDEX ix_search_chunks_scope ON search_chunks (scope)')
    op.execute('\nCREATE TABLE chunk_embeddings (\n\tchunk_id VARCHAR(36) NOT NULL, \n\tembedding_set_id VARCHAR(36) NOT NULL, \n\tvector VECTOR NOT NULL, \n\tPRIMARY KEY (chunk_id, embedding_set_id), \n\tFOREIGN KEY(chunk_id) REFERENCES search_chunks (id), \n\tFOREIGN KEY(embedding_set_id) REFERENCES embedding_sets (id)\n)\n PARTITION BY LIST (embedding_set_id)\n\n')

def downgrade():
    op.drop_table('chunk_embeddings')
    op.drop_table('search_chunks')
    op.drop_table('release_entries')
    op.drop_table('search_runs')
    op.drop_table('embedding_sets')
    op.drop_table('knowledge_releases')
    op.execute('ALTER TABLE knowledge_items DROP COLUMN withdrawal_reason, DROP COLUMN withdrawn_at')
