import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function CampaignErrorState({
  title = 'Unable to load campaigns.',
  error,
  onRetry,
  isNotFound = false,
}) {
  return (
    <div className="card campaign-error-box" role="alert" aria-live="assertive">
      <div className="campaign-error-icon" aria-hidden="true">
        <AlertCircle size={32} />
      </div>
      <h3 className="campaign-error-title">{isNotFound ? 'Campaign not found' : title}</h3>
      <p className="campaign-error-desc">
        {error || (isNotFound ? 'The requested campaign identifier does not exist in the Glitchreach workspace.' : 'Unable to retrieve campaign intelligence data.')}
      </p>

      <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
        {isNotFound ? (
          <Link to="/campaigns" className="btn btn-primary">
            <ArrowLeft size={14} aria-hidden="true" style={{ marginRight: '6px' }} />
            <span>Back to Campaigns</span>
          </Link>
        ) : (
          onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="btn btn-primary"
              aria-label="Retry loading campaign data"
            >
              <RefreshCw size={14} aria-hidden="true" style={{ marginRight: '6px' }} />
              <span>Try Again</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
