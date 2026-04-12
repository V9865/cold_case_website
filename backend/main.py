"""
Cold Case Vegas — FastAPI backend entry point.

Routes all interrogation, arrest, and reset logic through the generic
suspect_agent module, using case_registry for case-specific configuration.

In production, also serves the Vite-built frontend as static files so
the entire app runs as a single process on a VM.
"""

import importlib
import os
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

from case_registry import get_case, list_cases
from agents.suspect_agent import stream_suspect, reset_all_agents
from agents.detective import extract_clue_ai, reveal_truth
from agents.clue_rules import check_rules
from agents.suspicion import score_suspicion
from agents.state_machine import reset_states

# ── App setup ────────────────────────────────────────────────────────────────────

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

# ── Prompt loader cache ──────────────────────────────────────────────────────────

_prompt_cache: dict[str, str] = {}


def _load_prompt(prompt_module: str, prompt_var: str) -> str:
    """Dynamically import a prompt module and return the prompt string."""
    cache_key = f'{prompt_module}.{prompt_var}'
    if cache_key not in _prompt_cache:
        mod = importlib.import_module(prompt_module)
        _prompt_cache[cache_key] = getattr(mod, prompt_var)
    return _prompt_cache[cache_key]


# ── Pydantic models ─────────────────────────────────────────────────────────────


class ArrestRequest(BaseModel):
    case_id: str
    named_suspect: str
    clues: list[str]


class ResetRequest(BaseModel):
    case_id: str


# ── REST routes ──────────────────────────────────────────────────────────────────
@app.get("/api/test")
async def test():
    return {"message": "Backend connected successfully!"}

@app.get('/health')
async def health():
    return {'status': 'ok'}


@app.get('/cases')
async def get_all_cases():
    """Return a list of all available cases with metadata."""
    return list_cases()


@app.post('/arrest')
async def arrest(req: ArrestRequest):
    result = await reveal_truth(req.case_id, req.named_suspect, req.clues)
    return result


@app.post('/reset')
async def reset(req: ResetRequest):
    reset_all_agents(req.case_id)
    reset_states(req.case_id)
    return {'status': 'reset'}


# ── WebSocket route ──────────────────────────────────────────────────────────────


@app.websocket('/ws/interrogate')
async def ws_interrogate(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            case_id = str(data.get('case_id', ''))
            suspect_name = data['suspect_name']
            message = data['message']
            found_ids = data.get('found_clue_ids', [])

            # Normalise case_id: accept numeric (1,2,3) or string ('case001',...)
            if case_id.isdigit():
                case_id = f'case{int(case_id):03d}'

            # Look up case configuration
            try:
                case = get_case(case_id)
            except ValueError as exc:
                await websocket.send_json({
                    'type': 'error',
                    'message': str(exc),
                })
                continue

            # Find the suspect configuration for this suspect
            suspect_cfg = next(
                (s for s in case['suspects'] if s['name'] == suspect_name),
                None,
            )
            if suspect_cfg is None:
                await websocket.send_json({
                    'type': 'error',
                    'message': f"Unknown suspect '{suspect_name}' for {case_id}",
                })
                continue

            # Load the system prompt for this suspect
            system_prompt = _load_prompt(
                suspect_cfg['prompt_module'],
                suspect_cfg['prompt_var'],
            )

            # Stream the suspect's response
            full_response = ''
            new_state = 'CALM'

            generator = stream_suspect(
                case_id=case_id,
                suspect_name=suspect_name,
                system_prompt=system_prompt,
                user_message=message,
                collection_name=case['chroma_collection'],
            )

            async for token in generator:
                if token.startswith('__ERROR__'):
                    # Parse error — use maxsplit=2 to preserve message content
                    error_body = token[len('__ERROR__'):]
                    sep_idx = error_body.find('__')
                    if sep_idx != -1:
                        error_type = error_body[:sep_idx]
                        error_msg = error_body[sep_idx + 2:]
                    else:
                        error_type = 'UNKNOWN'
                        error_msg = error_body or 'An unexpected error occurred.'
                    await websocket.send_json({
                        'type': 'error',
                        'error_type': error_type,
                        'message': error_msg,
                    })
                    break
                elif token.startswith('__DONE__'):
                    parts = token.split('__STATE__')
                    full_response = parts[0].replace('__DONE__', '')
                    new_state = parts[1] if len(parts) > 1 else 'CALM'
                else:
                    await websocket.send_json({'type': 'token', 'data': token})
            else:
                # Normal completion (loop not broken by error)
                # Post-stream processing — case-aware clue detection
                clue, clue_id = check_rules(case_id, message, full_response, found_ids)
                if not clue:
                    clue = await extract_clue_ai(message, full_response)
                    clue_id = None
                suspicion = await score_suspicion(full_response)

                # Send metadata
                await websocket.send_json({
                    'type': 'meta',
                    'new_clue': clue,
                    'clue_id': clue_id,
                    'suspicion_score': suspicion,
                    'emotional_state': new_state,
                })
    except WebSocketDisconnect:
        pass


# ── Serve frontend static files (production) ────────────────────────────────────
# The Vite build output is expected at ../frontend/dist relative to this file,
# or at ./dist if the Dockerfile copies it into the backend directory.

_FRONTEND_DIST = None
_candidates = [
    Path(__file__).resolve().parent / 'dist',                 # Dockerfile copies here
    Path(__file__).resolve().parent.parent / 'frontend' / 'dist',  # local dev after build
]
for _p in _candidates:
    if (_p / 'index.html').is_file():
        _FRONTEND_DIST = _p
        break

if _FRONTEND_DIST:
    # Serve JS/CSS/assets at /assets
    app.mount('/assets', StaticFiles(directory=str(_FRONTEND_DIST / 'assets')), name='static-assets')

    # Serve other static files in dist root (favicon, manifest, etc.)
    @app.get('/{full_path:path}')
    async def serve_spa(full_path: str):
        """SPA catch-all: serve the file if it exists, otherwise index.html."""
        file_path = _FRONTEND_DIST / full_path
        if full_path and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(_FRONTEND_DIST / 'index.html'))


# ── Entrypoint ───────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    import uvicorn
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run('main:app', host='0.0.0.0', port=port, reload=False)
