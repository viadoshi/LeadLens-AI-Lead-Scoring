import React from 'react';
import { Users, Target, TrendingUp, Gauge, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPI_CONFIGS = [
  {
    id: 'total_leads',
    label: 'Total Leads',
    icon: Users,
    getValue: (s) => (s?.total_leads !== undefined ? s.total_leads.toLocaleString() : '—'),
    getDelta: (s) => (s?.leads_growth_pct !== null && s?.leads_growth_pct !== undefined ? s.leads_growth_pct : null),
    deltaSuffix: '% vs prior period',
    description: 'Total inbound & outbound leads captured',
  },
  {
    id: 'converted_leads',
    label: 'Converted Leads',
    icon: Target,
    getValue: (s) => (s?.converted_leads !== undefined ? s.converted_leads.toLocaleString() : '—'),
    getDelta: (s) => (s?.conversions_growth_pct !== null && s?.conversions_growth_pct !== undefined ? s.conversions_growth_pct : null),
    deltaSuffix: '% vs prior period',
    description: 'Leads successfully closed as customers',
  },
  {
    id: 'conversion_rate',
    label: 'Conversion Rate',
    icon: TrendingUp,
    getValue: (s) => (s?.conversion_rate !== undefined ? `${s.conversion_rate.toFixed(2)}%` : '—'),
    getDelta: (s) => (s?.conversion_rate_delta !== null && s?.conversion_rate_delta !== undefined ? s.conversion_rate_delta : null),
    deltaSuffix: ' pts vs prior',
    description: 'Proportion of qualified leads converting',
    isAccent: true,
  },
  {
    id: 'average_lead_score',
    label: 'Average Lead Score',
    icon: Gauge,
    getValue: (s) => (s?.average_lead_score !== undefined ? `${s.average_lead_score.toFixed(1)} / 100` : '—'),
    getDelta: () => null,
    description: 'Mean AI quality score across active pipeline',
  },
];

export default function AnalyticsKPICard({ summary }) {
  if (!summary) return null;

  return (
    <div className="analytics-kpi-grid" role="region" aria-label="Pipeline Performance Summary KPIs">
      {KPI_CONFIGS.map((cfg) => {
        const IconComponent = cfg.icon;
        const val = cfg.getValue(summary);
        const delta = cfg.getDelta(summary);
        const hasDelta = delta !== null && delta !== undefined;
        const isPositive = delta > 0;
        const isNegative = delta < 0;

        return (
          <div
            key={cfg.id}
            className={`card analytics-kpi-card ${cfg.isAccent ? 'analytics-kpi-accent' : ''}`}
          >
            <div className="analytics-kpi-header">
              <span className="analytics-kpi-label">{cfg.label}</span>
              <div className="analytics-kpi-icon" aria-hidden="true">
                <IconComponent size={18} />
              </div>
            </div>

            <div className="analytics-kpi-metric-row">
              <span className="analytics-kpi-value">{val}</span>
              {hasDelta && (
                <span
                  className={`analytics-kpi-delta ${
                    isPositive ? 'analytics-delta-up' : isNegative ? 'analytics-delta-down' : 'analytics-delta-neutral'
                  }`}
                  title={`${isPositive ? '+' : ''}${delta}${cfg.deltaSuffix}`}
                >
                  {isPositive ? <ArrowUpRight size={13} aria-hidden="true" /> : <ArrowDownRight size={13} aria-hidden="true" />}
                  <span>
                    {isPositive ? '+' : ''}
                    {delta}
                    {cfg.deltaSuffix}
                  </span>
                </span>
              )}
            </div>

            <p className="analytics-kpi-subtext">{cfg.description}</p>
          </div>
        );
      })}
    </div>
  );
}
