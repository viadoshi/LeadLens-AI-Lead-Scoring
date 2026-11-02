import React, { useState, useEffect, useRef } from 'react';
import { X, UserPlus, Info } from 'lucide-react';
import { SOURCE_OPTIONS, CAMPAIGN_OPTIONS, INDUSTRY_OPTIONS } from '../../utils/mockLeadsData';

export default function AddLeadModal({ isOpen, onClose, onAddLead }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState(INDUSTRY_OPTIONS[0]);
  const [source, setSource] = useState(SOURCE_OPTIONS[0]);
  const [campaign, setCampaign] = useState(CAMPAIGN_OPTIONS[0]);
  const [errors, setErrors] = useState({});

  const nameInputRef = useRef(null);

  // Focus first input on open, and handle Escape key to close
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Lead name is required';
    if (!email.trim()) newErrors.email = 'Email address is required';
    if (!company.trim()) newErrors.company = 'Company name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Temporary scoring simulation for local UI demo
    const simulatedScore = Math.floor(Math.random() * (95 - 65 + 1)) + 65;
    const simulatedProb = Number((simulatedScore / 100).toFixed(3));
    const simulatedSegment = simulatedScore >= 80 ? 'HOT' : 'WARM';

    const newLead = {
      id: String(Date.now()),
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      industry,
      source,
      campaign,
      score: simulatedScore,
      probability: simulatedProb,
      segment: simulatedSegment,
      recommendedAction: simulatedScore >= 80 ? 'Contact immediately' : 'Schedule demo',
      dateAdded: new Date().toISOString().split('T')[0],
    };

    onAddLead(newLead);
    // Reset and close
    setName('');
    setEmail('');
    setCompany('');
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div
        className="card modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-icon-badge" aria-hidden="true">
              <UserPlus size={18} />
            </div>
            <div>
              <h2 id="modal-title" className="section-heading" style={{ fontSize: '18px' }}>
                Add New Lead
              </h2>
              <p className="body-text" style={{ fontSize: '12px' }}>
                Create a prospect profile for scoring and attribution
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Temporary Notice */}
        <div className="modal-phase-notice">
          <Info size={14} className="notice-icon" aria-hidden="true" />
          <span>
            Phase 2.3 UI preview: new leads are simulated in local session memory. Future phases will persist to MySQL.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group-row">
            {/* Lead Name */}
            <div className="form-field">
              <label htmlFor="lead-name" className="field-label">
                Lead Name <span className="required-star">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="lead-name"
                type="text"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                placeholder="e.g. Jordan Hayes"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
              />
              {errors.name && <span className="field-error-text">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-field">
              <label htmlFor="lead-email" className="field-label">
                Work Email <span className="required-star">*</span>
              </label>
              <input
                id="lead-email"
                type="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="e.g. jordan@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
              />
              {errors.email && <span className="field-error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group-row">
            {/* Company */}
            <div className="form-field">
              <label htmlFor="lead-company" className="field-label">
                Company Name <span className="required-star">*</span>
              </label>
              <input
                id="lead-company"
                type="text"
                className={`form-input ${errors.company ? 'input-error' : ''}`}
                placeholder="e.g. Acme Cloud Corp"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  if (errors.company) setErrors({ ...errors, company: null });
                }}
              />
              {errors.company && <span className="field-error-text">{errors.company}</span>}
            </div>

            {/* Industry */}
            <div className="form-field">
              <label htmlFor="lead-industry" className="field-label">
                Industry
              </label>
              <select
                id="lead-industry"
                className="form-select"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                {INDUSTRY_OPTIONS.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group-row">
            {/* Source */}
            <div className="form-field">
              <label htmlFor="lead-source-select" className="field-label">
                Lead Source
              </label>
              <select
                id="lead-source-select"
                className="form-select"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              >
                {SOURCE_OPTIONS.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            {/* Campaign */}
            <div className="form-field">
              <label htmlFor="lead-campaign-select" className="field-label">
                Attribution Campaign
              </label>
              <select
                id="lead-campaign-select"
                className="form-select"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
              >
                {CAMPAIGN_OPTIONS.map((cmp) => (
                  <option key={cmp} value={cmp}>
                    {cmp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions-row">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <UserPlus size={15} aria-hidden="true" />
              <span>Add Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
