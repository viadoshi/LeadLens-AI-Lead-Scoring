import React from 'react';
import { Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Clean placeholder component for Phase 1 route endpoints.
 * Strictly adheres to Phase 1 guidelines:
 * - Displays page name
 * - Displays "Coming in the next implementation phase."
 * - Does NOT create fake charts or fake KPIs.
 */
export default function PagePlaceholder({
  title,
  subtitle,
  icon: Icon,
  details = [],
  sampleSublinks = [],
}) {
  return (
    <div className="page-placeholder-wrapper">
      {/* Page Header */}
      <div className="page-header-block">
        <div className="page-header-content">
          <div className="page-header-badge">
            <span className="badge">Phase 1 Placeholder</span>
          </div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="body-lead">{subtitle}</p>}
        </div>
      </div>

      {/* Placeholder Surface Card */}
      <div className="card placeholder-card">
        <div className="placeholder-icon-ring">
          {Icon ? <Icon size={28} className="placeholder-icon" /> : <Clock size={28} />}
        </div>

        <div className="placeholder-status-tag">
          <ShieldCheck size={14} />
          <span>Planned Architecture</span>
        </div>

        <h2 className="section-heading" style={{ marginTop: '12px' }}>
          Coming in the next implementation phase.
        </h2>

        <p className="body-text" style={{ maxWidth: '520px', margin: '8px auto 24px auto' }}>
          This interface endpoint is registered and active in the LeadLens application shell.
          Components, data pipelines, and analytics modules will be integrated during subsequent phases.
        </p>

        {details.length > 0 && (
          <div className="placeholder-spec-box">
            <div className="label-small" style={{ marginBottom: '8px', textAlign: 'left' }}>
              Planned Capabilities
            </div>
            <ul className="placeholder-spec-list">
              {details.map((item, idx) => (
                <li key={idx} className="placeholder-spec-item">
                  <span className="spec-bullet">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {sampleSublinks.length > 0 && (
          <div className="placeholder-sublinks">
            <div className="label-small" style={{ marginBottom: '8px' }}>
              Route Verification Links
            </div>
            <div className="sublinks-group">
              {sampleSublinks.map((link, idx) => (
                <Link key={idx} to={link.to} className="btn-secondary" style={{ fontSize: '12px' }}>
                  <span>{link.label}</span>
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
