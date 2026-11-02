import React, { useState } from 'react';
import KPICard from '../components/dashboard/KPICard';
import ConversionTrendChart from '../components/dashboard/ConversionTrendChart';
import SourcePerformanceChart from '../components/dashboard/SourcePerformanceChart';
import LeadDistributionChart from '../components/dashboard/LeadDistributionChart';
import PriorityLeadsTable from '../components/dashboard/PriorityLeadsTable';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';
import DashboardErrorState from '../components/dashboard/DashboardErrorState';
import DashboardEmptyState from '../components/dashboard/DashboardEmptyState';
import { mockDashboardData } from '../utils/mockDashboardData';

export default function Overview() {
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isEmpty] = useState(false);

  // Active trend series based on selected date range (API-ready)
  const currentTrendData = mockDashboardData.conversionTrends[dateRange] || mockDashboardData.conversionTrends['30d'];

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  return (
    <div className="overview-page-wrapper">
      {/* Page Header */}
      <div className="overview-page-header">
        <h1 className="page-title">Overview</h1>
        <p className="body-lead">Here's your lead intelligence overview.</p>
      </div>

      {/* Loading Skeleton State */}
      {loading && <DashboardSkeleton />}

      {/* Error State */}
      {!loading && error && <DashboardErrorState onRetry={handleRetry} />}

      {/* Empty State */}
      {!loading && !error && isEmpty && <DashboardEmptyState />}

      {/* Normal Dashboard Presentation */}
      {!loading && !error && !isEmpty && (
        <div className="overview-dashboard-content">
          {/* 1. KPI Cards Row (4 Columns on Desktop) */}
          <section className="overview-kpi-grid" aria-label="Key Performance Indicators">
            {mockDashboardData.kpis.map((kpi) => (
              <KPICard
                key={kpi.id}
                label={kpi.label}
                metric={kpi.metric}
                supporting={kpi.supporting}
                icon={kpi.icon}
                isAccent={kpi.isAccent}
              />
            ))}
          </section>

          {/* 2. Main Analytics Row: Conversion Trend (Wide) & Lead Source Performance (Compact) */}
          <section className="overview-analytics-grid" aria-label="Performance Charts">
            <div className="grid-col-wide">
              <ConversionTrendChart
                data={currentTrendData}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
            <div className="grid-col-compact">
              <SourcePerformanceChart data={mockDashboardData.leadSources} />
            </div>
          </section>

          {/* 3. Secondary Row: Lead Distribution & Top Priority Leads Table */}
          <section className="overview-secondary-grid" aria-label="Segmentation and Priority Opportunities">
            <div className="grid-col-compact">
              <LeadDistributionChart data={mockDashboardData.leadDistribution} />
            </div>
            <div className="grid-col-wide">
              <PriorityLeadsTable leads={mockDashboardData.topPriorityLeads} />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
