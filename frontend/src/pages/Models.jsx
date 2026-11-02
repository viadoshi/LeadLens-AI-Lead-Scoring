import React, { useEffect, useState, useCallback } from 'react';
import {
  CurrentModelCard,
  ModelMetricCard,
  ModelTournamentTable,
  ModelComparisonChart,
  FeatureImportanceList,
  ModelArtifactCard,
  ModelDetails,
  ModelIntelligenceSkeleton,
  ModelIntelligenceErrorState,
} from '../components/models';
import {
  getModelInfo,
  getModelTournament,
  getModelFeatures,
} from '../services/modelApi';

export default function Models() {
  const [modelInfo, setModelInfo] = useState(null);
  const [tournament, setTournament] = useState([]);
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModelIntelligence = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [infoRes, tournamentRes, featuresRes] = await Promise.all([
        getModelInfo(),
        getModelTournament(),
        getModelFeatures(),
      ]);
      setModelInfo(infoRes);
      setTournament(tournamentRes);
      setFeatures(featuresRes);
    } catch (err) {
      setError(err.message || 'Unable to retrieve model evaluation data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const [infoRes, tournamentRes, featuresRes] = await Promise.all([
          getModelInfo(),
          getModelTournament(),
          getModelFeatures(),
        ]);
        if (!ignore) {
          setModelInfo(infoRes);
          setTournament(tournamentRes);
          setFeatures(featuresRes);
          setIsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to retrieve model evaluation data.');
          setIsLoading(false);
        }
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return <ModelIntelligenceSkeleton />;
  }

  if (error || !modelInfo) {
    return (
      <div className="models-page-wrapper">
        <div className="models-page-header">
          <h1 className="page-title">Model Intelligence</h1>
          <p className="body-lead">Understand how LeadLens scores and prioritizes your leads.</p>
        </div>
        <ModelIntelligenceErrorState error={error} onRetry={fetchModelIntelligence} />
      </div>
    );
  }

  const productionModelName = modelInfo.model_name || 'Logistic Regression';

  return (
    <div className="models-page-wrapper">
      {/* 1. Page Header */}
      <div className="models-page-header">
        <div className="models-header-top-row">
          <div>
            <h1 className="page-title">Model Intelligence</h1>
            <p className="body-lead">Understand how LeadLens scores and prioritizes your leads.</p>
          </div>
          <div className="models-header-status-group">
            <span className="model-badge-production">Production Model</span>
            <span className="model-badge-active">
              <span className="model-status-dot" aria-hidden="true" />
              <span>Active</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Current Model Hero Card */}
      <div className="models-section-block">
        <CurrentModelCard modelInfo={modelInfo} />
      </div>

      {/* 3. Performance KPI Metrics */}
      <div className="models-section-block">
        <ModelMetricCard modelInfo={modelInfo} />
      </div>

      {/* 4. Model Tournament Table */}
      <div className="models-section-block">
        <ModelTournamentTable
          tournament={tournament}
          productionModelName={productionModelName}
        />
      </div>

      {/* 5. Model Comparison Chart + Top Predictive Features (Two-Column Layout) */}
      <div className="models-section-block models-two-col-grid">
        <ModelComparisonChart
          tournament={tournament}
          productionModelName={productionModelName}
        />
        <FeatureImportanceList features={features} />
      </div>

      {/* 6. Visual Evaluation Artifacts (Confusion Matrix + Calibration Curve) */}
      <div className="models-section-block">
        <ModelArtifactCard modelInfo={modelInfo} />
      </div>

      {/* 7. Model Training & Governance Specifications */}
      <div className="models-section-block">
        <ModelDetails modelInfo={modelInfo} />
      </div>
    </div>
  );
}
