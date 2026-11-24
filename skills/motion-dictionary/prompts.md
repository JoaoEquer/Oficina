# Prompt templates

Five fill-in templates for a whole motion video. Each is a rewrite of a common one-paragraph prompt
("make a 30 s app launch, minimal black and white, word-by-word reveals, echo trail..."), re-cut into
blocks with dictionary names, durations and an order of work. Replace every `[FIELD]`; never send one
with placeholders left.

## The block structure

Every template uses the same blocks, in this order. A one-line prompt can work, but these blocks are
the parts that decide whether the result can be checked:

```
<inputs>     what the user must supply; ask for anything missing before building
<direction>  look: canvas, palette, type, motion character, banned list
<structure>  timed beats: t, what appears, dictionary effect + duration + easing, sound
<build>      tech contract: one HTML file, size, fps, seek(t) pure function of time, how to render
<gotchas>    what tends to go wrong in this format
<start>      first step: ask for inputs, show the beat table, render 4-6 stills, wait for OK
```

Shared `<build>` block (paste into any template):

```
<build>
One self-contained index.html, [1920x1080 | 1080x1920], 30 or 60 fps.
window.__duration (ms) and window.__seek(tMs) draw the exact frame for tMs: a pure function of
time. No CSS transitions, no timers, no requestAnimationFrame driving state, no Math.random
(seeded noise only). If using GSAP: one paused timeline, seek it inside __seek (tl.seek(t)).
Render frame by frame with headless Chrome + ffmpeg. Motion blur on fast moves = render subframes
and average them, not a CSS blur.
</build>
```

Shared banned list (paste into `<direction>`, edit per brand):

```
Banned: crossfades as the default transition (design each transition), particle bursts, shockwave
rings, camera shake, RGB split, lens flares, neon glow, grid floors, flashing backgrounds, bouncy
easing on everything, generic purple/blue gradients, text in the corners, any hold longer than 1 s
with nothing moving, invented UI or metrics (use real captures and real numbers).
```

Shared `<start>` block:

```
<start>
1. List any missing input and ask for it. 2. Show the beat table (t ms | appears | effect + duration +
easing | sound) and wait for my OK. 3. Render 4-6 stills at key beats and show them. 4. Only then the
full render; report duration, resolution and loudness measured.
</start>
```

## 01 - App presentation (minimal, 30 s, 16:9)

```
<inputs> Brand [NAME] | Logo [LOGO file] | Tagline [TAGLINE] | Five lines [LINE 1..5] |
Real screenshots or screen recording of the app [FILES] </inputs>
<direction> Black background, white type, one accent [COLOR] at most. Large headlines.
UI shown as real screens inside one container that morphs between states (never cut).
Fast transitions with echo trail (4 copies, 0.04 s) instead of hard cuts. [BANNED LIST] </direction>
<structure>
0.0 s  logo: scale up 0.6 s outExpo from 0.2
2.0 s  LINE 1: word reveal, 0.18 s between words, 0.3 s each, outExpo
5.0 s  screen for LINE 1: container morph 0.6 s inOutCubic; LINE 1 text swap to LINE 2 (0.35 s)
...    one line + one screen per ~5 s, transitions with echo trail
24.0 s elements converge into the logo: follow-through, lag 0.05 s per element
27.0 s logo + tagline: tagline word reveal; hold with a slow 2 % scale drift (never static)
</structure>
[BUILD] [START]
```

## 02 - Motion showreel that teaches principles (15 s, 16:9)

```
<inputs> Opening line [LINE] | Four words [WORD 1..4] | Role [ROLE] / Name [NAME] | CTA [CTA] </inputs>
<direction> Background alternating light grey and graphite per scene. Heavy condensed type.
Accent blue and red. Hand-written annotations with small arrows naming the principle on screen.
[BANNED LIST] </direction>
<structure>
0.0 s  ball bounces with echo trail, squash & stretch on each contact (30 %, 0.25 s);
       annotations "stretch" / "squash" draw-on 0.5 s
3.0 s  ball lands as the full stop of LINE (slide in per word, stagger 0.1 s)
5.0 s  each WORD animated by its meaning (e.g. "fall" drops with bounce, "grow" scales up)
9.0 s  easing graph: linear vs ease in-out, a dot runs each curve, draw-on of the curve 0.8 s
11.0 s grid of dots settles with follow-through (lag 0.05 s per dot); one dot stays accent
12.5 s dial fills to 100 % with anticipation (pull 15 %), count-up on the label
14.0 s ROLE / NAME, punch zoom 0.18 s; hand-written CTA draw-on
</structure>
[BUILD] [START]
```

## 03 - App Store style launch (30 s, 16:9)

```
<inputs> App [NAME] | Logo [LOGO] | Tagline [TAGLINE] | Keyword color [COLOR] | Five lines [LINE 1..5] |
Real app screens for each line [FILES] </inputs>
<direction> Dark background with one soft colored light behind the phone. A phone frame floating
(slow ease in-out drift, 4 s period), the real screen inside. Headline with the keyword in [COLOR].
Transitions with blur in / blur out (0.5 s, 24 px). [BANNED LIST] </direction>
<structure>
per line, ~5 s: headline slide in 0.4 s outExpo; keyword text swap if it changes;
punch zoom into the phone screen 0.18 s to 1.35x on the feature; 2-3 cards pop in from the phone
(0.45 s outBack, stagger 0.12 s); blur out to the next line
25.0 s phones fan out (follow-through, lag 0.06 s) then converge to logo + tagline
</structure>
<gotchas> The screen must be a real capture. A 3D phone is a frame, not invented UI. </gotchas>
[BUILD] [START]
```

## 04 - Product spot (15 s, 16:9)

```
<inputs> Product [PRODUCT + images or 3D model] | Brand [NAME] | Logo [LOGO] | Tagline [TAGLINE] |
Lines [LINE 1..3] | Benefits [BENEFIT 1, 2] | Closing words [WORD 1..3] | Color [COLOR] </inputs>
<direction> Two colors only: [COLOR] and near-black. Extra bold uppercase type. Product as
protagonist, slow rotation (linear, continuous). Fast transitions with motion blur (subframes) and
echo trail. [BANNED LIST] </direction>
<structure>
0.0 s  a dot pops in and expands into the scene (iris open 0.6 s from the dot)
1.0 s  LINE 1 word reveal, outExpo
3.0 s  close-up on product detail: punch zoom 0.18 s, mask reveal of the next detail
5.5 s  LINE 2 with the product rotating
8.0 s  BENEFIT 1 and 2 as cards that pop in around the product (stagger 0.15 s)
11.0 s LINE 3; WORD 1..3 one per beat, hard cuts on the beat with a hit sound
13.5 s logo + tagline, scale up 0.6 s outExpo
</structure>
[BUILD] [START]
```

## 05 - Personal intro (15 s, 16:9)

```
<inputs> Name [NAME] | Role [ROLE] | Photo [PHOTO] | Handle [@] | Impact line [LINE] |
Highlights with real numbers [HIGHLIGHT 1..3] | CTA [CTA] | Color [COLOR] </inputs>
<direction> Black background alternating with [COLOR]. Bold sans; one word per line in a coloured
italic serif. Transitions with wipes and iris. Numbers with count-up. [BANNED LIST] </direction>
<structure>
0.0 s  a line draws on and morphs into a pill that becomes the "O" (or first round letter) of NAME
2.0 s  photo in a circle (iris open 0.6 s), text on a circular path rotating (linear)
4.0 s  LINE, word reveal; the italic word text swaps in last
6.5 s  HIGHLIGHT 1..3, wipe between them (0.5 s), each with a bar grow or count-up (1.2 s outExpo)
12.0 s photo + NAME + CTA; a "Follow" button pressed by a cursor (anticipation 15 %, pop in feedback)
</structure>
[BUILD] [START]
```
