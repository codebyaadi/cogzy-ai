import hmac
import hashlib
import base64
import datetime
import logging
from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session as DBSession
from urllib.parse import unquote_plus

from app.core.config import settings
from app.db.session import get_db
from app.models.auth import Session, User

# Initialize logger for this module
logger = logging.getLogger(__name__)


def verify_better_auth_session(
    token: str, secret: str = settings.BETTER_AUTH_SECRET
) -> str | None:
    """
    Verifies the HMAC-SHA256 signature of the session token.
    This prevents a client from forging a session ID.

    Args:
        token: The full session token from the cookie (e.g., "session_id.signature").
        secret: The shared secret key configured in Better Auth.

    Returns:
        The session_id (the part before the first dot in the token) if the signature is valid,
        otherwise None.
    """
    try:
        # Split the incoming token into its session ID and signature components.
        # Example: "someID.someSignature" -> session_id="someID", signature="someSignature"
        session_id, signature = token.split(".", 1)
    except ValueError:
        # If the token doesn't contain a dot, its format is invalid.
        logger.warning("Invalid session token format received.")
        return None

    # Compute the expected signature bytes using HMAC-SHA256.
    # The secret and the session_id are used to generate this expected hash.
    expected_bytes = hmac.new(
        secret.encode(), session_id.encode(), hashlib.sha256
    ).digest()

    # The signature from the cookie might be URL-encoded (e.g., '+' as '%2B').
    # We must URL-decode it first to get the correct Base64URL string.
    decoded_signature_str = unquote_plus(signature)

    # Base64URL decoding: Better Auth omits padding ('=') and uses URL-safe chars ('-' instead of '+', '_' instead of '/').
    # We need to manually add padding if missing for correct decoding with `base64.urlsafe_b64decode`.
    padding = len(decoded_signature_str) % 4
    if padding == 2:
        padded_signature_str = decoded_signature_str + "=="
    elif padding == 3:
        padded_signature_str = decoded_signature_str + "="
    else:
        padded_signature_str = decoded_signature_str

    try:
        # Decode the Base64URL signature string into raw bytes.
        # This handles the URL-safe character set.
        received_bytes = base64.urlsafe_b64decode(padded_signature_str)
    except Exception as e:
        logger.error(f"Base64URL decoding of session signature failed: {e}")
        return None

    # Securely compare the received raw signature bytes with the expected raw signature bytes.
    # `hmac.compare_digest` prevents timing attacks.
    if hmac.compare_digest(received_bytes, expected_bytes):
        logger.debug(f"Session signature for ID '{session_id}' verified successfully.")
        return session_id
    else:
        logger.warning(f"Session signature for ID '{session_id}' failed verification.")
        return None


def get_session_from_cookie(request: Request, db: DBSession = Depends(get_db)):
    """
    A FastAPI dependency that handles the full session verification flow.
    It checks for the Better Auth cookie, verifies its signature, and then
    looks up the associated session and user in the database.

    Args:
        request: The incoming FastAPI request object.
        db: A SQLAlchemy session dependency for database interaction.

    Returns:
        A dictionary containing the validated Session and User objects.

    Raises:
        HTTPException: If the session is missing, invalid, expired, or user not found.
    """
    # Retrieve the session cookie value using the configured cookie name.
    cookie_value = request.cookies.get(settings.BETTER_AUTH_COOKIE_NAME)
    if not cookie_value:
        logger.info("Authentication failed: Missing Better Auth session cookie.")
        raise HTTPException(status_code=401, detail="Missing session cookie")

    # Verify the integrity and authenticity of the session cookie's signature.
    session_id = verify_better_auth_session(cookie_value)
    if not session_id:
        # The verification function already logs details on failure.
        raise HTTPException(status_code=401, detail="Invalid session signature")

    # Fetch the session record from the database using the extracted session_id.
    session = db.query(Session).filter(Session.token == session_id).first()
    if not session:
        logger.warning(
            f"Authentication failed: Session ID '{session_id}' not found in DB."
        )
        raise HTTPException(status_code=401, detail="Session not found")

    # Check if the session has expired by comparing its expiration time to the current UTC time.
    if session.expires_at.replace(tzinfo=datetime.timezone.utc) < datetime.datetime.now(
        datetime.timezone.utc
    ):
        logger.warning(f"Authentication failed: Session ID '{session_id}' has expired.")
        raise HTTPException(status_code=401, detail="Session expired")

    # Retrieve the user associated with this valid session.
    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        logger.error(
            f"Authentication failed: User ID '{session.user_id}' linked to session '{session_id}' not found."
        )
        raise HTTPException(status_code=401, detail="User not found")

    logger.info(f"User '{user.email}' (ID: {user.id}) successfully authenticated.")
    return {"session": session, "user": user}


def get_current_user(auth_result: dict = Depends(get_session_from_cookie)) -> User:
    """
    A simple, reusable FastAPI dependency that depends on `get_session_from_cookie`
    and returns only the authenticated User object.

    This simplifies route protection, allowing you to inject a 'User' object
    directly into your endpoint functions.

    Args:
        auth_result: The dictionary containing the Session and User objects
                     returned by `get_session_from_cookie`.

    Returns:
        The authenticated User object.
    """
    return auth_result["user"]
