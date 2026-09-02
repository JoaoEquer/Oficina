# How to grow Oficina

The value of this repository is not in what it holds today — it is in the process that decides what gets in. ECC reached 260+ skills because it covers 12 languages and hundreds of contributors. Oficina covers **one stack and one way of working**, and has two distinct, legitimate paths for a skill to enter — never a third ("found it while browsing, seemed useful").

## Two paths in, one repository

**Path 1 — House patterns, by repetition.** The original path, and still the default for anything specific to *how Wibi builds* (a CRUD shape, a schema convention, an RBAC process). Goal: stay between 5 and 15 of these, always. See "The cycle" below.

**Path 2 — Curated adoption, by audited fit.** For general engineering-practice content (testing discipline, debugging, CI/CD, secret scanning, architecture review) that didn't originate inside a Wibi project but closes a **confirmed, current** gap in one. Sourced from `Wibi/backlogs/skills-radar.md` (the standing research log of external skills, refreshed periodically). See "The curated-adoption bar" below. No count ceiling here — the bar is fit, not scarcity — but every entry is dated and re-justified at the next skill-radar pass, not installed once and forgotten.

Both paths produce the same shape (`skills/<name>/SKILL.md`, same naming rules) and are indistinguishable to whoever consumes Oficina. The difference is only in *how a candidate earns its place* — keep the provenance note (source repo, date, one-line why) inside each curated skill's `SKILL.md` so a future audit can tell which path it came from without asking.

## The cycle (Path 1 — runs after every relevant project/delivery)

```
work → notice repetition → generalize → record → use → refine
```

### 1. Notice the repetition

The trigger for creating/updating a skill is always the same: **"I have explained this to the agent (or to myself) at least twice."** Signals:

- You pasted the same prompt fragment in two different projects
- The agent made the same mistake twice and you corrected it the same way
- A technical decision from one project applied unchanged to the next

Once = a case. Twice = a pattern. Three times without a skill = waste.

### 2. Generalize before recording

What gets in is the **pattern**, never the case:

- ❌ Client names, contract hours, colleague names, commercial details
- ❌ "In project X we did Y" — that's history, not instruction
- ✅ The rule, the why in one sentence, the minimal code example, the known traps

Quick test: *could someone outside the company use this skill without additional context?* If not, generalize further.

### 3. Record in the right shape

**Becomes a skill** when it is a workflow with steps, decisions and traps (e.g. designing RBAC).
**Becomes a rule** when it is non-negotiable and short, something that applies to every interaction (e.g. "workspaceId never comes from the body").
**Becomes a command** when it is a skill you trigger frequently with a parameter (e.g. `/oficina:crud tasks`).
**Becomes nothing** when it only happened once — note it in a personal draft and wait for the second occurrence.

Naming conventions (do not deviate):

| Item | Format | Example |
|---|---|---|
| Skill folder | `kebab-case`, noun-pattern | `rbac-design` |
| Skill file | always `SKILL.md` | — |
| Frontmatter | `name` = folder name; `description` = what it does + WHEN to use it (be "pushy" about the when — it is the triggering mechanism) | — |
| Rule | `kebab-case.md`, topic | `security-baseline.md` |
| Command | `kebab-case.md`, verb | `crud.md` |

Skill anatomy (limits that work):

- `SKILL.md` under 500 lines; ideally 60–150
- If it grows, split supporting material into `references/` inside the skill folder
- The frontmatter description carries ALL of the "when to use" — the body is only the "how"

### 4. Use and refine

A skill nobody triggers in 2–3 months is a candidate for removal or for a rewritten `description` (the problem is usually the trigger, not the content). A 30-minute quarterly review settles it: what triggered? what went wrong? what was missing?

## The curated-adoption bar (Path 2)

A candidate from `skills-radar.md` earns a place in Oficina only when **both** are true:

1. **Content audit passed.** The real `SKILL.md` was read in full (not the one-line description from a catalog), and any bundled script it runs was read too — no vendor lock-in pushed into "neutral" examples, no unrequested tool-calling instructions, no network/exec/eval in a bundled script that shouldn't need one. A large, popular source repo (thousands of stars) earns *zero* extra trust by association — audit the individual skill anyway.
2. **Confirmed, current fit.** It closes a gap that's real *today* in a tracked Wibi repo or in how Oficina itself is used — not "would be nice if we ever needed X." Point at the specific confirmed gap (a missing CI workflow, a documented past secret leak, a real RAG pipeline already in production) when recording the decision. A generically well-written skill with no confirmed current target stays in `skills-radar.md`, unchecked, until one appears.

Re-run this bar at every skill-radar pass, not just on first install: a skill that passed a year ago might no longer fit the project's current stage (stack changed, gap closed, a better-maintained alternative surfaced) — that's a removal, the same as an unused Path-1 skill.

## What Oficina must NEVER become

- A collection of skills for languages you don't use
- A mirror of another harness ("ECC has it, so I need it") — Path 2 exists precisely to keep this distinct: the bar is a confirmed current gap, never "it looked good elsewhere"
- A dump of client context (that lives in each project's private `CLAUDE.md`)
- A repository with a complex installer — if `cp -r` doesn't cut it, it got too big

## Public × private split

| Goes in Oficina (public) | Stays in the project (private) |
|---|---|
| CRUD pattern, schema conventions | The client's real schema |
| RBAC design process | The client's permission matrix |
| Task breakdown format | The contract's tasks and hours |
| Client doc style | The client's document |
| Philosophy and security rules | Credentials, URLs, names |
