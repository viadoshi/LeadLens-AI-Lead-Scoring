"""Validation tests for LeadLens prediction API."""
import pytest


def test_validation_missing_required_field(client, valid_lead_payload):
    """Confirm omitting a required field triggers HTTP 422 with clear error message."""
    invalid_payload = valid_lead_payload.copy()
    del invalid_payload["industry"]

    response = client.post("/api/predict", json=invalid_payload)
    assert response.status_code == 422, f"Expected 422, got {response.status_code}"

    errors = response.json().get("detail", [])
    assert any("industry" in str(err) for err in errors)


def test_validation_negative_numeric_value(client, valid_lead_payload):
    """Confirm negative numeric values for engagement signals trigger HTTP 422."""
    # Test negative website_visits
    payload_1 = valid_lead_payload.copy()
    payload_1["website_visits"] = -3
    res_1 = client.post("/api/predict", json=payload_1)
    assert res_1.status_code == 422

    # Test negative days_since_last_activity
    payload_2 = valid_lead_payload.copy()
    payload_2["days_since_last_activity"] = -1
    res_2 = client.post("/api/predict", json=payload_2)
    assert res_2.status_code == 422


def test_validation_invalid_categorical_value(client, valid_lead_payload):
    """Confirm unrecognized categorical values trigger HTTP 422."""
    # Invalid industry
    payload_1 = valid_lead_payload.copy()
    payload_1["industry"] = "Blockchain & Web3"
    res_1 = client.post("/api/predict", json=payload_1)
    assert res_1.status_code == 422

    # Invalid boolean-like choice
    payload_2 = valid_lead_payload.copy()
    payload_2["demo_requested"] = "Tentative"
    res_2 = client.post("/api/predict", json=payload_2)
    assert res_2.status_code == 422

    # Invalid company size
    payload_3 = valid_lead_payload.copy()
    payload_3["company_size"] = "100000+"
    res_3 = client.post("/api/predict", json=payload_3)
    assert res_3.status_code == 422


def test_validation_malformed_input(client):
    """Confirm completely malformed input types trigger HTTP 422."""
    # Empty payload
    res_empty = client.post("/api/predict", json={})
    assert res_empty.status_code == 422

    # Wrong data types
    res_type = client.post("/api/predict", json={"website_visits": "not_a_number"})
    assert res_type.status_code == 422
