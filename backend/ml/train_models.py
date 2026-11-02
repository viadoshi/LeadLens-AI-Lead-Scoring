"""
LeadLens ML Model Tournament and Training Pipeline.
Executes stratified cross-validation tournament across 9 classification algorithms,
selects the best model based on CV ROC-AUC, evaluates on the untouched test set,
computes calibration and explainability, and saves production model artifacts.
"""
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import joblib
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import sklearn
from sklearn.calibration import calibration_curve
from sklearn.ensemble import (
    AdaBoostClassifier,
    GradientBoostingClassifier,
    RandomForestClassifier,
)
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    accuracy_score,
    brier_score_loss,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.ml.config import (
    ALL_COLUMNS,
    ALL_FEATURES,
    BEST_MODEL_PATH,
    CALIBRATION_CURVE_PATH,
    CONFUSION_MATRIX_PATH,
    DATASET_PATH,
    FEATURE_IMPORTANCE_PATH,
    ID_COLUMN,
    METADATA_PATH,
    MODELS_DIR,
    MODEL_VERSION,
    NUMERICAL_FEATURES,
    CATEGORICAL_FEATURES,
    RANDOM_SEED,
    TARGET_COLUMN,
    TEST_SIZE,
    TOURNAMENT_RESULTS_PATH,
)
from backend.ml.preprocessing import (
    build_preprocessing_pipeline,
    get_preprocessed_feature_names,
    split_data,
)

# Check XGBoost dependency
try:
    import xgboost as xgb
    from xgboost import XGBClassifier
    XGB_AVAILABLE = True
    XGB_VERSION = xgb.__version__
except ImportError as err:
    XGB_AVAILABLE = False
    XGB_VERSION = None
    XGB_IMPORT_ERROR = str(err)


def get_candidate_models() -> Dict[str, Any]:
    """
    Returns the dictionary of 9 candidate models with reasonable baseline hyperparameters.
    """
    models = {
        "Logistic Regression": LogisticRegression(
            max_iter=1000,
            random_state=RANDOM_SEED,
        ),
        "K-Nearest Neighbors": KNeighborsClassifier(
            n_neighbors=5,
        ),
        "Naive Bayes": GaussianNB(),
        "Decision Tree": DecisionTreeClassifier(
            random_state=RANDOM_SEED,
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=100,
            random_state=RANDOM_SEED,
        ),
        "SVM": SVC(
            probability=True,
            random_state=RANDOM_SEED,
        ),
        "AdaBoost": AdaBoostClassifier(
            random_state=RANDOM_SEED,
        ),
        "Gradient Boosting": GradientBoostingClassifier(
            random_state=RANDOM_SEED,
        ),
    }

    if XGB_AVAILABLE:
        models["XGBoost"] = XGBClassifier(
            random_state=RANDOM_SEED,
            eval_metric="logloss",
            n_estimators=100,
        )
    else:
        print(f"[WARNING] XGBoost is not available: {XGB_IMPORT_ERROR}")

    return models


def verify_data_leakage_safeguards(
    df: pd.DataFrame,
    X_train: pd.DataFrame,
    X_test: pd.DataFrame,
    y_train: pd.Series,
    y_test: pd.Series,
) -> None:
    """
    Strictly verifies that no data leakage exists across train/test splits,
    target variables, or feature matrices.
    """
    # 1. Check ID exclusion
    if ID_COLUMN in X_train.columns or ID_COLUMN in X_test.columns:
        raise ValueError(f"CRITICAL: {ID_COLUMN} is present in feature matrix!")

    # 2. Check target exclusion
    if TARGET_COLUMN in X_train.columns or TARGET_COLUMN in X_test.columns:
        raise ValueError(f"CRITICAL: {TARGET_COLUMN} is present in feature matrix!")

    # 3. Check split sizes
    expected_total = len(df)
    actual_total = len(X_train) + len(X_test)
    if expected_total != actual_total:
        raise ValueError(f"Row count mismatch: expected {expected_total}, got {actual_total}")

    # 4. Check index overlap between train and test
    overlap = set(X_train.index).intersection(set(X_test.index))
    if len(overlap) > 0:
        raise ValueError(f"CRITICAL: {len(overlap)} rows overlap between train and test sets!")

    # 5. Check no NaN in raw targets
    if y_train.isna().any() or y_test.isna().any():
        raise ValueError("CRITICAL: Missing values in target variable!")

    # 6. Check target binary classes
    unique_train_y = set(y_train.unique())
    unique_test_y = set(y_test.unique())
    if unique_train_y != {0, 1} or unique_test_y != {0, 1}:
        raise ValueError("CRITICAL: Target does not have binary {0, 1} values!")


def run_tournament(
    X_train: pd.DataFrame,
    y_train: pd.Series,
) -> Tuple[pd.DataFrame, Dict[str, Pipeline], Dict[str, Any]]:
    """
    Executes 5-fold stratified cross-validation for every candidate model inside
    a full Pipeline(preprocessing, classifier).
    Evaluates CV ROC-AUC, Accuracy, Precision, Recall, F1, and training time.
    """
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_SEED)
    models = get_candidate_models()

    scoring = {
        "accuracy": "accuracy",
        "precision": "precision",
        "recall": "recall",
        "f1": "f1",
        "roc_auc": "roc_auc",
    }

    tournament_rows = []
    pipelines: Dict[str, Pipeline] = {}
    cv_raw_scores: Dict[str, Any] = {}

    print("-" * 88)
    print(f"{'Model':<22} | {'CV ROC-AUC':<14} | {'Accuracy':<9} | {'Precision':<10} | {'Recall':<8} | {'F1':<8} | {'Time (s)':<8}")
    print("-" * 88)

    for name, clf in models.items():
        # Pipeline encapsulates preprocessing inside each CV fold
        pipe = Pipeline(
            steps=[
                ("preprocessor", build_preprocessing_pipeline()),
                ("classifier", clf),
            ]
        )
        pipelines[name] = pipe

        try:
            start_time = time.perf_counter()
            cv_results = cross_validate(
                pipe,
                X_train,
                y_train,
                cv=cv,
                scoring=scoring,
                return_train_score=False,
                n_jobs=1,
            )
            elapsed_time = time.perf_counter() - start_time

            mean_roc_auc = float(np.mean(cv_results["test_roc_auc"]))
            std_roc_auc = float(np.std(cv_results["test_roc_auc"]))
            mean_acc = float(np.mean(cv_results["test_accuracy"]))
            mean_prec = float(np.mean(cv_results["test_precision"]))
            mean_recall = float(np.mean(cv_results["test_recall"]))
            mean_f1 = float(np.mean(cv_results["test_f1"]))

            cv_raw_scores[name] = cv_results

            tournament_rows.append({
                "model": name,
                "accuracy": round(mean_acc, 4),
                "precision": round(mean_prec, 4),
                "recall": round(mean_recall, 4),
                "f1": round(mean_f1, 4),
                "roc_auc": round(mean_roc_auc, 4),
                "cv_roc_auc_mean": round(mean_roc_auc, 4),
                "cv_roc_auc_std": round(std_roc_auc, 4),
                "training_time": round(elapsed_time, 2),
            })

            auc_str = f"{mean_roc_auc:.4f} ± {std_roc_auc:.3f}"
            print(f"{name:<22} | {auc_str:<14} | {mean_acc:<9.4f} | {mean_prec:<10.4f} | {mean_recall:<8.4f} | {mean_f1:<8.4f} | {elapsed_time:<8.2f}")

        except Exception as e:
            print(f"[ERROR] Model '{name}' failed during tournament: {e}")
            tournament_rows.append({
                "model": name,
                "accuracy": 0.0,
                "precision": 0.0,
                "recall": 0.0,
                "f1": 0.0,
                "roc_auc": 0.0,
                "cv_roc_auc_mean": 0.0,
                "cv_roc_auc_std": 0.0,
                "training_time": 0.0,
            })

    print("-" * 88)

    # Sort results primarily by cv_roc_auc_mean descending, secondary by f1
    results_df = pd.DataFrame(tournament_rows)
    results_df = results_df.sort_values(
        by=["cv_roc_auc_mean", "f1"],
        ascending=[False, False],
    ).reset_index(drop=True)

    return results_df, pipelines, cv_raw_scores


def evaluate_final_model(
    winning_pipeline: Pipeline,
    X_train: pd.DataFrame,
    y_train: pd.Series,
    X_test: pd.DataFrame,
    y_test: pd.Series,
) -> Dict[str, Any]:
    """
    Fits the winning pipeline on the full training set (80%), then evaluates
    once on the untouched test set (20%).
    """
    start_fit = time.perf_counter()
    winning_pipeline.fit(X_train, y_train)
    fit_duration = time.perf_counter() - start_fit

    # Predict hard labels
    y_pred = winning_pipeline.predict(X_test)

    # Predict probabilities for conversion class (1)
    if hasattr(winning_pipeline, "predict_proba"):
        y_prob = winning_pipeline.predict_proba(X_test)[:, 1]
    elif hasattr(winning_pipeline, "decision_function"):
        decision = winning_pipeline.decision_function(X_test)
        # Min-max scale decision function to [0, 1] if predict_proba is unavailable
        y_prob = (decision - decision.min()) / (decision.max() - decision.min() + 1e-9)
    else:
        y_prob = y_pred.astype(float)

    # Compute final metrics on untouched test set
    test_accuracy = float(accuracy_score(y_test, y_pred))
    test_precision = float(precision_score(y_test, y_pred, zero_division=0))
    test_recall = float(recall_score(y_test, y_pred, zero_division=0))
    test_f1 = float(f1_score(y_test, y_pred, zero_division=0))
    test_roc_auc = float(roc_auc_score(y_test, y_prob))
    brier_score = float(brier_score_loss(y_test, y_prob))
    cm = confusion_matrix(y_test, y_pred)
    clf_report = classification_report(y_test, y_pred, digits=4)

    return {
        "test_accuracy": round(test_accuracy, 4),
        "test_precision": round(test_precision, 4),
        "test_recall": round(test_recall, 4),
        "test_f1": round(test_f1, 4),
        "test_roc_auc": round(test_roc_auc, 4),
        "brier_score": round(brier_score, 4),
        "confusion_matrix": cm,
        "classification_report": clf_report,
        "y_pred": y_pred,
        "y_prob": y_prob,
        "fit_duration": round(fit_duration, 2),
    }


def compute_feature_importance(
    winning_pipeline: Pipeline,
    X_test: pd.DataFrame,
    y_test: pd.Series,
) -> pd.DataFrame:
    """
    Extracts feature importances mapped back to human-readable transformed feature names.
    Falls back to permutation importance if feature_importances_ is unavailable.
    """
    preprocessor = winning_pipeline.named_steps["preprocessor"]
    clf = winning_pipeline.named_steps["classifier"]
    feature_names = get_preprocessed_feature_names(preprocessor)

    importances = None

    if hasattr(clf, "feature_importances_"):
        importances = clf.feature_importances_
    elif hasattr(clf, "coef_"):
        coef = clf.coef_
        if coef.ndim > 1:
            importances = np.abs(coef[0])
        else:
            importances = np.abs(coef)
    else:
        # Use permutation importance on transformed test set
        X_test_trans = preprocessor.transform(X_test)
        perm = permutation_importance(
            clf,
            X_test_trans,
            y_test,
            n_repeats=5,
            random_state=RANDOM_SEED,
            scoring="roc_auc",
        )
        importances = perm.importances_mean

    # Safe fallback if lengths mismatch
    if len(importances) != len(feature_names):
        feature_names = [f"feature_{i}" for i in range(len(importances))]

    fi_df = pd.DataFrame({
        "feature": feature_names,
        "importance": importances,
    })

    # Sort descending
    fi_df = fi_df.sort_values(by="importance", ascending=False).reset_index(drop=True)
    fi_df["importance"] = fi_df["importance"].round(6)
    return fi_df


def save_confusion_matrix_plot(
    cm: np.ndarray,
    model_name: str,
    acc: float,
    f1: float,
    output_path: Path,
) -> None:
    """
    Generates a clean, professional confusion matrix visual plot.
    """
    fig, ax = plt.subplots(figsize=(6.5, 5.5), dpi=300)
    
    # Styled theme matching LeadLens dark/navy aesthetic
    fig.patch.set_facecolor("#0F172A")
    ax.set_facecolor("#1E293B")

    im = ax.imshow(cm, interpolation="nearest", cmap="Blues")
    cbar = fig.colorbar(im, ax=ax, fraction=0.046, pad=0.04)
    cbar.ax.tick_params(colors="#94A3B8")

    classes = ["Not Converted (0)", "Converted (1)"]
    tick_marks = np.arange(len(classes))
    ax.set_xticks(tick_marks)
    ax.set_yticks(tick_marks)
    ax.set_xticklabels(classes, fontsize=11, color="#E2E8F0", fontweight="500")
    ax.set_yticklabels(classes, fontsize=11, color="#E2E8F0", fontweight="500")

    # Annotate cells with counts and percentages
    total = np.sum(cm)
    thresh = cm.max() / 2.0
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            count = cm[i, j]
            pct = (count / total) * 100
            text_color = "white" if count > thresh else "#0F172A"
            ax.text(
                j,
                i,
                f"{count:,}\n({pct:.1f}%)",
                ha="center",
                va="center",
                color=text_color,
                fontsize=13,
                fontweight="bold",
            )

    ax.set_ylabel("Actual Label", fontsize=12, color="#94A3B8", fontweight="600")
    ax.set_xlabel("Predicted Label", fontsize=12, color="#94A3B8", fontweight="600")
    ax.set_title(
        f"LeadLens - Final Confusion Matrix (Test Set, N={total:,})\nWinner: {model_name} | Accuracy: {acc*100:.1f}% | F1: {f1:.4f}",
        fontsize=12,
        color="#F8FAFC",
        pad=15,
        fontweight="bold",
    )

    for spine in ax.spines.values():
        spine.set_edgecolor("#334155")

    plt.tight_layout()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output_path, facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close(fig)


def save_calibration_plot(
    y_test: pd.Series,
    y_prob: np.ndarray,
    model_name: str,
    brier: float,
    roc_auc: float,
    output_path: Path,
) -> None:
    """
    Generates a professional probability calibration curve plot.
    """
    prob_true, prob_pred = calibration_curve(y_test, y_prob, n_bins=10, strategy="uniform")

    fig, (ax1, ax2) = plt.subplots(
        nrows=2,
        ncols=1,
        figsize=(7, 7.5),
        dpi=300,
        gridspec_kw={"height_ratios": [3, 1]},
    )

    fig.patch.set_facecolor("#0F172A")
    ax1.set_facecolor("#1E293B")
    ax2.set_facecolor("#1E293B")

    # Calibration Curve (Upper panel)
    ax1.plot([0, 1], [0, 1], linestyle="--", color="#64748B", label="Perfect Calibration (y=x)", linewidth=1.5)
    ax1.plot(
        prob_pred,
        prob_true,
        marker="o",
        color="#38BDF8",
        linewidth=2.5,
        markersize=7,
        label=f"{model_name} (Brier: {brier:.4f}, AUC: {roc_auc:.4f})",
    )

    ax1.set_ylabel("Fraction of Positives", fontsize=11, color="#94A3B8", fontweight="600")
    ax1.set_title(
        f"LeadLens - Probability Calibration Curve\nModel: {model_name} | Brier Score = {brier:.4f}",
        fontsize=12,
        color="#F8FAFC",
        pad=12,
        fontweight="bold",
    )
    ax1.tick_params(colors="#94A3B8")
    ax1.grid(True, linestyle=":", alpha=0.3, color="#64748B")
    legend1 = ax1.legend(loc="upper left", facecolor="#0F172A", edgecolor="#334155", labelcolor="#F1F5F9", fontsize=10)

    for spine in ax1.spines.values():
        spine.set_edgecolor("#334155")

    # Prediction Distribution Histogram (Lower panel)
    ax2.hist(y_prob, bins=20, color="#0EA5E9", edgecolor="#0284C7", alpha=0.85)
    ax2.set_xlabel("Predicted Conversion Probability", fontsize=11, color="#94A3B8", fontweight="600")
    ax2.set_ylabel("Count", fontsize=11, color="#94A3B8", fontweight="600")
    ax2.tick_params(colors="#94A3B8")
    ax2.grid(True, linestyle=":", alpha=0.3, color="#64748B")

    for spine in ax2.spines.values():
        spine.set_edgecolor("#334155")

    plt.tight_layout()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output_path, facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close(fig)


def main():
    """Main execution orchestrator for Phase 3.2 Model Tournament."""
    print("=" * 88)
    print("LEADLENS - PHASE 3.2: MODEL TOURNAMENT & TRAINING")
    print("=" * 88)

    # 1. DATASET
    print("\n[1/8] DATASET")
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at {DATASET_PATH}. Please generate it first.")

    df = pd.read_csv(DATASET_PATH)
    total_rows = len(df)
    conv_count = int(df[TARGET_COLUMN].sum())
    conv_rate = (conv_count / total_rows) * 100

    print(f"  • Source Path:       {DATASET_PATH}")
    print(f"  • Total Leads:       {total_rows:,} rows")
    print(f"  • Total Features:    {len(ALL_FEATURES)} features (5 numerical, 11 categorical)")
    print(f"  • Converted Leads:   {conv_count:,} ({conv_rate:.2f}%)")
    print(f"  • Non-Converted:     {total_rows - conv_count:,} ({100 - conv_rate:.2f}%)")

    # 2. TRAIN / TEST SPLIT
    print("\n[2/8] TRAIN / TEST SPLIT")
    X_train, X_test, y_train, y_test = split_data(
        df=df,
        test_size=TEST_SIZE,
        random_state=RANDOM_SEED,
        stratify=True,
    )

    # Safeguards verification
    verify_data_leakage_safeguards(df, X_train, X_test, y_train, y_test)

    train_conv = int(y_train.sum())
    test_conv = int(y_test.sum())

    print(f"  • Split Ratio:       80% Train ({len(X_train):,} rows) / 20% Test ({len(X_test):,} rows)")
    print(f"  • Train Classes:     0: {len(y_train) - train_conv:,} ({(1 - y_train.mean())*100:.2f}%) | 1: {train_conv:,} ({y_train.mean()*100:.2f}%)")
    print(f"  • Test Classes:      0: {len(y_test) - test_conv:,} ({(1 - y_test.mean())*100:.2f}%) | 1: {test_conv:,} ({y_test.mean()*100:.2f}%)")
    print("  • Leakage Checks:    PASSED (lead_id removed, target separated, disjoint indices)")

    # 3. MODEL TOURNAMENT
    print("\n[3/8] MODEL TOURNAMENT (5-Fold Stratified Cross-Validation on Training Set)")
    print(f"  • CV Strategy:       StratifiedKFold(n_splits=5, shuffle=True, random_state={RANDOM_SEED})")
    print(f"  • Primary Metric:    CV ROC-AUC (descending)")
    print(f"  • Pipeline:          Pipeline(preprocessing, classifier) per fold\n")

    results_df, candidate_pipelines, cv_raw_scores = run_tournament(X_train, y_train)

    # Save tournament results CSV
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    results_df.to_csv(TOURNAMENT_RESULTS_PATH, index=False)
    print(f"\n  • Tournament Results Saved: {TOURNAMENT_RESULTS_PATH}")

    # 4. WINNER SELECTION
    print("\n[4/8] WINNER SELECTION")
    winner_row = results_df.iloc[0]
    winner_name = str(winner_row["model"])
    winner_cv_auc = float(winner_row["cv_roc_auc_mean"])
    winner_cv_std = float(winner_row["cv_roc_auc_std"])

    print(f"  • Winning Model:     {winner_name}")
    print(f"  • CV ROC-AUC:        {winner_cv_auc:.4f} ± {winner_cv_std:.4f}")
    print(f"  • CV Accuracy:       {winner_row['accuracy']:.4f}")
    print(f"  • CV F1 Score:       {winner_row['f1']:.4f}")
    print(f"  • CV Precision:      {winner_row['precision']:.4f}")
    print(f"  • CV Recall:         {winner_row['recall']:.4f}")

    # 5. FINAL TEST EVALUATION
    print("\n[5/8] FINAL TEST EVALUATION (Evaluated ONCE on untouched 20% test set)")
    winning_pipeline = candidate_pipelines[winner_name]
    final_eval = evaluate_final_model(
        winning_pipeline=winning_pipeline,
        X_train=X_train,
        y_train=y_train,
        X_test=X_test,
        y_test=y_test,
    )

    print(f"  • Test Accuracy:     {final_eval['test_accuracy']:.4f}")
    print(f"  • Test Precision:    {final_eval['test_precision']:.4f}")
    print(f"  • Test Recall:       {final_eval['test_recall']:.4f}")
    print(f"  • Test F1 Score:     {final_eval['test_f1']:.4f}")
    print(f"  • Test ROC-AUC:      {final_eval['test_roc_auc']:.4f}")
    print(f"  • Fit Duration:      {final_eval['fit_duration']} seconds")
    print("\n  Classification Report (Test Set):")
    for line in final_eval["classification_report"].split("\n"):
        if line.strip():
            print(f"    {line}")

    # 6. PROBABILITY QUALITY & CALIBRATION
    print("\n[6/8] PROBABILITY QUALITY & CALIBRATION")
    brier = final_eval["brier_score"]
    print(f"  • Brier Score:       {brier:.4f} (lower is better; < 0.15 indicates sharp, accurate calibration)")

    save_confusion_matrix_plot(
        cm=final_eval["confusion_matrix"],
        model_name=winner_name,
        acc=final_eval["test_accuracy"],
        f1=final_eval["test_f1"],
        output_path=CONFUSION_MATRIX_PATH,
    )
    print(f"  • Confusion Matrix Plot Saved:  {CONFUSION_MATRIX_PATH}")

    save_calibration_plot(
        y_test=y_test,
        y_prob=final_eval["y_prob"],
        model_name=winner_name,
        brier=brier,
        roc_auc=final_eval["test_roc_auc"],
        output_path=CALIBRATION_CURVE_PATH,
    )
    print(f"  • Calibration Curve Plot Saved: {CALIBRATION_CURVE_PATH}")

    # 7. FEATURE IMPORTANCE / EXPLAINABILITY
    print("\n[7/8] FEATURE IMPORTANCE & EXPLAINABILITY")
    fi_df = compute_feature_importance(winning_pipeline, X_test, y_test)
    fi_df.to_csv(FEATURE_IMPORTANCE_PATH, index=False)
    print(f"  • Feature Importance Saved:     {FEATURE_IMPORTANCE_PATH}")
    print("  • Top 10 Influential Features:")
    for idx, row in fi_df.head(10).iterrows():
        print(f"    {idx+1:>2}. {row['feature']:<30} | {row['importance']:.6f}")

    # 8. ARTIFACTS & METADATA
    print("\n[8/8] MODEL ARTIFACTS & METADATA")
    # Save complete production pipeline
    joblib.dump(winning_pipeline, BEST_MODEL_PATH)
    print(f"  • Model Pipeline Saved:         {BEST_MODEL_PATH}")

    # Build and save metadata
    fitted_preprocessor = winning_pipeline.named_steps["preprocessor"]
    encoded_feature_names = get_preprocessed_feature_names(fitted_preprocessor)

    metadata = {
        "model_name": winner_name,
        "model_version": MODEL_VERSION,
        "training_date": datetime.now(timezone.utc).isoformat(),
        "random_seed": RANDOM_SEED,
        "dataset_rows": total_rows,
        "train_rows": len(X_train),
        "test_rows": len(X_test),
        "feature_names": ALL_FEATURES,
        "encoded_feature_names": encoded_feature_names,
        "encoded_feature_count": len(encoded_feature_names),
        "target_name": TARGET_COLUMN,
        "cv_roc_auc_mean": winner_cv_auc,
        "cv_roc_auc_std": winner_cv_std,
        "test_accuracy": final_eval["test_accuracy"],
        "test_precision": final_eval["test_precision"],
        "test_recall": final_eval["test_recall"],
        "test_f1": final_eval["test_f1"],
        "test_roc_auc": final_eval["test_roc_auc"],
        "brier_score": brier,
        "confusion_matrix": final_eval["confusion_matrix"].tolist(),
        "dependencies": {
            "scikit-learn": sklearn.__version__,
            "pandas": pd.__version__,
            "numpy": np.__version__,
            "joblib": joblib.__version__,
            "xgboost": XGB_VERSION,
            "matplotlib": matplotlib.__version__,
        },
    }

    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"  • Metadata JSON Saved:          {METADATA_PATH}")

    print("\n" + "=" * 88)
    print("PHASE 3.2 COMPLETED SUCCESSFULLY: ALL TOURNAMENT ARTIFACTS GENERATED")
    print("=" * 88)


if __name__ == "__main__":
    main()
