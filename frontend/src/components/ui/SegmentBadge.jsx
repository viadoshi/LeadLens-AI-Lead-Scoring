import React from 'react';

/**
 * Reusable SegmentBadge for LeadLens
 * Renders priority tiers:
 * - HOT (80-100)
 * - WARM (60-79)
 * - NURTURE (40-59)
 * - COLD (0-39)
 */
export default function SegmentBadge({ segment, score, className = '' }) {
  const normalizedSegment = (segment || '').toUpperCase();

  const getSegmentConfig = (seg) => {
    switch (seg) {
      case 'HOT':
        return {
          label: 'HOT',
          bg: 'var(--status-tag-bg)',
          text: 'var(--accent)',
          border: 'rgba(229, 169, 60, 0.35)',
          dot: 'var(--accent)',
        };
      case 'WARM':
        return {
          label: 'WARM',
          bg: 'rgba(245, 158, 11, 0.12)',
          text: '#F59E0B',
          border: 'rgba(245, 158, 11, 0.3)',
          dot: '#F59E0B',
        };
      case 'NURTURE':
        return {
          label: 'NURTURE',
          bg: 'rgba(59, 130, 246, 0.12)',
          text: '#3B82F6',
          border: 'rgba(59, 130, 246, 0.25)',
          dot: '#3B82F6',
        };
      case 'COLD':
      default:
        return {
          label: 'COLD',
          bg: 'rgba(100, 116, 139, 0.14)',
          text: 'var(--text-dim)',
          border: 'rgba(100, 116, 139, 0.25)',
          dot: 'var(--text-dim)',
        };
    }
  };

  const config = getSegmentConfig(normalizedSegment);

  return (
    <span
      className={`segment-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.04em',
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        lineHeight: 1.2,
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: config.dot,
        }}
        aria-hidden="true"
      />
      <span>{config.label}</span>
      {score !== undefined && score !== null && (
        <span
          style={{
            marginLeft: '2px',
            opacity: 0.85,
            fontWeight: '700',
          }}
        >
          {score}
        </span>
      )}
    </span>
  );
}
