import React from 'react';
import { Share2, Info } from 'lucide-react';

export default function SourceAnalyticsChart({ sources = [] }) {

  // Find maximum conversion rate for relative bar width calculation
  const maxRate = Math.max(...sources.map((s) => s.conversion_rate), 10);

  return (
    <div className="card analytics-card" role="region" aria-label="Lead Source Performance">
      <div className="analytics-card-header">
        <div>
          <div className="analytics-card-title-row">
            <Share2 size={18} className="analytics-icon-gold" aria-hidden="true" />
            <h2 className="section-heading">Lead Source Performance</h2>
          </div>
          <p className="body-text">Conversion yield and lead generation volume by channel</p>
        </div>
      </div>

      <div className="analytics-source-list" role="list">
        {sources.map((item, idx) => {
          const widthPercent = Math.min(100, Math.max(12, (item.conversion_rate / maxRate) * 100));

          return (
            <div key={item.source} className="analytics-source-row" role="listitem">
              <div className="analytics-source-info-row">
                <div className="analytics-source-name-box">
                  <span className="analytics-source-rank">#{idx + 1}</span>
                  <span className="analytics-source-name">{item.source}</span>
                </div>
                <div className="analytics-source-meta">
                  <span className="analytics-source-volume-badge">
                    {item.total_leads} leads ({item.converted_leads} conv)
                  </span>
                  <span className="analytics-source-rate-val">{item.conversion_rate.toFixed(1)}%</span>
                </div>
              </div>

              <div className="analytics-bar-track" aria-hidden="true">
                <div
                  className="analytics-bar-fill analytics-fill-gold"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              <div className="analytics-source-subdetail">
                <span>Avg Lead Score: <strong>{item.average_score.toFixed(1)}</strong></span>
                <span>•</span>
                <span>
                  Yield: <strong>{item.converted_leads}</strong> / {item.total_leads}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="analytics-card-footer-note">
        <Info size={13} aria-hidden="true" />
        <span>Bars indicate relative conversion rate. Volume badges reflect absolute leads captured.</span>
      </div>
    </div>
  );
}
