import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Archive, Megaphone } from 'lucide-react';
import CampaignStatusBadge from './CampaignStatusBadge';

export default function CampaignDetailHeader({
  campaign,
  onEdit,
  onArchive,
}) {
  if (!campaign) return null;

  return (
    <div className="campaign-detail-header-card">
      <div className="campaign-detail-back-row">
        <Link to="/campaigns" className="campaign-back-link">
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Back to Campaigns</span>
        </Link>
      </div>

      <div className="campaign-detail-main-row">
        <div className="campaign-detail-identity-group">
          <div className="campaign-detail-icon-box" aria-hidden="true">
            <Megaphone size={22} />
          </div>
          <div>
            <div className="campaign-detail-badges-row">
              <CampaignStatusBadge status={campaign.status} />
              <span className="campaign-channel-pill">{campaign.channel}</span>
              <span className="campaign-type-pill">{campaign.campaign_type}</span>
            </div>
            <h1 className="campaign-detail-title">{campaign.name}</h1>
            {campaign.description && (
              <p className="campaign-detail-desc">{campaign.description}</p>
            )}
          </div>
        </div>

        <div className="campaign-detail-actions-row">
          <button
            type="button"
            onClick={onEdit}
            className="btn btn-secondary campaign-header-btn"
            aria-label="Edit campaign"
          >
            <Edit2 size={14} aria-hidden="true" style={{ marginRight: '6px' }} />
            <span>Edit</span>
          </button>
          {campaign.status !== 'Archived' && (
            <button
              type="button"
              onClick={onArchive}
              className="btn btn-secondary campaign-header-btn btn-archive-hover"
              aria-label="Archive campaign"
            >
              <Archive size={14} aria-hidden="true" style={{ marginRight: '6px' }} />
              <span>Archive</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
