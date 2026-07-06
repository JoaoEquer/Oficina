# CLAUDE.md — <ADJUST: project name>

## Context

<ADJUST: one sentence on what the system does and for whom.>

Stack: NestJS + TypeScript + Prisma + PostgreSQL · Docker + GitHub Actions · <ADJUST: extras (GCS, SSE, JWT...)>

Roles: <ADJUST: tech lead, dev(s)>. Source of truth for the data model: `docs/<ADJUST: model document name>`.

## Harness

This project follows the **Oficina** harness (https://github.com/JoaoEquer/Oficina).

Always-on rules (summary — full text in the harness):

- Pragmatism: proven technology, complexity only when the problem demands it, reversible decisions, no buzzwords, no over-engineering.
- Git: branch per deliverable, conventional commits, small PRs, everything documented from day 0 in `docs/log/`.
- Security: identity/tenant from the token (never from the body), authorization on the server, every query filters by workspace, secrets out of the repo, dates in UTC, validation at every edge.

Relevant installed skills: `nestjs-crud-pattern`, `prisma-schema-conventions`, `rbac-design`, `clickup-task-breakdown`, `client-facing-docs`.

## Locked decisions for this project

<ADJUST: list the project-specific decisions, e.g.:>
- Multi-tenant via workspaceId on every entity
- Criticality as a numeric 1–5 scale
- Idempotent recurrence (templateId + targetDate unique)
- Audit via Postgres queue, consumed by a worker

## Known pending items

<ADJUST: e.g.: provisional workspaceId until the Auth module lands; decisions awaiting tech lead review.>
