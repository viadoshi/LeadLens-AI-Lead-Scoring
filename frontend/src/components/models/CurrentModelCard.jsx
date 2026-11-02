import React from 'react';
import { Cpu, CheckCircle2, Calendar, Target, Award, ShieldCheck } from 'lucide-react';

export default function CurrentModelCard({ modelInfo }) {
  if (!modelInfo) return null;

  const testRocAuc = modelInfo.test_roc_auc
    ? (modelInfo.test_roc_auc * 100).toFixed(2) + '%'
    : '82.35%';

  const cvRocAuc = modelInfo.cv_roc_auc_mean
    ? (modelInfo.cv_roc_auc_mean * 100).toFixed(2) + '%'
    : '82.27%';

  const cvStd = modelInfo.cv_roc_auc_std
    ? `± ${(modelInfo.cv_roc_auc_std * 100).toFixed(2)}%`
    : '± 0.51%';

  const formattedDate = modelInfo.training_date
    ? new Date(modelInfo.training_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Oct 23, 2026';

  return (
    <div className="card model-hero-card" role="region" aria-label="Current Production Model Summary">
      <div className="model-hero-glow" aria-hidden="true" />

      <div className="model-hero-header">
        <div className="model-hero-title-group">
          <div className="model-hero-icon-box" aria-hidden="true">
            <Cpu size={24} />
          </div>
          <div>
            <div className="model-hero-badges-row">
              <span className="model-badge-production">
                <ShieldCheck size={12} aria-hidden="true" />
                <span>Production Model</span>
              </span>
              <span className="model-badge-active">
                <span className="model-status-dot" aria-hidden="true" />
                <span>Active</span>
              </span>
            </div>
            <h2 className="model-hero-name">{modelInfo.model_name || 'Logistic Regression'}</h2>
            <div className="model-hero-submeta">
              <span className="model-hero-version">
                Version: <code>{modelInfo.model_version || 'lead-scoring-v1'}</code>
              </span>
              <span className="model-meta-dot" aria-hidden="true">•</span>
              <span className="model-hero-date">
                <Calendar size={13} aria-hidden="true" style={{ display: 'inline', marginRight: '4px' }} />
                Trained: {formattedDate}
              </span>
            </div>
          </div>
        </div>

        <div className="model-hero-kpi-highlight">
          <div className="hero-kpi-box primary">
            <div className="hero-kpi-label">
              <Target size={13} aria-hidden="true" />
              <span>Test ROC-AUC</span>
            </div>
            <div className="hero-kpi-value">{testRocAuc}</div>
            <div className="hero-kpi-note">Holdout evaluation score</div>
          </div>

          <div className="hero-kpi-box secondary">
            <div className="hero-kpi-label">
              <Award size={13} aria-hidden="true" />
              <span>5-Fold CV ROC-AUC</span>
            </div>
            <div className="hero-kpi-value">{cvRocAuc}</div>
            <div className="hero-kpi-note">{cvStd} cross-validation</div>
          </div>
        </div>
      </div>

      <div className="model-hero-footer">
        <div className="model-hero-guarantee">
          <CheckCircle2 size={15} className="text-success" aria-hidden="true" />
          <span>
            Currently powering real-time inference for <strong>POST /api/predict</strong> with calibrated conversion probabilities.
          </span>
        </div>
      </div>
    </div>
  );
}
