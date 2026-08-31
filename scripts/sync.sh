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

if [ -d ~/.gemini ]; then
  mkdir -p ~/.gemini/commands/oficina
  cp "$repo"/gemini/commands/oficina/* ~/.gemini/commands/oficina/
fi

echo "[oficina sync] ~/.claude and ~/.gemini refreshed from $repo"
