import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { CAMPAIGN_OPTIONS, SOURCE_OPTIONS } from '../../utils/mockLeadsData';

export default function LeadFilters({
  searchQuery,
  onSearchChange,
  onClearSearch,
  selectedSegment,
  onSegmentChange,
  selectedSource,
  onSourceChange,
  selectedScoreRange,
  onScoreRangeChange,
  selectedCampaign,
  onCampaignChange,
  onResetFilters,
  totalCount,
  filteredCount,
}) {
  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedSegment !== 'ALL' ||
    selectedSource !== 'ALL' ||
    selectedScoreRange !== 'ALL' ||
    selectedCampaign !== 'ALL';

  return (
    <div className="card leads-filter-panel" aria-label="Lead Filters and Search">
      {/* Search Bar Row */}
      <div className="leads-search-bar-row">
        <div className="leads-search-input-wrapper">
          <Search size={16} className="leads-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="leads-search-input"
            placeholder="Search leads, companies or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search leads by name, company or email"
          />
          {searchQuery && (
            <button
              type="button"
              className="leads-search-clear-btn"
              onClick={onClearSearch}
              aria-label="Clear search input"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dynamic Result Counter */}
        <div className="leads-result-counter">
          <span className="result-count-label">Showing </span>
          <strong className="result-count-number">{filteredCount}</strong>
          <span className="result-count-label"> of </span>
          <strong className="result-count-number">{totalCount}</strong>
          <span className="result-count-label"> leads</span>
        </div>
      </div>

      {/* Filter Dropdowns Row */}
      <div className="leads-dropdowns-row">
        <div className="dropdowns-group">
          {/* Segment Filter */}
          <div className="filter-select-wrapper">
            <label htmlFor="filter-segment" className="filter-label">
              Segment
            </label>
            <select
              id="filter-segment"
              className="filter-select"
              value={selectedSegment}
              onChange={(e) => onSegmentChange(e.target.value)}
            >
              <option value="ALL">All Segments</option>
              <option value="HOT">HOT</option>
              <option value="WARM">WARM</option>
              <option value="NURTURE">NURTURE</option>
              <option value="COLD">COLD</option>
            </select>
          </div>

          {/* Source Filter */}
          <div className="filter-select-wrapper">
            <label htmlFor="filter-source" className="filter-label">
              Lead Source
            </label>
            <select
              id="filter-source"
              className="filter-select"
              value={selectedSource}
              onChange={(e) => onSourceChange(e.target.value)}
            >
              <option value="ALL">All Sources</option>
              {SOURCE_OPTIONS.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          {/* Score Range Filter */}
          <div className="filter-select-wrapper">
            <label htmlFor="filter-score" className="filter-label">
              Score
            </label>
            <select
              id="filter-score"
              className="filter-select"
              value={selectedScoreRange}
              onChange={(e) => onScoreRangeChange(e.target.value)}
            >
              <option value="ALL">All Scores</option>
              <option value="80-100">80–100</option>
              <option value="60-79">60–79</option>
              <option value="40-59">40–59</option>
              <option value="0-39">0–39</option>
            </select>
          </div>

          {/* Campaign Filter */}
          <div className="filter-select-wrapper">
            <label htmlFor="filter-campaign" className="filter-label">
              Campaign
            </label>
            <select
              id="filter-campaign"
              className="filter-select"
              value={selectedCampaign}
              onChange={(e) => onCampaignChange(e.target.value)}
            >
              <option value="ALL">All Campaigns</option>
              {CAMPAIGN_OPTIONS.map((cmp) => (
                <option key={cmp} value={cmp}>
                  {cmp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filters CTA */}
        {isFiltered && (
          <button
            type="button"
            className="btn-secondary leads-reset-filters-btn"
            onClick={onResetFilters}
            aria-label="Reset all search queries and filters"
          >
            <RotateCcw size={13} aria-hidden="true" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
