import React from 'react';

export default function AnalyticsSkeleton() {
  return (
    <div className="analytics-page-wrapper" aria-busy="true" aria-label="Loading analytics dashboard">
      {/* Header Skeleton */}
      <div className="analytics-page-header">
        <div className="skeleton" style={{ width: '220px', height: '32px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ width: '380px', height: '18px' }} />
      </div>

      {/* KPI Row Skeleton */}
      <div className="analytics-kpi-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card analytics-kpi-card">
            <div className="skeleton" style={{ width: '80px', height: '16px', marginBottom: '14px' }} />
            <div className="skeleton" style={{ width: '120px', height: '28px', marginBottom: '10px' }} />
            <div className="skeleton" style={{ width: '160px', height: '14px' }} />
          </div>
        ))}
      </div>

      {/* Large Trend Chart Skeleton */}
      <div className="card analytics-card" style={{ height: '380px', marginTop: '20px' }}>
        <div className="skeleton" style={{ width: '200px', height: '20px', marginBottom: '10px' }} />
        <div className="skeleton" style={{ width: '300px', height: '14px', marginBottom: '24px' }} />
        <div className="skeleton" style={{ width: '100%', height: '260px' }} />
      </div>

      {/* Two-Column Skeletons */}
      <div className="analytics-two-col-grid" style={{ marginTop: '20px' }}>
        <div className="card analytics-card" style={{ height: '340px' }}>
          <div className="skeleton" style={{ width: '180px', height: '20px', marginBottom: '20px' }} />
          <div className="skeleton" style={{ width: '100%', height: '240px' }} />
        </div>
        <div className="card analytics-card" style={{ height: '340px' }}>
          <div className="skeleton" style={{ width: '180px', height: '20px', marginBottom: '20px' }} />
          <div className="skeleton" style={{ width: '100%', height: '240px' }} />
        </div>
      </div>
    </div>
  );
}
