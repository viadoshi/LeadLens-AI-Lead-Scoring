import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function Toast({ message, subtext, onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className="toast-notification" role="status" aria-live="polite">
      <div className="toast-icon-wrapper" aria-hidden="true">
        <CheckCircle2 size={18} />
      </div>

      <div className="toast-content">
        <div className="toast-message">{message}</div>
        {subtext && <div className="toast-subtext">{subtext}</div>}
      </div>

      <button
        type="button"
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
