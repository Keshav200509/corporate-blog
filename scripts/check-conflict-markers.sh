#!/usr/bin/env bash
set -euo pipefail

pattern='^(<{7}|={7}|>{7})'

if rg -n "$pattern" app prisma src tests .github --glob '!node_modules/**' >/tmp/conflict_markers.out; then
  echo "Conflict markers detected in repository files:"
  cat /tmp/conflict_markers.out
  exit 1
fi

echo "No conflict markers found."
