---
description: Runs a read-only supply-chain risk audit (Trail of Bits skill) against a target project's dependencies — never installs, builds, or executes the audited project.
argument-hint: "[project-path]"
---

Audit **$ARGUMENTS** (path to another project on disk; current directory if omitted).

Requires the `supply-chain-risk-auditor` plugin (`trailofbits/skills`) installed in this Claude Code instance — `claude plugin marketplace add trailofbits/skills` then `claude plugin install supply-chain-risk-auditor@trailofbits` (the README's `/plugin install trailofbits/skills/plugins/supply-chain-risk-auditor` shorthand did not resolve on CLI 2.1.148 — verified 2026-08-31) — and `uv` on PATH. Authenticated `gh` strongly recommended: unauthenticated GitHub calls cap at 60/hour and the collector makes several per dependency.

1. Confirm the plugin is installed. If not, stop and tell the user to install it — this command orchestrates the existing skill, it never reimplements the scan.
2. Run it against $ARGUMENTS:
   ```
   uv run collect.py <path-to-$ARGUMENTS> --json findings.json
   uv run render.py findings.json --out report.md
   ```
   or, if $ARGUMENTS is the current project, trigger it conversationally with "audit this project's dependencies".
3. If $ARGUMENTS has a `yarn.lock`, also run `osv-scanner scan source --lockfile=<path-to-$ARGUMENTS>/yarn.lock --format markdown` — step 2 never reads it (see gap below), so this is not optional on any Wibi frontend. Verified twice in production (2026-08-31, `dream-book-app` and `dream-book-admin`): both runs surfaced real, severity ≥7 advisories against the *actual resolved* version of a direct, production dependency (`axios`) that step 2 had reported clean because it could only check `axios`'s latest release, not what `yarn.lock` actually pins. Install once: download `osv-scanner_windows_amd64.exe` (or the matching platform asset) from `google/osv-scanner` releases.
4. Read the coverage table in `report.md` before trusting any verdict — the tool marks what it couldn't measure as unassessable, never as clean. Cross-check any direct dependency the osv-scanner pass flagged against step 2's table — a "none known" there can mean "checked against the wrong version", not "safe".

**Known coverage gaps — check these before treating a "clean" result as complete:**

- **Lockfile**: only `package-lock.json`/`npm-shrinkwrap.json`, `uv.lock`, and Go 1.17+ `go.mod` feed the full transitive advisory sweep. `yarn.lock`, `pnpm-lock.yaml`, `poetry.lock` are not read. Wibi's frontend stack runs on yarn — on `dream-book-admin`/`dream-book-app`/`dream-book-site` expect direct-dependency coverage only; the transitive tree reports unassessable, not clean. **Closed by step 3 above**, not just noted: don't skip it.
- **Native/Expo surface is entirely out of scope**: the tool reads npm manifests (registry metadata, publisher ACL, install scripts, upstream repo status). It has no visibility into native iOS/Android permissions pulled in by Expo config plugins, nor into anything resolved outside the public registry (workspace, git, vendored deps) — those come back unassessable.
- **Never runs the project**: whether pinned versions actually build/import cleanly is out of scope — this complements CI, it doesn't replace it.

**Example — Dreambook (dream-book-app):**

```
uv run collect.py ../dream-book-app --json findings.json
uv run render.py findings.json --out report.md
```

Expect direct-dependency coverage (React Native, Expo SDK packages, Firebase, Sentry, etc. as pinned in `package.json`) with the transitive tree marked unassessable — that's the yarn.lock gap above, not a bug.

**After the audit:** review `report.md`, then run `/oficina:fechar-sessao` **inside the audited project** (needs that project's own `AGENTS.md` from `/oficina:init`) to refresh Estado Atual with a factual summary — counts by severity, what was flagged. Never paste the raw `findings.json`/`report.md` into `AGENTS.md` or memory.
