"""
Unit and integration tests for LeadLens Campaign Intelligence API (Phase 3.7).
"""
import pytest
from pathlib import Path
from backend.core.config import CAMPAIGNS_DATASET_PATH


@pytest.fixture(autouse=True)
def preserve_campaigns_file():
    """Ensure demo_campaigns.json is preserved and restored after each test run."""
    original_bytes = CAMPAIGNS_DATASET_PATH.read_bytes()
    try:
        yield
    finally:
        CAMPAIGNS_DATASET_PATH.write_bytes(original_bytes)


def test_list_campaigns_success(client):
    """Confirm GET /api/campaigns returns 200 with summary cards and campaign list."""
    response = client.get("/api/campaigns")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

    data = response.json()
    assert "summary" in data
    assert "campaigns" in data

    summary = data["summary"]
    assert summary["total_campaigns"] >= 6
    assert summary["active_campaigns"] >= 4
    assert summary["total_campaign_leads"] > 0
    assert summary["average_campaign_conversion_rate"] > 0

    campaigns = data["campaigns"]
    assert len(campaigns) >= 6
    # Verify performance fields are calculated
    first = campaigns[0]
    assert "id" in first
    assert "name" in first
    assert "status" in first
    assert "channel" in first
    assert "campaign_type" in first
    assert "budget" in first
    assert "total_leads" in first
    assert "converted_leads" in first
    assert "conversion_rate" in first
    assert "average_score" in first


def test_filter_campaigns_by_status(client):
    """Confirm filtering by status=Active returns only active campaigns."""
    response = client.get("/api/campaigns?status=Active")
    assert response.status_code == 200
    data = response.json()
    campaigns = data["campaigns"]
    assert len(campaigns) > 0
    for c in campaigns:
        assert c["status"].lower() == "active"


def test_filter_campaigns_by_channel(client):
    """Confirm filtering by channel=LinkedIn returns only LinkedIn campaigns."""
    response = client.get("/api/campaigns?channel=LinkedIn")
    assert response.status_code == 200
    data = response.json()
    campaigns = data["campaigns"]
    assert len(campaigns) > 0
    for c in campaigns:
        assert c["channel"].lower() == "linkedin"


def test_search_campaigns(client):
    """Confirm search query matches campaign name or description case-insensitively."""
    response = client.get("/api/campaigns?search=enterprise")
    assert response.status_code == 200
    data = response.json()
    campaigns = data["campaigns"]
    assert len(campaigns) >= 1
    for c in campaigns:
        assert "enterprise" in c["name"].lower() or "enterprise" in c["description"].lower()


def test_get_campaign_detail_success(client):
    """Confirm GET /api/campaigns/{id} returns comprehensive intelligence."""
    response = client.get("/api/campaigns/q4-enterprise")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

    data = response.json()
    assert data["id"] == "q4-enterprise"
    assert data["name"] == "Q4 Enterprise Inbound"
    assert data["total_leads"] > 0
    assert data["converted_leads"] <= data["total_leads"]
    assert data["conversion_rate"] > 0
    assert data["average_score"] > 0

    # Verify nested intelligence sections
    assert "source_performance" in data
    assert "segment_performance" in data
    assert "score_distribution" in data
    assert "conversion_trend" in data
    assert "top_leads" in data
    assert "insights" in data

    assert len(data["source_performance"]) > 0
    assert len(data["segment_performance"]) == 4
    assert len(data["score_distribution"]) == 5
    assert len(data["top_leads"]) > 0
    assert len(data["insights"]) > 0


def test_get_campaign_not_found_returns_404(client):
    """Confirm non-existent campaign returns 404 with clean message."""
    response = client.get("/api/campaigns/non-existent-campaign-12345")
    assert response.status_code == 404
    data = response.json()
    assert "detail" in data
    assert "not found" in data["detail"].lower()


def test_create_campaign_success(client):
    """Confirm POST /api/campaigns creates new campaign with 0 initial leads."""
    payload = {
        "name": "Test Growth Sprint 2027",
        "description": "Experimental growth sprint test campaign",
        "channel": "LinkedIn",
        "campaign_type": "Outbound",
        "status": "Active",
        "start_date": "2027-02-01",
        "end_date": "2027-03-01",
        "budget": 5000.0,
        "owner": "Test Marketer"
    }
    response = client.post("/api/campaigns", json=payload)
    assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"

    data = response.json()
    assert data["name"] == payload["name"]
    assert data["channel"] == payload["channel"]
    assert data["budget"] == 5000.0
    assert data["total_leads"] == 0
    assert data["converted_leads"] == 0
    assert data["conversion_rate"] == 0.0


def test_create_campaign_validation_errors(client):
    """Confirm validation fails for negative budget or end date earlier than start date."""
    # Negative budget
    res1 = client.post("/api/campaigns", json={
        "name": "Invalid Budget Campaign",
        "channel": "LinkedIn",
        "campaign_type": "Inbound",
        "start_date": "2026-11-01",
        "budget": -500.0
    })
    assert res1.status_code in (400, 422)

    # End date before start date
    res2 = client.post("/api/campaigns", json={
        "name": "Invalid Dates Campaign",
        "channel": "LinkedIn",
        "campaign_type": "Inbound",
        "start_date": "2026-11-01",
        "end_date": "2026-10-01",
        "budget": 1000.0
    })
    assert res2.status_code in (400, 422)


def test_update_campaign_success(client):
    """Confirm PATCH /api/campaigns/{id} modifies campaign fields."""
    response = client.patch(
        "/api/campaigns/saas-growth-sdr",
        json={"budget": 24500.0, "description": "Updated sequence description."}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["budget"] == 24500.0
    assert data["description"] == "Updated sequence description."


def test_archive_campaign_success(client):
    """Confirm POST /api/campaigns/{id}/archive sets status to Archived."""
    response = client.post("/api/campaigns/webinar-ai/archive")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Archived"


def test_campaign_data_consistency(client):
    """Confirm mathematical consistency between leads, conversion rates, and segments."""
    response = client.get("/api/campaigns/executive-intent")
    assert response.status_code == 200
    data = response.json()

    tot = data["total_leads"]
    conv = data["converted_leads"]
    rate = data["conversion_rate"]

    assert tot > 0
    expected_rate = round((conv / tot * 100), 2)
    assert abs(rate - expected_rate) < 0.01

    # Check segment totals reconcile
    seg_sum = sum(s["total_leads"] for s in data["segment_performance"])
    assert seg_sum == tot, f"Segment sum {seg_sum} != total leads {tot}"

    # Check score distribution reconciles
    dist_sum = sum(b["count"] for b in data["score_distribution"])
    assert dist_sum == tot, f"Distribution sum {dist_sum} != total leads {tot}"


def test_cross_service_analytics_campaign_consistency(client):
    """
    Confirm mathematical consistency between /api/analytics/overview?range=all
    and /api/campaigns/{campaign_id} for all overlapping campaigns.
    """
    analytics_res = client.get("/api/analytics/overview?range=all")
    assert analytics_res.status_code == 200
    analytics_campaigns = {
        c["campaign"]: c for c in analytics_res.json()["campaign_performance"]
    }

    campaigns_res = client.get("/api/campaigns")
    assert campaigns_res.status_code == 200
    campaign_list = campaigns_res.json()["campaigns"]

    verified_count = 0
    for camp in campaign_list:
        camp_name = camp["name"]
        if camp_name in analytics_campaigns:
            a_data = analytics_campaigns[camp_name]
            # 1. Verify list-level matching
            assert camp["total_leads"] == a_data["total_leads"], f"Mismatch in total leads for {camp_name}"
            assert camp["converted_leads"] == a_data["converted_leads"], f"Mismatch in converted leads for {camp_name}"
            assert camp["conversion_rate"] == a_data["conversion_rate"], f"Mismatch in conversion rate for {camp_name}"
            assert camp["average_score"] == a_data["average_score"], f"Mismatch in average score for {camp_name}"

            # 2. Verify detail-level matching
            detail_res = client.get(f"/api/campaigns/{camp['id']}")
            assert detail_res.status_code == 200
            d_data = detail_res.json()
            assert d_data["total_leads"] == a_data["total_leads"], f"Detail mismatch in total leads for {camp_name}"
            assert d_data["converted_leads"] == a_data["converted_leads"], f"Detail mismatch in converted leads for {camp_name}"
            assert d_data["conversion_rate"] == a_data["conversion_rate"], f"Detail mismatch in conversion rate for {camp_name}"
            assert d_data["average_score"] == a_data["average_score"], f"Detail mismatch in average score for {camp_name}"

            verified_count += 1

    assert verified_count >= 5, f"Expected at least 5 verified campaigns, got {verified_count}"

