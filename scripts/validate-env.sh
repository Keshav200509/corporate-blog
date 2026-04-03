#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-.env.local}"
REQUIRED_KEYS=("DATABASE_URL" "JWT_SECRET" "NEXT_PUBLIC_SITE_URL")

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Missing $ENV_FILE. Create it from .env.example: cp .env.example $ENV_FILE"
  exit 1
fi

FAIL=0

for KEY in "${REQUIRED_KEYS[@]}"; do
  if ! grep -Eq "^${KEY}=.+" "$ENV_FILE"; then
    echo "❌ ${KEY} is missing or empty in ${ENV_FILE}"
    FAIL=1
  fi
done

JWT_SECRET_VALUE=$(grep -E '^JWT_SECRET=' "$ENV_FILE" | sed 's/^JWT_SECRET=//')
if [[ -n "${JWT_SECRET_VALUE:-}" ]] && [[ ${#JWT_SECRET_VALUE} -lt 32 ]]; then
  echo "❌ JWT_SECRET must be at least 32 characters"
  FAIL=1
fi

if [[ "$FAIL" -eq 1 ]]; then
  exit 1
fi

echo "✅ ${ENV_FILE} looks complete for required variables (values not printed)."
