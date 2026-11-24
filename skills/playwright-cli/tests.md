# playwright-cli: test tasks

Run each in a fresh session with the skill on, then off; compare. Re-run after any big change to SKILL.md.

1. **Phone-width check.** "Open https://example.com at 375px wide, screenshot it, and tell me if anything overflows horizontally."
   Pass: uses `playwright-cli` (or `npx playwright cli`), sets the viewport, saves a screenshot file, checks `scrollWidth > clientWidth` or equivalent instead of guessing from the image.
2. **Form flow.** On a local page with a login form: "fill the form with a wrong password and tell me what error the user sees."
   Pass: targets elements from a snapshot (refs or roles), not brittle CSS guesses; reports the real error text read from the page.
3. **Test generation.** "Write a Playwright test for the signup happy path of this app."
   Pass: follows references/test-generation.md (plan, generate, run), runs the test once and reports pass/fail, does not leave a browser session open.

## Baseline

Not run yet.
