"""
Centralized business rules for LeadLens scoring, segmentation, recommendations, and explanatory input signals.

All score thresholds, actions, interpretations, and rule-based signal explanations
are defined here to guarantee strict consistency across the entire platform.
"""
from enum import Enum
from typing import Any, Dict, List


class LeadSegment(str, Enum):
    HOT = "HOT"
    WARM = "WARM"
    NURTURE = "NURTURE"
    COLD = "COLD"


# Centralized threshold boundaries (0 - 100 scale)
HOT_THRESHOLD = 80.0
WARM_THRESHOLD = 60.0
NURTURE_THRESHOLD = 40.0


# Centralized recommended sales actions per tier
RECOMMENDED_ACTIONS: Dict[LeadSegment, str] = {
    LeadSegment.HOT: "Contact immediately",
    LeadSegment.WARM: "Follow up within 24h",
    LeadSegment.NURTURE: "Add to nurture",
    LeadSegment.COLD: "Low-priority follow-up",
}


# Centralized lead interpretations per tier
INTERPRETATIONS: Dict[LeadSegment, str] = {
    LeadSegment.HOT: "High conversion potential. Prioritize this lead for immediate sales outreach.",
    LeadSegment.WARM: "Good conversion potential. Follow up and continue qualification.",
    LeadSegment.NURTURE: "Moderate potential. Continue engagement before direct sales outreach.",
    LeadSegment.COLD: "Low immediate potential. Consider automated nurturing.",
}


def compute_lead_score(probability: float) -> Dict[str, Any]:
    """
    Computes calibrated score and percentage from raw model conversion probability.

    Args:
        probability: Float between 0.0 and 1.0 representing conversion likelihood.

    Returns:
        Dict containing:
            - 'probability': Model probability rounded to 4 decimals
            - 'probability_percent': Probability as percentage rounded to 1 decimal
            - 'score': 0-100 display integer score rounded appropriately
    """
    clamped_prob = max(0.0, min(1.0, float(probability)))
    prob_percent = round(clamped_prob * 100.0, 1)
    display_score = int(round(clamped_prob * 100.0))

    return {
        "probability": round(clamped_prob, 4),
        "probability_percent": prob_percent,
        "score": display_score,
    }


def determine_segment(score: float) -> LeadSegment:
    """
    Maps a numeric score to the corresponding LeadLens tier.

    HOT: score >= 80
    WARM: 60 <= score < 80
    NURTURE: 40 <= score < 60
    COLD: score < 40
    """
    if score >= HOT_THRESHOLD:
        return LeadSegment.HOT
    elif score >= WARM_THRESHOLD:
        return LeadSegment.WARM
    elif score >= NURTURE_THRESHOLD:
        return LeadSegment.NURTURE
    else:
        return LeadSegment.COLD


def get_recommended_action(segment: LeadSegment) -> str:
    """Returns standardized sales recommendation based on segment tier."""
    return RECOMMENDED_ACTIONS.get(segment, "Low-priority follow-up")


def get_interpretation(segment: LeadSegment) -> str:
    """Returns standardized conversion interpretation based on segment tier."""
    return INTERPRETATIONS.get(
        segment,
        "Low immediate potential. Consider automated nurturing.",
    )


def extract_input_signals(lead_data: Dict[str, Any]) -> List[str]:
    """
    Extracts transparent, rule-based explanatory input signals from entered lead features.

    NOTE: These are input signals describing the lead's submitted attributes,
    NOT model feature importance or SHAP causal explanations.
    """
    signals: List[str] = []

    # High-intent explicit signals
    if lead_data.get("demo_requested") == "Yes":
        signals.append("Demo intent detected")

    if lead_data.get("pricing_page_viewed") == "Yes":
        signals.append("Pricing intent detected")

    # Engagement signals
    website_visits = int(lead_data.get("website_visits") or 0)
    pages_viewed = int(lead_data.get("pages_viewed") or 0)
    email_clicks = int(lead_data.get("email_clicks") or 0)

    if website_visits >= 5 or pages_viewed >= 10:
        signals.append("High website engagement")

    if lead_data.get("budget_identified") == "Yes":
        signals.append("Budget identified")

    # Senior decision-maker role check
    job_role = lead_data.get("job_role", "")
    if job_role in {"Founder / CEO", "Executive", "Director"}:
        signals.append("Senior decision-maker role")

    # Recent lead activity check
    days_since_active = int(lead_data.get("days_since_last_activity") or 0)
    if days_since_active <= 7:
        signals.append("Recent lead activity")

    # Low engagement flag
    if website_visits <= 1 and pages_viewed <= 2 and email_clicks == 0:
        signals.append("Low engagement")

    # Additional qualification signals
    if lead_data.get("content_downloaded") == "Yes":
        signals.append("Content downloaded")

    if lead_data.get("webinar_attended") == "Yes":
        signals.append("Webinar attended")

    if lead_data.get("sales_contacted") == "Yes":
        signals.append("Sales contacted")

    return signals
