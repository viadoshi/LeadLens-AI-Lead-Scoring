import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, UserX, ArrowLeft, RefreshCw } from 'lucide-react';

export default function LeadDetailsErrorState({ isNotFound = false, onRetry }) {
  const navigate = useNavigate();

  if (isNotFound) {
    return (
      <div className="card lead-details-error-card" role="status" aria-live="polite">
        <div className="error-state-icon-box not-found" aria-hidden="true">
          <UserX size={36} />
        </div>

        <h2 className="section-heading error-title">Lead Not Found</h2>

        <p className="body-text error-subtitle">
          We couldn't find a lead with this ID.
        </p>

        <div className="error-actions-row">
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/leads')}
            aria-label="Back to Leads list"
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <span>Back to Leads</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card lead-details-error-card" role="alert">
      <div className="error-state-icon-box" aria-hidden="true">
        <AlertCircle size={36} />
      </div>

      <h2 className="section-heading error-title">Unable to load lead details.</h2>

      <p className="body-text error-subtitle">
        An unexpected error occurred while loading this lead record. Please verify your connection or try again.
      </p>

      <div className="error-actions-row">
        {onRetry && (
          <button
            type="button"
            className="btn-primary"
            onClick={onRetry}
            aria-label="Try reloading lead details"
          >
            <RefreshCw size={15} aria-hidden="true" />
            <span>Try Again</span>
          </button>
        )}
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate('/leads')}
          aria-label="Return to leads table"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Back to Leads</span>
        </button>
      </div>
    </div>
  );
}
