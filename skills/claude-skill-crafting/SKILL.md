---
name: claude-skill-crafting
description: Writes and audits agent skills (SKILL.md folders) against the authoring rules in Anthropic's skill best-practices and Claude Code docs - progressive disclosure, contents lists, degrees of freedom, per-model testing, lean writing, checklists, feedback loops, output patterns, shareability, hooks for must-hold rules - plus three pre-ship checks. Use when creating a skill, turning a repeated task into one, reviewing or slimming an existing skill, auditing a whole skills folder, or when a skill is being ignored, followed loosely or costing too much context.
---

# Skill crafting

> Provenance: own skill (2026-11-24). Rules distilled from the RoboNuggets guide "The 10 SKILL Rules" (Oct 2026), which quotes Anthropic's skill authoring best practices (platform.claude.com) and the Claude Code skills and hooks docs. Paraphrased; the guide's prompts are not reproduced. Why: Anthropic's own `skill-creator` predates the 5.5 models and says nothing about one-level references, degrees of freedom, per-model testing or hooks.

Never break these three, even in a five-minute skill:

1. The description says what the skill does and when to use it, in third person ("Creates invoices..."), never "I can" / "you can". It is injected into the system prompt and is the only trigger.
2. The rules that must never be lost sit at the top of SKILL.md. After compaction Claude Code re-attaches only the start of each invoked skill (about the first 5,000 tokens).
3. A rule whose violation costs money, data or a client is a hook, not capital letters.

## The 10 rules

1. **Progressive disclosure.** SKILL.md body under 500 lines. Everything else in its own file, each linked directly from SKILL.md, one level deep. A file reached only through another file may be previewed (`head -100`) and read incomplete.
2. **Contents lists.** Any file over 100 lines opens with a short Contents list, one line per section, in file order, so a partial read still shows the scope.
3. **Degrees of freedom.** Match detail to the cost of a mistake. Fragile, costly steps get an exact script or command with few parameters; steps with a preferred shape get pseudocode or a parameterised script; low-risk steps get a goal in plain text. One skill can mix all three.
4. **Test on the models you use.** Haiku: is there enough guidance? Sonnet: clear and efficient? Opus/Fable: does it over-explain? Step-by-step instructions written for older models can degrade newer ones; remove them and keep the cut only if output is equal or better. Spend this effort on the skills you depend on most.
5. **Write only what Claude lacks.** Cut general knowledge; keep your own facts (prices, terms, clients, house rules). Every paragraph has to justify its token cost.
6. **Workflows and checklists.** Any job over three or four steps gets numbered steps and a checklist Claude copies and ticks. Every check step ends with where to go back to when it fails ("if a total does not match, return to step 2").
7. **Feedback loops.** Run a check, fix, repeat until it passes. The validator can be a style guide Claude compares against. Script errors name the problem and what exists ("field X not found; available: ..."), never a bare "Error".
8. **Common patterns.** Templates state whether they are strict or a sensible default. Style-dependent output gets two or three real input/output pairs. Branching jobs get the fork written out ("creating new? follow A; editing? follow B").
9. **Shareability.** List every package and CLI the skill needs with its install line. No paths that exist only on your machine; forward slashes only.
10. **Hooks for must-hold rules.** Grep the skill for never / always / must / caps. For each, ask what a miss costs. The few that cost real money or data become a `hooks` entry in the skill's frontmatter (active from invocation to session end); the rest stay as plain sentences with the reason beside them.

## Pre-ship checks

- **Test first.** Write three real test tasks, run them without the skill to get a baseline, then write the smallest skill that fixes what failed. Re-run in a fresh session with the skill on and off after every big change; leftover context from writing the skill hides gaps.
- **Top first.** Open SKILL.md with the few rules that can never be dropped; history, context and long examples go lower or in their own files.
- **No reasoning echo.** Remove instructions like "think step by step and write out your reasoning". On Fable 5 and the 5.5 models they can trigger `reasoning_extraction` refusals. Ask for the answer plus a short explanation instead.

## Auditing a folder

Copy this and tick it per skill; report before changing anything.

```
- [ ] Backup exists (git commit or copy)
- [ ] SKILL.md body < 500 lines; every file linked from SKILL.md; none only nested
- [ ] Files > 100 lines start with Contents
- [ ] Costly steps scripted; cheap steps loose
- [ ] Description: third person, what + when
- [ ] No paragraphs of general knowledge
- [ ] Long jobs: numbered steps, checklist, go-back line after each check
- [ ] Quality-critical output has a check -> fix -> repeat loop
- [ ] Templates say strict or default; style output has examples
- [ ] Needs list with install lines; no local paths, no backslashes
- [ ] Must-hold rules are hooks
- [ ] Three test tasks + baseline exist
- [ ] Most important rules at the top
- [ ] No "show your reasoning" instructions
```

Report as one table row per skill (failures, worst problem), then per-skill findings with file:line and the exact fix, then a numbered fix list ranked by impact. Apply only the numbers the user approves, re-check the changed skills, and if a check still fails, go back and fix it before listing what changed. On a big folder, start with the five most-used skills or the ones that send money, delete things or talk to clients.
