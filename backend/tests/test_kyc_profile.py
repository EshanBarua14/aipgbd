"""
KYC Profile test suite — M6
BFIU Circular No. 29 — Section 6.1 (Simplified) and 6.2 (Regular)
Run: python tests/test_kyc_profile.py
Requires: uvicorn running on localhost:8000
"""
import json, urllib.request, urllib.error, time

API = "http://localhost:8000"
results = []

def post(ep, payload):
    data = json.dumps(payload).encode()
    req  = urllib.request.Request(f"{API}{ep}", data=data, headers={"Content-Type":"application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=10).read())

def get(ep):
    return json.loads(urllib.request.urlopen(f"{API}{ep}", timeout=10).read())

def patch(ep):
    req = urllib.request.Request(f"{API}{ep}", method="PATCH", headers={"Content-Type":"application/json"})
    return json.loads(urllib.request.urlopen(req, timeout=10).read())

def run(name, fn):
    print(f"  Testing: {name}")
    try:
        ok, msg = fn()
        print(f"  {'PASS' if ok else 'FAIL'} — {msg}")
        results.append((name, ok))
    except Exception as e:
        print(f"  FAIL — {e}")
        results.append((name, False))

BASE = {
    "session_id": f"test_kyc_{int(time.time())}",
    "verdict": "MATCHED", "confidence": 82.5,
    "institution_type": "INSURANCE_LIFE",
    "product_type": "life_term", "product_amount": 1500000,
    "full_name": "Md. Rafiqul Islam", "date_of_birth": "01/01/1985",
    "mobile": "+8801712345678", "fathers_name": "Abdul Islam",
    "mothers_name": "Fatema Begum", "gender": "M",
    "present_address": "House 12, Road 4, Dhaka 1207",
    "profession": "Engineer", "monthly_income": 80000,
    "source_of_funds": "Salary", "nominee_name": "Rahela Islam",
    "nominee_relation": "Spouse",
}

def test_create_simplified():
    d = post("/api/v1/kyc/profile", BASE)
    ok = d.get("kyc_type") == "SIMPLIFIED" and d.get("profile_id") is not None
    return ok, f"kyc_type={d.get('kyc_type')} id={d.get('profile_id')} risk={d.get('risk_grade')}"

def test_duplicate_rejected():
    try:
        post("/api/v1/kyc/profile", BASE)
        return False, "Should have returned 409"
    except urllib.error.HTTPError as e:
        return e.code == 409, f"HTTP {e.code} — duplicate correctly rejected"

def test_regular_above_threshold():
    d = post("/api/v1/kyc/profile", {**BASE,
        "session_id": f"test_reg_{int(time.time())}",
        "product_amount": 3000000,
    })
    ok = d.get("kyc_type") == "REGULAR"
    return ok, f"kyc_type={d.get('kyc_type')} amount=3,000,000 threshold=2,000,000"

def test_failed_verdict_rejected():
    try:
        post("/api/v1/kyc/profile", {**BASE,
            "session_id": f"test_fail_{int(time.time())}",
            "verdict": "FAILED",
        })
        return False, "Should have returned 400"
    except urllib.error.HTTPError as e:
        return e.code == 400, f"HTTP {e.code} — FAILED verdict correctly blocked"

def test_review_triggers_edd():
    d = post("/api/v1/kyc/profile", {**BASE,
        "session_id": f"test_edd_{int(time.time())}",
        "verdict": "REVIEW", "confidence": 38.0,
    })
    ok = d.get("edd_required") is True and d.get("status") == "EDD_REQUIRED"
    return ok, f"edd_required={d.get('edd_required')} status={d.get('status')}"

def test_pep_flag_triggers_edd():
    d = post("/api/v1/kyc/profile", {**BASE,
        "session_id": f"test_pep_{int(time.time())}",
        "pep_flag": True,
    })
    ok = d.get("edd_required") is True and d.get("risk_grade") == "HIGH"
    return ok, f"edd={d.get('edd_required')} grade={d.get('risk_grade')}"

def test_cmi_simplified_threshold():
    d = post("/api/v1/kyc/profile", {**BASE,
        "session_id": f"test_cmi_{int(time.time())}",
        "institution_type": "CMI",
        "product_type": "bo_account",
        "product_amount": 1000000,
    })
    ok = d.get("kyc_type") == "SIMPLIFIED"
    return ok, f"kyc_type={d.get('kyc_type')} CMI deposit=1,000,000 threshold=1,500,000"

def test_get_profile():
    d = get(f"/api/v1/kyc/profile/{BASE['session_id']}")
    ok = d.get("full_name") == BASE["full_name"] and d.get("session_id") == BASE["session_id"]
    return ok, f"name={d.get('full_name')} status={d.get('status')}"

def test_get_profile_not_found():
    try:
        get("/api/v1/kyc/profile/nonexistent_session_999")
        return False, "Should have returned 404"
    except urllib.error.HTTPError as e:
        return e.code == 404, f"HTTP {e.code} — not found correctly"

def test_list_profiles():
    d = get("/api/v1/kyc/profiles")
    ok = "total" in d and "profiles" in d and d["total"] > 0
    return ok, f"total={d.get('total')} profiles returned"

def test_approve_profile():
    d = patch(f"/api/v1/kyc/profile/{BASE['session_id']}/approve")
    ok = d.get("status") == "APPROVED"
    return ok, f"status={d.get('status')}"

def test_bfiu_ref_present():
    d = get(f"/api/v1/kyc/profile/{BASE['session_id']}")
    ok = "bfiu_ref" in d and "BFIU" in d["bfiu_ref"]
    return ok, f"bfiu_ref={d.get('bfiu_ref','')[:35]}"

if __name__ == "__main__":
    print("\n" + "="*55)
    print("  Aegis eKYC — KYC Profile Test Suite (M6)")
    print("  BFIU Circular No. 29 — Sections 6.1 & 6.2")
    print("="*55)
    run("Create Simplified profile (life < 20L)",    test_create_simplified)
    run("Duplicate session rejected (409)",          test_duplicate_rejected)
    run("Regular assigned above threshold",          test_regular_above_threshold)
    run("FAILED verdict blocked (400)",              test_failed_verdict_rejected)
    run("REVIEW verdict triggers EDD",               test_review_triggers_edd)
    run("PEP flag triggers EDD + HIGH risk",         test_pep_flag_triggers_edd)
    run("CMI Simplified below 15L threshold",        test_cmi_simplified_threshold)
    run("Get profile by session ID",                 test_get_profile)
    run("Get non-existent profile (404)",            test_get_profile_not_found)
    run("List all profiles",                         test_list_profiles)
    run("Approve profile (checker)",                 test_approve_profile)
    run("BFIU reference present",                    test_bfiu_ref_present)
    print("\n" + "="*55)
    passed = sum(1 for _,ok in results if ok)
    print(f"  Results: {passed}/{len(results)} passed")
    if passed == len(results):
        print("  All tests passed — M6 KYC Profile BFIU compliant")
    else:
        print(f"  Failed: {[n for n,ok in results if not ok]}")
    print("="*55 + "\n")
