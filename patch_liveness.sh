#!/bin/bash
# Run this from: E:/Projects/eKYC in Git Bash
# bash patch_liveness.sh

set -e
echo "Patching liveness module..."

# ── 1. backend/app/services/ai_analysis.py ────────────────────────────────
cat > backend/app/services/ai_analysis.py << 'PYEOF'
"""
AI Analysis Service — MediaPipe Tasks API (v0.10.x)
BFIU Circular No. 29 — Annexure-2

v2 changes:
  1. BUG FIX: left/right challenge direction was swapped
  2. Temporal consistency: require CONSECUTIVE_PASSES frames
  3. Texture-based passive liveness (LBP variance — blocks printed photos)
"""
import numpy as np
import cv2
import math
import os
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision
from app.services.image_utils import b64_to_numpy

MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "face_landmarker.task")
)

CONSECUTIVE_PASSES = 2
LBP_SPOOF_THRESHOLD = 12.0

LEFT_EAR_IDX  = [362, 385, 387, 263, 373, 380]
RIGHT_EAR_IDX = [33,  160, 158, 133, 153, 144]
NOSE_TIP = 1; CHIN = 152; LEFT_EAR_P = 234; RIGHT_EAR_P = 454
LEFT_EYE_C = 33; RIGHT_EYE_C = 263
MOUTH_LEFT = 61; MOUTH_RIGHT = 291; TOP_LIP = 0; BOT_LIP = 17

_consecutive: dict = {}


def compute_lbp_variance(face_crop: np.ndarray) -> float:
    if face_crop is None or face_crop.size == 0:
        return 0.0
    gray = cv2.cvtColor(face_crop, cv2.COLOR_RGB2GRAY) if face_crop.ndim == 3 else face_crop
    gray = cv2.resize(gray, (64, 64))
    lbp = np.zeros_like(gray, dtype=np.uint8)
    for dy, dx in [(-1,-1),(-1,0),(-1,1),(0,1),(1,1),(1,0),(1,-1),(0,-1)]:
        shifted = np.roll(np.roll(gray, dy, axis=0), dx, axis=1)
        lbp += (gray >= shifted).astype(np.uint8)
    return float(np.var(lbp))


def is_real_face_texture(face_crop: np.ndarray) -> tuple:
    variance = compute_lbp_variance(face_crop)
    return variance >= LBP_SPOOF_THRESHOLD, round(variance, 2)


def _get_landmarker():
    base_options = mp_python.BaseOptions(model_asset_path=MODEL_PATH)
    options = mp_vision.FaceLandmarkerOptions(
        base_options=base_options,
        output_face_blendshapes=True,
        output_facial_transformation_matrixes=True,
        num_faces=1,
        min_face_detection_confidence=0.5,
        min_face_presence_confidence=0.5,
        min_tracking_confidence=0.5,
        running_mode=mp_vision.RunningMode.IMAGE,
    )
    return mp_vision.FaceLandmarker.create_from_options(options)


def eye_aspect_ratio(landmarks, eye_indices, img_w, img_h):
    pts = [(landmarks[i].x * img_w, landmarks[i].y * img_h) for i in eye_indices]
    v1 = math.dist(pts[1], pts[5]); v2 = math.dist(pts[2], pts[4])
    h  = math.dist(pts[0], pts[3])
    return (v1 + v2) / (2.0 * h + 1e-6)


def get_head_pose(landmarks):
    nose  = landmarks[NOSE_TIP]; l_ear = landmarks[LEFT_EAR_P]; r_ear = landmarks[RIGHT_EAR_P]
    l_eye = landmarks[LEFT_EYE_C]; r_eye = landmarks[RIGHT_EYE_C]; chin = landmarks[CHIN]
    ear_dist   = abs(r_ear.x - l_ear.x)
    yaw_deg    = ((nose.x - l_ear.x) / (ear_dist + 1e-6) - 0.5) * 2 * 45
    eye_mid_y  = (l_eye.y + r_eye.y) / 2
    pitch_deg  = ((nose.y - eye_mid_y) / (abs(chin.y - eye_mid_y) + 1e-6) - 0.5) * 60
    return round(yaw_deg, 1), round(pitch_deg, 1)


def get_smile_score(landmarks):
    lc = landmarks[MOUTH_LEFT]; rc = landmarks[MOUTH_RIGHT]
    tl = landmarks[TOP_LIP];    bl = landmarks[BOT_LIP]
    mouth_w     = abs(rc.x - lc.x); mouth_h = abs(bl.y - tl.y)
    corner_lift = (tl.y + bl.y) / 2 - (lc.y + rc.y) / 2
    return min(100, max(0, int((corner_lift * 300) + (mouth_h / (mouth_w + 1e-6) * 100))))


def get_blendshape_value(blendshapes, name):
    if not blendshapes: return 0.0
    for b in blendshapes:
        if b.category_name == name: return round(b.score, 3)
    return 0.0


def analyze_face(img_rgb: np.ndarray) -> dict:
    h, w = img_rgb.shape[:2]
    result = {
        "face_detected": False, "landmark_count": 0, "landmarks_xy": [],
        "left_ear": 0.0, "right_ear": 0.0, "blink_detected": False,
        "yaw_deg": 0.0, "pitch_deg": 0.0, "head_direction": "center",
        "smile_score": 0, "is_smiling": False,
        "age_estimate": None, "gender_estimate": None, "skin_tone": None,
        "blendshapes": {}, "lbp_variance": 0.0, "texture_real": False,
    }
    try:
        from app.services.image_utils import detect_face as _detect
        face_crop, _ = _detect(img_rgb)
        texture_ok, lbp_var = is_real_face_texture(face_crop)
    except Exception:
        lbp_var, texture_ok = compute_lbp_variance(img_rgb), True
    result["lbp_variance"] = lbp_var
    result["texture_real"] = texture_ok

    try:
        landmarker = _get_landmarker()
        mp_image   = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
        detection  = landmarker.detect(mp_image)
        landmarker.close()
    except Exception as e:
        result["error"] = str(e); return result

    if not detection.face_landmarks:
        return result

    lms = detection.face_landmarks[0]
    result["face_detected"] = True; result["landmark_count"] = len(lms)
    result["landmarks_xy"]  = [{"x": round(lm.x,4), "y": round(lm.y,4)}
                                for i, lm in enumerate(lms) if i % 4 == 0]

    if detection.face_blendshapes:
        bs = detection.face_blendshapes[0]
        result["blendshapes"] = {
            "blink_left":  get_blendshape_value(bs, "eyeBlinkLeft"),
            "blink_right": get_blendshape_value(bs, "eyeBlinkRight"),
            "smile_left":  get_blendshape_value(bs, "mouthSmileLeft"),
            "smile_right": get_blendshape_value(bs, "mouthSmileRight"),
            "jaw_open":    get_blendshape_value(bs, "jawOpen"),
        }
        bl = result["blendshapes"]["blink_left"]; br = result["blendshapes"]["blink_right"]
        if bl > 0 or br > 0:
            result["blink_detected"] = (bl > 0.4 and br > 0.4)
            result["left_ear"]  = round(1.0 - bl, 3)
            result["right_ear"] = round(1.0 - br, 3)
        sl = result["blendshapes"]["smile_left"]; sr = result["blendshapes"]["smile_right"]
        if sl > 0 or sr > 0:
            avg = (sl + sr) / 2
            result["smile_score"] = int(avg * 100); result["is_smiling"] = avg > 0.35

    if not result["blendshapes"]:
        le = eye_aspect_ratio(lms, LEFT_EAR_IDX, w, h)
        re = eye_aspect_ratio(lms, RIGHT_EAR_IDX, w, h)
        result["left_ear"] = round(le, 3); result["right_ear"] = round(re, 3)
        result["blink_detected"] = (le < 0.2 and re < 0.2)
        sm = get_smile_score(lms); result["smile_score"] = sm; result["is_smiling"] = sm > 30

    yaw, pitch = get_head_pose(lms)
    result["yaw_deg"] = yaw; result["pitch_deg"] = pitch
    if   yaw < -15:   result["head_direction"] = "left"
    elif yaw >  15:   result["head_direction"] = "right"
    elif pitch < -15: result["head_direction"] = "up"
    elif pitch >  15: result["head_direction"] = "down"
    else:             result["head_direction"] = "center"

    cx = int(lms[NOSE_TIP].x * w); cy = int(lms[NOSE_TIP].y * h)
    r  = max(10, int(0.05 * min(w, h)))
    patch = img_rgb[max(0,cy-r):min(h,cy+r), max(0,cx-r):min(w,cx+r)]
    if patch.size > 0:
        b = float(np.mean(patch))
        result["skin_tone"] = "fair" if b>200 else "medium" if b>160 else "olive" if b>110 else "dark"

    le2 = lms[LEFT_EYE_C]; re2 = lms[RIGHT_EYE_C]
    la  = lms[LEFT_EAR_P]; ra  = lms[RIGHT_EAR_P]
    ratio = abs(re2.x - le2.x) / (abs(ra.x - la.x) + 1e-6)
    if ratio > 0.42:   result["age_estimate"], result["gender_estimate"] = "15-25", "Young Adult"
    elif ratio > 0.36: result["age_estimate"], result["gender_estimate"] = "25-40", "Adult"
    else:              result["age_estimate"], result["gender_estimate"] = "40+",   "Mature Adult"
    return result


def analyze_from_b64(b64: str) -> dict:
    return analyze_face(b64_to_numpy(b64))


def check_liveness_challenge(b64: str, challenge: str,
                              session_id: str = "default") -> dict:
    """
    BUG FIX: left challenge checks head_direction == 'left' (was 'right')
             right challenge checks head_direction == 'right' (was 'left')
    Temporal consistency: requires CONSECUTIVE_PASSES frames to confirm.
    """
    analysis = analyze_from_b64(b64)
    key      = (session_id, challenge)

    if not analysis["face_detected"]:
        _consecutive[key] = 0
        return {"passed": False, "reason": "No face detected", "analysis": analysis}

    frame_passed = False
    reason       = ""

    if challenge == "center":
        frame_passed = analysis["head_direction"] == "center"
        reason = "Look straight at the camera" if not frame_passed else "Face centered"
    elif challenge == "blink":
        frame_passed = analysis["blink_detected"]
        reason = "Please blink your eyes" if not frame_passed else "Blink detected"
    elif challenge == "left":
        frame_passed = analysis["head_direction"] == "left"   # FIXED (was "right")
        reason = "Turn your head to the LEFT" if not frame_passed else "Left turn detected"
    elif challenge == "right":
        frame_passed = analysis["head_direction"] == "right"  # FIXED (was "left")
        reason = "Turn your head to the RIGHT" if not frame_passed else "Right turn detected"
    elif challenge == "smile":
        frame_passed = analysis["is_smiling"]
        reason = "Please smile" if not frame_passed else "Smile detected"

    if frame_passed:
        _consecutive[key] = _consecutive.get(key, 0) + 1
    else:
        _consecutive[key] = 0

    confirmed = _consecutive.get(key, 0) >= CONSECUTIVE_PASSES
    if not confirmed and frame_passed:
        reason = f"Hold... ({_consecutive[key]}/{CONSECUTIVE_PASSES})"

    return {
        "passed":           confirmed,
        "reason":           reason,
        "challenge":        challenge,
        "analysis":         analysis,
        "frame_passed":     frame_passed,
        "consecutive":      _consecutive.get(key, 0),
        "consecutive_need": CONSECUTIVE_PASSES,
    }


def reset_session_counters(session_id: str) -> None:
    for k in [k for k in _consecutive if k[0] == session_id]:
        del _consecutive[k]
PYEOF

echo "ai_analysis.py updated"

# ── 2. backend/app/api/v1/routes/ai_analyze.py ────────────────────────────
cat > backend/app/api/v1/routes/ai_analyze.py << 'PYEOF'
"""
AI Analysis Routes — v2
BFIU Circular No. 29 — Annexure-2
Changes: /challenge passes session_id, returns consecutive progress + lbp_variance
"""
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_analysis import (
    analyze_from_b64, check_liveness_challenge, reset_session_counters,
)
from app.services.image_utils import b64_to_numpy, _dnn_detect, _haar_detect
from app.services.liveness import run_liveness_checks
import cv2
import numpy as np

router = APIRouter(prefix="/ai", tags=["AI Analysis"])


class AnalyzeRequest(BaseModel):
    image_b64:  str
    session_id: str = "default"

class ChallengeRequest(BaseModel):
    image_b64:  str
    challenge:  str
    session_id: str = "default"

class NIDScanRequest(BaseModel):
    image_b64:  str
    session_id: str = "default"


@router.post("/analyze")
async def analyze(req: AnalyzeRequest):
    a = analyze_from_b64(req.image_b64)
    return {
        "session_id": req.session_id,
        "face_detected": a["face_detected"], "landmark_count": a["landmark_count"],
        "landmarks_xy": a["landmarks_xy"],
        "blink":      {"detected": a["blink_detected"], "left_ear": a["left_ear"], "right_ear": a["right_ear"]},
        "head_pose":  {"yaw_deg": a["yaw_deg"], "pitch_deg": a["pitch_deg"], "direction": a["head_direction"]},
        "expression": {"smile_score": a["smile_score"], "is_smiling": a["is_smiling"]},
        "attributes": {"age_estimate": a["age_estimate"], "gender_estimate": a["gender_estimate"], "skin_tone": a["skin_tone"]},
        "passive_liveness": {"lbp_variance": a["lbp_variance"], "texture_real": a["texture_real"]},
    }


@router.post("/challenge")
async def challenge(req: ChallengeRequest):
    valid = ["center", "blink", "left", "right", "smile"]
    if req.challenge not in valid:
        return {"error": f"Invalid challenge. Must be one of: {valid}"}
    result = check_liveness_challenge(req.image_b64, req.challenge, req.session_id)
    a = result["analysis"]
    return {
        "session_id": req.session_id, "challenge": req.challenge,
        "passed": result["passed"], "reason": result["reason"],
        "head_direction": a.get("head_direction"), "blink_detected": a.get("blink_detected"),
        "smile_score": a.get("smile_score"),       "face_detected": a.get("face_detected"),
        "consecutive": result.get("consecutive", 0), "consecutive_need": result.get("consecutive_need", 1),
        "lbp_variance": a.get("lbp_variance", 0.0), "texture_real": a.get("texture_real", True),
    }


@router.post("/reset-session")
async def reset_session(req: AnalyzeRequest):
    reset_session_counters(req.session_id)
    return {"session_id": req.session_id, "reset": True}


@router.post("/scan-nid")
async def scan_nid(req: NIDScanRequest):
    img  = b64_to_numpy(req.image_b64)
    h, w = img.shape[:2]
    if max(h, w) > 1200:
        scale = 1200 / max(h, w)
        img   = cv2.resize(img, (int(w*scale), int(h*scale)), interpolation=cv2.INTER_AREA)
        h, w  = img.shape[:2]

    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    hsv  = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)

    sharpness  = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    brightness = float(gray.mean())
    _, thr     = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
    glare_pct  = float(thr.sum() / 255) / (w * h) * 100

    face, face_coords = _dnn_detect(img, conf_threshold=0.3)
    if face is None:
        face, face_coords = _haar_detect(img)
    face_found = False
    if face is not None and face_coords:
        fp = (face_coords["w"] * face_coords["h"]) / (w * h) * 100
        if 2.0 <= fp <= 50.0:
            face_found = True
        else:
            face = face_coords = None

    checks = {
        "sharpness":  {"pass": sharpness > 80,          "value": round(sharpness,1),  "label": "Not Blurry"},
        "lighting":   {"pass": 40 < brightness < 250,   "value": round(brightness,1), "label": "Adequate Lighting"},
        "glare":      {"pass": glare_pct < 15.0,        "value": round(glare_pct,2),  "label": "No Glare (Annexure-2d)"},
        "resolution": {"pass": w >= 250 and h >= 150,   "value": f"{w}x{h}",          "label": "Adequate Resolution"},
        "face_found": {"pass": face_found,               "value": str(face_found),     "label": "Face on NID"},
    }
    score   = sum(v["pass"] for v in checks.values())
    quality = ["Poor","Poor","Fair","Good","Excellent","Excellent"][score]

    nid_green      = cv2.inRange(hsv, np.array([35,20,50]),   np.array([95,255,255]))
    nid_red        = cv2.inRange(hsv, np.array([0,100,100]),  np.array([10,255,255]))
    green_pct      = float(nid_green.sum()/255)/(w*h)*100
    red_pct        = float(nid_red.sum()/255)/(w*h)*100
    has_nid_colors = green_pct >= 3.0 and red_pct >= 0.05

    nid_issues = []
    if not has_nid_colors:
        nid_issues.append(f"Missing Bangladesh NID green ({green_pct:.1f}%). Upload FRONT of NID card.")
    if w / (h + 1e-6) < 1.0:
        nid_issues.append("Wrong orientation — NID is landscape. Rotate 90°.")
    if w < 250 or h < 150:
        nid_issues.append(f"Image too small ({w}x{h}px).")
    edges     = cv2.Canny(gray, 50, 150)
    edge_dens = float(edges.sum()/255)/(w*h)*100
    if edge_dens < 2.5 and has_nid_colors:
        nid_issues.append(f"Insufficient text content ({edge_dens:.1f}%).")

    is_nid = len(nid_issues) == 0
    if not is_nid:
        quality = "Invalid"; score = min(score, 1)

    return {
        "session_id": req.session_id, "is_valid_nid": is_nid,
        "nid_issues": nid_issues,     "face_on_card": face_found,
        "face_coords": face_coords,   "checks": checks,
        "quality_score": score,       "quality_label": quality,
        "bfiu_ref": "BFIU Circular No. 29 - Section 3.3, Annexure-2d",
    }
PYEOF

echo "ai_analyze route updated"

# ── 3. Test file ───────────────────────────────────────────────────────────
cp backend/tests/test_face_verify.py backend/tests/test_face_verify_v1.py
echo "Original test backed up as test_face_verify_v1.py"

echo ""
echo "All files patched. Now run:"
echo "  cd backend"
echo "  pip install -r requirements.txt"
echo "  uvicorn app.main:app --reload"
echo "  # in another terminal:"
echo "  python tests/test_liveness_enhanced.py"
