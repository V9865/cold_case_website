import { useState } from 'react';
import TranscriptViewer from './TranscriptViewer';
import './CaseSelection.css';

const CASE_TYPE_MAP = {
  1: 'HOMICIDE  —  CASINO',
  2: 'POISONING  —  HOTEL',
  3: 'MECHANICAL SABOTAGE  —  ARENA',
};

export default function CaseSelection({ onSelectCase, onResumeCase, cases }) {
  const [showTranscript, setShowTranscript] = useState(null); // caseId or null

  return (
    <div className="case-selection">
      {/* ── Hero Center Section ── */}
      <section className="case-selection__hero">
        {/* Eyebrow */}
        <span className="case-selection__eyebrow">
          SIN CITY CHRONICLES — CLASSIFIED OPERATIONS
        </span>

        {/* Main Title */}
        <div className="case-selection__hero-title">
          <span
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 900,
              fontSize: '4.5rem',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: '#F8FAFC',
            }}
          >
            COLD CASE
          </span>

          {/* Thin accent rule */}
          <div className="case-selection__hero-rule" />

          <span
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: '4.5rem',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              color: 'var(--accent, var(--color-crimson))',
            }}
          >
            VEGAS
          </span>
        </div>

        {/* Tagline */}
        <p className="case-selection__tagline">
          The suspicion meter does not solve cases. It misleads them.
          Think like a detective, not an algorithm.
        </p>

        {/* Bottom Decoration */}
        <div className="case-selection__hero-stats">
          <span>3 ACTIVE CASES</span>
          <span className="case-selection__hero-dot">·</span>
          <span>9 SUSPECTS</span>
          <span className="case-selection__hero-dot">·</span>
          <span>3 KILLERS</span>
        </div>
      </section>

      {/* ── Cards Grid ── */}
      <div className="case-selection__grid">
        {cases.map((c) => (
          <div
            key={c.id}
            className="case-selection__card"
            style={{
              '--card-accent': c.accent,
              '--card-accent-dark': c.accentDark,
            }}
            onClick={() => onSelectCase(c.id)}
          >
            {/* Top accent strip */}
            <div
              className="case-selection__card-strip"
              style={{ background: c.accent }}
            />

            {/* Case number badge (absolute top-right) */}
            <span className="case-selection__card-badge">
              CASE {String(c.id).padStart(3, '0')}
            </span>

            {/* ── ZONE 1: Top ── */}
            <div className="case-selection__card-zone1">
              <span className="case-selection__card-type">
                {CASE_TYPE_MAP[c.id] || 'CLASSIFIED'}
              </span>
            </div>

            {/* ── ZONE 2: Middle (flex-1) ── */}
            <div className="case-selection__card-zone2">
              {/* Case title */}
              <h2
                className="case-selection__card-title"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  color: '#F1F5F9',
                  letterSpacing: '0.05em',
                }}
              >
                {c.title}
              </h2>

              {/* Setting tag */}
              <span
                className="case-selection__card-setting"
                style={{ color: c.accent }}
              >
                {c.setting}
              </span>

              {/* Divider */}
              <div className="case-selection__card-divider" />

              {/* Victim row */}
              <div className="case-selection__card-victim-row">
                <div className="case-selection__card-victim-dot" />
                <span className="case-selection__card-victim-text">
                  {c.victim}
                </span>
              </div>
            </div>

            {/* ── ZONE 3: Bottom ── */}
            <div className="case-selection__card-zone3">
              {/* ROW A: Micro-stat chips */}
              <div className="case-selection__card-chips">
                <div className="case-selection__card-chip">
                  <span className="case-selection__card-chip-val" style={{ color: c.accent }}>3</span>
                  <span className="case-selection__card-chip-label">SUSPECTS</span>
                </div>
                <div className="case-selection__card-chip">
                  <span className="case-selection__card-chip-val" style={{ color: c.accent }}>1</span>
                  <span className="case-selection__card-chip-label">KILLER</span>
                </div>
                <div className="case-selection__card-chip">
                  <span className="case-selection__card-chip-val case-selection__card-chip-val--muted">???</span>
                  <span className="case-selection__card-chip-label">MOTIVE</span>
                </div>
              </div>

              {/* ROW B: Full-width CTA */}
              <button
                className="case-selection__card-btn"
                style={{
                  borderColor: c.accent,
                  color: c.accent,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCase(c.id);
                }}
              >
                OPEN CASE
              </button>

              {/* Resume button (if saved session exists) */}
              {(() => {
                const raw = localStorage.getItem('ccv_session_' + c.id);
                if (!raw) return null;
                try {
                  const saved = JSON.parse(raw);
                  const time = new Date(saved.timestamp).toLocaleTimeString(
                    [], { hour: 'numeric', minute: '2-digit' }
                  );
                  return (
                    <>
                      <button
                        className="case-selection__card-resume"
                        onClick={(e) => {
                          e.stopPropagation();
                          onResumeCase(c.id);
                        }}
                      >
                        RESUME — saved at {time}
                      </button>
                      <button
                        className="case-selection__card-resume"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTranscript(c.id);
                        }}
                      >
                        VIEW LAST TRANSCRIPT
                      </button>
                    </>
                  );
                } catch { return null; }
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* Transcript overlay */}
      {showTranscript && (
        <TranscriptViewer
          caseId={showTranscript}
          onClose={() => setShowTranscript(null)}
        />
      )}
    </div>
  );
}
