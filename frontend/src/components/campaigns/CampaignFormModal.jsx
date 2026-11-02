import React, { useState, useEffect } from 'react';
import { X, Megaphone, AlertCircle } from 'lucide-react';

const CHANNELS = ['LinkedIn', 'Google Ads', 'Email', 'Referral', 'Website', 'Webinar'];
const TYPES = ['Inbound', 'Outbound', 'ABM', 'Content', 'Webinar', 'Retargeting'];
const STATUSES = ['Active', 'Paused', 'Completed', 'Draft'];

export default function CampaignFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  if (!isOpen) return null;

  return (
    <CampaignFormModalDialog
      key={initialData?.id || 'new'}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      isSubmitting={isSubmitting}
    />
  );
}

function CampaignFormModalDialog({
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}) {
  const isEdit = Boolean(initialData?.id);

  const [formData, setFormData] = useState(() => ({
    name: initialData?.name || '',
    description: initialData?.description || '',
    channel: initialData?.channel || 'LinkedIn',
    campaign_type: initialData?.campaign_type || 'Inbound',
    status: initialData?.status || 'Active',
    start_date: initialData?.start_date || new Date().toISOString().split('T')[0],
    end_date: initialData?.end_date || '',
    budget: initialData?.budget !== undefined ? String(initialData.budget) : '15000',
    owner: initialData?.owner || 'Sarah Jenkins',
  }));

  const [errors, setErrors] = useState({});

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Campaign name is required.';
    if (!formData.channel.trim()) errs.channel = 'Channel is required.';
    if (!formData.campaign_type.trim()) errs.campaign_type = 'Campaign type is required.';
    if (!formData.start_date) errs.start_date = 'Start date is required.';

    const budgetNum = parseFloat(formData.budget);
    if (isNaN(budgetNum) || budgetNum < 0) {
      errs.budget = 'Budget must be a number greater than or equal to 0.';
    }

    if (formData.start_date && formData.end_date) {
      if (formData.end_date < formData.start_date) {
        errs.end_date = 'End date cannot be earlier than start date.';
      }
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      channel: formData.channel,
      campaign_type: formData.campaign_type,
      status: formData.status,
      start_date: formData.start_date,
      end_date: formData.end_date ? formData.end_date : null,
      budget: parseFloat(formData.budget) || 0,
      owner: formData.owner.trim() || 'Sarah Jenkins',
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="campaign-modal-title">
      <div className="modal-container campaign-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge" aria-hidden="true">
              <Megaphone size={18} />
            </div>
            <div>
              <h2 id="campaign-modal-title" className="modal-title">
                {isEdit ? 'Edit Campaign' : 'Create New Campaign'}
              </h2>
              <p className="modal-subtitle">
                {isEdit
                  ? `Update campaign parameters for ${initialData?.name}`
                  : 'Configure an inbound, outbound, or ABM campaign initiative'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {/* Campaign Name */}
          <div className="form-field">
            <label htmlFor="camp-name" className="field-label">
              Campaign Name <span className="required-star">*</span>
            </label>
            <input
              id="camp-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Q4 Inbound Revenue Tour"
              className={`input-field ${errors.name ? 'input-error' : ''}`}
            />
            {errors.name && (
              <span className="field-error-msg">
                <AlertCircle size={12} aria-hidden="true" />
                {errors.name}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="form-field">
            <label htmlFor="camp-desc" className="field-label">
              Description
            </label>
            <textarea
              id="camp-desc"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Strategic campaign scope, audience target, and motion goal..."
              className="input-field"
            />
          </div>

          {/* Channel & Campaign Type */}
          <div className="form-group-row">
            <div className="form-field">
              <label htmlFor="camp-channel" className="field-label">
                Channel <span className="required-star">*</span>
              </label>
              <select
                id="camp-channel"
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                className="input-field"
              >
                {CHANNELS.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="camp-type" className="field-label">
                Campaign Type <span className="required-star">*</span>
              </label>
              <select
                id="camp-type"
                value={formData.campaign_type}
                onChange={(e) => setFormData({ ...formData, campaign_type: e.target.value })}
                className="input-field"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Budget */}
          <div className="form-group-row">
            <div className="form-field">
              <label htmlFor="camp-status" className="field-label">
                Status
              </label>
              <select
                id="camp-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field"
              >
                {STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="camp-budget" className="field-label">
                Budget (USD) <span className="required-star">*</span>
              </label>
              <input
                id="camp-budget"
                type="number"
                min="0"
                step="500"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className={`input-field ${errors.budget ? 'input-error' : ''}`}
              />
              {errors.budget && (
                <span className="field-error-msg">
                  <AlertCircle size={12} aria-hidden="true" />
                  {errors.budget}
                </span>
              )}
            </div>
          </div>

          {/* Start Date & End Date */}
          <div className="form-group-row">
            <div className="form-field">
              <label htmlFor="camp-start-date" className="field-label">
                Start Date <span className="required-star">*</span>
              </label>
              <input
                id="camp-start-date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className={`input-field ${errors.start_date ? 'input-error' : ''}`}
              />
              {errors.start_date && (
                <span className="field-error-msg">
                  <AlertCircle size={12} aria-hidden="true" />
                  {errors.start_date}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="camp-end-date" className="field-label">
                End Date (Optional)
              </label>
              <input
                id="camp-end-date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className={`input-field ${errors.end_date ? 'input-error' : ''}`}
              />
              {errors.end_date && (
                <span className="field-error-msg">
                  <AlertCircle size={12} aria-hidden="true" />
                  {errors.end_date}
                </span>
              )}
            </div>
          </div>

          {/* Owner */}
          <div className="form-field">
            <label htmlFor="camp-owner" className="field-label">
              Owner
            </label>
            <input
              id="camp-owner"
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              placeholder="e.g. Sarah Jenkins"
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : isEdit
                ? 'Save Changes'
                : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
