import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function PredictionErrorState({ errorMessage, onRetry, isSubmitting = false }) {
  return (
    <div className="card predict-empty-card predict-error-card" role="alert" aria-live="polite">
      <div className="predict-empty-icon-box error-icon-box" aria-hidden="true">
        <AlertTriangle size={32} className="predict-empty-icon text-error" />
      </div>

      <h3 className="empty-title">Unable to generate a prediction right now.</h3>

      <p className="empty-description">
        {errorMessage || 'Make sure the LeadLens AI service is running and try again.'}
      </p>

      <div className="predict-error-action-row" style={{ marginTop: '1.25rem' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={onRetry}
          disabled={isSubmitting}
          aria-label="Retry lead prediction"
        >
          <RotateCcw size={14} className={isSubmitting ? 'spinning-icon' : ''} aria-hidden="true" />
          <span>{isSubmitting ? 'Retrying Prediction...' : 'Try Again'}</span>
        </button>
      </div>
    </div>
  );
}
