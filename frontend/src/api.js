const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Creates a WebSocket connection for real-time suspect interrogation.
 * @param {(token: string) => void} onToken  – called on each streamed token
 * @param {(meta: object) => void}  onMeta   – called on metadata messages (clues, suspicion, etc.)
 * @returns {{ send: Function, close: Function }}
 */
export function createInterrogationSocket(onToken, onMeta) {
  const wsBase = BASE_URL
    ? BASE_URL.replace(/^http/, 'ws')
    : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
  const wsUrl = wsBase + '/ws/interrogate';
  const ws = new WebSocket(wsUrl);

  ws.onerror = (err) => console.error('[WS] error:', err);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'token') {
        onToken(data.data);
      } else if (data.type === 'meta') {
        onMeta(data);
      }
    } catch (e) {
      console.error('[WS] failed to parse message:', e);
    }
  };

  return {
    /**
     * Send an interrogation message to a suspect.
     * @param {string} caseId        – e.g. "case001", "case002", "case003"
     * @param {string} suspectName   – e.g. "Diana", "Rena", "Nina"
     * @param {string} message       – the player's question / statement
     * @param {string[]} foundClueIds – IDs of clues the player has found so far
     */
    send(caseId, suspectName, message, foundClueIds) {
      ws.send(JSON.stringify({
        case_id: caseId,
        suspect_name: suspectName,
        message,
        found_clue_ids: foundClueIds,
      }));
    },

    /** Close the WebSocket connection. */
    close() {
      ws.close();
    },
  };
}

/**
 * Submit a final arrest accusation.
 * @param {string}   caseId       – the case ID (e.g. 'case001')
 * @param {string}   namedSuspect – the suspect the player is accusing
 * @param {string[]} clues        – evidence clue texts backing the accusation
 * @returns {Promise<{ verdict: string, correct: boolean }>}
 */
export async function makeArrest(caseId, namedSuspect, clues) {
  const res = await fetch(`${BASE_URL}/arrest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ case_id: caseId, named_suspect: namedSuspect, clues }),
  });
  return res.json();
}

/**
 * Reset the game state on the server for a specific case.
 * @param {string} caseId – the case ID to reset (e.g. 'case001')
 * @returns {Promise<object>}
 */
export async function resetGame(caseId) {
  const res = await fetch(`${BASE_URL}/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ case_id: caseId }),
  });
  return res.json();
}
