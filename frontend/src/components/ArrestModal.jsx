import { useState } from 'react';
import './ArrestModal.css';

export default function ArrestModal({ suspects, victimName, onSubmitArrest, onCancel }) {
  const [selectedSuspect, setSelectedSuspect] = useState('');

  const handleConfirm = () => {
    if (!selectedSuspect) return;
    onSubmitArrest(selectedSuspect);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleConfirm();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="arrest-overlay">
      <div className="arrest-card">
        {/* Decorative top bar */}
        <div className="arrest-card__accent" />

        <div className="arrest-card__body">
          <h2 className="arrest-card__title">Make Your Arrest</h2>
          <p className="arrest-card__subtitle">
            Who do you believe killed {victimName}?
          </p>

          <div className="arrest-card__suspects" onKeyDown={handleKeyDown}>
            {(suspects || []).map((s) => (
              <button
                key={s.name}
                className={`arrest-card__suspect-btn ${
                  selectedSuspect === s.name ? 'arrest-card__suspect-btn--selected' : ''
                }`}
                onClick={() => setSelectedSuspect(s.name)}
              >
                <span className="arrest-card__suspect-name">{s.name}</span>
                <span className="arrest-card__suspect-role">{s.role}</span>
              </button>
            ))}
          </div>

          <div className="arrest-card__actions">
            <button
              className="arrest-card__btn arrest-card__btn--cancel"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className={`arrest-card__btn arrest-card__btn--confirm ${
                selectedSuspect ? 'arrest-card__btn--confirm-active' : ''
              }`}
              onClick={handleConfirm}
              disabled={!selectedSuspect}
            >
              🔒 Arrest {selectedSuspect || '...'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
