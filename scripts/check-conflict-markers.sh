#!/usr/bin/env bash
set -euo pipefail

if rg -n "^(<<<<<<<|=======|>>>>>>>)" app prisma src tests .github --glob '!node_modules/**' >/tmp/conflict_markers.out; then
  echo "Conflict markers detected in repository files:"
  cat /tmp/conflict_markers.out
  exit 1
fi

echo "No conflict markers found."
