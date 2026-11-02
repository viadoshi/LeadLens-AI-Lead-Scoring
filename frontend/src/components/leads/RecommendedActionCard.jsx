import React from 'react';
import {
  Zap,
  ArrowRight,
  Mail,
  Calendar,
  FileText,
} from 'lucide-react';

export default function RecommendedActionCard({ lead, onActionClick }) {
  if (!lead) return null;

  return (
    <div className="card recommended-action-card">
      <div className="card-header-row">
        <div className="card-header-title-group">
          <div className="card-header-icon" aria-hidden="true">
            <Zap size={18} />
          </div>
          <div>
            <h2 className="section-heading">Recommended Action</h2>
            <p className="card-header-subtitle">Prescribed next sales play</p>
          </div>
        </div>
      </div>

      <div className="recommended-action-body">
        {/* Main Recommendation Highlight Box */}
        <div className="recommendation-callout-box">
          <div className="recommendation-label">Suggested Play:</div>
          <div className="recommendation-text">{lead.recommendedAction}</div>
          <p className="recommendation-guidance">
            Optimized for maximum conversion velocity based on current priority tier and engagement history.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          className="btn-primary take-action-btn"
          onClick={() =>
            onActionClick({
              message: 'Action workflow coming soon.',
              subtext: `Executing '${lead.recommendedAction}' will be automated in an upcoming CRM integration phase.`,
            })
          }
          aria-label={`Take recommended action: ${lead.recommendedAction}`}
        >
          <span>Take Action</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>

        {/* Quick Contact Action Buttons */}
        <div className="quick-actions-section">
          <div className="quick-actions-label">Direct Sales Actions</div>
          <div className="quick-actions-buttons-grid">
            <button
              type="button"
              className="btn-secondary quick-contact-btn"
              onClick={() =>
                onActionClick({
                  message: 'Email workflow coming soon.',
                  subtext: `Automated email composer for ${lead.email} will connect to your email provider in a future phase.`,
                })
              }
              aria-label={`Email lead ${lead.name}`}
            >
              <Mail size={14} aria-hidden="true" />
              <span>Email Lead</span>
            </button>

            <button
              type="button"
              className="btn-secondary quick-contact-btn"
              onClick={() =>
                onActionClick({
                  message: 'Follow-up scheduler coming soon.',
                  subtext: `Calendar integration for scheduling calls with ${lead.name} will be introduced in an upcoming release.`,
                })
              }
              aria-label={`Schedule follow-up with ${lead.name}`}
            >
              <Calendar size={14} aria-hidden="true" />
              <span>Schedule Follow-up</span>
            </button>

            <button
              type="button"
              className="btn-secondary quick-contact-btn"
              onClick={() =>
                onActionClick({
                  message: 'Note editor coming soon.',
                  subtext: `Internal CRM notes for ${lead.company} will be persistent in the database phase.`,
                })
              }
              aria-label={`Add internal note for ${lead.name}`}
            >
              <FileText size={14} aria-hidden="true" />
              <span>Add Note</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
