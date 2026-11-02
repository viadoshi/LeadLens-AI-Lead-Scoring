import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, ArrowUp, ArrowDown, Edit2, Archive, ExternalLink } from 'lucide-react';
import CampaignStatusBadge from './CampaignStatusBadge';

export default function CampaignTable({
  campaigns = [],
  onEditCampaign,
  onArchiveCampaign,
}) {
  const [sortKey, setSortKey] = useState('conversion_rate');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false); // Default descending for numerical metrics
    }
  };

  const sortedCampaigns = useMemo(() => {
    return [...campaigns].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortAsc ? aVal - bVal : bVal - aVal;
    });
  }, [campaigns, sortKey, sortAsc]);

  const renderSortIcon = (key) => {
    if (sortKey !== key) {
      return <ArrowUpDown size={12} className="campaign-sort-inactive" aria-hidden="true" />;
    }
    return sortAsc ? (
      <ArrowUp size={12} className="campaign-sort-active" aria-hidden="true" />
    ) : (
      <ArrowDown size={12} className="campaign-sort-active" aria-hidden="true" />
    );
  };

  return (
    <div className="card campaign-table-card" role="region" aria-label="Campaign Directory Table">
      <div className="campaign-table-container">
        <table className="campaign-table" aria-label="Marketing Campaigns Directory">
          <thead>
            <tr>
              <th scope="col" onClick={() => handleSort('name')} className="campaign-th-sortable">
                <div className="campaign-th-content">
                  <span>Campaign</span>
                  {renderSortIcon('name')}
                </div>
              </th>
              <th scope="col" onClick={() => handleSort('status')} className="campaign-th-sortable">
                <div className="campaign-th-content">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>
              <th scope="col" onClick={() => handleSort('channel')} className="campaign-th-sortable">
                <div className="campaign-th-content">
                  <span>Channel</span>
                  {renderSortIcon('channel')}
                </div>
              </th>
              <th scope="col" onClick={() => handleSort('total_leads')} className="campaign-th-sortable text-right">
                <div className="campaign-th-content content-right">
                  <span>Leads</span>
                  {renderSortIcon('total_leads')}
                </div>
              </th>
              <th scope="col" onClick={() => handleSort('converted_leads')} className="campaign-th-sortable text-right">
                <div className="campaign-th-content content-right">
                  <span>Conversions</span>
                  {renderSortIcon('converted_leads')}
                </div>
              </th>
              <th scope="col" onClick={() => handleSort('conversion_rate')} className="campaign-th-sortable text-right">
                <div className="campaign-th-content content-right">
                  <span>Conversion Rate</span>
                  {renderSortIcon('conversion_rate')}
                </div>
              </th>
              <th scope="col" onClick={() => handleSort('average_score')} className="campaign-th-sortable text-right">
                <div className="campaign-th-content content-right">
                  <span>Avg Score</span>
                  {renderSortIcon('average_score')}
                </div>
              </th>
              <th scope="col">Owner</th>
              <th scope="col" className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCampaigns.length === 0 ? (
              <tr>
                <td colSpan="9" className="campaign-td-empty">
                  No campaigns match the selected filters or search query.
                </td>
              </tr>
            ) : (
              sortedCampaigns.map((c) => (
                <tr key={c.id} className="campaign-tr">
                  {/* Campaign Name + Description + Link to /campaigns/:id */}
                  <td className="campaign-td-name">
                    <Link to={`/campaigns/${c.id}`} className="campaign-name-link" title={`View details for ${c.name}`}>
                      <span>{c.name}</span>
                      <ExternalLink size={12} className="campaign-ext-icon" aria-hidden="true" />
                    </Link>
                    {c.description && <p className="campaign-desc-text">{c.description}</p>}
                  </td>

                  {/* Status Badge */}
                  <td>
                    <CampaignStatusBadge status={c.status} />
                  </td>

                  {/* Channel & Type Badge */}
                  <td>
                    <div className="campaign-channel-cell">
                      <span className="campaign-channel-pill">{c.channel}</span>
                      <span className="campaign-type-pill">{c.campaign_type}</span>
                    </div>
                  </td>

                  {/* Metrics */}
                  <td className="text-right campaign-metric-cell">
                    {c.total_leads.toLocaleString()}
                  </td>
                  <td className="text-right campaign-metric-cell">
                    {c.converted_leads.toLocaleString()}
                  </td>
                  <td className="text-right">
                    <span className="campaign-rate-badge">{c.conversion_rate.toFixed(1)}%</span>
                  </td>
                  <td className="text-right campaign-metric-cell font-bold">
                    {c.total_leads > 0 ? c.average_score.toFixed(1) : '—'}
                  </td>

                  {/* Owner */}
                  <td className="campaign-owner-cell">
                    <span>{c.owner}</span>
                  </td>

                  {/* Action Menu (Edit / Archive) */}
                  <td className="text-right campaign-actions-cell">
                    <div className="campaign-actions-group">
                      <button
                        type="button"
                        onClick={() => onEditCampaign(c)}
                        className="campaign-action-btn"
                        title="Edit Campaign"
                        aria-label={`Edit ${c.name}`}
                      >
                        <Edit2 size={14} />
                      </button>
                      {c.status !== 'Archived' && (
                        <button
                          type="button"
                          onClick={() => onArchiveCampaign(c)}
                          className="campaign-action-btn btn-archive"
                          title="Archive Campaign"
                          aria-label={`Archive ${c.name}`}
                        >
                          <Archive size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
