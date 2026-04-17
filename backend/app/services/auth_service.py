"""
Xpert Fintech eKYC Platform
Auth service - password hashing, JWT issuance, TOTP, session management
"""
import uuid
import pyotp
from datetime import datetime, timezone
from typing import Optional

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError, InvalidHashError

from app.core.security import (
    create_access_token, create_refresh_token, decode_token,
    Role, is_ip_allowed, has_permission
)
from app.db.models.auth import Institution, User, UserSession, AgentProfile

# ---------------------------------------------------------------------------
# Password hashing (Argon2id)
# ---------------------------------------------------------------------------
_ph = PasswordHasher(
    time_cost=2,
    memory_cost=65536,
    parallelism=2,
    hash_len=32,
    salt_len=16,
)

def hash_password(plain: str) -> str:
    """Hash a plaintext password with Argon2id."""
    return _ph.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    """Verify plaintext against Argon2id hash. Returns False on mismatch."""
    try:
        return _ph.verify(hashed, plain)
    except (VerifyMismatchError, VerificationError, InvalidHashError):
        return False

def needs_rehash(hashed: str) -> bool:
    """Check if hash needs upgrading to current parameters."""
    return _ph.check_needs_rehash(hashed)

# ---------------------------------------------------------------------------
# TOTP (Google Authenticator compatible)
# ---------------------------------------------------------------------------
def generate_totp_secret() -> str:
    """Generate a new TOTP secret (base32)."""
    return pyotp.random_base32()

def get_totp_uri(secret: str, email: str, issuer: str = "Xpert eKYC") -> str:
    """Return otpauth:// URI for QR code generation."""
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=email, issuer_name=issuer)

def verify_totp(secret: str, code: str) -> bool:
    """Verify a 6-digit TOTP code. Allows 1 step drift (30s window)."""
    totp = pyotp.TOTP(secret)
    return totp.verify(code, valid_window=1)

def generate_otp() -> str:
    """Generate a 6-digit numeric OTP for SMS delivery."""
    import random
    return str(random.randint(100000, 999999))

# ---------------------------------------------------------------------------
# Token issuance
# ---------------------------------------------------------------------------
def issue_token_pair(
    user: User,
    institution: Institution,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> dict:
    """
    Issue access + refresh token pair.
    Returns dict with tokens and metadata.
    """
    access_jti  = str(uuid.uuid4())
    refresh_jti = str(uuid.uuid4())

    ip_whitelist = institution.ip_whitelist or []

    access_token = create_access_token(
        institution_id=institution.id,
        user_id=user.id,
        role=Role(user.role),
        tenant_schema=institution.schema_name,
        ip_whitelist=ip_whitelist,
    )
    refresh_token = create_refresh_token(
        institution_id=institution.id,
        user_id=user.id,
    )

    return {
        "access_token":  access_token,
        "refresh_token": refresh_token,
        "token_type":    "bearer",
        "expires_in":    900,  # 15 minutes in seconds
        "role":          user.role,
        "tenant_schema": institution.schema_name,
    }

# ---------------------------------------------------------------------------
# Session helpers (in-memory for SQLite dev mode)
# ---------------------------------------------------------------------------
_active_sessions: dict = {}
_revoked_jtis: set    = set()

def register_session(jti: str, user_id: str, expires_at: datetime) -> None:
    """Store session in memory (dev). Production uses Redis."""
    _active_sessions[jti] = {
        "user_id":    user_id,
        "expires_at": expires_at,
        "revoked":    False,
    }

def revoke_session(jti: str) -> None:
    """Revoke a session by jti."""
    _revoked_jtis.add(jti)
    if jti in _active_sessions:
        _active_sessions[jti]["revoked"] = True

def is_session_valid(jti: str) -> bool:
    """Return True if session exists and is not revoked."""
    if jti in _revoked_jtis:
        return False
    session = _active_sessions.get(jti)
    if not session:
        return True  # unknown jti - allow (stateless fallback)
    if session["revoked"]:
        return False
    if datetime.now(timezone.utc) > session["expires_at"]:
        return False
    return True

# ---------------------------------------------------------------------------
# Authentication flow
# ---------------------------------------------------------------------------
def authenticate_user(
    users_db: list,
    email: str,
    password: str,
) -> Optional[User]:
    """
    Find user by email and verify password.
    Returns User on success, None on failure.
    """
    user = next((u for u in users_db if u.email == email), None)
    if not user:
        return None
    if not user.is_active:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

def check_ip_whitelist(institution: Institution, client_ip: str) -> bool:
    """Check if client IP is allowed for this institution."""
    whitelist = institution.ip_whitelist or []
    return is_ip_allowed(client_ip, whitelist)

def check_permission(role: str, permission: str) -> bool:
    """Check if a role string has a given permission."""
    try:
        return has_permission(Role(role), permission)
    except ValueError:
        return False
