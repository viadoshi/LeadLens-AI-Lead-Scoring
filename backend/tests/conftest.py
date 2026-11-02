"""
Shared test fixtures and setup for LeadLens API test suite.
"""
import pytest
from fastapi.testclient import TestClient

from backend.main import app


@pytest.fixture(scope="session")
def client():
    """Session-scoped test client running within FastAPI lifespan."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def valid_lead_payload():
    """Representative valid lead matching Phase 3.1 & Phase 3.2 schema."""
    return {
        "industry": "Software",
        "company_size": "51-200",
        "job_role": "Director",
        "lead_source": "LinkedIn",
        "campaign": "Q4 Enterprise Inbound",
        "budget_identified": "Yes",
        "website_visits": 5,
        "pages_viewed": 12,
        "email_opens": 4,
        "email_clicks": 2,
        "demo_requested": "Yes",
        "pricing_page_viewed": "Yes",
        "content_downloaded": "Yes",
        "webinar_attended": "No",
        "days_since_last_activity": 3,
        "sales_contacted": "No",
    }


@pytest.fixture
def cold_lead_payload():
    """Representative low-engagement lead expected to land in COLD/NURTURE."""
    return {
        "industry": "Education",
        "company_size": "1-10",
        "job_role": "Individual Contributor",
        "lead_source": "Email",
        "campaign": "Cloud Scale Outreach",
        "budget_identified": "No",
        "website_visits": 0,
        "pages_viewed": 1,
        "email_opens": 0,
        "email_clicks": 0,
        "demo_requested": "No",
        "pricing_page_viewed": "No",
        "content_downloaded": "No",
        "webinar_attended": "No",
        "days_since_last_activity": 45,
        "sales_contacted": "No",
    }
