# Roadmap

Last updated: 2026-10-25. Items 3 to 6 are done (marked below). This is a direction, not a promise: the growth rule in `docs/HOW-TO-GROW.md` still decides what enters (nothing until it has repeated twice in a real project, or closes a confirmed gap).

## Now: close what is half-done

1. **Validate the two experimental game skills.** `game-design-doc` and `game-assets` are marked experimental because each has been used in one project only. Use each in a second real game, fill the *Validation* table, then drop the experimental flag or remove the skill.
2. **Confirm the Roblox exporter against the real API.** It is only tested against a mock. First real upload: check in Studio that `rbxassetid://<id>` works for `ImageLabel.Image` and record the result.
3. **Done: integration branches.** Both were already merged into `origin/main`; local `main` fast-forwarded. Stale remote branches can be deleted. Was: merge `chore/integra-branches-abertas` and `feat/audit-skills` into `main` (or close them), so `main` is the single source. Local `main` is behind `origin/main` by 2 commits.
4. **Done: public-safe check.** `scripts/check.mjs` fails if a tracked file contains a term from a private deny-list (`.oficina/forbidden-terms.txt` locally, `FORBIDDEN_TERMS` secret in CI). The list is not in the repo because the repo is public.

## Next: make it verifiable

5. **Done: CI for the pack itself.** `.github/workflows/ci.yml` runs `scripts/check.mjs`: frontmatter name matches folder, description present and under 1024 chars, every skill listed in `AGENTS.md`, README skill count matches `skills/`, relative links resolve.
6. **Done: installer smoke tests.** `scripts/smoke-install.mjs` runs the installer for the current OS in a temp HOME (stub `rtk`, no network) and asserts skills, commands and Gemini files land. CI runs it on Ubuntu and Windows. `install.ps1` verified locally; `install.sh` is only exercised in CI.
7. **Skills radar pass.** Re-read the research log of external skills, adopt only what closes a confirmed gap, dated and justified. Skills nobody triggered in 2–3 months get a rewritten `description` or are removed (the quarterly 30-minute review).

## Later: only if the rule is met

8. **Testing patterns for the house stack.** Jest + Supertest layout (unit vs integration config) is repeated across backends; extract it once it is the same in a third place.
9. **Frontend and mobile house patterns** (data fetching, forms, RN performance). Today these come from curated skills, not house patterns. Extract only what keeps repeating.
10. **Skill triggering evaluation.** A small set of prompts per skill to check it fires when it should, to catch bad `description` fields before they cost a session.

## Not planned

- Counts for their own sake (hundreds of skills, many languages).
- Auto-installers that clone third-party skills without review.
- A bespoke agent or runtime: Oficina stays a context pack.
