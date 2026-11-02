import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LeadPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  startIndex,
  endIndex,
}) {
  if (totalPages <= 1 && totalItems === 0) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="leads-pagination-wrapper" aria-label="Leads table pagination">
      {/* Range text */}
      <div className="pagination-range-text">
        Showing <span className="range-number">{totalItems > 0 ? startIndex + 1 : 0}</span> to{' '}
        <span className="range-number">{Math.min(endIndex, totalItems)}</span> of{' '}
        <span className="range-number">{totalItems}</span> leads
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls-group">
        {/* Previous Button */}
        <button
          type="button"
          className="btn-secondary pagination-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span>Previous</span>
        </button>

        {/* Page Number Buttons */}
        <div className="pagination-pages-list">
          {pages.map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              className={`pagination-number-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="btn-secondary pagination-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
