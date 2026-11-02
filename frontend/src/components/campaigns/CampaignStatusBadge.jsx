import React from 'react';

const STATUS_CONFIGS = {
  active: {
    label: 'Active',
    className: 'campaign-status-active',
  },
  paused: {
    label: 'Paused',
    className: 'campaign-status-paused',
  },
  completed: {
    label: 'Completed',
    className: 'campaign-status-completed',
  },
  draft: {
    label: 'Draft',
    className: 'campaign-status-draft',
  },
  archived: {
    label: 'Archived',
    className: 'campaign-status-archived',
  },
};

export default function CampaignStatusBadge({ status = 'Active', className = '' }) {
  const cleanStatus = (status || 'Active').toLowerCase();
  const config = STATUS_CONFIGS[cleanStatus] || {
    label: status,
    className: 'campaign-status-draft',
  };

  return (
    <span className={`campaign-status-badge ${config.className} ${className}`}>
      <span className="campaign-status-dot" aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
