---
name: arms-agentic-os
description: Sets up or audits a personal agent workspace ("agentic OS") by its four parts - Skills, Memory, Routines, Apps (ARMS) - each with three levels, from a first setup to self-improving skills, capped routines, plain-text memory maps and micro-apps. Use when organising a workspace so the agent finds things fast and cheap, when deciding what to turn into a skill, routine, memory or app, when scheduled tasks or skills are burning too much usage, or when the user asks "what should I build next in my setup".
---

# ARMS agentic OS

> Provenance: own skill (2026-11-24). Structure distilled from the RoboNuggets guides "Build your Agentic OS" (ARMS v1) and "The new ARMS levels, Agentic OS v2". Paraphrased; the guides' prompts and paid templates are not reproduced. Overlaps on purpose with `token-efficiency` (cache, compaction, model tiering), which goes deeper on those.

ARMS = **A**pps, **R**outines, **M**emory, **S**kills. Build bottom-up (Skills first, Apps last) and start at the first level the user has not built yet. The value is in how context and workspace are organised underneath, not in the dashboard on top.

## How to run it

1. Inventory before advising: list skills (and which model each runs on), scheduled tasks, CLAUDE.md / AGENTS.md / MEMORY.md, connected MCPs and CLIs. Do not assume; read the files.
2. Score each part against the levels below. Report the three levels that would help most, with the evidence for each.
3. Change nothing until the user picks. Show every new map, skill or routine before saving it; API keys go in a file, never in the chat.
4. Then the habit that pays: each week, ask which job deserves a skill, which routine a cap, which correction a memory, which review its own app.

## Skills (instructions Claude follows when called)

- **Foundation.** Use the built-in skills and a skill creator first. A first skill stays short; short skills get followed. A good tip seen anywhere becomes a tested skill the same day.
- **L1, know the types.** Database skills hold knowledge (tone of voice, past titles, thumbnails), not just steps. Guard against overfitting with wildcards: of ten ideas, eight follow the references and two do not; good wildcards join the references. Artifact skills build decks and reports in HTML from a brand book, export at the end, and keep one searchable index of past outputs. Self-triggered skills run outside chat from a button via headless `claude -p`.
- **L2, route models.** Fixed-step skills pin the smallest model that does the job (`model: haiku` in frontmatter). A fast classifier can route the rest. Rank skills by tokens to see which to slim.
- **L3, self-improving.** When feedback comes in, find the principle behind it and fold it into the skill so it gets sharper, not longer. Keep a short log of what changed and why.

## Memory (what Claude knows, and how fast and cheap it finds it)

- **L1, long-term, plain text.** MEMORY.md as a card catalogue, one line per memory linking to its file. CLAUDE.md as a map, not a rulebook: it points each area of work to a router file (e.g. `content.md`) that lists that area's key files. Database skills route to where live numbers sit. No vector database; letting Claude search files worked better. Give images a text description (save the generating prompt; caption old ones with a cheap model). Test: ask where something lives; two or three file opens means the map works, a full-repo search means a layer is missing.
- **L2, short-term (the context window).** Compact with a purpose and say what to keep, or write standing "always keep" rules into CLAUDE.md. Know when the prompt cache goes cold (about an hour idle on a subscription) and what a cold reload costs; a minimal keep-warm ping from the same chat and model only pays when the numbers say so.
- **L3, self-evolving.** Correcting Claude twice on the same point means memory failed. Park mid-task feedback in the skill's own file (`/note` style) and apply the batch later; save the lessons that matter deliberately, linked to related memories and to the skill they belong to (`/calibrate` style).

## Routines (scheduled work with no typing)

- **Foundation.** Local routines only run while the machine is on; always-on needs a small cloud machine that shares the same skills and context (e.g. Syncthing).
- **L1, active vs passive.** Active routines deliver something to review; passive ones run quietly and speak only when they find something. Most routines should be passive, or the review load grows with every routine.
- **L2, capped.** Every routine spends plan or API credits. Rank them by weekly tokens and cost, trim the most expensive to a cap the user sets, and show before/after. Never drop something the user depends on without asking.
- **L3, routines that suggest routines.** Weekly, read the week's sessions for jobs done by hand three or more times and propose them as routines; set up only the ones chosen.

## Apps (what Claude reaches, and what it builds)

- **L1, connect anything, lightest first.** Try in order: the vendor's own tools, a community CLI (lightest on usage), the app's API, a community MCP (heaviest: its whole tool list loads into every chat). Keep MCPs few. Test with one real read.
- **L2, mods and extensions.** Small add-ons for Claude Code, and Chrome extensions Claude builds for sites used weekly; they run as code and spend no tokens.
- **L3, a micro-app per big job.** When a job is a weekly review of Claude's work, move it out of chat into a small local app with a button that copies comments back. Start from a small library of reusable UI pieces so every app looks the same.

## Recap checklist

```
Skills   [ ] weekly references live in a database skill with wildcards
         [ ] fixed-step skills run on the smallest capable model
         [ ] the most-used skill improves from feedback
Routines [ ] most only speak when something matters
         [ ] cost per routine known; the most expensive is capped
         [ ] a weekly routine proposes new routines
Memory   [ ] everything findable through plain-text maps
         [ ] compaction has a purpose; cache cold point is known
         [ ] no correction repeated twice
Apps     [ ] every app has an entry, lightest first
         [ ] one mod or extension saves clicks daily
         [ ] one weekly job lives in a micro-app
```
