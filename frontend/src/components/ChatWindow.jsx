import { useEffect, useRef, useState } from 'react';
import SuspectAvatar from './SuspectAvatar';
import './ChatWindow.css';

export default function ChatWindow({
  suspectName,
  messages,
  onSendMessage,
  isLoading,
  caseId,
  suspectState,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messages.length]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Placeholder when no suspect selected
  if (!suspectName) {
    return (
      <div className="chat-window chat-window--empty">
        <div className="chat-window__placeholder">
          <span className="chat-window__placeholder-icon">🔍</span>
          <p className="chat-window__placeholder-text">
            Select a suspect to begin interrogation
          </p>
        </div>
      </div>
    );
  }

  const stateLabel = suspectState || 'CALM';

  return (
    <div className="chat-window">
      {/* Header with dual avatars */}
      <header className="chat-window__header">
        <div className="chat-window__header-left">
          <SuspectAvatar
            characterId={suspectName.toLowerCase().replace(' ', '_')}
            size="sm"
            caseId={caseId}
          />
          <div className="chat-window__header-info">
            <span className="chat-window__suspect-name">
              {suspectName}
              {stateLabel !== 'CALM' && (
                <>
                  <span className="chat-window__suspect-divider"> · </span>
                  <span className="chat-window__suspect-state">{stateLabel}</span>
                </>
              )}
            </span>
            <span className="chat-window__interrogation-badge">
              ● UNDER INTERROGATION
            </span>
          </div>
        </div>

        <div className="chat-window__header-right">
          <span className="chat-window__vs">VS</span>
          <SuspectAvatar
            characterId="detective"
            size="sm"
            caseId={caseId}
          />
        </div>
      </header>

      {/* Messages */}
      <div className="chat-window__messages" ref={containerRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble chat-bubble--${msg.role}`}
          >
            {/* Suspect avatar on the left of suspect messages */}
            {msg.role === 'suspect' && (
              <div className="chat-bubble__avatar">
                <SuspectAvatar
                  characterId={suspectName.toLowerCase().replace(' ', '_')}
                  size="xs"
                  caseId={caseId}
                />
              </div>
            )}

            <div className="chat-bubble__text">
              {msg.text}
              {msg.isStreaming && (
                <span className="chat-bubble__cursor" />
              )}
            </div>

            {/* Detective avatar on the right of user messages */}
            {msg.role === 'user' && (
              <div className="chat-bubble__avatar">
                <SuspectAvatar
                  characterId="detective"
                  size="xs"
                  caseId={caseId}
                />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="chat-window__input-bar">
        <input
          className="chat-window__input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Interrogate ${suspectName}...`}
          disabled={isLoading}
        />
        <button
          className="chat-window__send"
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <span className="chat-window__send-loader" />
          ) : (
            'Send'
          )}
        </button>
      </div>
    </div>
  );
}
