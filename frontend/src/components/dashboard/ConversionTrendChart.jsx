import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Declared outside component render per React performance best practices
function CustomConversionTooltip({ active, payload, label, chartColors, isDark }) {
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
        }}
      >
        <div style={{ fontWeight: '600', marginBottom: '6px' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: chartColors.accentLine }}>
          <span style={{ fontWeight: '600' }}>Conversion Rate:</span>
          <span style={{ fontWeight: '700' }}>{dataPoint.conversionRate}%</span>
        </div>
        <div style={{ color: isDark ? '#94A3B8' : '#64748B', marginTop: '4px', fontSize: '11px' }}>
          <span>Converted: </span>
          <span style={{ fontWeight: '600', color: chartColors.tooltipText }}>{dataPoint.convertedLeads}</span>
          <span> / {dataPoint.totalLeads} total leads</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function ConversionTrendChart({
  data = [],
  dateRange = '30d',
  onDateRangeChange,
}) {
  const { isDark } = useTheme();

  // Dynamic theme-aware palette tokens for Recharts SVG rendering
  const chartColors = {
    grid: isDark ? 'rgba(244, 245, 246, 0.07)' : 'rgba(15, 23, 42, 0.06)',
    axisText: isDark ? '#94A3B8' : '#64748B',
    accentLine: isDark ? '#E5A93C' : '#D97706',
    tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
    tooltipBorder: isDark ? 'rgba(244, 245, 246, 0.12)' : '#E2E8F0',
    tooltipText: isDark ? '#F4F5F6' : '#0F172A',
  };

  return (
    <div className="card dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h2 className="section-heading">Conversion Trend</h2>
          <p className="body-text">Lead conversion performance over time</p>
        </div>

        {/* Date Range Control (API-Ready) */}
        <div className="date-range-control-wrapper">
          <Calendar size={14} className="date-range-icon" aria-hidden="true" />
          <select
            className="date-range-select"
            value={dateRange}
            onChange={(e) => onDateRangeChange && onDateRangeChange(e.target.value)}
            aria-label="Filter conversion trend timeframe"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="chart-canvas-container" style={{ height: '310px', width: '100%', marginTop: '18px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartColors.grid} />
            <XAxis
              dataKey="date"
              stroke={chartColors.axisText}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: chartColors.grid }}
              dy={8}
            />
            <YAxis
              unit="%"
              domain={[10, 25]}
              stroke={chartColors.axisText}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-4}
            />
            <Tooltip
              content={
                <CustomConversionTooltip chartColors={chartColors} isDark={isDark} />
              }
            />
            <Line
              type="monotone"
              dataKey="conversionRate"
              stroke={chartColors.accentLine}
              strokeWidth={2.5}
              dot={{ r: 3, fill: chartColors.accentLine, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: chartColors.accentLine, stroke: chartColors.tooltipBg, strokeWidth: 2 }}
              name="Conversion Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
