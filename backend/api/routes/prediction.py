"""Lead scoring prediction endpoint."""
import logging
import time
from fastapi import APIRouter, HTTPException, status
from backend.api.schemas.prediction import (
    LeadPredictionRequest,
    LeadPredictionResponse,
    ModelInfoSummary,
)
from backend.services.model_service import model_service
from backend.services.scoring_rules import (
    compute_lead_score,
    determine_segment,
    extract_input_signals,
    get_interpretation,
    get_recommended_action,
)

logger = logging.getLogger("leadlens.api.prediction")
router = APIRouter(tags=["Prediction"])


@router.post(
    "/predict",
    response_model=LeadPredictionResponse,
    summary="Predict Lead Score & Conversion Likelihood",
    description=(
        "Main LeadLens prediction endpoint. Accepts raw lead firmographics and "
        "engagement attributes, feeds them through the trained ML preprocessing and classification pipeline, "
        "and computes a conversion probability, calibrated 0-100 score, tier segment, "
        "recommended sales outreach action, interpretation, and explanatory input signals."
    ),
)
async def predict_lead(request: LeadPredictionRequest) -> LeadPredictionResponse:
    """Execute ML inference on a submitted lead record."""
    start_time = time.perf_counter()

    # 1. Verify model availability
    if not model_service.is_loaded:
        logger.error("Prediction requested while model pipeline is unavailable.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Prediction service is temporarily unavailable: Model pipeline not loaded.",
        )

    # 2. Extract technical parameters for safe logging (no personal data/email logged)
    logger.info(
        "Processing lead prediction: industry='%s', company_size='%s', source='%s', campaign='%s'",
        request.industry,
        request.company_size,
        request.lead_source,
        request.campaign,
    )

    lead_dict = request.to_model_dict()

    # 3. Model inference
    try:
        raw_prob = model_service.predict_probability(lead_dict)
    except Exception as exc:
        logger.error("ML model inference failed: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Lead prediction calculation failed due to an internal inference error.",
        ) from exc

    # 4. Centralized scoring, segmentation, and recommendations
    score_data = compute_lead_score(raw_prob)
    display_score = score_data["score"]
    segment = determine_segment(display_score)
    action = get_recommended_action(segment)
    interpretation = get_interpretation(segment)
    signals = extract_input_signals(lead_dict)

    latency_ms = (time.perf_counter() - start_time) * 1000.0
    logger.info(
        "Prediction completed successfully: score=%d, segment=%s, prob=%.4f (%.2f ms)",
        display_score,
        segment.value,
        score_data["probability"],
        latency_ms,
    )

    return LeadPredictionResponse(
        score=display_score,
        probability=score_data["probability"],
        probability_percent=score_data["probability_percent"],
        segment=segment.value,
        recommended_action=action,
        interpretation=interpretation,
        signals=signals,
        model=ModelInfoSummary(
            name=model_service.model_name,
            version=model_service.model_version,
        ),
    )
