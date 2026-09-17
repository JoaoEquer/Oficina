---
description: Closes the current work session — rewrites the Estado Atual section of AGENTS.md to reflect where things stand now
argument-hint: "[nota opcional]"
---

**This is opt-in bookkeeping, never a gate.** Run it only when you land on a natural stopping point and want to leave a marker — never as a required step before starting the next task, and never to "catch up" a session that ended without it. A session that runs until it hits a token/quota limit won't get a clean close, and that's fine: a stale or missing `Estado Atual` costs nothing by itself. If the user is here to start new work, start it — don't spend a turn closing out the last one first unless they specifically asked for that.

Close the current session on this project. Optional argument: $ARGUMENTS — a note steering the summary, if the user wants to point at something specific; otherwise derive it entirely from the conversation.

**AGENTS.md is read in full, every turn, by every tool that opens this project (`@AGENTS.md` from `CLAUDE.md`/`GEMINI.md`).** Nothing written into it is ever "cheap" — it is a permanent per-turn tax, not a notebook. This project does not keep a separate session-history log — Oficina used to write one to `.oficina/memory/log.md`, but that duplicated what Claude Code's own native memory (`~/.claude/projects/<path>/memory/`, loaded on demand, not every turn) already does better, for no audience that needed the duplicate. So there is exactly one durable record now: your own memory, if you're Claude Code.

1. Confirm this project has an `AGENTS.md` at its root. If not, stop and say `/oficina:init` needs to run first.
2. Summarize this session in 3-5 factual bullets: what changed, decisions made, what's in progress, the next concrete step. No hype, no invented progress — if something is still broken or unverified, say so.
3. **Before you overwrite anything**: if you are Claude Code and the current `## Estado Atual` content (or this session) holds a decision, gotcha, or fact worth keeping past today — something a future session would want and shouldn't have to rediscover — save it to your own memory now. Once you replace the section below, that wording is gone; nothing else will have it.
4. Rewrite the `## Estado Atual` section of `AGENTS.md` with today's summary — this section is the *current* state, never a history. **Replace the entire section body**, don't append below what's there. If you find more than one dated entry already in the section (a past session appended instead of replacing), that's the bug this step exists to stop: fold anything from the stale entries that's still true into today's summary, then delete the rest — don't carry the pile forward.
5. **Verify mechanically — don't trust your own edit.** Re-read the `## Estado Atual` section you just wrote. Count the dated headers in it (`**YYYY-MM-DD**` or similar). If there's more than one, the replace didn't take: collapse it to a single current-state block before moving on. This check exists because step 4's instruction — replace, don't append — already existed in this exact wording before and still got violated for weeks; don't assume the prose alone is enough this time either.
6. Never touch `OPEN_DECISIONS.md` — that file is hand-edited only when a decision is actually confirmed, never AI-summarized.
7. Never write credentials, tokens, connection strings, or client contract terms into `AGENTS.md` or your own memory, per the security-baseline rule. If the summary would include any, redact it and flag it to the user instead of writing it.
8. Do not commit — show the diff of `AGENTS.md` and let the user review before committing.

Report: the updated `## Estado Atual` block, and whatever you saved to memory in step 3, nothing else.
