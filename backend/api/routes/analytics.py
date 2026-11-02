"""
Analytics API endpoints for LeadLens Phase 3.6.
Exposes pipeline conversion trends, lead source effectiveness,
segment yields, campaign rankings, score distributions, and deterministic insights.
"""
import logging
from fastapi import APIRouter, HTTPException, Query, status

from backend.api.schemas.analytics import AnalyticsOverviewResponse
from backend.services.analytics_service import analytics_service

logger = logging.getLogger("leadlens.api.analytics")

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get(
    "/overview",
    response_model=AnalyticsOverviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Get aggregated business analytics overview",
    description=(
        "Returns pipeline metrics, conversion trends, channel effectiveness, "
        "score tier yields, campaign rankings, score histogram, and LeadLens insights "
        "for a requested date range ('7d', '30d', '90d', 'all')."
    ),
    responses={
        200: {"description": "Analytics overview successfully computed."},
        400: {"description": "Invalid time range parameter requested."},
        500: {"description": "Internal error processing analytics query."},
    },
)
async def get_analytics_overview(
    range: str = Query(
        "30d",
        description="Time range filter. Supported values: '7d', '30d', '90d', 'all'.",
        examples=["30d"],
    )
) -> AnalyticsOverviewResponse:
    """Retrieve comprehensive pipeline analytics for the chosen date window."""
    try:
        return analytics_service.get_overview(range)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        logger.error("Failed to generate analytics overview for range='%s': %s", range, exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate analytics overview.",
        ) from exc
