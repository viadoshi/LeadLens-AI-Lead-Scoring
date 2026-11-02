import React from 'react';
import { Megaphone, Activity, Users, TrendingUp } from 'lucide-react';

export default function CampaignSummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      id: 'total-campaigns',
      label: 'Total Campaigns',
      value: summary.total_campaigns.toLocaleString(),
      subtext: 'Configured Glitchreach initiatives',
      icon: Megaphone,
    },
    {
      id: 'active-campaigns',
      label: 'Active Campaigns',
      value: summary.active_campaigns.toLocaleString(),
      subtext: 'Currently generating pipeline',
      icon: Activity,
      isAccent: true,
    },
    {
      id: 'total-leads',
      label: 'Campaign Leads',
      value: summary.total_campaign_leads.toLocaleString(),
      subtext: 'Attributed across active programs',
      icon: Users,
    },
    {
      id: 'avg-conversion-rate',
      label: 'Avg Conversion Rate',
      value: `${summary.average_campaign_conversion_rate.toFixed(1)}%`,
      subtext: 'Macro campaign conversion yield',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="campaign-summary-grid" role="region" aria-label="Campaign Summary Metrics">
      {cards.map((c) => {
        const IconComponent = c.icon;
        return (
          <div
            key={c.id}
            className={`card campaign-summary-card ${c.isAccent ? 'campaign-card-accent' : ''}`}
          >
            <div className="campaign-card-top">
              <span className="campaign-card-label">{c.label}</span>
              <div className="campaign-card-icon-box" aria-hidden="true">
                <IconComponent size={18} />
              </div>
            </div>
            <div className="campaign-card-value">{c.value}</div>
            <p className="campaign-card-subtext">{c.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
