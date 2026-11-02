import React from 'react';
import { Layers, Info } from 'lucide-react';
import SegmentBadge from '../ui/SegmentBadge';

const SEGMENT_METAS = {
  HOT: {
    label: 'HOT',
    scoreRange: 'Score 80–100',
    fillClass: 'analytics-seg-fill-hot',
  },
  WARM: {
    label: 'WARM',
    scoreRange: 'Score 60–79',
    fillClass: 'analytics-seg-fill-warm',
  },
  NURTURE: {
    label: 'NURTURE',
    scoreRange: 'Score 40–59',
    fillClass: 'analytics-seg-fill-nurture',
  },
  COLD: {
    label: 'COLD',
    scoreRange: 'Score 0–39',
    fillClass: 'analytics-seg-fill-cold',
  },
};

export default function CampaignSegmentPerformance({ segments = [] }) {
  const totalLeads = segments.reduce((sum, s) => sum + s.total_leads, 0);

  if (totalLeads === 0) {
    return (
      <div className="card campaign-card" role="region" aria-label="Campaign Segment Performance">
        <div className="campaign-card-header">
          <div>
            <div className="campaign-card-title-row">
              <Layers size={16} className="campaign-icon-gold" aria-hidden="true" />
              <h2 className="section-heading">Lead Segment Breakdown</h2>
            </div>
            <p className="body-text">Volume and conversion yield by AI lead score tier</p>
          </div>
        </div>
        <div className="campaign-chart-empty">No evaluated leads available for segmentation yet.</div>
      </div>
    );
  }

  return (
    <div className="card campaign-card" role="region" aria-label="Campaign Segment Performance">
      <div className="campaign-card-header">
        <div>
          <div className="campaign-card-title-row">
            <Layers size={16} className="campaign-icon-gold" aria-hidden="true" />
            <h2 className="section-heading">Lead Segment Breakdown</h2>
          </div>
          <p className="body-text">Volume and conversion yield by AI lead score tier</p>
        </div>
      </div>

      <div className="campaign-segment-grid" role="list">
        {segments.map((item) => {
          const meta = SEGMENT_METAS[item.segment] || {
            label: item.segment,
            scoreRange: '',
            fillClass: 'analytics-fill-gold',
          };
          const volumePct = totalLeads > 0 ? ((item.total_leads / totalLeads) * 100).toFixed(1) : '0.0';

          return (
            <div key={item.segment} className="campaign-segment-box" role="listitem">
              <div className="campaign-seg-top">
                <div className="campaign-seg-badge-wrap">
                  <SegmentBadge segment={item.segment} />
                  <span className="campaign-seg-range">{meta.scoreRange}</span>
                </div>
                <div className="campaign-seg-rate">
                  <span className="campaign-seg-rate-label">Conv:</span>
                  <span className="campaign-seg-rate-val">{item.conversion_rate.toFixed(1)}%</span>
                </div>
              </div>

              <div className="campaign-seg-bars">
                <div className="campaign-seg-bar-wrap">
                  <div className="campaign-seg-bar-sub">
                    <span>Conversion Yield</span>
                    <span>{item.converted_leads} / {item.total_leads}</span>
                  </div>
                  <div className="analytics-bar-track" aria-hidden="true">
                    <div
                      className={`analytics-bar-fill ${meta.fillClass}`}
                      style={{ width: `${Math.min(100, Math.max(6, item.conversion_rate))}%` }}
                    />
                  </div>
                </div>

                <div className="campaign-seg-bar-wrap">
                  <div className="campaign-seg-bar-sub">
                    <span>Campaign Share</span>
                    <span>{volumePct}% ({item.total_leads} leads)</span>
                  </div>
                  <div className="analytics-bar-track track-subtle" aria-hidden="true">
                    <div
                      className="analytics-bar-fill fill-subtle"
                      style={{ width: `${Math.min(100, Math.max(6, parseFloat(volumePct)))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="campaign-seg-score-footer">
                Avg Score: <strong>{item.average_score.toFixed(1)}</strong>
              </div>
            </div>
          );
        })}
      </div>

      <div className="analytics-card-footer-note">
        <Info size={13} aria-hidden="true" />
        <span>Tiers mapped via LeadLens central thresholds: HOT ≥80, WARM 60–79, NURTURE 40–59, COLD &lt;40.</span>
      </div>
    </div>
  );
}
