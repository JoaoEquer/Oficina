#!/usr/bin/env bash
# Oficina — instalador para macOS/Linux/WSL
# Uso:
#   ./install.sh            -> instala global para Claude Code (skills + commands em ~/.claude)
#   ./install.sh --gemini   -> também instala para Gemini CLI (~/.gemini)
set -euo pipefail
repo="$(cd "$(dirname "$0")" && pwd)"

echo "Oficina — instalando a partir de $repo"

mkdir -p ~/.claude/skills ~/.claude/commands
cp -r "$repo"/skills/* ~/.claude/skills/
cp "$repo"/commands/*.md ~/.claude/commands/
echo "[ok] Claude Code: skills e commands instalados em ~/.claude"

if [[ "${1:-}" == "--gemini" ]]; then
  mkdir -p ~/.gemini
  cp "$repo/AGENTS.md" ~/.gemini/OFICINA.md
  echo "[ok] Gemini CLI: harness copiado para ~/.gemini/OFICINA.md"
  echo "     Adicione '@OFICINA.md' ao seu ~/.gemini/GEMINI.md para ativar globalmente."
fi

echo
echo "Pronto. Para configurar um projeto: entre na pasta e rode /oficina:init (Claude Code)"
echo "ou peça à IA: 'configure este projeto seguindo commands/init.md da Oficina'."
