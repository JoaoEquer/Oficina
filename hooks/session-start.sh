#!/usr/bin/env bash
# Oficina SessionStart hook - nudges /oficina:fechar-sessao when it looks behind.
# Registered only for the "startup" and "resume" matchers (not clear/compact/fork),
# so it fires once per real work session, not on every /clear or /compact mid-session.
# Safe by design: read-only, no network, prints nothing when there's nothing to say
# (empty stdout on a SessionStart hook adds nothing to context - documented behavior).
set -euo pipefail

dir="${CLAUDE_PROJECT_DIR:-$PWD}"
agents="$dir/AGENTS.md"
[ -f "$agents" ] || exit 0

last_commit_date="$(git -C "$dir" log -1 --format=%cs 2>/dev/null || true)"
[ -n "$last_commit_date" ] || exit 0

log="$dir/.oficina/memory/log.md"
if [ ! -f "$log" ]; then
  echo "Oficina: this project has AGENTS.md and commits, but no session has been closed yet in .oficina/memory/log.md. Consider proposing /oficina:fechar-sessao to the user when it makes sense."
  exit 0
fi

last_log_date="$(grep -o '^## [0-9-]\{10\}' "$log" | tail -1 | cut -d' ' -f2 || true)"
if [ -z "$last_log_date" ] || [[ "$last_commit_date" > "$last_log_date" ]]; then
  echo "Oficina: there are commits ($last_commit_date) after the last /oficina:fechar-sessao entry ($last_log_date) in this project. Consider proposing to the user that they run /oficina:fechar-sessao to refresh Estado Atual."
fi
