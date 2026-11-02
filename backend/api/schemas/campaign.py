"""
Pydantic schemas for the LeadLens Campaign Intelligence endpoints (Phase 3.7).
"""
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator


class CampaignSummaryItem(BaseModel):
    """Single campaign overview item with dynamically calculated performance."""
    id: str = Field(..., description="Unique campaign slug / identifier", examples=["q4-enterprise"])
    name: str = Field(..., description="Campaign title / initiative name", examples=["Q4 Enterprise Inbound"])
    description: Optional[str] = Field("", description="Campaign strategic goal and scope")
    status: str = Field(..., description="Campaign operational status ('Active', 'Paused', 'Completed', 'Draft', 'Archived')", examples=["Active"])
    channel: str = Field(..., description="Primary acquisition channel ('LinkedIn', 'Google Ads', 'Email', 'Referral', 'Website', 'Webinar')", examples=["Google Ads"])
    campaign_type: str = Field(..., description="Campaign motion category ('Inbound', 'Outbound', 'Retargeting', 'Content', 'Webinar', 'ABM')", examples=["Inbound"])
    start_date: str = Field(..., description="Campaign start date (YYYY-MM-DD)", examples=["2026-09-15"])
    end_date: Optional[str] = Field(None, description="Campaign scheduled end date (YYYY-MM-DD)", examples=["2026-12-31"])
    budget: float = Field(..., description="Allocated financial budget in USD", examples=[35000.0])
    owner: str = Field(..., description="Assigned campaign lead / growth marketer", examples=["Elena Rostova"])
    created_at: str = Field(..., description="ISO creation timestamp")
    total_leads: int = Field(..., description="Total leads attributed to this campaign", examples=[561])
    converted_leads: int = Field(..., description="Total leads converted from this campaign", examples=[163])
    conversion_rate: float = Field(..., description="Conversion rate percentage (converted / total * 100)", examples=[28.99])
    average_score: float = Field(..., description="Mean lead score across this campaign", examples=[60.1])


class CampaignSummaryCards(BaseModel):
    """Headline aggregate cards for campaign workspace header."""
    total_campaigns: int = Field(..., description="Total count of configured campaigns", examples=[8])
    active_campaigns: int = Field(..., description="Total active running campaigns", examples=[5])
    total_campaign_leads: int = Field(..., description="Total leads attributed across all campaigns", examples=[2151])
    average_campaign_conversion_rate: float = Field(..., description="Macro average conversion rate across campaigns", examples=[31.71])


class CampaignListResponse(BaseModel):
    """Response payload for GET /api/campaigns."""
    summary: CampaignSummaryCards
    campaigns: List[CampaignSummaryItem]


class CampaignSourceItem(BaseModel):
    """Channel breakdown within an individual campaign."""
    source: str = Field(..., description="Acquisition source channel", examples=["Google Ads"])
    total_leads: int = Field(..., description="Leads from this source within the campaign", examples=[312])
    converted_leads: int = Field(..., description="Conversions from this source within the campaign", examples=[98])
    conversion_rate: float = Field(..., description="Source-level conversion percentage", examples=[31.41])


class CampaignSegmentItem(BaseModel):
    """Lead qualification tier breakdown within a campaign."""
    segment: str = Field(..., description="LeadLens score tier ('HOT', 'WARM', 'NURTURE', 'COLD')", examples=["HOT"])
    total_leads: int = Field(..., description="Leads in this tier for the campaign", examples=[95])
    converted_leads: int = Field(..., description="Conversions in this tier", examples=[75])
    conversion_rate: float = Field(..., description="Conversion rate percentage", examples=[78.95])
    average_score: float = Field(..., description="Mean score in this tier", examples=[86.4])


class CampaignScoreBucket(BaseModel):
    """Histogram bucket representing lead quality spread for a campaign."""
    bucket: str = Field(..., description="Score interval identifier ('0-19', '80-100')", examples=["80-100"])
    range_label: str = Field(..., description="Human-readable score label", examples=["Score 80–100 (Hot)"])
    count: int = Field(..., description="Lead count in bucket", examples=[95])
    percentage: float = Field(..., description="Percentage of campaign leads in bucket", examples=[16.9])


class CampaignTrendItem(BaseModel):
    """Time series point showing activity velocity for a campaign."""
    date: str = Field(..., description="Formatted date (YYYY-MM-DD)", examples=["2026-10-21"])
    leads: int = Field(..., description="Leads generated on date", examples=[12])
    converted: int = Field(..., description="Conversions on date", examples=[4])
    conversion_rate: float = Field(..., description="Daily conversion rate percentage", examples=[33.3])


class CampaignTopLeadItem(BaseModel):
    """High-priority lead profile associated with this campaign."""
    lead_id: str = Field(..., description="Lead ID for routing to /leads/{lead_id}", examples=["101"])
    name: str = Field(..., description="Lead prospect name", examples=["Sarah Mitchell"])
    company: str = Field(..., description="Lead company name", examples=["Acme Technologies"])
    score: int = Field(..., description="AI lead score (0-100)", examples=[87])
    segment: str = Field(..., description="Qualification tier ('HOT', 'WARM', 'NURTURE', 'COLD')", examples=["HOT"])
    status: str = Field(..., description="Operational status or recommended action", examples=["Contact immediately"])


class CampaignInsightItem(BaseModel):
    """Deterministic, data-supported observation for a single campaign."""
    id: str = Field(..., description="Unique insight key identifier", examples=["insight-camp-conv"])
    type: str = Field(..., description="Visual sentiment type ('positive', 'opportunity', 'trend', 'neutral')", examples=["positive"])
    title: str = Field(..., description="Insight headline", examples=["High HOT Tier Conversion"])
    description: str = Field(..., description="Data-supported explanation without speculative causation", examples=["HOT leads in this campaign convert at 78.4%."])
    metric_value: Optional[str] = Field(None, description="Optional callout metric badge", examples=["78.4%"])


class CampaignDetailResponse(BaseModel):
    """Comprehensive single-campaign intelligence response for GET /api/campaigns/{id}."""
    id: str
    name: str
    description: Optional[str] = ""
    status: str
    channel: str
    campaign_type: str
    start_date: str
    end_date: Optional[str] = None
    budget: float
    owner: str
    created_at: str
    total_leads: int
    converted_leads: int
    conversion_rate: float
    average_score: float
    source_performance: List[CampaignSourceItem]
    segment_performance: List[CampaignSegmentItem]
    score_distribution: List[CampaignScoreBucket]
    conversion_trend: List[CampaignTrendItem]
    top_leads: List[CampaignTopLeadItem]
    insights: List[CampaignInsightItem]


class CampaignCreateRequest(BaseModel):
    """Payload for creating a new campaign."""
    name: str = Field(..., min_length=2, description="Campaign title (required)", examples=["Q1 Inbound Product Tour"])
    description: Optional[str] = Field("", description="Campaign strategic purpose")
    channel: str = Field(..., min_length=2, description="Acquisition channel (required)", examples=["LinkedIn"])
    campaign_type: str = Field(..., min_length=2, description="Campaign motion category (required)", examples=["Inbound"])
    status: Optional[str] = Field("Active", description="Campaign initial status ('Active', 'Draft', 'Paused')", examples=["Active"])
    start_date: str = Field(..., description="Start date YYYY-MM-DD (required)", examples=["2026-11-01"])
    end_date: Optional[str] = Field(None, description="End date YYYY-MM-DD", examples=["2026-12-31"])
    budget: float = Field(..., ge=0, description="Allocated budget in USD (required, >= 0)", examples=[15000.0])
    owner: Optional[str] = Field("Sarah Jenkins", description="Campaign growth owner", examples=["Sarah Jenkins"])

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date:
            if self.end_date < self.start_date:
                raise ValueError("End date cannot be earlier than start date.")
        return self


class CampaignUpdateRequest(BaseModel):
    """Payload for updating an existing campaign."""
    name: Optional[str] = Field(None, min_length=2, description="Updated campaign title")
    description: Optional[str] = Field(None, description="Updated description")
    channel: Optional[str] = Field(None, min_length=2, description="Updated channel")
    campaign_type: Optional[str] = Field(None, min_length=2, description="Updated type")
    status: Optional[str] = Field(None, description="Updated status")
    start_date: Optional[str] = Field(None, description="Updated start date")
    end_date: Optional[str] = Field(None, description="Updated end date")
    budget: Optional[float] = Field(None, ge=0, description="Updated budget (>= 0)")
    owner: Optional[str] = Field(None, description="Updated owner")

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date:
            if self.end_date < self.start_date:
                raise ValueError("End date cannot be earlier than start date.")
        return self
