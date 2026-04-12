import './MuteButton.css';

export default function MuteButton({ isMuted, onToggle }) {
  return (
    <div className="mute-btn-wrapper">
      <button
        className="mute-btn group"
        onClick={onToggle}
        type="button"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {/* Tooltip */}
        <span className="mute-btn__tooltip">
          {isMuted ? 'CLICK TO UNMUTE' : 'CLICK TO MUTE'}
        </span>

        {/* Icon */}
        {isMuted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#475569" stroke="none"/>
            <line x1="23" y1="9" x2="17" y2="15" stroke="#475569"/>
            <line x1="17" y1="9" x2="23" y2="15" stroke="#475569"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="var(--accent)" stroke="none"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="var(--accent)"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="var(--accent)"/>
          </svg>
        )}
      </button>
    </div>
  );
}
