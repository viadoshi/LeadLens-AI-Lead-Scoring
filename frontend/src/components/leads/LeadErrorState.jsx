import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function LeadErrorState({ onRetry }) {
  return (
    <div className="card leads-error-state-card" role="alert">
      <div className="error-state-icon-box" aria-hidden="true">
        <AlertCircle size={32} />
      </div>
      <h3 className="section-heading" style={{ marginTop: '14px', color: 'var(--text-primary)' }}>
        Unable to load leads.
      </h3>
      <p className="body-text" style={{ maxWidth: '420px', margin: '8px auto 20px auto' }}>
        A communication error occurred while retrieving lead intelligence records. Please verify your connection and try again.
      </p>
      {onRetry && (
        <button
          type="button"
          className="btn-primary"
          onClick={onRetry}
          aria-label="Retry loading leads"
        >
          <RefreshCw size={14} aria-hidden="true" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
