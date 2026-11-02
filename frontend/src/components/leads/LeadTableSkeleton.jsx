import React from 'react';

export default function LeadTableSkeleton({ rowsCount = 8 }) {
  const rows = Array.from({ length: rowsCount }, (_, i) => i);

  return (
    <div className="table-responsive-wrapper leads-table-container skeleton-table-container" aria-busy="true">
      <table className="dashboard-table leads-data-table">
        <thead>
          <tr>
            <th>Lead</th>
            <th>Company</th>
            <th>Source</th>
            <th>Campaign</th>
            <th>Score</th>
            <th>Probability</th>
            <th>Segment</th>
            <th>Recommended Action</th>
            <th>Date Added</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row} className="skeleton-card">
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="skeleton-line" style={{ width: '120px', height: '14px' }} />
                  <div className="skeleton-line" style={{ width: '160px', height: '10px' }} />
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="skeleton-line" style={{ width: '130px', height: '13px' }} />
                  <div className="skeleton-line" style={{ width: '90px', height: '10px' }} />
                </div>
              </td>
              <td>
                <div className="skeleton-line" style={{ width: '65px', height: '18px', borderRadius: '4px' }} />
              </td>
              <td>
                <div className="skeleton-line" style={{ width: '110px', height: '12px' }} />
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="skeleton-line" style={{ width: '22px', height: '14px' }} />
                  <div className="skeleton-line" style={{ width: '48px', height: '6px' }} />
                </div>
              </td>
              <td>
                <div className="skeleton-line" style={{ width: '45px', height: '14px' }} />
              </td>
              <td>
                <div className="skeleton-line" style={{ width: '55px', height: '18px', borderRadius: '4px' }} />
              </td>
              <td>
                <div className="skeleton-line" style={{ width: '110px', height: '18px', borderRadius: '4px' }} />
              </td>
              <td>
                <div className="skeleton-line" style={{ width: '75px', height: '12px' }} />
              </td>
              <td>
                <div className="skeleton-line" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
