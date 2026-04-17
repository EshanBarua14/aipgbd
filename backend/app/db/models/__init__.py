# app/db/models/__init__.py
# Auth models (M2)
from .auth import Base, Institution, User, UserSession, AgentProfile

# Legacy models (M6) - imported from flat models.py
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.db.models_legacy import KYCProfile, KYCType, KYCStatus, InstitutionType

__all__ = [
    "Base", "Institution", "User", "UserSession", "AgentProfile",
    "KYCProfile", "KYCType", "KYCStatus", "InstitutionType",
]
