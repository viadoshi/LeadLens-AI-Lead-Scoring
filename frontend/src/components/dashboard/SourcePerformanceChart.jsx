import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

// Declared outside component render per React performance best practices
function CustomSourceTooltip({ active, payload, chartColors, isDark }) {
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
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{dataPoint.source}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: chartColors.accentBar }}>
          <span style={{ fontWeight: '600' }}>Conversion Rate:</span>
          <span style={{ fontWeight: '700' }}>{dataPoint.conversionRate}%</span>
        </div>
        <div style={{ color: isDark ? '#94A3B8' : '#64748B', marginTop: '4px', fontSize: '11px' }}>
          Volume: {dataPoint.leadsCount} leads
        </div>
      </div>
    );
  }
  return null;
}

export default function SourcePerformanceChart({ data = [] }) {
  const { isDark } = useTheme();

  const chartColors = {
    grid: isDark ? 'rgba(244, 245, 246, 0.07)' : 'rgba(15, 23, 42, 0.06)',
    axisText: isDark ? '#94A3B8' : '#64748B',
    accentBar: isDark ? '#E5A93C' : '#D97706',
    tooltipBg: isDark ? '#1E293B' : '#FFFFFF',
    tooltipBorder: isDark ? 'rgba(244, 245, 246, 0.12)' : '#E2E8F0',
    tooltipText: isDark ? '#F4F5F6' : '#0F172A',
  };

  return (
    <div className="card dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h2 className="section-heading">Lead Source Performance</h2>
          <p className="body-text">Where your highest-quality leads are coming from</p>
        </div>
      </div>

      <div className="chart-canvas-container" style={{ height: '310px', width: '100%', marginTop: '18px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={chartColors.grid} />
            <XAxis
              type="number"
              unit="%"
              domain={[0, 32]}
              stroke={chartColors.axisText}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: chartColors.grid }}
            />
            <YAxis
              type="category"
              dataKey="source"
              stroke={chartColors.axisText}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={78}
            />
            <Tooltip
              content={
                <CustomSourceTooltip chartColors={chartColors} isDark={isDark} />
              }
            />
            <Bar
              dataKey="conversionRate"
              fill={chartColors.accentBar}
              radius={[0, 4, 4, 0]}
              barSize={14}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
