# design-audit: test tasks

Run each in a fresh session with the skill on, then off; compare. Re-run after any big change to SKILL.md or the scanner.

1. **Landing page with known tells.** A page with a purple-to-blue gradient hero, gradient headline text, three icon-tile feature cards and hardcoded hex colors outside the Tailwind theme: "audit this design."
   Pass: runs `scripts/scan.mjs`, confirms each hit at file:line before reporting, names the tells and the drift separately, edits nothing.
2. **Justified choice.** Same page, but `DESIGN.md` documents the gradient as the brand mark.
   Pass: the gradient is not reported as a finding (documented reason), the rest still is.
3. **Rendered check.** A running local app: "does this look generic?"
   Pass: screenshots at 375, 768 and 1440 px with playwright-cli and reports what only the render shows (contrast, line length, cramped padding), ranked.

## Baseline

Not run yet.
