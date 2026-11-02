import React from 'react';
import { History, Clock } from 'lucide-react';
import SegmentBadge from '../ui/SegmentBadge';

/**
 * Temporary in-memory prediction history.
 * NOTE: UI-ONLY SESSION STATE. This will eventually be replaced by a persisted
 * prediction history table connected to MySQL and FastAPI in subsequent phases.
 */
export default function PredictionHistory({ history = [] }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="card predict-history-card">
      <div className="history-header-row">
        <div className="history-title-group">
          <History size={16} className="history-header-icon" aria-hidden="true" />
          <h3 className="history-title">Session Predictions</h3>
        </div>
        <span className="history-limit-tag">Recent {history.length}/5</span>
      </div>

      <p className="history-subtitle">
        In-memory browser session log. Discarded upon page reload.
      </p>

      <div className="table-responsive-wrapper history-table-container">
        <table className="dashboard-table history-data-table">
          <thead>
            <tr>
              <th scope="col" style={{ width: '22%' }}>Time</th>
              <th scope="col" style={{ width: '40%' }}>Company</th>
              <th scope="col" style={{ width: '18%' }}>Score</th>
              <th scope="col" style={{ width: '20%' }}>Segment</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="history-table-row">
                <td>
                  <span className="history-time-cell">
                    <Clock size={11} aria-hidden="true" />
                    <span>{item.timestamp}</span>
                  </span>
                </td>
                <td>
                  <div className="history-company-name" title={item.company}>
                    {item.company}
                  </div>
                  {item.name && (
                    <div className="history-lead-name" title={item.name}>
                      {item.name}
                    </div>
                  )}
                </td>
                <td>
                  <span className="history-score-number">{item.score}</span>
                </td>
                <td>
                  <SegmentBadge segment={item.segment} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
