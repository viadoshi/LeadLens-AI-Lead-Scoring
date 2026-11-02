import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ExternalLink } from 'lucide-react';
import SegmentBadge from '../ui/SegmentBadge';

export default function CampaignTopLeads({ topLeads = [] }) {
  if (!topLeads || topLeads.length === 0) {
    return (
      <div className="card campaign-card" role="region" aria-label="Top Campaign Leads">
        <div className="campaign-card-header">
          <div>
            <div className="campaign-card-title-row">
              <Award size={16} className="campaign-icon-gold" aria-hidden="true" />
              <h2 className="section-heading">High-Priority Campaign Leads</h2>
            </div>
            <p className="body-text">Top-scoring opportunities captured through this campaign</p>
          </div>
        </div>
        <div className="campaign-chart-empty">No high-priority leads captured in this campaign yet.</div>
      </div>
    );
  }

  return (
    <div className="card campaign-card" role="region" aria-label="Top Campaign Leads">
      <div className="campaign-card-header">
        <div>
          <div className="campaign-card-title-row">
            <Award size={16} className="campaign-icon-gold" aria-hidden="true" />
            <h2 className="section-heading">High-Priority Campaign Leads</h2>
          </div>
          <p className="body-text">Top-scoring opportunities captured through this campaign</p>
        </div>
      </div>

      <div className="campaign-table-container">
        <table className="campaign-table" aria-label="Top Campaign Leads Table">
          <thead>
            <tr>
              <th scope="col">Lead</th>
              <th scope="col">Company</th>
              <th scope="col" className="text-right">Score</th>
              <th scope="col">Segment</th>
              <th scope="col">Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {topLeads.map((l) => (
              <tr key={l.lead_id} className="campaign-tr">
                <td>
                  <Link
                    to={`/leads/${l.lead_id}`}
                    className="campaign-lead-link"
                    title={`View Lead #${l.lead_id}`}
                  >
                    <span className="lead-name-text">{l.name}</span>
                    <ExternalLink size={12} className="lead-ext-icon" aria-hidden="true" />
                  </Link>
                </td>
                <td className="lead-company-text">{l.company}</td>
                <td className="text-right font-bold lead-score-text">{l.score}</td>
                <td>
                  <SegmentBadge segment={l.segment} />
                </td>
                <td className="lead-action-text">{l.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
