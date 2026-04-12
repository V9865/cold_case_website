import { useState, useEffect } from 'react';
import './TranscriptViewer.css';

// Build initials from a suspect name, e.g. 'Lance Vance' → 'L.V.'
function getInitials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase())
    .filter(Boolean)
    .join('.')
    .concat('.');
}

export default function TranscriptViewer({ caseId, onClose }) {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  // Load saved session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ccv_session_' + caseId);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSession(parsed);
        // Default to first suspect with messages
        const suspects = Object.keys(parsed.messages || {});
        const first = suspects.find(
          (s) => parsed.messages[s]?.length > 0
        );
        setActiveTab(first || suspects[0] || null);
      }
    } catch {
      setSession(null);
    }
  }, [caseId]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!session) {
    return (
      <div className="transcript-overlay" onClick={onClose}>
        <div className="transcript" onClick={(e) => e.stopPropagation()}>
          <div className="transcript__empty">No transcript data found.</div>
        </div>
      </div>
    );
  }

  const suspects = Object.keys(session.messages || {});
  const activeMessages = activeTab
    ? (session.messages[activeTab] || [])
    : [];

  // Count total messages across all suspects
  const totalCount = Object.values(session.messages || {}).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const savedTime = session.timestamp
    ? new Date(session.timestamp).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  const caseLabel = `VC-2026-${String(caseId).padStart(4, '0')}`;

  return (
    <div className="transcript-overlay" onClick={onClose}>
      <div className="transcript" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <header className="transcript__header">
          <span className="transcript__header-label">
            OFFICIAL INTERVIEW TRANSCRIPT
          </span>
          <span className="transcript__header-meta">
            {caseLabel}
            {savedTime && <> · {savedTime}</>}
          </span>
        </header>

        {/* Tabs */}
        <nav className="transcript__tabs">
          {suspects.map((name) => (
            <button
              key={name}
              className={`transcript__tab ${
                activeTab === name ? 'transcript__tab--active' : ''
              }`}
              onClick={() => setActiveTab(name)}
              type="button"
            >
              {name}
            </button>
          ))}
        </nav>

        {/* Body */}
        <div className="transcript__body">
          {activeMessages.length === 0 ? (
            <div className="transcript__empty">
              No messages recorded with this suspect.
            </div>
          ) : (
            activeMessages
              .filter((m) => m.text && m.text.trim())
              .map((msg, i) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={i} className="transcript__line">
                    <span
                      className={`transcript__badge ${
                        isUser
                          ? 'transcript__badge--det'
                          : 'transcript__badge--suspect'
                      }`}
                    >
                      {isUser ? 'DET.' : getInitials(activeTab)}
                    </span>
                    <span
                      className={`transcript__text ${
                        isUser
                          ? 'transcript__text--det'
                          : 'transcript__text--suspect'
                      }`}
                    >
                      {isUser ? `"${msg.text}"` : msg.text}
                    </span>
                  </div>
                );
              })
          )}
        </div>

        {/* Footer */}
        <footer className="transcript__footer">
          <span className="transcript__footer-count">
            {totalCount} messages recorded
          </span>
          <button
            className="transcript__footer-close"
            onClick={onClose}
            type="button"
          >
            CLOSE
          </button>
        </footer>
      </div>
    </div>
  );
}
