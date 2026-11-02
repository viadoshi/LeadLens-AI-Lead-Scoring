import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SegmentBadge from '../ui/SegmentBadge';

export default function LeadTableRow({ lead }) {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/leads/${lead.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/leads/${lead.id}`);
    }
  };

  const formatProbability = (prob) => {
    if (prob === undefined || prob === null) return '—';
    return `${(prob * 100).toFixed(1)}%`;
  };

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
      // Fallback to original
    }
    return dateStr;
  };

  return (
    <tr
      className="dashboard-table-row lead-table-row"
      tabIndex={0}
      role="link"
      onClick={handleRowClick}
      onKeyDown={handleKeyDown}
      aria-label={`Open details for lead ${lead.name} from ${lead.company}`}
    >
      {/* 1. Lead Column: Name + Email */}
      <td>
        <div className="lead-cell-stacked">
          <div className="lead-cell-name">{lead.name}</div>
          <div className="lead-cell-email">{lead.email}</div>
        </div>
      </td>

      {/* 2. Company Column: Company + Industry */}
      <td>
        <div className="company-cell-stacked">
          <div className="company-cell-name">{lead.company}</div>
          <div className="company-cell-industry">{lead.industry}</div>
        </div>
      </td>

      {/* 3. Source */}
      <td>
        <span className="source-tag">{lead.source}</span>
      </td>

      {/* 4. Campaign */}
      <td>
        <span className="campaign-name-cell" title={lead.campaign}>
          {lead.campaign}
        </span>
      </td>

      {/* 5. Score */}
      <td>
        <div className="score-cell">
          <span className="score-number">{lead.score}</span>
          <div className="score-bar-bg" aria-hidden="true">
            <div
              className="score-bar-fill"
              style={{
                width: `${lead.score}%`,
                backgroundColor: 'var(--accent)',
              }}
            />
          </div>
        </div>
      </td>

      {/* 6. Probability */}
      <td>
        <span className="probability-value">{formatProbability(lead.probability)}</span>
      </td>

      {/* 7. Segment Badge */}
      <td>
        <SegmentBadge segment={lead.segment} />
      </td>

      {/* 8. Recommended Action */}
      <td>
        <span className="action-pill">{lead.recommendedAction}</span>
      </td>

      {/* 9. Date Added */}
      <td>
        <span className="date-added-cell">{formatDate(lead.dateAdded)}</span>
      </td>

      {/* 10. Row Action Link */}
      <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn-icon lead-action-btn"
          onClick={handleRowClick}
          aria-label={`View details for ${lead.name}`}
          title="View lead details"
        >
          <ArrowUpRight size={15} aria-hidden="true" />
        </button>
      </td>
    </tr>
  );
}
