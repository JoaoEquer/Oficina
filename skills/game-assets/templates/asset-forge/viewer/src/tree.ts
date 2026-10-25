import type { AssetEntry, TreeProject } from './types';

export function matchesQuery(asset: AssetEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return asset.name.toLowerCase().includes(q) || asset.relPath.toLowerCase().includes(q);
}

/** project > category > file. Assets directly under a project use the "(raiz)" category. */
export function buildTree(assets: AssetEntry[]): TreeProject[] {
  const projects = new Map<string, Map<string, AssetEntry[]>>();
  for (const asset of assets) {
    const categories = projects.get(asset.project) ?? new Map<string, AssetEntry[]>();
    const key = asset.category || '(raiz)';
    categories.set(key, [...(categories.get(key) ?? []), asset]);
    projects.set(asset.project, categories);
  }
  return [...projects.entries()].map(([name, categories]) => ({
    name,
    categories: [...categories.entries()].map(([catName, files]) => ({ name: catName, files })),
  }));
}

export function exportCommand(game: string, asset: AssetEntry): string {
  return `npm run export -- ${game} ${asset.relPath}`;
}
