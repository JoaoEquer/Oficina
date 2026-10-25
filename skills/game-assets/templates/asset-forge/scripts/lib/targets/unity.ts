import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { sha256 } from '../manifest';
import type { TargetExporter } from '../types';

export const UNITY_SPRITES_ROOT = 'Assets/Sprites';
export const UNITY_EDITOR_DIR = 'Assets/Editor';
export const DEFAULT_PPU = 16;

export const unityTarget: TargetExporter = {
  async exportAsset(ctx, entry) {
    const dest = [UNITY_SPRITES_ROOT, entry.category, entry.file].filter(Boolean).join('/');
    const from = join(ctx.assetsDir, entry.relPath);
    const to = join(ctx.destDir, dest);
    mkdirSync(dirname(to), { recursive: true });
    copyFileSync(from, to);
    const bytes = readFileSync(from);
    return { name: entry.name, path: entry.relPath, sha256: sha256(bytes), bytes: bytes.length, dest };
  },

  /** Installs the AssetPostprocessor once and writes the settings only if they do not exist, so manual edits survive. */
  async finalize(ctx) {
    const editorDir = join(ctx.destDir, UNITY_EDITOR_DIR);
    mkdirSync(editorDir, { recursive: true });
    copyFileSync(join(ctx.forgeDir, 'unity/Editor/PixelArtImporter.cs'), join(editorDir, 'PixelArtImporter.cs'));
    const settings = join(editorDir, 'PixelArtImporter.json');
    if (!existsSync(settings)) {
      const body = { spritesRoot: UNITY_SPRITES_ROOT, pixelsPerUnit: ctx.game.ppu ?? DEFAULT_PPU };
      writeFileSync(settings, `${JSON.stringify(body, null, 2)}\n`);
    }
  },
};
