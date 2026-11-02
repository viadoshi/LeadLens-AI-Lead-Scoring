import React from 'react';
import { Trophy, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ModelTournamentTable({ tournament = [], productionModelName = 'Logistic Regression' }) {
  if (!tournament || tournament.length === 0) return null;

  return (
    <div className="card model-tournament-card" role="region" aria-label="Model Tournament Results">
      <div className="tournament-card-header">
        <div className="tournament-header-title-group">
          <div className="tournament-header-icon" aria-hidden="true">
            <Trophy size={18} />
          </div>
          <div>
            <h2 className="section-heading">Model Tournament</h2>
            <p className="card-header-subtitle">
              How the candidate models performed during evaluation.
            </p>
          </div>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="leads-table tournament-table" aria-label="Candidate Models Evaluation Tournament">
          <thead>
            <tr>
              <th scope="col" style={{ width: '60px' }}>Rank</th>
              <th scope="col">Model</th>
              <th scope="col">CV ROC-AUC</th>
              <th scope="col">Test ROC-AUC</th>
              <th scope="col">Precision</th>
              <th scope="col">Recall</th>
              <th scope="col">F1</th>
              <th scope="col">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {tournament.map((item, index) => {
              const isWinner = item.model.toLowerCase() === productionModelName.toLowerCase();
              const rank = index + 1;

              const cvRocAuc = item.cv_roc_auc_mean !== undefined
                ? (item.cv_roc_auc_mean * 100).toFixed(2) + '%'
                : '—';
              const cvStd = item.cv_roc_auc_std !== undefined
                ? `± ${(item.cv_roc_auc_std * 100).toFixed(2)}%`
                : '';

              const testRocAuc = item.roc_auc !== undefined
                ? (item.roc_auc * 100).toFixed(2) + '%'
                : '—';

              const precision = item.precision !== undefined
                ? (item.precision * 100).toFixed(2) + '%'
                : '—';

              const recall = item.recall !== undefined
                ? (item.recall * 100).toFixed(2) + '%'
                : '—';

              const f1 = item.f1 !== undefined
                ? (item.f1 * 100).toFixed(2) + '%'
                : '—';

              const accuracy = item.accuracy !== undefined
                ? (item.accuracy * 100).toFixed(2) + '%'
                : '—';

              return (
                <tr
                  key={item.model}
                  className={`tournament-row ${isWinner ? 'tournament-row-winner' : ''}`}
                >
                  <td className="tournament-rank-col">
                    <span className={`rank-badge ${rank === 1 ? 'rank-badge-first' : ''}`}>
                      #{rank}
                    </span>
                  </td>

                  <td className="tournament-model-name-col">
                    <div className="model-name-wrapper">
                      <span className="model-family-name">{item.model}</span>
                      {isWinner && (
                        <span className="production-badge" title="Active production model serving predictions">
                          <ShieldCheck size={11} aria-hidden="true" />
                          <span>PRODUCTION</span>
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="tournament-metric-col highlight-cell">
                    <span className="metric-main-val">{cvRocAuc}</span>
                    {cvStd && <span className="metric-std-val">{cvStd}</span>}
                  </td>

                  <td className="tournament-metric-col">{testRocAuc}</td>
                  <td className="tournament-metric-col">{precision}</td>
                  <td className="tournament-metric-col">{recall}</td>
                  <td className="tournament-metric-col">{f1}</td>
                  <td className="tournament-metric-col">{accuracy}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="tournament-footer-note">
        <CheckCircle size={13} className="footer-note-icon" aria-hidden="true" />
        <span>
          Winning candidate <strong>{productionModelName}</strong> selected based on highest cross-validation ROC-AUC, superior probability calibration (Brier score: 0.1475), and optimal production latency.
        </span>
      </div>
    </div>
  );
}
