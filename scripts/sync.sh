#!/usr/bin/env bash
# Oficina — fast sync (macOS/Linux/WSL)
# Refreshes ~/.claude and ~/.gemini commands/skills from this repo's working tree.
# No RTK setup, no hook registration — that's install.sh's job, once per machine.
# Safe to re-run anytime; called automatically by the post-commit git hook.
set -euo pipefail
repo="$(cd "$(dirname "$0")/.." && pwd)"

mkdir -p ~/.claude/skills ~/.claude/commands
cp -r "$repo"/skills/* ~/.claude/skills/
cp "$repo"/commands/*.md ~/.claude/commands/

# Only refreshes an install that was explicitly opted into via install.sh --gemini
# (checks for the oficina subfolder itself, not just ~/.gemini — that directory can
# exist for unrelated reasons, e.g. other tools that happen to use the same name).
if [ -d ~/.gemini/commands/oficina ]; then
  cp "$repo"/gemini/commands/oficina/* ~/.gemini/commands/oficina/
fi

echo "[oficina sync] ~/.claude and ~/.gemini refreshed from $repo"
