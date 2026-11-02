/**
 * @deprecated LEGACY DEMO CODE ONLY
 * Replaced in Phase 3.4 by the live FastAPI prediction service (POST /api/predict via src/services/predictionApi.js).
 * Kept strictly for option lists exports until full migration.
 */

export const PREDICT_INDUSTRY_OPTIONS = [
  'Software',
  'Fintech',
  'Healthcare',
  'E-commerce',
  'Logistics',
  'Manufacturing',
  'Education',
  'Professional Services',
  'Other',
];

export const PREDICT_SOURCE_OPTIONS = [
  'LinkedIn',
  'Google Ads',
  'Website',
  'Webinar',
  'Email',
  'Referral',
];

export const PREDICT_CAMPAIGN_OPTIONS = [
  'Q4 Enterprise Inbound',
  'Cloud Scale Outreach',
  'Webinar AI Summit',
  'SaaS Growth SDR',
  'Fintech Targeted Push',
  'Other',
];

export const PREDICT_COMPANY_SIZE_OPTIONS = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001+',
];

export const PREDICT_JOB_ROLE_OPTIONS = [
  'Founder / CEO',
  'Executive',
  'Director',
  'Manager',
  'Team Lead',
  'Individual Contributor',
  'Other',
];

export const PREDICT_BUDGET_OPTIONS = ['Yes', 'No', 'Unknown'];

export const PREDICT_BINARY_OPTIONS = ['No', 'Yes'];

/**
 * Temporary local deterministic prediction simulation.
 * Computes a weighted score based on lead inputs for frontend demonstration.
 *
 * @param {Object} formData
 * @returns {Object} { score, probability, segment, recommendedAction, interpretation, signals, modelName, modelVersion }
 */
export function mockPredictLeadScore(formData) {
  // Base baseline score
  let scorePoints = 20;

  // 1. Lead Source weighting
  switch (formData.source) {
    case 'Referral':
      scorePoints += 18;
      break;
    case 'LinkedIn':
      scorePoints += 15;
      break;
    case 'Webinar':
      scorePoints += 12;
      break;
    case 'Google Ads':
      scorePoints += 10;
      break;
    case 'Website':
      scorePoints += 10;
      break;
    case 'Email':
      scorePoints += 6;
      break;
    default:
      scorePoints += 8;
  }

  // 2. Engagement signals weighting
  const visits = Math.max(0, parseInt(formData.websiteVisits || '0', 10));
  const pages = Math.max(0, parseInt(formData.pagesViewed || '0', 10));
  const opens = Math.max(0, parseInt(formData.emailOpens || '0', 10));
  const clicks = Math.max(0, parseInt(formData.emailClicks || '0', 10));

  scorePoints += Math.min(12, visits * 2);
  scorePoints += Math.min(12, pages * 1.5);
  scorePoints += Math.min(8, opens * 2);
  scorePoints += Math.min(10, clicks * 3);

  if (formData.demoRequested === 'Yes') {
    scorePoints += 18;
  }
  if (formData.pricingPageViewed === 'Yes') {
    scorePoints += 10;
  }

  // 3. Qualification & Company signals
  switch (formData.jobRole) {
    case 'Founder / CEO':
    case 'Executive':
      scorePoints += 14;
      break;
    case 'Director':
      scorePoints += 11;
      break;
    case 'Manager':
      scorePoints += 8;
      break;
    case 'Team Lead':
      scorePoints += 5;
      break;
    case 'Individual Contributor':
      scorePoints += 2;
      break;
    default:
      scorePoints += 3;
  }

  switch (formData.companySize) {
    case '1001+':
    case '501-1000':
      scorePoints += 10;
      break;
    case '201-500':
      scorePoints += 8;
      break;
    case '51-200':
      scorePoints += 6;
      break;
    case '11-50':
      scorePoints += 4;
      break;
    default:
      scorePoints += 2;
  }

  if (formData.budgetIdentified === 'Yes') {
    scorePoints += 12;
  } else if (formData.budgetIdentified === 'No') {
    scorePoints -= 12;
  } else {
    scorePoints += 2;
  }

  // Bound score between 8 and 98
  const score = Math.min(98, Math.max(8, Math.round(scorePoints)));
  const probability = Number((score / 100).toFixed(3));

  // Determine Segment tier
  let segment = 'COLD';
  let recommendedAction = 'Low-priority follow-up';
  let interpretation = 'Low immediate potential. Consider automated nurturing.';

  if (score >= 80) {
    segment = 'HOT';
    recommendedAction =
      formData.demoRequested === 'Yes'
        ? 'Schedule enterprise demo'
        : 'Contact immediately';
    interpretation =
      'High conversion potential. Prioritize this lead for immediate sales outreach.';
  } else if (score >= 60) {
    segment = 'WARM';
    recommendedAction = 'Follow up within 24h';
    interpretation =
      'Good conversion potential. Follow up and continue qualification.';
  } else if (score >= 40) {
    segment = 'NURTURE';
    recommendedAction = 'Add to nurture sequence';
    interpretation =
      'Moderate potential. Continue engagement before direct sales outreach.';
  } else {
    segment = 'COLD';
    recommendedAction = 'Low-priority follow-up';
    interpretation = 'Low immediate potential. Consider automated nurturing.';
  }

  // Derive 3 to 5 realistic input signals
  const signals = [];

  if (formData.demoRequested === 'Yes') {
    signals.push({
      text: 'Demo requested by prospect',
      type: 'positive',
    });
  }

  if (formData.pricingPageViewed === 'Yes') {
    signals.push({
      text: 'Pricing intent detected',
      type: 'positive',
    });
  }

  if (visits >= 4 || pages >= 8) {
    signals.push({
      text: 'High website & page engagement',
      type: 'positive',
    });
  } else if (visits <= 1 && pages <= 2) {
    signals.push({
      text: 'Low web engagement activity',
      type: 'negative',
    });
  }

  if (['Founder / CEO', 'Executive', 'Director'].includes(formData.jobRole)) {
    signals.push({
      text: 'Strong decision-maker role',
      type: 'positive',
    });
  }

  if (formData.budgetIdentified === 'Yes') {
    signals.push({
      text: 'Budget identified & qualified',
      type: 'positive',
    });
  } else if (formData.budgetIdentified === 'No') {
    signals.push({
      text: 'No budget identified',
      type: 'negative',
    });
  }

  if (['201-500', '501-1000', '1001+'].includes(formData.companySize)) {
    signals.push({
      text: 'Company size matches target enterprise ICP',
      type: 'positive',
    });
  }

  // Fallback signals if list is short
  if (signals.length < 3) {
    if (formData.demoRequested === 'No') {
      signals.push({
        text: 'No demo intent registered',
        type: 'neutral',
      });
    }
    signals.push({
      text: `Source channel: ${formData.source || 'General'}`,
      type: 'neutral',
    });
  }

  return {
    score,
    probability,
    segment,
    recommendedAction,
    interpretation,
    signals: signals.slice(0, 5),
    // Future API compatibility metadata
    modelName: 'XGBoost-LeadLens-Classifier',
    modelVersion: 'v1.4.2-preview',
  };
}
