#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# Skip hook files themselves
[[ "$FILE" == */.cursor/hooks/* ]] && exit 0

# Only format files prettier supports
case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md|*.html|*.yaml|*.yml) ;;
  *) exit 0 ;;
esac

bunx prettier --write "$FILE" >/dev/null 2>&1

echo '{"decision": "allow"}'
