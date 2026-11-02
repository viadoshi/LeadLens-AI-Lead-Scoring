import React, { useState, useMemo } from 'react';
import { Megaphone, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function CampaignPerformanceTable({ campaigns = [] }) {
  const [sortKey, setSortKey] = useState('conversion_rate');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false); // default descending for metrics
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
      return <ArrowUpDown size={12} className="analytics-sort-icon-inactive" aria-hidden="true" />;
    }
    return sortAsc ? (
      <ArrowUp size={12} className="analytics-sort-icon-active" aria-hidden="true" />
    ) : (
      <ArrowDown size={12} className="analytics-sort-icon-active" aria-hidden="true" />
    );
  };

  return (
    <div className="card analytics-card" role="region" aria-label="Campaign Performance Analysis">
      <div className="analytics-card-header">
        <div>
          <div className="analytics-card-title-row">
            <Megaphone size={18} className="analytics-icon-gold" aria-hidden="true" />
            <h2 className="section-heading">Campaign Performance</h2>
          </div>
          <p className="body-text">
            Outbound and inbound campaigns ranked by pipeline generation and conversion yield
          </p>
        </div>
      </div>

      <div className="analytics-table-container">
        <table className="analytics-table" aria-label="Campaigns Ranking Table">
          <thead>
            <tr>
              <th scope="col" onClick={() => handleSort('campaign')} className="analytics-th-sortable">
                <div className="analytics-th-content">
                  <span>Campaign</span>
                  {renderSortIcon('campaign')}
                </div>
              </th>
              <th scope="col" onClick={() => handleSort('total_leads')} className="analytics-th-sortable text-right">
                <div className="analytics-th-content content-right">
                  <span>Leads</span>
                  {renderSortIcon('total_leads')}
                </div>
              </th>
              <th scope="col" onClick={() => handleSort('converted_leads')} className="analytics-th-sortable text-right">
                <div className="analytics-th-content content-right">
                  <span>Conversions</span>
                  {renderSortIcon('converted_leads')}
                </div>
              </th>
              <th scope="col" onClick={() => handleSort('conversion_rate')} className="analytics-th-sortable text-right">
                <div className="analytics-th-content content-right">
                  <span>Conversion Rate</span>
                  {renderSortIcon('conversion_rate')}
                </div>
              </th>
              <th scope="col" onClick={() => handleSort('average_score')} className="analytics-th-sortable text-right">
                <div className="analytics-th-content content-right">
                  <span>Avg Score</span>
                  {renderSortIcon('average_score')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCampaigns.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center" style={{ padding: '24px', color: 'var(--text-secondary)' }}>
                  No campaign records available for this period.
                </td>
              </tr>
            ) : (
              sortedCampaigns.map((c, idx) => (
                <tr key={c.campaign} className="analytics-tr">
                  <td className="analytics-td-campaign">
                    <span className="analytics-campaign-rank">#{idx + 1}</span>
                    <span className="analytics-campaign-name">{c.campaign}</span>
                  </td>
                  <td className="text-right analytics-td-metric">{c.total_leads.toLocaleString()}</td>
                  <td className="text-right analytics-td-metric">{c.converted_leads.toLocaleString()}</td>
                  <td className="text-right">
                    <span className="analytics-rate-pill">{c.conversion_rate.toFixed(1)}%</span>
                  </td>
                  <td className="text-right analytics-td-metric font-semibold">{c.average_score.toFixed(1)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
