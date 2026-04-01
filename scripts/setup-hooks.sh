#!/usr/bin/env bash
# Run once after cloning: bash scripts/setup-hooks.sh
set -euo pipefail

HOOK_DIR="$(git rev-parse --git-dir)/hooks"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

install_hook() {
  local name="$1"
  local src="$SCRIPT_DIR/$name"
  local dest="$HOOK_DIR/$name"

  if [[ ! -f "$src" ]]; then
    echo "⚠️  Hook source not found: $src"
    return 1
  fi

  cp "$src" "$dest"
  chmod +x "$dest"
  echo "✅ Installed git hook: $name"
}

install_hook "pre-commit"

echo ""
echo "Git hooks installed. Conflict markers will now be blocked at commit time."
