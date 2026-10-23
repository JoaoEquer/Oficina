import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { scanAssets } from '../scripts/lib/scan';
import { runExport } from '../scripts/lib/run';
import type { GameConfig } from '../scripts/lib/types';
import { makeSandbox, PNG_BYTES } from './helpers';

const noFetch = (() => {
  throw new Error('network must not be used');
}) as unknown as typeof fetch;
const noSleep = async () => {};

const FILES = {
  'galaxy/enemies/enemy_alien_idle_01.png': PNG_BYTES,
  'galaxy/ui/ui_button_hover_01.png': PNG_BYTES,
};

function opts(sandbox: ReturnType<typeof makeSandbox>, game: string, extra: { assetPath?: string; all?: boolean }) {
  return { forgeDir: sandbox.forgeDir, config: sandbox.config, game, env: {}, fetchImpl: noFetch, sleep: noSleep, ...extra };
}

describe('scanAssets', () => {
  it('reads project > category > file and ignores non-images', () => {
    const sandbox = makeSandbox({ ...FILES, 'galaxy/enemies/notes.txt': Buffer.from('x') }, []);
    const found = scanAssets(join(sandbox.forgeDir, 'assets'));
    expect(found.map((a) => [a.project, a.category, a.name])).toEqual([
      ['galaxy', 'enemies', 'enemy_alien_idle_01'],
      ['galaxy', 'ui', 'ui_button_hover_01'],
    ]);
  });
});

describe('electron target', () => {
  const game: GameConfig = { name: 'g', target: 'electron', destination: 'out/electron' };

  it('copies the file, writes the manifest and a typed assets.ts', async () => {
    const sandbox = makeSandbox(FILES, [game]);
    await runExport(opts(sandbox, 'g', { all: true }));
    const out = join(sandbox.forgeDir, 'out/electron');

    expect(existsSync(join(out, 'enemies/enemy_alien_idle_01.png'))).toBe(true);
    const source = readFileSync(join(out, 'assets.ts'), 'utf8');
    expect(source).toContain("enemy_alien_idle_01: './enemies/enemy_alien_idle_01.png',");
    expect(source).toContain("ui_button_hover_01: './ui/ui_button_hover_01.png',");
    expect(source).toContain('export type AssetName = keyof typeof ASSETS;');

    const manifest = JSON.parse(readFileSync(join(out, 'asset-manifest.json'), 'utf8')) as {
      assets: { name: string; sha256: string; bytes: number; dest: string }[];
    };
    expect(manifest.assets.map((a) => a.name)).toEqual(['enemy_alien_idle_01', 'ui_button_hover_01']);
    expect(manifest.assets[0]?.bytes).toBe(PNG_BYTES.length);
    expect(manifest.assets[0]?.sha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it('keeps earlier assets in assets.ts when exporting one at a time', async () => {
    const sandbox = makeSandbox(FILES, [game]);
    await runExport(opts(sandbox, 'g', { assetPath: 'galaxy/enemies/enemy_alien_idle_01.png' }));
    await runExport(opts(sandbox, 'g', { assetPath: 'galaxy/ui/ui_button_hover_01.png' }));
    const source = readFileSync(join(sandbox.forgeDir, 'out/electron/assets.ts'), 'utf8');
    expect(source).toContain('enemy_alien_idle_01');
    expect(source).toContain('ui_button_hover_01');
  });

  it('aborts without writing anything when a name is invalid', async () => {
    const sandbox = makeSandbox({ ...FILES, 'galaxy/ui/BadName.png': PNG_BYTES }, [game]);
    await expect(runExport(opts(sandbox, 'g', { all: true }))).rejects.toThrow(/BadName\.png/);
    expect(existsSync(join(sandbox.forgeDir, 'out/electron/assets.ts'))).toBe(false);
  });

  it('rejects an unknown game and an unknown asset', async () => {
    const sandbox = makeSandbox(FILES, [game]);
    await expect(runExport(opts(sandbox, 'nope', { all: true }))).rejects.toThrow(/Unknown game/);
    await expect(runExport(opts(sandbox, 'g', { assetPath: 'galaxy/x/missing_a_b_01.png' }))).rejects.toThrow(/not found/);
  });

  it('rejects two assets that share a name', async () => {
    const sandbox = makeSandbox(
      { 'galaxy/a/enemy_alien_idle_01.png': PNG_BYTES, 'galaxy/b/enemy_alien_idle_01.png': PNG_BYTES },
      [game],
    );
    await expect(runExport(opts(sandbox, 'g', { all: true }))).rejects.toThrow(/duplicate name/);
  });
});

describe('unity target', () => {
  const game: GameConfig = { name: 'u', target: 'unity', destination: 'out/unity', ppu: 32 };

  it('copies to Assets/Sprites, installs the importer and writes settings once', async () => {
    const sandbox = makeSandbox(FILES, [game]);
    await runExport(opts(sandbox, 'u', { all: true }));
    const out = join(sandbox.forgeDir, 'out/unity');

    expect(existsSync(join(out, 'Assets/Sprites/enemies/enemy_alien_idle_01.png'))).toBe(true);
    expect(existsSync(join(out, 'Assets/Editor/PixelArtImporter.cs'))).toBe(true);
    const settings = JSON.parse(readFileSync(join(out, 'Assets/Editor/PixelArtImporter.json'), 'utf8')) as {
      pixelsPerUnit: number;
      spritesRoot: string;
    };
    expect(settings).toEqual({ spritesRoot: 'Assets/Sprites', pixelsPerUnit: 32 });
  });
});
