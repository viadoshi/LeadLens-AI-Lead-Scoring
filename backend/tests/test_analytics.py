"""
Unit and integration tests for LeadLens Analytics Dashboard endpoints (Phase 3.6).
"""
import pytest


def test_analytics_overview_default_range(client):
    """Test GET /api/analytics/overview returns 200 with default 30d range."""
    response = client.get("/api/analytics/overview")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

    data = response.json()
    assert data["range"] == "30d"
    assert data["range_label"] == "Last 30 Days"
    assert "summary" in data
    assert "conversion_trend" in data
    assert "source_performance" in data
    assert "segment_performance" in data
    assert "campaign_performance" in data
    assert "score_distribution" in data
    assert "insights" in data


@pytest.mark.parametrize("range_param,expected_label", [
    ("7d", "Last 7 Days"),
    ("30d", "Last 30 Days"),
    ("90d", "Last 90 Days"),
    ("all", "All Time"),
])
def test_analytics_overview_valid_ranges(client, range_param, expected_label):
    """Test that all supported range parameters return 200 and appropriate labels."""
    response = client.get(f"/api/analytics/overview?range={range_param}")
    assert response.status_code == 200
    data = response.json()
    assert data["range"] == range_param
    assert data["range_label"] == expected_label
    assert data["summary"]["total_leads"] > 0
    assert data["summary"]["conversion_rate"] >= 0.0


def test_analytics_overview_invalid_range_returns_400(client):
    """Test that invalid range parameters return HTTP 400 with clean error detail."""
    response = client.get("/api/analytics/overview?range=14d")
    assert response.status_code == 400
    data = response.json()
    assert "detail" in data
    assert "Invalid range parameter" in data["detail"]
    assert "7d" in data["detail"]


def test_analytics_data_consistency(client):
    """
    Test mathematical consistency across the analytics response:
    - conversion_rate = round(converted / total * 100, 2)
    - sum(score_distribution counts) == total_leads
    - sum(source total_leads) == total_leads
    - sum(segment total_leads) == total_leads
    - sum(campaign total_leads) == total_leads
    """
    response = client.get("/api/analytics/overview?range=30d")
    assert response.status_code == 200
    data = response.json()

    summary = data["summary"]
    tot = summary["total_leads"]
    conv = summary["converted_leads"]
    rate = summary["conversion_rate"]

    assert tot > 0
    assert conv <= tot
    calculated_rate = round(conv / tot * 100, 2)
    assert abs(rate - calculated_rate) < 0.01

    # Check score distribution total
    score_dist = data["score_distribution"]
    assert len(score_dist) == 5
    dist_sum = sum(b["count"] for b in score_dist)
    assert dist_sum == tot, f"Score distribution sum {dist_sum} != total leads {tot}"

    # Check source performance consistency
    sources = data["source_performance"]
    assert len(sources) > 0
    src_tot_sum = sum(s["total_leads"] for s in sources)
    src_conv_sum = sum(s["converted_leads"] for s in sources)
    assert src_tot_sum == tot
    assert src_conv_sum == conv
    for s in sources:
        expected_src_rate = round(s["converted_leads"] / s["total_leads"] * 100, 2)
        assert abs(s["conversion_rate"] - expected_src_rate) < 0.01

    # Check segment performance consistency
    segments = data["segment_performance"]
    assert len(segments) == 4
    seg_names = [s["segment"] for s in segments]
    assert seg_names == ["HOT", "WARM", "NURTURE", "COLD"]
    seg_tot_sum = sum(s["total_leads"] for s in segments)
    seg_conv_sum = sum(s["converted_leads"] for s in segments)
    assert seg_tot_sum == tot
    assert seg_conv_sum == conv

    # Check campaign performance consistency
    campaigns = data["campaign_performance"]
    assert len(campaigns) > 0
    cmp_tot_sum = sum(c["total_leads"] for c in campaigns)
    cmp_conv_sum = sum(c["converted_leads"] for c in campaigns)
    assert cmp_tot_sum == tot
    assert cmp_conv_sum == conv


def test_analytics_insights_structure(client):
    """Test that generated LeadLens insights are non-empty, factual, and correctly structured."""
    response = client.get("/api/analytics/overview?range=30d")
    assert response.status_code == 200
    data = response.json()

    insights = data["insights"]
    assert isinstance(insights, list)
    assert len(insights) >= 4

    for item in insights:
        assert "id" in item
        assert "type" in item
        assert "title" in item
        assert "description" in item
        assert len(item["description"]) > 10
