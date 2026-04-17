"""
Xpert Fintech eKYC Platform
NID OCR Service - Tesseract OCR for Bangladesh NID cards
Extracts Bangla + English fields from NID card images
Falls back to mock data when Tesseract binary not available (dev/Windows)
"""
import re
import base64
import hashlib
from typing import Optional
from io import BytesIO

from PIL import Image

# ---------------------------------------------------------------------------
# Tesseract availability check
# ---------------------------------------------------------------------------
TESSERACT_AVAILABLE = False
try:
    import pytesseract
    pytesseract.get_tesseract_version()
    TESSERACT_AVAILABLE = True
except Exception:
    TESSERACT_AVAILABLE = False

# ---------------------------------------------------------------------------
# NID number validation (Bangladesh)
# ---------------------------------------------------------------------------
def validate_nid_number(nid: str) -> dict:
    """
    Validate Bangladesh NID number format.
    Old format: 13 digits
    New format: 17 digits
    Smart card: 10 digits
    """
    nid = nid.strip().replace(" ", "").replace("-", "")
    if re.match(r"^\d{10}$", nid):
        return {"valid": True,  "format": "smart_card",  "nid": nid}
    if re.match(r"^\d{13}$", nid):
        return {"valid": True,  "format": "old_13digit", "nid": nid}
    if re.match(r"^\d{17}$", nid):
        return {"valid": True,  "format": "new_17digit", "nid": nid}
    return {"valid": False, "format": None, "nid": nid, "reason": "Invalid NID format"}

# ---------------------------------------------------------------------------
# Image decoding
# ---------------------------------------------------------------------------
def decode_base64_image(b64_string: str) -> Optional[Image.Image]:
    """Decode base64 image string to PIL Image."""
    try:
        # Strip data URI prefix if present
        if "," in b64_string:
            b64_string = b64_string.split(",", 1)[1]
        image_bytes = base64.b64decode(b64_string)
        return Image.open(BytesIO(image_bytes)).convert("RGB")
    except Exception:
        return None

# ---------------------------------------------------------------------------
# OCR field extraction
# ---------------------------------------------------------------------------
def extract_nid_fields_ocr(image: Image.Image) -> dict:
    """
    Extract NID fields using Tesseract OCR.
    Uses Bengali + English language models.
    """
    if not TESSERACT_AVAILABLE:
        return _mock_ocr_result()

    try:
        # English side extraction
        eng_config = "--psm 6 --oem 3 -l eng"
        eng_text = pytesseract.image_to_string(image, config=eng_config)

        # Bengali side extraction
        ben_config = "--psm 6 --oem 3 -l ben+eng"
        ben_text = pytesseract.image_to_string(image, config=ben_config)

        return _parse_nid_text(eng_text, ben_text)
    except Exception as e:
        return {"error": str(e), "mode": "ocr_failed"}

def _parse_nid_text(eng_text: str, ben_text: str) -> dict:
    """Parse OCR text to extract structured NID fields."""
    fields = {
        "full_name_en":    None,
        "full_name_bn":    None,
        "date_of_birth":   None,
        "nid_number":      None,
        "fathers_name_en": None,
        "mothers_name_en": None,
        "mode":            "ocr_live",
    }

    # Extract name (English)
    name_match = re.search(r"Name[:\s]+([A-Za-z ]+)", eng_text, re.IGNORECASE)
    if name_match:
        fields["full_name_en"] = name_match.group(1).strip()

    # Extract date of birth
    dob_match = re.search(r"(\d{1,2}[\s/-]\d{1,2}[\s/-]\d{4}|\d{4}-\d{2}-\d{2})", eng_text)
    if dob_match:
        fields["date_of_birth"] = dob_match.group(1).strip()

    # Extract NID number (10, 13, or 17 digits)
    nid_match = re.search(r"(\d{10}|\d{13}|\d{17})", eng_text)
    if nid_match:
        fields["nid_number"] = nid_match.group(1)

    # Extract father name
    father_match = re.search(r"Father[:\s]+([A-Za-z ]+)", eng_text, re.IGNORECASE)
    if father_match:
        fields["fathers_name_en"] = father_match.group(1).strip()

    # Extract mother name
    mother_match = re.search(r"Mother[:\s]+([A-Za-z ]+)", eng_text, re.IGNORECASE)
    if mother_match:
        fields["mothers_name_en"] = mother_match.group(1).strip()

    return fields

# ---------------------------------------------------------------------------
# Mock OCR result (dev/Windows fallback)
# ---------------------------------------------------------------------------
def _mock_ocr_result() -> dict:
    """Return realistic mock NID OCR result for development."""
    return {
        "full_name_en":    "RAHMAN HOSSAIN CHOWDHURY",
        "full_name_bn":    "রহমান হোসেন চৌধুরী",
        "date_of_birth":   "1990-01-15",
        "nid_number":      "1234567890123",
        "fathers_name_en": "ABDUR RAHMAN CHOWDHURY",
        "mothers_name_en": "MST RASHIDA BEGUM",
        "mode":            "mock",
    }

# ---------------------------------------------------------------------------
# Main scan function
# ---------------------------------------------------------------------------
def scan_nid_card(
    front_image_b64: str,
    back_image_b64: Optional[str] = None,
) -> dict:
    """
    Full NID card scan pipeline:
    1. Decode images
    2. Run OCR on front (and back if provided)
    3. Extract and validate NID number
    4. Return structured result
    """
    # Decode front image
    front_image = decode_base64_image(front_image_b64)
    if front_image is None:
        return {
            "success":    False,
            "error_code": "IMAGE_DECODE_ERROR",
            "message":    "Could not decode front image",
        }

    # Extract fields
    fields = extract_nid_fields_ocr(front_image)

    # Also process back image if provided
    back_fields = {}
    if back_image_b64:
        back_image = decode_base64_image(back_image_b64)
        if back_image:
            back_fields = extract_nid_fields_ocr(back_image)

    # Merge fields (front takes priority)
    merged = {**back_fields, **fields}

    # Validate NID number
    nid_number = merged.get("nid_number")
    nid_validation = validate_nid_number(nid_number) if nid_number else {
        "valid": False, "reason": "NID number not detected in image"
    }

    return {
        "success":       True,
        "is_valid_nid":  nid_validation["valid"],
        "nid_format":    nid_validation.get("format"),
        "fields":        merged,
        "nid_hash":      hashlib.sha256(
                            (nid_number or "").encode()
                          ).hexdigest() if nid_number else None,
        "ocr_mode":      merged.get("mode", "ocr_live"),
    }
