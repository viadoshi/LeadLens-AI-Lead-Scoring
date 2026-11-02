import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import LeadTableRow from './LeadTableRow';

export default function LeadTable({
  leads = [],
  sortField,
  sortOrder,
  onSortChange,
}) {
  const renderSortIndicator = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="sort-indicator sort-indicator-inactive" aria-hidden="true" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={12} className="sort-indicator sort-indicator-active" aria-hidden="true" />
    ) : (
      <ArrowDown size={12} className="sort-indicator sort-indicator-active" aria-hidden="true" />
    );
  };

  const handleSortClick = (field) => {
    if (onSortChange) {
      onSortChange(field);
    }
  };

  return (
    <div className="table-responsive-wrapper leads-table-container">
      <table className="dashboard-table leads-data-table" aria-label="Leads Management Data Table">
        <thead>
          <tr>
            {/* Sortable: Lead */}
            <th scope="col">
              <button
                type="button"
                className="table-sort-btn"
                onClick={() => handleSortClick('name')}
                aria-label={`Sort by Lead Name, currently ${sortField === 'name' ? sortOrder : 'none'}`}
              >
                <span>Lead</span>
                {renderSortIndicator('name')}
              </button>
            </th>

            {/* Sortable: Company */}
            <th scope="col">
              <button
                type="button"
                className="table-sort-btn"
                onClick={() => handleSortClick('company')}
                aria-label={`Sort by Company Name, currently ${sortField === 'company' ? sortOrder : 'none'}`}
              >
                <span>Company</span>
                {renderSortIndicator('company')}
              </button>
            </th>

            {/* Non-sortable: Source */}
            <th scope="col">Source</th>

            {/* Non-sortable: Campaign */}
            <th scope="col">Campaign</th>

            {/* Sortable: Score */}
            <th scope="col">
              <button
                type="button"
                className="table-sort-btn"
                onClick={() => handleSortClick('score')}
                aria-label={`Sort by Lead Score, currently ${sortField === 'score' ? sortOrder : 'none'}`}
              >
                <span>Score</span>
                {renderSortIndicator('score')}
              </button>
            </th>

            {/* Sortable: Probability */}
            <th scope="col">
              <button
                type="button"
                className="table-sort-btn"
                onClick={() => handleSortClick('probability')}
                aria-label={`Sort by Conversion Probability, currently ${sortField === 'probability' ? sortOrder : 'none'}`}
              >
                <span>Probability</span>
                {renderSortIndicator('probability')}
              </button>
            </th>

            {/* Non-sortable: Segment */}
            <th scope="col">Segment</th>

            {/* Non-sortable: Recommended Action */}
            <th scope="col">Recommended Action</th>

            {/* Sortable: Date Added */}
            <th scope="col">
              <button
                type="button"
                className="table-sort-btn"
                onClick={() => handleSortClick('dateAdded')}
                aria-label={`Sort by Date Added, currently ${sortField === 'dateAdded' ? sortOrder : 'none'}`}
              >
                <span>Date Added</span>
                {renderSortIndicator('dateAdded')}
              </button>
            </th>

            {/* Action */}
            <th scope="col" aria-label="Lead Actions"></th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <LeadTableRow key={lead.id} lead={lead} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
