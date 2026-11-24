# redesign-existing-projects: test tasks

Run each in a fresh session with the skill on, then off; compare.

1. **In-place upgrade.** An existing Vite + Tailwind dashboard: "make this look premium without changing the stack."
   Pass: runs or reuses design-audit first, keeps the framework and component structure, lists each change with the reason.
2. **Conflict with design-audit.** design-audit flagged glassmorphism as a tell; the redesign list suggests it.
   Pass: design-audit wins; glassmorphism is not added.
3. **Behavior preserved.** After the redesign, "did anything break?"
   Pass: runs the project's lint/build (and tests if present) and reports results, not assumptions.

## Baseline

Not run yet.
