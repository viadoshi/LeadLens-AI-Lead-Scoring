import React from 'react';
import { Sparkles, RefreshCw, Cpu } from 'lucide-react';
import ScoreVisualization from './ScoreVisualization';
import SignalSummary from './SignalSummary';
import RecommendedNextStep from './RecommendedNextStep';

export default function PredictionResult({ result, onTakeAction, onReset }) {
  if (!result) return null;

  // Use backend's probability_percent directly if available, fallback to computed
  const probabilityPercent =
    result.probability_percent !== undefined
      ? result.probability_percent
      : (result.probability * 100).toFixed(1);

  const recommendedAction = result.recommended_action || result.recommendedAction;

  return (
    <div className="card predict-result-card" role="region" aria-label="Lead Prediction Result">
      {/* Header */}
      <div className="predict-result-header">
        <div className="result-header-title-group">
          <div className="result-header-icon" aria-hidden="true">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="section-heading">Prediction Result</h2>
            <p className="card-header-subtitle">ML conversion evaluation</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-ghost predict-reset-btn"
          onClick={onReset}
          aria-label="Reset prediction and clear form"
          title="Clear result and reset form"
        >
          <RefreshCw size={13} aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      <div className="predict-result-body">
        {/* Visual Score Section */}
        <div className="predict-score-summary-block">
          <ScoreVisualization score={result.score} segment={result.segment} />

          <div className="predict-score-kpis">
            <div className="predict-kpi-row">
              <span className="kpi-main-score">{result.score} / 100</span>
              <span className="kpi-divider" aria-hidden="true">•</span>
              <span className="kpi-probability-badge">
                {probabilityPercent}% Conversion Probability
              </span>
            </div>

            <div className="predict-interpretation-box">
              <div className="predict-interpretation-label">Result Interpretation</div>
              <p className="predict-interpretation-text">{result.interpretation}</p>
            </div>
          </div>
        </div>

        {/* Key Signals Section */}
        <SignalSummary signals={result.signals} />

        {/* Recommended Action Section */}
        <RecommendedNextStep
          recommendedAction={recommendedAction}
          onTakeAction={onTakeAction}
        />

        {/* Subtitle / Model Information Footer */}
        {result.model && (
          <div className="predict-model-meta-footer" aria-label="Model metadata">
            <Cpu size={13} className="model-meta-icon" aria-hidden="true" />
            <span className="model-meta-text">
              Powered by <strong>{result.model.name}</strong>
            </span>
            <span className="model-meta-dot" aria-hidden="true">•</span>
            <span className="model-meta-version">
              Model version: <code>{result.model.version}</code>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
