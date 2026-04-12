import './CluePanel.css';

export default function CluePanel({ clues, onMakeArrest }) {
  return (
    <div className="clue-panel">
      {/* Header */}
      <header className="clue-panel__header">
        <h2 className="clue-panel__title">Detective Case File</h2>
        <span className="clue-panel__count">{clues.length}</span>
      </header>

      {/* Clue list */}
      <div className="clue-panel__list">
        {clues.length === 0 ? (
          <div className="clue-panel__empty">
            <span className="clue-panel__empty-icon">🗂️</span>
            <p className="clue-panel__empty-text">
              No evidence logged.<br />
              Begin interrogating suspects.
            </p>
          </div>
        ) : (
          clues.map((clue, i) => (
            <div
              key={`${clue}-${i}`}
              className="clue-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="clue-card__number">{i + 1}</span>
              <span className="clue-card__text">{clue}</span>
            </div>
          ))
        )}
      </div>

      {/* Arrest button */}
      <div className="clue-panel__footer">
        <button
          className={`clue-panel__arrest ${clues.length > 0 ? 'clue-panel__arrest--active' : ''}`}
          disabled={clues.length === 0}
          onClick={onMakeArrest}
        >
          🔒 Make Arrest
        </button>
      </div>
    </div>
  );
}
