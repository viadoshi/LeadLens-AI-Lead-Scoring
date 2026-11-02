import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getCampaign,
  updateCampaign,
  archiveCampaign,
} from '../services/campaignApi';
import {
  CampaignDetailHeader,
  CampaignDetailKPIs,
  CampaignConversionChart,
  CampaignSourcePerformance,
  CampaignSegmentPerformance,
  CampaignScoreDistribution,
  CampaignTopLeads,
  CampaignInsights,
  CampaignFormModal,
  CampaignArchiveModal,
  CampaignSkeleton,
  CampaignEmptyState,
  CampaignErrorState,
} from '../components/campaigns';
import Toast from '../components/ui/Toast';

export default function CampaignDetails() {
  const { campaignId } = useParams();

  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  // Modal & action states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchDetail = useCallback(async () => {
    if (!campaignId) return;
    setIsLoading(true);
    setError(null);
    setIsNotFound(false);

    try {
      const data = await getCampaign(campaignId);
      setCampaign(data);
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('not found')) {
        setIsNotFound(true);
      } else {
        setError(msg || `Unable to load campaign '${campaignId}'.`);
      }
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const data = await getCampaign(campaignId);
        if (!ignore) {
          setCampaign(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          const msg = err.message || '';
          if (msg.toLowerCase().includes('not found')) {
            setIsNotFound(true);
          } else {
            setError(msg || `Unable to load campaign '${campaignId}'.`);
          }
          setIsLoading(false);
        }
      }
    }

    if (campaignId) {
      load();
    }
    return () => {
      ignore = true;
    };
  }, [campaignId]);

  const handleEditSubmit = async (formData) => {
    if (!campaign) return;
    setIsSubmitting(true);
    try {
      await updateCampaign(campaign.id, formData);
      setToast({ message: 'Campaign updated successfully.' });
      setIsEditOpen(false);
      await fetchDetail();
    } catch (err) {
      setToast({ message: err.message || 'Failed to update campaign.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveConfirm = async () => {
    if (!campaign) return;
    setIsSubmitting(true);
    try {
      await archiveCampaign(campaign.id);
      setToast({ message: 'Campaign archived.' });
      setIsArchiveOpen(false);
      await fetchDetail();
    } catch (err) {
      setToast({ message: err.message || 'Failed to archive campaign.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !campaign) {
    return <CampaignSkeleton />;
  }

  if (isNotFound) {
    return (
      <div className="campaign-page-wrapper">
        <CampaignErrorState
          title="Campaign not found"
          error={`The campaign with identifier '${campaignId}' could not be located in the Glitchreach workspace.`}
          isNotFound={true}
        />
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="campaign-page-wrapper">
        <CampaignErrorState
          error={error}
          onRetry={fetchDetail}
        />
      </div>
    );
  }

  if (!campaign) return null;

  const hasLeads = campaign.total_leads > 0;

  return (
    <div className="campaign-page-wrapper">
      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          subtext={toast.subtext}
          onClose={() => setToast(null)}
        />
      )}

      {/* 1. Header with back link, metadata, and actions */}
      <div className="campaign-section-block">
        <CampaignDetailHeader
          campaign={campaign}
          onEdit={() => setIsEditOpen(true)}
          onArchive={() => setIsArchiveOpen(true)}
        />
      </div>

      {/* 2. Headline Performance Hero Cards & Metadata Strip */}
      <div className="campaign-section-block">
        <CampaignDetailKPIs campaign={campaign} />
      </div>

      {/* If campaign has no leads yet: show clean empty state while preserving metadata above */}
      {!hasLeads ? (
        <div className="campaign-section-block">
          <CampaignEmptyState
            title="No lead activity yet"
            description="Performance telemetry, score distributions, and attribution trends will appear once leads are generated from this campaign."
          />
        </div>
      ) : (
        <>
          {/* 3. Conversion Trend + Source Performance (Two Columns) */}
          <div className="campaign-section-block analytics-two-col-grid">
            <CampaignConversionChart trend={campaign.conversion_trend} />
            <CampaignSourcePerformance sources={campaign.source_performance} />
          </div>

          {/* 4. Segment Breakdown + Score Distribution (Two Columns) */}
          <div className="campaign-section-block analytics-two-col-grid">
            <CampaignSegmentPerformance segments={campaign.segment_performance} />
            <CampaignScoreDistribution distribution={campaign.score_distribution} />
          </div>

          {/* 5. High-Priority Campaign Leads */}
          <div className="campaign-section-block">
            <CampaignTopLeads topLeads={campaign.top_leads} />
          </div>

          {/* 6. LeadLens Insights */}
          <div className="campaign-section-block">
            <CampaignInsights insights={campaign.insights} />
          </div>
        </>
      )}

      {/* Edit Form Modal */}
      <CampaignFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={campaign}
        isSubmitting={isSubmitting}
      />

      {/* Archive Confirmation Modal */}
      <CampaignArchiveModal
        isOpen={isArchiveOpen}
        campaign={campaign}
        onClose={() => setIsArchiveOpen(false)}
        onConfirm={handleArchiveConfirm}
        isArchiving={isSubmitting}
      />
    </div>
  );
}
