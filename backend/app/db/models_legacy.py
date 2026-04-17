"""
KYC Profile ORM models
BFIU Circular No. 29 — Section 6.1 (Simplified) and 6.2 (Regular)
"""
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, Enum
from app.db.database import Base
import enum

class KYCType(str, enum.Enum):
    SIMPLIFIED = "SIMPLIFIED"
    REGULAR    = "REGULAR"

class KYCStatus(str, enum.Enum):
    PENDING      = "PENDING"
    APPROVED     = "APPROVED"
    REJECTED     = "REJECTED"
    EDD_REQUIRED = "EDD_REQUIRED"

class InstitutionType(str, enum.Enum):
    INSURANCE_LIFE     = "INSURANCE_LIFE"
    INSURANCE_NON_LIFE = "INSURANCE_NON_LIFE"
    CMI                = "CMI"

class KYCProfile(Base):
    __tablename__ = "kyc_profiles"

    id              = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id      = Column(String(128), unique=True, index=True, nullable=False)

    # Verification link
    verdict         = Column(String(16), nullable=False)   # MATCHED / REVIEW
    confidence      = Column(Float, nullable=False)

    # Institution context
    institution_type = Column(String(32), nullable=False, default="INSURANCE_LIFE")
    product_type    = Column(String(64), nullable=True)
    product_amount  = Column(Float, nullable=True)         # BDT

    # KYC classification (auto-assigned)
    kyc_type        = Column(String(16), nullable=False)   # SIMPLIFIED / REGULAR
    status          = Column(String(16), nullable=False, default="PENDING")

    # Personal information (BFIU §6.1 minimum fields)
    full_name       = Column(String(255), nullable=False)
    fathers_name    = Column(String(255), nullable=True)
    mothers_name    = Column(String(255), nullable=True)
    spouse_name     = Column(String(255), nullable=True)
    date_of_birth   = Column(String(20),  nullable=False)
    gender          = Column(String(1),   nullable=True)   # M / F / T
    mobile          = Column(String(20),  nullable=False)
    email           = Column(String(255), nullable=True)
    present_address = Column(Text,        nullable=True)
    permanent_address = Column(Text,      nullable=True)
    nationality     = Column(String(64),  nullable=False, default="Bangladeshi")
    profession      = Column(String(128), nullable=True)
    monthly_income  = Column(Float,       nullable=True)
    source_of_funds = Column(String(255), nullable=True)

    # Regular eKYC extras (BFIU §6.2)
    tin             = Column(String(32),  nullable=True)
    account_number  = Column(String(64),  nullable=True)

    # Nominee (both Simplified and Regular)
    nominee_name    = Column(String(255), nullable=True)
    nominee_relation = Column(String(64), nullable=True)

    # Compliance flags
    pep_flag        = Column(Boolean, default=False)       # Politically Exposed Person
    unscr_checked   = Column(Boolean, default=False)       # UN Sanctions check done
    source_of_funds_verified = Column(Boolean, default=False)
    edd_required    = Column(Boolean, default=False)
    risk_score      = Column(Integer, default=0)
    risk_grade      = Column(String(8), default="LOW")     # LOW / MEDIUM / HIGH

    # Timestamps
    created_at      = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at      = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                             onupdate=lambda: datetime.now(timezone.utc))

    # BFIU audit reference
    bfiu_ref        = Column(String(64), default="BFIU Circular No. 29 — Section 6")
