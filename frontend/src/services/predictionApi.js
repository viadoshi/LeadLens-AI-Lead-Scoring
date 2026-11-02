/**
 * LeadLens Prediction API Service
 * Handles communication with the FastAPI ML scoring service (POST /api/predict).
 */

const RAW_API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'http://127.0.0.1:8000';
const BASE_URL = RAW_API_URL.replace(/\/+$/, '');
const PREDICT_ENDPOINT = BASE_URL.endsWith('/api') ? `${BASE_URL}/predict` : `${BASE_URL}/api/predict`;

/**
 * Transforms form data into the exact 16-feature payload required by the ML model.
 * Excludes UI-only fields (name, email, company).
 *
 * @param {Object} formData
 * @returns {Object} 16-feature snake_case payload
 */
export function formatPredictionPayload(formData) {
  return {
    industry: formData.industry,
    company_size: formData.companySize || formData.company_size,
    job_role: formData.jobRole || formData.job_role,
    lead_source: formData.source || formData.lead_source,
    campaign: formData.campaign,
    budget_identified: formData.budgetIdentified || formData.budget_identified,
    website_visits: Math.max(0, parseInt(formData.websiteVisits ?? formData.website_visits ?? 0, 10) || 0),
    pages_viewed: Math.max(0, parseInt(formData.pagesViewed ?? formData.pages_viewed ?? 0, 10) || 0),
    email_opens: Math.max(0, parseInt(formData.emailOpens ?? formData.email_opens ?? 0, 10) || 0),
    email_clicks: Math.max(0, parseInt(formData.emailClicks ?? formData.email_clicks ?? 0, 10) || 0),
    demo_requested: formData.demoRequested || formData.demo_requested || 'No',
    pricing_page_viewed: formData.pricingPageViewed || formData.pricing_page_viewed || 'No',
    content_downloaded: formData.contentDownloaded || formData.content_downloaded || 'No',
    webinar_attended: formData.webinarAttended || formData.webinar_attended || 'No',
    days_since_last_activity: Math.max(0, parseInt(formData.daysSinceLastActivity ?? formData.days_since_last_activity ?? 0, 10) || 0),
    sales_contacted: formData.salesContacted || formData.sales_contacted || 'No',
  };
}

/**
 * Executes a lead scoring prediction against the FastAPI backend.
 *
 * @param {Object} rawFormData - Form inputs or formatted model features
 * @returns {Promise<Object>} Prediction response { score, probability, probability_percent, segment, recommended_action, interpretation, signals, model }
 * @throws {Error} User-friendly error message if API fails
 */
export async function predictLeadScore(rawFormData) {
  const payload = formatPredictionPayload(rawFormData);

  let response;
  try {
    response = await fetch(PREDICT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    // Network or connection refusal error
    throw new Error(
      'Unable to connect to the LeadLens AI prediction service. Make sure the backend service is running and try again.'
    );
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errData = await response.json();
      if (errData && errData.detail) {
        if (Array.isArray(errData.detail)) {
          errorDetail = errData.detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
        } else {
          errorDetail = String(errData.detail);
        }
      }
    } catch {
      // Non-JSON error body fallback
      errorDetail = response.statusText;
    }

    if (response.status === 422) {
      throw new Error(`Validation Error: ${errorDetail || 'Invalid lead attributes provided.'}`);
    } else if (response.status === 503) {
      throw new Error(`Service Unavailable: ${errorDetail || 'Prediction model is not ready.'}`);
    } else {
      throw new Error(`Prediction Failed: ${errorDetail || 'Server error occurred during inference.'}`);
    }
  }

  const result = await response.json();
  return result;
}
