from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True, pool_size=5, max_overflow=5,
                       connect_args={'options': f'-csearch_path={settings.database_schema},public'})


@event.listens_for(engine, 'connect')
def check_schema(connection, _record):
    with connection.cursor() as cursor:
        cursor.execute('SELECT current_schema()')
        if cursor.fetchone()[0] != settings.database_schema:
            raise RuntimeError('B schema missing; refusing fallback into public')
    connection.rollback()
Session = sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass
