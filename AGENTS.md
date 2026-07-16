# AGENTS.md — Oficina

Entry point for harnesses that read `AGENTS.md` (Codex, Cursor, OpenCode, Gemini CLI and similar).

This repository is a lean harness of working patterns for the **NestJS + TypeScript + Prisma + PostgreSQL** stack.

When working on any project that references this harness:

1. **Follow the always-on rules** in `rules/`:
   - `rules/engineering-philosophy.md` — how the team decides (pragmatism, no over-engineering)
   - `rules/git-workflow.md` — branches, commits, documentation from day 0
   - `rules/security-baseline.md` — security and multi-tenancy non-negotiables
   - `rules/agent-workflow.md` — how to direct the agent itself (plan before code, scoped sessions, early correction)
2. **Consult the skills** in `skills/` before executing tasks in the covered areas:
   - `nestjs-crud-pattern` — creating any CRUD module/domain/route
   - `prisma-schema-conventions` — creating/changing schema, planning migrations
   - `rbac-design` — permissions, roles, access control
   - `clickup-task-breakdown` — breaking scope into tasks
   - `client-facing-docs` — any material the client will read
   - `token-efficiency` — session setup, token/context limits, RTK
3. **Documentary source of truth**: data model and scope come from the project's documents. Divergence is a blocker to resolve with the tech lead, not a detail to ignore.
