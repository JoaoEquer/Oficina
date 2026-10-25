---
description: Creates or adjusts one game asset following the project's ASSETS.md, then exports it with AssetForge (experimental)
argument-hint: "<descrição do asset> [jogo]"
---

Create or adjust the asset described by **$ARGUMENTS**, following the project's style guide, then export it.

1. Load the `game-assets` skill. Require `ASSETS.md` and `tools/asset-forge/forge.config.json` at the project; if either is missing, stop and say `/oficina:asset-forge` needs to run first.
2. Read `ASSETS.md` (style, palette, base sizes, naming, asset list) and, if present, `GDD.md` for tone. Pick the game from $ARGUMENTS or, if `forge.config.json` has one game, use it; if several, ask.
3. Decide the name by the rule `categoria_objeto_estado_NN.png` (snake_case, 3+ words, two-digit index, unique in the project) and the size from the base-size table. If the asset exists, adjust it in place and keep the name.
4. Produce the image. Pixel art is generated as code (a small script that writes the PNG from an array or drawing calls, using only palette colors, integer coordinates, no anti-aliasing, transparent background) or edited from the existing file. Do not call an external image service and do not invent a palette: stay inside `ASSETS.md`. Save to `assets/<project>/<categoria>/`.
5. Update the asset list in `ASSETS.md` (new line or state change).
6. Export: `npm run export -- <game> <path-relative-to-assets>` inside `tools/asset-forge`. For a Roblox game this uploads to the owner's account: confirm with the user before the first upload of the session and never print the `.env` values.
7. Verify: the command printed `Exported 1 asset(s)`, the generated index (`assets.ts`, `Assets.lua`, or the Unity file) lists the name, and the image dimensions match the base-size table. Report any mismatch instead of fixing silently.
8. Do not commit. Show the changed files.

Report: asset name and size, files changed, export result, anything that deviated from `ASSETS.md`.
