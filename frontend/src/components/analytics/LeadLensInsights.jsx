import React from 'react';
import { Sparkles, TrendingUp, Target, Award, Zap, ShieldCheck } from 'lucide-react';

const TYPE_ICONS = {
  positive: Award,
  opportunity: Zap,
  trend: TrendingUp,
  neutral: ShieldCheck,
};

export default function LeadLensInsights({ insights = [] }) {
  return (
    <div className="card analytics-card" role="region" aria-label="LeadLens Business Insights">
      <div className="analytics-card-header">
        <div>
          <div className="analytics-card-title-row">
            <Sparkles size={18} className="analytics-icon-gold" aria-hidden="true" />
            <h2 className="section-heading">LeadLens Insights</h2>
          </div>
          <p className="body-text">Automated, data-supported pipeline efficiency observations</p>
        </div>
      </div>

      <div className="analytics-insights-list" role="list">
        {insights.map((item) => {
          const IconComponent = TYPE_ICONS[item.type] || Target;

          return (
            <div
              key={item.id}
              className={`analytics-insight-item insight-type-${item.type}`}
              role="listitem"
            >
              <div className="analytics-insight-icon-box" aria-hidden="true">
                <IconComponent size={16} />
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
          Derived from deterministic pipeline metrics. Observations identify high-yield correlations without assuming direct causation.
        </span>
      </div>
    </div>
  );
}
