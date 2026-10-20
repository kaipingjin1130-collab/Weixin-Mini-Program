from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from .config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True, pool_size=5, max_overflow=5)
Session = sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass
