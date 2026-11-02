import React from 'react';
import { CheckCircle2, AlertCircle, MinusCircle, Sliders } from 'lucide-react';

export default function SignalSummary({ signals = [] }) {
  if (!signals || signals.length === 0) return null;

  const normalizeSignal = (sig) => {
    if (typeof sig === 'string') {
      const lower = sig.toLowerCase();
      let type = 'positive';
      if (lower.includes('low') || lower.includes('no budget') || lower.includes('negative')) {
        type = 'negative';
      } else if (lower.includes('standard') || lower.includes('neutral') || lower.includes('general')) {
        type = 'neutral';
      }
      return { text: sig, type };
    }
    return sig;
  };

  const getSignalIcon = (type) => {
    switch (type) {
      case 'positive':
        return <CheckCircle2 size={15} className="signal-status-icon positive" aria-hidden="true" />;
      case 'negative':
        return <AlertCircle size={15} className="signal-status-icon negative" aria-hidden="true" />;
      case 'neutral':
      default:
        return <MinusCircle size={15} className="signal-status-icon neutral" aria-hidden="true" />;
    }
  };

  return (
    <div className="predict-signals-section">
      <div className="signals-header-row">
        <div className="signals-title-group">
          <Sliders size={16} className="signals-header-icon" aria-hidden="true" />
          <h3 className="signals-title">Key Signals</h3>
        </div>
        <span className="input-signals-tag" title="Rule-based explanatory summary of entered attributes. Not actual model SHAP importance.">
          Input Signals
        </span>
      </div>

      <p className="signals-note">
        Salient indicators derived from entered business firmographics and engagement inputs:
      </p>

      <ul className="predict-signals-list" aria-label="Key input signals">
        {signals.map((rawSig, idx) => {
          const sig = normalizeSignal(rawSig);
          return (
            <li key={idx} className={`predict-signal-item ${sig.type || 'neutral'}`}>
              <span className="signal-icon-wrapper">{getSignalIcon(sig.type)}</span>
              <span className="signal-text">{sig.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
