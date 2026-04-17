"""
Xpert Fintech eKYC Platform
Session/Attempt Limiter - BFIU Circular No. 29 Section 3.2 and 3.3
- Max 10 attempts per session
- Max 2 sessions per day per NID
- In-memory backend for dev, Redis backend for prod
"""
import hmac
import hashlib
import time
from datetime import datetime, timezone, date
from typing import Optional
from app.core.config import settings

# ---------------------------------------------------------------------------
# NID hashing (never store plaintext NID)
# ---------------------------------------------------------------------------
_INSTITUTION_SECRET = settings.SECRET_KEY.encode()

def hash_nid(nid_number: str) -> str:
    """HMAC-SHA256(nid_number + institution_secret). Never stored in plaintext."""
    return hmac.new(
        _INSTITUTION_SECRET,
        nid_number.strip().encode(),
        hashlib.sha256
    ).hexdigest()

# ---------------------------------------------------------------------------
# In-memory store (dev mode)
# ---------------------------------------------------------------------------
# Structure:
#   _sessions[nid_hash][date_str] = session_count
#   _attempts[session_key]        = attempt_count
_sessions: dict = {}
_attempts: dict = {}

MAX_ATTEMPTS_PER_SESSION = settings.BFIU_MAX_ATTEMPTS_PER_SESSION   # 10
MAX_SESSIONS_PER_DAY     = settings.BFIU_MAX_SESSIONS_PER_DAY       # 2

# ---------------------------------------------------------------------------
# Session counting
# ---------------------------------------------------------------------------
def get_session_count_today(nid_hash: str) -> int:
    """Return number of sessions started today for this NID hash."""
    today = date.today().isoformat()
    return _sessions.get(nid_hash, {}).get(today, 0)

def increment_session_count(nid_hash: str) -> int:
    """Increment session count for today. Returns new count."""
    today = date.today().isoformat()
    if nid_hash not in _sessions:
        _sessions[nid_hash] = {}
    _sessions[nid_hash][today] = _sessions[nid_hash].get(today, 0) + 1
    return _sessions[nid_hash][today]

def check_session_limit(nid_hash: str) -> dict:
    """
    Check if NID can start a new session today.
    Returns dict with allowed, current_count, max_count.
    """
    count = get_session_count_today(nid_hash)
    return {
        "allowed":       count < MAX_SESSIONS_PER_DAY,
        "current_count": count,
        "max_count":     MAX_SESSIONS_PER_DAY,
        "retry_after":   _next_midnight_iso() if count >= MAX_SESSIONS_PER_DAY else None,
    }

# ---------------------------------------------------------------------------
# Attempt counting
# ---------------------------------------------------------------------------
def get_attempt_count(session_key: str) -> int:
    """Return number of attempts for this session key."""
    return _attempts.get(session_key, 0)

def increment_attempt_count(session_key: str) -> int:
    """Increment attempt count. Returns new count."""
    _attempts[session_key] = _attempts.get(session_key, 0) + 1
    return _attempts[session_key]

def check_attempt_limit(session_key: str) -> dict:
    """
    Check if session can make another attempt.
    Returns dict with allowed, current_count, max_count.
    """
    count = get_attempt_count(session_key)
    return {
        "allowed":       count < MAX_ATTEMPTS_PER_SESSION,
        "current_count": count,
        "max_count":     MAX_ATTEMPTS_PER_SESSION,
    }

def reset_session(session_key: str) -> None:
    """Reset attempt counter for a session (for testing)."""
    if session_key in _attempts:
        del _attempts[session_key]

def reset_nid_sessions(nid_hash: str) -> None:
    """Reset session counter for an NID hash (for testing)."""
    if nid_hash in _sessions:
        del _sessions[nid_hash]

# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
def _next_midnight_iso() -> str:
    """Return ISO 8601 timestamp of next midnight UTC."""
    from datetime import timedelta
    now = datetime.now(timezone.utc)
    midnight = (now + timedelta(days=1)).replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    return midnight.isoformat()

# ---------------------------------------------------------------------------
# Combined gate - call this before any biometric attempt
# ---------------------------------------------------------------------------
def gate_attempt(nid_number: str, session_key: str) -> dict:
    """
    Full BFIU gate check:
    1. Check session limit for NID (max 2/day)
    2. Check attempt limit for session (max 10)
    Returns dict with allowed, reason, details.
    """
    nid_hash = hash_nid(nid_number)

    session_check = check_session_limit(nid_hash)
    if not session_check["allowed"]:
        return {
            "allowed": False,
            "reason":  "SESSION_LIMIT_EXCEEDED",
            "details": session_check,
        }

    attempt_check = check_attempt_limit(session_key)
    if not attempt_check["allowed"]:
        return {
            "allowed": False,
            "reason":  "ATTEMPT_LIMIT_EXCEEDED",
            "details": attempt_check,
        }

    return {
        "allowed": True,
        "reason":  None,
        "details": {
            "session_count":  session_check["current_count"],
            "attempt_count":  attempt_check["current_count"],
        },
    }
