import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ModelIntelligenceErrorState({ error, onRetry }) {
  return (
    <div className="card model-error-state-card" role="alert" aria-live="polite">
      <div className="model-error-icon-box" aria-hidden="true">
        <AlertTriangle size={36} className="text-warning" />
      </div>

      <h2 className="model-error-title">Model intelligence unavailable</h2>

      <p className="model-error-subtitle">
        Unable to retrieve model evaluation data. Make sure the LeadLens API backend is running and the model artifacts are present.
      </p>

      {error && (
        <div className="model-error-detail-box">
          <code>{error}</code>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={onRetry}
          aria-label="Retry loading model intelligence data"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
