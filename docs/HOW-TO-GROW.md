# How to grow Oficina

The value of this repository is not in what it holds today — it is in the process that decides what gets in. ECC reached 260+ skills because it covers 12 languages and hundreds of contributors. Oficina covers **one stack and one way of working**; the goal is to stay between 5 and 15 skills, always.

## The cycle (runs after every relevant project/delivery)

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

## What Oficina must NEVER become

- A collection of skills for languages you don't use
- A mirror of another harness ("ECC has it, so I need it")
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
