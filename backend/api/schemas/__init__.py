"""API schemas package for LeadLens backend."""
from backend.api.schemas.health import HealthResponse
from backend.api.schemas.model_info import (
    ModelFeatureItem,
    ModelInfoResponse,
    ModelTournamentItem,
)
from backend.api.schemas.prediction import (
    LeadPredictionRequest,
    LeadPredictionResponse,
    ModelInfoSummary,
)

from backend.api.schemas.analytics import (
    AnalyticsInsightItem,
    AnalyticsOverviewResponse,
    CampaignPerformanceItem,
    ConversionTrendItem,
    ScoreDistributionBucket,
    SegmentPerformanceItem,
    SourcePerformanceItem,
    SummaryMetrics,
)

from backend.api.schemas.campaign import (
    CampaignCreateRequest,
    CampaignDetailResponse,
    CampaignInsightItem,
    CampaignListResponse,
    CampaignScoreBucket,
    CampaignSegmentItem,
    CampaignSourceItem,
    CampaignSummaryCards,
    CampaignSummaryItem,
    CampaignTopLeadItem,
    CampaignTrendItem,
    CampaignUpdateRequest,
)

__all__ = [
    "HealthResponse",
    "ModelInfoResponse",
    "ModelTournamentItem",
    "ModelFeatureItem",
    "LeadPredictionRequest",
    "LeadPredictionResponse",
    "ModelInfoSummary",
    "SummaryMetrics",
    "ConversionTrendItem",
    "SourcePerformanceItem",
    "SegmentPerformanceItem",
    "CampaignPerformanceItem",
    "ScoreDistributionBucket",
    "AnalyticsInsightItem",
    "AnalyticsOverviewResponse",
    "CampaignSummaryItem",
    "CampaignSummaryCards",
    "CampaignListResponse",
    "CampaignSourceItem",
    "CampaignSegmentItem",
    "CampaignScoreBucket",
    "CampaignTrendItem",
    "CampaignTopLeadItem",
    "CampaignInsightItem",
    "CampaignDetailResponse",
    "CampaignCreateRequest",
    "CampaignUpdateRequest",
]
