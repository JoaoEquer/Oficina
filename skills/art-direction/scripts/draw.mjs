#!/usr/bin/env node
// Deals art directions from library/directions.json so the choice does not collapse to the category
// default. Zero dependencies; writes only to the work folder (default .art-direction/).
//
//   node draw.mjs --list sectors|tones|roles|directions
//   node draw.mjs --sector software --brief "one line" [--tone quiet] [--have photography,product-ui]
//                 [--sections features,how-it-works,pricing,faq,cta,footer] [--options 3] [--seed 7]
//   node draw.mjs <same args> --direction <id> [--keep palette,type]   -> full sheet
//   node draw.mjs --redraw type|palette|section:<role>|direction  (needs a prior sheet; say why in the report)
//   node draw.mjs --show
//
// Recent directions are remembered in recent.json so consecutive projects do not repeat.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const lib = JSON.parse(readFileSync(join(here, '..', 'library', 'directions.json'), 'utf8'));
const args = process.argv.slice(2);
const has = (n) => args.includes(n);
const val = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
const work = resolve(val('--out', '.art-direction'));
mkdirSync(work, { recursive: true });
const sheetFile = join(work, 'sheet.json');
const recentFile = join(work, 'recent.json');
const readJson = (f, d) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : d);

const SECTORS = [...new Set(lib.directions.flatMap((d) => d.sectors))].sort();
const TONES = [...new Set([...lib.directions.flatMap((d) => d.tones), ...lib.palettes.flatMap((p) => p.moods)])].sort();
const ROLES = Object.keys(lib.sections);

// small seeded generator so a draw can be reproduced with --seed
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32); }
const seed = Number(val('--seed', Date.now() % 100000));
const rand = rng(seed);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];

if (val('--list')) {
  const what = val('--list');
  const lists = { sectors: SECTORS, tones: TONES, roles: ROLES, directions: lib.directions.map((d) => `${d.id}: ${d.engine}`) };
  if (!lists[what]) { console.error('--list sectors|tones|roles|directions'); process.exit(2); }
  console.log(lists[what].join('\n'));
  process.exit(0);
}
if (has('--show')) {
  const s = readJson(sheetFile);
  if (!s) { console.error('no sheet yet'); process.exit(1); }
  console.log(render(s));
  process.exit(0);
}

const brief = val('--brief', '');
const sector = val('--sector');
const tone = val('--tone');
const have = (val('--have', '') || '').split(',').filter(Boolean);
const sections = (val('--sections', 'features,how-it-works,proof,pricing,faq,cta,footer') || '').split(',').filter(Boolean);
const keep = (val('--keep', '') || '').split(',').filter(Boolean);
const recent = readJson(recentFile, []);

if (has('--redraw')) {
  const sheet = readJson(sheetFile);
  if (!sheet) { console.error('--redraw needs a sheet: run with --direction first'); process.exit(1); }
  const what = val('--redraw');
  if (what === 'type') sheet.type = pickType(sheet.inputs.tone, sheet.type.id);
  else if (what === 'palette') sheet.palette = pickPalette(sheet.inputs.tone, sheet.palette.id);
  else if (what.startsWith('section:')) {
    const [role, id] = what.slice(8).split('=');
    const options = lib.sections[role];
    if (!options) { console.error(`unknown role ${role}`); process.exit(2); }
    sheet.sections[role] = id ? options.find((o) => o.id === id) ?? options[0] : pick(options.filter((o) => o.id !== sheet.sections[role]?.id));
  } else if (what === 'direction') { console.error('redraw the direction by running again with --direction <id>'); process.exit(2); }
  else { console.error('--redraw type|palette|section:<role>[=id]'); process.exit(2); }
  sheet.redraws = [...(sheet.redraws ?? []), what];
  writeFileSync(sheetFile, JSON.stringify(sheet, null, 2));
  console.log(render(sheet));
  process.exit(0);
}

if (!sector || !SECTORS.includes(sector)) {
  console.error(`--sector is required. One of: ${SECTORS.join(', ')}`);
  process.exit(2);
}
if (tone && !TONES.includes(tone)) { console.error(`--tone must be one of: ${TONES.join(', ')}`); process.exit(2); }

function score(d) {
  let s = 1;
  if (d.sectors.includes(sector)) s += 3;
  if (tone && d.tones.includes(tone)) s += 2;
  const missing = d.needs.filter((n) => !have.includes(n));
  if (missing.length) s -= 100;
  const age = recent.indexOf(d.id);
  if (age >= 0) s -= 3 - Math.min(age, 2);
  return s;
}
function pickType(t, avoid) {
  const pool = lib.type.filter((x) => (!t || x.tones.includes(t)) && x.id !== avoid);
  return pick(pool.length ? pool : lib.type.filter((x) => x.id !== avoid));
}
function pickPalette(t, avoid) {
  const pool = lib.palettes.filter((x) => (!t || x.moods.includes(t)) && x.id !== avoid);
  return pick(pool.length ? pool : lib.palettes.filter((x) => x.id !== avoid));
}

const directionId = val('--direction');
if (!directionId) {
  const n = Math.min(Number(val('--options', 3)) || 3, 5);
  const pool = lib.directions.map((d) => ({ d, s: score(d) })).filter((x) => x.s > 0);
  const dealt = [];
  while (dealt.length < n && pool.length) {
    // weighted draw without replacement
    const total = pool.reduce((a, x) => a + x.s, 0);
    let r = rand() * total, i = 0;
    for (; i < pool.length - 1; i++) { r -= pool[i].s; if (r <= 0) break; }
    dealt.push(pool.splice(i, 1)[0].d);
  }
  console.log(`Seed ${seed}. Brief: ${brief || '(none)'} | sector: ${sector}${tone ? ` | tone: ${tone}` : ''}${have.length ? ` | have: ${have.join(',')}` : ''}\n`);
  for (const d of dealt) console.log(`- ${d.id}  (${d.name})\n    engine: ${d.engine}\n    hero:   ${d.hero}\n    risk:   ${d.risks}\n`);
  console.log('Hold each against the subject inventory. Pick the one that can carry something only this client has, then run again with --direction <id> (same arguments).');
  process.exit(0);
}

const direction = lib.directions.find((d) => d.id === directionId);
if (!direction) { console.error(`unknown direction ${directionId}. See --list directions`); process.exit(2); }
const missing = direction.needs.filter((n) => !have.includes(n));
if (missing.length) console.error(`note: ${direction.id} wants ${missing.join(', ')} and --have does not list it. Fill that slot honestly or pick another direction.`);

const prior = readJson(sheetFile);
const sheet = {
  seed, inputs: { brief, sector, tone, have, keep },
  direction,
  palette: keep.includes('palette') ? null : pickPalette(tone),
  type: keep.includes('type') ? null : pickType(tone),
  sections: Object.fromEntries(sections.filter((r) => lib.sections[r]).map((r) => [r, pick(lib.sections[r])])),
  freeSections: sections.filter((r) => !lib.sections[r]),
  redraws: prior?.direction?.id && prior.direction.id !== directionId ? [`direction:${prior.direction.id}->${directionId}`] : [],
};
writeFileSync(sheetFile, JSON.stringify(sheet, null, 2));
writeFileSync(join(work, 'sheet.md'), render(sheet));
writeFileSync(recentFile, JSON.stringify([directionId, ...recent.filter((x) => x !== directionId)].slice(0, 6)));
console.log(render(sheet));

function render(s) {
  const d = s.direction;
  const L = [];
  L.push(`# Direction sheet  (seed ${s.seed})`, '');
  L.push(`Brief: ${s.inputs.brief || '(none)'} | sector: ${s.inputs.sector}${s.inputs.tone ? ` | tone: ${s.inputs.tone}` : ''}`, '');
  L.push(`## Direction: ${d.name} (${d.id})`, `Engine: ${d.engine}`, `Hero: ${d.hero}`, `Sections: ${d.sections}`, `Risk: ${d.risks}`, `Where it disagrees with the house rules: ${d.disagrees}`, '');
  if (s.palette) {
    L.push(`## Palette: ${s.palette.id}`, Object.entries(s.palette.roles).map(([k, v]) => `${k} ${v}`).join(' | '), `Proportions: ${s.palette.proportions}`, '');
    L.push('Check it against the subject: if its colors fight the subject\'s own material, or the subject has unmistakable colors of its own, keep the proportions and take the colors from the subject. Say so in the report.', '');
  } else L.push('## Palette: kept from the brand. Map the brand values onto ground / ink / accent / field.', '');
  if (s.type) L.push(`## Type: ${s.type.id}`, `Display: ${s.type.display} | Body: ${s.type.body} | ${s.type.source}`, s.type.note, '');
  else L.push('## Type: kept from the brand.', '');
  L.push('## Sections');
  for (const [role, o] of Object.entries(s.sections)) L.push(`- ${role} [${o.id}]: ${o.text}`);
  for (const r of s.freeSections) L.push(`- ${r}: not in the library; compose it from the argument and the idea, and make it differ from its neighbours.`);
  L.push('', 'Neighbouring sections must not share a layout. If a dealt section cannot hold the real content, list the alternatives in library/directions.json and take another with --redraw section:<role>=<id>.');
  if (s.redraws?.length) L.push('', `Redraws so far (state the reason for each in the report): ${s.redraws.join(', ')}`);
  return L.join('\n');
}
