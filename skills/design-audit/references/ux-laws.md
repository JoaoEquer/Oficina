# Seven usability laws

Lenses for the manual pass of a design audit, and for reviewing a screen's decisions. Source: a list shared by the owner on 2026-10-23 (Instagram post, summarized); the laws themselves are standard HCI literature. A law is a question to ask of a screen, not a rule to cite. Report a violation only with the screen and the element, like any other finding.

| Law | Question to ask of the screen | Typical break |
|---|---|---|
| Fitts | Is the main action large and close to where the pointer or thumb already is? | Primary button small, far from the content it acts on, same weight as a secondary one |
| Hick | How many choices are on screen at the decision point? | Ten equal options where two matter; settings and actions mixed in one menu |
| Zeigarnik | Is there an unfinished task that pulls the person back? | Progress is invisible, so there is nothing to come back to |
| Jakob | Does it work like the products people already use? | A custom pattern for search, tables, forms or navigation with no reason |
| Goal gradient | Near the end, is progress shown so effort speeds up? | Multi-step flow or goal with no bar or count |
| Von Restorff | Does the one thing that matters look different from the rest? | Everything highlighted, so nothing is; or the key action styled like the others |
| Miller | Is information grouped and one decision asked at a time? | Long ungrouped lists or forms, many unrelated numbers in a row |

## Use in a game (Galaslime example)
- Zeigarnik and goal gradient: the Metas screen shows progress bars on every goal, so an unfinished one pulls the player back.
- Hick: the forge dialog offers refine, upgrade and reforge at once; check it still reads as one decision per click.
- Fitts: the result screen's next-stage button should be the largest target.
