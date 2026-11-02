import React from 'react';
import { Sliders, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Transforms raw one-hot encoded and numerical feature keys into user-friendly names.
 * e.g., "budget_identified_Yes" -> "Budget Identified: Yes"
 *       "job_role_Founder / CEO" -> "Job Role: Founder / CEO"
 *       "days_since_last_activity" -> "Days Since Last Activity"
 */
function formatFeatureName(rawName = '') {
  if (!rawName) return '';

  const prefixMap = [
    { prefix: 'budget_identified_', label: 'Budget Identified: ' },
    { prefix: 'demo_requested_', label: 'Demo Requested: ' },
    { prefix: 'pricing_page_viewed_', label: 'Pricing Page Viewed: ' },
    { prefix: 'job_role_', label: 'Job Role: ' },
    { prefix: 'lead_source_', label: 'Lead Source: ' },
    { prefix: 'company_size_', label: 'Company Size: ' },
    { prefix: 'campaign_', label: 'Campaign: ' },
    { prefix: 'industry_', label: 'Industry: ' },
    { prefix: 'content_downloaded_', label: 'Content Downloaded: ' },
    { prefix: 'webinar_attended_', label: 'Webinar Attended: ' },
    { prefix: 'sales_contacted_', label: 'Sales Contacted: ' },
  ];

  for (const item of prefixMap) {
    if (rawName.startsWith(item.prefix)) {
      return item.label + rawName.slice(item.prefix.length);
    }
  }

  // Fallback for snake_case feature names like "website_visits"
  return rawName
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function FeatureImportanceList({ features = [] }) {
  const { isDark } = useTheme();

  if (!features || features.length === 0) return null;

  // Display top 10 features per specification
  const topFeatures = features.slice(0, 10);
  const maxImportance = topFeatures[0]?.importance || 1.0;

  return (
    <div className="card model-features-card" role="region" aria-label="Top Predictive Signals">
      <div className="model-features-header">
        <div className="model-features-title-group">
          <div className="model-features-icon" aria-hidden="true">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="section-heading">Top Predictive Signals</h3>
            <p className="card-header-subtitle">
              Relative feature weight magnitude influencing conversion predictions
            </p>
          </div>
        </div>
      </div>

      <div className="features-list-container" style={{ marginTop: '16px' }}>
        {topFeatures.map((item, index) => {
          const formattedName = formatFeatureName(item.feature);
          const weight = item.importance ? Number(item.importance).toFixed(3) : '0.000';
          const fillPercent = Math.min(100, Math.max(10, (item.importance / maxImportance) * 100));

          return (
            <div key={item.feature} className="feature-weight-row">
              <div className="feature-rank-num">#{index + 1}</div>

              <div className="feature-label-and-track">
                <div className="feature-meta-line">
                  <span className="feature-clean-name" title={item.feature}>
                    {formattedName}
                  </span>
                  <span className="feature-weight-num">{weight}</span>
                </div>

                <div
                  className="feature-track"
                  style={{
                    backgroundColor: isDark ? 'rgba(71, 85, 105, 0.25)' : 'rgba(71, 85, 105, 0.12)',
                  }}
                >
                  <div
                    className="feature-fill"
                    style={{
                      width: `${fillPercent}%`,
                      backgroundColor: isDark ? '#E5A93C' : '#D97706',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="feature-explanatory-note">
        <Info size={14} className="feature-note-icon" aria-hidden="true" />
        <p className="feature-note-text">
          Feature importance indicates how strongly each input contributed to the model's predictions in the evaluation pipeline. It does not imply causation.
        </p>
      </div>
    </div>
  );
}
