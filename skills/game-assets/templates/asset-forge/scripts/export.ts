import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runExport } from './lib/run';
import type { ForgeConfig } from './lib/types';

const USAGE = 'Usage: npm run export -- <game> <asset-path>   |   npm run export -- <game> --all';

async function main(): Promise<void> {
  const [game, second] = process.argv.slice(2);
  if (!game || !second) throw new Error(USAGE);

  const forgeDir = join(dirname(fileURLToPath(import.meta.url)), '..');
  try {
    process.loadEnvFile(join(forgeDir, '.env'));
  } catch {
    // No .env: only the roblox target needs one, and it reports that itself.
  }
  const config = JSON.parse(readFileSync(join(forgeDir, 'forge.config.json'), 'utf8')) as ForgeConfig;

  const all = second === '--all';
  const records = await runExport({
    forgeDir,
    config,
    game,
    assetPath: all ? undefined : second,
    all,
    env: process.env,
    fetchImpl: fetch,
    sleep: (ms) => new Promise((done) => setTimeout(done, ms)),
  });
  console.log(`Exported ${records.length} asset(s) to "${game}".`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
