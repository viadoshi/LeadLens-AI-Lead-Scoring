import React from 'react';
import {
  Clock,
  CalendarCheck,
  Eye,
  Mail,
  FileCheck,
  UserPlus,
  Info,
} from 'lucide-react';
import { getIllustrativeActivities } from '../../utils/mockLeadsData';

export default function LeadActivityTimeline({ lead }) {
  const activities = getIllustrativeActivities(lead);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'demo':
        return <CalendarCheck size={14} className="timeline-icon demo" />;
      case 'view':
        return <Eye size={14} className="timeline-icon view" />;
      case 'email':
        return <Mail size={14} className="timeline-icon email" />;
      case 'form':
        return <FileCheck size={14} className="timeline-icon form" />;
      case 'create':
      default:
        return <UserPlus size={14} className="timeline-icon create" />;
    }
  };

  return (
    <div className="card lead-activity-card">
      <div className="card-header-row">
        <div className="card-header-title-group">
          <div className="card-header-icon" aria-hidden="true">
            <Clock size={18} />
          </div>
          <div>
            <h2 className="section-heading">Lead Activity</h2>
            <p className="card-header-subtitle">Interaction & touchpoint history</p>
          </div>
        </div>

        <span className="illustrative-tag">
          Demo Activity
        </span>
      </div>

      <div className="activity-disclaimer-note" role="note">
        <Info size={14} aria-hidden="true" />
        <span>Illustrative demo events relative to initial intake date ({lead?.dateAdded || 'N/A'}).</span>
      </div>

      <div className="activity-timeline-wrapper">
        <ol className="activity-timeline-list" aria-label="Lead activity history">
          {activities.map((activity, idx) => (
            <li key={activity.id || idx} className="activity-timeline-item">
              <div className="timeline-marker-column" aria-hidden="true">
                <div className="timeline-icon-box">
                  {getActivityIcon(activity.type)}
                </div>
                {idx < activities.length - 1 && <div className="timeline-connector-line" />}
              </div>

              <div className="timeline-content-column">
                <div className="timeline-title-row">
                  <span className="timeline-item-title">{activity.title}</span>
                  <time className="timeline-item-time">{activity.timestamp}</time>
                </div>
                <p className="timeline-item-description">{activity.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
