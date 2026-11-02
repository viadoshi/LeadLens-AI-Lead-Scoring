import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Database } from 'lucide-react';
import { getAnalyticsOverview } from '../services/analyticsApi';
import {
  AnalyticsKPICard,
  ConversionAnalyticsChart,
  SourceAnalyticsChart,
  SegmentPerformanceChart,
  CampaignPerformanceTable,
  LeadScoreDistribution,
  LeadLensInsights,
  AnalyticsSkeleton,
  AnalyticsEmptyState,
  AnalyticsErrorState,
} from '../components/analytics';

const RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'all', label: 'All Time' },
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('30d');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (rangeToFetch, isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const res = await getAnalyticsOverview(rangeToFetch);
      setData(res);
    } catch (err) {
      setError(err.message || 'Unable to retrieve analytics data right now.');
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
        const res = await getAnalyticsOverview('30d');
        if (!ignore) {
          setData(res);
          setIsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || 'Unable to retrieve analytics data right now.');
          setIsLoading(false);
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const handleRangeChange = (newRange) => {
    if (newRange === dateRange) return;
    setDateRange(newRange);
    fetchAnalytics(newRange, false);
  };

  const handleRetry = () => {
    fetchAnalytics(dateRange, true);
  };

  if (isLoading && !data) {
    return <AnalyticsSkeleton />;
  }

  if (error && !data) {
    return (
      <div className="analytics-page-wrapper">
        <div className="analytics-page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="body-lead">Understand lead performance across sources, segments, and campaigns.</p>
        </div>
        <AnalyticsErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (!data || data.summary.total_leads === 0) {
    return (
      <div className="analytics-page-wrapper">
        <div className="analytics-page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="body-lead">Understand lead performance across sources, segments, and campaigns.</p>
        </div>
        <AnalyticsEmptyState />
      </div>
    );
  }

  return (
    <div className={`analytics-page-wrapper ${isRefreshing ? 'analytics-refreshing' : ''}`}>
      {/* 1. Header with Title, Demo Notice, and Date Range Filter */}
      <div className="analytics-page-header">
        <div className="analytics-header-top-row">
          <div>
            <h1 className="page-title">Analytics</h1>
            <p className="body-lead">
              Understand lead performance across sources, segments, and campaigns.
            </p>
          </div>

          <div className="analytics-header-right-group">
            <span className="analytics-demo-badge" title="Fictional business analytics dataset for portfolio simulation">
              <Database size={12} aria-hidden="true" />
              <span>{data.data_notice || 'Demo workspace data'}</span>
            </span>

            {/* Date Range Selector */}
            <div
              className="analytics-range-selector"
              role="group"
              aria-label="Filter analytics by date range"
            >
              <Calendar size={14} className="analytics-calendar-icon" aria-hidden="true" />
              {RANGE_OPTIONS.map((opt) => {
                const isActive = dateRange === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleRangeChange(opt.value)}
                    className={`analytics-range-btn ${isActive ? 'active' : ''}`}
                    aria-pressed={isActive}
                    disabled={isRefreshing}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI Summary Row */}
      <div className="analytics-section-block">
        <AnalyticsKPICard summary={data.summary} />
      </div>

      {/* 3. Conversion Trend Chart */}
      <div className="analytics-section-block">
        <ConversionAnalyticsChart
          trend={data.conversion_trend}
          rangeLabel={data.range_label}
        />
      </div>

      {/* 4. Two-Column Grid: Source Performance + Segment Performance */}
      <div className="analytics-section-block analytics-two-col-grid">
        <SourceAnalyticsChart sources={data.source_performance} />
        <SegmentPerformanceChart segments={data.segment_performance} />
      </div>

      {/* 5. Campaign Performance Table */}
      <div className="analytics-section-block">
        <CampaignPerformanceTable campaigns={data.campaign_performance} />
      </div>

      {/* 6. Two-Column Grid: Score Distribution + LeadLens Insights */}
      <div className="analytics-section-block analytics-two-col-grid">
        <LeadScoreDistribution distribution={data.score_distribution} />
        <LeadLensInsights insights={data.insights} />
      </div>
    </div>
  );
}
