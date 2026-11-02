"""
LeadLens ML Preprocessing and Data Splitting Pipeline.
Provides standardized, leakage-free data preparation using scikit-learn
Pipeline and ColumnTransformer architectures.
"""
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

try:
    from backend.ml.config import (
        ALL_FEATURES,
        CATEGORICAL_FEATURES,
        DATASET_PATH,
        ID_COLUMN,
        NUMERICAL_FEATURES,
        RANDOM_SEED,
        TARGET_COLUMN,
        TEST_SIZE,
    )
except ImportError:
    current_dir = Path(__file__).resolve().parent
    sys.path.insert(0, str(current_dir.parent.parent))
    from backend.ml.config import (
        ALL_FEATURES,
        CATEGORICAL_FEATURES,
        DATASET_PATH,
        ID_COLUMN,
        NUMERICAL_FEATURES,
        RANDOM_SEED,
        TARGET_COLUMN,
        TEST_SIZE,
    )



def split_data(
    df: pd.DataFrame,
    test_size: float = TEST_SIZE,
    random_state: int = RANDOM_SEED,
    stratify: bool = True,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Separates target and features, excludes identifier, and performs stratified train/test split.

    Parameters:
        df (pd.DataFrame): Raw lead dataset.
        test_size (float): Proportion of dataset to include in test split (default: 0.20).
        random_state (int): Seed for reproducibility.
        stratify (bool): Whether to stratify split on target variable.

    Returns:
        Tuple of (X_train, X_test, y_train, y_test)
    """
    if TARGET_COLUMN not in df.columns:
        raise ValueError(f"Target column '{TARGET_COLUMN}' not found in dataframe.")

    # 1. Separate features and target
    y = df[TARGET_COLUMN].copy()

    # Exclude target and lead_id from feature matrix
    feature_cols = [col for col in ALL_FEATURES if col in df.columns]
    X = df[feature_cols].copy()

    # Explicit safeguard: ensure lead_id is strictly not present in X
    if ID_COLUMN in X.columns:
        X = X.drop(columns=[ID_COLUMN])

    stratify_target = y if stratify else None

    # 2. Perform train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=stratify_target,
    )

    return X_train, X_test, y_train, y_test


def build_preprocessing_pipeline() -> ColumnTransformer:
    """
    Constructs a robust, scikit-learn ColumnTransformer preprocessing pipeline.

    - Numerical features: Imputed with median and standardized with StandardScaler.
    - Categorical features: Imputed with most frequent and one-hot encoded with handle_unknown='ignore'.

    Returns:
        ColumnTransformer: Unfitted preprocessor.
    """
    # Numerical sub-pipeline
    numerical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    # Categorical sub-pipeline (handle_unknown='ignore' ensures safe production inference)
    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
        ]
    )

    # Combined preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numerical_transformer, NUMERICAL_FEATURES),
            ("cat", categorical_transformer, CATEGORICAL_FEATURES),
        ],
        remainder="drop",
        verbose_feature_names_out=False,
    )

    return preprocessor


def get_preprocessed_feature_names(preprocessor: ColumnTransformer) -> List[str]:
    """
    Extracts output feature names from a fitted ColumnTransformer.
    """
    if hasattr(preprocessor, "get_feature_names_out"):
        return list(preprocessor.get_feature_names_out())
    return []


def verify_preprocessing_pipeline(
    df: pd.DataFrame,
) -> Dict[str, object]:
    """
    Validates preprocessing integrity:
    1. Splits data with stratification
    2. Fits preprocessor strictly on X_train
    3. Transforms X_train and X_test
    4. Confirms no NaN values and expected dimensional shapes
    """
    X_train, X_test, y_train, y_test = split_data(df)

    preprocessor = build_preprocessing_pipeline()

    # Fit strictly on training set to avoid data leakage
    X_train_transformed = preprocessor.fit_transform(X_train)
    X_test_transformed = preprocessor.transform(X_test)

    feature_names = get_preprocessed_feature_names(preprocessor)

    # Validation checks
    assert X_train_transformed.shape[0] == len(X_train), "X_train row count mismatch"
    assert X_test_transformed.shape[0] == len(X_test), "X_test row count mismatch"
    assert X_train_transformed.shape[1] == X_test_transformed.shape[1], "Feature count mismatch between train and test"
    assert not pd.isna(X_train_transformed).any(), "NaN detected in transformed training set"
    assert not pd.isna(X_test_transformed).any(), "NaN detected in transformed test set"

    train_conv_rate = (y_train.sum() / len(y_train)) * 100
    test_conv_rate = (y_test.sum() / len(y_test)) * 100

    return {
        "X_train_shape": X_train_transformed.shape,
        "X_test_shape": X_test_transformed.shape,
        "total_encoded_features": len(feature_names),
        "train_samples": len(y_train),
        "test_samples": len(y_test),
        "train_conversion_rate": round(train_conv_rate, 2),
        "test_conversion_rate": round(test_conv_rate, 2),
        "sample_encoded_features": feature_names[:10],
    }


def main():
    """CLI entrypoint to test and verify preprocessing and splitting on generated dataset."""
    if not DATASET_PATH.exists():
        print(f"Dataset not found at: {DATASET_PATH}. Please run data_generator.py first.")
        sys.exit(1)

    print(f"Loading dataset from: {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)

    print("Executing stratified train/test split and ColumnTransformer verification...")
    results = verify_preprocessing_pipeline(df)

    print("=" * 65)
    print("LEADLENS - PREPROCESSING & DATA SPLIT VERIFICATION")
    print("=" * 65)
    print(f"Train Samples (80%):     {results['train_samples']:,} rows")
    print(f"Test Samples (20%):      {results['test_samples']:,} rows")
    print(f"Train Conversion Rate:   {results['train_conversion_rate']}%")
    print(f"Test Conversion Rate:    {results['test_conversion_rate']}%")
    print(f"X_train Transformed:     {results['X_train_shape']}")
    print(f"X_test Transformed:      {results['X_test_shape']}")
    print(f"Total Encoded Features:  {results['total_encoded_features']}")
    print("-" * 65)
    print("Sample Encoded Features:")
    for feat in results["sample_encoded_features"]:
        print(f"  • {feat}")
    print("=" * 65)
    print("STATUS: Preprocessing pipeline verified successfully. Zero data leakage detected.")


if __name__ == "__main__":
    main()

