# ── Build stage: frontend ─────────────────────────────────────────────────────
FROM node:20-slim AS frontend-build

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Runtime stage: Python backend ─────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Install CPU-only PyTorch FIRST (avoids 2GB+ of CUDA/nvidia bloat)
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Install remaining Python deps (cached layer)
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./

# Copy built frontend into backend as ./dist
COPY --from=frontend-build /app/frontend/dist ./dist

# Expose the port (Render sets PORT env var)
ENV PORT=8000
EXPOSE 8000

# Run the RAG DB setup then start the server
CMD sh -c "python rag/setup_db.py && python main.py"
