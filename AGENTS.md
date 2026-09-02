# AGENTS.md — Oficina

Entry point for harnesses that read `AGENTS.md` (Codex, Cursor, OpenCode, Gemini CLI and similar).

This repository is a lean harness of working patterns for the **Node.js + TypeScript + Prisma** stack — Express (manual Clean Architecture) in the real Wibi backends today, NestJS kept for projects that explicitly pick it.

When working on any project that references this harness:

1. **Follow the always-on rules** in `rules/`:
   - `rules/engineering-philosophy.md` — how the team decides (pragmatism, no over-engineering)
   - `rules/git-workflow.md` — branches, commits, documentation from day 0
   - `rules/security-baseline.md` — security and multi-tenancy non-negotiables
   - `rules/agent-workflow.md` — how to direct the agent itself (plan before code, scoped sessions, early correction)
2. **Consult the skills** in `skills/` before executing tasks in the covered areas. House patterns (extracted from repeated real usage — Path 1 in `docs/HOW-TO-GROW.md`):
   - `express-prisma-pattern` — creating any CRUD route/domain in an Express + Prisma backend (the real Wibi stack)
   - `nestjs-crud-pattern` — same, but NestJS projects only (deprecated — check express-prisma-pattern first)
   - `prisma-schema-conventions` — creating/changing schema, planning migrations
   - `rbac-design` — permissions, roles, access control
   - `clickup-task-breakdown` — breaking scope into tasks
   - `client-facing-docs` — any material the client will read
   - `token-efficiency` — session setup, token/context limits, RTK

   Curated skills (audited external adoption closing a confirmed gap — Path 2 in `docs/HOW-TO-GROW.md`):
   - `domain-modeling` — building/sharpening CONTEXT.md glossary and ADRs
   - `codebase-design` — deep-module vocabulary when designing or reviewing an interface
   - `improve-codebase-architecture` — scanning a codebase for deepening opportunities
   - `grilling` — structured requirements interview to stress-test a plan or decision
   - `diagnosing-bugs` — hard bugs and performance regressions
   - `tdd` — test-first feature/bugfix work, red-green-refactor discipline
   - `secrets-gitleaks` — secret scanning, pre-commit and CI (operationalizes `security-baseline.md`)
   - `ci-cd-and-automation` — standing up CI/CD quality gates from scratch
   - `rag-architect` — designing/evaluating a RAG pipeline (dream-book-api-agent today)
   - `sentry-setup-ai-monitoring` — instrumenting LLM call cost/latency/tokens (dream-book-api-agent today)
3. **Documentary source of truth**: data model and scope come from the project's documents. Divergence is a blocker to resolve with the tech lead, not a detail to ignore.
