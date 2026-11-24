# Motion styles catalogue (15 styles with checkable signatures)

Read when the brief names a look ("estilo isométrico", "cara de HUD", "pixel art", "estilo PaperClip") or when
a piece needs a deliberate style instead of the generic default. Each style has the techniques that make it
recognisable; a result that misses them is "the generic version" of the style. Pair with the dictionary
(SKILL.md) for each move and with [timing.md](timing.md) for numbers.

How to brief a style: write **output** (size, fps, length), **route** (SVG, Canvas, WebGL, Three.js, Blender),
**seed** (the story by second: hook, build, climax, end frame; 3-6 hex colours; type mood; sound) and copy the
**signature** block below unchanged. The signature is what the result is judged against.

| # | Style | Good for |
|---|---|---|
| 1 | Flat vector | explainers, SaaS product videos |
| 2 | Line art | premium logo stings, clean reveals |
| 3 | Isometric 2.5D | "how it works" architecture, app feature demos |
| 4 | 3D render (C4D/Blender look) | product hero shots, high-end spots |
| 5 | Cel / line boil | hand-made accents over vector, mascot moments |
| 6 | Collage / cut-out | music, street culture, humour |
| 7 | Liquid | transitions, food/drink, energetic packaging |
| 8 | Shape morph | visual storytelling, "A becomes B" |
| 9 | Bauhaus geometric | beat-driven kinetic posters, music sync |
| 10 | Synthwave / VHS / Y2K | retro game content, neon/80s vibes |
| 11 | Aurora + glass | tech/AI launch videos (slow, translucent) |
| 12 | Variety captions (花字) | Shorts and stream cuts: reaction words |
| 13 | Sticker explainer (PaperClip) | long-form explainers, finance and knowledge videos |
| 14 | Pixel art | game content, mascots |
| 15 | Cyberpunk HUD / FUI | tech reviews, game edits |

## Signatures and key techniques

**1. Flat vector.** Flat colour blocks, geometric characters, little or no gradient, clean negative space, saturated brand palette.
- Overshoot is the soul: cubic-bezier(0.34, 1.56, 0.64, 1); entrance in three parts: anticipation, push, settle.
- Stagger 2-4 frames; only one subject moving at a time. ~10 % squash and stretch on moves. 30 fps.
- Transitions: shape wipe, or an element flying out and dragging the whole scene.

**2. Line art.** Constant thin line (2-4 px), one or two colours, lots of empty space, one continuous line growing.
- Draw-on with stroke-dashoffset; slow down at corners; inOut cubic-bezier(0.65, 0, 0.35, 1).
- One-stroke story: the tail of one shape is the start of the next. Line to fill: fill expands from the anchor along the same path. Round caps.

**3. Isometric 2.5D.** 30° projection, no vanishing point, miniature world, buildings growing, camera slides on rails.
- Face recipe: scaleY 86.6 % then skew ±30° then rotate ∓30°. Z order = screen y. Grid moves keep a 2:1 pixel slope.
- Growth: footprint lands, walls scaleY from 0, roof lands 2-3 frames later. Camera only pans; parallax 1 : 0.8 : 0.6.

**4. 3D render.** PBR materials, shallow depth of field, soft studio light, cloner arrays, soft-body collisions.
- Long-tail ease: 80 % of the travel in the first 20 % of the time, very slow finish, plus motion blur.
- Subsurface scattering for soft rubber + ambient occlusion + HDRI. 24/25 fps (film), unlike the 30 fps of 2D.

**5. Cel / line boil.** Lines that shimmer every few frames, animation on twos or threes, smear frames, hand-drawn FX, paper texture.
- On twos (12 fps of 24) by default, ones for fast action, threes for holds. Boil: displacement re-randomised every 2 frames, or 3-4 redrawn loops.
- Smear: the in-between of a fast move stretched 150-300 % for a single frame. Paper texture multiply 10-15 %.

**6. Collage / cut-out.** Photo cut-outs with a white edge, halftone, newspaper texture, surreal proportions, stop-motion stepping.
- 2-4 px white outline on cut-outs; puppet joints at shoulder, elbow, jaw; mouth by 2-3 replacement frames.
- Deliberate 6-12 fps with ±2 px jitter. Layers: paper, colour shapes, cut-outs, doodles/tape, grain.

**7. Liquid.** Wave-front wipes, stretch and drip, metaball merge, secondary droplets following, never a straight line.
- Metaball: blur 20 px+ then an alpha threshold (feColorMatrix). Neck stretch, break, both ends rebound 2-3 frames.
- cubic-bezier(0.22, 1, 0.36, 1): liquid is thrown, never moves at constant speed. Droplets lag 2-3 frames and squash on landing.

**8. Shape morph.** Continuous outline, bridge shapes, morph with move and rotation, squash at the turn.
- Equal vertex counts and matching first vertex. Complex A to B goes through a simple shape (A, circle, B), 8-12 frames each.
- 10-15 % squash plus slight rotation over the morph. Speed peaks mid-morph: cubic-bezier(0.7, 0, 0.3, 1). Use flubber on the web.

**9. Bauhaus geometric.** Circle, triangle, square on a strict grid; red, yellow, blue, black, white; rotations about centres; beat-driven.
- Every move is a whole number of grid modules and lands on a grid line. inOutQuad or linear, **no overshoot**.
- One action per beat (cut to the music grid from a beat tracker such as librosa). Alternate pivots: own centre, a corner, the frame centre.

**10. Synthwave / VHS / Y2K.** Neon glow, perspective grid horizon, scanlines and RGB split, chrome type, acid colours.
- Synthwave: scrolling one-point grid, layered sunset gradient, double glow (tight 4 px + wide 30 px at low opacity).
- VHS: RGB split 1-2 px, 2 px scanlines at 10 %, 1-2 random glitch frames per second, 4:3 rounded mask. Frame rate deliberately unstable.

**11. Aurora + glass.** Big blurred colour blobs drifting, frosted glass cards, 1 px highlight edge, close colours, slow breathing.
- 3-5 blobs blurred 80-150 px drifting on 20-40 s loops. Card: backdrop blur 20-40 px, 5-10 % white fill, 1 px white 30 % inner edge.
- 2-3 adjacent hues only; 3-5 % noise against banding. Near-linear or sine curves; text enters with opacity + 8 px only. Anything fast breaks it.

**12. Variety captions.** Rounded heavy type with multiple outlines, saturated clash + white edge + drop shadow, elastic pop with a sound, hand-drawn symbols.
- Three layers: fill, thick white stroke, coloured outer stroke or shadow. Pop scale 0 to 1.15 to 1.0 in ~8 frames, or letters bouncing 2 frames apart.
- Match the emotion: tilted hand type for sarcasm, burst frame for surprise, sweat drop for awkward. Land 2-3 frames *after* the spoken word. Long holds get a slight wiggle.

**13. Sticker explainer (PaperClip).** Photos cut out with a thick white edge as stickers, calm blue-grey or off-white ground, flat icons with exact charts, one huge canvas, camera pans and zooms.
- 8-12 px white outline unifies photos from different sources. Wide canvas; a camera layer moves between info points on long ease curves.
- Charts grow, numbers count up, paths draw on. Every narrated sentence brings a new visual element. 2-3 colours, monoline type.

**14. Pixel art.** Big hard pixels, 8-32 colour palette, 8-12 fps sprite loops, dithering, optional CRT.
- Nearest-neighbour scaling (`image-rendering: pixelated`). `steps()` timing, never smooth easing. Walk 6-8 frames, idle 2-4.
- Three parallax layers moving by whole pixels. CRT: scanlines, barrel distortion, phosphor glow.

**15. Cyberpunk HUD / FUI.** Cyan/orange neon wireframes, lock-on brackets, radar sweep, monospace data streams, hex grids, glow.
- Wireframes draw on with dashoffset, staggered by layer. Radar: rotating conic-gradient + blinking targets.
- Numbers flicker random for 3-5 frames, then land on the real value. Lock-on: corner brackets 1.4 to 1.0, fast out, slow in.
- Note: HUD chrome is a *style*, chosen on purpose. In a brand film it is page chrome and fails review ([review.md](review.md)).

## Review loop for a styled piece

After the first render, judge it as a harsh outside juror: contact sheet every 0.5 s, filmstrips around the
fastest move and the hero moment, full-resolution stills. Score 1-10 on style fidelity, concept (hook in the
first 0.5 s, a hero moment, a satisfying end frame), motion craft, design and type, finish, sound sync and
technical spec (5 = student, 7 = solid professional, 9 = award shortlist; first renders are usually 5-7).
Then list 5-10 fixes ordered by impact, each with timecode, what is wrong, why, and the exact fix (curve, frames,
px, colour). At least one fix must raise the wow factor. Apply, re-render, look again. Two rounds.

## Source

Styles, signatures and the review rubric condensed and translated from Vincentwei1021/mg-styles-15 (MIT, read
2026-11-20: `prompts/*.md` signature sections, `template.md`, `rubric.md`). The "good for" column is ours.
