"""
Configuration and schema definitions for the LeadLens ML pipeline.
"""
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATASET_PATH = DATA_DIR / "lead_scoring_dataset.csv"

# Model Artifact Paths
MODELS_DIR = BASE_DIR / "models"
BEST_MODEL_PATH = MODELS_DIR / "best_lead_scoring_model.joblib"
METADATA_PATH = MODELS_DIR / "model_metadata.json"
TOURNAMENT_RESULTS_PATH = MODELS_DIR / "model_tournament_results.csv"
FEATURE_IMPORTANCE_PATH = MODELS_DIR / "feature_importance.csv"
CONFUSION_MATRIX_PATH = MODELS_DIR / "confusion_matrix.png"
CALIBRATION_CURVE_PATH = MODELS_DIR / "calibration_curve.png"

# Model Version
MODEL_VERSION = "lead-scoring-v1"

# Random Seed & Data Specs
RANDOM_SEED = 42
DEFAULT_SAMPLE_SIZE = 8000
TEST_SIZE = 0.20


# Target & Identifier Columns
TARGET_COLUMN = "converted"
ID_COLUMN = "lead_id"

# Categorical Feature Definitions
CATEGORICAL_FEATURES = [
    "industry",
    "company_size",
    "job_role",
    "lead_source",
    "campaign",
    "budget_identified",
    "demo_requested",
    "pricing_page_viewed",
    "content_downloaded",
    "webinar_attended",
    "sales_contacted",
]

# Numerical Feature Definitions
NUMERICAL_FEATURES = [
    "website_visits",
    "pages_viewed",
    "email_opens",
    "email_clicks",
    "days_since_last_activity",
]

# Exact Section 4 Dataset Column Order
ALL_FEATURES = [
    # Lead / Company Information
    "industry",
    "company_size",
    "job_role",
    "lead_source",
    "campaign",
    "budget_identified",
    # Engagement Signals
    "website_visits",
    "pages_viewed",
    "email_opens",
    "email_clicks",
    "demo_requested",
    "pricing_page_viewed",
    # Qualification / Intent Signals
    "content_downloaded",
    "webinar_attended",
    "days_since_last_activity",
    "sales_contacted",
]

ALL_COLUMNS = [ID_COLUMN] + ALL_FEATURES + [TARGET_COLUMN]


# Approved Categorical Values
INDUSTRIES = [
    "Software",
    "Fintech",
    "Healthcare",
    "E-commerce",
    "Logistics",
    "Manufacturing",
    "Education",
    "Professional Services",
]

COMPANY_SIZES = [
    "1-10",
    "11-50",
    "51-200",
    "201-500",
    "501-1000",
    "1001+",
]

JOB_ROLES = [
    "Founder / CEO",
    "Executive",
    "Director",
    "Manager",
    "Team Lead",
    "Individual Contributor",
    "Other",
]

LEAD_SOURCES = [
    "LinkedIn",
    "Google Ads",
    "Website",
    "Webinar",
    "Email",
    "Referral",
]

CAMPAIGNS = [
    "Q4 Enterprise Inbound",
    "Cloud Scale Outreach",
    "Webinar AI Summit",
    "SaaS Growth SDR",
    "Fintech Targeted Push",
]

BUDGET_IDENTIFIED = ["Yes", "No", "Unknown"]

BINARY_CHOICES = ["Yes", "No"]
