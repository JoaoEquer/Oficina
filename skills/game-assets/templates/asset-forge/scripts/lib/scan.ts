import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { isAssetFile, splitFileName } from './naming';
import type { AssetEntry } from './types';

function walk(dir: string, prefix: string[], out: string[][]): void {
  for (const dirent of readdirSync(dir, { withFileTypes: true })) {
    if (dirent.name.startsWith('.')) continue;
    if (dirent.isDirectory()) walk(join(dir, dirent.name), [...prefix, dirent.name], out);
    else if (isAssetFile(dirent.name)) out.push([...prefix, dirent.name]);
  }
}

/** Layout: <assetsDir>/<project>/<category>/.../<file>. Sorted by path. */
export function scanAssets(assetsDir: string): AssetEntry[] {
  const parts: string[][] = [];
  walk(assetsDir, [], parts);
  return parts
    .filter((p) => p.length >= 2)
    .map((p): AssetEntry => {
      const file = p[p.length - 1] as string;
      const { name, ext } = splitFileName(file);
      return {
        project: p[0] as string,
        category: p.length > 2 ? (p[1] as string) : '',
        name,
        file,
        relPath: p.join('/'),
        ext,
      };
    })
    .sort((a, b) => a.relPath.localeCompare(b.relPath));
}
