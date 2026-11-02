/**
 * LeadLens Model Intelligence API Service
 * Fetches real model metadata, tournament results, predictive feature importances,
 * and artifact image URLs from the FastAPI backend.
 */

const RAW_API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'http://127.0.0.1:8000';
const BASE_URL = RAW_API_URL.replace(/\/+$/, '');
const API_PREFIX = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

/**
 * Retrieves the currently active production model metadata and evaluation benchmarks.
 * @returns {Promise<Object>} ModelInfoResponse
 */
export async function getModelInfo() {
  const url = `${API_PREFIX}/model-info`;
  try {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) {
      throw new Error(`Failed to load model metadata: HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    throw new Error(err.message || 'Unable to connect to the model intelligence service.');
  }
}

/**
 * Retrieves candidate model tournament benchmark results sorted by cv_roc_auc_mean descending.
 * @returns {Promise<Array<Object>>} Array of ModelTournamentItem
 */
export async function getModelTournament() {
  const url = `${API_PREFIX}/model-tournament`;
  try {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) {
      throw new Error(`Failed to load model tournament results: HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    throw new Error(err.message || 'Unable to load model tournament results.');
  }
}

/**
 * Retrieves global predictive feature importances sorted by importance magnitude descending.
 * @returns {Promise<Array<Object>>} Array of ModelFeatureItem
 */
export async function getModelFeatures() {
  const url = `${API_PREFIX}/model-features`;
  try {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) {
      throw new Error(`Failed to load model feature importance: HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    throw new Error(err.message || 'Unable to load model feature importance.');
  }
}

/**
 * Returns the URL for streaming the confusion matrix image artifact.
 * @returns {string} Image URL
 */
export function getConfusionMatrixUrl() {
  return `${API_PREFIX}/model-artifacts/confusion-matrix`;
}

/**
 * Returns the URL for streaming the probability calibration curve image artifact.
 * @returns {string} Image URL
 */
export function getCalibrationCurveUrl() {
  return `${API_PREFIX}/model-artifacts/calibration-curve`;
}
