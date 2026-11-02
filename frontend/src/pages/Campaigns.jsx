import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Database } from 'lucide-react';
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  archiveCampaign,
} from '../services/campaignApi';
import {
  CampaignSummaryCards,
  CampaignFilters,
  CampaignTable,
  CampaignFormModal,
  CampaignArchiveModal,
  CampaignSkeleton,
  CampaignErrorState,
} from '../components/campaigns';
import Toast from '../components/ui/Toast';

export default function Campaigns() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    status: 'All',
    channel: 'All',
    campaign_type: 'All',
    search: '',
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [archivingCampaign, setArchivingCampaign] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const fetchCampaignsList = useCallback(async (currentFilters, isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const res = await getCampaigns(currentFilters);
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to load campaigns.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const res = await getCampaigns({ status: 'All', channel: 'All', campaign_type: 'All', search: '' });
        if (!ignore) {
          setData(res);
          setIsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to load campaigns.');
          setIsLoading(false);
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  // Filter and search handlers
  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    fetchCampaignsList(updated, false);
  };

  const handleSearchChange = useCallback((searchValue) => {
    setFilters((prev) => {
      const updated = { ...prev, search: searchValue };
      fetchCampaignsList(updated, false);
      return updated;
    });
  }, [fetchCampaignsList]);

  const handleResetFilters = () => {
    const reset = { status: 'All', channel: 'All', campaign_type: 'All', search: '' };
    setFilters(reset);
    fetchCampaignsList(reset, false);
  };

  // CRUD actions
  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (campaign) => {
    setEditingCampaign(campaign);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingCampaign) {
        await updateCampaign(editingCampaign.id, formData);
        setToast({ message: 'Campaign updated successfully.' });
      } else {
        await createCampaign(formData);
        setToast({ message: 'Campaign created successfully.' });
      }
      setIsFormOpen(false);
      setEditingCampaign(null);
      // Refresh list
      await fetchCampaignsList(filters, false);
    } catch (err) {
      setToast({ message: err.message || 'Operation failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenArchive = (campaign) => {
    setArchivingCampaign(campaign);
  };

  const handleConfirmArchive = async () => {
    if (!archivingCampaign) return;
    setIsSubmitting(true);
    try {
      await archiveCampaign(archivingCampaign.id);
      setToast({ message: 'Campaign archived.' });
      setArchivingCampaign(null);
      await fetchCampaignsList(filters, false);
    } catch (err) {
      setToast({ message: err.message || 'Failed to archive campaign.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !data) {
    return <CampaignSkeleton />;
  }

  if (error && !data) {
    return (
      <div className="campaign-page-wrapper">
        <div className="campaign-page-header">
          <h1 className="page-title">Campaigns</h1>
          <p className="body-lead">Manage campaigns and understand which initiatives generate the strongest leads.</p>
        </div>
        <CampaignErrorState error={error} onRetry={() => fetchCampaignsList(filters, true)} />
      </div>
    );
  }

  return (
    <div className={`campaign-page-wrapper ${isRefreshing ? 'campaign-refreshing' : ''}`}>
      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          subtext={toast.subtext}
          onClose={() => setToast(null)}
        />
      )}

      {/* 1. Page Header */}
      <div className="campaign-page-header">
        <div className="campaign-header-row">
          <div>
            <div className="campaign-header-title-box">
              <h1 className="page-title">Campaigns</h1>
              <span className="analytics-demo-badge" title="Simulated B2B workspace data for Glitchreach">
                <Database size={12} aria-hidden="true" />
                <span>Glitchreach Workspace</span>
              </span>
            </div>
            <p className="body-lead">
              Manage campaigns and understand which initiatives generate the strongest leads.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn btn-primary campaign-create-btn"
            aria-label="Create new campaign"
          >
            <Plus size={16} aria-hidden="true" style={{ marginRight: '6px' }} />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* 2. Macro Summary Cards */}
      {data?.summary && (
        <div className="campaign-section-block">
          <CampaignSummaryCards summary={data.summary} />
        </div>
      )}

      {/* 3. Search and Filters Bar */}
      <div className="campaign-section-block">
        <CampaignFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* 4. Campaigns Table */}
      <div className="campaign-section-block">
        <CampaignTable
          campaigns={data?.campaigns || []}
          onEditCampaign={handleOpenEdit}
          onArchiveCampaign={handleOpenArchive}
        />
      </div>

      {/* Create / Edit Form Modal */}
      <CampaignFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCampaign(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCampaign}
        isSubmitting={isSubmitting}
      />

      {/* Archive Confirmation Modal */}
      <CampaignArchiveModal
        isOpen={Boolean(archivingCampaign)}
        campaign={archivingCampaign}
        onClose={() => setArchivingCampaign(null)}
        onConfirm={handleConfirmArchive}
        isArchiving={isSubmitting}
      />
    </div>
  );
}
