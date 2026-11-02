import React from 'react';
import { Gauge, Info } from 'lucide-react';

const BUCKET_COLORS = {
  '0-19': 'analytics-dist-fill-vlow',
  '20-39': 'analytics-dist-fill-cold',
  '40-59': 'analytics-dist-fill-nurture',
  '60-79': 'analytics-dist-fill-warm',
  '80-100': 'analytics-dist-fill-hot',
};

export default function LeadScoreDistribution({ distribution = [] }) {
  const totalInBuckets = distribution.reduce((sum, b) => sum + b.count, 0);

  return (
    <div className="card analytics-card" role="region" aria-label="Lead Score Distribution">
      <div className="analytics-card-header">
        <div>
          <div className="analytics-card-title-row">
            <Gauge size={18} className="analytics-icon-gold" aria-hidden="true" />
            <h2 className="section-heading">Lead Score Distribution</h2>
          </div>
          <p className="body-text">Pipeline qualification density across score brackets</p>
        </div>
      </div>

      <div className="analytics-dist-list" role="list">
        {distribution.map((b) => {
          const fillClass = BUCKET_COLORS[b.bucket] || 'analytics-fill-gold';
          const maxCount = Math.max(...distribution.map((d) => d.count), 1);
          const widthPct = Math.min(100, Math.max(6, (b.count / maxCount) * 100));

          return (
            <div key={b.bucket} className="analytics-dist-row" role="listitem">
              <div className="analytics-dist-label-row">
                <span className="analytics-dist-range">{b.range_label}</span>
                <div className="analytics-dist-meta">
                  <span className="analytics-dist-count">{b.count.toLocaleString()} leads</span>
                  <span className="analytics-dist-pct">({b.percentage.toFixed(1)}%)</span>
                </div>
              </div>

              <div className="analytics-bar-track" aria-hidden="true">
                <div
                  className={`analytics-bar-fill ${fillClass}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="analytics-card-footer-note">
        <Info size={13} aria-hidden="true" />
        <span>
          Total evaluated pipeline: <strong>{totalInBuckets.toLocaleString()}</strong> leads. Scores 60+ represent immediate sales readiness.
        </span>
      </div>
    </div>
  );
}
