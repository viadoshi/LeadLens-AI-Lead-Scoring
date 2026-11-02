import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Building2, User } from 'lucide-react';
import SegmentBadge from '../ui/SegmentBadge';

export default function PriorityLeadsTable({ leads = [] }) {
  const navigate = useNavigate();

  const handleRowClick = (leadId) => {
    navigate(`/leads/${leadId}`);
  };

  const handleKeyDown = (event, leadId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(`/leads/${leadId}`);
    }
  };

  return (
    <div className="card dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h2 className="section-heading">Top Priority Leads</h2>
          <p className="body-text">Highest scoring prospects requiring immediate sales engagement</p>
        </div>

        {/* View All Leads Link */}
        <Link
          to="/leads"
          className="btn-secondary view-all-leads-btn"
          aria-label="View all leads directory"
        >
          <span>View All Leads</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>

      <div className="table-responsive-wrapper" style={{ marginTop: '16px' }}>
        <table className="dashboard-table" aria-label="Top Priority Leads">
          <thead>
            <tr>
              <th scope="col">Lead</th>
              <th scope="col">Company</th>
              <th scope="col">Score</th>
              <th scope="col">Segment</th>
              <th scope="col">Recommended Action</th>
              <th scope="col" aria-label="Details Link"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((item) => (
              <tr
                key={item.id}
                className="dashboard-table-row"
                tabIndex={0}
                role="link"
                onClick={() => handleRowClick(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                aria-label={`Open details for lead ${item.lead} from ${item.company}`}
              >
                {/* Lead Contact Info */}
                <td>
                  <div className="lead-cell">
                    <div className="lead-avatar-placeholder" aria-hidden="true">
                      <User size={14} />
                    </div>
                    <div>
                      <div className="lead-name">{item.lead}</div>
                      <div className="lead-title">{item.title}</div>
                    </div>
                  </div>
                </td>

                {/* Company Name */}
                <td>
                  <div className="company-cell">
                    <Building2 size={14} className="company-icon" aria-hidden="true" />
                    <span>{item.company}</span>
                  </div>
                </td>

                {/* Score */}
                <td>
                  <div className="score-cell">
                    <span className="score-number">{item.score}</span>
                    <div className="score-bar-bg" aria-hidden="true">
                      <div
                        className="score-bar-fill"
                        style={{
                          width: `${item.score}%`,
                          backgroundColor: 'var(--accent)',
                        }}
                      />
                    </div>
                  </div>
                </td>

                {/* Segment Badge */}
                <td>
                  <SegmentBadge segment={item.segment} />
                </td>

                {/* Recommended Sales Action */}
                <td>
                  <span className="action-pill">{item.recommendedAction}</span>
                </td>

                {/* Chevron */}
                <td style={{ textAlign: 'right' }}>
                  <ChevronRight size={16} className="table-chevron-icon" aria-hidden="true" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
