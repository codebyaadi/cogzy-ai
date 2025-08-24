from typing import Generator
from app.db.base import SessionLocal


def get_db() -> Generator:
    """
    FastAPI dependency that provides a database session for each request.

    This function is a generator that yields a new SQLAlchemy session.
    It uses a try...finally block to ensure that the session is always
    closed after the request is finished, releasing the connection back
    to the connection pool.
    """
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        if db:
            db.close()
