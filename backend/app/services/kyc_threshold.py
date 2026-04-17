"""
KYC Threshold Engine — BFIU Circular No. 29
Auto-assigns SIMPLIFIED or REGULAR based on product type and amount.

Thresholds (BFIU §6.1):
  Life Insurance    — sum assured <= BDT 20,00,000 OR annual premium <= BDT 2,50,000
  Non-Life Insurance — sum premium <= BDT 2,50,000
  CMI (Securities)  — deposit to BO account <= BDT 15,00,000
"""

THRESHOLDS = {
    "LIFE_SUM_ASSURED":    2_000_000,
    "LIFE_ANNUAL_PREMIUM": 250_000,
    "NON_LIFE_PREMIUM":    250_000,
    "CMI_DEPOSIT":         1_500_000,
}

RISK_HIGH_THRESHOLD = 15

PRODUCT_CATEGORIES = {
    "INSURANCE_LIFE":      ["life_endowment","life_term","life_whole","life_unit_linked","life_annuity"],
    "INSURANCE_NON_LIFE":  ["fire","marine","motor","health","travel","engineering","miscellaneous"],
    "CMI":                 ["bo_account","portfolio_management","mutual_fund","bond","debenture"],
}


def assign_kyc_type(institution_type: str, product_type: str, amount: float) -> str:
    if not product_type or amount is None:
        return "REGULAR"
    it = institution_type.upper()
    if it == "INSURANCE_LIFE":
        return "SIMPLIFIED" if amount <= THRESHOLDS["LIFE_SUM_ASSURED"] else "REGULAR"
    if it == "INSURANCE_NON_LIFE":
        return "SIMPLIFIED" if amount <= THRESHOLDS["NON_LIFE_PREMIUM"] else "REGULAR"
    if it == "CMI":
        return "SIMPLIFIED" if amount <= THRESHOLDS["CMI_DEPOSIT"] else "REGULAR"
    return "REGULAR"


def calculate_risk_score(profile_data: dict) -> tuple:
    """
    Risk scoring per BFIU Annexure-1.
    Returns (score: int, grade: str, edd_required: bool)

    PEP/IP is an AUTOMATIC HIGH override — BFIU §4.2 states
    PEP customers require EDD regardless of numeric score.
    """
    # PEP/IP = automatic HIGH, skip scoring
    if profile_data.get("pep_flag"):
        return RISK_HIGH_THRESHOLD, "HIGH", True

    score = 0

    # Source of funds
    score += 1 if profile_data.get("source_of_funds") else 5

    # Profession risk
    high_risk_professions = ["politician","judge","military","police","diplomat"]
    prof = (profile_data.get("profession") or "").lower()
    score += 5 if any(p in prof for p in high_risk_professions) else 1

    # Income level
    income = profile_data.get("monthly_income") or 0
    if income > 500_000:   score += 3
    elif income > 100_000: score += 2
    else:                  score += 1

    if score >= RISK_HIGH_THRESHOLD:
        grade = "HIGH"
    elif score >= 8:
        grade = "MEDIUM"
    else:
        grade = "LOW"

    return score, grade, grade == "HIGH"
