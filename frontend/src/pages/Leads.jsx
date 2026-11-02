import React, { useState, useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import {
  LeadSummaryCards,
  LeadFilters,
  LeadTable,
  LeadPagination,
  AddLeadModal,
  LeadTableSkeleton,
  LeadEmptyState,
  LeadErrorState,
} from '../components/leads';
import Toast from '../components/ui/Toast';
import { mockLeadsData } from '../utils/mockLeadsData';

const PAGE_SIZE = 10;

export default function Leads() {
  // Main leads dataset (local state initialized with mock data)
  const [leads, setLeads] = useState(mockLeadsData);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('ALL');
  const [selectedSource, setSelectedSource] = useState('ALL');
  const [selectedScoreRange, setSelectedScoreRange] = useState('ALL');
  const [selectedCampaign, setSelectedCampaign] = useState('ALL');

  // Sorting state
  const [sortField, setSortField] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Modal & Toast UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // API State Preparation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Reset pagination helper
  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  // Handlers for search & filters (automatically resetting pagination to 1)
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    resetToFirstPage();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    resetToFirstPage();
  };

  const handleSegmentChange = (segment) => {
    setSelectedSegment(segment);
    resetToFirstPage();
  };

  const handleSourceChange = (source) => {
    setSelectedSource(source);
    resetToFirstPage();
  };

  const handleScoreRangeChange = (range) => {
    setSelectedScoreRange(range);
    resetToFirstPage();
  };

  const handleCampaignChange = (campaign) => {
    setSelectedCampaign(campaign);
    resetToFirstPage();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSegment('ALL');
    setSelectedSource('ALL');
    setSelectedScoreRange('ALL');
    setSelectedCampaign('ALL');
    resetToFirstPage();
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    resetToFirstPage();
  };

  // Temporary local UI addition of lead
  const handleAddLead = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
    setToast({
      message: 'Lead added successfully.',
      subtext: 'Temporary UI session preview. Future phases will persist to MySQL database.',
    });
    handleResetFilters();
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  // Multi-attribute filter calculation (pure derivation)
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. Text Search across name, company, email
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = lead.name.toLowerCase().includes(query);
        const matchesCompany = lead.company.toLowerCase().includes(query);
        const matchesEmail = lead.email.toLowerCase().includes(query);
        if (!matchesName && !matchesCompany && !matchesEmail) {
          return false;
        }
      }

      // 2. Segment Filter
      if (selectedSegment !== 'ALL' && lead.segment !== selectedSegment) {
        return false;
      }

      // 3. Lead Source Filter
      if (selectedSource !== 'ALL' && lead.source !== selectedSource) {
        return false;
      }

      // 4. Score Range Filter
      if (selectedScoreRange !== 'ALL') {
        const score = lead.score;
        if (selectedScoreRange === '80-100' && (score < 80 || score > 100)) return false;
        if (selectedScoreRange === '60-79' && (score < 60 || score > 79)) return false;
        if (selectedScoreRange === '40-59' && (score < 40 || score > 59)) return false;
        if (selectedScoreRange === '0-39' && (score < 0 || score > 39)) return false;
      }

      // 5. Campaign Filter
      if (selectedCampaign !== 'ALL' && lead.campaign !== selectedCampaign) {
        return false;
      }

      return true;
    });
  }, [leads, searchQuery, selectedSegment, selectedSource, selectedScoreRange, selectedCampaign]);

  // Sorting calculation
  const sortedLeads = useMemo(() => {
    const sorted = [...filteredLeads];
    sorted.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      // Numbers & dates
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredLeads, sortField, sortOrder]);

  // Pagination calculation
  const totalItems = sortedLeads.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedLeads = sortedLeads.slice(startIndex, endIndex);

  return (
    <div className="leads-page-wrapper">
      {/* 1. Page Header with Title, Subtitle, and Add Lead CTA */}
      <div className="leads-page-header">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="body-lead">Manage, analyze and prioritize your incoming leads.</p>
        </div>

        <button
          type="button"
          className="btn-primary add-lead-btn"
          onClick={() => setIsModalOpen(true)}
          aria-label="Add new lead prospect"
        >
          <UserPlus size={16} aria-hidden="true" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* 2. Compact Summary Metrics (Dynamically derived from leads dataset) */}
      <LeadSummaryCards leads={leads} />

      {/* 3. Search and Multi-Attribute Filter Toolbar */}
      <LeadFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        selectedSegment={selectedSegment}
        onSegmentChange={handleSegmentChange}
        selectedSource={selectedSource}
        onSourceChange={handleSourceChange}
        selectedScoreRange={selectedScoreRange}
        onScoreRangeChange={handleScoreRangeChange}
        selectedCampaign={selectedCampaign}
        onCampaignChange={handleCampaignChange}
        onResetFilters={handleResetFilters}
        totalCount={leads.length}
        filteredCount={sortedLeads.length}
      />

      {/* 4. Table Presentation, Skeletons, and Fallback States */}
      {loading && <LeadTableSkeleton rowsCount={8} />}

      {!loading && error && <LeadErrorState onRetry={handleRetry} />}

      {!loading && !error && sortedLeads.length === 0 && (
        <LeadEmptyState
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
          onResetFilters={handleResetFilters}
        />
      )}

      {!loading && !error && sortedLeads.length > 0 && (
        <div className="leads-table-section">
          <LeadTable
            leads={paginatedLeads}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />

          {/* Client-Side Pagination */}
          <LeadPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* 5. Add Lead Modal */}
      <AddLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddLead={handleAddLead}
      />

      {/* 6. Success Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          subtext={toast.subtext}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
