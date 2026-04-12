import { useState, useRef, useEffect, useCallback } from 'react';
import { createInterrogationSocket, makeArrest, resetGame } from './api';
import CaseSelection from './components/CaseSelection';
import CaseFileModal from './components/CaseFileModal';
import Briefing from './components/Briefing';
import SuspectPanel from './components/SuspectPanel';
import ChatWindow from './components/ChatWindow';
import CluePanel from './components/CluePanel';
import ArrestModal from './components/ArrestModal';
import VerdictScreen from './components/VerdictScreen';
import BackButton from './components/BackButton';
import EvidencePopup from './components/EvidencePopup';
import MuteButton from './components/MuteButton';
import useAudio from './hooks/useAudio';
import './App.css';

const CASES = [
  {
    id: 1,
    caseId: 'case001',
    title: 'The Mirage Murder',
    setting: 'The Mirage Casino — Floor 12',
    victim: 'Marcus Vega, 42. High-roller found dead in his penthouse suite. No forced entry.',
    victimName: 'Marcus Vega',
    causeOfDeath: 'Blunt force trauma — found in penthouse suite, no forced entry',
    victimIdentity: 'Marcus Vega, 42',
    victimStatus: 'Blunt force trauma to the skull',
    victimTime: 'Between 10:50 PM and 11:30 PM',
    victimLocation: 'Penthouse Suite, Floor 12, The Mirage',
    victimDiscovered: 'Housekeeping staff at 6:30 AM',
    victimWeapon: 'Crystal whiskey decanter (recovered)',
    briefing:
      'Marcus Vega was last seen alive at 10:15 PM at the high-roller blackjack table on Floor 3. ' +
      'Security cameras show him entering the elevator alone at 10:47 PM. The body was discovered by ' +
      'housekeeping at 6:30 AM the following morning. The penthouse door was locked from the inside ' +
      'with the deadbolt engaged. No signs of forced entry through windows or vents. Three individuals ' +
      'had keycard access to the suite that night.',
    evidence: [
      'Keycard log shows 3 entries between 10 PM and midnight',
      'Broken whiskey glass on the bedroom floor',
      'Security camera blind spot on Floor 12 corridor — 22 minutes',
      'Victim\'s phone wiped clean at 11:02 PM',
      '$2.4M life insurance policy — beneficiary recently changed',
    ],
    accent: '#DC2626',
    accentDark: '#7F1D1D',
  },
  {
    id: 2,
    caseId: 'case002',
    title: 'Neon Requiem',
    setting: 'The Bellagio Fountains — Backstage',
    victim: 'Sofia Laurent, 35. Star choreographer discovered in the fountain control room.',
    victimName: 'Sofia Laurent',
    causeOfDeath: 'Asphyxiation — found in the sealed fountain control room',
    victimIdentity: 'Sofia Laurent, 35',
    victimStatus: 'Asphyxiation — sealed room, ventilation disabled',
    victimTime: 'Between 10:00 PM and 11:30 PM',
    victimLocation: 'Fountain Control Room, Backstage, Bellagio',
    victimDiscovered: 'Night security during routine sweep at 12:15 AM',
    victimWeapon: 'Under investigation',
    briefing:
      'Sofia Laurent was preparing for the premiere of her new fountain show "Neon Requiem." ' +
      'She was last seen at 9:30 PM during the final dress rehearsal. The control room door was ' +
      'found locked with the ventilation system manually disabled. Her notepad contained a list ' +
      'of names with two crossed out. Security footage from the backstage area was corrupted ' +
      'between 10:00 PM and 11:45 PM.',
    evidence: [
      'Ventilation system manually shut off from outside the room',
      'Notepad with crossed-out names found in victim\'s bag',
      'Backstage security footage corrupted — 1 hour 45 minutes',
      'Fresh scratch marks on the control room door lock',
      'Victim received 3 threatening texts from an unknown number',
    ],
    accent: '#D97706',
    accentDark: '#92400E',
  },
  {
    id: 3,
    caseId: 'case003',
    title: 'The Jackpot Heist',
    setting: "Caesar's Palace — Vault B",
    victim: 'Tommy Chen, 58. Retired pit boss found inside a sealed casino vault.',
    victimName: 'Tommy Chen',
    causeOfDeath: 'Cardiac arrest — locked inside vault with depleted oxygen',
    victimIdentity: 'Tommy Chen, 58',
    victimStatus: 'Cardiac arrest — oxygen depletion in sealed vault',
    victimTime: 'Between 2:00 AM and 4:00 AM Saturday',
    victimLocation: 'Vault B, Sub-Level 2, Caesar\'s Palace',
    victimDiscovered: 'Monday morning audit team at 9:00 AM',
    victimWeapon: 'Under investigation',
    briefing:
      'Tommy Chen retired from Caesar\'s Palace two years ago but maintained a consulting role. ' +
      'He was found inside Vault B during a routine Monday morning audit. The vault requires two ' +
      'keycards activated simultaneously to open. Time-of-death is estimated between 2:00 AM and ' +
      '4:00 AM Saturday. Tommy had recently been in contact with a gaming commission investigator ' +
      'regarding irregularities in the casino\'s financial records.',
    evidence: [
      'Vault requires dual-keycard authentication — both used at 1:47 AM',
      'Tommy\'s personal keycard found inside the vault with his body',
      'Second keycard traced to a deactivated employee account',
      'Casino financial audit files missing from Tommy\'s home office',
      'Surveillance shows Tommy entering the casino alone at 12:30 AM',
    ],
    accent: '#10B981',
    accentDark: '#065F46',
  },
];

// Per-case suspect lists
const CASE_SUSPECTS = {
  case001: [
    { name: 'Diana', role: 'Casino Manager', description: '11-year veteran of The Mirage. Cooperative. Professional.' },
    { name: 'Leo', role: 'The Showman', description: 'Vegas headline entertainer. Charming. Theatrical.' },
    { name: 'Ray', role: 'The Bodyguard', description: "Marcus's personal security for two years. Silent. Guarded." },
  ],
  case002: [
    { name: 'Rena', role: 'Lead Dancer', description: "Sofia's protégée and understudy. Emotional. Passionate." },
    { name: 'Marco', role: 'Technical Director', description: 'Oversees all backstage systems. Methodical. Precise.' },
    { name: 'Dante', role: 'Executive Producer', description: 'Entertainment division chief. Smooth. Politically savvy.' },
  ],
  case003: [
    { name: 'Nina', role: 'VP Operations', description: 'Runs the casino floor. Sharp. Ambitious. Commanding.' },
    { name: 'Greg', role: 'Security Chief', description: 'Former Metro PD. Gruff. Old-school. By-the-book.' },
    { name: 'Luca', role: "Tommy's Nephew", description: 'Casino dealer. Charismatic. Nervous. Reckless.' },
  ],
};

function buildInitialState(suspects) {
  const msgs = {};
  const scores = {};
  const states = {};
  suspects.forEach((s) => {
    msgs[s.name] = [];
    scores[s.name] = 0;
    states[s.name] = 'CALM';
  });
  return { msgs, scores, states };
}

export default function App() {
  const { isMuted, toggleMute } = useAudio('/bgm.mp3');

  const [gamePhase, setGamePhase] = useState('caseSelect');
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseFile, setShowCaseFile] = useState(false);
  const [activeSuspect, setActiveSuspect] = useState(null);
  const [messages, setMessages] = useState({});
  const [clues, setClues] = useState([]);
  const [foundClueIds, setFoundClueIds] = useState([]);
  const [suspicionScores, setSuspicionScores] = useState({});
  const [suspectStates, setSuspectStates] = useState({});
  const [verdictData, setVerdictData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [backendStatus, setBackendStatus] = useState(null);

useEffect(() => {
  fetch("http://20.189.76.87:8000/api/test")
    .then(res => res.json())
    .then(data => {
      console.log("Backend:", data);
      setBackendStatus(data.message);
    })
    .catch(err => console.error("Backend error:", err));
}, []);
  
  const [showEvidencePopup, setShowEvidencePopup] = useState(false);

  const wsRef = useRef(null);
  const activeSuspectRef = useRef(activeSuspect);

  // Derive the current suspect list from the selected case
  const currentSuspects = selectedCase ? (CASE_SUSPECTS[selectedCase.caseId] || []) : [];

  // Keep ref in sync so WS callbacks always read the latest value
  useEffect(() => {
    activeSuspectRef.current = activeSuspect;
  }, [activeSuspect]);

  // ── Persist session to localStorage ────────────────────────────────
  useEffect(() => {
    if (selectedCase && Object.values(messages).some((arr) => arr.length > 0)) {
      const sessionData = {
        caseId: selectedCase.id,
        timestamp: new Date().toISOString(),
        messages,
        clues,
        suspicionScores,
        gamePhase,
        verdictData,
      };
      localStorage.setItem(
        'ccv_session_' + selectedCase.id,
        JSON.stringify(sessionData)
      );
    }
  }, [messages, clues, verdictData]);

  // ── WebSocket setup ───────────────────────────────────────────────
  useEffect(() => {
    const socket = createInterrogationSocket(
      // onToken — append to the current streaming message
      (token) => {
        const suspect = activeSuspectRef.current;
        if (!suspect) return;
        setMessages((prev) => {
          const list = [...(prev[suspect] || [])];
          const last = list[list.length - 1];
          if (last && last.role === 'suspect' && last.isStreaming) {
            list[list.length - 1] = { ...last, text: last.text + token };
          }
          return { ...prev, [suspect]: list };
        });
      },
      // onMeta — update clues, suspicion, state; end streaming
      (meta) => {
        const suspect = activeSuspectRef.current;
        if (!suspect) return;

        // New clue discovered
        if (meta.new_clue) {
          setClues((prev) =>
            prev.includes(meta.new_clue) ? prev : [...prev, meta.new_clue]
          );
        }

        // Track clue ID
        if (meta.clue_id) {
          setFoundClueIds((prev) =>
            prev.includes(meta.clue_id) ? prev : [...prev, meta.clue_id]
          );
        }

        // Suspicion score
        if (meta.suspicion_score !== undefined) {
          setSuspicionScores((prev) => ({ ...prev, [suspect]: meta.suspicion_score }));
        }

        // Suspect emotional state
        if (meta.emotional_state) {
          setSuspectStates((prev) => ({ ...prev, [suspect]: meta.emotional_state }));
        }

        // End streaming on this message
        setMessages((prev) => {
          const list = [...(prev[suspect] || [])];
          const last = list[list.length - 1];
          if (last && last.role === 'suspect' && last.isStreaming) {
            list[list.length - 1] = { ...last, isStreaming: false };
          }
          return { ...prev, [suspect]: list };
        });

        setIsLoading(false);
      }
    );

    wsRef.current = socket;
    return () => socket.close();
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────

  // Case selection → set accent CSS variable + data-case attribute
  const handleSelectCase = useCallback((caseId) => {
    const selected = CASES.find((c) => c.id === caseId);
    if (!selected) return;

    setSelectedCase(selected);

    // Initialize per-case state
    const suspects = CASE_SUSPECTS[selected.caseId] || [];
    const { msgs, scores, states } = buildInitialState(suspects);
    setMessages(msgs);
    setSuspicionScores(scores);
    setSuspectStates(states);

    // Set CSS theming on document root
    document.documentElement.setAttribute('data-case', caseId);
    document.documentElement.style.setProperty('--accent', selected.accent);

    // Show the CaseFileModal on top of the investigation layout
    setShowCaseFile(true);
    setGamePhase('investigation');
  }, []);

  // Resume a saved session
  const handleResumeCase = useCallback((caseId) => {
    const raw = localStorage.getItem('ccv_session_' + caseId);
    if (!raw) return;
    const saved = JSON.parse(raw);
    const caseConfig = CASES.find((c) => c.id === caseId);
    if (!caseConfig) return;

    setSelectedCase(caseConfig);

    // Restore saved state
    setMessages(saved.messages || {});
    setClues(saved.clues || []);
    setSuspicionScores(saved.suspicionScores || {});
    setVerdictData(saved.verdictData || null);

    // Rebuild suspect states from scratch (not persisted)
    const suspects = CASE_SUSPECTS[caseConfig.caseId] || [];
    const { states } = buildInitialState(suspects);
    setSuspectStates(states);

    // Set CSS theming
    document.documentElement.setAttribute('data-case', caseId);
    document.documentElement.style.setProperty('--accent', caseConfig.accent);

    // Go straight to investigation (skip case file modal)
    setShowCaseFile(false);
    setGamePhase(saved.gamePhase === 'verdict' ? 'verdict' : 'investigation');
  }, []);

  const handleBeginInvestigation = useCallback(() => {
    setShowCaseFile(false);
  }, []);

  const handleSelectSuspect = useCallback((name) => {
    setActiveSuspect(name);
  }, []);

  const handleSendMessage = useCallback(
    (text) => {
      if (!activeSuspect || !selectedCase) return;
      setIsLoading(true);

      setMessages((prev) => ({
        ...prev,
        [activeSuspect]: [
          ...(prev[activeSuspect] || []),
          { role: 'user', text },
          { role: 'suspect', text: '', isStreaming: true },
        ],
      }));

      // Send the case_id string (e.g. 'case001') to the backend
     wsRef.current?.send(JSON.stringify({
  case_id: selectedCase.caseId,
  suspect_name: activeSuspect,
  message: text,
  found_clue_ids: foundClueIds
}));
    },
    [activeSuspect, selectedCase, foundClueIds]
  );

  const handleMakeArrest = useCallback(() => {
    setGamePhase('arrest');
  }, []);

  const handleSubmitArrest = useCallback(
    async (suspectName) => {
      try {
        const result = await makeArrest(selectedCase.caseId, suspectName, clues);
        setVerdictData(result);
        setGamePhase('verdict');
      } catch (err) {
        console.error('Arrest failed:', err);
      }
    },
    [selectedCase, clues]
  );

  const handlePlayAgain = useCallback(async () => {
    try {
      if (selectedCase) {
        await resetGame(selectedCase.caseId);
      }
    } catch (err) {
      console.error('Reset failed:', err);
    }
    setGamePhase('caseSelect');
    setSelectedCase(null);
    setShowCaseFile(false);
    setActiveSuspect(null);
    setMessages({});
    setClues([]);
    setFoundClueIds([]);
    setSuspicionScores({});
    setSuspectStates({});
    setVerdictData(null);
    setIsLoading(false);
    setShowEvidencePopup(false);
    // Clear saved session
    if (selectedCase) {
      localStorage.removeItem('ccv_session_' + selectedCase.id);
    }
    // Clean up CSS theming
    document.documentElement.removeAttribute('data-case');
    document.documentElement.style.removeProperty('--accent');
  }, [selectedCase]);

  // ── Render ────────────────────────────────────────────────────────

  // Case selection screen
  if (gamePhase === 'caseSelect') {
    return (
      <>
        <CaseSelection
          cases={CASES}
          onSelectCase={handleSelectCase}
          onResumeCase={handleResumeCase}
        />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
      </>
    );
  }

  // Verdict screen
  if (gamePhase === 'verdict' && verdictData) {
    return (
      <>
        <VerdictScreen
          correct={verdictData.correct}
          verdict={verdictData.verdict}
          onPlayAgain={handlePlayAgain}
          caseId={selectedCase?.id}
        />
        <MuteButton isMuted={isMuted} onToggle={toggleMute} />
      </>
    );
  }

  // Investigation / arrest — main game layout
  const currentSuspectState = activeSuspect ? suspectStates[activeSuspect] : 'CALM';

  return (
    <>
    <div className="app-layout">
      {/* Global nav bar */}
      <nav className="app-layout__nav">
        <BackButton
          onClick={handlePlayAgain}
          label="EXIT CASE"
        />
        <span className="app-layout__nav-title">COLD CASE VEGAS</span>
        <span className="app-layout__nav-spacer" />
      </nav>

      {/* Case info strip */}
      <div className="app-layout__case-strip">
        <span className="app-layout__case-strip-title">
          {selectedCase?.title}
        </span>
        <span className="app-layout__case-strip-status">
          INTERROGATION IN PROGRESS
        </span>
      </div>

      {/* Main content row */}
      <div className="app-layout__content">
        {/* Left column: suspects + chat */}
        <div className="app-layout__left">
          {/* Suspect cards zone */}
          <div className="app-layout__suspect-zone">
            <SuspectPanel
              suspects={currentSuspects}
              activeSuspect={activeSuspect}
              onSelectSuspect={handleSelectSuspect}
              suspicionScores={suspicionScores}
              suspectStates={suspectStates}
              caseId={selectedCase?.id}
            />
          </div>
          <div className="app-layout__chat">
            <ChatWindow
              suspectName={activeSuspect}
              messages={activeSuspect ? (messages[activeSuspect] || []) : []}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              caseId={selectedCase?.id}
              suspectState={currentSuspectState}
            />
          </div>

          {/* Arrest overlay on the left column */}
          {gamePhase === 'arrest' && (
            <div className="app-layout__arrest-overlay">
              <ArrestModal
                suspects={currentSuspects}
                victimName={selectedCase?.victimName || 'the victim'}
                onSubmitArrest={handleSubmitArrest}
                onCancel={() => setGamePhase('investigation')}
              />
            </div>
          )}
        </div>

        {/* Right column: clue panel + evidence popup */}
        <div className="app-layout__right">
          {/* Evidence trigger button */}
          <button
            className="evidence-trigger"
            onClick={() => setShowEvidencePopup((v) => !v)}
            type="button"
          >
            <span className="evidence-trigger__label">INITIAL EVIDENCE</span>
            <svg
              className="evidence-trigger__icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              {showEvidencePopup ? (
                <>
                  <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                  <line x1="2" y1="14" x2="14" y2="2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                </>
              )}
            </svg>
          </button>

          {/* Evidence popup (absolutely positioned) */}
          <div style={{ position: 'relative' }}>
            <EvidencePopup
              evidence={selectedCase?.evidence || []}
              isOpen={showEvidencePopup}
              onClose={() => setShowEvidencePopup(false)}
            />
          </div>

          <CluePanel clues={clues} onMakeArrest={handleMakeArrest} />
        </div>
      </div>

      {/* CaseFileModal overlay — shown on top of investigation layout */}
      {showCaseFile && selectedCase && (
        <CaseFileModal
          caseData={selectedCase}
          suspects={currentSuspects}
          onBeginInvestigation={handleBeginInvestigation}
          onClose={() => {
            setShowCaseFile(false);
            setGamePhase('caseSelect');
            setSelectedCase(null);
            document.documentElement.removeAttribute('data-case');
            document.documentElement.style.removeProperty('--accent');
          }}
        />
      )}
    </div>

    <MuteButton isMuted={isMuted} onToggle={toggleMute} />
  </>
  );
}
