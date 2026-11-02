import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function LeadEmptyState({ onResetFilters, searchQuery, onClearSearch }) {
  return (
    <div className="card leads-empty-state-card" role="status" aria-live="polite">
      <div className="empty-state-icon-box" aria-hidden="true">
        <SearchX size={32} />
      </div>

      <h3 className="section-heading" style={{ marginTop: '14px' }}>
        No leads found
      </h3>

      <p className="body-text" style={{ maxWidth: '420px', margin: '8px auto 20px auto' }}>
        Try adjusting your search query or removing active segment and source filters to discover prospects.
      </p>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {searchQuery && (
          <button
            type="button"
            className="btn-secondary"
            onClick={onClearSearch}
            aria-label="Clear active search query"
          >
            Clear Search
          </button>
        )}
        <button
          type="button"
          className="btn-primary"
          onClick={onResetFilters}
          aria-label="Reset all filters and search query"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
}
