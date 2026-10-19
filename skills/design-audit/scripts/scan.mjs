#!/usr/bin/env node
// Static scan for generated-UI tells, design-system drift and grep-able a11y gaps.
// Read-only: walks the tree, reads text files, prints findings. No network, no exec, no writes.
// Usage: node scan.mjs [path] [--json] [--max N]
// Exit code is always 0 — this feeds a human/agent review, it is not a gate.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname, basename } from 'node:path';

const args = process.argv.slice(2);
const root = args.find((a) => !a.startsWith('--')) ?? process.cwd();
const asJson = args.includes('--json');
const maxIdx = args.indexOf('--max');
const maxLocations = maxIdx >= 0 ? Number(args[maxIdx + 1]) || 8 : 8;

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'out', '.next', '.nuxt', '.svelte-kit', '.expo',
  'coverage', 'android', 'ios', 'vendor', '.turbo', '.vercel', '.cache', 'storybook-static', 'release',
]);
const UI_EXT = new Set(['.css', '.scss', '.sass', '.less', '.html', '.jsx', '.tsx', '.js', '.ts', '.vue', '.svelte', '.astro']);
const MARKUP_EXT = new Set(['.html', '.jsx', '.tsx', '.vue', '.svelte', '.astro']);
// Files that legitimately hold raw values: the design system itself.
const TOKEN_FILE = /(theme|tokens?|colors?|palette|variables|tailwind\.config|globals?\.(s?css)|design-system|\.stories\.)/i;
const TEST_FILE = /\.(test|spec)\.[jt]sx?$|__tests__|__mocks__/;

// Monorepos keep the UI deps in a nested package.json, so merge every one in the tree.
/** @type {Record<string, string>} */
const deps = {};
function collectDeps(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || name.startsWith('.')) continue;
    const full = join(dir, name);
    if (name === 'package.json') {
      try {
        const pkg = JSON.parse(readFileSync(full, 'utf8'));
        Object.assign(deps, pkg.dependencies, pkg.devDependencies);
      } catch { /* malformed package.json: ignore, stack flags just stay off */ }
    } else if (statSync(full).isDirectory()) collectDeps(full);
  }
}
collectDeps(root);
const isReactNative = Boolean(deps['react-native'] || deps.expo);

/** @typedef {{ id: string, kind: 'tell' | 'drift' | 'a11y', note: string, re: RegExp, markupOnly?: boolean, skipTokenFiles?: boolean, skipRN?: boolean }} Rule */
/** @type {Rule[]} */
const RULES = [
  // Generated-UI tells. A single hit is a lead, not a verdict — see references/slop-catalog.md.
  { id: 'overused-font', kind: 'tell', note: 'Default "AI" typeface (Inter/Roboto/Geist/Plus Jakarta/Space Grotesk/Fraunces)',
    // Only the primary family counts: Roboto as a system fallback in the stack is not a choice.
    re: /font-?[fF]amily:\s*\[?\s*["'`]?(Inter|Roboto|Geist|Plus Jakarta Sans|Space Grotesk|Fraunces)\b|family=(Inter|Roboto|Geist|Plus\+Jakarta\+Sans|Space\+Grotesk|Fraunces)\b|@fontsource(-variable)?\/(inter|roboto|geist)|\b(Inter|Geist|Plus_Jakarta_Sans|Space_Grotesk|Fraunces)\(\s*\{/ },
  { id: 'ai-gradient', kind: 'tell', note: 'Purple/violet/indigo gradient',
    re: /\bfrom-(purple|violet|indigo|fuchsia)-\d{2,3}\b|linear-gradient\([^)]*(purple|violet|#(8b5cf6|7c3aed|6d28d9|a855f7|9333ea|6366f1|4f46e5|c084fc))/i },
  { id: 'gradient-text', kind: 'tell', note: 'Gradient-filled text',
    re: /\bbg-clip-text\b|background-clip:\s*text/ },
  { id: 'side-tab', kind: 'tell', note: 'Thick accent border on one side of a card',
    re: /\bborder-[lr]-([3-8])\b|\bborder-[lr]-\[\d+px\]|border-(left|right):\s*[3-9]px\s+solid|borderLeftWidth:\s*[3-9]\b/ },
  { id: 'colored-glow', kind: 'tell', note: 'Colored glow shadow (halo around cards/buttons)',
    re: /\bshadow-(purple|violet|indigo|blue|cyan|fuchsia|pink|emerald)-\d{3}(\/\d+)?\b|box-shadow:\s*0\s+0\s+\d+px[^;]*(rgba?\((?!\s*0\s*,\s*0\s*,\s*0)|#(?!000))/i },
  { id: 'bounce-easing', kind: 'tell', note: 'Bounce/elastic/overshoot easing',
    re: /\banimate-bounce\b|ease(In|Out|InOut)?(Back|Elastic|Bounce)\b|cubic-bezier\([^)]*,\s*1\.[0-9]+\s*\)/ },
  { id: 'decorative-ping', kind: 'tell', note: 'Pulsing dot; fine only if tied to live data',
    re: /\banimate-ping\b|animate-pulse[^"'`\n]{0,60}rounded-full|rounded-full[^"'`\n]{0,60}animate-pulse/ },
  { id: 'kicker-label', kind: 'tell', note: 'Tiny tracked uppercase label above a heading (eyebrow/kicker)',
    re: /\buppercase\b[^"'`\n]{0,80}\btracking-(wider|widest|\[0?\.[1-9])|\btracking-(wider|widest)\b[^"'`\n]{0,80}\buppercase\b/, markupOnly: true },
  { id: 'glass-blur', kind: 'tell', note: 'Glassmorphism (backdrop blur); check it is not on every surface',
    re: /\bbackdrop-blur(-\w+)?\b|backdrop-filter:\s*blur/ },
  { id: 'grid-background', kind: 'tell', note: 'Decorative hairline grid background',
    re: /bg-\[linear-gradient\(to_(right|bottom)|linear-gradient\(to (right|bottom),[^)]*1px/ },
  { id: 'buzzword-copy', kind: 'tell', note: 'Marketing buzzword in UI copy (EN/PT-BR)',
    re: /\b(seamless(ly)?|elevate[sd]?|unleash|supercharge|empower(s|ing)?|game[- ]chang\w*|next[- ]gen(eration)?|cutting[- ]edge|world[- ]class|revolutioni[sz]\w*|effortless(ly)?|unlock (your|the)|delve|sem esforço|de ponta|de última geração|revolucion\w+|potencialize|desbloqueie|impulsione|alavanqu\w+|eleve (seu|sua|o|a))\b/i, markupOnly: true },

  // Design-system drift: raw values where a token should be.
  { id: 'hardcoded-color', kind: 'drift', note: 'Literal color in a component (not a token file)',
    re: /(?<![\w-])#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b(?![\w-])|\brgba?\(\s*\d/, skipTokenFiles: true },
  { id: 'arbitrary-tw-value', kind: 'drift', note: 'Tailwind arbitrary value bypassing the scale',
    re: /\b[a-z]+(-[a-z]+)*-\[(#[0-9a-fA-F]{3,8}|\d+(\.\d+)?(px|rem|em))\]/, skipTokenFiles: true },
  { id: 'magic-z-index', kind: 'drift', note: 'Magic z-index (3+ digits)',
    re: /z-index:\s*\d{3,}|\bz-\[\d{3,}\]|zIndex:\s*\d{3,}/ },
  { id: 'inline-style', kind: 'drift', note: 'Inline style object in markup (web)',
    re: /style=\{\{/, markupOnly: true, skipRN: true },

  // a11y that grep can actually see. Rendered checks (contrast, targets) need the browser pass.
  { id: 'img-no-alt', kind: 'a11y', note: '<img> without alt',
    re: /<img(?![^>]*\balt=)[^>]*\/?>/ },
  { id: 'clickable-div', kind: 'a11y', note: 'onClick on a non-interactive element',
    re: /<(div|span|li|td)\b[^>]*\bonClick=/ },
  { id: 'outline-removed', kind: 'a11y', note: 'Focus outline removed; confirm a focus-visible replacement exists',
    re: /\boutline-none\b|outline:\s*(none|0)\b/ },
  { id: 'viewport-100vh', kind: 'a11y', note: '100vh/h-screen jumps on mobile browsers; prefer dvh/min-h-dvh',
    re: /\b100vh\b|\bh-screen\b/, skipRN: true },
];

/** @type {Map<string, { rule: Rule, hits: string[] }>} */
const found = new Map();
const colors = new Map();
const radii = new Set();
const fontSizes = new Set();
const emDashFiles = [];
let filesScanned = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || name.startsWith('.') && name !== '.storybook') continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (UI_EXT.has(extname(name)) && !/\.min\./.test(name) && st.size < 400_000) scanFile(full);
  }
}

function record(rule, rel, lineNo) {
  const entry = found.get(rule.id) ?? { rule, hits: [] };
  entry.hits.push(`${rel}:${lineNo}`);
  found.set(rule.id, entry);
}

function scanFile(file) {
  const rel = relative(root, file).replaceAll('\\', '/');
  if (TEST_FILE.test(rel)) return;
  filesScanned++;
  const ext = extname(file);
  const isMarkup = MARKUP_EXT.has(ext);
  const isTokenFile = TOKEN_FILE.test(basename(file)) || TOKEN_FILE.test(rel);
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  let emDashes = 0;

  lines.forEach((line, i) => {
    if (line.length > 1000) return; // minified or generated
    const trimmed = line.trim();
    if (/^(\/\/|\*|\/\*|import\b)/.test(trimmed)) return;
    const definesToken = /^--[\w-]+\s*:/.test(trimmed); // CSS custom property = the token itself
    for (const rule of RULES) {
      if (rule.markupOnly && !isMarkup) continue;
      if (rule.skipTokenFiles && (isTokenFile || definesToken)) continue;
      if (rule.skipRN && isReactNative) continue;
      if (rule.re.test(line)) record(rule, rel, i + 1);
    }
    for (const m of line.matchAll(/#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
      const hex = m[0].toLowerCase();
      colors.set(hex, (colors.get(hex) ?? 0) + 1);
    }
    for (const m of line.matchAll(/border-?[rR]adius:\s*['"]?([\d.]+(px|rem|%)?)|\brounded(-[a-z0-9]+)?-\[([^\]]+)\]/g)) radii.add(m[1] ?? m[4]);
    for (const m of line.matchAll(/font-?[sS]ize:\s*['"]?([\d.]+(px|rem|em)?)|\btext-\[(\d+(\.\d+)?(px|rem))\]/g)) fontSizes.add(m[1] ?? m[3]);
    if (isMarkup) emDashes += (line.match(/—/g) ?? []).length;
  });
  if (emDashes >= 3) emDashFiles.push(`${rel} (${emDashes})`);
}

walk(root);

const aggregates = {
  distinctHexColors: colors.size,
  distinctRadii: radii.size,
  distinctFontSizes: fontSizes.size,
  topColors: [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([c, n]) => `${c} x${n}`),
  emDashHeavyFiles: emDashFiles,
};

const result = {
  root: relative(process.cwd(), root) || '.',
  filesScanned,
  stack: { reactNative: isReactNative, tailwind: Boolean(deps.tailwindcss) },
  findings: [...found.values()]
    .sort((a, b) => a.rule.kind.localeCompare(b.rule.kind) || b.hits.length - a.hits.length)
    .map(({ rule, hits }) => ({ id: rule.id, kind: rule.kind, note: rule.note, count: hits.length, locations: hits.slice(0, maxLocations) })),
  aggregates,
};

if (asJson) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`design-audit scan: ${result.filesScanned} files in ${result.root} (RN: ${isReactNative}, tailwind: ${result.stack.tailwind})\n`);
  for (const kind of ['tell', 'drift', 'a11y']) {
    const group = result.findings.filter((f) => f.kind === kind);
    console.log(`## ${kind} (${group.length} rules hit)`);
    for (const f of group) {
      console.log(`- ${f.id} x${f.count}: ${f.note}`);
      for (const loc of f.locations) console.log(`    ${loc}`);
      if (f.count > f.locations.length) console.log(`    ... ${f.count - f.locations.length} more`);
    }
    console.log('');
  }
  console.log('## aggregates');
  console.log(`- distinct hex colors: ${aggregates.distinctHexColors} | radii: ${aggregates.distinctRadii} | font sizes: ${aggregates.distinctFontSizes}`);
  console.log(`- top colors: ${aggregates.topColors.join(', ')}`);
  if (emDashFiles.length) console.log(`- em-dash heavy UI files: ${emDashFiles.join(', ')}`);
}
