# Reviewing a film: what reads as AI slop and how to check it

Read before planning a promo, a launch film, an ad or any motion piece meant to sell, and again on the first
render. Slop is not a style; it is what comes out when no decision was made. Every item below is fine *if you
chose it for a reason you can say in one sentence about this brand*. Arriving there by default is the fault.

## Never ship (delete the element; do not argue for it)

1. **Page chrome:** a name in a corner, tracked-caps labels, counters ("02 / SPEAK"), timecodes, BPM or fps
   text, progress bars, corner brackets, scene labels.
2. **Slide layouts:** a held left-aligned headline, a kicker above a headline, title then content, "headline left, device right".
3. **Generic UI as proof:** a rounded card with a status dot and "label: value", a "Good morning" card, skeleton bars,
   invented names or numbers where real ones exist.
4. **The first association of the name** (a rocket for "launch", a shield for security, stars for a star-sounding name).
5. **Invented proof:** made-up stats, a stat slide (big centred number over a small label), stat walls.
6. **Slogan copy:** three one-word sentences, "Not just X. It's Y.", "Unlock", "Meet X", "the future of".
7. **The "designed" house style as a habit:** a giant cropped word, texture inside letters, a colour flood or
   circle wipe between every beat, a dot that becomes the logo, an "X becomes Y becomes the logo" chain, a headline typed with a caret.
8. **A flat colour per scene, or a small card on an empty void.**
9. **A pinned object** at the same coordinates through three or more shots.
10. **A website-footer ending:** logo + tagline + button + URL, or any end card held longer than 1.4 s.
11. **Self-certifying:** saying "verified" without looking at the render and quoting numbers.

Slide test: cover all the text on the contact sheet. If more than half the frames are "a flat colour with a card
or a block on it", it is a slide deck. Fix the picture, not the type.

## Craft laws (measured on professional work)

1. **Every beat buys one belief.** Write "This beat makes the viewer believe ___", or cut it. At most a quarter of the beats are "the point".
2. **Show it, then say it.** A claim in type is followed by a hard cut to the product doing it: real UI, real text, one specific case.
3. **Shots hand off.** The last frame of one beat is the first frame of the next (the same object in the same pose, or a transition that starts in A and ends in B).
4. **Cut on motion, not on rest.** Scenes start already moving. End in motion or on a designed stillness, not a fade to black by default.
5. **Land decelerates, leave accelerates.** Most of the travel in the first 4-8 frames, then a long tail, no bounce. Median move ~10 frames (0.33 s). At most one visible spring per film.
6. **Almost nothing fades.** Things arrive by moving, cutting, unmasking or coming into focus. Fades are for single objects, not between scenes.
7. **Arrive from oversize.** Logos come in from ~3.5x, a cursor from 2-5x, and nothing grows from zero. Spend big scale once; endings usually get smaller.
8. **No dead frame.** A hold keeps one living thing (drift, light, a breath of sound). A deliberate 0.6-1.5 s pause before a payoff is good when it has a reason.
9. **One system per film:** one frame clock, one blur grammar, the brand's own type, one accent colour with one meaning.
10. **One focal point per frame** (at most 3), inside a built world: ground + light + depth or texture. Empty only when the emptiness does a job.
11. **Words move at speech rhythm:** whole words 2-12 frames apart (2-4 fast hook, 4-6 headline, 8-12 voice-led). Letter-by-letter only inside the product's own input field.
12. **Demos are physical:** the cursor stops before it clicks, the press squashes 2-3 frames, and the target answers a frame later. Counters land on a round value for a claim and an exact value for data.

Type: headlines at 7-11 % of frame height, supporting text at 5-7 %, a hero number at 22-29 % (used once); weight 400-550; tracking -1.5 % to -5 % at display sizes; sentence case.
Timing: hooks 3-6 s, proofs 3-7 s of changing picture, CTA 2-3.5 s and at most 25 % of the film, end hold 0.6-1.4 s, cuts every 0.3-2.3 s.
Copy: write it like the brand talks, then cut half; ~2.5-3 words/s of voice; on-screen words land 0-2 frames before they are heard.

## Sound

- No loop at one flat level for the whole piece. The music changes at the turn and drops 6-10 dB while the viewer reads.
- One to three hand-picked hits (the click, the name, the turn), not a hit on every cut.
- Silence before the biggest hit (clear 8-15 dB). The first big sound is tied to something visible.
- The score covers the whole cut, with no digital-silence tail after a trim.

## Gates on the render (fail = fix, never justify)

| Gate | Pass |
|---|---|
| Render exists | decodes, not black, picture moves, length as planned, audio present if planned |
| Proof readable | UI text at least 4 % of height; the proof fragment fills more than half the width or is cropped by the frame |
| No empty frame | no run of more than 3 consecutive flat frames |
| Short end | final unchanged hold of 0.6-1.4 s; last shot at most 25 % of the film |
| One hero | two panels only if one is at least twice the other's area, or the camera moves between them |
| No page chrome | none of item 1 of "Never ship" |

Check them on a contact sheet (`ffmpeg -i film.mp4 -vf "fps=2,scale=480:-1,tile=6x5" sheet.png`) and stills at
each beat. Describe every frame of the sheet in one sentence before judging. Write what you checked and the
numbers in the delivery note; never call your own film good.

## The plan check (before building)

- Which choices did I *decide* and which did I *reach for*? One sentence each for shape, ground, type, ending, sound, transitions.
- Swap the logo for a competitor's: is it the same film? Then the idea is not this brand's.
- What was my first idea, and did I look past it?
- Am I showing everything? What is the one thing?
- Is the ground dark because the brand is dark, or because dark "feels premium"?
- With the text covered, does every beat still show a picture?

## Where this applies

Promo and ad pieces (ads, product spots, channel trailers) take this file in full. Fast news Shorts
and live cuts keep the captions and real footage and take the sound, timing and "never ship" items, since their
proof is the clip itself. A style chosen on purpose from [styles.md](styles.md) (for example HUD) overrides the
matching item here; say so in the note.

## Source

Rules condensed and rewritten in our words from Tejashmakwana/motionmaxxing (Apache-2.0, read 2026-11-20:
`SKILL.md`, `references/slop.md`). No code, runtime, taste files or vendored libraries were copied; the measured
numbers are cited as published there.
