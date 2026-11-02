import React from 'react';
import { Inbox } from 'lucide-react';

export default function DashboardEmptyState({
  title = 'No lead data available yet.',
  description = 'Once inbound leads are ingested from your active campaigns or CRM connectors, real-time conversion intelligence will appear here.',
  action,
}) {
  return (
    <div className="card dashboard-empty-state-card" role="status">
      <div className="empty-state-icon-box" aria-hidden="true">
        <Inbox size={32} />
      </div>
      <h3 className="section-heading" style={{ marginTop: '14px' }}>
        {title}
      </h3>
      <p className="body-text" style={{ maxWidth: '440px', margin: '8px auto 20px auto' }}>
        {description}
      </p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
