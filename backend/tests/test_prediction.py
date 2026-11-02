"""Tests for POST /api/predict endpoint."""


def test_predict_valid_lead(client, valid_lead_payload):
    """Test valid lead prediction returns 200 and complete schema."""
    response = client.post("/api/predict", json=valid_lead_payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

    data = response.json()

    # 1. Structural assertions
    assert "score" in data
    assert "probability" in data
    assert "probability_percent" in data
    assert "segment" in data
    assert "recommended_action" in data
    assert "interpretation" in data
    assert "signals" in data
    assert "model" in data

    # 2. Probability and score range constraints
    score = data["score"]
    prob = data["probability"]
    prob_pct = data["probability_percent"]

    assert isinstance(score, int)
    assert 0 <= score <= 100
    assert isinstance(prob, float)
    assert 0.0 <= prob <= 1.0
    assert 0.0 <= prob_pct <= 100.0

    # 3. Segment thresholds alignment
    segment = data["segment"]
    assert segment in ["HOT", "WARM", "NURTURE", "COLD"]

    if score >= 80:
        assert segment == "HOT"
        assert data["recommended_action"] == "Contact immediately"
        assert "immediate sales outreach" in data["interpretation"]
    elif score >= 60:
        assert segment == "WARM"
        assert data["recommended_action"] == "Follow up within 24h"
    elif score >= 40:
        assert segment == "NURTURE"
        assert data["recommended_action"] == "Add to nurture"
    else:
        assert segment == "COLD"
        assert data["recommended_action"] == "Low-priority follow-up"

    # 4. Input signals verification
    signals = data["signals"]
    assert isinstance(signals, list)
    assert len(signals) > 0
    assert "Demo intent detected" in signals
    assert "Pricing intent detected" in signals
    assert "Budget identified" in signals

    # 5. Model metadata verification
    assert data["model"]["name"] == "Logistic Regression"
    assert data["model"]["version"] == "lead-scoring-v1"


def test_predict_cold_lead(client, cold_lead_payload):
    """Test low-engagement lead produces COLD/NURTURE score with low engagement signals."""
    response = client.post("/api/predict", json=cold_lead_payload)
    assert response.status_code == 200

    data = response.json()
    assert data["score"] < 60
    assert data["segment"] in ["NURTURE", "COLD"]
    assert "Low engagement" in data["signals"]


def test_predict_determinism_consistency(client, valid_lead_payload):
    """Confirm multiple requests with the same input yield identical deterministic output."""
    response_1 = client.post("/api/predict", json=valid_lead_payload)
    response_2 = client.post("/api/predict", json=valid_lead_payload)

    assert response_1.status_code == 200
    assert response_2.status_code == 200

    assert response_1.json() == response_2.json()


def test_predict_frontend_camelcase_alias_compatibility(client):
    """Test frontend camelCase keys (source, companySize, etc.) work interchangeably."""
    camel_payload = {
        "industry": "Software",
        "companySize": "51-200",
        "jobRole": "Director",
        "source": "LinkedIn",
        "campaign": "Q4 Enterprise Inbound",
        "budgetIdentified": "Yes",
        "websiteVisits": 5,
        "pagesViewed": 12,
        "emailOpens": 4,
        "emailClicks": 2,
        "demoRequested": "Yes",
        "pricingPageViewed": "Yes",
        "contentDownloaded": "Yes",
        "webinarAttended": "No",
        "daysSinceLastActivity": 3,
        "salesContacted": "No",
    }
    response = client.post("/api/predict", json=camel_payload)
    assert response.status_code == 200

    data = response.json()
    assert data["score"] >= 80
    assert data["segment"] == "HOT"
