import { useState } from 'react';
import './Briefing.css';

export default function Briefing({ onStartInvestigation }) {
  const [entered, setEntered] = useState(false);

  return (
    <div className={`briefing ${entered ? 'briefing--entered' : ''}`}>
      {/* Ambient background effects */}
      <div className="briefing__noise" />
      <div className="briefing__vignette" />
      <div className="briefing__scanline" />

      {/* Top header bar */}
      <header className="briefing__header">
        <div className="briefing__header-inner">
          <h1 className="briefing__title">
            <span className="briefing__title-cold">COLD CASE</span>{' '}
            <span className="briefing__title-vegas">VEGAS</span>
          </h1>
          <span className="briefing__badge">● ACTIVE INVESTIGATION</span>
        </div>
      </header>

      {/* Main content */}
      <main className="briefing__body">
        {/* Case file card */}
        <section className="briefing__card">
          <div className="briefing__card-label">
            <span className="briefing__card-icon">📁</span>
            CLASSIFIED — CASE FILE #4471
          </div>

          <div className="briefing__details">
            <div className="briefing__detail-row">
              <span className="briefing__label">VICTIM</span>
              <span className="briefing__value">Marcus Vega</span>
            </div>
            <div className="briefing__divider" />
            <div className="briefing__detail-row">
              <span className="briefing__label">LOCATION</span>
              <span className="briefing__value">The Mirage — Floor 12</span>
            </div>
            <div className="briefing__divider" />
            <div className="briefing__detail-row">
              <span className="briefing__label">TIME OF DEATH</span>
              <span className="briefing__value">11:40 PM</span>
            </div>
            <div className="briefing__divider" />
            <div className="briefing__detail-row">
              <span className="briefing__label">STATUS</span>
              <span className="briefing__value briefing__value--suspects">
                3 Suspects Identified
              </span>
            </div>
          </div>
        </section>

        {/* Role section */}
        <section className="briefing__role">
          <h2 className="briefing__role-title">YOUR ROLE</h2>
          <p className="briefing__role-text">
            You are the <strong>lead detective</strong> assigned to this cold case.
            Interrogate all three suspects. Detect contradictions. Uncover hidden evidence.
            Build your case — then make your arrest.
          </p>
          <p className="briefing__role-warning">
            ⚠ Choose wisely. You only get one shot at an arrest.
          </p>
        </section>

        {/* CTA */}
        <button
          className="briefing__cta"
          onClick={() => {
            setEntered(true);
            setTimeout(onStartInvestigation, 600);
          }}
        >
          <span className="briefing__cta-text">Begin Investigation</span>
          <span className="briefing__cta-arrow">→</span>
        </button>
      </main>

      {/* Bottom decoration */}
      <footer className="briefing__footer">
        LVMPD — Las Vegas Metropolitan Police Department • Homicide Division
      </footer>
    </div>
  );
}
