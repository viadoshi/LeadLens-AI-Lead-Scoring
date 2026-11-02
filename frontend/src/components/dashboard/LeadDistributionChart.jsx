import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

// Declared outside component render per React performance best practices
function CustomDistributionTooltip({ active, payload, segmentColors, tooltipBg, tooltipBorder, tooltipText, isDark }) {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const color = segmentColors[dataPoint.segment] || '#E5A93C';
    return (
      <div
        style={{
          backgroundColor: tooltipBg,
          border: `1px solid ${tooltipBorder}`,
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          boxShadow: 'var(--shadow)',
          color: tooltipText,
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', color }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
          <span>{dataPoint.segment}</span>
        </div>
        <div style={{ marginTop: '4px', fontSize: '13px', fontWeight: '600' }}>
          {dataPoint.count.toLocaleString()} leads ({dataPoint.percentage}%)
        </div>
        <div style={{ color: isDark ? '#94A3B8' : '#64748B', marginTop: '2px', fontSize: '11px' }}>
          {dataPoint.description}
        </div>
      </div>
    );
  }
  return null;
}

export default function LeadDistributionChart({ data = [] }) {
  const { isDark } = useTheme();

  // Curated segment palette harmonious with the LeadLens brand tokens
  const segmentColors = {
    HOT: isDark ? '#E5A93C' : '#D97706',
    WARM: '#F59E0B',
    NURTURE: isDark ? '#3B82F6' : '#2563EB',
    COLD: isDark ? '#64748B' : '#94A3B8',
  };

  const tooltipBg = isDark ? '#1E293B' : '#FFFFFF';
  const tooltipBorder = isDark ? 'rgba(244, 245, 246, 0.12)' : '#E2E8F0';
  const tooltipText = isDark ? '#F4F5F6' : '#0F172A';

  const totalLeads = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="card dashboard-card">
      <div className="dashboard-card-header">
        <div>
          <h2 className="section-heading">Lead Distribution</h2>
          <p className="body-text">Volume segmentation across lead priority tiers</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ height: '220px', width: '100%', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={
                  <CustomDistributionTooltip
                    segmentColors={segmentColors}
                    tooltipBg={tooltipBg}
                    tooltipBorder={tooltipBorder}
                    tooltipText={tooltipText}
                    isDark={isDark}
                  />
                }
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="segment"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={92}
                paddingAngle={4}
                stroke={isDark ? '#1E293B' : '#FFFFFF'}
                strokeWidth={2}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.segment}
                    fill={segmentColors[entry.segment] || segmentColors.COLD}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Callout Metric inside Donut */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Total
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              {totalLeads.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="lead-distribution-legend">
          {data.map((item) => {
            const color = segmentColors[item.segment] || segmentColors.COLD;
            return (
              <div key={item.segment} className="legend-item">
                <span className="legend-bullet" style={{ backgroundColor: color }} aria-hidden="true" />
                <span className="legend-label">{item.segment}</span>
                <span className="legend-percentage">{item.percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
