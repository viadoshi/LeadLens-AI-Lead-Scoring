import React from 'react';
import { Gauge, Sparkles } from 'lucide-react';
import SegmentBadge from '../ui/SegmentBadge';
import { getScoreInterpretation } from '../../utils/mockLeadsData';

export default function LeadScoreCard({ lead }) {
  if (!lead) return null;

  const score = lead.score ?? 0;
  const probabilityPercent = lead.probability !== undefined && lead.probability !== null
    ? (lead.probability * 100).toFixed(1)
    : (score).toFixed(1);
  const interpretation = getScoreInterpretation(lead.segment);

  // SVG Circular Meter Calculations
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  // Adapt stroke color according to segment while respecting theme
  const getProgressColor = (seg) => {
    const s = (seg || '').toUpperCase();
    if (s === 'HOT') return 'var(--accent)';
    if (s === 'WARM') return '#F59E0B';
    if (s === 'NURTURE') return '#3B82F6';
    return 'var(--text-dim)';
  };

  const progressColor = getProgressColor(lead.segment);

  return (
    <div className="card lead-score-card">
      <div className="card-header-row">
        <div className="card-header-title-group">
          <div className="card-header-icon" aria-hidden="true">
            <Gauge size={18} />
          </div>
          <div>
            <h2 className="section-heading">AI Lead Score</h2>
            <p className="card-header-subtitle">Predictive conversion intelligence</p>
          </div>
        </div>

        <div className="score-engine-tag" aria-hidden="true">
          <Sparkles size={12} />
          <span>ML Scoring</span>
        </div>
      </div>

      <div className="lead-score-body">
        {/* Circular Progress Meter */}
        <div className="circular-score-wrapper">
          <div className="circular-meter-container">
            <svg
              className="circular-meter-svg"
              viewBox="0 0 140 140"
              aria-label={`Lead score ${score} out of 100`}
              role="img"
            >
              {/* Background Track */}
              <circle
                className="circular-meter-track"
                cx="70"
                cy="70"
                r={radius}
                strokeWidth="10"
              />
              {/* Active Progress Ring */}
              <circle
                className="circular-meter-fill"
                cx="70"
                cy="70"
                r={radius}
                strokeWidth="10"
                stroke={progressColor}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
            </svg>

            {/* Inner Content of the Circular Meter */}
            <div className="circular-meter-inner">
              <div className="score-inner-number">{score}</div>
              <div className="score-inner-denom">/ 100</div>
              <div className="score-inner-badge">
                <SegmentBadge segment={lead.segment} />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics & Interpretation */}
        <div className="score-details-column">
          <div className="score-headline-row">
            <span className="score-main-value">{score} / 100</span>
            <span className="score-divider" aria-hidden="true">•</span>
            <span className="score-probability-text">
              {probabilityPercent}% Conversion Probability
            </span>
          </div>

          <div className="score-interpretation-box">
            <div className="interpretation-label">Score Interpretation</div>
            <div className="interpretation-text">{interpretation}</div>
          </div>

          <div className="score-classification-meta">
            <div className="classification-item">
              <span className="meta-label">Classification:</span>
              <span className="meta-value">
                <SegmentBadge segment={lead.segment} />
              </span>
            </div>
            <div className="classification-item">
              <span className="meta-label">Scoring Confidence:</span>
              <span className="meta-value confidence-high">High (Calibrated)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
