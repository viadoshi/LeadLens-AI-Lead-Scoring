import React from 'react';
import { Gauge, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PredictionEmptyState() {
  return (
    <div className="card predict-empty-state-card" role="status">
      <div className="predict-empty-header-row">
        <h2 className="section-heading">AI Lead Score</h2>
        <span className="predict-live-engine-tag" aria-hidden="true">
          <Sparkles size={12} />
          <span>Inference Ready</span>
        </span>
      </div>

      <div className="predict-empty-body">
        <div className="predict-empty-icon-box" aria-hidden="true">
          <Gauge size={38} />
        </div>

        <h3 className="predict-empty-prompt-title">Awaiting Lead Data</h3>

        <p className="predict-empty-prompt-text">
          Enter lead information and run a prediction to see the result.
        </p>

        <div className="predict-empty-feature-pills">
          <div className="feature-pill">
            <CheckCircle2 size={13} aria-hidden="true" />
            <span>Calibrated 0-100 Score</span>
          </div>
          <div className="feature-pill">
            <CheckCircle2 size={13} aria-hidden="true" />
            <span>Conversion Probability</span>
          </div>
          <div className="feature-pill">
            <CheckCircle2 size={13} aria-hidden="true" />
            <span>Prescribed Sales Next Play</span>
          </div>
        </div>
      </div>
    </div>
  );
}
