#!/usr/bin/env bash
set -uo pipefail

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# Skip hook files themselves
[[ "$FILE" == */.cursor/hooks/* ]] && exit 0

# Only check source files
[[ "$FILE" == *.ts || "$FILE" == *.tsx || "$FILE" == *.js || "$FILE" == *.jsx ]] || exit 0

# Find the repo root (where .jscpd.json lives)
DIR=$(dirname "$FILE")
REPO_ROOT=""
while [ "$DIR" != "/" ]; do
  if [ -f "$DIR/.jscpd.json" ]; then
    REPO_ROOT="$DIR"
    break
  fi
  DIR=$(dirname "$DIR")
done

[ -n "$REPO_ROOT" ] || exit 0

# Run jscpd on the single file against the codebase
OUTPUT=$(cd "$REPO_ROOT" && bunx jscpd --path "$FILE" --skipLocal 2>&1) || true

# Check if duplicates were found for this file
CLONES=$(echo "$OUTPUT" | grep -c "Clone found" || true)
if [ "$CLONES" -gt 0 ]; then
  REASON=$(echo "$OUTPUT" | grep -A 4 "Clone found" | jq -Rs .)
  echo "{\"decision\": \"deny\", \"reason\": $REASON}"
  exit 2
fi

echo '{"decision": "allow"}'
