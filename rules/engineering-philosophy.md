# Engineering philosophy

Always-on rules. Copy this block into the project's `CLAUDE.md` / `AGENTS.md`.

- **Proven technology over trends.** The default choice is the mature tool the team masters. Novelty enters with a recorded justification, never out of excitement.
- **Complexity only when the problem demands it.** No Redis, external queues, microservices or abstraction layers "for the future". Postgres and a modular monolith solve it until proven otherwise.
- **Reversible decisions first.** Between two options, prefer the one that is cheap to undo. Irreversible decisions (production schema, public API contract) require tech lead review first.
- **No buzzwords.** In code, docs and conversation: direct language. If you can't explain in one sentence what something does, the problem is the design, not the vocabulary.
- **Honest deadlines.** An estimate is a communication commitment, not a heroism commitment. Slipping? Say it early, with a plan.
- **Do not over-engineer.** SRP and DIP always apply; hexagonal architecture, generic repositories and speculative abstraction do not. Abstraction only where the cost pays off.
- **Documentary source of truth.** Data model, scope and plan come from named documents. Divergence between documents is a blocker to resolve, not a detail to ignore.
