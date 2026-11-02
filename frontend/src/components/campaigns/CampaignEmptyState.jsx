import React from 'react';
import { Megaphone, Plus } from 'lucide-react';

export default function CampaignEmptyState({
  title = 'No campaigns found',
  description = 'No campaigns match your active search or filters.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="card campaign-empty-box" role="region" aria-label={title}>
      <div className="campaign-empty-icon" aria-hidden="true">
        <Megaphone size={36} />
      </div>
      <h3 className="campaign-empty-title">{title}</h3>
      <p className="campaign-empty-desc">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="btn btn-primary"
          style={{ marginTop: '12px' }}
        >
          <Plus size={14} aria-hidden="true" style={{ marginRight: '6px' }} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
