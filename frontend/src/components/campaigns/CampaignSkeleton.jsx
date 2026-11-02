import React from 'react';

export default function CampaignSkeleton() {
  return (
    <div className="campaign-page-wrapper" aria-busy="true" aria-label="Loading campaign data">
      <div className="campaign-page-header">
        <div className="skeleton" style={{ width: '240px', height: '32px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ width: '420px', height: '18px' }} />
      </div>

      {/* Summary Cards Skeleton */}
      <div className="campaign-summary-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card campaign-summary-card">
            <div className="skeleton" style={{ width: '100px', height: '14px', marginBottom: '14px' }} />
            <div className="skeleton" style={{ width: '80px', height: '28px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '140px', height: '12px' }} />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="card campaign-table-card" style={{ marginTop: '20px', padding: '24px' }}>
        <div className="skeleton" style={{ width: '100%', height: '40px', marginBottom: '14px' }} />
        <div className="skeleton" style={{ width: '100%', height: '50px', marginBottom: '10px' }} />
        <div className="skeleton" style={{ width: '100%', height: '50px', marginBottom: '10px' }} />
        <div className="skeleton" style={{ width: '100%', height: '50px' }} />
      </div>
    </div>
  );
}
