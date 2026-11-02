"""
Application configuration for LeadLens backend API.
Centralizes environment settings, CORS configurations, and artifact paths.
"""
import os
from pathlib import Path
from typing import List

# Base filesystem directories
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "best_lead_scoring_model.joblib"
METADATA_PATH = MODELS_DIR / "model_metadata.json"
TOURNAMENT_RESULTS_PATH = MODELS_DIR / "model_tournament_results.csv"
FEATURE_IMPORTANCE_PATH = MODELS_DIR / "feature_importance.csv"
CONFUSION_MATRIX_PATH = MODELS_DIR / "confusion_matrix.png"
CALIBRATION_CURVE_PATH = MODELS_DIR / "calibration_curve.png"

# Analytics and Campaign Dataset Paths (isolated demo business simulation data)
DATA_DIR = BASE_DIR / "data"
ANALYTICS_DATASET_PATH = DATA_DIR / "demo_analytics_dataset.json"
CAMPAIGNS_DATASET_PATH = DATA_DIR / "demo_campaigns.json"

# API Information
API_TITLE = "LeadLens AI Lead Scoring API"
API_VERSION = "1.0.0"
API_DESCRIPTION = (
    "Production-style ML inference API for LeadLens. "
    "Accepts raw lead information, applies the trained model pipeline, "
    "and returns conversion probabilities, calibrated scores, segmentation tiers, "
    "recommended sales actions, and explanatory input signals."
)

# CORS Configuration
# Restricts to local frontend development servers by default while allowing env-based override for production.
DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

def get_cors_origins() -> List[str]:
    raw_env = os.getenv("CORS_ORIGINS")
    if raw_env:
        return [origin.strip() for origin in raw_env.split(",") if origin.strip()]
    return DEFAULT_ORIGINS

CORS_ORIGINS = get_cors_origins()
