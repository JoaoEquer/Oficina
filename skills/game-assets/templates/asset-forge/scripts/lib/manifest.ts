import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ExportRecord, Manifest, TargetName } from './types';

export const MANIFEST_FILE = 'asset-manifest.json';

export function sha256(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

export function emptyManifest(game: string, target: TargetName): Manifest {
  return { game, target, assets: [] };
}

/** Insert or replace by asset name; output is sorted so the file diffs cleanly. */
export function upsertManifest(manifest: Manifest, records: ExportRecord[]): Manifest {
  const byName = new Map(manifest.assets.map((a) => [a.name, a]));
  for (const record of records) byName.set(record.name, record);
  const assets = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
  return { ...manifest, assets };
}

export function readManifest(destDir: string, game: string, target: TargetName): Manifest {
  const file = join(destDir, MANIFEST_FILE);
  if (!existsSync(file)) return emptyManifest(game, target);
  return JSON.parse(readFileSync(file, 'utf8')) as Manifest;
}

export function writeManifest(destDir: string, manifest: Manifest): void {
  writeFileSync(join(destDir, MANIFEST_FILE), `${JSON.stringify(manifest, null, 2)}\n`);
}
