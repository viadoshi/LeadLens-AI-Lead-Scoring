import React, { useEffect } from 'react';
import { AlertTriangle, X, Archive } from 'lucide-react';

export default function CampaignArchiveModal({
  isOpen,
  campaign,
  onClose,
  onConfirm,
  isArchiving = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !campaign) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="archive-modal-title">
      <div className="modal-container campaign-archive-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge badge-warning" aria-hidden="true">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 id="archive-modal-title" className="modal-title">
                Archive this campaign?
              </h2>
              <p className="modal-subtitle">
                Confirm status transition for {campaign.name}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="modal-close-btn" aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="campaign-archive-body">
          <p className="campaign-archive-msg">
            Archived campaigns will no longer appear in active campaign views or program attribution pipelines.
          </p>
          <div className="campaign-archive-target-box">
            <span className="archive-target-name">{campaign.name}</span>
            <span className="archive-target-leads">
              {campaign.total_leads?.toLocaleString() || 0} leads ({campaign.converted_leads || 0} converted)
            </span>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isArchiving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-danger-archive"
            disabled={isArchiving}
          >
            <Archive size={14} aria-hidden="true" style={{ marginRight: '6px' }} />
            <span>{isArchiving ? 'Archiving...' : 'Archive Campaign'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
