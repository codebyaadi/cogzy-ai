from fastapi import Depends, FastAPI

from app.core.security import get_current_user
from app.models.auth import User

app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI with uv!"}


@app.get("/me")
def get_me(user: User = Depends(get_current_user)):
    """
    Returns the authenticated user's information.
    The 'user' object is automatically passed by the dependency.
    """
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
    }
