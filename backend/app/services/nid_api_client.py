"""
Xpert Fintech eKYC Platform
EC NID API Client - Election Commission NID verification
Modes: LIVE (real EC API), DEMO (mock responses), STUB (offline dev)
"""
import hashlib
import hmac
import time
from datetime import datetime, timezone
from typing import Optional
from app.core.config import settings

# ---------------------------------------------------------------------------
# Client mode
# ---------------------------------------------------------------------------
NID_API_MODE = "DEMO"   # LIVE | DEMO | STUB
NID_API_BASE_URL = "https://nid.ec.gov.bd/api/v1"   # placeholder

# ---------------------------------------------------------------------------
# Demo NID database (realistic Bangladesh NID records)
# ---------------------------------------------------------------------------
_DEMO_NID_DB = {
    "1234567890123": {
        "nid_number":      "1234567890123",
        "full_name_en":    "RAHMAN HOSSAIN CHOWDHURY",
        "full_name_bn":    "রহমান হোসেন চৌধুরী",
        "date_of_birth":   "1990-01-15",
        "fathers_name":    "ABDUR RAHMAN CHOWDHURY",
        "mothers_name":    "MST RASHIDA BEGUM",
        "present_address": "123 Agrabad, Chittagong",
        "blood_group":     "O+",
        "gender":          "M",
        "photo_url":       None,
    },
    "9876543210987": {
        "nid_number":      "9876543210987",
        "full_name_en":    "FATEMA BEGUM",
        "full_name_bn":    "ফাতেমা বেগম",
        "date_of_birth":   "1985-06-20",
        "fathers_name":    "MD IBRAHIM",
        "mothers_name":    "MST AMENA KHATUN",
        "present_address": "456 Dhanmondi, Dhaka",
        "blood_group":     "A+",
        "gender":          "F",
        "photo_url":       None,
    },
    "1111111111111": {
        "nid_number":      "1111111111111",
        "full_name_en":    "KARIM UDDIN AHMED",
        "full_name_bn":    "করিম উদ্দিন আহমেদ",
        "date_of_birth":   "1975-03-10",
        "fathers_name":    "RAHIM UDDIN AHMED",
        "mothers_name":    "SUFIA BEGUM",
        "present_address": "789 Sylhet Sadar",
        "blood_group":     "B+",
        "gender":          "M",
        "photo_url":       None,
    },
}

# ---------------------------------------------------------------------------
# NID lookup
# ---------------------------------------------------------------------------
def lookup_nid(nid_number: str) -> dict:
    """
    Look up NID in EC database.
    Returns structured result with found, data, and source fields.
    """
    nid_number = nid_number.strip()

    if NID_API_MODE == "LIVE":
        return _live_lookup(nid_number)
    elif NID_API_MODE == "DEMO":
        return _demo_lookup(nid_number)
    else:
        return _stub_lookup(nid_number)

def _demo_lookup(nid_number: str) -> dict:
    """Return mock NID data from in-memory demo DB."""
    # Simulate network latency
    record = _DEMO_NID_DB.get(nid_number)
    if record:
        return {
            "found":      True,
            "source":     "DEMO",
            "nid_number": nid_number,
            "data":       record,
            "timestamp":  datetime.now(timezone.utc).isoformat(),
        }
    return {
        "found":      False,
        "source":     "DEMO",
        "nid_number": nid_number,
        "data":       None,
        "timestamp":  datetime.now(timezone.utc).isoformat(),
        "reason":     "NID not found in demo database",
    }

def _stub_lookup(nid_number: str) -> dict:
    """Offline stub - always returns a synthetic record."""
    return {
        "found":      True,
        "source":     "STUB",
        "nid_number": nid_number,
        "data": {
            "nid_number":    nid_number,
            "full_name_en":  "STUB CITIZEN",
            "full_name_bn":  "স্টাব নাগরিক",
            "date_of_birth": "2000-01-01",
            "gender":        "M",
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

def _live_lookup(nid_number: str) -> dict:
    """
    Live EC NID API call.
    Requires valid API credentials in environment.
    Returns NID_API_UNAVAILABLE on connection failure.
    """
    try:
        import requests
        headers = {
            "Authorization": f"Bearer {settings.SECRET_KEY}",
            "Content-Type":  "application/json",
            "X-Institution": "XPERT_FINTECH",
        }
        resp = requests.post(
            f"{NID_API_BASE_URL}/verify",
            json={"nid_number": nid_number},
            headers=headers,
            timeout=10,
        )
        if resp.status_code == 200:
            data = resp.json()
            return {
                "found":      True,
                "source":     "LIVE",
                "nid_number": nid_number,
                "data":       data,
                "timestamp":  datetime.now(timezone.utc).isoformat(),
            }
        return {
            "found":  False,
            "source": "LIVE",
            "reason": f"EC API returned {resp.status_code}",
        }
    except Exception as e:
        return {
            "found":      False,
            "source":     "LIVE",
            "error_code": "NID_API_UNAVAILABLE",
            "reason":     str(e),
            "timestamp":  datetime.now(timezone.utc).isoformat(),
        }

# ---------------------------------------------------------------------------
# Cross-match: compare OCR fields with EC database record
# ---------------------------------------------------------------------------
def cross_match_nid(ocr_fields: dict, ec_record: dict) -> dict:
    """
    Compare OCR-extracted fields against EC database record.
    Returns match score and field-by-field result.
    """
    if not ec_record:
        return {"match": False, "score": 0, "reason": "No EC record to compare"}

    checks = {}
    score  = 0
    total  = 0

    # Name match (case-insensitive)
    ocr_name = (ocr_fields.get("full_name_en") or "").upper().strip()
    ec_name  = (ec_record.get("full_name_en")  or "").upper().strip()
    if ocr_name and ec_name:
        total += 1
        name_match = _fuzzy_name_match(ocr_name, ec_name)
        checks["name"] = name_match
        if name_match["matched"]:
            score += 1

    # DOB match
    ocr_dob = (ocr_fields.get("date_of_birth") or "").strip()
    ec_dob  = (ec_record.get("date_of_birth")  or "").strip()
    if ocr_dob and ec_dob:
        total += 1
        dob_match = ocr_dob == ec_dob
        checks["dob"] = {"matched": dob_match, "ocr": ocr_dob, "ec": ec_dob}
        if dob_match:
            score += 1

    match_pct = (score / total * 100) if total > 0 else 0

    return {
        "match":     match_pct >= 50,
        "score_pct": round(match_pct, 1),
        "checks":    checks,
        "fields_checked": total,
    }

def _fuzzy_name_match(name1: str, name2: str) -> dict:
    """Simple name matching with token overlap."""
    tokens1 = set(name1.split())
    tokens2 = set(name2.split())
    overlap  = tokens1 & tokens2
    union    = tokens1 | tokens2
    score    = len(overlap) / len(union) if union else 0
    return {
        "matched": score >= 0.5,
        "score":   round(score, 2),
        "ocr":     name1,
        "ec":      name2,
    }
