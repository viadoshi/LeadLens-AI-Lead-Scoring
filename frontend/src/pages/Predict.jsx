import React, { useState } from 'react';
import {
  LeadPredictionForm,
  PredictionResult,
  PredictionEmptyState,
  PredictionErrorState,
  PredictionHistory,
} from '../components/predict';
import Toast from '../components/ui/Toast';
import { predictLeadScore } from '../services/predictionApi';

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  company: '',
  industry: '',
  source: '',
  campaign: 'Q4 Enterprise Inbound',
  companySize: '51-200',
  jobRole: 'Director',
  budgetIdentified: 'Unknown',
  websiteVisits: '',
  pagesViewed: '',
  emailOpens: '',
  emailClicks: '',
  demoRequested: 'No',
  pricingPageViewed: 'No',
  contentDownloaded: 'No',
  webinarAttended: 'No',
  daysSinceLastActivity: '',
  salesContacted: 'No',
};

export default function Predict() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [toast, setToast] = useState(null);

  // Temporary browser session prediction history (max 5)
  const [history, setHistory] = useState([]);

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear inline error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    // Also clear error banner when user alters input
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 1. Required basic fields
    if (!formData.name.trim()) {
      newErrors.name = 'Lead name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!formData.source) {
      newErrors.source = 'Please select a lead source';
    }

    // 2. Non-negative numeric validations
    const checkNonNegative = (val, fieldName, errorKey) => {
      if (val !== '' && val !== undefined && val !== null) {
        const num = Number(val);
        if (isNaN(num) || num < 0) {
          newErrors[errorKey] = `${fieldName} cannot be negative`;
        }
      }
    };

    checkNonNegative(formData.websiteVisits, 'Website visits', 'websiteVisits');
    checkNonNegative(formData.pagesViewed, 'Pages viewed', 'pagesViewed');
    checkNonNegative(formData.emailOpens, 'Email opens', 'emailOpens');
    checkNonNegative(formData.emailClicks, 'Email clicks', 'emailClicks');
    checkNonNegative(formData.daysSinceLastActivity, 'Days since last activity', 'daysSinceLastActivity');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const executePrediction = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const result = await predictLeadScore(formData);
      setPredictionResult(result);

      // Append to browser session prediction history (max 5, most recent first)
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const historyItem = {
        id: String(Date.now()),
        timestamp: timeStr,
        company: formData.company.trim(),
        name: formData.name.trim(),
        score: result.score,
        segment: result.segment,
      };

      setHistory((prev) => [historyItem, ...prev].slice(0, 5));
    } catch (err) {
      setApiError(
        err.message || 'Unable to generate a prediction right now. Make sure the LeadLens AI service is running.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    executePrediction();
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setPredictionResult(null);
    setApiError(null);
  };

  return (
    <div className="predict-page-wrapper">
      {/* 1. Page Header */}
      <div className="predict-page-header">
        <h1 className="page-title">Predict Lead Score</h1>
        <p className="body-lead">
          Evaluate a lead's conversion potential using the live LeadLens AI model.
        </p>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="predict-layout-grid">
        {/* Left Column: Lead Information Form */}
        <div className="predict-form-column">
          <LeadPredictionForm
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </div>

        {/* Right Column: Prediction Result & Session History */}
        <div className="predict-result-column">
          {predictionResult ? (
            <PredictionResult
              result={predictionResult}
              onTakeAction={setToast}
              onReset={handleReset}
            />
          ) : apiError ? (
            <PredictionErrorState
              errorMessage={apiError}
              onRetry={executePrediction}
              isSubmitting={isSubmitting}
            />
          ) : (
            <PredictionEmptyState />
          )}

          {/* Session Inferences History */}
          <PredictionHistory history={history} />
        </div>
      </div>

      {/* 3. Feedback Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          subtext={toast.subtext}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
