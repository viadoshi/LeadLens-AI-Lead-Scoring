import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit3 } from 'lucide-react';
import SegmentBadge from '../components/ui/SegmentBadge';
import Toast from '../components/ui/Toast';
import {
  LeadScoreCard,
  ScoreBreakdown,
  LeadActivityTimeline,
  RecommendedActionCard,
  LeadIdentityCard,
  LeadIntelligenceCard,
  LeadDetailsSkeleton,
  LeadDetailsErrorState,
  EditLeadModal,
} from '../components/leads';
import { mockLeadsData } from '../utils/mockLeadsData';

export default function LeadDetails() {
  const { leadId } = useParams();


  // Future API integration states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Local state for temporary UI editing and feedback
  const [toast, setToast] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedLeadOverrides, setEditedLeadOverrides] = useState({});

  // 1. Data Retrieval: Match route leadId against existing mockLeadsData
  const baseLead = useMemo(() => {
    if (!leadId) return null;
    return mockLeadsData.find((item) => String(item.id) === String(leadId).trim()) || null;
  }, [leadId]);

  // Merge any session UI edits (temporary demo state)
  const lead = useMemo(() => {
    if (!baseLead) return null;
    return { ...baseLead, ...editedLeadOverrides };
  }, [baseLead, editedLeadOverrides]);

  // Retry handler prepared for future API requests
  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  const handleEditSave = (updatedData) => {
    setEditedLeadOverrides(updatedData);
    setToast({
      message: 'Lead updated successfully (Preview).',
      subtext: 'Temporary UI session preview. Persistent updates will be handled via FastAPI in the backend phase.',
    });
  };

  // 2. Loading State Handling
  if (loading) {
    return <LeadDetailsSkeleton />;
  }

  // 3. General Error State Handling
  if (error) {
    return <LeadDetailsErrorState isNotFound={false} onRetry={handleRetry} />;
  }

  // 4. Invalid Lead State (Lead Not Found)
  if (!lead) {
    return <LeadDetailsErrorState isNotFound={true} />;
  }

  return (
    <div className="lead-details-page-wrapper">
      {/* 5. Page Navigation Header */}
      <div className="lead-details-header">
        <div className="lead-header-meta-group">
          {/* Back Navigation Link */}
          <div className="back-navigation-wrapper">
            <Link
              to="/leads"
              className="lead-back-link"
              aria-label="Back to Leads list"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Back to Leads</span>
            </Link>
          </div>

          {/* Lead Name, Company, and Segment Badge */}
          <div className="lead-title-badge-row">
            <h1 className="lead-details-name">{lead.name}</h1>
            <SegmentBadge segment={lead.segment} />
          </div>

          <p className="lead-details-company">{lead.company}</p>
        </div>

        {/* Right Header Action: Edit Lead */}
        <div className="lead-header-actions-group">
          <button
            type="button"
            className="btn-secondary edit-lead-btn"
            onClick={() => setIsEditModalOpen(true)}
            aria-label={`Edit details for ${lead.name}`}
          >
            <Edit3 size={15} aria-hidden="true" />
            <span>Edit Lead</span>
          </button>
        </div>
      </div>

      {/* 6. Responsive Two-Column Layout */}
      <div className="lead-details-grid">
        {/* Main Left Column: Score, Score Breakdown, Activity Timeline */}
        <div className="lead-details-main-column">
          <LeadScoreCard lead={lead} />
          <ScoreBreakdown lead={lead} />
          <LeadActivityTimeline lead={lead} />
        </div>

        {/* Side Right Column: Recommended Action, Identity, Intelligence */}
        <div className="lead-details-side-column">
          <RecommendedActionCard lead={lead} onActionClick={setToast} />
          <LeadIdentityCard lead={lead} />
          <LeadIntelligenceCard lead={lead} />
        </div>
      </div>

      {/* 7. Edit Lead Modal (Demo Preview) */}
      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        lead={lead}
        onSave={handleEditSave}
      />

      {/* 8. Temporary Feedback Toast */}
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
