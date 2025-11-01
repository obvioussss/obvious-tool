#!/usr/bin/env bash
set -euo pipefail

# Simple dev orchestrator for backend (uvicorn) and frontend (vite)
# Usage: ./start_dev.sh
# Requires: Python deps installed in obvious-tool/backend, Node deps in obvious-tool/frontend

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$SCRIPT_DIR/obvious-tool"
BACKEND_DIR="$ROOT/backend"
FRONTEND_DIR="$ROOT/frontend"

# Default backend URL used by frontend if not set
export VITE_BACKEND_URL="${VITE_BACKEND_URL:-http://localhost:8000}"

echo "[dev] backend -> $BACKEND_DIR"
echo "[dev] frontend -> $FRONTEND_DIR"

echo "[dev] starting backend on :8000"
(
  cd "$BACKEND_DIR"
  python -m uvicorn start_backend:app --host 0.0.0.0 --port 8000 --reload
) &
BACKEND_PID=$!

cleanup() {
  echo "\n[dev] stopping..."
  kill "$BACKEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

sleep 1

echo "[dev] starting frontend dev server"
(
  cd "$FRONTEND_DIR"
  npm install
  npm run dev
)

wait
