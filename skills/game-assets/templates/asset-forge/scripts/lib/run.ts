import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describeNameRule, isValidAssetName } from './naming';
import { readManifest, upsertManifest, writeManifest } from './manifest';
import { scanAssets } from './scan';
import { electronTarget } from './targets/electron';
import { robloxTarget } from './targets/roblox';
import { unityTarget } from './targets/unity';
import type { AssetEntry, ExportContext, ExportRecord, ForgeConfig, TargetExporter, TargetName } from './types';

const TARGETS: Record<TargetName, TargetExporter> = {
  electron: electronTarget,
  unity: unityTarget,
  roblox: robloxTarget,
};

export interface RunOptions {
  forgeDir: string;
  config: ForgeConfig;
  game: string;
  /** Asset path relative to assetsDir. Mutually exclusive with all. */
  assetPath?: string;
  all?: boolean;
  env: ExportContext['env'];
  fetchImpl: typeof fetch;
  sleep: (ms: number) => Promise<void>;
}

/** Fails before touching the destination when any selected asset is misnamed or two share a name. */
export function selectAssets(all: AssetEntry[], assetPath: string | undefined, every: boolean): AssetEntry[] {
  const selected = every ? all : all.filter((a) => a.relPath === assetPath);
  if (selected.length === 0) {
    throw new Error(every ? 'No assets found in assetsDir.' : `Asset not found: ${assetPath ?? '(none given)'}`);
  }
  const errors = selected.filter((a) => !isValidAssetName(a.name)).map((a) => `${a.relPath}: ${describeNameRule(a.name)}`);
  const seen = new Map<string, string>();
  for (const a of all) {
    const first = seen.get(a.name);
    if (first && selected.some((s) => s.name === a.name)) errors.push(`duplicate name "${a.name}": ${first} and ${a.relPath}`);
    seen.set(a.name, a.relPath);
  }
  if (errors.length > 0) throw new Error(`Export aborted, nothing was written:\n${errors.map((e) => `  - ${e}`).join('\n')}`);
  return selected;
}

export async function runExport(opts: RunOptions): Promise<ExportRecord[]> {
  const game = opts.config.games.find((g) => g.name === opts.game);
  if (!game) {
    const names = opts.config.games.map((g) => g.name).join(', ');
    throw new Error(`Unknown game "${opts.game}". Configured: ${names}`);
  }
  const assetsDir = resolve(opts.forgeDir, opts.config.assetsDir);
  const selected = selectAssets(scanAssets(assetsDir), opts.assetPath, Boolean(opts.all));

  const destDir = resolve(opts.forgeDir, game.destination);
  mkdirSync(destDir, { recursive: true });
  const ctx: ExportContext = {
    game,
    assetsDir,
    destDir,
    forgeDir: opts.forgeDir,
    env: opts.env,
    fetchImpl: opts.fetchImpl,
    sleep: opts.sleep,
  };
  const target = TARGETS[game.target];

  const records: ExportRecord[] = [];
  for (const entry of selected) records.push(await target.exportAsset(ctx, entry));

  const manifest = upsertManifest(readManifest(destDir, game.name, game.target), records);
  writeManifest(destDir, manifest);
  await target.finalize(ctx, manifest);
  return records;
}
