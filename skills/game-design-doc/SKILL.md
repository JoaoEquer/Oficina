---
name: game-design-doc
description: Builds or reviews a Game Design Document (GDD) for a game project - core loop, pillars, progression, economy formulas, UI, MVP scope and out-of-scope - by reading the project first and interviewing the owner with the grilling skill, writing only confirmed decisions. Has a review mode that compares an existing game's code against its GDD and lists the gaps, and a reference for idle/incremental economy math. Use whenever the user wants a GDD, game design doc, "documento de design", game pitch, roadmap of mechanics, asks "how do I improve this game", "is the progression balanced", "what is missing in my game", or starts a new game project (Unity, Electron, Roblox, any engine). Only load in game projects.
---

# Game design doc

> Provenance: own skill (2026-10-22), **stable since 2026-10-25** after two real projects (Galaslime, Milkway Runners; see Validation). Interview method delegates to `grilling`; structure follows the pillars/loop/scope shape already used by a real project's `docs/roadmap.md` and `CONTEXT.md`.

A GDD here is a decision record, not a wish list. Every line is either **CONFIRMED** (the owner said it or the code proves it) or **PENDENTE** (open). Never fill a section with plausible-sounding design the owner did not choose.

## Modes

- **Build** (no GDD yet): read the project, interview, write `GDD.md`.
- **Review** (GDD or code exists): compare, list gaps, propose next increments. Does not rewrite decisions.

Pick the mode from the project: `GDD.md` present or substantial `docs/`/code present = Review first; empty project = Build.

## Process

### 1. Read before asking
Facts are your job, decisions are the owner's. Read: `README`, `AGENTS.md`, `CONTEXT.md`, `docs/` (roadmap, ADRs, design notes), `package.json`/project settings (engine), the game-rules source (content tables, formulas, constants), tests. Note what already answers each GDD section. Never ask something a file answers.

### 2. Interview (Build) or gap list (Review)
Use the `grilling` skill: rounds of numbered questions, each with your recommended answer; only ask the frontier. Order of the design tree:
1. Pillars (3-7) and the one-sentence fantasy. Everything below must serve a pillar.
2. Core loop (what the player does in the first 30 seconds, 5 minutes, one session).
3. Progression and economy (see `references/idle-economy.md` for idle/incremental games).
4. Content plan (what exists, what is the minimum for a playable MVP).
5. UI/UX and first-session flow.
6. Target platform, session length, monetization (or "none").
7. Scope: MVP list and an explicit **out of scope** list.

### 3. Write `GDD.md` from `templates/GDD.md`
- Language: the project's (a PT-BR project gets a PT-BR GDD).
- Numbers come from code or the owner. If a formula is in code, cite `file:symbol` instead of copying values that will rot.
- Link, don't duplicate: art style and asset naming live in `ASSETS.md` (`game-assets` skill); glossary in `CONTEXT.md` (`domain-modeling`); big decisions in ADRs.
- Keep it under ~250 lines. Longer = split into `docs/design/`.

### 4. Review mode output
Run `references/review-checklist.md` against code + GDD. Report, ranked:
- **Gaps**: GDD says X, code does Y or nothing (file:line).
- **Risks**: broken economy, dead choices, no first-session hook, scope creep.
- **Next increments**: small, testable, each tied to a pillar. Not "rebalance everything".
Be honest about what is unverified: a balance claim without a run/test is an opinion, label it.

## Rules
- Do not run balance simulations unless the owner asks; they burn plan limits. Read existing probes/tests and quote their results instead.
- Do not edit game code in this skill; GDD and review only.
- Do not invent tone, theme, monetization or platform; ask or mark PENDENTE.
- A game with no "out of scope" list has no scope. Insist on it.
- When the meeting plan and the code disagree, mark the plan PLANEJADO and the code CONFIRMADO; never write the plan as if it existed. Flag code features that no document decided (e.g. PvP) as a risk, not as scope.

## Validation (experimental)
Record each real project where this skill was used, and what it changed. Promote to stable after two.

| Project | Date | Mode | Result / what was missing |
|---|---|---|---|
| Galaslime (`idle-game`) | 2026-10-23 | Review | GDD sem entrevista, 21 itens do checklist: MVP numérico, fora de escopo e gancho de retorno ausentes; escolhas mortas e duração da luta não verificadas sem rodar sonda. Review não fechou sozinho: falta o dono responder os PENDENTE. |
| Galaslime (`idle-game`) | 2026-10-25 | Interview (parcial) | Entrevista fechou 6 PENDENTE em uma rodada (monetização, sessão e ritmo, arte, cena, acessibilidade) e expôs um conflito: free-to-play com compras contradiz o "fora de escopo" proposto antes sem entrevista. A skill deveria cruzar cada resposta com as seções já escritas antes de gravar. |
| Milkway Runners (`teste-milk/milkway-runners`) | 2026-10-25 | Review + Interview | Sem GDD mas com 14 docs e 102 scripts: o Review já achou 5 gaps do plano contra o código (2 de 3 planetas, 4 de 12 espécies, 0 de O2, perks e chefes) que os docs descrevem como existentes. Uma rodada de 5 perguntas fechou pilares, MVP, monetização, sessão, tom, tutorial e acessibilidade. A skill não diz o que fazer quando o plano da reunião e o código divergem: tratei plano como PLANEJADO e código como CONFIRMADO. Também apareceu PvP no código sem nenhum doc decidindo, e a skill não tem item no checklist para "feature sem dono de decisão". |
