# Generated-UI catalog

Detection column: `scan` = `scripts/scan.mjs` rule id, `read` = read the component tree, `render` = visible only in a screenshot. Ids in *italics* follow Impeccable's detector naming (Apache-2.0) so hits from `npx impeccable detect` map 1:1.

A hit is a lead. It becomes a finding only when it is repeated or sits on a primary surface, and no brand doc explains it (see SKILL.md step 5).

## Color and surface
| Id | Pattern | Detect | Fix direction |
|---|---|---|---|
| *ai-color-palette* | Purple/violet/indigo gradients, cyan on near-black | scan `ai-gradient`, render | One accent from the product's own domain; neutrals carry the rest |
| *gradient-text* | Gradient fill on headings or metrics | scan | Solid color; weight/size for emphasis |
| *dark-glow* / *radial-halo* | Colored halo shadows, radial glow behind hero on dark page | scan `colored-glow`, render | Neutral shadow tinted to the surface, or none |
| *cream-palette* | Warm cream/beige page as the reflex "tasteful" surface | render | Background derived from the brand, not from a vibe |
| *gpt-thin-border-wide-shadow* | Every card: hairline border + wide diffuse shadow | read, render | Pick one: border OR elevation, and only where hierarchy needs it |
| glass-everywhere | `backdrop-blur` on every panel | scan `glass-blur` | Keep blur for overlays above moving content only |
| *codex-grid-background* / *repeating-stripes-gradient* | Decorative hairline grid or stripes as page texture | scan `grid-background` | Remove, or a texture with a reason |
| pure-black | `#000` page background or text | scan aggregates, render | Off-black from the neutral ramp |
| *gray-on-color* | Gray text on a colored background | render | Darker shade of the background hue, or near-white |

## Typography
| Id | Pattern | Detect | Fix direction |
|---|---|---|---|
| *overused-font* | Inter, Roboto, Geist, Plus Jakarta Sans, Space Grotesk, Fraunces as the only face | scan | A face chosen for the product character; keep a documented brand font |
| *italic-serif-display* | Oversized italic serif hero headline (Fraunces, Playfair, Recoleta) | read, render | Same as above: the "editorial" default is now a default too |
| *flat-type-hierarchy* | Heading/body sizes less than ~1.25x apart at every step | render, aggregates | One clear scale with at least one large jump |
| *oversized-h1* | Full-sentence headline at display size eating the first viewport | render | Shorter headline, or smaller size with the sentence |
| *extreme-negative-tracking* | Letter-spacing so tight glyphs touch | read, render | Optical tightening only on display sizes |
| *em-dash-overuse* | Em-dash cadence in body copy | scan aggregates `emDashHeavyFiles` | Commas, periods, parentheses |

## Layout and components
| Id | Pattern | Detect | Fix direction |
|---|---|---|---|
| *icon-tile-stack* | Rounded-square icon tile above a heading, in a row of feature cards | read | Lead with the content (screenshot, number, example), not an icon tile |
| three-equal-cards | Feature row of exactly three identical cards | read, render | Vary by content weight: one large + list, or a real comparison |
| *side-tab* | Thick colored border on one side of a card | scan | Remove; use position, spacing or a heading for grouping |
| *border-accent-on-rounded* | Accent border fighting a large radius | read | Drop one of the two |
| *nested-cards* | Cards inside cards | read | Flatten with spacing, dividers, type |
| *hero-eyebrow-chip* / *kicker-above-heading* | Tiny uppercase tracked label or pill chip above the headline | scan `kicker-label`, read | Delete it; the heading should carry its own context |
| *numbered-section-labels* | "01 / 02 / 03" next to every section heading | read | Remove unless the content is a real sequence |
| centered-everything | Every section centered, symmetric | render | Left-aligned reading content; center only short statements |
| *monotonous-spacing* | Same gap everywhere, no grouping rhythm | render | Tight inside groups, generous between sections |
| template-hero | Badge + headline + subline + two buttons (filled + ghost) + screenshot in a glowing frame | read, render | Start from what only this product has (real data, real user, real output) |
| *shape-assembled-illustration* | Inline SVG scene built from primitive shapes | read | Real image, product screenshot, or nothing |
| fake-data | "John Doe", "Acme", 99.9%, identical dates, same avatar repeated | read | Plausible, varied data from the domain |

## Motion
| Id | Pattern | Detect | Fix direction |
|---|---|---|---|
| *bounce-easing* | Bounce/elastic/overshoot easing | scan | Ease-out (quart/expo) |
| *pulsing-dot* | Pulsing status dot with no live data behind it | scan `decorative-ping` | Static dot; pulse only on real live state |
| *blinking-cursor* | Fake typing cursor in a hero | read | Remove |
| *marquee* | Auto-scrolling logo/testimonial strip | read | Static grid, or user-controlled scroll |
| *content-hidden-at-rest* | Reveal-on-scroll content still invisible after load | render | Content visible by default; animate only as enhancement |
| layout-transition | Animating width/height/top/left | read | `transform` and `opacity` |

## Copy (EN and PT-BR)
| Id | Pattern | Detect | Fix direction |
|---|---|---|---|
| *marketing-buzzword* | seamless, elevate, unleash, supercharge, empower, cutting-edge, world-class / sem esforço, de ponta, revolucione, potencialize, desbloqueie, eleve seu | scan `buzzword-copy` | Say what the thing does, with a number or example |
| *aphoristic-cadence* | Sections ending in "X. No Y." / "Not a feature. A ..." | read | Plain sentence |
| *theater-slop-phrase* | Calling things "theater" ("security theater") | read | Say what it fails to do |
| triad-copy | Every list exactly three items, every claim in threes | read | Use the real count |
| exclamation-ui | "Success!", "Oops!" | read | Direct: "Saved." / "Connection failed. Try again." |

## Design-system drift
| Id | Pattern | Detect | Fix direction |
|---|---|---|---|
| hardcoded-color | Hex/rgb literal in a component | scan | Existing token; if none fits, add the token first |
| arbitrary-tw-value | `p-[13px]`, `text-[#3b82f6]` | scan | Nearest scale step or a theme extension |
| magic-z-index | `z-index: 9999` | scan | A named z scale (base, dropdown, overlay, modal, toast) |
| inline-style | `style={{...}}` in web markup | scan | Move into the styling system |
| scale-sprawl | Too many distinct colors/radii/font sizes | scan aggregates | Collapse to the documented scale; list the merges |
| off-system-font | Font not in the design source | read vs `DESIGN.md` | Use the documented family or update the doc on purpose |
| RN literals | `StyleSheet` hex/sizes outside `theme.ts` (Expo/RN) | scan `hardcoded-color` | Import from the theme module |

## Rendered quality (render only)
low-contrast (WCAG AA 4.5:1 body, 3:1 large), tiny-text (<14px body, <11px UI), line-length (>~80ch), tight-leading (<1.3), cramped-padding, small touch targets (<44x44), skipped-heading, text-overflow, text-occlusion, body text flush to the viewport edge, broken images, console script errors.
