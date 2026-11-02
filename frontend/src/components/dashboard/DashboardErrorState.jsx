import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function DashboardErrorState({ onRetry }) {
  return (
    <div className="card dashboard-error-state-card" role="alert">
      <div className="error-state-icon-box" aria-hidden="true">
        <AlertCircle size={32} />
      </div>
      <h3 className="section-heading" style={{ marginTop: '14px', color: 'var(--text-primary)' }}>
        Unable to load dashboard data.
      </h3>
      <p className="body-text" style={{ maxWidth: '440px', margin: '8px auto 20px auto' }}>
        An error occurred while connecting to the analytics intelligence service. Please check your network connection and try again.
      </p>
      {onRetry && (
        <button
          type="button"
          className="btn-primary"
          onClick={onRetry}
          aria-label="Retry loading dashboard data"
        >
          <RefreshCw size={15} aria-hidden="true" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
