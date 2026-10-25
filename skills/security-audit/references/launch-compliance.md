# Launch checklist for a site or app built with AI (Brazil)

A 17-point list shared by the owner on 2026-10-23 (Instagram post, headings only: the post gave the titles, not the detail). The detail below is the audit question for each; legal sufficiency is not judged here, a lawyer decides that. This is a public-facing-product check, separate from the exploit hunt of the security audit: run it before a launch, after the exploit pass. Each item is Pass / Fail / Unverified with evidence (file:line or URL); never guess.

## Legal pages and consent
1. **Privacy policy:** a page exists, is linked from the footer and from every form that collects data, and names what is collected and why.
2. **Terms of service:** a page exists and is linked from signup.
3. **Cookie notice:** shown before any non-essential cookie or tracker loads, with a way to refuse.
4. **Refund policy:** present for anything paid, with the deadline and the channel.
5. **Forms under the LGPD:** each form states purpose and legal basis, has a consent checkbox that is not pre-ticked, and says how to ask for deletion.
6. **Only necessary data:** every field collected has a stated use; no field exists "just in case".
7. **Tracking scripts:** list every third-party script (analytics, pixels, chat); each is declared in the privacy policy and gated by consent.

## Accessibility
8. **Accessibility:** page works with a screen reader on the main flow; headings, landmarks and labels exist.
9. **Alt text:** every informative image has one; decorative images have an empty `alt`.
10. **Contrast:** text meets WCAG AA (4.5:1 body, 3:1 large). Use the rendered check of `design-audit`.
11. **Keyboard navigation:** every action reachable and visible focus (`:focus-visible`), no keyboard trap.

## Honesty and rights
12. **No fake reviews:** testimonials and ratings are real, attributable, or absent. AI-generated customer quotes are a Fail.
13. **No false promises:** claims about results, prices, deadlines and numbers are true and provable.
14. **Image copyright:** each image has a known license or is generated with terms that allow commercial use; keep the source recorded.
15. **Company data:** legal name, CNPJ and a contact channel are visible, as a store or service in Brazil must show.
16. **LGPD compliance overall:** a named controller, a contact for data-subject requests, a retention rule, and a record of processors (hosting, email, analytics).
17. **Legal risks:** anything the product claims or does that touches regulated areas (health, finance, minors, trademarks of others) is flagged for a lawyer.

## Output
One table: item, verdict, evidence, fix. End with the three Fails that block a launch.
