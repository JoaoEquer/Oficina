import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** sha256 of the file -> Roblox asset ID. Safe to commit: no secrets, and it stops teammates re-uploading. */
export type RobloxCache = Record<string, string>;

export const CACHE_FILE = '.asset-forge-cache.json';

export function readCache(forgeDir: string): RobloxCache {
  const file = join(forgeDir, CACHE_FILE);
  if (!existsSync(file)) return {};
  return JSON.parse(readFileSync(file, 'utf8')) as RobloxCache;
}

export function writeCache(forgeDir: string, cache: RobloxCache): void {
  const sorted = Object.fromEntries(Object.entries(cache).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(join(forgeDir, CACHE_FILE), `${JSON.stringify(sorted, null, 2)}\n`);
}
