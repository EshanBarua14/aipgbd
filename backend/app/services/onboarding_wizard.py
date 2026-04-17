"""
Xpert Fintech eKYC Platform
Onboarding Wizard - M4
BFIU Circular No. 29 - Section 3.2
5-step wizard: NID -> PersonalInfo -> Photo -> Signature -> Notification
Server-side state machine with fallback trigger after 3 failed sessions
"""
import uuid
from datetime import datetime, timezone
from typing import Optional

# ---------------------------------------------------------------------------
# Wizard step definitions
# ---------------------------------------------------------------------------
STEPS = {
    1: "NID_VERIFICATION",
    2: "PERSONAL_INFO",
    3: "PHOTOGRAPH",
    4: "SIGNATURE",
    5: "NOTIFICATION",
}

STEP_NAMES = {v: k for k, v in STEPS.items()}

# Signature types allowed per risk level
SIGNATURE_TYPES_LOW_RISK  = ["WET", "ELECTRONIC", "DIGITAL", "PIN"]
SIGNATURE_TYPES_HIGH_RISK = ["WET", "ELECTRONIC", "DIGITAL"]

# Fallback threshold
FALLBACK_SESSION_THRESHOLD = 3   # After 3 failed sessions -> offer face matching

# ---------------------------------------------------------------------------
# In-memory wizard session store (Redis in prod)
# ---------------------------------------------------------------------------
_wizard_sessions: dict = {}

# ---------------------------------------------------------------------------
# Session management
# ---------------------------------------------------------------------------
def create_wizard_session(
    nid_number: str,
    agent_id:   str,
    channel:    str = "AGENCY",
    biometric_mode: str = "FINGERPRINT",
) -> dict:
    """Create a new onboarding wizard session."""
    session_id = str(uuid.uuid4())
    now        = datetime.now(timezone.utc).isoformat()

    session = {
        "session_id":      session_id,
        "nid_number":      nid_number,
        "agent_id":        agent_id,
        "channel":         channel,
        "biometric_mode":  biometric_mode,
        "current_step":    1,
        "current_step_name": STEPS[1],
        "status":          "IN_PROGRESS",
        "steps_completed": [],
        "step_data":       {},
        "failed_sessions": 0,
        "fallback_offered": False,
        "created_at":      now,
        "updated_at":      now,
    }
    _wizard_sessions[session_id] = session
    return session

def get_wizard_session(session_id: str) -> Optional[dict]:
    """Retrieve wizard session by ID."""
    return _wizard_sessions.get(session_id)

def reset_wizard_sessions():
    """Clear all sessions (for testing)."""
    _wizard_sessions.clear()

# ---------------------------------------------------------------------------
# Step processing
# ---------------------------------------------------------------------------
def process_step(session_id: str, step_data: dict) -> dict:
    """
    Process the current wizard step and advance to next.
    Returns updated session state.
    """
    session = get_wizard_session(session_id)
    if not session:
        return {"success": False, "error": "Session not found"}

    if session["status"] == "COMPLETED":
        return {"success": False, "error": "Session already completed"}

    if session["status"] == "FAILED":
        return {"success": False, "error": "Session failed"}

    current_step = session["current_step"]
    step_name    = STEPS.get(current_step)

    # Validate step data
    validation = _validate_step(step_name, step_data)
    if not validation["valid"]:
        return {
            "success":    False,
            "error":      validation["reason"],
            "step":       step_name,
            "session_id": session_id,
        }

    # Store step data
    session["step_data"][step_name] = step_data
    session["steps_completed"].append(step_name)
    session["updated_at"] = datetime.now(timezone.utc).isoformat()

    # Advance to next step
    next_step = current_step + 1
    if next_step > len(STEPS):
        session["current_step"]      = current_step
        session["current_step_name"] = step_name
        session["status"]            = "COMPLETED"
        session["completed_at"]      = datetime.now(timezone.utc).isoformat()
    else:
        session["current_step"]      = next_step
        session["current_step_name"] = STEPS[next_step]

    return {
        "success":          True,
        "session_id":       session_id,
        "step_completed":   step_name,
        "next_step":        STEPS.get(next_step, "COMPLETED"),
        "next_step_number": next_step if next_step <= len(STEPS) else None,
        "status":           session["status"],
        "steps_completed":  session["steps_completed"],
    }

def _validate_step(step_name: str, data: dict) -> dict:
    """Validate step-specific required fields."""
    if step_name == "NID_VERIFICATION":
        if not data.get("nid_number"):
            return {"valid": False, "reason": "nid_number required"}
        if not data.get("dob"):
            return {"valid": False, "reason": "dob required"}
        if not data.get("fingerprint_b64") and not data.get("verified"):
            return {"valid": False, "reason": "fingerprint_b64 or verified flag required"}

    elif step_name == "PERSONAL_INFO":
        if not data.get("full_name"):
            return {"valid": False, "reason": "full_name required"}
        if not data.get("mobile"):
            return {"valid": False, "reason": "mobile required"}

    elif step_name == "PHOTOGRAPH":
        if not data.get("photo_b64") and not data.get("photo_url"):
            return {"valid": False, "reason": "photo_b64 or photo_url required"}

    elif step_name == "SIGNATURE":
        if not data.get("signature_type"):
            return {"valid": False, "reason": "signature_type required"}
        sig_type = data["signature_type"].upper()
        risk     = data.get("risk_grade", "LOW").upper()
        allowed  = SIGNATURE_TYPES_HIGH_RISK if risk == "HIGH" else SIGNATURE_TYPES_LOW_RISK
        if sig_type not in allowed:
            return {
                "valid":  False,
                "reason": f"signature_type {sig_type} not allowed for {risk} risk. Allowed: {allowed}",
            }

    elif step_name == "NOTIFICATION":
        if not data.get("mobile") and not data.get("email"):
            return {"valid": False, "reason": "mobile or email required for notification"}

    return {"valid": True}

# ---------------------------------------------------------------------------
# Fallback trigger
# ---------------------------------------------------------------------------
def record_failed_session(session_id: str) -> dict:
    """
    Record a failed biometric session.
    After FALLBACK_SESSION_THRESHOLD failures, trigger face matching fallback.
    """
    session = get_wizard_session(session_id)
    if not session:
        return {"success": False, "error": "Session not found"}

    session["failed_sessions"] += 1
    session["updated_at"] = datetime.now(timezone.utc).isoformat()

    fallback_required = session["failed_sessions"] >= FALLBACK_SESSION_THRESHOLD

    if fallback_required and not session["fallback_offered"]:
        session["fallback_offered"] = True
        session["status"]           = "FALLBACK_REQUIRED"

    return {
        "session_id":        session_id,
        "failed_sessions":   session["failed_sessions"],
        "fallback_required": fallback_required,
        "fallback_offered":  session["fallback_offered"],
        "threshold":         FALLBACK_SESSION_THRESHOLD,
        "message":           (
            "Fingerprint verification failed 3 times. Face matching offered."
            if fallback_required else
            f"Failed {session['failed_sessions']}/{FALLBACK_SESSION_THRESHOLD} sessions."
        ),
        "bfiu_ref": "BFIU Circular No. 29 - Section 3.2",
    }

# ---------------------------------------------------------------------------
# Notification generator (Step 5)
# ---------------------------------------------------------------------------
def generate_notification(session: dict) -> dict:
    """
    Generate account opening notification content.
    Dispatched via registered SIM and email per BFIU guideline.
    """
    personal = session.get("step_data", {}).get("PERSONAL_INFO", {})
    nid_data = session.get("step_data", {}).get("NID_VERIFICATION", {})

    return {
        "notification_id": str(uuid.uuid4()),
        "session_id":      session["session_id"],
        "type":            "ACCOUNT_OPENING",
        "recipient_name":  personal.get("full_name", "Customer"),
        "mobile":          personal.get("mobile", ""),
        "email":           personal.get("email", ""),
        "nid_number":      nid_data.get("nid_number", ""),
        "channel":         session.get("channel", ""),
        "status":          "DISPATCHED",
        "dispatched_at":   datetime.now(timezone.utc).isoformat(),
        "bfiu_ref":        "BFIU Circular No. 29 - Section 3.2 Step 5",
    }
