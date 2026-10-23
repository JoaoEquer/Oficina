import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { runExport } from '../scripts/lib/run';
import { CACHE_FILE } from '../scripts/lib/roblox-cache';
import type { GameConfig } from '../scripts/lib/types';
import { makeSandbox, PNG_BYTES } from './helpers';

const game: GameConfig = { name: 'r', target: 'roblox', destination: 'out/roblox' };
const ENV = { ROBLOX_API_KEY: 'test-key-not-real', ROBLOX_CREATOR_ID: '123', ROBLOX_CREATOR_TYPE: 'User' };

interface Call {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: BodyInit | null;
}

/** Mocks Open Cloud: POST returns an operation, the first poll is pending, the second is done. */
function mockApi(assetIds: string[]) {
  const calls: Call[] = [];
  let polls = 0;
  const fetchImpl = (async (url: string, init?: RequestInit) => {
    calls.push({ method: init?.method ?? 'GET', url, headers: (init?.headers ?? {}) as Record<string, string>, body: init?.body });
    if (init?.method === 'POST') {
      return new Response(JSON.stringify({ path: `operations/op${calls.length}` }), { status: 200 });
    }
    polls += 1;
    if (polls % 2 === 1) return new Response(JSON.stringify({ done: false }), { status: 200 });
    const assetId = assetIds.shift() ?? '0';
    return new Response(JSON.stringify({ done: true, response: { assetId } }), { status: 200 });
  }) as unknown as typeof fetch;
  return { calls, fetchImpl };
}

const sleeps: number[] = [];
const sleep = async (ms: number) => {
  sleeps.push(ms);
};

describe('roblox target', () => {
  const files = { 'galaxy/ui/ui_button_hover_01.png': PNG_BYTES };

  it('uploads, polls the operation, caches by hash and writes a Rojo ModuleScript', async () => {
    const sandbox = makeSandbox(files, [game]);
    const api = mockApi(['9001']);
    await runExport({ forgeDir: sandbox.forgeDir, config: sandbox.config, game: 'r', all: true, env: ENV, fetchImpl: api.fetchImpl, sleep });

    const post = api.calls[0];
    expect(post?.method).toBe('POST');
    expect(post?.url).toBe('https://apis.roblox.com/assets/v1/assets');
    expect(post?.headers['x-api-key']).toBe('test-key-not-real');
    const form = post?.body as FormData;
    const request = JSON.parse(form.get('request') as string) as {
      assetType: string;
      displayName: string;
      creationContext: { creator: { userId: string } };
    };
    expect(request.assetType).toBe('Decal');
    expect(request.displayName).toBe('ui_button_hover_01');
    expect(request.creationContext.creator).toEqual({ userId: '123' });
    expect(api.calls[1]?.url).toBe('https://apis.roblox.com/assets/v1/operations/op1');
    expect(sleeps.length).toBeGreaterThan(0);

    const lua = readFileSync(join(sandbox.forgeDir, 'out/roblox/Assets.lua'), 'utf8');
    expect(lua).toContain('return {');
    expect(lua).toContain('\tui_button_hover_01 = "rbxassetid://9001",');
    expect(lua).toContain('ResampleMode');

    const cache = JSON.parse(readFileSync(join(sandbox.forgeDir, CACHE_FILE), 'utf8')) as Record<string, string>;
    expect(Object.values(cache)).toEqual(['9001']);
  });

  it('does not upload again when the file hash is already cached', async () => {
    const sandbox = makeSandbox(files, [game]);
    const first = mockApi(['9001']);
    await runExport({ forgeDir: sandbox.forgeDir, config: sandbox.config, game: 'r', all: true, env: ENV, fetchImpl: first.fetchImpl, sleep });

    const second = mockApi(['9002']);
    await runExport({ forgeDir: sandbox.forgeDir, config: sandbox.config, game: 'r', all: true, env: ENV, fetchImpl: second.fetchImpl, sleep });

    expect(second.calls).toHaveLength(0);
    const lua = readFileSync(join(sandbox.forgeDir, 'out/roblox/Assets.lua'), 'utf8');
    expect(lua).toContain('rbxassetid://9001');
    expect(lua).not.toContain('9002');
  });

  it('fails without credentials and never calls the API', async () => {
    const sandbox = makeSandbox(files, [game]);
    const api = mockApi([]);
    await expect(
      runExport({ forgeDir: sandbox.forgeDir, config: sandbox.config, game: 'r', all: true, env: {}, fetchImpl: api.fetchImpl, sleep }),
    ).rejects.toThrow(/ROBLOX_API_KEY/);
    expect(api.calls).toHaveLength(0);
    expect(existsSync(join(sandbox.forgeDir, CACHE_FILE))).toBe(false);
  });

  it('reports an HTTP failure without leaking the key and does not cache it', async () => {
    const sandbox = makeSandbox(files, [game]);
    const fetchImpl = (async () => new Response('denied', { status: 403 })) as unknown as typeof fetch;
    const run = runExport({ forgeDir: sandbox.forgeDir, config: sandbox.config, game: 'r', all: true, env: ENV, fetchImpl, sleep });
    await expect(run).rejects.toThrow(/HTTP 403/);
    await expect(run).rejects.not.toThrow(/test-key-not-real/);
    expect(existsSync(join(sandbox.forgeDir, CACHE_FILE))).toBe(false);
  });

  it('uses groupId when the creator is a group', async () => {
    const sandbox = makeSandbox(files, [game]);
    const api = mockApi(['7']);
    await runExport({
      forgeDir: sandbox.forgeDir,
      config: sandbox.config,
      game: 'r',
      all: true,
      env: { ...ENV, ROBLOX_CREATOR_TYPE: 'Group' },
      fetchImpl: api.fetchImpl,
      sleep,
    });
    const request = JSON.parse(((api.calls[0]?.body as FormData).get('request')) as string) as {
      creationContext: { creator: Record<string, string> };
    };
    expect(request.creationContext.creator).toEqual({ groupId: '123' });
  });
});
