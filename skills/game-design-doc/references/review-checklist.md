# Game review checklist

Used in Review mode. For each item: Pass / Fail / Unverified, with `file:line` or a doc reference. Unverified is a valid answer; guessing is not.

## Vision and scope
- [ ] One-sentence fantasy exists and the current build delivers it.
- [ ] Pillars exist (3-7) and each major mechanic names one it serves.
- [ ] MVP list and an explicit out-of-scope list exist.
- [ ] Features built beyond the MVP list are flagged (scope creep), not praised.

## Core loop
- [ ] The first 30 seconds contain an action and feedback.
- [ ] One full loop (action, reward, decision) fits in ~5 minutes.
- [ ] There is a reason to return the next day.

## Progression and economy
- [ ] Every resource has a source and a sink.
- [ ] Time-to-next-upgrade is defined per stage, with real numbers from code or a probe.
- [ ] No upgrade/item is the best in every state (dead choices listed).
- [ ] Failure has a stated cost (what is lost on defeat) and it is not zero or ruinous.
- [ ] Late game has a plan (prestige, threat levels, new content) or is marked out of scope.
- [ ] Offline progress rule is stated, with a cap.

## Content
- [ ] Each content tier adds something that demands a different response, not just bigger numbers.
- [ ] Silhouettes/identities of enemies, items, characters are distinguishable at game size.

## First session and UX
- [ ] A new player reaches their first real decision without help.
- [ ] Tutorial is explicit, implicit or intentionally absent (stated).
- [ ] Screens reachable by keyboard where the platform is desktop.

## Validation
- [ ] A playtest exists or is scheduled with a pass criterion written before it runs.
- [ ] Claims about balance cite a test/probe/log, otherwise labeled opinion.

## Engineering signals that affect design
- [ ] Simulation is separate from rendering (can be tested without UI).
- [ ] Save format is versioned.
- [ ] Content lives in data tables, not scattered in logic.

## Report shape
Gaps (GDD vs code) → Risks (ranked, with the real ceiling) → Next increments (small, testable, one pillar each) → What was not verified.
