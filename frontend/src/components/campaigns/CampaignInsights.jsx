import React from 'react';
import { Sparkles, Award, Zap, TrendingUp, ShieldCheck, Target } from 'lucide-react';

const TYPE_ICONS = {
  positive: Award,
  opportunity: Zap,
  trend: TrendingUp,
  neutral: ShieldCheck,
};

export default function CampaignInsights({ insights = [] }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="card campaign-card" role="region" aria-label="Campaign LeadLens Insights">
      <div className="campaign-card-header">
        <div>
          <div className="campaign-card-title-row">
            <Sparkles size={16} className="campaign-icon-gold" aria-hidden="true" />
            <h2 className="section-heading">LeadLens Insights</h2>
          </div>
          <p className="body-text">Automated, data-supported program performance telemetry</p>
        </div>
      </div>

      <div className="analytics-insights-list" role="list">
        {insights.map((item) => {
          const IconComp = TYPE_ICONS[item.type] || Target;
          return (
            <div
              key={item.id}
              className={`analytics-insight-item insight-type-${item.type}`}
              role="listitem"
            >
              <div className="analytics-insight-icon-box" aria-hidden="true">
                <IconComp size={15} />
              </div>
              <div className="analytics-insight-body">
                <div className="analytics-insight-header-row">
                  <h3 className="analytics-insight-title">{item.title}</h3>
                  {item.metric_value && (
                    <span className="analytics-insight-badge">{item.metric_value}</span>
                  )}
                </div>
                <p className="analytics-insight-desc">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="analytics-card-footer-note">
        <Sparkles size={13} aria-hidden="true" />
        <span>
          Data-supported performance telemetry calculated from campaign lead distribution. Does not imply causation.
        </span>
      </div>
    </div>
  );
}
