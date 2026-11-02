# LeadLens Machine Learning Data Foundation

## 1. Overview and Purpose
LeadLens is a B2B SaaS AI lead-scoring platform designed for the fictional company **Glitchreach**. This directory contains the data generation, validation, and preprocessing pipeline that establishes the foundation for model training and evaluation.

The goal of the ML system is **binary classification**: predicting whether an incoming B2B lead is likely to convert (`converted = 1`) or not (`converted = 0`).

The eventual model output will be a calibrated conversion probability $P(\text{converted} = 1)$, which will subsequently be scaled into a **0–100 Lead Score** and categorized into priority tiers:
- **HOT** ($80 \le \text{Score} \le 100$)
- **WARM** ($60 \le \text{Score} < 80$)
- **NURTURE** ($40 \le \text{Score} < 60$)
- **COLD** ($0 \le \text{Score} < 40$)

---

## 2. Synthetic Data Disclaimer
> [!IMPORTANT]
> **This dataset is synthetic and created solely for the LeadLens demonstration/project.**
> It does not represent real people, real personal data, or real Glitchreach customer accounts. All contact identifiers and firmographic records are programmatically generated for research and educational purposes.

---

## 3. Dataset Architecture

- **File Path**: `backend/data/lead_scoring_dataset.csv`
- **Total Records**: 8,000 observations
- **Total Columns**: 18 (1 Identifier + 11 Categorical Features + 5 Numerical Features + 1 Target Variable)
- **Target Distribution**: ~25%–28% converted (`1`), ~72%–75% non-converted (`0`)
- **Random Seed**: `42` (ensures exact mathematical reproducibility)

### Schema and Feature Dictionary

| Column Name | Type | Allowed Values / Range | Description |
| :--- | :--- | :--- | :--- |
| `lead_id` | Identifier | `LEAD-10001` ... `LEAD-18000` | Fictional unique record identifier (**excluded from modeling**) |
| `industry` | Categorical | 8 Sectors (Software, Fintech, Healthcare, etc.) | Target vertical of the prospect company |
| `company_size` | Categorical | `1-10`, `11-50`, `51-200`, `201-500`, `501-1000`, `1001+` | Number of employees at the prospect organization |
| `job_role` | Categorical | `Founder / CEO`, `Executive`, `Director`, `Manager`, etc. | Decision-maker hierarchy level |
| `lead_source` | Categorical | `LinkedIn`, `Google Ads`, `Website`, `Webinar`, `Email`, `Referral` | Inbound acquisition channel |
| `campaign` | Categorical | 5 Marketing Campaigns | Attributed marketing initiative |
| `budget_identified` | Categorical | `Yes`, `No`, `Unknown` | BANT budget qualification status |
| `website_visits` | Numerical | `0` – `100` | Total website sessions detected (right-skewed distribution) |
| `pages_viewed` | Numerical | `0` – `50` | Total web pages viewed across sessions |
| `email_opens` | Numerical | `0` – `30` | Number of marketing emails opened |
| `email_clicks` | Numerical | `0` – `15` | Number of email links clicked ($\le \text{email\_opens}$) |
| `demo_requested` | Binary | `Yes`, `No` | Whether prospect submitted a product demo request |
| `pricing_page_viewed`| Binary | `Yes`, `No` | High-intent indicator: visited enterprise pricing matrix |
| `content_downloaded` | Binary | `Yes`, `No` | Downloaded whitepaper, e-book, or benchmark report |
| `webinar_attended` | Binary | `Yes`, `No` | Attended live or on-demand webinar session |
| `days_since_last_activity` | Numerical | `0` – `90` | Recency metric: days since last registered interaction |
| `sales_contacted` | Binary | `Yes`, `No` | Whether an SDR/AE has initiated contact |
| `converted` | **Target** | `0` (No), `1` (Yes) | **Ground truth binary conversion outcome** |

---

## 4. Prevention of Data Leakage
To maintain rigorous machine learning standards:
1. **Identifier Separation**: `lead_id` is an administrative tag and is strictly dropped prior to feature transformation.
2. **No Target Proxies**: No synthetic `conversion_probability` or `lead_score` columns exist in the training dataset.
3. **Strict Train/Test Partitioning**: Preprocessing transformers (`StandardScaler`, `OneHotEncoder`) are fitted **strictly on the training split** ($X_{\text{train}}$) and only applied (via `.transform()`) to the test split ($X_{\text{test}}$).

---

## 5. How to Regenerate the Dataset

The dataset generator is self-contained and reproducible. Run from project root:

```bash
python backend/ml/data_generator.py
```

This command will:
1. Synthesize 8,000 lead records using seed `42`.
2. Execute automated data quality assertions (bounds, absence of nulls, logical constraints).
3. Save the validated CSV to `backend/data/lead_scoring_dataset.csv`.
4. Print a full statistical summary table to stdout.

---

## 6. Preprocessing and Splitting Pipeline

Located in `backend/ml/preprocessing.py`:

```python
from backend.ml.data_generator import generate_lead_scoring_dataset
from backend.ml.preprocessing import split_data, build_preprocessing_pipeline

# 1. Load or generate data
df = generate_lead_scoring_dataset()

# 2. Stratified train/test split (80/20 ratio, random_state=42)
X_train, X_test, y_train, y_test = split_data(df, test_size=0.20, random_state=42)

# 3. Build ColumnTransformer pipeline
preprocessor = build_preprocessing_pipeline()

# 4. Fit strictly on train; transform both
X_train_encoded = preprocessor.fit_transform(X_train)
X_test_encoded = preprocessor.transform(X_test)
```

- **Numerical Features**: `SimpleImputer(strategy='median')` followed by `StandardScaler()`.
- **Categorical Features**: `SimpleImputer(strategy='most_frequent')` followed by `OneHotEncoder(handle_unknown='ignore', sparse_output=False)`.
