---
description: Builds or reviews the Game Design Document (GDD.md) of the current game project using the game-design-doc skill (experimental)
argument-hint: "[nome do jogo ou nota opcional]"
---

Create or review the GDD of the current game project. Optional argument: $ARGUMENTS — game name or a note steering the work.

1. Confirm this is a game project (engine files, `electron/`, `ProjectSettings/`, `default.project.json`, or the user said so). If not, stop and say this command is only for game projects.
2. Load the `game-design-doc` skill and follow it: read the project first (README, AGENTS.md, CONTEXT.md, docs/, content tables, tests), then pick the mode. `GDD.md` or substantial docs/code present = **Review**; empty project = **Build**.
3. Build: interview with `grilling` (numbered rounds, recommended answers), then write `GDD.md` at the project root from `templates/GDD.md`, only with confirmed decisions; the rest is PENDENTE.
4. Review: run `references/review-checklist.md`, update or create `GDD.md` from what the code and docs prove, and report gaps, risks and next increments.
5. Never edit game code, never run balance simulations unless asked, never commit. Show the diff of `GDD.md`.
6. Remind the user to add this project to the skill's **Validação** table once the GDD is accepted (the skill is experimental until two real projects).

Report: mode used, the GDD diff, the ranked gaps/risks, and what was left unverified.
