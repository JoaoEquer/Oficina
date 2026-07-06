---
description: Configures the current project with the Oficina harness — generates CLAUDE.md, AGENTS.md and GEMINI.md automatically, grounded in what the project actually is
argument-hint: "[optional project description]"
---

Configure the current project with the **Oficina** harness (https://github.com/JoaoEquer/Oficina). Your goal: by the end, any AI (Claude Code, Gemini, Cursor, Codex) opened in this project works in the house pattern automatically.

## Step 1 — Understand the project BEFORE generating anything

Investigate the current repository:

- Read `package.json`, `README.md` and the folder structure
- Identify: project name, real stack (NestJS? Prisma? which database?), whether a CRUD module already exists to serve as the mold, and where the data model document lives (look in `docs/`)
- If the user passed a description in `$ARGUMENTS`, use it as primary context

If you cannot identify the essentials (name, purpose, whether it is multi-tenant), **ask the user** — at most 3 objective questions. Do not invent context.

## Step 2 — Obtain the rules content

Read the harness's three rule files. Try in this order:

1. From the installed plugin directory (you are running from inside it): `rules/engineering-philosophy.md`, `rules/git-workflow.md`, `rules/security-baseline.md`
2. If not found, fetch from the public repository:
   - https://raw.githubusercontent.com/JoaoEquer/Oficina/main/rules/engineering-philosophy.md
   - https://raw.githubusercontent.com/JoaoEquer/Oficina/main/rules/git-workflow.md
   - https://raw.githubusercontent.com/JoaoEquer/Oficina/main/rules/security-baseline.md

## Step 2.5 — Check for a workspace-level harness

Look for an `AGENTS.md` in the parent directories (e.g. a workspace folder like `Wibi/AGENTS.md`) that already embeds the Oficina rules. If one exists, **do not re-embed the rules in the project's AGENTS.md** — harnesses load parent context files hierarchically, and duplicating them wastes context on every turn. In that case the project file contains only: context, source of truth, locked decisions and pending items, plus one line: "Workspace-level rules inherited from the parent AGENTS.md (Oficina harness)."

## Step 3 — Generate AGENTS.md at the project root

`AGENTS.md` is the canonical file (read by Gemini CLI, Codex, Cursor and others). Structure:

```markdown
# AGENTS.md — <project name>

## Context
<1-2 sentences: what the system does, for whom, detected stack>

Source of truth for the data model: <path to the model document, or "PENDING — ask the tech lead">

## Harness
This project follows the Oficina harness (https://github.com/JoaoEquer/Oficina).

### Always-on rules
<paste here the FULL CONTENT of the three rule files, each under a subtitle —
UNLESS a workspace-level AGENTS.md already embeds them (see Step 2.5)>

### Skills
Before executing tasks in these areas, consult the corresponding skill at
https://github.com/JoaoEquer/Oficina/tree/main/skills (or in the local installation):
- nestjs-crud-pattern — creating any CRUD module/domain/route
- prisma-schema-conventions — creating/changing schema, planning migrations
- rbac-design — permissions, roles, access control
- clickup-task-breakdown — breaking scope into tasks
- client-facing-docs — any material the client will read

## Locked decisions for this project
<list what you detected in code/docs; mark unconfirmed ones as PENDING>

## Known pending items
<what needs human confirmation before going to production>
```

## Step 4 — Generate the pointers

- `CLAUDE.md` at the root, containing exactly: `@AGENTS.md` (Claude Code imports the file)
- `GEMINI.md` at the root, containing exactly: `@AGENTS.md` (Gemini CLI imports the file)
- If `CLAUDE.md`, `GEMINI.md` or `AGENTS.md` already exist in the project, **do not overwrite without showing the diff and asking for confirmation**.

## Step 5 — Report

Show the user: the files created, the decisions detected automatically, and the list of PENDING items that need human answers. Do not commit — let the user review first.
