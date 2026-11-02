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

function CustomCampaignTooltip({ active, payload, label, chartColors, isDark }) {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: chartColors.tooltipBg,
          border: `1px solid ${chartColors.tooltipBorder}`,
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          boxShadow: 'var(--shadow)',
          color: chartColors.tooltipText,
          fontSize: '12px',
          minWidth: '160px',
        }}
      >
        <div style={{ fontWeight: '600', marginBottom: '6px', borderBottom: `1px solid ${chartColors.divider}`, paddingBottom: '4px' }}>
          {label}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Leads:</span>
          <span style={{ fontWeight: '600', color: chartColors.tooltipText }}>{dataPoint.leads}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Converted:</span>
          <span style={{ fontWeight: '600', color: chartColors.convertedBar }}>{dataPoint.converted}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: chartColors.accentLine, fontWeight: '700', marginTop: '4px' }}>
          <span>Conversion Rate:</span>
          <span>{dataPoint.conversion_rate}%</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function CampaignConversionChart({ trend = [] }) {
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

  if (!trend || trend.length === 0) {
    return (
      <div className="card campaign-card" role="region" aria-label="Campaign Conversion Velocity">
        <div className="campaign-card-header">
          <div>
            <div className="campaign-card-title-row">
              <TrendingUp size={16} className="campaign-icon-gold" aria-hidden="true" />
              <h2 className="section-heading">Campaign Conversion Velocity</h2>
            </div>
            <p className="body-text">Daily lead capture and conversion yield over campaign duration</p>
          </div>
        </div>
        <div className="campaign-chart-empty">No chronological lead activity recorded for this campaign yet.</div>
      </div>
    );
  }

  // Format date display
  const formattedData = trend.map((t) => {
    let displayDate = t.date;
    if (t.date && t.date.includes('-')) {
      const parts = t.date.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        displayDate = `${months[m]} ${d}`;
      }
    }
    return {
      ...t,
      displayDate,
    };
  });

  return (
    <div className="card campaign-card" role="region" aria-label="Campaign Conversion Velocity">
      <div className="campaign-card-header">
        <div>
          <div className="campaign-card-title-row">
            <TrendingUp size={16} className="campaign-icon-gold" aria-hidden="true" />
            <h2 className="section-heading">Conversion Velocity Trend</h2>
          </div>
          <p className="body-text">Volume of leads captured and conversion yield over time</p>
        </div>
        <div className="analytics-trend-legend-pill">
          <span className="analytics-legend-dot dot-leads" aria-hidden="true" />
          <span>Leads</span>
          <span className="analytics-legend-dot dot-converted" aria-hidden="true" />
          <span>Converted</span>
          <span className="analytics-legend-dot dot-rate" aria-hidden="true" />
          <span>Rate (%)</span>
        </div>
      </div>

      <div style={{ width: '100%', height: 260, marginTop: '12px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={formattedData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
            <XAxis
              dataKey="displayDate"
              stroke={chartColors.axisText}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: chartColors.grid }}
            />
            <YAxis
              yAxisId="left"
              stroke={chartColors.axisText}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={chartColors.accentLine}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit="%"
            />
            <Tooltip
              content={
                <CustomCampaignTooltip
                  chartColors={chartColors}
                  isDark={isDark}
                />
              }
            />
            <Bar
              yAxisId="left"
              dataKey="leads"
              fill={chartColors.leadsBar}
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              yAxisId="left"
              dataKey="converted"
              fill={chartColors.convertedBar}
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="conversion_rate"
              stroke={chartColors.accentLine}
              strokeWidth={2}
              dot={{ r: 2.5, fill: chartColors.accentLine }}
              activeDot={{ r: 5, fill: chartColors.accentLine }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
