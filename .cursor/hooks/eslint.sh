#!/usr/bin/env bash
set -uo pipefail

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# Skip hook files themselves
[[ "$FILE" == */.cursor/hooks/* ]] && exit 0

# Only lint JS/TS files
[[ "$FILE" == *.ts || "$FILE" == *.tsx || "$FILE" == *.js || "$FILE" == *.jsx ]] || exit 0

# Walk up to find eslint config
DIR=$(dirname "$FILE")
ESLINT_DIR=""
while [ "$DIR" != "/" ]; do
  if [ -f "$DIR/.eslintrc.cjs" ] || [ -f "$DIR/.eslintrc.js" ] || [ -f "$DIR/.eslintrc.json" ] || [ -f "$DIR/eslint.config.js" ] || [ -f "$DIR/eslint.config.mjs" ] || [ -f "$DIR/eslint.config.cjs" ]; then
    ESLINT_DIR="$DIR"
    break
  fi
  DIR=$(dirname "$DIR")
done

[ -n "$ESLINT_DIR" ] || exit 0

# Pass 1: auto-fix silently
cd "$ESLINT_DIR"
bunx eslint --fix "$FILE" >/dev/null 2>&1 || true

# Pass 2: report remaining errors
OUTPUT=$(bunx eslint "$FILE" 2>&1) || true
if [ -n "$OUTPUT" ] && echo "$OUTPUT" | grep -q "error"; then
  REASON=$(echo "$OUTPUT" | jq -Rs .)
  echo "{\"decision\": \"deny\", \"reason\": $REASON}"
  exit 2
fi

echo '{"decision": "allow"}'
