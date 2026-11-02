import React, { useState, useEffect, useRef } from 'react';
import { X, Edit3, Info } from 'lucide-react';
import {
  SOURCE_OPTIONS,
  CAMPAIGN_OPTIONS,
  INDUSTRY_OPTIONS,
} from '../../utils/mockLeadsData';

function EditLeadModalContent({ onClose, lead, onSave }) {
  const [formData, setFormData] = useState({
    name: lead.name || '',
    email: lead.email || '',
    company: lead.company || '',
    industry: lead.industry || INDUSTRY_OPTIONS[0],
    source: lead.source || SOURCE_OPTIONS[0],
    campaign: lead.campaign || CAMPAIGN_OPTIONS[0],
  });

  const firstInputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...lead,
      ...formData,
    });
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-lead-modal-title"
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge" aria-hidden="true">
              <Edit3 size={18} />
            </div>
            <div>
              <h2 id="edit-lead-modal-title" className="modal-title">
                Edit Lead
              </h2>
              <p className="modal-subtitle">Temporary UI demo preview</p>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon modal-close-btn"
            onClick={onClose}
            aria-label="Close edit lead modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="demo-notice-banner" role="note">
              <Info size={15} aria-hidden="true" />
              <span>
                <strong>Demo Mode:</strong> Database updates are not implemented in this phase. Changes apply only to the temporary session preview.
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="edit-lead-name" className="form-label">
                Lead Full Name
              </label>
              <input
                ref={firstInputRef}
                type="text"
                id="edit-lead-name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="edit-lead-email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="edit-lead-email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-lead-company" className="form-label">
                  Company
                </label>
                <input
                  type="text"
                  id="edit-lead-company"
                  name="company"
                  className="form-input"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-lead-industry" className="form-label">
                Industry
              </label>
              <select
                id="edit-lead-industry"
                name="industry"
                className="form-select"
                value={formData.industry}
                onChange={handleChange}
              >
                {INDUSTRY_OPTIONS.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="edit-lead-source" className="form-label">
                  Lead Source
                </label>
                <select
                  id="edit-lead-source"
                  name="source"
                  className="form-select"
                  value={formData.source}
                  onChange={handleChange}
                >
                  {SOURCE_OPTIONS.map((src) => (
                    <option key={src} value={src}>
                      {src}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="edit-lead-campaign" className="form-label">
                  Campaign
                </label>
                <select
                  id="edit-lead-campaign"
                  name="campaign"
                  className="form-select"
                  value={formData.campaign}
                  onChange={handleChange}
                >
                  {CAMPAIGN_OPTIONS.map((camp) => (
                    <option key={camp} value={camp}>
                      {camp}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditLeadModal({ isOpen, onClose, lead, onSave }) {
  if (!isOpen || !lead) return null;
  return <EditLeadModalContent onClose={onClose} lead={lead} onSave={onSave} />;
}
