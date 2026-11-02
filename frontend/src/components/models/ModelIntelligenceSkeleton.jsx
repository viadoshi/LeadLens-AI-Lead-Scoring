import React from 'react';

export default function ModelIntelligenceSkeleton() {
  return (
    <div className="models-page-wrapper" aria-busy="true" aria-label="Loading Model Intelligence Dashboard">
      {/* 1. Header Skeleton */}
      <div className="models-page-header">
        <div className="skeleton-line" style={{ width: '240px', height: '32px', marginBottom: '8px' }} />
        <div className="skeleton-line" style={{ width: '380px', height: '18px' }} />
      </div>

      {/* 2. Current Model Hero Skeleton */}
      <div className="card skeleton-card" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="skeleton-line" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
            <div>
              <div className="skeleton-line" style={{ width: '140px', height: '20px', marginBottom: '10px' }} />
              <div className="skeleton-line" style={{ width: '220px', height: '28px', marginBottom: '8px' }} />
              <div className="skeleton-line" style={{ width: '180px', height: '14px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="skeleton-line" style={{ width: '140px', height: '80px', borderRadius: '8px' }} />
            <div className="skeleton-line" style={{ width: '140px', height: '80px', borderRadius: '8px' }} />
          </div>
        </div>
      </div>

      {/* 3. Metric KPI Cards Skeleton (6 cards) */}
      <div className="model-metrics-grid" style={{ marginBottom: '24px' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card kpi-card" style={{ height: '110px' }}>
            <div className="skeleton-line" style={{ width: '80px', height: '14px', marginBottom: '12px' }} />
            <div className="skeleton-line" style={{ width: '100px', height: '28px', marginBottom: '8px' }} />
            <div className="skeleton-line" style={{ width: '130px', height: '12px' }} />
          </div>
        ))}
      </div>

      {/* 4. Tournament Table Skeleton */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div className="skeleton-line" style={{ width: '200px', height: '24px', marginBottom: '8px' }} />
        <div className="skeleton-line" style={{ width: '320px', height: '14px', marginBottom: '20px' }} />
        <div className="skeleton-line" style={{ width: '100%', height: '240px', borderRadius: '6px' }} />
      </div>

      {/* 5. Chart & Top Features Skeleton */}
      <div className="models-two-col-grid" style={{ marginBottom: '24px' }}>
        <div className="card" style={{ padding: '24px', height: '360px' }}>
          <div className="skeleton-line" style={{ width: '220px', height: '20px', marginBottom: '16px' }} />
          <div className="skeleton-line" style={{ width: '100%', height: '280px', borderRadius: '6px' }} />
        </div>
        <div className="card" style={{ padding: '24px', height: '360px' }}>
          <div className="skeleton-line" style={{ width: '200px', height: '20px', marginBottom: '16px' }} />
          <div className="skeleton-line" style={{ width: '100%', height: '280px', borderRadius: '6px' }} />
        </div>
      </div>
    </div>
  );
}
