import React from 'react';
import { Database } from 'lucide-react';
import SegmentBadge from '../ui/SegmentBadge';

export default function LeadIntelligenceCard({ lead }) {
  if (!lead) return null;

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

  const formattedProbability = lead.probability !== undefined && lead.probability !== null
    ? `${(lead.probability * 100).toFixed(1)}%`
    : '—';

  return (
    <div className="card lead-intelligence-card">
      <div className="card-header-row">
        <div className="card-header-title-group">
          <div className="card-header-icon" aria-hidden="true">
            <Database size={18} />
          </div>
          <div>
            <h2 className="section-heading">Lead Intelligence</h2>
            <p className="card-header-subtitle">Structured attribute matrix</p>
          </div>
        </div>
      </div>

      <div className="intelligence-grid">
        {/* Industry */}
        <div className="intelligence-cell">
          <span className="intel-label">Industry</span>
          <span className="intel-value">{lead.industry}</span>
        </div>

        {/* Source */}
        <div className="intelligence-cell">
          <span className="intel-label">Source</span>
          <span className="intel-value">
            <span className="source-tag">{lead.source}</span>
          </span>
        </div>

        {/* Campaign */}
        <div className="intelligence-cell full-width">
          <span className="intel-label">Campaign</span>
          <span className="intel-value" title={lead.campaign}>
            {lead.campaign}
          </span>
        </div>

        {/* Probability */}
        <div className="intelligence-cell">
          <span className="intel-label">Probability</span>
          <span className="intel-value intel-highlight">{formattedProbability}</span>
        </div>

        {/* Score */}
        <div className="intelligence-cell">
          <span className="intel-label">Score</span>
          <span className="intel-value intel-highlight">{lead.score} / 100</span>
        </div>

        {/* Segment */}
        <div className="intelligence-cell">
          <span className="intel-label">Segment</span>
          <div className="intel-value">
            <SegmentBadge segment={lead.segment} />
          </div>
        </div>

        {/* Date Added */}
        <div className="intelligence-cell">
          <span className="intel-label">Date Added</span>
          <span className="intel-value">{formatDate(lead.dateAdded)}</span>
        </div>
      </div>
    </div>
  );
}
