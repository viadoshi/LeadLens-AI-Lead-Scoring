/**
 * LeadLens Analytics API Service.
 * Centralizes requests for business simulation analytics, conversion trends,
 * channel performance, segment yields, campaign rankings, and deterministic insights.
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch aggregated analytics dashboard overview for requested date range.
 * @param {string} range - '7d', '30d', '90d', or 'all' (default: '30d')
 * @returns {Promise<Object>} Aggregated analytics data payload
 */
export async function getAnalyticsOverview(range = '30d') {
  try {
    const response = await apiClient.get('/api/analytics/overview', {
      params: { range },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message || 'Unable to retrieve analytics data right now.');
  }
}

export default {
  getAnalyticsOverview,
};
