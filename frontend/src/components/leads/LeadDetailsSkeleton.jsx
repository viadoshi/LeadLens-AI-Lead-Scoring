import React from 'react';

export default function LeadDetailsSkeleton() {
  return (
    <div className="lead-details-page-wrapper skeleton-details-page" aria-busy="true">
      {/* 1. Header Skeleton */}
      <div className="lead-details-header">
        <div className="header-left-col">
          <div className="skeleton-line" style={{ width: '110px', height: '14px', marginBottom: '14px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div className="skeleton-line" style={{ width: '220px', height: '28px', borderRadius: '4px' }} />
            <div className="skeleton-line" style={{ width: '60px', height: '22px', borderRadius: '6px' }} />
          </div>
          <div className="skeleton-line" style={{ width: '160px', height: '16px', marginTop: '6px' }} />
        </div>

        <div className="header-right-col">
          <div className="skeleton-line" style={{ width: '100px', height: '36px', borderRadius: '6px' }} />
        </div>
      </div>

      {/* 2. Two-Column Layout Skeleton */}
      <div className="lead-details-grid">
        {/* Main Column */}
        <div className="lead-details-main-column">
          {/* Score Card Skeleton */}
          <div className="card skeleton-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div className="skeleton-line" style={{ width: '140px', height: '20px' }} />
              <div className="skeleton-line" style={{ width: '80px', height: '20px', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div
                className="skeleton-line"
                style={{ width: '130px', height: '130px', borderRadius: '50%', flexShrink: 0 }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="skeleton-line" style={{ width: '180px', height: '28px' }} />
                <div className="skeleton-line" style={{ width: '240px', height: '16px' }} />
                <div className="skeleton-line" style={{ width: '100%', height: '48px', borderRadius: '6px' }} />
              </div>
            </div>
          </div>

          {/* Breakdown Skeleton */}
          <div className="card skeleton-card" style={{ padding: '24px' }}>
            <div className="skeleton-line" style={{ width: '160px', height: '20px', marginBottom: '16px' }} />
            <div className="skeleton-line" style={{ width: '100%', height: '40px', borderRadius: '6px', marginBottom: '20px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="skeleton-line" style={{ width: '120px', height: '14px' }} />
                    <div className="skeleton-line" style={{ width: '60px', height: '14px' }} />
                  </div>
                  <div className="skeleton-line" style={{ width: '100%', height: '8px', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Activity Skeleton */}
          <div className="card skeleton-card" style={{ padding: '24px' }}>
            <div className="skeleton-line" style={{ width: '130px', height: '20px', marginBottom: '20px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[1, 2, 3, 4].map((item) => (
                <div key={item} style={{ display: 'flex', gap: '14px' }}>
                  <div className="skeleton-line" style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div className="skeleton-line" style={{ width: '150px', height: '14px' }} />
                    <div className="skeleton-line" style={{ width: '220px', height: '12px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="lead-details-side-column">
          {/* Recommended Action Skeleton */}
          <div className="card skeleton-card" style={{ padding: '24px' }}>
            <div className="skeleton-line" style={{ width: '170px', height: '20px', marginBottom: '18px' }} />
            <div className="skeleton-line" style={{ width: '100%', height: '64px', borderRadius: '6px', marginBottom: '16px' }} />
            <div className="skeleton-line" style={{ width: '100%', height: '40px', borderRadius: '6px', marginBottom: '20px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton-line" style={{ width: '100%', height: '34px', borderRadius: '6px' }} />
              <div className="skeleton-line" style={{ width: '100%', height: '34px', borderRadius: '6px' }} />
              <div className="skeleton-line" style={{ width: '100%', height: '34px', borderRadius: '6px' }} />
            </div>
          </div>

          {/* Identity Card Skeleton */}
          <div className="card skeleton-card" style={{ padding: '24px' }}>
            <div className="skeleton-line" style={{ width: '120px', height: '20px', marginBottom: '20px' }} />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
              <div className="skeleton-line" style={{ width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <div className="skeleton-line" style={{ width: '130px', height: '16px' }} />
                <div className="skeleton-line" style={{ width: '100px', height: '12px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton-line" style={{ width: '80px', height: '12px' }} />
                  <div className="skeleton-line" style={{ width: '120px', height: '12px' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Intelligence Card Skeleton */}
          <div className="card skeleton-card" style={{ padding: '24px' }}>
            <div className="skeleton-line" style={{ width: '150px', height: '20px', marginBottom: '20px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="skeleton-line" style={{ width: '100%', height: '48px', borderRadius: '6px' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
