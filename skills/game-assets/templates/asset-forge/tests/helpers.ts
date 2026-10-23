import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import type { ForgeConfig, GameConfig } from '../scripts/lib/types';

// 1x1 transparent PNG
export const PNG_BYTES = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
);

export interface Sandbox {
  forgeDir: string;
  config: ForgeConfig;
}

/** forgeDir/assets/<files> plus a config with the given games; destinations live under forgeDir/out. */
export function makeSandbox(files: Record<string, Buffer>, games: GameConfig[]): Sandbox {
  const forgeDir = mkdtempSync(join(tmpdir(), 'asset-forge-'));
  for (const [rel, bytes] of Object.entries(files)) {
    const full = join(forgeDir, 'assets', rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, bytes);
  }
  // The unity target installs the importer from the forge folder.
  const importer = join(forgeDir, 'unity/Editor/PixelArtImporter.cs');
  mkdirSync(dirname(importer), { recursive: true });
  writeFileSync(importer, '// importer');
  return { forgeDir, config: { assetsDir: 'assets', games } };
}
