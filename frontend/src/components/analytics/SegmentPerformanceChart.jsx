import React from 'react';
import { Layers, Info } from 'lucide-react';
import SegmentBadge from '../ui/SegmentBadge';

const SEGMENT_METAS = {
  HOT: {
    label: 'HOT',
    scoreRange: 'Score 80–100',
    colorClass: 'segment-pill-hot',
    fillClass: 'analytics-seg-fill-hot',
  },
  WARM: {
    label: 'WARM',
    scoreRange: 'Score 60–79',
    colorClass: 'segment-pill-warm',
    fillClass: 'analytics-seg-fill-warm',
  },
  NURTURE: {
    label: 'NURTURE',
    scoreRange: 'Score 40–59',
    colorClass: 'segment-pill-nurture',
    fillClass: 'analytics-seg-fill-nurture',
  },
  COLD: {
    label: 'COLD',
    scoreRange: 'Score 0–39',
    colorClass: 'segment-pill-cold',
    fillClass: 'analytics-seg-fill-cold',
  },
};

export default function SegmentPerformanceChart({ segments = [] }) {
  const totalPipelineLeads = segments.reduce((sum, s) => sum + s.total_leads, 0);

  return (
    <div className="card analytics-card" role="region" aria-label="Lead Segment Performance">
      <div className="analytics-card-header">
        <div>
          <div className="analytics-card-title-row">
            <Layers size={18} className="analytics-icon-gold" aria-hidden="true" />
            <h2 className="section-heading">Segment Conversion Yield</h2>
          </div>
          <p className="body-text">Volume distribution and conversion efficiency by AI score tier</p>
        </div>
      </div>

      <div className="analytics-segment-grid" role="list">
        {segments.map((item) => {
          const meta = SEGMENT_METAS[item.segment] || {
            label: item.segment,
            scoreRange: '',
            colorClass: 'segment-pill-nurture',
            fillClass: 'analytics-fill-gold',
          };
          const volumePct = totalPipelineLeads > 0 ? ((item.total_leads / totalPipelineLeads) * 100).toFixed(1) : '0.0';

          return (
            <div key={item.segment} className="analytics-segment-card" role="listitem">
              <div className="analytics-seg-card-top">
                <div className="analytics-seg-badge-row">
                  <SegmentBadge segment={item.segment} />
                  <span className="analytics-seg-range-text">{meta.scoreRange}</span>
                </div>
                <div className="analytics-seg-rate-badge">
                  <span className="analytics-seg-rate-label">Conv Rate:</span>
                  <span className="analytics-seg-rate-num">{item.conversion_rate.toFixed(1)}%</span>
                </div>
              </div>

              {/* Dual Progress Bars: Volume share & Conversion rate */}
              <div className="analytics-seg-bars-block">
                <div className="analytics-seg-bar-group">
                  <div className="analytics-seg-bar-header">
                    <span>Conversion Yield</span>
                    <span>{item.converted_leads} of {item.total_leads} converted</span>
                  </div>
                  <div className="analytics-bar-track" aria-hidden="true">
                    <div
                      className={`analytics-bar-fill ${meta.fillClass}`}
                      style={{ width: `${Math.min(100, Math.max(8, item.conversion_rate))}%` }}
                    />
                  </div>
                </div>

                <div className="analytics-seg-bar-group">
                  <div className="analytics-seg-bar-header">
                    <span>Pipeline Volume Share</span>
                    <span>{item.total_leads} leads ({volumePct}%)</span>
                  </div>
                  <div className="analytics-bar-track track-subtle" aria-hidden="true">
                    <div
                      className="analytics-bar-fill fill-subtle"
                      style={{ width: `${Math.min(100, Math.max(8, parseFloat(volumePct)))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="analytics-seg-footer">
                <span>Avg Score: <strong>{item.average_score.toFixed(1)}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="analytics-card-footer-note">
        <Info size={13} aria-hidden="true" />
        <span>Hot leads (80+) prioritize immediate sales engagement with the highest historical yield.</span>
      </div>
    </div>
  );
}
