import type { AssetEntry, GameConfig } from '../../scripts/lib/types';

export type { AssetEntry, GameConfig };

export interface AssetListResponse {
  assets: AssetEntry[];
  games: GameConfig[];
}

export interface TreeCategory {
  name: string;
  files: AssetEntry[];
}

export interface TreeProject {
  name: string;
  categories: TreeCategory[];
}
