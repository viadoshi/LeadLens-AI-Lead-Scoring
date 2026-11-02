import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';

export default function RecommendedNextStep({ recommendedAction, onTakeAction }) {
  if (!recommendedAction) return null;

  return (
    <div className="predict-next-step-section">
      <div className="next-step-header">
        <Zap size={16} className="next-step-icon" aria-hidden="true" />
        <h3 className="next-step-title">Recommended Next Step</h3>
      </div>

      <div className="next-step-callout">
        <div className="next-step-action-text">{recommendedAction}</div>
        <p className="next-step-guidance">
          Prescribed sales cadence calculated to maximize conversion speed for this lead profile.
        </p>

        <button
          type="button"
          className="btn-primary take-action-btn"
          onClick={() =>
            onTakeAction({
              message: 'Action workflow coming soon.',
              subtext: `Automated execution of '${recommendedAction}' will connect to CRM services during backend integration.`,
            })
          }
          aria-label={`Take action: ${recommendedAction}`}
        >
          <span>Take Action</span>
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
