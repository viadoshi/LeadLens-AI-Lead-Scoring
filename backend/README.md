# LeadLens — Backend Service

The LeadLens backend is a production-style, asynchronous Python service built on **FastAPI** that delivers real-time machine learning lead scoring, campaign intelligence, and revenue analytics for **Glitchreach**.

---

## Architecture Overview

```text
backend/
├── api/
│   ├── routes/              # Modular route controllers
│   │   ├── analytics.py     # GET /api/analytics/overview (time-window rollups)
│   │   ├── campaigns.py     # Campaign CRUD & attribution (Phase 3.7)
│   │   ├── health.py        # GET /api/health (service & model availability)
│   │   ├── model_info.py    # Model metadata, tournament results, diagnostic plots
│   │   └── prediction.py    # POST /api/predict (live ML inference & intent signals)
│   └── schemas/             # Pydantic v2 data models for request/response validation
├── core/
│   └── config.py            # Central file paths, CORS rules, and server constants
├── data/
│   ├── demo_analytics_dataset.json  # Multi-touch simulation data for analytics
│   ├── demo_campaigns.json          # Persistent marketing campaign records
│   └── lead_scoring_dataset.csv     # 8,000 synthetic B2B training leads (seed 42)
├── ml/
│   ├── data_generator.py    # Reproducible synthetic dataset generation engine
│   ├── preprocessing.py     # Scikit-learn ColumnTransformer pipeline builder
│   └── train_models.py      # 9-model tournament training and benchmark script
├── models/
│   ├── best_lead_scoring_model.joblib # Serialized winning Logistic Regression pipeline
│   ├── calibration_curve.png         # Diagnostic probability calibration curve
│   ├── confusion_matrix.png          # Diagnostic test confusion matrix
│   ├── feature_importance.csv        # Ranked feature weights
│   ├── model_metadata.json           # Model specification, metrics, and parameters
│   └── model_tournament_results.csv  # 9-algorithm benchmark leaderboard
├── services/
│   ├── analytics_service.py # KPI aggregations, conversion trends, segment yields
│   ├── campaign_service.py  # Campaign lifecycle management and attribution
│   ├── model_service.py     # Singleton pipeline inference manager
│   └── scoring_rules.py     # Calibrated score scaling, tier bounds, intent signals
├── tests/                   # 33 unit and integration tests (Pytest)
└── main.py                  # FastAPI lifespan manager, CORS middleware, entrypoint
```

---

## Machine Learning & Inference Pipeline

- **Production Model**: `Logistic Regression` (`model_version: lead-scoring-v1`) trained via a 9-model benchmark tournament.
- **Preprocessing**: `ColumnTransformer` applying median imputation + `StandardScaler` to 5 numerical features and most-frequent imputation + `OneHotEncoder` to 11 categorical features (producing 50 encoded features).
- **Evaluation Benchmarks**:
  - **Test ROC-AUC**: `0.8235`
  - **5-Fold CV ROC-AUC**: `0.8227 ± 0.0051`
  - **Accuracy**: `78.75%`
  - **Precision**: `69.88%`
  - **Recall**: `49.15%`
  - **F1 Score**: `0.5771`
  - **Brier Score**: `0.1475`
- **Inference Lifecycle**: The serialized pipeline (`backend/models/best_lead_scoring_model.joblib`) is loaded into memory once at application startup via FastAPI's `lifespan` context manager, ensuring thread-safe, sub-10ms predictions.

---

## Installation & Setup

From the **project root directory**:

```powershell
# 1. Create and activate a Python virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install dependencies using root requirements.txt
pip install -r requirements.txt
```

---

## Running the Backend Server

From the **project root directory**:

```powershell
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

- **API Base URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **Alternative ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

---

## Testing

Execute the automated test suite from the **project root directory**:

```powershell
python -m pytest backend/tests -v
```

All 33 unit and integration tests validate health, model governance, predictions, input validation, analytics aggregations, campaign CRUD, and cross-service mathematical consistency.
