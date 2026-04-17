"""
M3 - NID Integration Layer Tests
Tests: NID validation, OCR mock, EC API client, session limiter, API endpoints
"""
import pytest
from fastapi.testclient import TestClient

# ---------------------------------------------------------------------------
# NID number validation tests
# ---------------------------------------------------------------------------
class TestNIDValidation:
    def setup_method(self):
        from app.services.nid_ocr_service import validate_nid_number
        self.validate = validate_nid_number

    def test_13_digit_nid_valid(self):
        r = self.validate("1234567890123")
        assert r["valid"] is True
        assert r["format"] == "old_13digit"

    def test_17_digit_nid_valid(self):
        r = self.validate("12345678901234567")
        assert r["valid"] is True
        assert r["format"] == "new_17digit"

    def test_10_digit_nid_valid(self):
        r = self.validate("1234567890")
        assert r["valid"] is True
        assert r["format"] == "smart_card"

    def test_short_nid_invalid(self):
        r = self.validate("12345")
        assert r["valid"] is False

    def test_alpha_nid_invalid(self):
        r = self.validate("ABC1234567890")
        assert r["valid"] is False

    def test_nid_strips_spaces(self):
        r = self.validate(" 1234567890123 ")
        assert r["valid"] is True

    def test_nid_strips_dashes(self):
        r = self.validate("123-4567890-123")
        assert r["valid"] is True


# ---------------------------------------------------------------------------
# NID OCR service tests
# ---------------------------------------------------------------------------
class TestNIDOCR:
    def setup_method(self):
        from app.services.nid_ocr_service import (
            scan_nid_card, decode_base64_image, TESSERACT_AVAILABLE
        )
        self.scan              = scan_nid_card
        self.decode_image      = decode_base64_image
        self.tesseract_available = TESSERACT_AVAILABLE

    def _make_dummy_b64(self) -> str:
        """Create a minimal valid base64 PNG image."""
        import base64
        from PIL import Image
        from io import BytesIO
        img = Image.new("RGB", (100, 60), color=(200, 200, 200))
        buf = BytesIO()
        img.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode()

    def test_scan_returns_success(self):
        b64 = self._make_dummy_b64()
        r = self.scan(b64)
        assert r["success"] is True

    def test_scan_has_nid_hash_or_none(self):
        b64 = self._make_dummy_b64()
        r = self.scan(b64)
        # nid_hash can be None if no NID detected, that is OK
        assert "nid_hash" in r

    def test_scan_has_fields(self):
        b64 = self._make_dummy_b64()
        r = self.scan(b64)
        assert "fields" in r

    def test_scan_invalid_b64_fails(self):
        result = self.scan("not_valid_base64_string")
        assert result["success"] is False
        assert result["error_code"] == "IMAGE_DECODE_ERROR"

    def test_mock_mode_returns_name(self):
        if self.tesseract_available:
            pytest.skip("Tesseract available - not in mock mode")
        b64 = self._make_dummy_b64()
        r = self.scan(b64)
        assert r["fields"]["mode"] == "mock"
        assert r["fields"]["full_name_en"] is not None

    def test_decode_valid_image(self):
        b64 = self._make_dummy_b64()
        img = self.decode_image(b64)
        assert img is not None

    def test_decode_invalid_returns_none(self):
        img = self.decode_image("garbage_data")
        assert img is None


# ---------------------------------------------------------------------------
# EC NID API client tests
# ---------------------------------------------------------------------------
class TestNIDAPIClient:
    def setup_method(self):
        from app.services.nid_api_client import (
            lookup_nid, cross_match_nid, _fuzzy_name_match
        )
        self.lookup       = lookup_nid
        self.cross_match  = cross_match_nid
        self.fuzzy_match  = _fuzzy_name_match

    def test_known_nid_found(self):
        r = self.lookup("1234567890123")
        assert r["found"] is True
        assert r["source"] == "DEMO"

    def test_known_nid_has_name(self):
        r = self.lookup("1234567890123")
        assert r["data"]["full_name_en"] is not None

    def test_unknown_nid_not_found(self):
        r = self.lookup("9999999999999")
        assert r["found"] is False

    def test_second_demo_nid_found(self):
        r = self.lookup("9876543210987")
        assert r["found"] is True
        assert r["data"]["gender"] == "F"

    def test_cross_match_same_name(self):
        ocr = {"full_name_en": "RAHMAN HOSSAIN CHOWDHURY", "date_of_birth": "1990-01-15"}
        ec  = {"full_name_en": "RAHMAN HOSSAIN CHOWDHURY", "date_of_birth": "1990-01-15"}
        r = self.cross_match(ocr, ec)
        assert r["match"] is True
        assert r["score_pct"] == 100.0

    def test_cross_match_different_name(self):
        ocr = {"full_name_en": "WRONG NAME"}
        ec  = {"full_name_en": "RAHMAN HOSSAIN CHOWDHURY"}
        r = self.cross_match(ocr, ec)
        assert r["match"] is False

    def test_cross_match_no_ec_record(self):
        r = self.cross_match({"full_name_en": "TEST"}, None)
        assert r["match"] is False

    def test_fuzzy_match_partial_name(self):
        r = self.fuzzy_match("RAHMAN HOSSAIN", "RAHMAN HOSSAIN CHOWDHURY")
        assert r["matched"] is True

    def test_fuzzy_match_no_overlap(self):
        r = self.fuzzy_match("JOHN SMITH", "RAHMAN HOSSAIN")
        assert r["matched"] is False


# ---------------------------------------------------------------------------
# Session limiter tests
# ---------------------------------------------------------------------------
class TestSessionLimiter:
    def setup_method(self):
        from app.services.session_limiter import (
            hash_nid, gate_attempt, increment_session_count,
            increment_attempt_count, check_session_limit,
            check_attempt_limit, reset_session, reset_nid_sessions,
            MAX_ATTEMPTS_PER_SESSION, MAX_SESSIONS_PER_DAY
        )
        self.hash_nid              = hash_nid
        self.gate                  = gate_attempt
        self.inc_session           = increment_session_count
        self.inc_attempt           = increment_attempt_count
        self.check_session         = check_session_limit
        self.check_attempt         = check_attempt_limit
        self.reset_session         = reset_session
        self.reset_nid             = reset_nid_sessions
        self.MAX_ATTEMPTS          = MAX_ATTEMPTS_PER_SESSION
        self.MAX_SESSIONS          = MAX_SESSIONS_PER_DAY
        # Clean state
        self.reset_session("test-sess-m3-001")
        self.reset_session("test-sess-m3-002")
        self.reset_session("test-sess-m3-003")
        self.reset_nid(self.hash_nid("1234567890123"))
        self.reset_nid(self.hash_nid("9999999999001"))
        self.reset_nid(self.hash_nid("9999999999002"))

    def test_hash_nid_returns_hex(self):
        h = self.hash_nid("1234567890123")
        assert len(h) == 64
        assert all(c in "0123456789abcdef" for c in h)

    def test_same_nid_same_hash(self):
        h1 = self.hash_nid("1234567890123")
        h2 = self.hash_nid("1234567890123")
        assert h1 == h2

    def test_different_nid_different_hash(self):
        h1 = self.hash_nid("1234567890123")
        h2 = self.hash_nid("9876543210987")
        assert h1 != h2

    def test_fresh_session_gate_allowed(self):
        r = self.gate("9999999999001", "test-sess-m3-001")
        assert r["allowed"] is True

    def test_attempt_limit_blocks_at_max(self):
        sess = "test-sess-m3-002"
        for _ in range(self.MAX_ATTEMPTS):
            self.inc_attempt(sess)
        r = self.check_attempt(sess)
        assert r["allowed"] is False

    def test_session_limit_blocks_at_max(self):
        nid = "9999999999002"
        nid_hash = self.hash_nid(nid)
        for _ in range(self.MAX_SESSIONS):
            self.inc_session(nid_hash)
        r = self.check_session(nid_hash)
        assert r["allowed"] is False

    def test_reset_session_clears_attempts(self):
        sess = "test-sess-m3-003"
        for _ in range(5):
            self.inc_attempt(sess)
        self.reset_session(sess)
        r = self.check_attempt(sess)
        assert r["current_count"] == 0

    def test_gate_returns_session_limit_exceeded(self):
        nid = "9999999999002"
        nid_hash = self.hash_nid(nid)
        self.reset_nid(nid_hash)
        for _ in range(self.MAX_SESSIONS):
            self.inc_session(nid_hash)
        r = self.gate(nid, "any-session")
        assert r["allowed"] is False
        assert r["reason"] == "SESSION_LIMIT_EXCEEDED"

    def test_bfiu_max_attempts_is_10(self):
        assert self.MAX_ATTEMPTS == 10

    def test_bfiu_max_sessions_is_2(self):
        assert self.MAX_SESSIONS == 2


# ---------------------------------------------------------------------------
# API endpoint tests
# ---------------------------------------------------------------------------
class TestNIDAPI:
    def setup_method(self):
        import sys, os
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
        from app.main import app
        self.client = TestClient(app)

        # Register + login to get token
        import app.api.v1.routes.auth as auth_module
        auth_module._demo_users.clear()
        self.client.post("/api/v1/auth/register", json={
            "email": "maker_nid@demo.com",
            "phone": "+8801712345678",
            "full_name": "NID Maker",
            "role": "MAKER",
            "password": "maker1234",
        })
        r = self.client.post("/api/v1/auth/token", json={
            "email": "maker_nid@demo.com",
            "password": "maker1234",
        })
        self.token = r.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

        # Clean session state
        from app.services.session_limiter import reset_session, reset_nid_sessions, hash_nid
        reset_session("api-test-session-001")
        reset_nid_sessions(hash_nid("1234567890123"))

    def _make_dummy_b64(self) -> str:
        import base64
        from PIL import Image
        from io import BytesIO
        img = Image.new("RGB", (100, 60), color=(200, 200, 200))
        buf = BytesIO()
        img.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode()

    def test_scan_nid_success(self):
        r = self.client.post("/api/v1/nid/scan", json={
            "front_image_b64": self._make_dummy_b64(),
            "session_id": "api-test-session-001",
        }, headers=self.headers)
        assert r.status_code == 200
        assert r.json()["success"] is True

    def test_scan_nid_invalid_image(self):
        r = self.client.post("/api/v1/nid/scan", json={
            "front_image_b64": "not_valid_base64_string",
            "session_id": "api-test-session-001",
        }, headers=self.headers)
        assert r.status_code == 400

    def test_verify_nid_known(self):
        r = self.client.post("/api/v1/nid/verify", json={
            "nid_number": "1234567890123",
            "session_id": "api-test-session-001",
        }, headers=self.headers)
        assert r.status_code == 200
        data = r.json()
        assert data["success"] is True
        assert data["ec_source"] == "DEMO"

    def test_verify_nid_invalid_format(self):
        r = self.client.post("/api/v1/nid/verify", json={
            "nid_number": "123",
            "session_id": "api-test-session-001",
        }, headers=self.headers)
        assert r.status_code == 422

    def test_verify_nid_unknown(self):
        r = self.client.post("/api/v1/nid/verify", json={
            "nid_number": "9999999999999",
            "session_id": "api-test-session-001",
        }, headers=self.headers)
        assert r.status_code == 404

    def test_session_status_endpoint(self):
        r = self.client.get(
            "/api/v1/nid/session-status",
            params={"nid_number": "1234567890123", "session_id": "api-test-session-001"},
            headers=self.headers,
        )
        assert r.status_code == 200
        data = r.json()
        assert "sessions_today" in data
        assert "attempts_used" in data
        assert data["max_attempts"] == 10
        assert data["max_sessions"] == 2

    def test_unauthenticated_request_fails(self):
        r = self.client.post("/api/v1/nid/verify", json={
            "nid_number": "1234567890123",
            "session_id": "api-test-session-001",
        })
        assert r.status_code == 403
