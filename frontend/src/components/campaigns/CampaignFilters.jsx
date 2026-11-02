import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

const STATUS_OPTIONS = ['All', 'Active', 'Paused', 'Completed', 'Draft', 'Archived'];
const CHANNEL_OPTIONS = ['All', 'LinkedIn', 'Google Ads', 'Email', 'Referral', 'Website', 'Webinar'];
const TYPE_OPTIONS = ['All', 'Inbound', 'Outbound', 'ABM', 'Content', 'Webinar', 'Retargeting'];

export default function CampaignFilters({
  filters,
  onFilterChange,
  onSearchChange,
  onResetFilters,
}) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounced search input handler (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput, onSearchChange]);

  const hasActiveFilters =
    (filters.status && filters.status !== 'All') ||
    (filters.channel && filters.channel !== 'All') ||
    (filters.campaign_type && filters.campaign_type !== 'All') ||
    Boolean(searchInput);

  return (
    <div className="card campaign-filters-bar" role="search" aria-label="Campaign Search and Filters">
      {/* Search Input */}
      <div className="campaign-search-wrapper">
        <Search size={16} className="campaign-search-icon" aria-hidden="true" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search campaigns by name or description..."
          className="campaign-search-input"
          aria-label="Search campaigns"
        />
        {searchInput && (
          <button
            type="button"
            onClick={() => setSearchInput('')}
            className="campaign-search-clear"
            aria-label="Clear search text"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Select Dropdown Filters */}
      <div className="campaign-dropdowns-group">
        <div className="campaign-select-wrap">
          <label htmlFor="filter-status" className="campaign-select-label">
            Status:
          </label>
          <select
            id="filter-status"
            value={filters.status || 'All'}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="campaign-select"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="campaign-select-wrap">
          <label htmlFor="filter-channel" className="campaign-select-label">
            Channel:
          </label>
          <select
            id="filter-channel"
            value={filters.channel || 'All'}
            onChange={(e) => onFilterChange('channel', e.target.value)}
            className="campaign-select"
          >
            {CHANNEL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="campaign-select-wrap">
          <label htmlFor="filter-type" className="campaign-select-label">
            Type:
          </label>
          <select
            id="filter-type"
            value={filters.campaign_type || 'All'}
            onChange={(e) => onFilterChange('campaign_type', e.target.value)}
            className="campaign-select"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              onResetFilters();
            }}
            className="campaign-reset-btn"
            aria-label="Reset all filters"
          >
            <Filter size={13} aria-hidden="true" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
