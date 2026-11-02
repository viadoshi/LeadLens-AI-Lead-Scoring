/**
 * LeadLens Campaign Intelligence API Service.
 * Centralizes requests for campaigns, performance metrics, detail breakdowns,
 * and campaign lifecycle operations (create, update, archive).
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
 * Fetch all campaigns with optional filters (status, channel, campaign_type, search).
 * @param {Object} params - Query filters { status, channel, campaign_type, search }
 * @returns {Promise<Object>} { summary, campaigns }
 */
export async function getCampaigns(params = {}) {
  try {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] && params[key] !== 'All' && params[key] !== 'all') {
        cleanParams[key] = params[key];
      }
    });

    const response = await apiClient.get('/api/campaigns', { params: cleanParams });
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message || 'Unable to load campaigns.');
  }
}

/**
 * Fetch single campaign intelligence details and attribution.
 * @param {string} campaignId - Campaign slug or identifier
 * @returns {Promise<Object>} Campaign detail payload
 */
export async function getCampaign(campaignId) {
  try {
    const response = await apiClient.get(`/api/campaigns/${encodeURIComponent(campaignId)}`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message || `Unable to load campaign '${campaignId}'.`);
  }
}

/**
 * Create a new campaign.
 * @param {Object} data - Campaign creation payload
 * @returns {Promise<Object>} Created campaign summary
 */
export async function createCampaign(data) {
  try {
    const response = await apiClient.post('/api/campaigns', data);
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        throw new Error(detail.map((d) => d.msg || d).join(', '));
      }
      throw new Error(detail);
    }
    throw new Error(error.message || 'Unable to create campaign.');
  }
}

/**
 * Update an existing campaign.
 * @param {string} campaignId - Campaign identifier
 * @param {Object} data - Updated fields
 * @returns {Promise<Object>} Updated campaign summary
 */
export async function updateCampaign(campaignId, data) {
  try {
    const response = await apiClient.patch(`/api/campaigns/${encodeURIComponent(campaignId)}`, data);
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        throw new Error(detail.map((d) => d.msg || d).join(', '));
      }
      throw new Error(detail);
    }
    throw new Error(error.message || `Unable to update campaign '${campaignId}'.`);
  }
}

/**
 * Archive a campaign.
 * @param {string} campaignId - Campaign identifier
 * @returns {Promise<Object>} Archived campaign summary
 */
export async function archiveCampaign(campaignId) {
  try {
    const response = await apiClient.post(`/api/campaigns/${encodeURIComponent(campaignId)}/archive`);
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message || `Unable to archive campaign '${campaignId}'.`);
  }
}

export default {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  archiveCampaign,
};
