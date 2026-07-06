# Security baseline

Non-negotiable in any project on this stack:

- **Identity and tenant come from the token, never from input.** `workspaceId`, `userId` and the like are extracted from the JWT/authenticated context. Any endpoint accepting these fields in the body is a security bug.
- **Authorization on the server.** Permission guard/decorator on every route that isn't explicitly public. The frontend hides buttons; the server denies actions.
- **Tenant isolation at the data layer.** Every query filters by workspace. PR review checks this on every new repository method.
- **Secrets out of the repository.** `.env` in `.gitignore`, `.env.example` with placeholders. A committed secret = rotate immediately, not just delete from history.
- **Input validation at every edge** (`class-validator` + global `ValidationPipe` with `whitelist: true`).
- **Dates in UTC in the database and the API**; timezone only at presentation.
- **Personal data with privacy law in mind** (LGPD/GDPR): collect the minimum, record the purpose, and treat personal-data deletion as a requirement (the only accepted exception to soft delete).
- **Dependencies**: no obscure packages for convenience; `npm audit`/Dependabot active on the repo.
