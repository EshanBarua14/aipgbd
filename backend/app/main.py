"""
Xpert Fintech eKYC Platform — API Entry Point
BFIU Circular No. 29 Compliant
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import v1_router
from app.db.database import engine
from app.db import models

# Create all tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## Xpert Fintech eKYC Platform
**BFIU Circular No. 29 Compliant**

| Module | Endpoint | Status |
|--------|----------|--------|
| Face Verification | POST /api/v1/face/verify | Live |
| AI Analysis | POST /api/v1/ai/analyze | Live |
| Liveness Challenge | POST /api/v1/ai/challenge | Live |
| NID Scan | POST /api/v1/ai/scan-nid | Live |
| KYC Profile | POST /api/v1/kyc/profile | Live |
| Fingerprint | POST /api/v1/fingerprint/verify | Coming |
| Risk Grading | POST /api/v1/risk/grade | Coming |
| Sanctions Screen | POST /api/v1/sanctions/screen | Coming |
    """,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix=settings.API_V1_PREFIX)

@app.get("/health", tags=["System"])
def health():
    return {
        "status":  "ok",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "modules": ["face_verify", "ai_analysis", "liveness", "kyc_profile"],
    }
