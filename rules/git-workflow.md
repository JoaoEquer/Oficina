# Git workflow and day-0 documentation

- **Branch per deliverable**: `feat/<domain>`, `fix/<topic>`, `chore/<topic>`. Nothing straight to `main` after initial setup.
- **Conventional commits** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`), imperative mood, explaining the *why* when it isn't obvious.
- **Documented from day 0**: every day/delivery produces a short log of what was done (what, why, pending items), stored in the project's documentation folder (`docs/log/` in the repo and/or the drive agreed with the client). The log feeds the closing email — never write the closing from memory.
- **Small PRs**: one domain/topic per PR. A PR mixing schema + three domains + a refactor gets no real review.
- **Migrations with descriptive names**, reviewed before merge; production migrations only after the checklist in the `prisma-schema-conventions` skill.
- **Repo README always up to date** with: how to run locally, environment variables (`.env.example` mandatory) and folder structure.
- **Commit `.claude/settings.json`**, not just `.gitignore` it. Tiered permissions (`allow`/`ask`/`deny` — example at https://github.com/JoaoEquer/Oficina/blob/main/examples/project-settings.json) keep every agent working under the same guardrails; production-affecting commands (`git push`, migrations, PR creation) go under `ask`, never `allow`. Personal overrides belong in `.claude/settings.local.json`, which stays gitignored.
