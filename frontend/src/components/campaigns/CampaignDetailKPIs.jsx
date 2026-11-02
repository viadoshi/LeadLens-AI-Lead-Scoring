import React from 'react';
import { Users, Target, TrendingUp, Gauge, Calendar, DollarSign, User } from 'lucide-react';

export default function CampaignDetailKPIs({ campaign }) {
  if (!campaign) return null;

  const formattedBudget = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(campaign.budget || 0);

  const kpis = [
    {
      id: 'leads',
      label: 'Campaign Leads',
      value: campaign.total_leads.toLocaleString(),
      icon: Users,
    },
    {
      id: 'converted',
      label: 'Converted Leads',
      value: campaign.converted_leads.toLocaleString(),
      icon: Target,
    },
    {
      id: 'rate',
      label: 'Conversion Rate',
      value: `${campaign.conversion_rate.toFixed(1)}%`,
      icon: TrendingUp,
      isAccent: true,
    },
    {
      id: 'score',
      label: 'Average Lead Score',
      value: campaign.total_leads > 0 ? `${campaign.average_score.toFixed(1)} / 100` : 'N/A',
      icon: Gauge,
    },
  ];

  return (
    <div className="card campaign-hero-kpi-card" role="region" aria-label="Campaign Headline Performance">
      {/* 4 Metric Cards */}
      <div className="campaign-kpi-row">
        {kpis.map((k) => {
          const IconComp = k.icon;
          return (
            <div key={k.id} className={`campaign-kpi-item ${k.isAccent ? 'kpi-accent' : ''}`}>
              <div className="campaign-kpi-top">
                <span className="campaign-kpi-title">{k.label}</span>
                <IconComp size={16} className="campaign-kpi-icon" aria-hidden="true" />
              </div>
              <div className="campaign-kpi-num">{k.value}</div>
            </div>
          );
        })}
      </div>

      {/* Compact Metadata Strip */}
      <div className="campaign-metadata-strip">
        <div className="campaign-meta-chip">
          <DollarSign size={13} aria-hidden="true" />
          <span>Budget: <strong>{formattedBudget}</strong></span>
        </div>

        <div className="campaign-meta-chip">
          <User size={13} aria-hidden="true" />
          <span>Owner: <strong>{campaign.owner}</strong></span>
        </div>

        <div className="campaign-meta-chip">
          <Calendar size={13} aria-hidden="true" />
          <span>
            Dates: <strong>{campaign.start_date}</strong> {campaign.end_date ? `to ${campaign.end_date}` : '(Ongoing)'}
          </span>
        </div>
      </div>
    </div>
  );
}
