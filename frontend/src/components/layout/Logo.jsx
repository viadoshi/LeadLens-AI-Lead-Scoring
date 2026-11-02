import React from 'react';
import tempPlaceholder from '../../assets/logo/temporary-placeholder.svg';

/**
 * Reusable Logo Component for LeadLens
 * 
 * NOTE FOR LOGO REPLACEMENT:
 * Place your official LeadLens logo in `src/assets/logo/` (e.g., `leadlens-logo.svg` or `leadlens-logo.png`).
 * Replace `tempPlaceholder` with your asset import here.
 * The entire application shell will reflect the change automatically.
 */
export default function Logo({ collapsed = false, className = '' }) {
  return (
    <div
      className={`logo-container ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '4px 0',
        userSelect: 'none',
      }}
    >
      {/* Temporary layout placeholder container */}
      <div
        className="logo-mark"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-sm)',
          border: '1.5px dashed var(--accent)',
          backgroundColor: 'var(--accent-subtle)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
        title="Temporary Logo Placeholder for Layout Testing (Source: src/assets/logo/temporary-placeholder.svg)"
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: '700',
            color: 'var(--accent)',
            letterSpacing: '-0.02em',
          }}
        >
          LL
        </span>
        <span
          style={{
            fontSize: '6px',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            lineHeight: 1,
            marginTop: '2px',
          }}
        >
          TEMP
        </span>
        <img
          src={tempPlaceholder}
          alt="Temporary LeadLens Logo Placeholder"
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>

      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              LeadLens
            </span>
            <span
              style={{
                fontSize: '9px',
                padding: '1px 5px',
                borderRadius: '4px',
                backgroundColor: 'var(--border-subtle)',
                color: 'var(--text-dim)',
                border: '1px solid var(--border)',
                textTransform: 'uppercase',
                fontWeight: '600',
                letterSpacing: '0.04em',
              }}
              title="Official logo to be placed in src/assets/logo/"
            >
              Placeholder
            </span>
          </div>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontWeight: '500',
              lineHeight: 1.2,
            }}
          >
            Glitchreach
          </span>
        </div>
      )}
    </div>
  );
}
