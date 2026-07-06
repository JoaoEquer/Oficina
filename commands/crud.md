---
description: Generates a complete CRUD domain in the house pattern (NestJS + Prisma, multi-tenant)
argument-hint: "<domain>"
---

Create the CRUD domain **$ARGUMENTS** strictly following the `nestjs-crud-pattern` skill and the conventions in the `prisma-schema-conventions` skill.

Mandatory steps, in this order:

1. Locate the project's data model document (UML/diagram in `docs/`). If you can't find it or the entity isn't in it, STOP and ask for the fields — do not invent them.
2. If a CRUD module already exists in the repo, use it as the mold and keep the format identical.
3. Model the entity in `schema.prisma` following the conventions (workspaceId, soft delete, UTC, and whichever others apply) and generate the migration with a descriptive name.
4. Create the complete `src/modules/$ARGUMENTS/`: controller, service, repository (abstract contract + Prisma implementation), DTOs with class-validator, module with provider token. Register it in AppModule.
5. Validate: project boots, migration applied, all 5 routes respond, lint and build clean.
6. Write the delivery log in `docs/log/` (what was done, decisions, pending items), per the git-workflow rule.

7. **Self-verification (mandatory — do not skip):** before declaring the domain done, check every item below and print the checklist with an explicit pass/fail per item. If any item fails, fix it before finishing; if it cannot be fixed, report it as a pending item — never declare done with a silent failure.
   - [ ] Entity fields match the project's data model document (no invented fields)
   - [ ] Migration applied with a descriptive name (table exists)
   - [ ] Repository is an abstract contract + Prisma implementation bound via provider token
   - [ ] `workspaceId` comes from the authenticated context; zero endpoints accept it in the body
   - [ ] Every repository query filters by `workspaceId`
   - [ ] DTOs validate via class-validator; global ValidationPipe active
   - [ ] All 5 routes respond (POST, GET list, GET by id, PATCH, DELETE)
   - [ ] Module registered in AppModule; lint and build clean
   - [ ] Delivery log written in `docs/log/`
   - [ ] Any decision marked PENDING in the project's AGENTS.md was flagged, not silently decided

Non-negotiable rules: workspaceId from the authenticated context (never from the body), every query filters by tenant, permissions validated on the server, dates in UTC.
