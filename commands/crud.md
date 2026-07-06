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

Non-negotiable rules: workspaceId from the authenticated context (never from the body), every query filters by tenant, permissions validated on the server, dates in UTC.
