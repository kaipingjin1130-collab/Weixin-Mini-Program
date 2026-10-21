from alembic import context
from backend.db import engine, Base
from backend import models
from backend.modules.ingestion import models as ingestion_models
from backend.modules.knowledge import models as knowledge_models
from backend.modules.retrieval import models as retrieval_models

with engine.connect() as connection:
    context.configure(connection=connection, target_metadata=Base.metadata, compare_type=True)
    with context.begin_transaction():
        context.run_migrations()
