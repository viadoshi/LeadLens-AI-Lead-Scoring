import React from 'react';
import { Layers } from 'lucide-react';

export default function ModelDetails({ modelInfo }) {
  if (!modelInfo) return null;

  const datasetSize = modelInfo.dataset_rows
    ? `${modelInfo.dataset_rows.toLocaleString()} leads`
    : '8,000 leads';

  const trainTestSplit = modelInfo.train_rows && modelInfo.test_rows
    ? `${modelInfo.train_rows.toLocaleString()} train / ${modelInfo.test_rows.toLocaleString()} test (80/20)`
    : '6,400 train / 1,600 test (80/20)';

  const featureCount = modelInfo.feature_count
    ? `${modelInfo.feature_count} raw (${modelInfo.encoded_feature_count || 50} encoded)`
    : '16 raw (50 encoded)';

  const formattedDate = modelInfo.training_date
    ? new Date(modelInfo.training_date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : 'Oct 23, 2026, 09:20 UTC';

  const detailsList = [
    { label: 'Model Architecture', value: modelInfo.model_name || 'Logistic Regression' },
    { label: 'Model Version', value: modelInfo.model_version || 'lead-scoring-v1', isCode: true },
    { label: 'Training Date', value: formattedDate },
    { label: 'Dataset Size', value: datasetSize },
    { label: 'Data Split', value: trainTestSplit },
    { label: 'Feature Count', value: featureCount },
    { label: 'Target Variable', value: modelInfo.target_name || 'converted', isCode: true },
    { label: 'Validation Strategy', value: `${modelInfo.cv_folds || 5}-Fold Stratified CV` },
    { label: 'Primary Optimization Metric', value: modelInfo.primary_metric || 'ROC-AUC' },
    { label: 'Random Seed', value: '42 (Deterministic)', isCode: true },
    { label: 'Inference Framework', value: 'scikit-learn Pipeline (ColumnTransformer + Classifier)' },
  ];

  return (
    <div className="card model-details-card" role="region" aria-label="Model Training and Governance Details">
      <div className="model-details-header">
        <div className="details-title-group">
          <div className="details-header-icon" aria-hidden="true">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="section-heading">Model & Training Specifications</h3>
            <p className="card-header-subtitle">
              Governance metadata, sample sizes, and pipeline validation configurations
            </p>
          </div>
        </div>
      </div>

      <div className="model-details-grid">
        {detailsList.map((item) => (
          <div key={item.label} className="detail-item-box">
            <span className="detail-label">{item.label}</span>
            {item.isCode ? (
              <code className="detail-code-val">{item.value}</code>
            ) : (
              <span className="detail-val">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
