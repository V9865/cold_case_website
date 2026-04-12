import { useEffect, useState } from 'react';
import SuspectAvatar from './SuspectAvatar';
import BackButton from './BackButton';
import './CaseFileModal.css';

export default function CaseFileModal({
  caseData,
  suspects,
  onBeginInvestigation,
  onClose,
}) {
  const [visible, setVisible] = useState(false);

  // Trigger entry animation on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const caseId = `VC-2026-${String(caseData.caseId).padStart(4, '0')}`;

  return (
    <div
      className={`cfm-overlay ${visible ? 'cfm-overlay--visible' : ''}`}
      onClick={handleOverlayClick}
      style={{ '--accent': caseData.accent }}
    >
      <div className={`cfm-modal ${visible ? 'cfm-modal--visible' : ''}`}>
        {/* Drag handle */}
        <div className="cfm-modal__handle" />

        {/* Back button */}
        <div className="cfm-modal__back-row">
          <BackButton onClick={onClose} label="BACK TO CASES" />
        </div>

        {/* Header strip */}
        <div className="cfm-modal__header">
          <span className="cfm-modal__header-label">CLASSIFIED CASE FILE</span>
          <span className="cfm-modal__header-id">{caseId}</span>
        </div>

        {/* Case title row */}
        <div className="cfm-modal__title-row">
          <h1
            className="cfm-modal__case-title"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '2.8rem',
              color: '#F1F5F9',
              letterSpacing: '0.05em',
              margin: 0,
              lineHeight: 1,
            }}
          >
            {caseData.title}
          </h1>
          <span className="cfm-modal__setting">{caseData.setting}</span>
        </div>

        {/* Two column layout */}
        <div className="cfm-modal__columns">
          {/* Left — Victim & Briefing */}
          <div className="cfm-modal__col">
            <span className="cfm-modal__section-label">VICTIM REPORT</span>

            {/* Labelled data rows */}
            <div className="cfm-modal__victim-rows">
              {[
                ['IDENTITY', caseData.victimIdentity],
                ['STATUS', caseData.victimStatus],
                ['TIME', caseData.victimTime],
                ['LOCATION', caseData.victimLocation],
                ['DISCOVERED', caseData.victimDiscovered],
                ['WEAPON', caseData.victimWeapon || 'Under investigation'],
              ].map(([label, value]) => (
                <div key={label} className="cfm-modal__victim-row">
                  <span className="cfm-modal__victim-row-label">{label}</span>
                  <span className="cfm-modal__victim-row-value">{value}</span>
                </div>
              ))}
            </div>

            <p className="cfm-modal__briefing">{caseData.briefing}</p>
          </div>

          {/* Right — Initial Evidence */}
          <div className="cfm-modal__col">
            <span className="cfm-modal__section-label">INITIAL EVIDENCE</span>

            <div className="cfm-modal__evidence-list">
              {caseData.evidence?.map((item, i) => (
                <div key={i} className="cfm-modal__evidence-item">
                  <span className="cfm-modal__evidence-bullet" />
                  <span className="cfm-modal__evidence-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suspects section */}
        <div className="cfm-modal__suspects-section">
          <span className="cfm-modal__section-label">KNOWN SUSPECTS</span>

          <div className="cfm-modal__suspects-row">
            {suspects?.map((s) => {
              return (
                <div key={s.name} className="cfm-modal__suspect-card">
                  <SuspectAvatar characterId={s.name} size="lg" />
                  <span className="cfm-modal__suspect-name">{s.name}</span>
                  <span className="cfm-modal__suspect-role">{s.role}</span>
                  <span className="cfm-modal__suspect-status">
                    NOT YET INTERROGATED
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="cfm-modal__bottom-bar">
          <span className="cfm-modal__bottom-hint">
            READ THE FILE. THEN FIND THE KILLER.
          </span>
          <button
            className="cfm-modal__begin-btn"
            onClick={onBeginInvestigation}
          >
            BEGIN INTERROGATION
          </button>
        </div>
      </div>
    </div>
  );
}
