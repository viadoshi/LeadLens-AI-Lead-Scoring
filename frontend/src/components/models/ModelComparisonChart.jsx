import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ModelComparisonChart({ tournament = [], productionModelName = 'Logistic Regression' }) {
  const { isDark } = useTheme();

  if (!tournament || tournament.length === 0) return null;

  // Find min and max for scaling the bars cleanly (baseline around 0.5 to highlight delta)
  const minScore = 0.5;
  const maxScore = 0.9;

  return (
    <div className="card model-chart-card" role="region" aria-label="Candidate Model CV ROC-AUC Comparison">
      <div className="model-chart-header">
        <div className="model-chart-title-group">
          <div className="model-chart-icon" aria-hidden="true">
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 className="section-heading">Cross-Validation Performance</h3>
            <p className="card-header-subtitle">5-Fold CV ROC-AUC comparison across all candidates</p>
          </div>
        </div>
      </div>

      <div className="comparison-bars-container" style={{ marginTop: '16px' }}>
        {tournament.map((item) => {
          const isWinner = item.model.toLowerCase() === productionModelName.toLowerCase();
          const score = item.cv_roc_auc_mean || 0;
          const scorePercent = (score * 100).toFixed(2);
          // Scale from minScore (0%) to maxScore (100%) for visible contrast
          const barWidthPercent = Math.max(
            15,
            Math.min(100, ((score - minScore) / (maxScore - minScore)) * 100)
          );

          return (
            <div
              key={item.model}
              className={`comparison-bar-row ${isWinner ? 'is-winner-bar' : ''}`}
            >
              <div className="bar-label-col">
                <span className="bar-model-name" title={item.model}>
                  {item.model}
                </span>
                {isWinner && <span className="bar-winner-tag">Active</span>}
              </div>

              <div className="bar-track-col">
                <div
                  className="bar-track"
                  style={{
                    backgroundColor: isDark ? 'rgba(71, 85, 105, 0.25)' : 'rgba(71, 85, 105, 0.12)',
                  }}
                >
                  <div
                    className={`bar-fill ${isWinner ? 'bar-fill-winner' : 'bar-fill-candidate'}`}
                    style={{
                      width: `${barWidthPercent}%`,
                      backgroundColor: isWinner
                        ? isDark ? '#E5A93C' : '#D97706'
                        : isDark ? '#475569' : '#94A3B8',
                    }}
                  />
                </div>
              </div>

              <div className="bar-value-col">
                <span className={`bar-value-text ${isWinner ? 'winner-text' : ''}`}>
                  {scorePercent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chart-legend-footer">
        <div className="legend-item">
          <span
            className="legend-color-dot"
            style={{ backgroundColor: isDark ? '#E5A93C' : '#D97706' }}
            aria-hidden="true"
          />
          <span>Production Winner ({productionModelName})</span>
        </div>
        <div className="legend-item">
          <span
            className="legend-color-dot"
            style={{ backgroundColor: isDark ? '#475569' : '#94A3B8' }}
            aria-hidden="true"
          />
          <span>Evaluated Candidates</span>
        </div>
      </div>
    </div>
  );
}
