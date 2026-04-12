import { useState, useEffect } from 'react';
import TranscriptViewer from './TranscriptViewer';
import './VerdictScreen.css';

// ── Parse structured verdict into labeled sections ──────────────────
const SECTION_LABELS = [
  'THE VERDICT',
  'THE KILLER',
  'THE MOTIVE',
  'THE METHOD',
  'THE KEY EVIDENCE',
  'THE DETECTIVE',
];

const parseVerdict = (text) => {
  const sections = {};
  SECTION_LABELS.forEach((label) => {
    const regex = new RegExp(`\\[${label}\\]([\\s\\S]*?)(?=\\[|$)`, 'i');
    const match = text.match(regex);
    if (match) sections[label] = match[1].trim();
  });
  return sections;
};

// ── Render bullets for THE KEY EVIDENCE section ─────────────────────
function EvidenceBullets({ text }) {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('—') || l.startsWith('-'));

  return (
    <div className="verdict-evidence">
      {lines.map((line, i) => (
        <div key={i} className="verdict-evidence__item">
          <span className="verdict-evidence__dot" />
          <span className="verdict-evidence__text">
            {line.replace(/^[—\-]\s*/, '')}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Section card component ──────────────────────────────────────────
function SectionCard({ label, content }) {
  const isVerdict = label === 'THE VERDICT';
  const isEvidence = label === 'THE KEY EVIDENCE';

  return (
    <div className="verdict-section section-reveal">
      <span className="verdict-section__label">{label}</span>
      {isEvidence ? (
        <EvidenceBullets text={content} />
      ) : (
        <p
          className={`verdict-section__content ${
            isVerdict ? 'verdict-section__content--hero' : ''
          }`}
        >
          {content}
        </p>
      )}
    </div>
  );
}

export default function VerdictScreen({ correct, verdict, onPlayAgain, caseId }) {
  const sections = parseVerdict(verdict || '');
  const hasSections = Object.keys(sections).length > 0;

  // Build the ordered list of sections that exist
  const visibleLabels = SECTION_LABELS.filter((l) => sections[l]);
  const totalSections = visibleLabels.length;

  // Timed reveal — one section every 1.4s
  const [revealedCount, setRevealedCount] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    if (!hasSections) return;

    const timer = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev >= totalSections) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 1400);

    return () => clearInterval(timer);
  }, [totalSections, hasSections]);

  const allRevealed = revealedCount >= totalSections;

  return (
    <div className={`verdict ${correct ? 'verdict--correct' : 'verdict--wrong'}`}>
      {/* Header */}
      <header className="verdict__header">
        <span className="verdict__icon">{correct ? '✅' : '❌'}</span>
        <h1 className="verdict__title">
          {correct
            ? 'Case Closed — Correct Arrest'
            : 'Wrong Arrest — The Truth Revealed'}
        </h1>
      </header>

      {/* Verdict card */}
      <div className="verdict__card-wrapper">
        <div className="verdict__card">
          {hasSections ? (
            visibleLabels.map(
              (label, index) =>
                index < revealedCount && (
                  <SectionCard
                    key={label}
                    label={label}
                    content={sections[label]}
                  />
                )
            )
          ) : (
            /* Fallback: render raw text if sections fail to parse */
            <p className="verdict__text">{verdict}</p>
          )}
        </div>
      </div>

      {/* Footer — skip + transcript + play again */}
      <div className="verdict__footer">
        {!allRevealed && hasSections && (
          <button
            className="verdict__skip"
            onClick={() => setRevealedCount(totalSections)}
            type="button"
          >
            SKIP TO END ▸
          </button>
        )}
        <button
          className="verdict__skip"
          onClick={() => setShowTranscript(true)}
          type="button"
        >
          VIEW TRANSCRIPT
        </button>
        <button className="verdict__replay" onClick={onPlayAgain}>
          🔄 Play Again
        </button>
      </div>

      {/* Transcript overlay */}
      {showTranscript && (
        <TranscriptViewer
          caseId={caseId}
          onClose={() => setShowTranscript(false)}
        />
      )}
    </div>
  );
}
