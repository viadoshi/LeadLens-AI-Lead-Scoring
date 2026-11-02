import React from 'react';
import SegmentBadge from '../ui/SegmentBadge';

export default function ScoreVisualization({ score, segment }) {
  const normalizedScore = Math.min(100, Math.max(0, score ?? 0));
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  const getProgressColor = (seg) => {
    const s = (seg || '').toUpperCase();
    if (s === 'HOT') return 'var(--accent)';
    if (s === 'WARM') return '#F59E0B';
    if (s === 'NURTURE') return '#3B82F6';
    return 'var(--text-dim)';
  };

  const progressColor = getProgressColor(segment);

  return (
    <div className="predict-score-visual-wrapper">
      <div className="predict-meter-container">
        <svg
          className="predict-meter-svg"
          viewBox="0 0 144 144"
          aria-label={`Lead score ${normalizedScore} out of 100`}
          role="img"
        >
          {/* Background circle track */}
          <circle
            className="predict-meter-track"
            cx="72"
            cy="72"
            r={radius}
            strokeWidth="10"
          />
          {/* Active progress ring */}
          <circle
            className="predict-meter-fill"
            cx="72"
            cy="72"
            r={radius}
            strokeWidth="10"
            stroke={progressColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 72 72)"
          />
        </svg>

        {/* Center score readout */}
        <div className="predict-meter-inner">
          <div className="predict-score-number">{normalizedScore}</div>
          <div className="predict-score-label">AI Lead Score</div>
          <div className="predict-badge-container">
            <SegmentBadge segment={segment} />
          </div>
        </div>
      </div>
    </div>
  );
}
