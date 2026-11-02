"""Health check route."""
import logging
from fastapi import APIRouter
from backend.api.schemas.health import HealthResponse
from backend.services.model_service import model_service

logger = logging.getLogger("leadlens.api.health")
router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Service Health Check",
    description="Returns the operational status of the API and verifies whether the ML model is loaded.",
)
async def get_health() -> HealthResponse:
    """Check backend and ML model readiness."""
    is_ready = model_service.is_loaded
    status = "ok" if is_ready else "degraded"
    return HealthResponse(status=status, model_loaded=is_ready)
