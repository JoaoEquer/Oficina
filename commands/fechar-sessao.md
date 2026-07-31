---
description: Closes the current work session — updates the Estado Atual section of AGENTS.md and appends a dated entry to .oficina/memory/log.md
argument-hint: "[nota opcional]"
---

Close the current session on this project. Optional argument: $ARGUMENTS — a note steering the summary, if the user wants to point at something specific; otherwise derive it entirely from the conversation.

1. Confirm this project has an `AGENTS.md` at its root. If not, stop and say `/oficina:init` needs to run first.
2. Summarize this session in 3-5 factual bullets: what changed, decisions made, what's in progress, the next concrete step. No hype, no invented progress — if something is still broken or unverified, say so.
3. Rewrite the `## Estado Atual` section of `AGENTS.md` with that summary — this section reflects the *current* state, not a history. If the section already exists (replace its content) or not (this project's `AGENTS.md` predates this convention — insert a new `## Estado Atual` section right after the "Source of truth for the data model" line, before `## Harness`).
4. Create `.oficina/memory/` in the project root if it doesn't exist, and append a new entry to `.oficina/memory/log.md`: a `## YYYY-MM-DD` heading followed by the same summary. Append-only — never rewrite or delete previous entries.
5. Never touch `OPEN_DECISIONS.md` — that file is hand-edited only when a decision is actually confirmed, never AI-summarized.
6. Never write credentials, tokens, connection strings, or client contract terms into `.oficina/memory/`, per the security-baseline rule. If the summary would include any, redact it and flag it to the user instead of writing it.
7. Do not commit — show the diff of `AGENTS.md` and the new log entry, and let the user review before committing.

Report: the updated `## Estado Atual` block and the new log entry, nothing else.
