#!/usr/bin/env bash
set -euo pipefail

REMOTE="${1:-origin}"
BASE_BRANCH="${2:-main}"

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "❌ Remote '$REMOTE' is not configured."
  echo "Add it first, then retry: git remote add $REMOTE <repo-url>"
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "❌ Working tree is not clean. Commit or stash changes before syncing."
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "🔄 Fetching $REMOTE/$BASE_BRANCH..."
git fetch "$REMOTE" "$BASE_BRANCH"

echo "🔁 Rebasing $CURRENT_BRANCH onto $REMOTE/$BASE_BRANCH..."
git rebase "$REMOTE/$BASE_BRANCH"

echo "🧪 Running pre-merge checks..."
./scripts/check-conflict-markers.sh
npm run lint
npm test
npm run build:netlify

echo "✅ Branch is synced with $REMOTE/$BASE_BRANCH and checks passed."
