import React from 'react';
import {
  User,
  Mail,
  Building2,
  Briefcase,
  Compass,
  Target,
  Calendar,
} from 'lucide-react';

export default function LeadIdentityCard({ lead }) {
  if (!lead) return null;

  // Format YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const date = new Date(parts[0], parts[1] - 1, parts[2]);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch {
      // Fallback
    }
    return dateStr;
  };

  // Extract initials for avatar icon
  const getInitials = (name) => {
    if (!name) return 'LD';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="card lead-identity-card">
      <div className="card-header-row">
        <div className="card-header-title-group">
          <div className="card-header-icon" aria-hidden="true">
            <User size={18} />
          </div>
          <div>
            <h2 className="section-heading">Lead Identity</h2>
            <p className="card-header-subtitle">Account & contact profile</p>
          </div>
        </div>
      </div>

      <div className="identity-profile-top">
        <div className="identity-avatar-box" aria-hidden="true">
          {getInitials(lead.name)}
        </div>
        <div className="identity-title-group">
          <div className="identity-lead-name">{lead.name}</div>
          <div className="identity-lead-company">{lead.company}</div>
        </div>
      </div>

      <div className="identity-fields-list">
        {/* Email */}
        <div className="identity-field-row">
          <div className="field-label-group">
            <Mail size={15} className="field-icon" aria-hidden="true" />
            <span className="field-label">Email Address</span>
          </div>
          <div className="field-value-wrapper">
            <a
              href={`mailto:${lead.email}`}
              className="identity-email-link"
              title={`Send email to ${lead.email}`}
            >
              {lead.email}
            </a>
          </div>
        </div>

        {/* Company */}
        <div className="identity-field-row">
          <div className="field-label-group">
            <Building2 size={15} className="field-icon" aria-hidden="true" />
            <span className="field-label">Company</span>
          </div>
          <span className="field-value-text">{lead.company}</span>
        </div>

        {/* Industry */}
        <div className="identity-field-row">
          <div className="field-label-group">
            <Briefcase size={15} className="field-icon" aria-hidden="true" />
            <span className="field-label">Industry</span>
          </div>
          <span className="field-value-text">{lead.industry}</span>
        </div>

        {/* Lead Source */}
        <div className="identity-field-row">
          <div className="field-label-group">
            <Compass size={15} className="field-icon" aria-hidden="true" />
            <span className="field-label">Lead Source</span>
          </div>
          <span className="source-tag">{lead.source}</span>
        </div>

        {/* Campaign */}
        <div className="identity-field-row">
          <div className="field-label-group">
            <Target size={15} className="field-icon" aria-hidden="true" />
            <span className="field-label">Campaign</span>
          </div>
          <span className="field-value-text" title={lead.campaign}>
            {lead.campaign}
          </span>
        </div>

        {/* Date Added */}
        <div className="identity-field-row">
          <div className="field-label-group">
            <Calendar size={15} className="field-icon" aria-hidden="true" />
            <span className="field-label">Date Added</span>
          </div>
          <span className="field-value-text">{formatDate(lead.dateAdded)}</span>
        </div>
      </div>
    </div>
  );
}
