#!/usr/bin/env bash
set -uo pipefail

INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# Skip hook files themselves
[[ "$FILE" == */.cursor/hooks/* ]] && exit 0

# Only check TS files
[[ "$FILE" == *.ts || "$FILE" == *.tsx ]] || exit 0

# Walk up to find tsconfig
DIR=$(dirname "$FILE")
TSCONFIG=""
while [ "$DIR" != "/" ]; do
  if [ -f "$DIR/tsconfig.json" ]; then
    TSCONFIG="$DIR/tsconfig.json"
    break
  fi
  DIR=$(dirname "$DIR")
done

[ -n "$TSCONFIG" ] || exit 0

TSCONFIG_DIR=$(dirname "$TSCONFIG")
OUTPUT=$(bunx tsc --noEmit --project "$TSCONFIG" 2>&1) || true

if [ -n "$OUTPUT" ]; then
  RELPATH=$(python3 -c "import os; print(os.path.relpath('$FILE', '$TSCONFIG_DIR'))")
  FILTERED=$(echo "$OUTPUT" | grep -F "$RELPATH" || true)
  if [ -n "$FILTERED" ]; then
    REASON=$(echo "$FILTERED" | jq -Rs .)
    echo "{\"decision\": \"deny\", \"reason\": $REASON}"
    exit 2
  fi
fi

echo '{"decision": "allow"}'
