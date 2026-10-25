# Idle / incremental economy

Reference for section 4 of the GDD. Use as vocabulary and sanity checks, not as numbers to copy. Real values come from the game's code or the owner.

## Core relation
Cost grows geometrically, output grows (at best) linearly per unit bought.

- Cost of the n-th unit: `cost(n) = base * growth^n`. Typical growth: 1.07 to 1.15 per purchase. Below 1.05 the curve is flat (no decisions); above 1.20 it stalls fast.
- Output: `production = units * perUnit * multipliers`.
- **Time to afford the next unit** = `cost(n) / income`. This is the pacing knob. Target it explicitly (seconds early, minutes mid, hours late) instead of tuning numbers by feel.

## Checks
1. **First upgrade** reachable within the first 30-60 seconds. If not, the first session has no hook.
2. **Each tier of content** should feel ~2-5x slower than the previous, not 100x. Jumps in time-to-next break the loop.
3. **Dead choices**: if one upgrade dominates in every state, the others are not decisions. List upgrades by payback time (`cost / extraIncomePerSecond`) at 3 points of the game; if the order never changes, there is no choice.
4. **Multiplier stacking**: additive within a group, multiplicative between groups. Uncapped multiplicative stacking breaks late game; name the cap or the sink.
5. **Sinks**: every resource that only goes up needs a place to be spent or it becomes noise.
6. **Prestige/reset**: the reset must pay back in under ~one session after the first run, and the second run must be visibly faster than the first. Reward formula usually `floor(sqrt(total/threshold))` or `log`-based; avoid linear (forces one optimal reset moment).
7. **Offline progress**: cap hours (e.g. 8-12) and apply an efficiency factor (50-100%). Uncapped offline makes "leave it a week" the best strategy.
8. **Numbers**: plan the display (K, M, B, scientific) before the economy outgrows a 64-bit float. Past ~1e15 use a big-number library or log scale.

## For action-idle (auto-fight) games
Where the player's power is gear/skills and the loop is a timed fight:
- Define **power curve vs enemy curve** per zone; the intended win rate at the intended power should be written down (e.g. "an average build clears zone N at 60-80%").
- A **difficulty wall** is fine if the owner chose it and the way past (farm a prior zone, change build) exists and is not boring. A wall with no way past is a bug.
- **Risk/reward options** (extract vs go deeper) need a visible price of failure; the GDD states what is lost on a defeat.
- Loot: rarity tiers, upgrade/refine ceilings and what sink absorbs duplicates.
- Prefer reading an existing pace probe or test over running a new simulation (see skill rules).

## What to ask the owner (if the code does not answer)
- How long should the first session last, and what should the player own at the end?
- What is the long-term goal that keeps a player after the first week?
- What should be impossible to do (farm one spot forever, buy everything)?
