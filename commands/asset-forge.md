---
description: Installs AssetForge (asset viewer + export CLI) into the current game project using the game-assets skill (experimental)
argument-hint: "[electron|unity|roblox]"
---

Install AssetForge in the current game project. Optional argument: $ARGUMENTS — the target, if already known.

1. Confirm this is a game project (engine files, `electron/`, `ProjectSettings/`, `default.project.json`, or the user said so) and a git repo. If not, stop. Load the `game-assets` skill.
2. If `tools/asset-forge/` already exists, stop and ask before touching it. Never overwrite `forge.config.json`, `.env` or `.asset-forge-cache.json`.
3. Ask, in one round, only what you cannot read from the project: the **target** (`electron` | `unity` | `roblox`, default from $ARGUMENTS or the detected engine), the **destination** path for that target (Electron: assets folder such as `src/assets`; Unity: the Unity project root; Roblox: the Rojo folder for `Assets.lua`), the game name, and for Unity the Pixels Per Unit (default 16). Give a recommended answer for each.
4. Copy `templates/asset-forge/` from the Oficina skill (installed at `~/.claude/skills/game-assets/templates/asset-forge`) to `tools/asset-forge/`, excluding `node_modules`.
5. Fill `tools/asset-forge/forge.config.json`: one game entry with the answers, `assetsDir` `../../assets`, destination relative to `tools/asset-forge`. Remove the placeholder entries.
6. Create `assets/<game>/` and `ASSETS.md` at the project root from `templates/ASSETS.md`, filling name, date, target/destination table and, if a `GDD.md` exists, the tone and size hints from it. Do not invent a palette or style: leave `<...>` placeholders the owner has not decided.
7. Security (Oficina baseline): ensure the root `.gitignore` contains `tools/asset-forge/.env` and `tools/asset-forge/node_modules/`. For `roblox`, tell the user to copy `.env.example` to `.env` and fill it by hand (never ask them to paste the key in chat), and to run the `secrets-gitleaks` skill (pre-commit hook) before the first upload.
8. Install and verify: `npm install` then `npm test` and `npm run typecheck` inside `tools/asset-forge`. Report failures verbatim; do not declare done on a red run.
9. Do not commit. Print: what was created, the next commands (`npm run dev`, `npm run export -- <game> <path>`), and remind the user to add the project to the skill's **Validação** table.

Report: target and destination chosen, files created, test/typecheck result, anything left as a placeholder.
