"""Tests for GET /api/health endpoint."""


def test_health_endpoint_success(client):
    """Confirm /api/health returns HTTP 200 with model_loaded = true."""
    response = client.get("/api/health")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    
    data = response.json()
    assert data["status"] == "ok"
    assert data["model_loaded"] is True
    # Ensure no internal filesystem paths are exposed
    assert "path" not in data
    assert "directory" not in data
