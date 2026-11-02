"""
Campaign Intelligence API routes for LeadLens (Phase 3.7).
Manages marketing campaigns for Glitchreach, including listing, filtering,
search, creation, updates, archiving, and granular attribution analytics.
"""
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status

from backend.api.schemas.campaign import (
    CampaignCreateRequest,
    CampaignDetailResponse,
    CampaignListResponse,
    CampaignSummaryItem,
    CampaignUpdateRequest,
)
from backend.services.campaign_service import campaign_service

logger = logging.getLogger("leadlens.api.campaigns")

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


@router.get(
    "",
    response_model=CampaignListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all campaigns with summary performance",
    description="Retrieve all configured campaigns for Glitchreach with optional filters and calculated lead performance metrics.",
)
async def list_campaigns(
    status: Optional[str] = Query(None, description="Filter by campaign status ('Active', 'Paused', 'Completed', 'Draft', 'Archived', 'All')"),
    channel: Optional[str] = Query(None, description="Filter by acquisition channel ('LinkedIn', 'Google Ads', 'Email', etc.)"),
    campaign_type: Optional[str] = Query(None, description="Filter by campaign motion category ('Inbound', 'Outbound', 'ABM', etc.)"),
    search: Optional[str] = Query(None, description="Case-insensitive search query matching campaign name or description"),
) -> CampaignListResponse:
    """Retrieve filtered, searched list of campaigns."""
    try:
        return campaign_service.get_campaigns(
            status=status,
            channel=channel,
            campaign_type=campaign_type,
            search=search,
        )
    except Exception as exc:
        logger.error("Error retrieving campaigns: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load campaigns.",
        ) from exc


@router.get(
    "/{campaign_id}",
    response_model=CampaignDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get granular campaign intelligence and attribution",
    description="Retrieve deep performance metrics, channel mix, score distribution, and top leads for a single campaign.",
    responses={
        200: {"description": "Campaign intelligence details successfully retrieved."},
        404: {"description": "Campaign ID not found."},
    },
)
async def get_campaign(campaign_id: str) -> CampaignDetailResponse:
    """Retrieve detailed analytics for an individual campaign."""
    try:
        return campaign_service.get_campaign_detail(campaign_id)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Campaign '{campaign_id}' not found.",
        ) from exc
    except Exception as exc:
        logger.error("Error retrieving campaign '%s': %s", campaign_id, exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to retrieve campaign '{campaign_id}'.",
        ) from exc


@router.post(
    "",
    response_model=CampaignSummaryItem,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new campaign",
    description="Add a new marketing or outbound campaign to the Glitchreach workspace.",
    responses={
        201: {"description": "Campaign successfully created."},
        400: {"description": "Invalid campaign parameters."},
    },
)
async def create_campaign(req: CampaignCreateRequest) -> CampaignSummaryItem:
    """Register a new campaign in the workspace."""
    try:
        return campaign_service.create_campaign(req)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        logger.error("Failed to create campaign: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create campaign.",
        ) from exc


@router.patch(
    "/{campaign_id}",
    response_model=CampaignSummaryItem,
    status_code=status.HTTP_200_OK,
    summary="Update campaign details",
    description="Modify campaign metadata, status, budget, or dates.",
    responses={
        200: {"description": "Campaign successfully updated."},
        400: {"description": "Invalid update parameters."},
        404: {"description": "Campaign ID not found."},
    },
)
async def update_campaign(campaign_id: str, req: CampaignUpdateRequest) -> CampaignSummaryItem:
    """Update an existing campaign."""
    try:
        return campaign_service.update_campaign(campaign_id, req)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Campaign '{campaign_id}' not found.",
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
    except Exception as exc:
        logger.error("Failed to update campaign '%s': %s", campaign_id, exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to update campaign '{campaign_id}'.",
        ) from exc


@router.post(
    "/{campaign_id}/archive",
    response_model=CampaignSummaryItem,
    status_code=status.HTTP_200_OK,
    summary="Archive a campaign",
    description="Transition campaign status to 'Archived'.",
    responses={
        200: {"description": "Campaign successfully archived."},
        404: {"description": "Campaign ID not found."},
    },
)
async def archive_campaign(campaign_id: str) -> CampaignSummaryItem:
    """Archive an existing campaign."""
    try:
        return campaign_service.archive_campaign(campaign_id)
    except KeyError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Campaign '{campaign_id}' not found.",
        ) from exc
    except Exception as exc:
        logger.error("Failed to archive campaign '%s': %s", campaign_id, exc, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to archive campaign '{campaign_id}'.",
        ) from exc
