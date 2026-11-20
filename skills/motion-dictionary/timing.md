# Timing, easing and choreography tables

Read when picking a duration, a curve or an order for several elements. The dictionary in SKILL.md names the
effect; this file sizes it. Values are starting points, then check the render.

## Duration by element (UI and motion graphics)

| Element | Duration |
|---|---|
| Micro-feedback, tooltip | 80-120 ms |
| Button, toggle | 120-180 ms |
| Icon change | 150-250 ms |
| Card in/out | 200-350 ms |
| Modal | 300-400 ms |
| Page or scene change | 400-600 ms |
| Dramatic reveal | 600-1200 ms |
| Ambient loop | 2-20 s |

- **Distance scales time:** 50 px = 0.8x, 100 px = 1x, 200 px = 1.3x, 300 px = 1.5x, full screen = 1.8-2x.
- **Exit = 65-75 % of the entrance.** Entrance duration is never shorter than the exit.
- **Personality sets the tempo** (quick / standard / slow): energetic 100/180/300 ms, playful 150/250/400,
  corporate 200/300/450, premium 350/500/800. Pick one per piece and keep it.

## Easing direction

Entrance = ease-out. Exit = ease-in. Move on screen = ease-in-out. Loop = sine. Rotation and progress = linear.
Linear on a spatial move that starts or stops on screen is a critical fault.

| Name | cubic-bezier | Use |
|---|---|---|
| Standard (Material 3) | 0.2, 0, 0, 1 | default on-screen move, snappy UI |
| Emphasized (Material 3) | 0.05, 0.7, 0.1, 1 | hero entrance |
| Accelerate (Material 3) | 0.3, 0, 1, 1 | exits |
| Gentle float | 0.4, 0, 0.2, 1 | ambient, elegant |
| Bounce settle | 0.175, 0.885, 0.32, 1.275 | playful landing |
| Elastic snap | 0.68, -0.55, 0.265, 1.55 | one dramatic beat |

Springs (stiffness / damping): stiff 400+ / 25-30, standard 250-350 / 18-24, bouncy 150-250 / 10-15, gentle 100-150 / 20-25.

**Overshoot budget:** error 0 %, premium 0 %, feedback 2-5 %, success 5-10 %, celebration 15-25 %.

**Material feel** (duration scale / overshoot): metal 1.2x / 0, rubber 0.8x / 15-25 %, water 1.5x / 5 %,
paper card 1x / 3-5 %, smoke 2x / 0, glass 0.9x / 0.

## Emotion to motion

| Emotion | Path | Curve | Duration |
|---|---|---|---|
| Joy, play | arcs, upward | outBack | 200-400 ms |
| Calm | gentle curves | sine in-out | 500-1000 ms |
| Urgency, alert | straight, sharp | ease-out | 100-200 ms |
| Weight, sadness | slow, downward | cubic in-out | 600-1200 ms |
| Surprise, impact | radial outward | outExpo | 150-300 ms |
| Elegance | long arcs | 0.4, 0, 0.2, 1 | 400-700 ms |
| Confidence | straight, horizontal | ease-out | 200-400 ms |

Path meaning: up = growth, down = settling, horizontal = progress, radial out = release, radial in = focus.
Success transitions *to* green (does not start green). Error flashes red, then settles.

## Choreography (several elements)

- **Lead with the hero.** It gets the largest move and the strongest curve; supporting elements are smaller in every dimension.
- **One origin.** Everything in a group enters from the same side or point. Mixed directions read as chaos.
- **Counter-motion.** Hero enters left, background drifts right at 20-30 % of the speed; hero lifts, its shadow spreads.
- **Depth by speed.** Foreground 1x, midground 0.5x, background 0.2x.
- **Setup 20-30 %, action 30-40 %, resolution 30-40 %** of a sequence, then 100-200 ms of stillness before new motion.
- **The 1/3 rules.** No unbroken move longer than a third of the frame (add a keyframe, an arc or a speed change).
  With 3+ elements, at most a third moving at once: element 1 settles as element 3 starts.
- **Stagger budget.** Micro 20-40 ms, standard 50-100 ms, dramatic 100-200 ms; the whole cascade under ~500 ms for UI.
  (Video titles and word reveals may run longer: they follow speech, see SKILL.md "Word reveal".)
  Same curve for every staggered item; vary only the start. The last one may overshoot slightly as punctuation.
- **Shared trigger.** Elements reacting to one event all start within 50 ms; they may land at different times.

## Checklist for a finished piece

Critical: linear on spatial moves; an important state shown by opacity alone; a move longer than 1/3 of the frame;
no primary layer; stagger over budget; animating layout properties (width, top) instead of transform.
High: wrong direction of easing; duration that does not match the table; mixed personalities; no follow-through
(children 50-150 ms after the parent); no reduced-motion alternative on a web page.
Still check: readable at full speed, at most ~20 animated elements per screen, critical info never only in motion,
the same interaction always moves the same way, and it still feels right on the 100th view.

## Source

Tables condensed and rewritten from LottieFiles/motion-design-skill (MIT, read 2026-11-20:
`reference/timing-easing-tables.md`, `reference/quality-checklist.md`, `director/choreography.md`,
`director/emotion-mapping.md`). Bezier values are the published Material 3 tokens and common community curves.
