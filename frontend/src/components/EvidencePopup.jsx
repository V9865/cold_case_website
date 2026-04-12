import { useEffect } from 'react';
import './EvidencePopup.css';

export default function EvidencePopup({ evidence, isOpen, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="evidence-popup">
      {/* Header */}
      <div className="evidence-popup__header">
        <span className="evidence-popup__header-label">
          INITIAL EVIDENCE FILE
        </span>
        <button
          className="evidence-popup__close"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="evidence-popup__body">
        {evidence?.map((item, i) => (
          <div key={i} className="evidence-popup__item">
            <span className="evidence-popup__badge">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="evidence-popup__text">{item}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="evidence-popup__footer">
        This evidence was documented at the scene. Use it to test suspect
        statements.
      </div>
    </div>
  );
}
