from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Create the SQLAlchemy engine for the relational database (PostgreSQL)
# The pool_pre_ping argument helps prevent errors from stale connections.
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Create a configured "Session" class, which will be a factory for new Session objects.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class for your ORM models to inherit from.
Base = declarative_base()
