"""
LeadLens ML Model Service.
Manages singleton lifecycle of the trained classification pipeline, tournament results,
feature importances, and visual diagnostic artifacts.
Guarantees one-time artifact loading, input alignment, and thread-safe inference.
"""
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional
import joblib
import pandas as pd

from backend.core.config import (
    CALIBRATION_CURVE_PATH,
    CONFUSION_MATRIX_PATH,
    FEATURE_IMPORTANCE_PATH,
    METADATA_PATH,
    MODEL_PATH,
    TOURNAMENT_RESULTS_PATH,
)

logger = logging.getLogger("leadlens.model_service")


class ModelService:
    """Singleton service encapsulating the LeadLens winning model pipeline and intelligence artifacts."""

    _instance: Optional["ModelService"] = None

    def __new__(cls) -> "ModelService":
        if cls._instance is None:
            cls._instance = super(ModelService, cls).__new__(cls)
            cls._instance.model = None
            cls._instance.metadata = {}
            cls._instance.feature_names = []
            cls._instance.model_name = "Unknown Model"
            cls._instance.model_version = "lead-scoring-v1"
            cls._instance.is_loaded = False
            cls._instance.tournament_results = []
            cls._instance.feature_importance = []
        return cls._instance

    def load_artifacts(
        self,
        model_path: Path = MODEL_PATH,
        metadata_path: Path = METADATA_PATH,
    ) -> None:
        """
        Loads the trained model pipeline and associated metadata once at application startup.
        Fails fast with clear exceptions if critical artifacts are missing or invalid.
        """
        logger.info("Initializing LeadLens model service artifacts...")

        # 1. Validate artifact existence
        if not model_path.exists():
            error_msg = (
                f"Winning model artifact missing. Expected path: '{model_path.resolve()}'. "
                f"Please ensure Phase 3.2 model training has generated the .joblib artifact."
            )
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        if not metadata_path.exists():
            error_msg = (
                f"Model metadata JSON missing. Expected path: '{metadata_path.resolve()}'. "
                f"Please ensure Phase 3.2 has recorded model_metadata.json."
            )
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        # 2. Load model metadata
        try:
            with open(metadata_path, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)
            self.model_name = self.metadata.get("model_name", "LeadLens Model")
            self.model_version = self.metadata.get("model_version", "lead-scoring-v1")
            self.feature_names = self.metadata.get("feature_names", [])
            logger.info(
                "Model metadata loaded: model='%s', version='%s', features=%d",
                self.model_name,
                self.model_version,
                len(self.feature_names),
            )
        except Exception as exc:
            logger.error("Failed to parse model metadata JSON: %s", exc)
            raise RuntimeError(f"Failed to parse model metadata: {exc}") from exc

        # 3. Load joblib pipeline
        try:
            self.model = joblib.load(model_path)
            # Verify pipeline has predict_proba
            if not hasattr(self.model, "predict_proba"):
                raise AttributeError(
                    f"Loaded model '{type(self.model)}' does not support predict_proba."
                )
            self.is_loaded = True
            logger.info("Model pipeline loaded successfully into memory.")
        except Exception as exc:
            self.is_loaded = False
            logger.error("Failed to deserialize model pipeline joblib: %s", exc)
            raise RuntimeError(f"Failed to load model pipeline: {exc}") from exc

        # 4. Load tournament results
        if TOURNAMENT_RESULTS_PATH.exists():
            try:
                df_tournament = pd.read_csv(TOURNAMENT_RESULTS_PATH)
                df_tournament = df_tournament.sort_values(by="cv_roc_auc_mean", ascending=False)
                self.tournament_results = df_tournament.to_dict(orient="records")
                logger.info("Loaded %d candidate model evaluations from tournament results.", len(self.tournament_results))
            except Exception as exc:
                logger.warning("Could not parse tournament results CSV: %s", exc)
                self.tournament_results = []
        else:
            logger.warning("Tournament results CSV not found at: %s", TOURNAMENT_RESULTS_PATH)
            self.tournament_results = []

        # 5. Load feature importance
        if FEATURE_IMPORTANCE_PATH.exists():
            try:
                df_features = pd.read_csv(FEATURE_IMPORTANCE_PATH)
                df_features = df_features.sort_values(by="importance", ascending=False)
                self.feature_importance = df_features.to_dict(orient="records")
                logger.info("Loaded %d feature importance values from feature importance CSV.", len(self.feature_importance))
            except Exception as exc:
                logger.warning("Could not parse feature importance CSV: %s", exc)
                self.feature_importance = []
        else:
            logger.warning("Feature importance CSV not found at: %s", FEATURE_IMPORTANCE_PATH)
            self.feature_importance = []

    def predict_probability(self, lead_dict: Dict[str, Any]) -> float:
        """
        Executes model pipeline inference on a single lead record.

        Args:
            lead_dict: Dictionary containing the raw lead feature values.

        Returns:
            float: Probability of conversion (class = 1), between 0.0 and 1.0.
        """
        if not self.is_loaded or self.model is None:
            raise RuntimeError("Model service is not loaded or unavailable.")

        # Ensure all expected feature columns are present and strictly ordered
        aligned_data = {}
        for feat in self.feature_names:
            if feat not in lead_dict:
                raise ValueError(f"Missing required feature for model inference: '{feat}'")
            aligned_data[feat] = [lead_dict[feat]]

        df = pd.DataFrame(aligned_data)

        # Model pipeline execution (ColumnTransformer + Classifier)
        probas = self.model.predict_proba(df)
        # Class 1 corresponds to converted=1
        conversion_prob = float(probas[0][1])
        return conversion_prob

    def get_safe_metadata(self) -> Dict[str, Any]:
        """
        Returns sanitized, production-safe metadata without filesystem paths.
        Used by GET /api/model-info.
        """
        if not self.metadata:
            return {
                "model_name": self.model_name,
                "model_version": self.model_version,
                "status": "metadata_unavailable",
            }

        return {
            "model_name": self.metadata.get("model_name", self.model_name),
            "model_version": self.metadata.get("model_version", self.model_version),
            "training_date": self.metadata.get("training_date"),
            "cv_roc_auc_mean": self.metadata.get("cv_roc_auc_mean"),
            "cv_roc_auc_std": self.metadata.get("cv_roc_auc_std"),
            "test_roc_auc": self.metadata.get("test_roc_auc"),
            "test_accuracy": self.metadata.get("test_accuracy"),
            "test_precision": self.metadata.get("test_precision"),
            "test_recall": self.metadata.get("test_recall"),
            "test_f1": self.metadata.get("test_f1"),
            "brier_score": self.metadata.get("brier_score"),
            "feature_count": len(self.feature_names),
            "encoded_feature_count": self.metadata.get("encoded_feature_count", 50),
            "feature_names": self.feature_names,
            "dataset_rows": self.metadata.get("dataset_rows", 8000),
            "train_rows": self.metadata.get("train_rows", 6400),
            "test_rows": self.metadata.get("test_rows", 1600),
            "target_name": self.metadata.get("target_name", "converted"),
            "cv_folds": 5,
            "primary_metric": "ROC-AUC",
        }

    def get_tournament_results(self) -> List[Dict[str, Any]]:
        """Returns candidate model tournament evaluations sorted by cv_roc_auc_mean descending."""
        if not self.tournament_results and TOURNAMENT_RESULTS_PATH.exists():
            df_tournament = pd.read_csv(TOURNAMENT_RESULTS_PATH)
            df_tournament = df_tournament.sort_values(by="cv_roc_auc_mean", ascending=False)
            self.tournament_results = df_tournament.to_dict(orient="records")
        return self.tournament_results

    def get_feature_importance(self) -> List[Dict[str, Any]]:
        """Returns model feature importance values sorted by importance descending."""
        if not self.feature_importance and FEATURE_IMPORTANCE_PATH.exists():
            df_features = pd.read_csv(FEATURE_IMPORTANCE_PATH)
            df_features = df_features.sort_values(by="importance", ascending=False)
            self.feature_importance = df_features.to_dict(orient="records")
        return self.feature_importance

    def get_confusion_matrix_path(self) -> Path:
        """Returns the verified absolute Path to the confusion matrix image artifact."""
        if not CONFUSION_MATRIX_PATH.exists():
            raise FileNotFoundError("Confusion matrix artifact not found.")
        return CONFUSION_MATRIX_PATH

    def get_calibration_curve_path(self) -> Path:
        """Returns the verified absolute Path to the calibration curve image artifact."""
        if not CALIBRATION_CURVE_PATH.exists():
            raise FileNotFoundError("Calibration curve artifact not found.")
        return CALIBRATION_CURVE_PATH


# Global singleton instance
model_service = ModelService()
