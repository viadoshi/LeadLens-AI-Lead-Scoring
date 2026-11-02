# LeadLens — AI-Powered B2B Lead Intelligence & Scoring Platform

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.6%2B-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Tests](https://img.shields.io/badge/Pytest-33%20Passed-brightgreen?logo=pytest&logoColor=white)](https://pytest.org/)
[![Linter](https://img.shields.io/badge/Oxlint-0%20Warnings-success)](https://oxc.rs/)
[![License](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

> **LeadLens** is an end-to-end, enterprise-grade B2B lead intelligence and conversion scoring SaaS platform built for **Glitchreach**. It pairs a rigorously evaluated machine learning tournament pipeline with a high-performance FastAPI service and an interactive React analytics application. LeadLens empowers revenue operations (RevOps) and sales development representatives (SDRs) to prioritize inbound and outbound opportunities based on statistically calibrated conversion probabilities.

---

## Table of Contents

1. [Executive Summary & Business Objectives](#1-executive-summary--business-objectives)
2. [Key Features & Modules](#2-key-features--modules)
3. [User Interface & Screenshots](#3-user-interface--screenshots)
4. [Technology Stack](#4-technology-stack)
5. [Machine Learning Workflow](#5-machine-learning-workflow)
6. [Model Tournament & Evaluation Benchmark](#6-model-tournament--evaluation-benchmark)
7. [System Architecture](#7-system-architecture)
8. [Project Folder Structure](#8-project-folder-structure)
9. [API Endpoints Reference](#9-api-endpoints-reference)
10. [Prerequisites & System Requirements](#10-prerequisites--system-requirements)
11. [Step-by-Step Windows Installation Guide](#11-step-by-step-windows-installation-guide)
12. [Running the Application Locally](#12-running-the-application-locally)
13. [Test Suite Execution & Verification](#13-test-suite-execution--verification)
14. [Dataset Architecture & Limitations](#14-dataset-architecture--limitations)
15. [Future Roadmap](#15-future-roadmap)
16. [Author & Contact](#16-author--contact)

---

## 1. Executive Summary & Business Objectives

### The Business Problem
In B2B enterprise software sales, account executives and SDRs frequently face high lead volume paired with low conversion efficiency. When prospects are treated uniformly or prioritized purely on superficial metrics (e.g., job titles alone), high-intent opportunities slip through the cracks, response times to critical inbound inquiries lag, and marketing acquisition budgets are wasted on unproductive channels.

### LeadLens Objectives
1. **Predictive Conversion Probability**: Calculate an individual lead's statistical likelihood of converting ($P(\text{converted}=1)$) based on historical behavioral engagement and firmographic attributes.
2. **Standardized Priority Tiers**: Map raw conversion probabilities into a calibrated **0–100 Lead Score** categorized into actionable tiers (`HOT`, `WARM`, `NURTURE`, `COLD`) with standardized sales outreach SLAs.
3. **Transparent Explainability**: Deliver human-interpretable intent signals (e.g., *"Demo intent detected"*, *"Senior decision-maker role"*, *"Recent activity"*) alongside mathematical predictions to give sales reps immediate conversational context.
4. **Campaign Intelligence**: Reconcile marketing expenditure and acquisition channels with pipeline yields, conversion velocities, and score distributions to guide marketing ROI.
5. **Governance & Calibration**: Provide live model tournament inspection, diagnostic plots (ROC-AUC, calibration curve, confusion matrix), and adjustable score cutoff thresholds.

---

## 2. Key Features & Modules

LeadLens comprises seven functional modules implemented across frontend and backend:

### 1. Executive Overview (`/`)
- Headline KPI summary cards (Total Leads, Hot Leads, Predicted Conversions, Overall Conversion Rate).
- Dynamic conversion velocity trend chart with multi-window historical views (7d, 30d, 90d, All-time).
- Acquisition channel performance mix and tier distribution breakdowns.
- Priority leads quick-action queue highlighting high-urgency accounts.

### 2. Lead Management & Exploration (`/leads`)
- Full lead directory with multi-criteria filtering by Priority Tier, Inbound Channel, Campaign attribution, and Score range.
- Debounced case-insensitive full-text search across prospect names, companies, and roles.
- Interactive table with column-level sorting, clean pagination, and responsive quick-action slide-over drawers.

### 3. Individual Lead Profiler (`/leads/:leadId`)
- Detailed lead profile displaying score gauge, conversion probability, and recommended sales outreach SLA.
- Rule-based behavioral intent badges and engagement factor radar.
- Prospect firmographics (Industry, Employee Headcount, Budget Status, Lead Source).
- Complete activity timeline tracking touchpoints (Website visits, Email opens/clicks, Downloads, Demo requests).

### 4. Real-Time AI Lead Scoring Engine (`/predict`)
- Interactive lead evaluation form allowing SDRs to enter firmographics and behavioral metrics.
- Submits payloads to `POST /api/predict` for sub-10ms model inference.
- Displays calculated score, probability percentage, segment badge, explanatory signals, and next-step recommendation.
- Maintains a temporary browser session history table for rapid comparative evaluations.

### 5. Model Intelligence & Governance (`/models`)
- Production Champion model card detailing architecture, version tag, training timestamp, and sample sizes.
- Full 9-algorithm Model Tournament leaderboard sorted by 5-fold cross-validation ROC-AUC.
- Bar charts comparing candidate algorithm ROC-AUC scores.
- Ranked feature importance attribution list.
- Embedded diagnostic plots: **Probability Calibration Curve** and **Classification Confusion Matrix**.

### 6. Advanced Business Analytics (`/analytics`)
- Aggregated intelligence connected to `GET /api/analytics/overview`.
- Filterable time windows (`7d`, `30d`, `90d`, `all`) computing period-over-period delta metrics.
- Recharts visualizations: conversion velocity trends, channel conversion rates, and tier yield bars.
- 5-bucket score distribution histogram and automated deterministic business insights.

### 7. Campaign Intelligence (`/campaigns`, `/campaigns/:campaignId`)
- Complete campaign lifecycle management (Phase 3.7): listing, filtering, search, modal creation, and archiving.
- Deep attribution analytics per campaign: lead yield, converted leads count, conversion rate, and average score.
- Detailed campaign view with acquisition source mix, score distribution, and top 5 captured leads linking directly to lead records.

### 8. Enterprise Settings & Governance (`/settings`)
- **Scoring & Tiers**: Configurable sliders for HOT, WARM, and NURTURE score thresholds with live tier preview cards and business qualification rule toggles.
- **AI Model Governance**: Active production model selection, classification floor sensitivity, and retraining cadence.
- **CRM & Webhooks**: Salesforce and HubSpot connector status cards, outbound webhook endpoint management, and test ping simulation.
- **Alerts & Routing**: High-priority HOT lead notifications, Slack channel broadcast integration, and SDR round-robin team distribution.
- **Organization Profile**: Workspace currency, multi-touch attribution models (W-Shaped, Linear, First-Touch, Last-Touch), and timezone settings.

---

## 3. User Interface & Screenshots

> *Note: Placeholders are provided below for visual reference. Replace these image paths with your actual captured screenshots as needed.*

```text
+----------------------------------------------------------------------------------------------------+
|                                    LEADLENS EXECUTIVE OVERVIEW                                     |
|  [ Total Leads: 12,482 ]   [ Hot Leads: 1,284 ]   [ Predicted Conv: 2,147 ]   [ Conv Rate: 17.2% ] |
|                                                                                                    |
|  +---------------------------------------------+  +---------------------------------------------+  |
|  |     30-Day Conversion Velocity Trend        |  |        Lead Acquisition Channel Mix         |  |
|  |     (Recharts Smooth Area/Line Chart)       |  |        (Ranked Conversion Yield Bars)       |  |
|  +---------------------------------------------+  +---------------------------------------------+  |
+----------------------------------------------------------------------------------------------------+
```

### Module Interface Previews

| Interface Module | Route | Visual Status |
| :--- | :--- | :--- |
| **Executive Overview** | `/` | ![Overview Screenshot Placeholder](frontend/public/assets/screenshots/overview_placeholder.png) |
| **Leads Directory & Filter** | `/leads` | ![Leads Screenshot Placeholder](frontend/public/assets/screenshots/leads_placeholder.png) |
| **Real-Time Prediction Engine** | `/predict` | ![Predict Screenshot Placeholder](frontend/public/assets/screenshots/predict_placeholder.png) |
| **Model Tournament Registry** | `/models` | ![Models Screenshot Placeholder](frontend/public/assets/screenshots/models_placeholder.png) |
| **Revenue Analytics Dashboard**| `/analytics` | ![Analytics Screenshot Placeholder](frontend/public/assets/screenshots/analytics_placeholder.png) |
| **Campaign Intelligence** | `/campaigns` | ![Campaigns Screenshot Placeholder](frontend/public/assets/screenshots/campaigns_placeholder.png) |
| **Enterprise Settings** | `/settings` | ![Settings Screenshot Placeholder](frontend/public/assets/screenshots/settings_placeholder.png) |

---

## 4. Technology Stack

### Backend Services & Machine Learning
- **Python**: Version 3.10+ (tested on Python 3.13)
- **FastAPI**: Modern, asynchronous, high-performance web framework for building APIs with automatic OpenAPI (Swagger) documentation
- **Uvicorn**: Lightning-fast ASGI web server implementation
- **scikit-learn**: Core ML framework powering preprocessing pipelines, ColumnTransformer, and classification models
- **XGBoost**: Gradient boosting library utilized in candidate model tournament evaluation
- **pandas & NumPy**: Vectorized data manipulation, matrix operations, and feature transformations
- **joblib**: High-efficiency serialization for trained pipeline estimators
- **Matplotlib**: Generation of static diagnostic plots (ROC curves, calibration curves, confusion matrices)
- **Pydantic (v2)**: Strict runtime schema validation, data parsing, and serialization
- **Pytest**: Automated testing framework with HTTPX test client

### Frontend Application
- **React 19**: Modern component-based user interface architecture
- **Vite 8**: Next-generation frontend tooling and rapid HMR build engine
- **React Router (v7)**: Client-side routing with nested layouts and dynamic parameters
- **Recharts**: Composable charting library built on SVG elements
- **Lucide React**: Clean, consistent icon set
- **Axios**: Promise-based HTTP client with request/response interceptors
- **Vanilla CSS**: Bespoke enterprise design system with complete CSS variable design tokens supporting seamless Dark and Light themes
- **Oxlint**: High-speed Rust-based linter ensuring clean, warning-free React code

---

## 5. Machine Learning Workflow

The LeadLens machine learning lifecycle is designed with strict boundaries to eliminate data leakage and guarantee reproducible inference:

```
+----------------------------------------------------------------------------------------------------+
|                                    LEADLENS ML LIFECYCLE                                           |
|                                                                                                    |
|  1. Synthetic Dataset Generator                                                                    |
|     (8,000 Records, 16 Features, Realistic Joint Distributions, Zero Target Proxies)               |
|                                         |                                                          |
|                                         v                                                          |
|  2. Stratified 80/20 Train/Test Partitioning                                                       |
|     (X_train: 6,400 leads | X_test: 1,600 leads | Seed: 42)                                        |
|                                         |                                                          |
|                                         v                                                          |
|  3. ColumnTransformer Preprocessing Pipeline                                                       |
|     • 5 Numerical Features: Median Imputation + StandardScaler                                    |
|     • 11 Categorical Features: Most-Frequent Imputation + OneHotEncoder (50 Encoded Dimensions)     |
|     • Strict Isolation: Fitted purely on X_train; transform() only applied to X_test               |
|                                         |                                                          |
|                                         v                                                          |
|  4. Model Tournament Evaluation (9 Algorithms, 5-Fold Stratified Cross-Validation)                 |
|                                         |                                                          |
|                                         v                                                          |
|  5. Serialization of Winning Pipeline                                                              |
|     (Saved to backend/models/best_lead_scoring_model.joblib)                                       |
|                                         |                                                          |
|                                         v                                                          |
|  6. Live FastAPI Production Inference & Tier Calibration                                           |
|     (POST /api/predict -> Calibrated Probability -> 0-100 Score -> Priority Tier Assignment)      |
+----------------------------------------------------------------------------------------------------+
```

### Lead Priority Tiers & Action SLAs

| Priority Tier | Score Cutoff | Probability Range | Sales Outreach SLA | Recommended Action |
| :---: | :---: | :---: | :---: | :--- |
| <span style="color:#EF4444;font-weight:700">HOT</span> | **$80 - 100$** | $\ge 80.0\%$ | **&lt; 1 Hour** | **Immediate phone outreach & executive follow-up** |
| <span style="color:#F59E0B;font-weight:700">WARM</span> | **$60 - 79$** | $60.0\% - 79.9\%$ | **&lt; 24 Hours** | **Qualify requirements & schedule product demo** |
| <span style="color:#3B82F6;font-weight:700">NURTURE</span> | **$40 - 59$** | $40.0\% - 59.9\%$ | **Weekly** | **Enroll in industry-targeted content campaign** |
| <span style="color:#94A3B8;font-weight:700">COLD</span> | **$0 - 39$** | $&lt; 40.0\%$ | **Automated** | **Low-touch educational newsletter drip sequence** |

---

## 6. Model Tournament & Evaluation Benchmark

During the Phase 3.2 model evaluation tournament, nine distinct classification algorithms were trained and benchmarked using identical stratified splits (6,400 training leads, 1,600 held-out test leads, random seed 42) and evaluated via 5-fold cross-validation.

### Verified Tournament Leaderboard

*Source of truth: `backend/models/model_tournament_results.csv` and `backend/models/model_metadata.json`.*

| Rank | Model Architecture | 5-Fold CV ROC-AUC | Test ROC-AUC | Test Accuracy | Test Precision | Test Recall | Test F1 | Training Time | Deployment Status |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 🥇 | **Logistic Regression** | **0.8227 ± 0.0051** | **0.8235** | **78.75%** | **69.88%** | **49.15%** | **0.5771** | **1.73s** | 🏆 **Production Champion** |
| 🥈 | **AdaBoost** | 0.8212 ± 0.0088 | — | 79.17% | 70.58% | 50.53% | 0.5889 | 4.00s | Challenger |
| 🥉 | **Gradient Boosting** | 0.8170 ± 0.0052 | — | 78.58% | 69.97% | 48.10% | 0.5699 | 12.36s | Evaluated |
| 4 | **Support Vector Machine (SVM)** | 0.8014 ± 0.0032 | — | 78.27% | 70.79% | 44.97% | 0.5497 | 146.06s | Evaluated |
| 5 | **Random Forest** | 0.7990 ± 0.0106 | — | 77.52% | 68.06% | 44.97% | 0.5414 | 9.75s | Evaluated |
| 6 | **Naive Bayes** | 0.7956 ± 0.0045 | — | 76.58% | 61.88% | 54.07% | 0.5770 | 0.97s | Evaluated |
| 7 | **XGBoost** | 0.7885 ± 0.0085 | — | 76.94% | 63.98% | 50.16% | 0.5622 | 3.56s | Evaluated |
| 8 | **K-Nearest Neighbors (KNN)** | 0.7193 ± 0.0091 | — | 74.67% | 60.70% | 40.37% | 0.4849 | 1.87s | Evaluated |
| 9 | **Decision Tree** | 0.6282 ± 0.0031 | — | 68.39% | 46.70% | 49.21% | 0.4790 | 2.08s | Baseline |

### Production Model Specification: `lead-scoring-v1`
- **Selected Model Architecture**: `LogisticRegression(max_iter=1000, random_state=42)`
- **Primary Metric Justification**: Logistic Regression achieved the highest mean cross-validation ROC-AUC (**0.8227**) with the lowest variance ($\pm 0.0051$) and rapid training time (1.73s). Its log-odds formulation yields naturally calibrated probabilities, minimizing probability distortion.
- **Brier Score**: **0.1475** (demonstrates strong probabilistic calibration against true binary outcomes).
- **Test Confusion Matrix (1,600 Held-out Test Observations)**:
  - True Negatives (Correctly predicted non-conversions): **1,028**
  - False Positives (Incorrectly predicted conversions): **100**
  - False Negatives (Missed conversions): **240**
  - True Positives (Accurately identified conversions): **232**
- **Top 5 Predictive Signals (Feature Importances)**:
  1. `demo_requested_Yes` (+1.48 log-odds weight)
  2. `pricing_page_viewed_Yes` (+1.12 log-odds weight)
  3. `website_visits` (+0.74 standardized weight)
  4. `budget_identified_Yes` (+0.68 log-odds weight)
  5. `job_role_Founder / CEO` (+0.59 log-odds weight)

---

## 7. System Architecture

```
                                  +------------------------------------+
                                  |     React 19 + Vite Frontend       |
                                  |     (Port 5173 / Localhost)        |
                                  +------------------------------------+
                                                    |
                                      Axios JSON REST Requests
                                                    |
                                                    v
                                  +------------------------------------+
                                  |       FastAPI Web Service          |
                                  |       (Port 8000 / Uvicorn)        |
                                  +------------------------------------+
                                       |            |            |
                    +------------------+            |            +------------------+
                    |                               |                               |
                    v                               v                               v
    +------------------------------+  +---------------------------+  +----------------------------+
    |     Prediction Service       |  |     Analytics Service     |  |     Campaign Service       |
    |  • Loads joblib pipeline     |  |  • Aggregates time-range  |  |  • Campaign CRUD lifecycle |
    |  • Computes probabilities    |  |    KPI rollups            |  |  • Attribution analytics   |
    |  • Assigns 0-100 scores      |  |  • Conversion trends      |  |  • Channel mix & leads     |
    |  • Rule-based intent signals |  |  • Segment yields         |  |  • Status & spend tracking |
    +------------------------------+  +---------------------------+  +----------------------------+
                    |                               |                               |
                    v                               v                               v
    +------------------------------+  +-----------------------------------------------------------+
    |   backend/models/*.joblib    |  |               backend/data/*.json & *.csv                 |
    |   (Frozen Model Artifact)    |  |               (Persistent Datasets)                       |
    +------------------------------+  +-----------------------------------------------------------+
```

---

## 8. Project Folder Structure

```text
LeadLens/
├── backend/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── __init__.py           # Lazy route aggregator
│   │   │   ├── analytics.py          # GET /api/analytics/overview
│   │   │   ├── campaigns.py          # Campaign CRUD & attribution endpoints (Phase 3.7)
│   │   │   ├── health.py             # GET /api/health
│   │   │   ├── model_info.py         # Metadata, tournament rankings, diagnostic artifacts
│   │   │   └── prediction.py         # POST /api/predict (real-time ML scoring)
│   │   ├── schemas/                  # Pydantic v2 validation models
│   │   │   ├── analytics.py
│   │   │   ├── campaign.py
│   │   │   ├── health.py
│   │   │   ├── model_info.py
│   │   │   └── prediction.py
│   │   └── __init__.py
│   ├── core/
│   │   ├── config.py                 # Central filepaths, server constants, CORS origins
│   │   └── __init__.py
│   ├── data/
│   │   ├── demo_analytics_dataset.json # Curated multi-touch lead dataset for analytics
│   │   ├── demo_campaigns.json         # Persistent campaign configuration records
│   │   └── lead_scoring_dataset.csv    # 8,000 synthetic B2B training leads (seed 42)
│   ├── ml/
│   │   ├── config.py                 # ML feature column definitions and random seed
│   │   ├── data_generator.py         # Reproducible synthetic data generation engine
│   │   ├── preprocessing.py          # Scikit-learn ColumnTransformer pipeline builder
│   │   ├── train_models.py           # 9-model tournament training and benchmarking script
│   │   └── README.md
│   ├── models/
│   │   ├── best_lead_scoring_model.joblib # Serialized winning Logistic Regression pipeline
│   │   ├── calibration_curve.png          # Diagnostic probability calibration curve
│   │   ├── confusion_matrix.png           # Diagnostic test confusion matrix
│   │   ├── feature_importance.csv         # Ranked feature weights
│   │   ├── model_metadata.json            # Complete model specifications & metrics
│   │   └── model_tournament_results.csv   # Benchmark results for all 9 models
│   ├── services/
│   │   ├── analytics_service.py      # KPI aggregation, conversion trends, segment yields
│   │   ├── campaign_service.py       # Campaign CRUD, lead attribution, spend tracking
│   │   ├── model_service.py          # Singleton pipeline inference manager
│   │   └── scoring_rules.py          # Central score scaling, tier bounds, intent signals
│   ├── tests/
│   │   ├── conftest.py               # Test fixtures and HTTPX client setup
│   │   ├── test_analytics.py         # Analytics overview & range tests
│   │   ├── test_campaigns.py         # Campaign CRUD & cross-service consistency tests
│   │   ├── test_health.py            # Health endpoint assertions
│   │   ├── test_model_info.py        # Model governance & artifact tests
│   │   ├── test_prediction.py        # Inference, tiering, and signal tests
│   │   └── test_validation.py        # Input boundary & schema error tests
│   ├── main.py                       # FastAPI application entrypoint & lifespan loader
│   └── README.md
│
├── frontend/
│   ├── public/                       # Static web assets
│   ├── src/
│   │   ├── assets/                   # Brand SVGs and illustrations
│   │   ├── components/
│   │   │   ├── analytics/            # Analytics charts, tables, and KPI cards
│   │   │   ├── campaigns/            # Campaign management, table, modal, and detail widgets
│   │   │   ├── dashboard/            # Executive overview dashboard components
│   │   │   ├── layout/               # AppLayout, Header, Sidebar, Logo
│   │   │   ├── leads/                # Leads table, filter bar, drawer, and pagination
│   │   │   ├── models/               # Model registry cards, tournament table, plots
│   │   │   ├── predict/              # Prediction form, score gauge, signal pills
│   │   │   └── ui/                   # Badges, modals, toasts, skeleton loaders
│   │   ├── context/
│   │   │   └── ThemeContext.jsx      # Theme manager (Dark & Light modes)
│   │   ├── pages/
│   │   │   ├── Analytics.jsx         # /analytics
│   │   │   ├── CampaignDetails.jsx   # /campaigns/:campaignId
│   │   │   ├── Campaigns.jsx         # /campaigns
│   │   │   ├── LeadDetails.jsx       # /leads/:leadId
│   │   │   ├── Leads.jsx             # /leads
│   │   │   ├── Models.jsx            # /models
│   │   │   ├── Overview.jsx          # /
│   │   │   ├── Predict.jsx           # /predict
│   │   │   └── Settings.jsx          # /settings
│   │   ├── services/                 # Axios API connectors
│   │   │   ├── analyticsApi.js
│   │   │   ├── campaignApi.js
│   │   │   ├── modelApi.js
│   │   │   └── predictionApi.js
│   │   ├── utils/                    # Data formatting helpers & mock fallbacks
│   │   ├── App.jsx                   # Route declarations
│   │   ├── index.css                 # Master design system & CSS custom properties
│   │   └── main.jsx                  # React DOM mount point
│   ├── package.json
│   └── vite.config.js
│
├── README.md                         # Master documentation
└── .gitignore
```

---

## 9. API Endpoints Reference

All endpoints are self-documenting and interactive via Swagger UI at `http://127.0.0.1:8000/docs`.

### System & Health Endpoints
| HTTP Verb | Path | Description | Response Status |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | API service root status, version, and documentation link | `200 OK` |
| `GET` | `/api/health` | Health check verifying model pipeline is loaded in memory | `200 OK` |

### Model Governance & Diagnostic Endpoints
| HTTP Verb | Path | Description | Response Status |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/model-info` | Current production champion specifications, parameters, and metrics | `200 OK` |
| `GET` | `/api/model-tournament` | Leaderboard of all 9 benchmarked candidate algorithms | `200 OK` |
| `GET` | `/api/model-info/features` | Ranked list of raw features and importance weights | `200 OK` |
| `GET` | `/api/model-info/artifacts/{name}` | Diagnostic PNG plots (`calibration_curve.png`, `confusion_matrix.png`) | `200 OK` |

### Predictive Inference Endpoint
| HTTP Verb | Path | Description | Response Status |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/predict` | Computes conversion probability, 0–100 score, tier, signals, and sales SLA | `200 OK` / `422 Unprocessable` |

#### Sample Prediction Request Payload (`POST /api/predict`):
```json
{
  "industry": "Software",
  "company_size": "51-200",
  "job_role": "Director",
  "lead_source": "LinkedIn",
  "campaign": "Q4 Enterprise Inbound",
  "budget_identified": "Yes",
  "website_visits": 8,
  "pages_viewed": 14,
  "email_opens": 4,
  "email_clicks": 2,
  "demo_requested": "Yes",
  "pricing_page_viewed": "Yes",
  "content_downloaded": "Yes",
  "webinar_attended": "No",
  "days_since_last_activity": 2,
  "sales_contacted": "No"
}
```

#### Sample Prediction Response:
```json
{
  "score": 87,
  "probability": 0.8672,
  "probability_percent": 86.7,
  "segment": "HOT",
  "recommended_action": "Contact immediately",
  "interpretation": "High conversion potential. Prioritize this lead for immediate sales outreach.",
  "signals": [
    "Demo intent detected",
    "Pricing intent detected",
    "High website engagement",
    "Budget identified",
    "Senior decision-maker role",
    "Recent lead activity",
    "Content downloaded"
  ],
  "model": {
    "name": "Logistic Regression",
    "version": "lead-scoring-v1"
  }
}
```

### Analytics Endpoints
| HTTP Verb | Path | Description | Response Status |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/analytics/overview` | Aggregated KPIs, trend data, channel mix, segment yields (`range=7d\|30d\|90d\|all`) | `200 OK` / `400 Bad Request` |

### Campaign Intelligence Endpoints (Phase 3.7)
| HTTP Verb | Path | Description | Response Status |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/campaigns` | List all campaigns with filters (`status`, `channel`, `campaign_type`, `search`) | `200 OK` |
| `GET` | `/api/campaigns/{campaign_id}`| Detailed campaign attribution, source mix, score buckets, and top leads | `200 OK` / `404 Not Found` |
| `POST` | `/api/campaigns` | Create a new campaign with budget and date validation | `201 Created` / `400 Bad Request` |
| `PATCH` | `/api/campaigns/{campaign_id}`| Update campaign metadata, status, budget, or timeline | `200 OK` / `404 Not Found` |
| `POST` | `/api/campaigns/{campaign_id}/archive`| Transition campaign status to `"Archived"` | `200 OK` / `404 Not Found` |

---

## 10. Prerequisites & System Requirements

Before running LeadLens locally on Windows, ensure the following tools are installed:

- **Operating System**: Windows 10 or Windows 11 (PowerShell or Command Prompt)
- **Python**: Version 3.10, 3.11, 3.12, or 3.13 ([python.org](https://www.python.org/downloads/))  
  *Verify that `python` and `pip` are checked to be added to your system PATH during installation.*
- **Node.js**: Version 18.x, 20.x, or 22.x LTS ([nodejs.org](https://nodejs.org/))  
  *Includes `npm` package manager.*
- **Git**: Optional, for repository cloning.

---

## 11. Step-by-Step Windows Installation Guide

### Step 1: Open Terminal in Project Root
Open PowerShell and navigate to the project directory:
```powershell
cd "d:\DS Projects\Project 2 (Lead Scanning and Scoring)"
```

### Step 2: Set Up Python Virtual Environment
It is recommended to use a virtual environment:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```
*(If PowerShell restricts script execution, run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`)*

### Step 3: Install Backend Dependencies
```powershell
pip install fastapi uvicorn scikit-learn xgboost pandas numpy joblib matplotlib pydantic pytest anyio httpx
```

### Step 4: Install Frontend Dependencies
In a separate terminal or the same terminal:
```powershell
cd frontend
npm install
cd ..
```

---

## 12. Running the Application Locally

LeadLens runs locally with separate backend and frontend processes.

### Terminal 1: Launch FastAPI Backend Server
From the root project directory:
```powershell
# Ensure virtual environment is active
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend API URL**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **ReDoc Documentation**: `http://127.0.0.1:8000/redoc`

### Terminal 2: Launch React + Vite Frontend
From the root project directory:
```powershell
cd frontend
npm run dev
```
- **Local Web Application URL**: `http://localhost:5173`

Open `http://localhost:5173` in any modern web browser to access the complete application.

---

## 13. Test Suite Execution & Verification

LeadLens maintains rigorous test coverage ensuring zero regressions and cross-service mathematical consistency.

### 1. Execute Backend Pytest Suite
From the root project directory:
```powershell
python -m pytest backend/tests -v
```

#### Actual Test Output:
```text
============================= test session starts =============================
platform win32 -- Python 3.13.15, pytest-9.1.1, pluggy-1.7.0
rootdir: D:\DS Projects\Project 2 (Lead Scanning and Scoring)
collected 33 items

backend/tests/test_analytics.py::test_analytics_overview_default_range PASSED
backend/tests/test_analytics.py::test_analytics_overview_valid_ranges[7d-Last 7 Days] PASSED
backend/tests/test_analytics.py::test_analytics_overview_valid_ranges[30d-Last 30 Days] PASSED
backend/tests/test_analytics.py::test_analytics_overview_valid_ranges[90d-Last 90 Days] PASSED
backend/tests/test_analytics.py::test_analytics_overview_valid_ranges[all-All Time] PASSED
backend/tests/test_analytics.py::test_analytics_overview_invalid_range_returns_400 PASSED
backend/tests/test_analytics.py::test_analytics_data_consistency PASSED
backend/tests/test_analytics.py::test_analytics_insights_structure PASSED
backend/tests/test_campaigns.py::test_list_campaigns_success PASSED
backend/tests/test_campaigns.py::test_filter_campaigns_by_status PASSED
backend/tests/test_campaigns.py::test_filter_campaigns_by_channel PASSED
backend/tests/test_campaigns.py::test_search_campaigns PASSED
backend/tests/test_campaigns.py::test_get_campaign_detail_success PASSED
backend/tests/test_campaigns.py::test_get_campaign_not_found_returns_404 PASSED
backend/tests/test_campaigns.py::test_create_campaign_success PASSED
backend/tests/test_campaigns.py::test_create_campaign_validation_errors PASSED
backend/tests/test_campaigns.py::test_update_campaign_success PASSED
backend/tests/test_campaigns.py::test_archive_campaign_success PASSED
backend/tests/test_campaigns.py::test_campaign_data_consistency PASSED
backend/tests/test_campaigns.py::test_cross_service_analytics_campaign_consistency PASSED
backend/tests/test_health.py::test_health_endpoint_success PASSED
backend/tests/test_model_info.py::test_model_info_endpoint_success PASSED
backend/tests/test_model_info.py::test_model_tournament_endpoint_success PASSED
backend/tests/test_model_info.py::test_model_features_endpoint_success PASSED
backend/tests/test_model_info.py::test_model_artifacts_endpoints_success PASSED
backend/tests/test_prediction.py::test_predict_valid_lead PASSED
backend/tests/test_prediction.py::test_predict_cold_lead PASSED
backend/tests/test_prediction.py::test_predict_determinism_consistency PASSED
backend/tests/test_prediction.py::test_predict_frontend_camelcase_alias_compatibility PASSED
backend/tests/test_validation.py::test_validation_missing_required_field PASSED
backend/tests/test_validation.py::test_validation_negative_numeric_value PASSED
backend/tests/test_validation.py::test_validation_invalid_categorical_value PASSED
backend/tests/test_validation.py::test_validation_malformed_input PASSED

======================== 33 passed, 1 warning in 7.62s ========================
```

### 2. Execute Frontend Code Linter
From the `frontend/` directory:
```powershell
npm run lint
```
- **Result**: `Found 0 warnings and 0 errors across 110 files.`

### 3. Build Frontend Production Bundle
From the `frontend/` directory:
```powershell
npm run build
```
- **Result**: `✓ built in ~1.2s` with zero errors.

---

## 14. Dataset Architecture & Limitations

### Dataset Architecture
- **Training Dataset**: `backend/data/lead_scoring_dataset.csv`
- **Volume**: 8,000 observations with 18 columns (1 administrative identifier, 11 categorical features, 5 numerical features, and 1 binary target `converted`).
- **Target Distribution**: ~27.2% converted (`1`), ~72.8% non-converted (`0`), accurately mirroring standard B2B enterprise conversion funnels.
- **Reproducibility**: Generated via `backend/ml/data_generator.py` with random seed `42`.

### Dataset Limitations & Disclaimers
1. **Synthetic Nature**: All lead names, emails, company names, and touchpoints are programmatically synthesized for research, demonstration, and evaluation purposes. They do not represent real individuals or confidential customer records.
2. **Correlation Boundary**: While behavioral features (demo requests, pricing page visits, web engagement) realistically correlate with conversion outcomes, synthetic data cannot replicate the full nuance of real-world buyer friction or economic cycles.
3. **Local Scope**: The current application executes entirely within a local developer environment using JSON/CSV persistence; enterprise production deployment would migrate these stores to an isolated relational database.

---

## 15. Future Roadmap

- [ ] **Relational Database Migration**: Transition in-memory and JSON storage to PostgreSQL / MySQL with SQLAlchemy ORM and Alembic migrations.
- [ ] **Live CRM Bidirectional Webhooks**: Implement production OAuth2 connectors for live bidirectional lead syncing with Salesforce, HubSpot, and Marketo.
- [ ] **Automated Model Retraining Worker**: Build scheduled background workers (Celery + Redis) to trigger automatic model retraining and drift detection based on newly labeled conversion outcomes.
- [ ] **SHAP Value Explanations**: Integrate TreeSHAP and KernelSHAP value computations into `POST /api/predict` to supplement rule-based intent signals with feature-level contribution values.
- [ ] **Containerization & Deployment**: Author Dockerfile and Docker Compose configurations for one-command multi-container deployment to AWS ECS or GCP Cloud Run.
- [ ] **Authentication & RBAC**: Add JWT authentication with role-based access control distinguishing Sales Reps, RevOps Managers, and System Administrators.

---

## 16. Author & Contact

**Developed by**: [Your Name / Candidate Name]  
**Specialization**: Machine Learning Engineering & Full-Stack Data Applications  
**Company Context**: Glitchreach — LeadLens SaaS Platform  

- **LinkedIn**: [linkedin.com/in/your-profile-url](https://www.linkedin.com/) *(Placeholder)*
- **GitHub**: [github.com/your-username](https://github.com/) *(Placeholder)*
- **Email**: [your.email@example.com](mailto:your.email@example.com) *(Placeholder)*
- **Portfolio**: [your-portfolio-website.com](https://example.com) *(Placeholder)*

---

*LeadLens is an educational and portfolio demonstration project developed for Glitchreach. All rights reserved.*
