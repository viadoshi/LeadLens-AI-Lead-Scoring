"""
Pydantic schemas for the LeadLens prediction endpoint.
Validates input features with strict type constraints, non-negative checks,
and approved categorical enumeration sets.
"""
from typing import List, Literal
from pydantic import AliasChoices, BaseModel, ConfigDict, Field

# Approved Categorical Literals matching backend/ml/config.py
IndustryType = Literal[
    "Software",
    "Fintech",
    "Healthcare",
    "E-commerce",
    "Logistics",
    "Manufacturing",
    "Education",
    "Professional Services",
]

CompanySizeType = Literal[
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001+",
]

JobRoleType = Literal[
    "Founder / CEO",
    "Executive",
    "Director",
    "Manager",
    "Team Lead",
    "Individual Contributor",
    "Other",
]

LeadSourceType = Literal[
    "LinkedIn",
    "Google Ads",
    "Website",
    "Webinar",
    "Email",
    "Referral",
]

CampaignType = Literal[
    "Q4 Enterprise Inbound",
    "Cloud Scale Outreach",
    "Webinar AI Summit",
    "SaaS Growth SDR",
    "Fintech Targeted Push",
]

BudgetIdentifiedType = Literal["Yes", "No", "Unknown"]
BinaryChoiceType = Literal["Yes", "No"]


class LeadPredictionRequest(BaseModel):
    """
    Input schema for raw lead attributes.
    Supports standard snake_case and frontend camelCase field aliases.
    Strictly validates types, ranges, and categorical options.
    """
    model_config = ConfigDict(populate_by_name=True)

    industry: IndustryType = Field(
        ...,
        description="Target company industry sector",
        examples=["Software"],
    )
    company_size: CompanySizeType = Field(
        ...,
        validation_alias=AliasChoices("company_size", "companySize"),
        description="Employee count range of the prospect's company",
        examples=["51-200"],
    )
    job_role: JobRoleType = Field(
        ...,
        validation_alias=AliasChoices("job_role", "jobRole"),
        description="Lead's professional title / organizational level",
        examples=["Director"],
    )
    lead_source: LeadSourceType = Field(
        ...,
        validation_alias=AliasChoices("lead_source", "leadSource", "source"),
        description="Acquisition channel through which the lead entered the pipeline",
        examples=["LinkedIn"],
    )
    campaign: CampaignType = Field(
        ...,
        description="Marketing campaign name associated with the lead",
        examples=["Q4 Enterprise Inbound"],
    )
    budget_identified: BudgetIdentifiedType = Field(
        ...,
        validation_alias=AliasChoices("budget_identified", "budgetIdentified"),
        description="Whether budget allocation has been confirmed",
        examples=["Yes"],
    )
    website_visits: int = Field(
        ...,
        ge=0,
        validation_alias=AliasChoices("website_visits", "websiteVisits"),
        description="Total visits to company web properties (non-negative integer)",
        examples=[5],
    )
    pages_viewed: int = Field(
        ...,
        ge=0,
        validation_alias=AliasChoices("pages_viewed", "pagesViewed"),
        description="Total content and solution pages browsed (non-negative integer)",
        examples=[12],
    )
    email_opens: int = Field(
        ...,
        ge=0,
        validation_alias=AliasChoices("email_opens", "emailOpens"),
        description="Count of outreach/nurture emails opened (non-negative integer)",
        examples=[4],
    )
    email_clicks: int = Field(
        ...,
        ge=0,
        validation_alias=AliasChoices("email_clicks", "emailClicks"),
        description="Count of email link clicks (non-negative integer)",
        examples=[2],
    )
    demo_requested: BinaryChoiceType = Field(
        ...,
        validation_alias=AliasChoices("demo_requested", "demoRequested"),
        description="Whether the prospect formally requested a live product demo",
        examples=["Yes"],
    )
    pricing_page_viewed: BinaryChoiceType = Field(
        ...,
        validation_alias=AliasChoices("pricing_page_viewed", "pricingPageViewed"),
        description="Whether the prospect visited the pricing or plans page",
        examples=["Yes"],
    )
    content_downloaded: BinaryChoiceType = Field(
        default="No",
        validation_alias=AliasChoices("content_downloaded", "contentDownloaded"),
        description="Whether gated content (e.g., whitepapers, case studies) was downloaded",
        examples=["No"],
    )
    webinar_attended: BinaryChoiceType = Field(
        default="No",
        validation_alias=AliasChoices("webinar_attended", "webinarAttended"),
        description="Whether the lead attended a live webinar or digital summit",
        examples=["No"],
    )
    days_since_last_activity: int = Field(
        default=0,
        ge=0,
        validation_alias=AliasChoices("days_since_last_activity", "daysSinceLastActivity"),
        description="Days elapsed since the prospect's most recent interaction (non-negative)",
        examples=[3],
    )
    sales_contacted: BinaryChoiceType = Field(
        default="No",
        validation_alias=AliasChoices("sales_contacted", "salesContacted"),
        description="Whether sales development has already established prior outreach",
        examples=["No"],
    )

    def to_model_dict(self) -> dict:
        """Exports attributes strictly in snake_case format matching ML feature names."""
        return {
            "industry": self.industry,
            "company_size": self.company_size,
            "job_role": self.job_role,
            "lead_source": self.lead_source,
            "campaign": self.campaign,
            "budget_identified": self.budget_identified,
            "website_visits": self.website_visits,
            "pages_viewed": self.pages_viewed,
            "email_opens": self.email_opens,
            "email_clicks": self.email_clicks,
            "demo_requested": self.demo_requested,
            "pricing_page_viewed": self.pricing_page_viewed,
            "content_downloaded": self.content_downloaded,
            "webinar_attended": self.webinar_attended,
            "days_since_last_activity": self.days_since_last_activity,
            "sales_contacted": self.sales_contacted,
        }


class ModelInfoSummary(BaseModel):
    """Compact model information descriptor embedded in prediction responses."""
    name: str = Field(..., description="Trained classification model name", examples=["Logistic Regression"])
    version: str = Field(..., description="Model version tag", examples=["lead-scoring-v1"])


class LeadPredictionResponse(BaseModel):
    """Complete prediction response returned by POST /api/predict."""
    score: int = Field(..., description="Display lead score between 0 and 100", examples=[87])
    probability: float = Field(..., description="Conversion probability between 0.0 and 1.0", examples=[0.874])
    probability_percent: float = Field(..., description="Conversion probability percentage", examples=[87.4])
    segment: str = Field(..., description="LeadLens tier: HOT, WARM, NURTURE, or COLD", examples=["HOT"])
    recommended_action: str = Field(..., description="Prescribed next sales action", examples=["Contact immediately"])
    interpretation: str = Field(..., description="Conversion analysis summary for sales outreach")
    signals: List[str] = Field(..., description="Explanatory input signals derived from entered lead attributes")
    model: ModelInfoSummary = Field(..., description="Winning model metadata")
