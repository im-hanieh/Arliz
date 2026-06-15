#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "==> Cleaning volume build artifacts"
for f in "$ROOT"/vol*.tex; do
  [[ -f "$f" ]] && rm -v "$f"
done
[[ -d "$ROOT/build" ]] && rm -rf "$ROOT/build" && echo "removed build/"

echo "==> Clean complete"