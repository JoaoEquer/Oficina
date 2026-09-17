---
description: Generates a complete CRUD domain in the house pattern (Express + Prisma, multi-tenant)
argument-hint: "<domain>"
---

Create the CRUD domain **$ARGUMENTS** following the house pattern (`express-prisma-pattern`), plus the conventions in the `prisma-schema-conventions` skill.

Mandatory steps, in this order:

1. Detect the stack: check the project's `package.json`. `express` present → use the `express-prisma-pattern` skill. `@nestjs/core` present instead → stop and tell the user Oficina doesn't maintain a NestJS pattern today (no active Wibi backend runs NestJS); they can adapt `express-prisma-pattern`'s principles by hand, or pull the retired `nestjs-crud-pattern` skill from an older commit if they want the literal Nest structure back. Neither present → STOP and ask which pattern to follow; do not guess.
2. Locate the project's data model document (UML/diagram in `docs/`). If you can't find it or the entity isn't in it, STOP and ask for the fields — do not invent them.
3. If a CRUD module/feature already exists in the repo, use it as the mold and keep the format identical.
4. Model the entity in `schema.prisma` following the conventions (workspaceId, soft delete, UTC, and whichever others apply) and generate the migration with a descriptive name.
5. Create the complete feature exactly as `express-prisma-pattern` describes — full folder structure, wiring, and validation approach. Controller → usecase → repository, wired by hand in a factory.
6. Validate: project boots, migration applied, all 5 routes respond, lint and build clean.
7. Write the delivery log in `docs/log/` (what was done, decisions, pending items), per the git-workflow rule.

8. **Self-verification (mandatory — do not skip):** before declaring the domain done, check every item below and print the checklist with an explicit pass/fail per item. If any item fails, fix it before finishing; if it cannot be fixed, report it as a pending item — never declare done with a silent failure.
   - [ ] Entity fields match the project's data model document (no invented fields)
   - [ ] Migration applied with a descriptive name (table exists)
   - [ ] Repository is an interface/abstract contract + Prisma implementation, never called directly by controller or business logic
   - [ ] `workspaceId` comes from the authenticated context; zero endpoints accept it in the body
   - [ ] Every repository query filters by `workspaceId`
   - [ ] Input validated as the first thing that runs (zod, in whichever layer — controller or usecase — the project already validates at) — every non-negotiable rule of `express-prisma-pattern` followed
   - [ ] All 5 routes respond (POST, GET list, GET by id, PATCH, DELETE)
   - [ ] Feature wired into the app: factory + route registration; lint and build clean
   - [ ] Delivery log written in `docs/log/`
   - [ ] Any decision marked PENDING in the project's AGENTS.md was flagged, not silently decided

Non-negotiable rules: workspaceId from the authenticated context (never from the body), every query filters by tenant, permissions validated on the server, dates in UTC.
