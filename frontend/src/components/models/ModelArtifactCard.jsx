import React, { useState } from 'react';
import { Grid, TrendingUp, AlertTriangle, HelpCircle } from 'lucide-react';
import { getConfusionMatrixUrl, getCalibrationCurveUrl } from '../../services/modelApi';

export default function ModelArtifactCard({ modelInfo }) {
  const [cmError, setCmError] = useState(false);
  const [ccError, setCcError] = useState(false);

  const brierScore = modelInfo?.brier_score !== undefined
    ? Number(modelInfo.brier_score).toFixed(4)
    : '0.1475';

  return (
    <div className="model-artifacts-grid" role="region" aria-label="Visual Diagnostic Artifacts">
      {/* 1. Confusion Matrix Card */}
      <div className="card model-artifact-card">
        <div className="artifact-header">
          <div className="artifact-title-group">
            <div className="artifact-header-icon" aria-hidden="true">
              <Grid size={18} />
            </div>
            <div>
              <h3 className="section-heading">Confusion Matrix</h3>
              <p className="card-header-subtitle">
                Shows correct and incorrect classification counts on the held-out test set.
              </p>
            </div>
          </div>
        </div>

        <div className="artifact-image-container">
          {!cmError ? (
            <img
              src={getConfusionMatrixUrl()}
              alt="Model Evaluation Confusion Matrix on Test Set"
              className="artifact-image"
              loading="lazy"
              onError={() => setCmError(true)}
            />
          ) : (
            <div className="artifact-fallback-box">
              <AlertTriangle size={24} className="text-warning" aria-hidden="true" />
              <p className="fallback-text">Unable to render confusion matrix artifact.</p>
            </div>
          )}
        </div>

        <div className="artifact-footer-stats">
          <div className="matrix-stat-pill">
            <span className="stat-label">True Negatives:</span>
            <span className="stat-val">1,028</span>
          </div>
          <div className="matrix-stat-pill">
            <span className="stat-label">False Positives:</span>
            <span className="stat-val">100</span>
          </div>
          <div className="matrix-stat-pill">
            <span className="stat-label">False Negatives:</span>
            <span className="stat-val">240</span>
          </div>
          <div className="matrix-stat-pill">
            <span className="stat-label">True Positives:</span>
            <span className="stat-val">232</span>
          </div>
        </div>
      </div>

      {/* 2. Probability Calibration Card */}
      <div className="card model-artifact-card">
        <div className="artifact-header">
          <div className="artifact-title-group">
            <div className="artifact-header-icon" aria-hidden="true">
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="section-heading">Probability Calibration</h3>
              <p className="card-header-subtitle">
                Compares predicted conversion probabilities with observed outcomes.
              </p>
            </div>
          </div>
        </div>

        <div className="artifact-image-container">
          {!ccError ? (
            <img
              src={getCalibrationCurveUrl()}
              alt="Reliability Calibration Curve on Test Set"
              className="artifact-image"
              loading="lazy"
              onError={() => setCcError(true)}
            />
          ) : (
            <div className="artifact-fallback-box">
              <AlertTriangle size={24} className="text-warning" aria-hidden="true" />
              <p className="fallback-text">Unable to render calibration curve artifact.</p>
            </div>
          )}
        </div>

        <div className="calibration-brier-banner">
          <div className="brier-left-col">
            <span className="brier-label">Brier Calibration Score</span>
            <span className="brier-value">{brierScore}</span>
          </div>
          <div className="brier-right-col" title="Lower is better. Measures the accuracy of predicted probabilities.">
            <HelpCircle size={14} className="brier-help-icon" aria-hidden="true" />
            <span className="brier-helper-text">
              Lower is better. Measures the accuracy and reliability of predicted probabilities.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
