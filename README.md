# Oficina

**A lean agent harness for AI-assisted development — pragmatic, focused, battle-tested.**

Real patterns extracted from real projects (multi-tenant SaaS, admin panels with RBAC, operational task management), built with NestJS + TypeScript + Prisma + PostgreSQL. Nothing here is theoretical: every skill, rule and command was born from a problem that showed up in production or in a client delivery.

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
│   ├── nestjs-crud-pattern/        # NestJS CRUD: controller/service/repository with DIP
│   ├── prisma-schema-conventions/  # Multi-tenant data modeling conventions for Prisma
│   ├── rbac-design/                # RBAC design: roles + granular permissions
│   ├── clickup-task-breakdown/     # From scope documents to structured tasks
│   ├── client-facing-docs/         # Technical docs for clients, jargon-free
│   └── token-efficiency/           # RTK setup + habits to cut session token waste
├── rules/           # Always-on rules (embedded into project context files)
│   ├── engineering-philosophy.md
│   ├── git-workflow.md
│   └── security-baseline.md
├── commands/        # Slash commands
│   ├── init.md      # /oficina:init — configures any project automatically
│   └── crud.md      # /oficina:crud <domain> — generates a CRUD domain, house style
├── .claude-plugin/  # Claude Code plugin/marketplace manifests
├── install.sh / install.ps1  # Installers for non-Claude harnesses
├── examples/        # Example CLAUDE.md to point a project at this harness
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

Skills and commands load automatically (namespaced: `/oficina:init`, `/oficina:crud`). To update when the repository evolves: `/plugin marketplace update oficina`.

### Gemini CLI, Cursor, Codex and others

```bash
git clone https://github.com/JoaoEquer/Oficina.git
cd Oficina
./install.sh --gemini     # macOS/Linux/WSL
# or, on Windows:
.\install.ps1 -Gemini
```

These harnesses read the project's `AGENTS.md` — which the step below generates for you.

## Using it in a project (autonomous)

Enter the project folder and run:

```
/oficina:init
```

The AI investigates the repository (stack, structure, data model document), generates an `AGENTS.md` with the full rules embedded plus `CLAUDE.md` and `GEMINI.md` pointing to it, detects technical decisions already present in the code, and lists anything that needs human confirmation as PENDING. One command, three harnesses configured.

On a harness without slash commands, just ask: *"configure this project following `commands/init.md` from Oficina"*.

Prefer doing it by hand? `examples/project-CLAUDE.md` remains available as a template.

## Covered stack

TypeScript · NestJS · Prisma · PostgreSQL · Docker · GitHub Actions · ClickUp

If you use a different stack, this repository is probably not for you — and that's fine. Build your own; `docs/HOW-TO-GROW.md` explains the method.

## Credits

- Method and structural inspiration: [affaan-m/ECC](https://github.com/affaan-m/ECC)
- Engineering philosophy: Fabio Akita and Augusto Galego
- Patterns extracted from real projects built at [Wibi](https://wibi.com.br)

## License

MIT — use, copy, adapt.
