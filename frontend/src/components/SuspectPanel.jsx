import SuspectAvatar from './SuspectAvatar';
import './SuspectPanel.css';

const STATE_CONFIG = {
  CALM:      { label: 'CALM',      className: 'suspect-card__badge--calm' },
  DEFENSIVE: { label: 'DEFENSIVE', className: 'suspect-card__badge--defensive' },
  BREAKING:  { label: 'BREAKING',  className: 'suspect-card__badge--breaking' },
};

function getBarColor(score) {
  if (score <= 30) return '#22c55e';
  if (score <= 65) return '#f59e0b';
  return 'var(--accent, #ef4444)';
}

export default function SuspectPanel({
  suspects,
  activeSuspect,
  onSelectSuspect,
  suspicionScores,
  suspectStates,
  caseId,
}) {
  return (
    <div className="suspect-panel">
      {suspects.map((s) => {
        const isActive = activeSuspect === s.name;
        const score = suspicionScores?.[s.name] ?? 0;
        const state = suspectStates?.[s.name] ?? 'CALM';
        const stateConf = STATE_CONFIG[state] || STATE_CONFIG.CALM;
        const barColor = getBarColor(score);

        return (
          <button
            key={s.name}
            className={`suspect-card ${isActive ? 'card-active' : ''}`}
            onClick={() => onSelectSuspect(s.name)}
          >
            {/* Top row: avatar + identity + badge */}
            <div className="suspect-card__top">
              <SuspectAvatar
                characterId={s.name.toLowerCase().replace(' ', '_')}
                size="md"
                caseId={caseId}
              />

              <div className="suspect-card__identity">
                <span className="suspect-card__name">{s.name}</span>
                <span className="suspect-card__role">{s.role}</span>
              </div>

              {state !== 'CALM' && (
                <span className={`suspect-card__badge ${stateConf.className}`}>
                  {stateConf.label}
                </span>
              )}
            </div>

            {/* Suspicion bar */}
            <div className="suspect-card__meter">
              <span className="suspect-card__meter-label">Suspicion Level</span>

              <div className="suspect-card__bar-row">
                <div className="suspect-card__bar-track">
                  <div
                    className="suspect-card__bar-fill"
                    style={{
                      width: `${Math.min(score, 100)}%`,
                      backgroundColor: barColor,
                      boxShadow: `0 0 8px ${score > 65 ? 'rgba(var(--accent-rgb, 239, 68, 68), 0.3)' : barColor + '55'}`,
                    }}
                  />
                </div>
                <span
                  className="suspect-card__score"
                  style={{ color: barColor }}
                >
                  {score}%
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
