import { readFileSync, existsSync, statSync, createReadStream } from 'node:fs';
import { dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import { scanAssets } from './scripts/lib/scan';
import type { ForgeConfig } from './scripts/lib/types';

const forgeDir = dirname(fileURLToPath(import.meta.url));
const MIME: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };

function readConfig(): ForgeConfig {
  return JSON.parse(readFileSync(join(forgeDir, 'forge.config.json'), 'utf8')) as ForgeConfig;
}

/** Dev-only API: the asset list, the configured games, and the image files themselves. No writes. */
function assetApi(): Plugin {
  return {
    name: 'asset-forge-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const config = readConfig();
        const assetsDir = resolve(forgeDir, config.assetsDir);

        if (url.pathname === '/api/assets') {
          res.setHeader('Content-Type', 'application/json');
          const assets = existsSync(assetsDir) ? scanAssets(assetsDir) : [];
          res.end(JSON.stringify({ assets, games: config.games }));
          return;
        }
        if (url.pathname.startsWith('/files/')) {
          const file = resolve(assetsDir, decodeURIComponent(url.pathname.slice('/files/'.length)));
          const inside = file.startsWith(assetsDir + sep);
          if (!inside || !existsSync(file) || !statSync(file).isFile()) {
            res.statusCode = 404;
            res.end();
            return;
          }
          res.setHeader('Content-Type', MIME[extname(file).toLowerCase()] ?? 'application/octet-stream');
          res.setHeader('Cache-Control', 'no-cache');
          createReadStream(file).pipe(res);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  root: join(forgeDir, 'viewer'),
  plugins: [react(), assetApi()],
  server: { host: '127.0.0.1' },
  test: { root: forgeDir, include: ['tests/**/*.test.ts'] },
});
