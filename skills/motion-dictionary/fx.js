// fx.js - the motion dictionary as pure functions of time. Plain script, no modules, no dependencies:
//   <script src="fx.js"></script>  ->  window.FX
// Every effect is f(t, t0, opts) -> plain numbers/strings for that instant. No timers, no CSS transitions,
// no Math.random: any frame renders alone and identically (fits a window.__seek(tMs) renderer, Remotion's
// useCurrentFrame, or a hand-rolled requestAnimationFrame loop in a live page).
// Times are SECONDS. Distances are px. Defaults are the dictionary's defaults (see SKILL.md).
(function () {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const prog = (t, t0, d) => (d <= 0 ? (t >= t0 ? 1 : 0) : clamp((t - t0) / d));

  // ---- easings (x in 0..1) ------------------------------------------------------------------
  const ease = {
    linear: (x) => x,
    inCubic: (x) => x * x * x,
    outCubic: (x) => 1 - Math.pow(1 - x, 3),
    inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    outQuint: (x) => 1 - Math.pow(1 - x, 5),
    outExpo: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    inOutExpo: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2),
    // overshoot: s = how far past the target (1.70158 ~ 10 %, 2.5 ~ 18 %)
    outBack: (x, s = 1.70158) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2),
    outBounce: (x) => {
      const n = 7.5625, d = 2.75;
      if (x < 1 / d) return n * x * x;
      if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75;
      if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375;
      return n * (x -= 2.625 / d) * x + 0.984375;
    },
  };
  const E = (e) => (typeof e === "function" ? e : ease[e] || ease.outCubic);

  // ---- entradas suaves ------------------------------------------------------------------------
  // Fade in: opacity only. Pair with something else (slide/blur) or it reads as "AI default".
  function fadeIn(t, t0, { d = 0.4, e = "outCubic" } = {}) {
    return { opacity: E(e)(prog(t, t0, d)) };
  }
  // Slide in: travels from an offset to rest. from = [dx, dy] px. Opacity reaches 1 in the first 40 %.
  function slideIn(t, t0, { d = 0.4, from = [-120, 0], e = "outExpo" } = {}) {
    const p = prog(t, t0, d), k = E(e)(p);
    return { x: lerp(from[0], 0, k), y: lerp(from[1], 0, k), opacity: clamp(p / 0.4) };
  }
  // Blur in: blurry to sharp. Blur clears slightly after opacity so the shape lands first.
  function blurIn(t, t0, { d = 0.5, blur = 24, e = "outCubic" } = {}) {
    const p = prog(t, t0, d);
    return { blur: blur * (1 - E(e)(p)), opacity: E("outCubic")(clamp(p / 0.6)) };
  }

  // ---- entradas com impacto -------------------------------------------------------------------
  // Pop in: small scale jump past 1 and back. Use for one hero element per beat, not for lists.
  function popIn(t, t0, { d = 0.45, from = 0.6, s = 1.7 } = {}) {
    const p = prog(t, t0, d);
    return { scale: lerp(from, 1, ease.outBack(p, s)), opacity: clamp(p / 0.25) };
  }
  // Scale up: grows to final size with no overshoot (calmer than pop).
  function scaleUp(t, t0, { d = 0.6, from = 0.2, e = "outExpo" } = {}) {
    const p = prog(t, t0, d);
    return { scale: lerp(from, 1, E(e)(p)), opacity: clamp(p / 0.3) };
  }
  // Stagger: start time of item i. Combine with any entrance: FX.slideIn(t, FX.stagger(t0, i, 0.15)).
  const stagger = (t0, i, gap = 0.15) => t0 + i * gap;

  // ---- ritmo (curvas de valor) ----------------------------------------------------------------
  // Each returns a value between `from` and `to` (default 0 -> 1) for position, size, angle...
  function easeInOut(t, t0, { d = 0.8, from = 0, to = 1, e = "inOutCubic" } = {}) {
    return lerp(from, to, E(e)(prog(t, t0, d)));
  }
  function overshoot(t, t0, { d = 0.6, from = 0, to = 1, s = 1.70158 } = {}) {
    return lerp(from, to, ease.outBack(prog(t, t0, d), s));
  }
  function bounce(t, t0, { d = 0.9, from = 0, to = 1 } = {}) {
    return lerp(from, to, ease.outBounce(prog(t, t0, d)));
  }

  // ---- texto em movimento ---------------------------------------------------------------------
  // Typewriter: characters per second; caret blinks at 2 Hz after typing ends (still a pure f(t)).
  function typewriter(t, t0, text, { cps = 18, caret = true } = {}) {
    const n = Math.max(0, Math.min(text.length, Math.floor((t - t0) * cps)));
    const typing = n < text.length && t >= t0;
    const on = caret && (typing || Math.floor((t - t0) * 2) % 2 === 0);
    return { text: text.slice(0, n), caret: on, done: n >= text.length };
  }
  // Word reveal: per-word {opacity, y}. Words enter in sequence, each a short slide up.
  function wordReveal(t, t0, words, { gap = 0.18, d = 0.3, rise = 40, e = "outExpo" } = {}) {
    return words.map((w, i) => {
      const p = prog(t, t0 + i * gap, d);
      return { word: w, opacity: clamp(p / 0.5), y: rise * (1 - E(e)(p)) };
    });
  }
  // Text swap: old word leaves up, new word enters from below, inside an overflow:hidden slot.
  // dist = slot height. The new word starts 30 % into the move so the two never fully overlap.
  function textSwap(t, t0, { d = 0.35, dist = 80, e = "outExpo" } = {}) {
    const pOut = prog(t, t0, d * 0.7), pIn = prog(t, t0 + d * 0.3, d * 0.7);
    return {
      out: { y: -dist * E("inCubic")(pOut), opacity: 1 - pOut },
      in: { y: dist * (1 - E(e)(pIn)), opacity: clamp(pIn / 0.5) },
    };
  }

  // ---- formas que mudam -----------------------------------------------------------------------
  // Draw-on: SVG stroke drawing itself. length = path.getTotalLength() (measure once, outside __seek).
  function drawOn(t, t0, length, { d = 0.8, e = "inOutCubic" } = {}) {
    return { dasharray: `${length} ${length}`, dashoffset: length * (1 - E(e)(prog(t, t0, d))) };
  }
  // Morph: interpolates every numeric key shared by `from` and `to` ({w,h,radius,x,y,rotate,...}).
  // For path-to-path morphs, keep the same point count on both paths and lerp the points the same way.
  function morph(t, t0, from, to, { d = 0.6, e = "inOutCubic" } = {}) {
    const k = E(e)(prog(t, t0, d)), out = {};
    for (const key of Object.keys(from)) if (key in to) out[key] = lerp(from[key], to[key], k);
    return out;
  }
  // Bar grow: fraction 0..value plus the number to print, both from the same curve (bar and label agree).
  function barGrow(t, t0, value, { d = 0.8, max = 1, e = "outExpo", decimals = 0 } = {}) {
    const k = E(e)(prog(t, t0, d)), v = value * k;
    return { frac: clamp(v / max), label: v.toFixed(decimals) };
  }

  // ---- transicoes de cena ---------------------------------------------------------------------
  // Mask reveal: clip-path for the incoming content. dir: "vertical" opens from the middle (letterbox),
  // "up" | "down" | "left" | "right" open from that edge's opposite side.
  function maskReveal(t, t0, { d = 0.6, dir = "vertical", e = "inOutExpo" } = {}) {
    const c = (1 - E(e)(prog(t, t0, d))) * 100, h = c / 2;
    const m = { vertical: `${h}% 0 ${h}% 0`, horizontal: `0 ${h}% 0 ${h}%`, up: `${c}% 0 0 0`, down: `0 0 ${c}% 0`, left: `0 ${c}% 0 0`, right: `0 0 0 ${c}%` };
    return { clipPath: `inset(${m[dir] || m.vertical})` };
  }
  // Wipe: scene B clipped behind a moving edge; edgeX (0..100 %) for drawing the accent bar on the seam.
  function wipe(t, t0, { d = 0.5, dir = "right", e = "inOutCubic" } = {}) {
    const k = E(e)(prog(t, t0, d)), r = (1 - k) * 100;
    const clip = dir === "left" ? `inset(0 0 0 ${r}%)` : `inset(0 ${r}% 0 0)`;
    return { clipPath: clip, edge: dir === "left" ? r : 100 - r };
  }
  // Punch zoom: fast push-in (d), then hold. hold > 0 eases back to 1 over 0.4 s after `hold` seconds.
  // Set transform-origin on the subject. Never combine with will-change (text blurs).
  function punchZoom(t, t0, { d = 0.18, scale = 1.35, hold = 0, e = "outExpo" } = {}) {
    const s = lerp(1, scale, E(e)(prog(t, t0, d)));
    return { scale: hold > 0 ? lerp(s, 1, ease.inOutCubic(prog(t, t0 + d + hold, 0.4))) : s };
  }

  // Iris: circular mask opening from a point (cx, cy in %). Close = swap from/to.
  function iris(t, t0, { d = 0.6, cx = 50, cy = 50, from = 0, to = 150, e = "inOutCubic" } = {}) {
    return { clipPath: `circle(${lerp(from, to, E(e)(prog(t, t0, d)))}% at ${cx}% ${cy}%)` };
  }

  // ---- principios de animacao (extensao) ------------------------------------------------------
  // Count-up: number rolls to its value; label formatted for pt-BR (1.234,5). Real numbers only.
  function countUp(t, t0, value, { d = 1.2, e = "outExpo", decimals = 0, locale = "pt-BR" } = {}) {
    const v = value * E(e)(prog(t, t0, d));
    return { value: v, label: v.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) };
  }
  // Anticipation: pulls back `pull` (fraction of the move) during the first `wind` share of d, then goes.
  function anticipation(t, t0, { d = 0.6, from = 0, to = 1, pull = 0.15, wind = 0.35, e = "outExpo" } = {}) {
    const p = prog(t, t0, d), back = from - (to - from) * pull;
    if (p < wind) return lerp(from, back, ease.inOutCubic(p / wind));
    return lerp(back, to, E(e)((p - wind) / (1 - wind)));
  }
  // Squash & stretch around an impact at t0: stretches on the way in, squashes on contact, recovers.
  // Volume is kept (scaleX * scaleY ~ 1). Set transform-origin to the contact point (bottom for a floor).
  function squashStretch(t, t0, { d = 0.25, amount = 0.3 } = {}) {
    const before = clamp((t0 - t) / 0.12), after = prog(t, t0, d);
    let k = 0;
    if (t < t0) k = before < 1 ? -amount * 0.6 * (1 - before) : 0;        // stretch (tall) just before contact
    else k = amount * Math.exp(-5 * after) * Math.cos(after * Math.PI * 2.5); // squash (wide), damped wobble
    return { scaleX: 1 + k, scaleY: 1 / (1 + k) };
  }
  // Echo trail: ghost copies of a moving element. Evaluate the same effect at each ghost's t, draw with
  // its opacity under the original. copies 3 to 5, lag 0.03 to 0.06 s.
  function echo(t, { copies = 4, lag = 0.04, fade = 0.45 } = {}) {
    return Array.from({ length: copies }, (_, i) => ({ t: t - (i + 1) * lag, opacity: fade * (1 - i / copies) }));
  }
  // Follow-through: parts that arrive after the lead. Item i starts `lag` later and overshoots a bit more.
  function followThrough(t, t0, i, { d = 0.6, from = 0, to = 1, lag = 0.05, s = 1.2, extra = 0.4 } = {}) {
    return lerp(from, to, ease.outBack(prog(t, t0 + i * lag, d), s + i * extra));
  }

  // ---- aplicar ao DOM -------------------------------------------------------------------------
  // Merge any effect outputs: FX.apply(el, FX.slideIn(...), FX.blurIn(...)). Writes transform/opacity/filter/clip.
  function apply(el, ...parts) {
    const s = Object.assign({ x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, rotate: 0, opacity: 1, blur: 0 }, ...parts);
    let o = 1;
    for (const p of parts) if (p && "opacity" in p) o *= p.opacity;
    el.style.transform = `translate(${s.x}px, ${s.y}px) scale(${s.scale * s.scaleX}, ${s.scale * s.scaleY}) rotate(${s.rotate}deg)`;
    el.style.opacity = String(o);
    el.style.filter = s.blur > 0.05 ? `blur(${s.blur.toFixed(2)}px)` : "none";
    if (s.clipPath) el.style.clipPath = s.clipPath;
  }

  window.FX = {
    clamp, lerp, prog, ease, apply,
    fadeIn, slideIn, blurIn, popIn, scaleUp, stagger,
    easeInOut, overshoot, bounce,
    typewriter, wordReveal, textSwap,
    drawOn, morph, barGrow,
    maskReveal, wipe, punchZoom, iris,
    countUp, anticipation, squashStretch, echo, followThrough,
  };
})();
