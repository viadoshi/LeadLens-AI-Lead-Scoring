"""Tests for model governance and intelligence endpoints."""


def test_model_info_endpoint_success(client):
    """Confirm /api/model-info returns 200 and safe metadata."""
    response = client.get("/api/model-info")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

    data = response.json()
    assert "model_name" in data
    assert "model_version" in data
    assert "cv_roc_auc_mean" in data
    assert "test_roc_auc" in data
    assert "feature_count" in data
    assert "feature_names" in data
    assert "target_name" in data
    assert "cv_folds" in data
    assert "primary_metric" in data

    # Check winning model identity matches Phase 3.2 metadata
    assert data["model_name"] == "Logistic Regression"
    assert data["model_version"] == "lead-scoring-v1"
    assert data["feature_count"] == 16
    assert isinstance(data["feature_names"], list)
    assert len(data["feature_names"]) == 16
    assert data["target_name"] == "converted"
    assert data["cv_folds"] == 5
    assert data["primary_metric"] == "ROC-AUC"

    # Verify no filesystem paths are leaked
    raw_text = response.text.lower()
    assert "d:\\" not in raw_text
    assert "d:/" not in raw_text
    assert "users\\" not in raw_text
    assert ".joblib" not in raw_text


def test_model_tournament_endpoint_success(client):
    """Confirm /api/model-tournament returns 200, sorted candidate models with valid metrics."""
    response = client.get("/api/model-tournament")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 9

    # Verify expected candidate models exist
    models_evaluated = [item["model"] for item in data]
    assert "Logistic Regression" in models_evaluated
    assert "XGBoost" in models_evaluated
    assert "Random Forest" in models_evaluated

    # Verify sorting by cv_roc_auc_mean descending
    cv_means = [item["cv_roc_auc_mean"] for item in data]
    assert cv_means == sorted(cv_means, reverse=True)

    # First model should be the winner: Logistic Regression
    assert data[0]["model"] == "Logistic Regression"
    assert data[0]["cv_roc_auc_mean"] >= 0.82

    # Check schema fields on each item
    for item in data:
        assert "model" in item
        assert "accuracy" in item
        assert "precision" in item
        assert "recall" in item
        assert "f1" in item
        assert "roc_auc" in item
        assert "cv_roc_auc_mean" in item
        assert "cv_roc_auc_std" in item
        assert "training_time" in item


def test_model_features_endpoint_success(client):
    """Confirm /api/model-features returns 200 with sorted predictive feature importances."""
    response = client.get("/api/model-features")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 10

    # Verify sorting by importance descending
    importances = [item["importance"] for item in data]
    assert importances == sorted(importances, reverse=True)

    # Check top feature
    assert "feature" in data[0]
    assert "importance" in data[0]
    assert data[0]["importance"] > 0


def test_model_artifacts_endpoints_success(client):
    """Confirm /api/model-artifacts returns 200 and image/png streams for confusion matrix and calibration curve."""
    # 1. Confusion Matrix
    res_cm = client.get("/api/model-artifacts/confusion-matrix")
    assert res_cm.status_code == 200, f"Expected 200, got {res_cm.status_code}"
    assert "image/png" in res_cm.headers.get("content-type", "")
    assert len(res_cm.content) > 1000

    # 2. Calibration Curve
    res_cc = client.get("/api/model-artifacts/calibration-curve")
    assert res_cc.status_code == 200, f"Expected 200, got {res_cc.status_code}"
    assert "image/png" in res_cc.headers.get("content-type", "")
    assert len(res_cc.content) > 1000
