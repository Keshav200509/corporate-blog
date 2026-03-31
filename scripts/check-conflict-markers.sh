#!/usr/bin/env bash
# CI check for unresolved git merge conflict markers.
# Uses grep (always available) instead of rg (ripgrep) for portability.
set -euo pipefail

DIRS="app prisma src tests .github scripts"
PATTERN="^(<<<<<<<|=======|>>>>>>>)"
FOUND=0

for dir in $DIRS; do
  if [[ ! -d "$dir" ]]; then
    continue
  fi

  while IFS= read -r -d '' file; do
    if grep -Pn "$PATTERN" "$file" 2>/dev/null; then
      echo "❌ Conflict marker in: $file"
      FOUND=1
    fi
  done < <(find "$dir" \
    -type f \
    \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" \
       -o -name "*.sql" -o -name "*.prisma" -o -name "*.yml" -o -name "*.yaml" \
       -o -name "*.md" -o -name "*.sh" \) \
    -not -path "*/node_modules/*" \
    -not -path "*/.next/*" \
    -print0)
done

if [[ "$FOUND" -eq 1 ]]; then
  echo ""
  echo "Conflict markers detected. Resolve them before merging."
  exit 1
fi

echo "✅ No conflict markers found."
