import React from 'react';
import { Share2, Info } from 'lucide-react';

export default function CampaignSourcePerformance({ sources = [] }) {
  if (!sources || sources.length === 0) {
    return (
      <div className="card campaign-card" role="region" aria-label="Campaign Source Performance">
        <div className="campaign-card-header">
          <div>
            <div className="campaign-card-title-row">
              <Share2 size={16} className="campaign-icon-gold" aria-hidden="true" />
              <h2 className="section-heading">Source Channel Mix</h2>
            </div>
            <p className="body-text">Conversion yield across origin acquisition channels</p>
          </div>
        </div>
        <div className="campaign-chart-empty">No source attribution records for this campaign yet.</div>
      </div>
    );
  }

  const maxRate = Math.max(...sources.map((s) => s.conversion_rate), 10);

  return (
    <div className="card campaign-card" role="region" aria-label="Campaign Source Performance">
      <div className="campaign-card-header">
        <div>
          <div className="campaign-card-title-row">
            <Share2 size={16} className="campaign-icon-gold" aria-hidden="true" />
            <h2 className="section-heading">Source Channel Mix</h2>
          </div>
          <p className="body-text">Conversion yield across origin acquisition channels</p>
        </div>
      </div>

      <div className="campaign-source-list" role="list">
        {sources.map((item, idx) => {
          const widthPercent = Math.min(100, Math.max(10, (item.conversion_rate / maxRate) * 100));

          return (
            <div key={item.source} className="campaign-source-row" role="listitem">
              <div className="campaign-source-info-row">
                <div className="campaign-source-name-box">
                  <span className="campaign-source-rank">#{idx + 1}</span>
                  <span className="campaign-source-name">{item.source}</span>
                </div>
                <div className="campaign-source-meta">
                  <span className="campaign-source-count-badge">
                    {item.total_leads} leads ({item.converted_leads} won)
                  </span>
                  <span className="campaign-source-rate-val">{item.conversion_rate.toFixed(1)}%</span>
                </div>
              </div>

              <div className="analytics-bar-track" aria-hidden="true">
                <div
                  className="analytics-bar-fill analytics-fill-gold"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="analytics-card-footer-note">
        <Info size={13} aria-hidden="true" />
        <span>Channels reflecting origin paths of prospects routed through this campaign.</span>
      </div>
    </div>
  );
}
