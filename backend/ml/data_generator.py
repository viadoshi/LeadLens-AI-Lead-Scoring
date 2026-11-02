"""
LeadLens Synthetic Dataset Generator for B2B Lead Scoring.
Generates realistic, reproducible synthetic B2B lead records with legitimate
behavioral, firmographic, and engagement signals for binary classification.
"""
import sys
from pathlib import Path
import numpy as np
import pandas as pd

# Handle imports whether run directly or as a package
try:
    from backend.ml.config import (
        ALL_COLUMNS,
        ALL_FEATURES,
        BINARY_CHOICES,
        BUDGET_IDENTIFIED,
        CAMPAIGNS,
        CATEGORICAL_FEATURES,
        COMPANY_SIZES,
        DATA_DIR,
        DATASET_PATH,
        DEFAULT_SAMPLE_SIZE,
        ID_COLUMN,
        INDUSTRIES,
        JOB_ROLES,
        LEAD_SOURCES,
        NUMERICAL_FEATURES,
        RANDOM_SEED,
        TARGET_COLUMN,
    )
except ImportError:
    # Adjust path if run directly inside backend/ml
    current_dir = Path(__file__).resolve().parent
    sys.path.insert(0, str(current_dir.parent.parent))
    from backend.ml.config import (
        ALL_COLUMNS,
        ALL_FEATURES,
        BINARY_CHOICES,
        BUDGET_IDENTIFIED,
        CAMPAIGNS,
        CATEGORICAL_FEATURES,
        COMPANY_SIZES,
        DATA_DIR,
        DATASET_PATH,
        DEFAULT_SAMPLE_SIZE,
        ID_COLUMN,
        INDUSTRIES,
        JOB_ROLES,
        LEAD_SOURCES,
        NUMERICAL_FEATURES,
        RANDOM_SEED,
        TARGET_COLUMN,
    )



def generate_lead_scoring_dataset(n_samples: int = DEFAULT_SAMPLE_SIZE, random_seed: int = RANDOM_SEED) -> pd.DataFrame:
    """
    Generates a synthetic B2B lead dataset with realistic relationships and no data leakage.

    Parameters:
        n_samples (int): Number of fictional lead records to generate (default: 8,000).
        random_seed (int): Seed for reproducibility.

    Returns:
        pd.DataFrame: Validated synthetic dataset.
    """
    rng = np.random.default_rng(random_seed)

    # 1. Non-predictive Lead Identifier
    lead_ids = [f"LEAD-{10001 + i}" for i in range(n_samples)]

    # 2. Firmographic Categorical Features
    industry_probs = [0.28, 0.18, 0.12, 0.14, 0.08, 0.08, 0.04, 0.08]
    industries = rng.choice(INDUSTRIES, size=n_samples, p=industry_probs)

    company_size_probs = [0.15, 0.22, 0.28, 0.18, 0.10, 0.07]
    company_sizes = rng.choice(COMPANY_SIZES, size=n_samples, p=company_size_probs)

    job_role_probs = [0.14, 0.10, 0.18, 0.26, 0.14, 0.12, 0.06]
    job_roles = rng.choice(JOB_ROLES, size=n_samples, p=job_role_probs)

    source_probs = [0.26, 0.22, 0.24, 0.12, 0.10, 0.06]
    lead_sources = rng.choice(LEAD_SOURCES, size=n_samples, p=source_probs)

    campaign_probs = [0.28, 0.22, 0.14, 0.24, 0.12]
    campaigns = rng.choice(CAMPAIGNS, size=n_samples, p=campaign_probs)

    budget_probs = [0.28, 0.32, 0.40]
    budgets = rng.choice(BUDGET_IDENTIFIED, size=n_samples, p=budget_probs)

    # 3. Behavioral and Engagement Numerical Features (Realistic right-skewed distributions)
    # Most leads have low engagement, a smaller fraction has high engagement
    raw_visits = rng.negative_binomial(n=2, p=0.25, size=n_samples) + rng.poisson(lam=2.5, size=n_samples)
    website_visits = np.clip(raw_visits, 0, 100)

    # Pages viewed scales realistically with website visits
    pages_multiplier = rng.uniform(1.2, 3.2, size=n_samples)
    pages_viewed = np.clip(np.round(website_visits * pages_multiplier + rng.integers(0, 3, size=n_samples)), 0, 50).astype(int)

    # Email interaction
    email_opens = np.clip(rng.negative_binomial(n=2, p=0.35, size=n_samples), 0, 30)
    # Email clicks must never exceed email opens
    click_ratio = rng.uniform(0.0, 0.65, size=n_samples)
    email_clicks = np.clip(np.round(email_opens * click_ratio), 0, 15).astype(int)
    email_clicks = np.minimum(email_clicks, email_opens)

    # Recency of activity (0-90 days, skewed towards more recent)
    days_since_last_activity = np.clip(rng.exponential(scale=24.0, size=n_samples).astype(int), 0, 90)

    # 4. Intent Binary Categoricals (Influenced realistically by role, source, and engagement)
    # Demo requests: more likely for high visitors, senior roles, or referrals
    demo_base_prob = 0.06 + (website_visits > 10) * 0.14 + (job_roles == "Founder / CEO") * 0.12 + (lead_sources == "Referral") * 0.15
    demo_base_prob = np.clip(demo_base_prob, 0.02, 0.65)
    demo_requested = np.where(rng.uniform(size=n_samples) < demo_base_prob, "Yes", "No")

    # Pricing page viewed: correlated with pages viewed & intent
    pricing_base_prob = 0.14 + (pages_viewed > 8) * 0.24 + (demo_requested == "Yes") * 0.32
    pricing_base_prob = np.clip(pricing_base_prob, 0.05, 0.85)
    pricing_page_viewed = np.where(rng.uniform(size=n_samples) < pricing_base_prob, "Yes", "No")

    # Content downloaded
    content_base_prob = 0.22 + (website_visits > 4) * 0.25 + (lead_sources == "LinkedIn") * 0.14
    content_base_prob = np.clip(content_base_prob, 0.08, 0.80)
    content_downloaded = np.where(rng.uniform(size=n_samples) < content_base_prob, "Yes", "No")

    # Webinar attended
    webinar_base_prob = 0.08 + (lead_sources == "Webinar") * 0.68 + (campaigns == "Webinar AI Summit") * 0.45
    webinar_base_prob = np.clip(webinar_base_prob, 0.04, 0.85)
    webinar_attended = np.where(rng.uniform(size=n_samples) < webinar_base_prob, "Yes", "No")

    # Sales contacted
    sales_base_prob = 0.20 + (demo_requested == "Yes") * 0.45 + (budgets == "Yes") * 0.25 + (pricing_page_viewed == "Yes") * 0.15
    sales_base_prob = np.clip(sales_base_prob, 0.10, 0.90)
    sales_contacted = np.where(rng.uniform(size=n_samples) < sales_base_prob, "Yes", "No")

    # 5. Realistic Target Generation via Latent Log-Odds Process (NO LEAKAGE)
    # Base intercept calibrated to yield ~26%-28% conversion rate
    log_odds = -4.35



    # Positive high-intent drivers
    log_odds += (demo_requested == "Yes") * 1.70
    log_odds += (pricing_page_viewed == "Yes") * 0.85
    log_odds += (sales_contacted == "Yes") * 0.65
    log_odds += (content_downloaded == "Yes") * 0.30
    log_odds += (webinar_attended == "Yes") * 0.40

    # Budget drivers
    log_odds += (budgets == "Yes") * 1.15
    log_odds -= (budgets == "No") * 1.05

    # Seniority drivers
    log_odds += np.isin(job_roles, ["Founder / CEO", "Executive"]) * 0.80
    log_odds += (job_roles == "Director") * 0.55
    log_odds += (job_roles == "Manager") * 0.25
    log_odds -= (job_roles == "Individual Contributor") * 0.35

    # Firmographic scale
    log_odds += np.isin(company_sizes, ["201-500", "501-1000", "1001+"]) * 0.45
    log_odds -= (company_sizes == "1-10") * 0.25

    # Source channel quality
    log_odds += (lead_sources == "Referral") * 0.60
    log_odds += (lead_sources == "LinkedIn") * 0.30
    log_odds -= (lead_sources == "Email") * 0.35

    # Continuous engagement contributions (log-scaled to prevent extreme values from dominating)
    log_odds += np.log1p(website_visits) * 0.35
    log_odds += np.log1p(pages_viewed) * 0.30
    log_odds += np.log1p(email_clicks) * 0.45

    # Recency decay penalty
    log_odds -= (days_since_last_activity / 90.0) * 0.95

    # Zero engagement penalty
    log_odds -= (website_visits == 0) * 0.65

    # Realistic random noise (ensures non-deterministic pattern with realistic decision boundaries)
    noise = rng.normal(loc=0.0, scale=0.45, size=n_samples)
    log_odds += noise

    # Logistic sigmoid link function
    probabilities = 1.0 / (1.0 + np.exp(-log_odds))
    converted = (rng.uniform(size=n_samples) < probabilities).astype(int)

    # 6. Construct Final DataFrame
    df = pd.DataFrame(
        {
            "lead_id": lead_ids,
            "industry": industries,
            "company_size": company_sizes,
            "job_role": job_roles,
            "lead_source": lead_sources,
            "campaign": campaigns,
            "budget_identified": budgets,
            "website_visits": website_visits,
            "pages_viewed": pages_viewed,
            "email_opens": email_opens,
            "email_clicks": email_clicks,
            "demo_requested": demo_requested,
            "pricing_page_viewed": pricing_page_viewed,
            "content_downloaded": content_downloaded,
            "webinar_attended": webinar_attended,
            "days_since_last_activity": days_since_last_activity,
            "sales_contacted": sales_contacted,
            "converted": converted,
        }
    )

    # 7. Strict Data Quality Validation
    validate_dataset(df, expected_rows=n_samples)

    return df


def validate_dataset(df: pd.DataFrame, expected_rows: int = DEFAULT_SAMPLE_SIZE) -> None:
    """
    Performs comprehensive data quality checks on the generated lead dataset.
    Raises ValueError if any expectation fails.
    """
    # Check row count
    if len(df) != expected_rows:
        raise ValueError(f"Expected {expected_rows} rows, found {len(df)}")

    # Check columns match exact schema
    if list(df.columns) != ALL_COLUMNS:
        raise ValueError(f"Column schema mismatch.\nExpected: {ALL_COLUMNS}\nFound: {list(df.columns)}")

    # Check unique identifiers
    if df[ID_COLUMN].duplicated().any():
        raise ValueError("Duplicate lead_id values detected.")

    # Check missing values
    null_counts = df.isnull().sum()
    if null_counts.any():
        raise ValueError(f"Unexpected missing values detected:\n{null_counts[null_counts > 0]}")

    # Check target values
    unique_targets = set(df[TARGET_COLUMN].unique())
    if not unique_targets.issubset({0, 1}):
        raise ValueError(f"Target column '{TARGET_COLUMN}' contains invalid values: {unique_targets}")

    # Check categorical validity
    if not set(df["industry"].unique()).issubset(set(INDUSTRIES)):
        raise ValueError("Invalid industry values found.")
    if not set(df["company_size"].unique()).issubset(set(COMPANY_SIZES)):
        raise ValueError("Invalid company_size values found.")
    if not set(df["job_role"].unique()).issubset(set(JOB_ROLES)):
        raise ValueError("Invalid job_role values found.")
    if not set(df["lead_source"].unique()).issubset(set(LEAD_SOURCES)):
        raise ValueError("Invalid lead_source values found.")
    if not set(df["campaign"].unique()).issubset(set(CAMPAIGNS)):
        raise ValueError("Invalid campaign values found.")
    if not set(df["budget_identified"].unique()).issubset(set(BUDGET_IDENTIFIED)):
        raise ValueError("Invalid budget_identified values found.")

    for bin_col in ["demo_requested", "pricing_page_viewed", "content_downloaded", "webinar_attended", "sales_contacted"]:
        if not set(df[bin_col].unique()).issubset(set(BINARY_CHOICES)):
            raise ValueError(f"Invalid binary values in column '{bin_col}'.")

    # Check numerical bounds
    if (df["website_visits"] < 0).any() or (df["website_visits"] > 100).any():
        raise ValueError("website_visits out of [0, 100] range.")
    if (df["pages_viewed"] < 0).any() or (df["pages_viewed"] > 50).any():
        raise ValueError("pages_viewed out of [0, 50] range.")
    if (df["email_opens"] < 0).any() or (df["email_opens"] > 30).any():
        raise ValueError("email_opens out of [0, 30] range.")
    if (df["email_clicks"] < 0).any() or (df["email_clicks"] > 15).any():
        raise ValueError("email_clicks out of [0, 15] range.")
    if (df["email_clicks"] > df["email_opens"]).any():
        raise ValueError("Logical error: email_clicks exceeds email_opens.")
    if (df["days_since_last_activity"] < 0).any() or (df["days_since_last_activity"] > 90).any():
        raise ValueError("days_since_last_activity out of [0, 90] range.")


def print_dataset_summary(df: pd.DataFrame) -> None:
    """
    Prints a concise, readable summary of the generated dataset.
    """
    total = len(df)
    converted_count = int(df["converted"].sum())
    non_converted_count = total - converted_count
    conv_rate = (converted_count / total) * 100

    print("=" * 65)
    print("LEADLENS - ML DATASET GENERATION SUMMARY")
    print("=" * 65)
    print(f"Total Rows:              {total:,}")
    print(f"Total Columns:           {len(df.columns)}")
    print(f"Class Distribution:      Not Converted (0): {non_converted_count:,} ({100 - conv_rate:.1f}%)")
    print(f"                         Converted (1):     {converted_count:,} ({conv_rate:.1f}%)")
    print(f"Conversion Rate:         {conv_rate:.2f}%")
    print("-" * 65)
    print("NUMERICAL FEATURES SUMMARY:")
    num_summary = df[NUMERICAL_FEATURES].describe().T[["min", "mean", "50%", "max"]]
    num_summary.columns = ["Min", "Mean", "Median", "Max"]
    print(num_summary.round(2).to_string())
    print("-" * 65)
    print("CATEGORICAL FEATURE UNIQUE COUNTS:")
    for col in CATEGORICAL_FEATURES:
        n_unique = df[col].nunique()
        top_val = df[col].mode().iloc[0]
        print(f"  {col:<26}: {n_unique} unique categories (Top: '{top_val}')")
    print("=" * 65)


def main():
    """CLI entrypoint to generate and save the dataset."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Generating synthetic B2B lead dataset (target: {DEFAULT_SAMPLE_SIZE:,} rows)...")
    df = generate_lead_scoring_dataset(n_samples=DEFAULT_SAMPLE_SIZE, random_seed=RANDOM_SEED)

    df.to_csv(DATASET_PATH, index=False)
    print(f"Saved dataset to: {DATASET_PATH.resolve()}")

    print_dataset_summary(df)


if __name__ == "__main__":
    main()
