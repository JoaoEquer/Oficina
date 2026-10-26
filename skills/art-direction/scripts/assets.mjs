#!/usr/bin/env node
// Finds real pictures of a subject's world in open collections and records their credits.
// Source: Wikimedia Commons (no API key). Openverse, the Met and the Art Institute of Chicago were tried
// on 2026-10-26 and failed from the test machine (timeout, 410, 403), so they are not wired in; add one to
// SOURCES and HOSTS only after checking it answers. Downloads go to <out>/found/ and only from allowed hosts.
//
//   node assets.mjs "<query>" [--source commons|all] [--limit 8]
//   node assets.mjs --get <ref> [--name hero-map]      ref comes from a search result
//   node assets.mjs --credits                           prints the credit line for the footer
//
// By default only licences that allow commercial use are kept (CC0, public domain, CC BY, CC BY-SA).
// A picture shows the world around the client; never present it as the client's own product or people.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const val = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const out = resolve(val('--out', '.art-direction'));
const found = join(out, 'found');
const creditsFile = join(out, 'credits.json');
const cacheFile = join(out, 'search-cache.json');
const UA = { 'user-agent': 'art-direction-skill/1.0 (open-licence picture search)' };
const readJson = (f, d) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : d);
const OK_LICENCE = /^(cc0|pdm|by|by-sa|public domain|publicdomain|cc[- ]?by|cc[- ]?by[- ]?sa|oa)/i;

async function getJson(url) {
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${new URL(url).host}`);
  return res.json();
}

const SOURCES = {
  async commons(q, limit) {
    const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q + ' filetype:bitmap')}&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1600`;
    const d = await getJson(u);
    return Object.values(d.query?.pages ?? {}).map((p) => {
      const i = p.imageinfo?.[0]; const m = i?.extmetadata ?? {};
      return i && {
        source: 'commons', id: String(p.pageid), title: p.title.replace(/^File:/, ''), creator: strip(m.Artist?.value).slice(0, 80), licence: m.LicenseShortName?.value ?? '',
        page: i.descriptionurl, url: i.thumburl || i.url, width: i.width, height: i.height,
      };
    }).filter(Boolean);
  },
};
function strip(html = '') { return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }

// hosts a download may come from (each source's own image hosts)
const HOSTS = [/(^|\.)wikimedia\.org$/];

if (args.includes('--credits')) {
  const c = readJson(creditsFile, []);
  if (!c.length) { console.log('no pictures downloaded yet'); process.exit(0); }
  console.log('Pictures: ' + c.map((x) => `${x.title.replace(/\.[a-z]+$/i, '')}, ${x.creator || 'unknown'} (${x.licence}, ${x.page})`).join('; ') + '.');
  process.exit(0);
}

if (args.includes('--get')) {
  const ref = val('--get');
  const cache = readJson(cacheFile, {});
  const item = cache[ref];
  if (!item) { console.error(`unknown ref ${ref}. Search first; refs are printed next to each result.`); process.exit(1); }
  const host = new URL(item.url).hostname;
  if (!HOSTS.some((re) => re.test(host))) { console.error(`refusing to download from ${host}`); process.exit(1); }
  const res = await fetch(item.url, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(60000) });
  const type = res.headers.get('content-type') ?? '';
  if (!res.ok || !type.startsWith('image/')) { console.error(`not an image (${res.status} ${type})`); process.exit(1); }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > 15 * 1024 * 1024) { console.error('over 15 MB, pick a smaller one'); process.exit(1); }
  const ext = type.includes('png') ? 'png' : type.includes('webp') ? 'webp' : 'jpg';
  const name = (val('--name') ?? `${item.source}-${item.id}`).replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
  mkdirSync(found, { recursive: true });
  const file = join(found, `${name}.${ext}`);
  writeFileSync(file, buf);
  const credits = readJson(creditsFile, []).filter((c) => c.file !== file);
  credits.push({ file, title: item.title, creator: item.creator, licence: item.licence, page: item.page });
  writeFileSync(creditsFile, JSON.stringify(credits, null, 2));
  console.log(`saved ${file} (${Math.round(buf.length / 1024)} KB)\ncredit: ${item.title}, ${item.creator || 'unknown'}, ${item.licence}, ${item.page}\nLook at it before you use it.`);
  await new Promise((r) => setTimeout(r, 100)); // let the sockets close before exiting (Windows assertion otherwise)
  process.exit(0);
}

const query = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!query) { console.error('usage: node assets.mjs "<query>" [--source all] [--limit 8] | --get <ref> | --credits'); process.exit(2); }
const limit = Math.min(Number(val('--limit', 8)) || 8, 20);
const which = val('--source', 'all');
const names = which === 'all' ? Object.keys(SOURCES) : [which];
if (names.some((n) => !SOURCES[n])) { console.error(`--source must be ${Object.keys(SOURCES).join('|')}|all`); process.exit(2); }

const cache = readJson(cacheFile, {});
const settled = await Promise.allSettled(names.map((n) => SOURCES[n](query, limit)));
let shown = 0;
settled.forEach((r, i) => {
  if (r.status === 'rejected') { console.error(`[${names[i]}] failed: ${r.reason.message}`); return; }
  for (const it of r.value) {
    if (!OK_LICENCE.test(it.licence.replace(/^CC[- ]?/i, '').trim()) && !/public domain|cc0|cc by|oa/i.test(it.licence)) continue;
    const ref = `${it.source}:${it.id}`;
    cache[ref] = it;
    console.log(`${ref}\n  ${it.title} | ${it.creator || 'unknown'} | ${it.licence}${it.width ? ` | ${it.width}x${it.height}` : ''}\n  ${it.page}`);
    shown++;
  }
});
mkdirSync(out, { recursive: true });
writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
if (!shown) console.log('no results with a commercial-use licence. Try a more concrete query: the street, the material, the trade, the object.');
else console.log(`\n${shown} results. Download one with: node assets.mjs --get <ref> [--name <file-name>]`);
