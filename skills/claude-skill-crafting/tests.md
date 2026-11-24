# Test tasks: claude-skill-crafting

Run each task in a fresh session, once with the skill and once without. Use a copy of the skills folder, never the live one.

## 1. Audit a mixed folder

Prompt: "Audit these skills, report only: rag-architect, secrets-gitleaks, sentry-setup-ai-monitoring, frontend-design." Use a snapshot taken before commits a7b11e3..7a61ff4.

Pass when the report names all seven planted problems:

- rag-architect description points to skills that do not exist (llm-cost-optimizer, agenthub)
- rag-architect reference files over 100 lines with no Contents list
- secrets-gitleaks runs `--no-verify` and `git push --force` with no approval gate
- secrets-gitleaks over 100 lines with no Contents list
- secrets-gitleaks provenance comment cites a "Bundled Resources" section that does not exist
- sentry-setup-ai-monitoring over 100 lines with no Contents list
- frontend-design description has no "use when"

Also pass only if nothing was edited and every finding has file:line and an exact fix.

## 2. Write a new skill from a repeated task

Prompt: "I keep asking you to turn a meeting transcript into ClickUp tasks. Make it a skill."

Pass when: three test tasks and a baseline come before the SKILL.md; description is third person with what and when; numbered steps with a go-back line after the check; no "think step by step" line.

## 3. Slim an oversized skill

Prompt: "playwright-cli is too long, slim it." Use the 2026-11-23 version (over 500 lines).

Pass when: SKILL.md ends under 500 lines; moved material sits in references/ linked directly from SKILL.md, one level deep; every file over 100 lines opens with Contents; no rule or command was lost.

## Baseline

Task 1, run 2026-11-24 on Haiku 5.5, read-only, same snapshot:

- Without the skill: 5 of 7. Missed the rag-architect reference Contents and the stale "Bundled Resources" comment. Its Contents finding for secrets-gitleaks came from reading commit 312111f in the repo, not from a rule, so a run outside this repo would likely score 4.
- With the skill: 7 of 7, plus a go-back line missing in sentry's verification and "no test tasks in any folder".
- Both runs also found two real bugs the planted list did not include: sentry's manual span example recorded prompt messages outside the opt-in, and the gitleaks hook test ran `git reset HEAD~1` after a blocked commit, which undoes the user's previous commit. Both fixed in the repo the same day.
- The run with the skill was longer (21 findings against 12) and included a few low-value ones (third-person wording on sentry's description).

Tasks 2 and 3: not run yet.
