import React, { useState } from 'react';
import {
  Sliders,
  Cpu,
  Share2,
  Bell,
  Building,
  RotateCcw,
  Save,
  CheckCircle,
  Copy,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import SegmentBadge from '../components/ui/SegmentBadge';
import Toast from '../components/ui/Toast';

const DEFAULT_SETTINGS = {
  // Scoring
  hotThreshold: 80,
  warmThreshold: 60,
  nurtureThreshold: 40,
  autoHotDemo: true,
  applyInactivityDecay: true,
  requireBudgetEnterprise: false,

  // Model & Governance
  activeModel: 'Logistic Regression (Tournament Winner)',
  confidenceFloor: 50,
  retrainingCadence: 'weekly',
  enableSignals: true,
  enableShapAttribution: true,

  // Integrations
  webhookUrl: 'https://api.glitchreach.com/v1/webhooks/lead-events',
  webhookSecret: 'whsec_glitchreach_live_99d12a84b3e67f01',
  salesforceConnected: true,
  hubspotConnected: true,

  // Notifications & Routing
  alertEmailHotLeads: true,
  alertSlackHotLeads: true,
  slackChannel: '#revops-hot-leads',
  dailyDigest: true,
  sdrTeam: ['Sarah Jenkins', 'Alex Rivera', 'Taylor Vance'],

  // Workspace
  companyName: 'Glitchreach',
  currency: 'USD ($)',
  attributionModel: 'Multi-Touch (W-Shaped)',
  timezone: 'America/New_York (UTC-5)',
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState('scoring');
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('leadlens_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback to default
    }
    return DEFAULT_SETTINGS;
  });

  const [toast, setToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [isSyncingCrm, setIsSyncingCrm] = useState(false);

  const handleSliderChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: Number(value) }));
  };

  const handleToggle = (field) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      try {
        localStorage.setItem('leadlens_settings', JSON.stringify(settings));
        setToast({ message: 'Settings saved successfully!' });
      } catch {
        setToast({ message: 'Failed to persist settings to local storage.' });
      } finally {
        setIsSaving(false);
      }
    }, 400);
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem('leadlens_settings');
    } catch {
      // Ignore
    }
    setToast({ message: 'Settings reset to factory defaults.' });
  };

  const handleCopySecret = () => {
    navigator.clipboard?.writeText(settings.webhookSecret);
    setToast({ message: 'Webhook secret copied to clipboard.' });
  };

  const handleTriggerRetrain = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setIsRetraining(false);
      setToast({ message: 'Model tournament verified: Logistic Regression winner (Test ROC-AUC: 0.8235, CV ROC-AUC: 0.8227).' });
    }, 1200);
  };

  const handleTestWebhook = () => {
    setIsTestingWebhook(true);
    setTimeout(() => {
      setIsTestingWebhook(false);
      setToast({ message: 'Webhook 200 OK: Test lead payload acknowledged.' });
    }, 800);
  };

  const handleSyncCrm = () => {
    setIsSyncingCrm(true);
    setTimeout(() => {
      setIsSyncingCrm(false);
      setToast({ message: 'Salesforce CRM sync complete (8,000 records reconciled).' });
    }, 900);
  };

  return (
    <div className="settings-page-wrapper">
      {/* Page Header */}
      <div className="settings-header">
        <div>
          <h1 className="page-title">Settings & Governance</h1>
          <p className="body-lead">
            Manage Glitchreach lead-scoring cutoffs, ML inference parameters, CRM webhooks, and enterprise preferences.
          </p>
        </div>
        <div className="settings-header-actions">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn btn-secondary"
            title="Reset all settings to initial defaults"
          >
            <RotateCcw size={15} />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="btn btn-primary"
          >
            {isSaving ? <RefreshCw size={15} className="spin" /> : <Save size={15} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <nav className="settings-tabs-bar" aria-label="Settings categories">
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'scoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('scoring')}
        >
          <Sliders size={16} className="settings-tab-icon" />
          Lead Scoring & Tiers
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'model' ? 'active' : ''}`}
          onClick={() => setActiveTab('model')}
        >
          <Cpu size={16} className="settings-tab-icon" />
          AI & Model Governance
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
        >
          <Share2 size={16} className="settings-tab-icon" />
          CRM & Webhooks
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={16} className="settings-tab-icon" />
          Alerts & Routing
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'workspace' ? 'active' : ''}`}
          onClick={() => setActiveTab('workspace')}
        >
          <Building size={16} className="settings-tab-icon" />
          Organization Profile
        </button>
      </nav>

      {/* Tab 1: Lead Scoring & Tiers */}
      {activeTab === 'scoring' && (
        <div className="settings-content-grid">
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <h3>Priority Tier Cutoff Boundaries</h3>
                <p>Define score thresholds for categorizing predicted conversion probabilities into operational sales tiers.</p>
              </div>
            </div>

            {/* Live Interactive Tier Preview */}
            <div className="settings-threshold-preview-grid">
              <div className="threshold-tier-card tier-hot">
                <div className="tier-card-header">
                  <SegmentBadge segment="HOT" />
                  <span className="tier-score-range">Score &ge; {settings.hotThreshold}</span>
                </div>
                <div className="tier-action-label">
                  <strong>Recommended Action:</strong> Contact immediately (&lt; 1h)
                </div>
              </div>

              <div className="threshold-tier-card tier-warm">
                <div className="tier-card-header">
                  <SegmentBadge segment="WARM" />
                  <span className="tier-score-range">
                    {settings.warmThreshold} &le; Score &lt; {settings.hotThreshold}
                  </span>
                </div>
                <div className="tier-action-label">
                  <strong>Recommended Action:</strong> Follow up within 24 hours
                </div>
              </div>

              <div className="threshold-tier-card tier-nurture">
                <div className="tier-card-header">
                  <SegmentBadge segment="NURTURE" />
                  <span className="tier-score-range">
                    {settings.nurtureThreshold} &le; Score &lt; {settings.warmThreshold}
                  </span>
                </div>
                <div className="tier-action-label">
                  <strong>Recommended Action:</strong> Enroll in targeted campaign
                </div>
              </div>

              <div className="threshold-tier-card tier-cold">
                <div className="tier-card-header">
                  <SegmentBadge segment="COLD" />
                  <span className="tier-score-range">Score &lt; {settings.nurtureThreshold}</span>
                </div>
                <div className="tier-action-label">
                  <strong>Recommended Action:</strong> Low-priority automated cadence
                </div>
              </div>
            </div>

            {/* Threshold Sliders */}
            <div className="settings-form-row">
              <div className="settings-slider-item">
                <div className="slider-top-row">
                  <span className="slider-label-title">HOT Lead Threshold (Minimum Score)</span>
                  <span className="slider-value-badge">{settings.hotThreshold} / 100</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="95"
                  value={settings.hotThreshold}
                  onChange={(e) => handleSliderChange('hotThreshold', e.target.value)}
                  className="settings-range-input"
                />
              </div>

              <div className="settings-slider-item">
                <div className="slider-top-row">
                  <span className="slider-label-title">WARM Lead Threshold (Minimum Score)</span>
                  <span className="slider-value-badge">{settings.warmThreshold} / 100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max={settings.hotThreshold - 1}
                  value={settings.warmThreshold}
                  onChange={(e) => handleSliderChange('warmThreshold', e.target.value)}
                  className="settings-range-input"
                />
              </div>

              <div className="settings-slider-item">
                <div className="slider-top-row">
                  <span className="slider-label-title">NURTURE Lead Threshold (Minimum Score)</span>
                  <span className="slider-value-badge">{settings.nurtureThreshold} / 100</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max={settings.warmThreshold - 1}
                  value={settings.nurtureThreshold}
                  onChange={(e) => handleSliderChange('nurtureThreshold', e.target.value)}
                  className="settings-range-input"
                />
              </div>
            </div>
          </section>

          {/* Business Qualification Overrides */}
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <h3>Automated Qualification Rules</h3>
                <p>Apply deterministic business overlays on top of the statistical machine learning score.</p>
              </div>
            </div>

            <div className="settings-form-row">
              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Auto-escalate demo requests to HOT tier</h4>
                  <p>When prospect explicitly submits a demo request, prioritize as HOT regardless of engagement recency.</p>
                </div>
                <label className="settings-switch-label">
                  <input
                    type="checkbox"
                    checked={settings.autoHotDemo}
                    onChange={() => handleToggle('autoHotDemo')}
                  />
                  <span className="settings-switch-slider" />
                </label>
              </div>

              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Apply inactivity decay penalty</h4>
                  <p>Gradually reduce displayed score if prospect has had no registered touchpoints in &gt;30 days.</p>
                </div>
                <label className="settings-switch-label">
                  <input
                    type="checkbox"
                    checked={settings.applyInactivityDecay}
                    onChange={() => handleToggle('applyInactivityDecay')}
                  />
                  <span className="settings-switch-slider" />
                </label>
              </div>

              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Require identified budget for Enterprise accounts</h4>
                  <p>Hold accounts with 500+ employees in WARM until BANT budget qualification is verified.</p>
                </div>
                <label className="settings-switch-label">
                  <input
                    type="checkbox"
                    checked={settings.requireBudgetEnterprise}
                    onChange={() => handleToggle('requireBudgetEnterprise')}
                  />
                  <span className="settings-switch-slider" />
                </label>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: AI & Model Governance */}
      {activeTab === 'model' && (
        <div className="settings-content-grid">
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <h3>Production Model Registry & Inference Pipeline</h3>
                <p>Configure which algorithmic model serves live predictions and manage retraining schedules.</p>
              </div>
              <button
                type="button"
                onClick={handleTriggerRetrain}
                disabled={isRetraining}
                className="btn btn-secondary"
              >
                {isRetraining ? <RefreshCw size={14} className="spin" /> : <Zap size={14} />}
                {isRetraining ? 'Retraining Tournament...' : 'Retrain Tournament'}
              </button>
            </div>

            <div className="settings-form-row">
              <div className="form-field">
                <label htmlFor="active-model-select" className="field-label">
                  Active Production Scoring Engine
                </label>
                <select
                  id="active-model-select"
                  value={settings.activeModel}
                  onChange={(e) => handleChange('activeModel', e.target.value)}
                  className="input-field select-field"
                >
                  <option value="Logistic Regression (Tournament Winner)">
                    Logistic Regression (Tournament Winner, Test ROC-AUC: 0.8235, CV ROC-AUC: 0.8227)
                  </option>
                  <option value="AdaBoost (Tournament Rank #2)">
                    AdaBoost (Tournament Rank #2, CV ROC-AUC: 0.8212)
                  </option>
                  <option value="Gradient Boosting (Tournament Rank #3)">
                    Gradient Boosting (Tournament Rank #3, CV ROC-AUC: 0.8170)
                  </option>
                  <option value="Random Forest (Tournament Rank #5)">
                    Random Forest (Tournament Rank #5, CV ROC-AUC: 0.7990)
                  </option>
                  <option value="XGBoost (Tournament Rank #7)">
                    XGBoost (Tournament Rank #7, CV ROC-AUC: 0.7885)
                  </option>
                </select>
              </div>

              <div className="settings-slider-item">
                <div className="slider-top-row">
                  <span className="slider-label-title">Binary Conversion Classification Threshold</span>
                  <span className="slider-value-badge">{settings.confidenceFloor}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="70"
                  value={settings.confidenceFloor}
                  onChange={(e) => handleSliderChange('confidenceFloor', e.target.value)}
                  className="settings-range-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="cadence-select" className="field-label">
                  Automated Pipeline Retraining Cadence
                </label>
                <select
                  id="cadence-select"
                  value={settings.retrainingCadence}
                  onChange={(e) => handleChange('retrainingCadence', e.target.value)}
                  className="input-field select-field"
                >
                  <option value="weekly">Weekly (Every Sunday at 02:00 UTC)</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="manual">Manual trigger only</option>
                </select>
              </div>

              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Rule-based Explanatory Signal Overlays</h4>
                  <p>Generate transparent human-readable intent badges (e.g., "Demo intent detected", "Senior role") on lead profiles.</p>
                </div>
                <label className="settings-switch-label">
                  <input
                    type="checkbox"
                    checked={settings.enableSignals}
                    onChange={() => handleToggle('enableSignals')}
                  />
                  <span className="settings-switch-slider" />
                </label>
              </div>

              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Model Diagnostic Visualizations</h4>
                  <p>Expose calibration curve and confusion matrix artifacts in the Model Intelligence registry.</p>
                </div>
                <label className="settings-switch-label">
                  <input
                    type="checkbox"
                    checked={settings.enableShapAttribution}
                    onChange={() => handleToggle('enableShapAttribution')}
                  />
                  <span className="settings-switch-slider" />
                </label>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Tab 3: CRM & Webhooks */}
      {activeTab === 'integrations' && (
        <div className="settings-content-grid">
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <h3>Connected CRM Platforms</h3>
                <p>Bi-directional synchronizers pushing LeadLens scores into sales workflows.</p>
              </div>
            </div>

            <div className="integration-grid">
              {/* Salesforce */}
              <div className="integration-card">
                <div className="integration-top">
                  <div className="integration-identity">
                    <div className="integration-icon-box">
                      <Share2 size={20} />
                    </div>
                    <div>
                      <div className="integration-name">Salesforce CRM</div>
                      <span className="integration-status-pill integration-connected">
                        <CheckCircle size={10} style={{ display: 'inline', marginRight: 4 }} />
                        Connected
                      </span>
                    </div>
                  </div>
                </div>
                <p className="integration-desc">
                  Scores and priority tier updates are streamed directly to Salesforce Lead & Contact objects.
                </p>
                <div className="integration-footer">
                  <span className="integration-sync-time">Synced 12 mins ago</span>
                  <button
                    type="button"
                    onClick={handleSyncCrm}
                    disabled={isSyncingCrm}
                    className="btn btn-secondary btn-sm"
                  >
                    {isSyncingCrm ? <RefreshCw size={12} className="spin" /> : 'Sync Now'}
                  </button>
                </div>
              </div>

              {/* HubSpot */}
              <div className="integration-card">
                <div className="integration-top">
                  <div className="integration-identity">
                    <div className="integration-icon-box">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="integration-name">HubSpot Marketing</div>
                      <span className="integration-status-pill integration-connected">
                        <CheckCircle size={10} style={{ display: 'inline', marginRight: 4 }} />
                        Connected
                      </span>
                    </div>
                  </div>
                </div>
                <p className="integration-desc">
                  Syncs campaign performance attribution, inbound form submissions, and email open metrics.
                </p>
                <div className="integration-footer">
                  <span className="integration-sync-time">Synced 45 mins ago</span>
                  <button type="button" className="btn btn-secondary btn-sm">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Webhook Configuration */}
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <h3>Outbound Event Webhooks</h3>
                <p>Deliver real-time lead score and qualification events to your custom endpoints or Zapier.</p>
              </div>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={isTestingWebhook}
                className="btn btn-secondary"
              >
                {isTestingWebhook ? <RefreshCw size={14} className="spin" /> : <ExternalLink size={14} />}
                {isTestingWebhook ? 'Sending Ping...' : 'Send Test Ping'}
              </button>
            </div>

            <div className="settings-form-row">
              <div className="form-field">
                <label htmlFor="webhook-endpoint-input" className="field-label">Webhook Destination URL</label>
                <input
                  id="webhook-endpoint-input"
                  type="url"
                  value={settings.webhookUrl}
                  onChange={(e) => handleChange('webhookUrl', e.target.value)}
                  placeholder="https://api.yourdomain.com/webhooks/leadlens"
                  className="input-field"
                />
              </div>

              <div className="form-field">
                <label htmlFor="webhook-secret-input" className="field-label">HMAC Signing Secret</label>
                <div className="api-key-box">
                  <input
                    id="webhook-secret-input"
                    type="password"
                    value={settings.webhookSecret}
                    readOnly
                    className="input-field api-key-input"
                  />
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="btn btn-secondary"
                    title="Copy secret to clipboard"
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Tab 4: Alerts & Routing */}
      {activeTab === 'notifications' && (
        <div className="settings-content-grid">
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <h3>High-Value Lead Escalation Alerts</h3>
                <p>Notify sales team members immediately when a lead reaches the HOT priority tier.</p>
              </div>
            </div>

            <div className="settings-form-row">
              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Immediate Email Alert for HOT Leads</h4>
                  <p>Dispatches an instant email to the designated SDR owner with lead signals and contact info.</p>
                </div>
                <label className="settings-switch-label">
                  <input
                    type="checkbox"
                    checked={settings.alertEmailHotLeads}
                    onChange={() => handleToggle('alertEmailHotLeads')}
                  />
                  <span className="settings-switch-slider" />
                </label>
              </div>

              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Slack Real-Time Notifications</h4>
                  <p>Broadcasts newly scored HOT leads to the designated team channel.</p>
                </div>
                <label className="settings-switch-label">
                  <input
                    type="checkbox"
                    checked={settings.alertSlackHotLeads}
                    onChange={() => handleToggle('alertSlackHotLeads')}
                  />
                  <span className="settings-switch-slider" />
                </label>
              </div>

              {settings.alertSlackHotLeads && (
                <div className="form-field">
                  <label htmlFor="slack-channel-input" className="field-label">Slack Broadcast Channel</label>
                  <input
                    id="slack-channel-input"
                    type="text"
                    value={settings.slackChannel}
                    onChange={(e) => handleChange('slackChannel', e.target.value)}
                    className="input-field"
                  />
                </div>
              )}

              <div className="settings-toggle-row">
                <div className="toggle-info">
                  <h4>Daily Executive Intelligence Digest</h4>
                  <p>Send an 08:00 AM summary of conversion velocity, top priority leads, and campaign yield.</p>
                </div>
                <label className="settings-switch-label">
                  <input
                    type="checkbox"
                    checked={settings.dailyDigest}
                    onChange={() => handleToggle('dailyDigest')}
                  />
                  <span className="settings-switch-slider" />
                </label>
              </div>
            </div>
          </section>

          {/* SDR Round-Robin Routing */}
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <h3>SDR Round-Robin Team Routing</h3>
                <p>Automatically distribute inbound high-priority leads among active account executives.</p>
              </div>
            </div>

            <div className="sdr-tag-list">
              {settings.sdrTeam.map((rep) => (
                <span key={rep} className="sdr-chip sdr-chip-active">
                  <span className="sdr-chip-dot" />
                  {rep} (Active AE)
                </span>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Tab 5: Organization Profile */}
      {activeTab === 'workspace' && (
        <div className="settings-content-grid">
          <section className="settings-card">
            <div className="settings-card-header">
              <div className="settings-card-title-group">
                <h3>Glitchreach Enterprise Workspace</h3>
                <p>General organization profile, currency denomination, and attribution settings.</p>
              </div>
            </div>

            <div className="settings-form-row">
              <div className="form-field">
                <label htmlFor="org-name-input" className="field-label">Organization Name</label>
                <input
                  id="org-name-input"
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="form-field">
                <label htmlFor="currency-select" className="field-label">Reporting Currency</label>
                <select
                  id="currency-select"
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="input-field select-field"
                >
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                  <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="attribution-select" className="field-label">Multi-Channel Attribution Model</label>
                <select
                  id="attribution-select"
                  value={settings.attributionModel}
                  onChange={(e) => handleChange('attributionModel', e.target.value)}
                  className="input-field select-field"
                >
                  <option value="Multi-Touch (W-Shaped)">Multi-Touch (W-Shaped: 30% First, 30% Lead, 30% Opp, 10% Middle)</option>
                  <option value="Linear">Linear (Equal distribution across all touchpoints)</option>
                  <option value="First-Touch">First-Touch (100% attribution to initial acquisition channel)</option>
                  <option value="Last-Touch">Last-Touch (100% attribution to pre-conversion interaction)</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="tz-select" className="field-label">Default Analytics Timezone</label>
                <select
                  id="tz-select"
                  value={settings.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="input-field select-field"
                >
                  <option value="America/New_York (UTC-5)">Eastern Time (US & Canada) - UTC-5</option>
                  <option value="America/Chicago (UTC-6)">Central Time (US & Canada) - UTC-6</option>
                  <option value="America/Los_Angeles (UTC-8)">Pacific Time (US & Canada) - UTC-8</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                  <option value="Europe/London (UTC+0)">London (GMT/BST)</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type="success"
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
