import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function AnalyticsErrorState({ error, onRetry }) {
  return (
    <div className="card analytics-error-card" role="alert" aria-live="assertive">
      <div className="analytics-error-icon-box" aria-hidden="true">
        <AlertCircle size={32} />
      </div>
      <h3 className="analytics-error-title">Analytics unavailable</h3>
      <p className="analytics-error-desc">
        {error || 'Unable to retrieve analytics data right now.'}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-primary analytics-retry-btn"
          aria-label="Retry loading analytics data"
        >
          <RefreshCw size={14} aria-hidden="true" style={{ marginRight: '6px' }} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
