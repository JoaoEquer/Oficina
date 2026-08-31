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

# RTK (token-efficiency skill) — best-effort, never blocks the rest of the install
if command -v rtk >/dev/null 2>&1; then
  echo "[ok] rtk already installed"
else
  echo "Installing rtk (token-efficiency)..."
  if curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh; then
    echo "[ok] rtk installed"
  else
    echo "[warn] rtk install failed — skipping RTK setup (see https://github.com/rtk-ai/rtk)"
  fi
fi
if command -v rtk >/dev/null 2>&1; then
  rtk init -g --hook-only || echo "[warn] rtk init -g --hook-only failed"
else
  echo "[warn] rtk not on PATH — skipping rtk init"
fi

# SessionStart hook - nudges /oficina:fechar-sessao when a project's memory log
# looks behind its commits. Read-only, prints nothing when there's nothing to say.
mkdir -p ~/.claude/hooks
cp "$repo/hooks/session-start.sh" ~/.claude/hooks/oficina-session-start.sh
chmod +x ~/.claude/hooks/oficina-session-start.sh
if command -v node >/dev/null 2>&1; then
  node "$repo/hooks/register-session-start.js" || echo "[warn] could not register SessionStart hook in settings.json"
else
  echo "[warn] node not found - hook script copied but not registered in settings.json (needs Node to merge JSON safely)"
fi

# Git hook: keep ~/.claude and ~/.gemini in sync automatically after every commit
# in this repo, so a new/edited command doesn't need a manual re-install to go live.
if [ -d "$repo/.git/hooks" ]; then
  cp "$repo/scripts/git-hooks/post-commit" "$repo/.git/hooks/post-commit"
  chmod +x "$repo/.git/hooks/post-commit"
  echo "[ok] git hook installed: commits to this repo now auto-sync ~/.claude and ~/.gemini"
else
  echo "[warn] $repo is not a git checkout - skipping auto-sync hook"
fi

if [[ "${1:-}" == "--gemini" ]]; then
  mkdir -p ~/.gemini/commands
  cp -r "$repo"/gemini/commands/* ~/.gemini/commands/
  cp "$repo/AGENTS.md" ~/.gemini/OFICINA.md
  echo "[ok] Gemini CLI: /oficina:init, /oficina:crud and /oficina:review installed into ~/.gemini/commands"
  echo "[ok] Gemini CLI: harness copied to ~/.gemini/OFICINA.md"
  echo "     Add '@OFICINA.md' to your ~/.gemini/GEMINI.md to enable it globally."
  echo "     Run /commands reload inside Gemini to pick up the new commands."
fi

echo
echo "Done. To configure a project: enter the folder and run /oficina:init (Claude Code)"
echo "or ask the AI: 'configure this project following commands/init.md from Oficina'."
