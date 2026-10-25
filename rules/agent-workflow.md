# Agent workflow

How you direct the agent, not what the code looks like. Always-on, regardless of stack.

- **Describe the end state, not a list of steps.** "The `/tasks` endpoint returns tenant-filtered, paginated results" lets the agent plan and self-correct; a numbered script of steps just gets executed literally, bugs included.
- **Put verification inside the prompt.** "…and confirm with `npm run test tasks.spec` before declaring done" changes what the agent optimizes for. A task with no stated verification invites a plausible-looking, unchecked answer.
- **Small, testable increments over one giant ask.** One module, one migration, one PR — not "build the whole domain and wire billing while you're at it."
- **Interrupt early when the agent drifts.** The first wrong file it opens or wrong assumption it states is the cheap moment to correct course; the tenth is not.
- **Non-trivial task ⇒ plan before code.** Anything touching more than one file: read the relevant code and state a short plan first; code starts after the plan is approved, not before.
- **Fresh context per task, not one marathon session.** A new session with a lean AGENTS.md beats a long one dragging stale files and abandoned attempts — see `token-efficiency`.
- **Scope the session to where the task actually lives.** In a full-stack monorepo, a backend-only task gets the agent instantiated inside the backend folder, not the repo root — open the whole tree only when the task genuinely crosses the front/back boundary.
- **Dry-run before anything destructive, check the result after.** For moves, deletes, migrations and bulk edits, run the non-destructive form first (a script can assume a tool that isn't installed and already have moved files). Afterwards compare against an independent measure (same file count and bytes, same row count), not against the agent's own report.
- **Match the agent's freedom to the criticality.** Low criticality (a local script, a home config): let the agent act. Anything with unrecoverable data or production impact: the human states the exact path and the agent does not substitute a "safer-sounding" alternative or keep asking "are you sure?". An agent in a crisis tends to widen it.
