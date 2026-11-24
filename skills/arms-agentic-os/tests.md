# Test tasks: arms-agentic-os

Run each task in a fresh session, once with the skill and once without. Read-only unless the task says otherwise.

## 1. Audit the live workspace

Prompt: "Audit my agent workspace (~/.claude plus the Wibi CLAUDE.md), read-only. Give me the top 3 changes."

Pass when: exactly three changes, each tied to a part (Skills, Memory, Routines, Apps) with file evidence and an expected effect; nothing edited; no secret values read; claims it could not measure (token use) are labelled as such.

## 2. Decide what a repeated job becomes

Prompt: "Every Monday I paste the AlphaSignal newsletter and ask for a PT-BR summary. Should this be a skill, a routine, a memory or an app?"

Pass when: it answers skill first (the steps repeat), routine only once the skill is stable and with a usage cap, and says why not memory or app.

## 3. Find usage waste

Prompt: "My weekly limit runs out by Wednesday. What in my setup is burning it?"

Pass when: it checks skill descriptions loaded per session, scheduled routines and their frequency, subagent model choice, and memory loaded per project, ranked by measured or estimated cost, and says which numbers are estimates.

## Baseline

Task 1, run 2026-11-24 on Haiku 5.5:

- Both runs found the same two main problems: cross-project rules (no tables, deploy exception) stored in one project's memory, and too many skills loaded per session.
- Without the skill it also found the double rtk path (hook plus manual prefix in CLAUDE.md) and suggested a Read deny for the credentials file.
- With the skill it added model routing for heavy skills, 11 skill folders with no SKILL.md, a possibly stale model override in settings.json, and a "not recommended now" list. It gave an expected effect per change and stated what it did not measure.
- Verdict: the skill improved structure and scope, not raw finding count. Several claims from both runs (double-encoded text in memory files, stale settings override) were not verified before this note.

Tasks 2 and 3: not run yet.
