"""Model metadata and governance routes."""
import logging
from typing import List
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse

from backend.api.schemas.model_info import (
    ModelFeatureItem,
    ModelInfoResponse,
    ModelTournamentItem,
)
from backend.services.model_service import model_service

logger = logging.getLogger("leadlens.api.model_info")
router = APIRouter(tags=["Model Governance"])


@router.get(
    "/model-info",
    response_model=ModelInfoResponse,
    summary="Model Metadata & Performance",
    description=(
        "Returns sanitized metadata regarding the active production model, "
        "including CV and test ROC-AUC, accuracy, precision, recall, training date, "
        "and feature definitions. Does not expose filesystem paths."
    ),
)
async def get_model_info() -> ModelInfoResponse:
    """Fetch winning model performance benchmarks and metadata."""
    if not model_service.is_loaded:
        logger.warning("Attempted /model-info request while model service is not loaded.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model metadata is unavailable because the model pipeline is not loaded.",
        )

    metadata = model_service.get_safe_metadata()
    return ModelInfoResponse(**metadata)


@router.get(
    "/model-tournament",
    response_model=List[ModelTournamentItem],
    summary="Model Tournament Evaluation Results",
    description=(
        "Returns evaluation benchmarks for all candidate models evaluated during the Phase 3.2 "
        "model tournament, sorted by 5-fold cross-validation ROC-AUC mean descending."
    ),
)
async def get_model_tournament() -> List[ModelTournamentItem]:
    """Fetch tournament benchmark results for all evaluated models."""
    results = model_service.get_tournament_results()
    if not results:
        logger.warning("Tournament results requested but no data found.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model tournament evaluation results are unavailable.",
        )
    return [ModelTournamentItem(**row) for row in results]


@router.get(
    "/model-features",
    response_model=List[ModelFeatureItem],
    summary="Model Feature Importance",
    description=(
        "Returns the global feature predictive importance weights derived from the winning model, "
        "sorted by importance magnitude descending."
    ),
)
async def get_model_features() -> List[ModelFeatureItem]:
    """Fetch model feature importance entries."""
    features = model_service.get_feature_importance()
    if not features:
        logger.warning("Feature importance requested but no data found.")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model feature importance data is unavailable.",
        )
    return [ModelFeatureItem(**row) for row in features]


@router.get(
    "/model-artifacts/confusion-matrix",
    summary="Evaluation Confusion Matrix Image",
    description="Returns the visual confusion matrix artifact generated during holdout evaluation.",
    response_class=FileResponse,
)
async def get_confusion_matrix_artifact():
    """Stream confusion matrix evaluation visual artifact."""
    try:
        path = model_service.get_confusion_matrix_path()
        return FileResponse(path, media_type="image/png", filename="confusion_matrix.png")
    except FileNotFoundError as exc:
        logger.error("Confusion matrix artifact not found: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Confusion matrix image artifact not found on server.",
        ) from exc


@router.get(
    "/model-artifacts/calibration-curve",
    summary="Evaluation Calibration Curve Image",
    description="Returns the probability calibration curve artifact generated during evaluation.",
    response_class=FileResponse,
)
async def get_calibration_curve_artifact():
    """Stream probability calibration curve visual artifact."""
    try:
        path = model_service.get_calibration_curve_path()
        return FileResponse(path, media_type="image/png", filename="calibration_curve.png")
    except FileNotFoundError as exc:
        logger.error("Calibration curve artifact not found: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Calibration curve image artifact not found on server.",
        ) from exc
