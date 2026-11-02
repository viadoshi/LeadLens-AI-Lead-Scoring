import React from 'react';
import { Target, Crosshair, Zap, Award, CheckCircle2, Activity } from 'lucide-react';

const METRIC_CONFIGS = [
  {
    key: 'test_roc_auc',
    label: 'ROC-AUC',
    icon: Target,
    isPercent: true,
    description: 'Discrimination capability between converted and lost leads',
    isAccent: true,
  },
  {
    key: 'test_precision',
    label: 'Precision',
    icon: Crosshair,
    isPercent: true,
    description: 'Percentage of predicted conversions that actually converted',
  },
  {
    key: 'test_recall',
    label: 'Recall',
    icon: Zap,
    isPercent: true,
    description: 'Percentage of actual converters correctly captured by model',
  },
  {
    key: 'test_f1',
    label: 'F1 Score',
    icon: Award,
    isPercent: true,
    description: 'Harmonic mean of precision and recall balance',
  },
  {
    key: 'test_accuracy',
    label: 'Accuracy',
    icon: CheckCircle2,
    isPercent: true,
    description: 'Overall classification correctness across holdout test set',
  },
  {
    key: 'brier_score',
    label: 'Brier Score',
    icon: Activity,
    isPercent: false,
    description: 'Calibration error (lower is better; 0.0 is perfect probability)',
  },
];

export default function ModelMetricCard({ modelInfo }) {
  if (!modelInfo) return null;

  return (
    <div className="model-metrics-grid" role="region" aria-label="Model Performance Metrics">
      {METRIC_CONFIGS.map((cfg) => {
        const rawVal = modelInfo[cfg.key];
        let displayVal = '—';
        if (rawVal !== undefined && rawVal !== null) {
          if (cfg.isPercent) {
            displayVal = (rawVal * 100).toFixed(2) + '%';
          } else {
            displayVal = Number(rawVal).toFixed(4);
          }
        }

        const IconComponent = cfg.icon;

        return (
          <div
            key={cfg.key}
            className={`card kpi-card model-metric-card ${cfg.isAccent ? 'kpi-card-accent' : ''}`}
          >
            <div className="kpi-card-header">
              <span className="label-small kpi-label">{cfg.label}</span>
              <div className={`kpi-icon-wrapper ${cfg.isAccent ? 'kpi-icon-accent' : ''}`}>
                <IconComponent size={16} aria-hidden="true" />
              </div>
            </div>

            <div className="kpi-card-body">
              <div className="kpi-value model-metric-value">{displayVal}</div>
              <div className="kpi-supporting-text" title={cfg.description}>
                {cfg.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
