---
description: Reviews the current diff against the Oficina house checklist (security baseline, engineering philosophy, git workflow) — read-only, does not edit
argument-hint: "[optional: PR number]"
---

Review **$ARGUMENTS** (a PR number if given, otherwise the current working diff — staged and unstaged) against the Oficina house checklist. This command only reports; it never edits files. If fixes are wanted, that's a separate, explicit ask.

Read the diff, then check it against each item below. Don't restate the rule generically — point at the specific file:line that violates or satisfies it.

**Blockers (security-baseline) — any failure here means the review fails outright:**
- [ ] `workspaceId`/`userId`/tenant identity comes from the authenticated context, never from the request body
- [ ] Every new repository method filters by `workspaceId`
- [ ] Every new route has a permission guard/decorator, unless explicitly public
- [ ] No secret, token or credential committed; `.env.example` updated if new env vars were introduced
- [ ] Input validated via DTOs (`class-validator`); no raw `req.body` access
- [ ] Dates handled in UTC

**Quality (engineering-philosophy):**
- [ ] No speculative abstraction (generic repository, hexagonal ports/adapters, config built for a single use case)
- [ ] Complexity matches what the problem actually demands — no new dependency or service for something Postgres/the existing monolith already solves
- [ ] Tests cover a failure case, not only the happy path, for new logic

**Process (git-workflow):**
- [ ] Branch and commit messages follow convention (`feat:`/`fix:`/`chore:`/etc., imperative mood)
- [ ] The PR is one domain/topic — flag it if it mixes schema changes, an unrelated refactor and a new feature
- [ ] Migrations have descriptive names and were reviewed before merge

Report format: pass/fail per item with file:line evidence for failures, then a single verdict at the end — ship it / needs changes / blocked. Never close with a vague "looks good".
