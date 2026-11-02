import React from 'react';
import { Users, Flame, Zap, Award } from 'lucide-react';

export default function LeadSummaryCards({ leads = [] }) {
  // Dynamically derive summary statistics directly from the current leads dataset
  const totalLeads = leads.length;
  const hotLeads = leads.filter((l) => l.segment === 'HOT').length;
  const warmLeads = leads.filter((l) => l.segment === 'WARM').length;
  const avgScore =
    totalLeads > 0
      ? Math.round(leads.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalLeads)
      : 0;

  const cards = [
    {
      id: 'total-leads',
      label: 'Total Leads',
      metric: totalLeads.toLocaleString(),
      supporting: 'All tracked accounts',
      icon: Users,
    },
    {
      id: 'hot-leads',
      label: 'Hot Leads',
      metric: hotLeads.toLocaleString(),
      supporting: 'Score 80–100 priority',
      icon: Flame,
      isAccent: true,
    },
    {
      id: 'warm-leads',
      label: 'Warm Leads',
      metric: warmLeads.toLocaleString(),
      supporting: 'Score 60–79 active',
      icon: Zap,
    },
    {
      id: 'avg-score',
      label: 'Average Lead Score',
      metric: avgScore,
      supporting: 'Fleet-wide quality score',
      icon: Award,
    },
  ];

  return (
    <div className="leads-summary-grid" aria-label="Lead Summary Metrics">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`card kpi-card ${card.isAccent ? 'kpi-card-accent' : ''}`}
          >
            <div className="kpi-card-header">
              <span className="label-small kpi-label">{card.label}</span>
              <div className={`kpi-icon-wrapper ${card.isAccent ? 'kpi-icon-accent' : ''}`}>
                <IconComponent size={18} aria-hidden="true" />
              </div>
            </div>
            <div className="kpi-card-body">
              <div className="kpi-value">{card.metric}</div>
              <div className="kpi-supporting-text">{card.supporting}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
