import React from 'react';
import {
  Sparkles,
  RotateCcw,
  User,
  Activity,
  Building2,
  Loader2,
} from 'lucide-react';
import {
  PREDICT_INDUSTRY_OPTIONS,
  PREDICT_SOURCE_OPTIONS,
  PREDICT_CAMPAIGN_OPTIONS,
  PREDICT_COMPANY_SIZE_OPTIONS,
  PREDICT_JOB_ROLE_OPTIONS,
  PREDICT_BUDGET_OPTIONS,
  PREDICT_BINARY_OPTIONS,
} from '../../utils/mockPrediction';

export default function LeadPredictionForm({
  formData,
  errors = {},
  isSubmitting = false,
  onChange,
  onSubmit,
  onReset,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="card predict-form-card">
      <div className="card-header-row">
        <div>
          <h2 className="section-heading">Lead Information</h2>
          <p className="card-header-subtitle">
            Enter the lead's business and engagement details.
          </p>
        </div>

        <button
          type="button"
          className="btn-ghost form-reset-link"
          onClick={onReset}
          disabled={isSubmitting}
          aria-label="Clear form inputs"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>Reset Form</span>
        </button>
      </div>

      <form onSubmit={onSubmit} noValidate>
        {/* 1. Basic Information Group */}
        <fieldset className="predict-form-group-section">
          <legend className="form-group-legend">
            <User size={15} className="legend-icon" aria-hidden="true" />
            <span>Basic Information</span>
          </legend>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="lead-name" className="form-label">
                Lead Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="lead-name"
                name="name"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Sarah Mitchell"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'lead-name-error' : undefined}
                required
              />
              {errors.name && (
                <span id="lead-name-error" className="field-error-message" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="work-email" className="form-label">
                Work Email <span className="required-star">*</span>
              </label>
              <input
                type="email"
                id="work-email"
                name="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="sarah@company.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'work-email-error' : undefined}
                required
              />
              {errors.email && (
                <span id="work-email-error" className="field-error-message" role="alert">
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="company-name" className="form-label">
                Company <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="company-name"
                name="company"
                className={`form-input ${errors.company ? 'input-error' : ''}`}
                placeholder="e.g. Acme Technologies"
                value={formData.company}
                onChange={handleInputChange}
                disabled={isSubmitting}
                aria-invalid={!!errors.company}
                aria-describedby={errors.company ? 'company-name-error' : undefined}
                required
              />
              {errors.company && (
                <span id="company-name-error" className="field-error-message" role="alert">
                  {errors.company}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="industry-select" className="form-label">
                Industry <span className="required-star">*</span>
              </label>
              <select
                id="industry-select"
                name="industry"
                className={`form-select ${errors.industry ? 'input-error' : ''}`}
                value={formData.industry}
                onChange={handleInputChange}
                disabled={isSubmitting}
                aria-invalid={!!errors.industry}
                aria-describedby={errors.industry ? 'industry-select-error' : undefined}
                required
              >
                <option value="">Select industry</option>
                {PREDICT_INDUSTRY_OPTIONS.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <span id="industry-select-error" className="field-error-message" role="alert">
                  {errors.industry}
                </span>
              )}
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="source-select" className="form-label">
                Lead Source <span className="required-star">*</span>
              </label>
              <select
                id="source-select"
                name="source"
                className={`form-select ${errors.source ? 'input-error' : ''}`}
                value={formData.source}
                onChange={handleInputChange}
                disabled={isSubmitting}
                aria-invalid={!!errors.source}
                aria-describedby={errors.source ? 'source-select-error' : undefined}
                required
              >
                <option value="">Select lead source</option>
                {PREDICT_SOURCE_OPTIONS.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
              {errors.source && (
                <span id="source-select-error" className="field-error-message" role="alert">
                  {errors.source}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="campaign-select" className="form-label">
                Campaign
              </label>
              <select
                id="campaign-select"
                name="campaign"
                className="form-select"
                value={formData.campaign}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {PREDICT_CAMPAIGN_OPTIONS.map((camp) => (
                  <option key={camp} value={camp}>
                    {camp}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* 2. Engagement Signals Group */}
        <fieldset className="predict-form-group-section">
          <legend className="form-group-legend">
            <Activity size={15} className="legend-icon" aria-hidden="true" />
            <span>Engagement Signals</span>
          </legend>

          <div className="form-group-grid-four">
            <div className="form-group">
              <label htmlFor="website-visits" className="form-label">
                Website Visits
              </label>
              <input
                type="number"
                id="website-visits"
                name="websiteVisits"
                min="0"
                className={`form-input ${errors.websiteVisits ? 'input-error' : ''}`}
                placeholder="5"
                value={formData.websiteVisits}
                onChange={handleInputChange}
                disabled={isSubmitting}
                aria-invalid={!!errors.websiteVisits}
                aria-describedby={errors.websiteVisits ? 'website-visits-error' : undefined}
              />
              {errors.websiteVisits && (
                <span id="website-visits-error" className="field-error-message" role="alert">
                  {errors.websiteVisits}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="pages-viewed" className="form-label">
                Pages Viewed
              </label>
              <input
                type="number"
                id="pages-viewed"
                name="pagesViewed"
                min="0"
                className={`form-input ${errors.pagesViewed ? 'input-error' : ''}`}
                placeholder="12"
                value={formData.pagesViewed}
                onChange={handleInputChange}
                disabled={isSubmitting}
                aria-invalid={!!errors.pagesViewed}
                aria-describedby={errors.pagesViewed ? 'pages-viewed-error' : undefined}
              />
              {errors.pagesViewed && (
                <span id="pages-viewed-error" className="field-error-message" role="alert">
                  {errors.pagesViewed}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email-opens" className="form-label">
                Email Opens
              </label>
              <input
                type="number"
                id="email-opens"
                name="emailOpens"
                min="0"
                className={`form-input ${errors.emailOpens ? 'input-error' : ''}`}
                placeholder="3"
                value={formData.emailOpens}
                onChange={handleInputChange}
                disabled={isSubmitting}
                aria-invalid={!!errors.emailOpens}
                aria-describedby={errors.emailOpens ? 'email-opens-error' : undefined}
              />
              {errors.emailOpens && (
                <span id="email-opens-error" className="field-error-message" role="alert">
                  {errors.emailOpens}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email-clicks" className="form-label">
                Email Clicks
              </label>
              <input
                type="number"
                id="email-clicks"
                name="emailClicks"
                min="0"
                className={`form-input ${errors.emailClicks ? 'input-error' : ''}`}
                placeholder="1"
                value={formData.emailClicks}
                onChange={handleInputChange}
                disabled={isSubmitting}
                aria-invalid={!!errors.emailClicks}
                aria-describedby={errors.emailClicks ? 'email-clicks-error' : undefined}
              />
              {errors.emailClicks && (
                <span id="email-clicks-error" className="field-error-message" role="alert">
                  {errors.emailClicks}
                </span>
              )}
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="demo-requested" className="form-label">
                Demo Requested
              </label>
              <select
                id="demo-requested"
                name="demoRequested"
                className="form-select"
                value={formData.demoRequested}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {PREDICT_BINARY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pricing-viewed" className="form-label">
                Pricing Page Viewed
              </label>
              <select
                id="pricing-viewed"
                name="pricingPageViewed"
                className="form-select"
                value={formData.pricingPageViewed}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {PREDICT_BINARY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="content-downloaded" className="form-label">
                Content Downloaded
              </label>
              <select
                id="content-downloaded"
                name="contentDownloaded"
                className="form-select"
                value={formData.contentDownloaded}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {PREDICT_BINARY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="webinar-attended" className="form-label">
                Webinar Attended
              </label>
              <select
                id="webinar-attended"
                name="webinarAttended"
                className="form-select"
                value={formData.webinarAttended}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {PREDICT_BINARY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* 3. Company & Qualification Signals */}
        <fieldset className="predict-form-group-section">
          <legend className="form-group-legend">
            <Building2 size={15} className="legend-icon" aria-hidden="true" />
            <span>Company & Qualification Signals</span>
          </legend>

          <div className="form-group-row-three">
            <div className="form-group">
              <label htmlFor="company-size" className="form-label">
                Company Size
              </label>
              <select
                id="company-size"
                name="companySize"
                className="form-select"
                value={formData.companySize}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {PREDICT_COMPANY_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="job-role" className="form-label">
                Job Role
              </label>
              <select
                id="job-role"
                name="jobRole"
                className="form-select"
                value={formData.jobRole}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {PREDICT_JOB_ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="budget-identified" className="form-label">
                Budget Identified
              </label>
              <select
                id="budget-identified"
                name="budgetIdentified"
                className="form-select"
                value={formData.budgetIdentified}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {PREDICT_BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="days-since-last-activity" className="form-label">
                Days Since Last Activity
              </label>
              <input
                type="number"
                id="days-since-last-activity"
                name="daysSinceLastActivity"
                min="0"
                className={`form-input ${errors.daysSinceLastActivity ? 'input-error' : ''}`}
                placeholder="e.g. 3"
                value={formData.daysSinceLastActivity}
                onChange={handleInputChange}
                disabled={isSubmitting}
                aria-invalid={!!errors.daysSinceLastActivity}
                aria-describedby={errors.daysSinceLastActivity ? 'days-since-last-activity-error' : undefined}
              />
              {errors.daysSinceLastActivity && (
                <span id="days-since-last-activity-error" className="field-error-message" role="alert">
                  {errors.daysSinceLastActivity}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sales-contacted" className="form-label">
                Sales Contacted
              </label>
              <select
                id="sales-contacted"
                name="salesContacted"
                className="form-select"
                value={formData.salesContacted}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {PREDICT_BINARY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* 4. Form Action Buttons */}
        <div className="predict-form-actions-row">
          <button
            type="button"
            className="btn-secondary"
            onClick={onReset}
            disabled={isSubmitting}
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn-primary predict-submit-btn"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="spinning-icon" aria-hidden="true" />
                <span>Analyzing Lead...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} aria-hidden="true" />
                <span>Predict Lead Score</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
