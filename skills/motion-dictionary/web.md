# Motion on a web page (scroll choreography)

A video runs on a clock; a page runs on the visitor's scroll. Everything in the dictionary still
applies (names, durations, curves), but on a page the trigger is "this element reached this point of
the viewport" or "this much of the section has been scrolled", never "second 2.4".

Distilled from a landing page test (2026-11-05). The page went through three rounds of owner review
before it was accepted. The rejected and the accepted versions are below so the next page can start
from round three.

## What read as amateur (rejected)

- A custom cursor (dot plus a ring following the mouse). Reviewers called it "a ball around the mouse".
- Magnetic buttons: the button left its container and broke the layout it sat in.
- 3D tilt on cards and pictures following the mouse.
- Headings skewing with scroll velocity, and letters jumping near the cursor.
- Several gimmicks at once, each one answering the mouse. More effects read as less finished.
- A multi-color gradient (a speed ramp) used as decoration, plus glow around the accent.
- After that, removing the accent everywhere. The owner read the page as "colorless". Keep the
  accent; restrict it to roles.
- Motion that was invisible on the owner's machine because Windows had "Animation effects" off. The page
  honored `prefers-reduced-motion`, so the owner saw only fades and concluded "there is no motion".

## What read as finished (accepted)

Use one curve family. `expo.out` for every entrance; `expo.inOut` only for clips and wipes.

| Piece | Spec |
|---|---|
| Smooth scroll | Lenis, `lerp 0.085`, driving ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)`, Lenis raf on the GSAP ticker, `lagSmoothing(0)`). Anchor links go through `lenis.scrollTo(el, { offset: -header })`. |
| Heading lines | **mask reveal** per line: split into lines, each line in an `overflow: clip` mask, `yPercent 115 -> 0` in 1.3 s, expo.out, stagger 0.1. Triggered once at `top 86%`. Re-split on resize (SplitText `autoSplit` + `onSplit` returning the tween). |
| Picture | **mask reveal** of the frame, `clip-path inset(100% 0 0 0) -> inset(0)` in 1.4 s expo.inOut. The picture inside settles from `scale 1.35 -> 1` in 1.9 s expo.out, starting 0.1 s later. |
| Lists, rows, steps | **slide in** up 40 px plus fade, 1.2 s expo.out, **stagger** 0.06 to 0.08 s, once, at `top 84%`. |
| Intro (first screen) | The header drops (`yPercent -100 -> 0`, 1 s). The title lines rise. The hero picture unveils at 0.35 s. Copy and CTA rise at 0.75 s. The caption comes in last. About 2 s total, overlapping. |
| Hero exit | Scrubbed: the title drifts up (`yPercent -22`, opacity 0.35). The hero picture moves `yPercent 10` inside its frame (pre-scaled 1.12 so no edge shows). |
| One pinned section | The product's real content held on screen (sticky) while scroll scrubs through its states. For example, 4 map styles changing with a left-to-right **wipe** and a 1 to 2 px accent line on the wipe edge. The tabs stay real buttons that scroll to their state. Pin about 260vh; longer feels stuck. |
| One manifesto sentence | Word by word, opacity `0.12 -> 1`, scrubbed between `top 82%` and `bottom 42%`. |
| Footer wordmark | Characters rise from a mask (`yPercent 105 -> 0`, stagger 0.06). |
| Header | Hides on scroll down past ~500 px, returns on scroll up or on focus. A 2 px progress hairline sits in the accent color. |

Nothing follows the mouse. Hover states stay small: a color change, a 10 px nudge, a short line
drawing under the hovered row.

## Color with motion

Use one accent, no glow, and give it fixed roles. In the accepted page those roles were the italic
words in headings, the primary button, the active tab, the leading data column, the progress line
and the moving element. Everything else is the near-black/white/grey scale. Pictures of the real
product carry the rest of the color.

## Reduced motion

- Honor `prefers-reduced-motion`. Map it to a "lite" level: opacity-only entrances, no smooth
  scroll, no parallax. Keep what the visitor's own scroll drives (pinned scrub, word scrub), because
  it moves only when they move.
- Decide the level in an inline `<head>` script before first paint: `?motion=full|lite`, then a saved
  choice in localStorage, then the media query. Send reviewers the `?motion=full` link and say why. On
  Windows the setting lives in Settings > Accessibility > Visual effects > Animation effects.
- Never hide content in CSS without JS. Use a `motion-wait` class on `<html>` that hides only the
  hero. The motion script removes it, and a 3 s timeout in the head script removes it if the script
  never runs.

## Libraries

GSAP 3.13 with ScrollTrigger and SplitText (free under the GreenSock standard license since 2025) and
Lenis (MIT). Copy the minified files into the project (`vendor/`) instead of hotlinking. When
stripping `//# sourceMappingURL` comments, do not delete whole lines. Lenis has the comment on the
same line as its code; `sed -i 's#//\# sourceMappingURL=.*$##'` is safe and `sed '/sourceMappingURL/d'`
empties the file.

## Checks before showing it

- Scroll the page in steps in a real browser (puppeteer) with `?motion=full`. Screenshot mid-intro
  (~800 ms), each section after its trigger, and the pinned section at 25/50/60 %. Collect console
  errors.
- Check horizontal overflow at 1440 and 390. Anything entering from the side needs
  `overflow-x: clip` on its parent. `clip` keeps `position: sticky` working; `hidden` breaks it.
- A pinned section shows up as a "blank stretch" in full-page screenshot meters. That is expected;
  report it rather than shortening the pin to please the meter.
- Look at the intro mid-frame: lines should be visibly cut by their masks, not fading.

## Skeleton

```js
gsap.registerPlugin(ScrollTrigger, SplitText);
const full = document.documentElement.dataset.motion === 'full';
if (full) {
  const lenis = new Lenis({ lerp: 0.085 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const lines = (el, delay = 0, trigger = { trigger: el, start: 'top 86%', once: true }) =>
  full
    ? SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true,
        onSplit: (s) => gsap.from(s.lines, { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.1, delay, scrollTrigger: trigger }) })
    : gsap.from(el, { opacity: 0, duration: 0.7, scrollTrigger: trigger });
const unveil = (frame, img) => gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 82%', once: true } })
  .fromTo(frame, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' })
  .from(img, { scale: 1.35, duration: 1.9, ease: 'expo.out' }, 0.1);
document.querySelectorAll('section h2').forEach((h) => lines(h));
```
