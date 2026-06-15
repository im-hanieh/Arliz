#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "==> Cleaning volume build artifacts"

for conf in "$ROOT"/volumes/*.conf; do
  [[ -f "$conf" ]] || continue
  ( source <(tr -d '\r' < "$conf")
    if [[ -n "${VOLUME_NUM:-}" && -n "${VOLUME_TITLE:-}" ]]; then
      year="$(date -u '+%Y')"
      f="$ROOT/${year}_ARLIZ_${VOLUME_TITLE}_${VOLUME_NUM}.tex"
      [[ -f "$f" ]] && rm -v "$f"
    fi
  )
done

for f in "$ROOT"/vol*.tex "$ROOT"/*_ARLIZ_*_Volume_*.tex; do
  [[ -f "$f" ]] && rm -v "$f"
done

[[ -d "$ROOT/build" ]] && rm -rf "$ROOT/build" && echo "removed build/"

echo "==> Clean complete"