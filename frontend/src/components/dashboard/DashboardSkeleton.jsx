import React from 'react';

/**
 * Reusable Dashboard Skeleton Loader
 * Renders pulse placeholders for KPIs, charts, and table.
 */
export default function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton-wrapper" aria-label="Loading dashboard analytics" aria-busy="true">
      {/* KPI Grid Skeleton */}
      <div className="overview-kpi-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card skeleton-card">
            <div className="skeleton-line skeleton-w-30" style={{ height: '12px' }} />
            <div className="skeleton-line skeleton-w-60" style={{ height: '32px', marginTop: '12px' }} />
            <div className="skeleton-line skeleton-w-40" style={{ height: '10px', marginTop: '8px' }} />
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="overview-analytics-grid" style={{ marginTop: '24px' }}>
        <div className="card skeleton-card" style={{ height: '380px' }}>
          <div className="skeleton-line skeleton-w-40" style={{ height: '18px' }} />
          <div className="skeleton-line skeleton-w-20" style={{ height: '12px', marginTop: '6px' }} />
          <div className="skeleton-box" style={{ height: '260px', marginTop: '20px' }} />
        </div>
        <div className="card skeleton-card" style={{ height: '380px' }}>
          <div className="skeleton-line skeleton-w-40" style={{ height: '18px' }} />
          <div className="skeleton-line skeleton-w-20" style={{ height: '12px', marginTop: '6px' }} />
          <div className="skeleton-box" style={{ height: '260px', marginTop: '20px' }} />
        </div>
      </div>

      {/* Lower Row Skeleton */}
      <div className="overview-secondary-grid" style={{ marginTop: '24px' }}>
        <div className="card skeleton-card" style={{ height: '340px' }}>
          <div className="skeleton-line skeleton-w-40" style={{ height: '18px' }} />
          <div className="skeleton-box" style={{ height: '220px', marginTop: '20px' }} />
        </div>
        <div className="card skeleton-card" style={{ height: '340px' }}>
          <div className="skeleton-line skeleton-w-40" style={{ height: '18px' }} />
          <div className="skeleton-box" style={{ height: '220px', marginTop: '20px' }} />
        </div>
      </div>
    </div>
  );
}
