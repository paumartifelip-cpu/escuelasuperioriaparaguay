#!/bin/bash
# Doble clic para abrir la escuela: arranca el servidor local y abre Chrome.
cd "$(dirname "$0")" || exit 1
PORT=8765
if ! lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 &
  sleep 1
fi
open -a "Google Chrome" "http://127.0.0.1:$PORT/index.html" 2>/dev/null || open "http://127.0.0.1:$PORT/index.html"
echo "Escuela abierta en http://127.0.0.1:$PORT  (cierra esta ventana para dejarla en segundo plano)"
