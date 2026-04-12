#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Cold Case Vegas — VM startup script
#
# Usage:  chmod +x start.sh && ./start.sh
# Prereq: Node.js 18+, Python 3.10+, pip
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "══════════════════════════════════════════════════════"
echo "  Cold Case Vegas — Starting up"
echo "══════════════════════════════════════════════════════"

# ── 1. Build the frontend ──────────────────────────────────────────────────
echo ""
echo "[1/4] Building frontend..."
cd "$SCRIPT_DIR/frontend"

if [ ! -d node_modules ]; then
  npm ci
fi

npm run build
echo "  ✓ Frontend built → frontend/dist/"

# ── 2. Copy dist into backend ──────────────────────────────────────────────
echo ""
echo "[2/4] Copying frontend build to backend..."
rm -rf "$SCRIPT_DIR/backend/dist"
cp -r "$SCRIPT_DIR/frontend/dist" "$SCRIPT_DIR/backend/dist"
echo "  ✓ Copied to backend/dist/"

# ── 3. Install Python deps ────────────────────────────────────────────────
echo ""
echo "[3/4] Installing Python dependencies..."
cd "$SCRIPT_DIR/backend"

if [ ! -d .venv ]; then
  python3 -m venv .venv
fi

source .venv/bin/activate
pip install -q -r requirements.txt
echo "  ✓ Python dependencies installed"

# ── 4. Setup RAG DB & start server ─────────────────────────────────────────
echo ""
echo "[4/4] Setting up RAG database and starting server..."
python rag/setup_db.py

PORT="${PORT:-8000}"
echo ""
echo "══════════════════════════════════════════════════════"
echo "  Server starting on http://0.0.0.0:$PORT"
echo "══════════════════════════════════════════════════════"

exec python main.py
