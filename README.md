# Oficina

**A portable context pack for AI coding assistants — pragmatic, focused, battle-tested.**

Not an agent itself: a shared, versioned set of rules, skills and commands that any AI coding assistant reads, so it behaves the same way — house style, security baseline, memory across sessions — on every project you point it at.

Real patterns extracted from real projects (multi-tenant SaaS, admin panels with RBAC, operational task management), built with Node.js + TypeScript + Prisma — Express in a manual Clean Architecture shape today (NestJS kept for projects that explicitly pick it). Nothing here is theoretical: every house-pattern skill, rule and command was born from a problem that showed up in production or in a client delivery; the curated skills (see `docs/HOW-TO-GROW.md`) close a confirmed, current gap the same way.

Works with **Claude Code** and any harness that reads `AGENTS.md` (Codex, Cursor, OpenCode, Gemini CLI).

*"Oficina" is Portuguese for "workshop" — the place where working patterns are forged.*

## Philosophy

Inspired by the method behind [ECC](https://github.com/affaan-m/ECC) — use, extract the pattern, turn it into a skill, reuse — but deliberately **small**. There are no 270 skills for 12 languages here. There is what I actually use, for the stack I actually use. The single growth rule:

> **Nothing enters this repository until it has repeated at least twice in a real project.**

The editorial line follows the pragmatic school (Fabio Akita, Augusto Galego): proven technology over trends, complexity only when the problem demands it, reversible decisions, no buzzwords.

## Structure

```
oficina/
├── skills/          # Reusable working patterns (the primary surface)
│   │                # -- House patterns (Path 1: extracted by repetition, see docs/HOW-TO-GROW.md) --
│   ├── express-prisma-pattern/     # Express + Prisma CRUD: manual Clean Architecture (the real Wibi stack)
│   ├── prisma-schema-conventions/  # Multi-tenant data modeling conventions for Prisma
│   ├── rbac-design/                # RBAC design: roles + granular permissions
│   ├── clickup-task-breakdown/     # From scope documents to structured tasks
│   ├── client-facing-docs/         # Technical docs for clients, jargon-free
│   ├── token-efficiency/           # RTK setup + habits to cut session token waste
│   │                # -- Curated (Path 2: audited external adoption, see docs/HOW-TO-GROW.md) --
│   ├── domain-modeling/            # Sharpen CONTEXT.md glossary + ADRs as you design
│   ├── codebase-design/            # Deep-module vocabulary: module, interface, depth, seam, adapter
│   ├── improve-codebase-architecture/ # Scan for deepening opportunities, visual HTML report
│   ├── grilling/                   # Structured requirements interview (design-tree, round by round)
│   ├── diagnosing-bugs/            # 6-phase discipline for hard bugs and perf regressions
│   ├── tdd/                        # Red-green-refactor: seams, anti-patterns, the rules of the loop
│   ├── secrets-gitleaks/           # Gitleaks: pre-commit + CI secret scanning (security-baseline.md)
│   ├── ci-cd-and-automation/       # Quality-gate CI/CD from scratch: gates, rollback, feature flags
│   ├── rag-architect/              # RAG pipeline design + retrieval evaluation (dream-book-api-agent)
│   └── sentry-setup-ai-monitoring/ # LLM call cost/latency/token instrumentation (dream-book-api-agent)
├── rules/           # Always-on rules (embedded into project context files)
│   ├── engineering-philosophy.md
│   ├── git-workflow.md
│   ├── security-baseline.md
│   └── agent-workflow.md          # how to direct the agent itself: plan before code, scoped sessions, early correction
├── commands/        # Slash commands
│   ├── init.md      # /oficina:init — configures any project automatically
│   ├── crud.md      # /oficina:crud <domain> — generates a CRUD domain, house style
│   ├── review.md    # /oficina:review [PR] — reviews a diff against the house checklist, read-only
│   └── fechar-sessao.md  # /oficina:fechar-sessao — closes the session, rewrites Estado Atual
├── .claude-plugin/  # Claude Code plugin/marketplace manifests
├── install.sh / install.ps1  # Installers for non-Claude harnesses
├── examples/        # Example CLAUDE.md and committed .claude/settings.json for a project on this harness
├── docs/
│   └── HOW-TO-GROW.md   # The growth process of this repository
└── AGENTS.md        # Entry point for non-Claude harnesses
```

## Installation

### Claude Code (recommended — plugin, zero manual copying)

Inside Claude Code, two commands:

```
/plugin marketplace add JoaoEquer/Oficina
/plugin install oficina@oficina
```

Skills and commands load automatically (namespaced: `/oficina:init`, `/oficina:crud`, `/oficina:review`, `/oficina:fechar-sessao`). To update when the repository evolves: `/plugin marketplace update oficina`.

### Gemini CLI, Cursor, Codex and others

```bash
git clone https://github.com/JoaoEquer/Oficina.git
cd Oficina
./install.sh --gemini     # macOS/Linux/WSL
# or, on Windows:
.\install.ps1 -Gemini
```

This installs the same slash commands for Gemini CLI (`/oficina:init`, `/oficina:crud`, `/oficina:review`, `/oficina:fechar-sessao` — TOML commands in `~/.gemini/commands/`). Run `/commands reload` inside Gemini afterwards. These harnesses also read the project's `AGENTS.md` — which the step below generates for you.

There is deliberately no `SessionStart` hook nudging you to run `/oficina:fechar-sessao`. An earlier version had one; it assumed every session ends cleanly enough to close it out, which doesn't hold if you work until the session/quota just cuts off — so it fired on sessions you had no intention of closing and, worse, primed the agent to spend a turn catching up a stale `AGENTS.md` before starting the actual next task. `/oficina:fechar-sessao` is opt-in bookkeeping: run it when you land on a natural stopping point and want to, never a prerequisite for anything.

## Using it in a project (autonomous)

Enter the project folder and run:

```
/oficina:init
```

The AI investigates the repository (stack, structure, data model document), generates an `AGENTS.md` with the full rules embedded plus `CLAUDE.md` and `GEMINI.md` pointing to it, detects technical decisions already present in the code, and lists anything that needs human confirmation as PENDING. One command, three harnesses configured.

On a harness without slash commands, just ask: *"configure this project following `commands/init.md` from Oficina"*.

Prefer doing it by hand? `examples/project-CLAUDE.md` remains available as a template.

## Covered stack

TypeScript · Express · NestJS (legacy) · Prisma · MySQL/PostgreSQL · Docker · GitHub Actions · ClickUp

If you use a different stack, this repository is probably not for you — and that's fine. Build your own; `docs/HOW-TO-GROW.md` explains the method (including the curated-adoption path for stack-agnostic engineering practice: testing, debugging, CI/CD, secret scanning).

## Credits

- Method and structural inspiration: [affaan-m/ECC](https://github.com/affaan-m/ECC)
- Engineering philosophy: Fabio Akita and Augusto Galego
- Patterns extracted from real projects built at [Wibi](https://wibi.com.br)

## License

MIT — use, copy, adapt.
