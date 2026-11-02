import React from 'react';
import { BarChart2 } from 'lucide-react';

export default function AnalyticsEmptyState() {
  return (
    <div className="card analytics-empty-card" role="region" aria-label="No analytics data available">
      <div className="analytics-empty-icon" aria-hidden="true">
        <BarChart2 size={36} />
      </div>
      <h3 className="analytics-empty-title">No analytics data available yet</h3>
      <p className="analytics-empty-desc">
        Analytics metrics will appear once leads enter your pipeline and activity is recorded.
      </p>
    </div>
  );
}
