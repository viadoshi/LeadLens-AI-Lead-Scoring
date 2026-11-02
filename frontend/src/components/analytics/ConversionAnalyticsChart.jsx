import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function CustomAnalyticsTooltip({ active, payload, label, isDark, chartColors }) {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: chartColors.tooltipBg,
          border: `1px solid ${chartColors.tooltipBorder}`,
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          boxShadow: 'var(--shadow)',
          color: chartColors.tooltipText,
          fontSize: '12px',
          minWidth: '180px',
        }}
      >
        <div style={{ fontWeight: '600', marginBottom: '8px', borderBottom: `1px solid ${chartColors.divider}`, paddingBottom: '4px' }}>
          {label}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
          <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Total Leads:</span>
          <span style={{ fontWeight: '600', color: chartColors.tooltipText }}>{dataPoint.leads}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
          <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Converted:</span>
          <span style={{ fontWeight: '600', color: chartColors.convertedBar }}>{dataPoint.converted}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: chartColors.accentLine, fontWeight: '700', marginTop: '6px' }}>
          <span>Conversion Rate:</span>
          <span>{dataPoint.conversion_rate}%</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function ConversionAnalyticsChart({ trend = [], rangeLabel = 'Selected Period' }) {
  const { isDark } = useTheme();

  const chartColors = {
    grid: isDark ? 'rgba(244, 245, 246, 0.06)' : 'rgba(15, 23, 42, 0.05)',
    axisText: isDark ? '#94A3B8' : '#64748B',
    leadsBar: isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(100, 116, 139, 0.20)',
    convertedBar: isDark ? '#38BDF8' : '#0284C7',
    accentLine: isDark ? '#E5A93C' : '#D97706',
    tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
    tooltipBorder: isDark ? 'rgba(244, 245, 246, 0.12)' : '#E2E8F0',
    tooltipText: isDark ? '#F4F5F6' : '#0F172A',
    divider: isDark ? 'rgba(244, 245, 246, 0.08)' : '#E2E8F0',
  };

  // Format short date for X-axis (e.g. 2026-10-21 -> Oct 21)
  const formattedData = trend.map((item) => {
    let displayDate = item.date;
    if (item.date && item.date.includes('-')) {
      const parts = item.date.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        displayDate = `${months[m]} ${d}`;
      }
    }
    return {
      ...item,
      displayDate,
    };
  });

  return (
    <div className="card analytics-card" role="region" aria-label="Pipeline Conversion Trend Chart">
      <div className="analytics-card-header">
        <div>
          <div className="analytics-card-title-row">
            <TrendingUp size={18} className="analytics-icon-gold" aria-hidden="true" />
            <h2 className="section-heading">Conversion Trend & Velocity</h2>
          </div>
          <p className="body-text">
            Volume of incoming leads, closed conversions, and rate yield across {rangeLabel.toLowerCase()}
          </p>
        </div>
        <div className="analytics-trend-legend-pill">
          <span className="analytics-legend-dot dot-leads" aria-hidden="true" />
          <span>Leads</span>
          <span className="analytics-legend-dot dot-converted" aria-hidden="true" />
          <span>Converted</span>
          <span className="analytics-legend-dot dot-rate" aria-hidden="true" />
          <span>Conversion Rate (%)</span>
        </div>
      </div>

      <div style={{ width: '100%', height: 320, marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
            <XAxis
              dataKey="displayDate"
              stroke={chartColors.axisText}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: chartColors.grid }}
            />
            {/* Left Y Axis: Volume Counts */}
            <YAxis
              yAxisId="left"
              stroke={chartColors.axisText}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            {/* Right Y Axis: Conversion Rate % */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={chartColors.accentLine}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit="%"
              domain={[0, 'auto']}
            />
            <Tooltip
              content={
                <CustomAnalyticsTooltip
                  isDark={isDark}
                  chartColors={chartColors}
                />
              }
            />
            <Bar
              yAxisId="left"
              dataKey="leads"
              name="Total Leads"
              fill={chartColors.leadsBar}
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              yAxisId="left"
              dataKey="converted"
              name="Converted Leads"
              fill={chartColors.convertedBar}
              radius={[3, 3, 0, 0]}
              maxBarSize={32}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="conversion_rate"
              name="Conversion Rate"
              stroke={chartColors.accentLine}
              strokeWidth={2.5}
              dot={{ r: 3, fill: chartColors.accentLine }}
              activeDot={{ r: 6, fill: chartColors.accentLine }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
