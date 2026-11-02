"""Pydantic schemas for model information and model intelligence endpoints."""
from typing import List, Optional
from pydantic import BaseModel, Field


class ModelInfoResponse(BaseModel):
    """Safe model metadata response schema for model inspection."""
    model_name: str = Field(..., description="Name of the winning classification algorithm", examples=["Logistic Regression"])
    model_version: str = Field(..., description="Release version tag of the trained model", examples=["lead-scoring-v1"])
    training_date: Optional[str] = Field(None, description="ISO timestamp of training tournament execution")
    cv_roc_auc_mean: Optional[float] = Field(None, description="5-Fold Cross-Validation mean ROC-AUC score")
    cv_roc_auc_std: Optional[float] = Field(None, description="Standard deviation of CV ROC-AUC scores")
    test_roc_auc: Optional[float] = Field(None, description="Holdout test evaluation ROC-AUC score")
    test_accuracy: Optional[float] = Field(None, description="Holdout test accuracy")
    test_precision: Optional[float] = Field(None, description="Holdout test precision (class 1)")
    test_recall: Optional[float] = Field(None, description="Holdout test recall (class 1)")
    test_f1: Optional[float] = Field(None, description="Holdout test F1 score")
    brier_score: Optional[float] = Field(None, description="Brier calibration loss score")
    feature_count: int = Field(..., description="Total count of raw input features", examples=[16])
    encoded_feature_count: int = Field(..., description="Total count of one-hot encoded features", examples=[50])
    feature_names: List[str] = Field(..., description="Ordered list of raw model input features")
    dataset_rows: Optional[int] = Field(None, description="Total size of training dataset rows", examples=[8000])
    train_rows: Optional[int] = Field(None, description="Training split sample count", examples=[6400])
    test_rows: Optional[int] = Field(None, description="Test holdout split sample count", examples=[1600])
    target_name: Optional[str] = Field("converted", description="Target classification binary label", examples=["converted"])
    cv_folds: Optional[int] = Field(5, description="Number of cross-validation folds evaluated during tournament", examples=[5])
    primary_metric: Optional[str] = Field("ROC-AUC", description="Primary optimization metric for tournament ranking", examples=["ROC-AUC"])


class ModelTournamentItem(BaseModel):
    """Single candidate model tournament performance evaluation."""
    model: str = Field(..., description="Candidate model algorithm family name", examples=["Logistic Regression"])
    accuracy: float = Field(..., description="Holdout test accuracy", examples=[0.7906])
    precision: float = Field(..., description="Holdout test precision", examples=[0.7015])
    recall: float = Field(..., description="Holdout test recall", examples=[0.5074])
    f1: float = Field(..., description="Holdout test F1 score", examples=[0.5887])
    roc_auc: float = Field(..., description="Holdout test ROC-AUC score", examples=[0.8227])
    cv_roc_auc_mean: float = Field(..., description="5-Fold Cross-Validation mean ROC-AUC score", examples=[0.8227])
    cv_roc_auc_std: float = Field(..., description="Cross-Validation ROC-AUC standard deviation", examples=[0.0051])
    training_time: float = Field(..., description="Elapsed wall-clock training & hyperparameter tuning time in seconds", examples=[1.73])


class ModelFeatureItem(BaseModel):
    """Single feature predictive weight / importance entry."""
    feature: str = Field(..., description="Model input feature or one-hot encoded category name", examples=["budget_identified_Yes"])
    importance: float = Field(..., description="Coefficient magnitude or feature importance weight", examples=[1.084311])
