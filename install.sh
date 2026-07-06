#!/usr/bin/env bash
# Oficina — macOS/Linux/WSL installer
# Usage:
#   ./install.sh            -> global install for Claude Code (skills + commands into ~/.claude)
#   ./install.sh --gemini   -> also install for Gemini CLI (~/.gemini)
set -euo pipefail
repo="$(cd "$(dirname "$0")" && pwd)"

echo "Oficina — installing from $repo"

mkdir -p ~/.claude/skills ~/.claude/commands
cp -r "$repo"/skills/* ~/.claude/skills/
cp "$repo"/commands/*.md ~/.claude/commands/
echo "[ok] Claude Code: skills and commands installed into ~/.claude"

if [[ "${1:-}" == "--gemini" ]]; then
  mkdir -p ~/.gemini/commands
  cp -r "$repo"/gemini/commands/* ~/.gemini/commands/
  cp "$repo/AGENTS.md" ~/.gemini/OFICINA.md
  echo "[ok] Gemini CLI: /oficina:init and /oficina:crud installed into ~/.gemini/commands"
  echo "[ok] Gemini CLI: harness copied to ~/.gemini/OFICINA.md"
  echo "     Add '@OFICINA.md' to your ~/.gemini/GEMINI.md to enable it globally."
  echo "     Run /commands reload inside Gemini to pick up the new commands."
fi

echo
echo "Done. To configure a project: enter the folder and run /oficina:init (Claude Code)"
echo "or ask the AI: 'configure this project following commands/init.md from Oficina'."
