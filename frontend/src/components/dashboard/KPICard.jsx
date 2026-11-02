import React from 'react';
import { Users, Flame, Target, TrendingUp } from 'lucide-react';

const iconMap = {
  Users,
  Flame,
  Target,
  TrendingUp,
};

export default function KPICard({ label, metric, supporting, icon, isAccent = false }) {
  const IconComponent = iconMap[icon] || Users;

  return (
    <div className={`card kpi-card ${isAccent ? 'kpi-card-accent' : ''}`}>
      <div className="kpi-card-header">
        <span className="label-small kpi-label">{label}</span>
        <div className={`kpi-icon-wrapper ${isAccent ? 'kpi-icon-accent' : ''}`}>
          <IconComponent size={18} aria-hidden="true" />
        </div>
      </div>

      <div className="kpi-card-body">
        <div className="kpi-value">{metric}</div>
        <div className="kpi-supporting-text">{supporting}</div>
      </div>
    </div>
  );
}
