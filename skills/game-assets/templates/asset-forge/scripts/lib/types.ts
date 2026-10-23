export type TargetName = 'unity' | 'electron' | 'roblox';

export interface GameConfig {
  name: string;
  target: TargetName;
  /** Relative to forge.config.json. Unity: project root. Electron: assets folder. Roblox: Rojo folder for Assets.lua. */
  destination: string;
  /** Unity only: Pixels Per Unit written to the importer settings. */
  ppu?: number;
}

export interface ForgeConfig {
  /** Relative to forge.config.json. Layout: <assetsDir>/<project>/<category>/<file>. */
  assetsDir: string;
  games: GameConfig[];
}

export interface AssetEntry {
  project: string;
  category: string;
  /** File name without extension, the identifier used in generated code. */
  name: string;
  file: string;
  /** Posix path relative to assetsDir. */
  relPath: string;
  ext: string;
}

export interface ExportRecord {
  name: string;
  /** Source path relative to assetsDir. */
  path: string;
  sha256: string;
  bytes: number;
  /** Destination path relative to the game destination (unity/electron). */
  dest?: string;
  /** Roblox asset ID (roblox). */
  assetId?: string;
}

export interface Manifest {
  game: string;
  target: TargetName;
  assets: ExportRecord[];
}

export interface ExportContext {
  game: GameConfig;
  assetsDir: string;
  destDir: string;
  forgeDir: string;
  env: Record<string, string | undefined>;
  fetchImpl: typeof fetch;
  sleep: (ms: number) => Promise<void>;
}

export interface TargetExporter {
  exportAsset(ctx: ExportContext, entry: AssetEntry): Promise<ExportRecord>;
  /** Regenerates the target's index file from every asset exported so far. */
  finalize(ctx: ExportContext, manifest: Manifest): Promise<void>;
}
