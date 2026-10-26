#!/usr/bin/env node
// Renders a page in a real Chrome/Edge at three widths, measures it against the art-direction
// house rules and saves screenshots. No dependencies (Node 22+ WebSocket + the Chrome DevTools
// Protocol). Writes only to the output folder and a throwaway profile in the OS temp dir.
//
//   node inspect.mjs <url | path/to/index.html | folder> [--out .art-direction/inspect] [--widths 1440,768,390]
//
// Output: PASS/WARN/FAIL lines, screenshots, report.json. Exit code 1 when any FAIL.
// Override the browser with CHROME=/path/to/chrome.

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync, mkdtempSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, extname, sep } from 'node:path';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const target = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!target) {
  console.error('usage: node inspect.mjs <url | index.html | folder> [--out dir] [--widths 1440,768,390]');
  process.exit(2);
}
const outDir = resolve(flag('--out', '.art-direction/inspect'));
const widths = flag('--widths', '1440,768,390').split(',').map(Number).filter(Boolean);
mkdirSync(outDir, { recursive: true });

// ---- browser ---------------------------------------------------------------------------------
function findBrowser() {
  if (process.env.CHROME && existsSync(process.env.CHROME)) return process.env.CHROME;
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ];
  return candidates.find((p) => existsSync(p));
}

// ---- local server for files and folders -----------------------------------------------------
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon',
};
let server;
async function resolveTarget() {
  if (/^https?:\/\//i.test(target)) return target;
  const abs = resolve(target);
  if (!existsSync(abs)) throw new Error(`not found: ${abs}`);
  const isDir = statSync(abs).isDirectory();
  const root = isDir ? abs : resolve(abs, '..');
  const entry = isDir ? 'index.html' : abs.slice(root.length + 1).split(sep).join('/');
  server = createServer((req, res) => {
    const path = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = resolve(root, '.' + (path.endsWith('/') ? path + 'index.html' : path));
    if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404); res.end('not found'); return;
    }
    res.writeHead(200, { 'content-type': MIME[extname(file).toLowerCase()] || 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  return `http://127.0.0.1:${server.address().port}/${entry}`;
}

// ---- CDP client -----------------------------------------------------------------------------
class Cdp {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.listeners = [];
    ws.addEventListener('message', (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pending.has(m.id)) {
        const { ok, fail } = this.pending.get(m.id); this.pending.delete(m.id);
        m.error ? fail(new Error(m.error.message)) : ok(m.result);
      } else if (m.method) this.listeners.forEach((l) => l(m));
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((ok, fail) => {
      this.pending.set(id, { ok, fail });
      setTimeout(() => this.pending.has(id) && (this.pending.delete(id), fail(new Error(`timeout: ${method}`))), 45000);
    });
  }
  once(method, ms = 30000) {
    return new Promise((ok) => {
      const t = setTimeout(ok, ms);
      const l = (m) => { if (m.method === method) { clearTimeout(t); this.listeners = this.listeners.filter((x) => x !== l); ok(m.params); } };
      this.listeners.push(l);
    });
  }
}

// ---- in-page measurement (runs inside the browser) -----------------------------------------
function measure() {
  const vw = innerWidth, vh = innerHeight;
  const docH = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  const out = { vw, vh, docH, facts: {}, issues: [] };
  const add = (level, rule, msg) => out.issues.push({ level, rule, msg });
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const abs = (r) => ({ x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height });
  const lineH = (cs) => (cs.lineHeight === 'normal' ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight));
  const text = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim();

  // overflow
  const overflowX = document.documentElement.scrollWidth - innerWidth;
  if (overflowX > 1) add('FAIL', 'overflow-x', `page scrolls sideways by ${overflowX}px`);

  // title, lang, meta
  if (!document.title.trim()) add('WARN', 'title', 'no <title>');
  if (!document.documentElement.lang) add('WARN', 'lang', 'no lang attribute on <html>');
  if (!document.querySelector('meta[name=description]')) add('WARN', 'meta-description', 'no meta description');
  if (!document.querySelector('meta[name=viewport]')) add('FAIL', 'viewport', 'no viewport meta: the phone layout will not load');

  // headings
  const h1s = [...document.querySelectorAll('h1')].filter(visible);
  out.facts.h1 = h1s.map(text);
  if (h1s.length === 0) add('FAIL', 'h1', 'no visible <h1>: the first screen has no title');
  if (h1s.length > 1) add('WARN', 'h1', `${h1s.length} visible <h1>`);
  for (const h of [...document.querySelectorAll('h1,h2')].filter(visible)) {
    const cs = getComputedStyle(h);
    const lines = Math.round(h.getBoundingClientRect().height / lineH(cs));
    if (lines > 2) add(h.tagName === 'H1' ? 'FAIL' : 'WARN', 'headline-lines', `${h.tagName} runs ${lines} lines (${text(h).slice(0, 50)}...)`);
  }
  const hero = h1s[0];
  if (hero) {
    const r = hero.getBoundingClientRect();
    if (r.top + scrollY > vh) add('FAIL', 'h1-first-screen', 'the h1 starts below the first screen');
    const fs = parseFloat(getComputedStyle(hero).fontSize);
    if (fs < vw * 0.032 && vw >= 1024) add('WARN', 'hero-size', `h1 is ${Math.round(fs)}px at ${vw}px wide: the big thing is not big`);
    out.facts.heroFont = getComputedStyle(hero).fontFamily.split(',')[0].replace(/["']/g, '').trim();
  }
  out.facts.bodyFont = getComputedStyle(document.body).fontFamily.split(',')[0].replace(/["']/g, '').trim();
  const generic = /^(system-ui|-apple-system|blinkmacsystemfont|segoe ui|arial|helvetica|helvetica neue|sans-serif|serif|roboto|inter)$/i;
  if (generic.test(out.facts.heroFont || '') && generic.test(out.facts.bodyFont)) {
    add('WARN', 'type-default', `headline and body both use ${out.facts.heroFont}: no typeface was chosen`);
  }

  // sections without a heading
  const sections = [...document.querySelectorAll('section')].filter(visible);
  const untitled = sections.filter((s) => !s.querySelector('h1,h2,h3,[role=heading]') && !s.getAttribute('aria-label'));
  if (untitled.length) add('WARN', 'untitled-section', `${untitled.length} of ${sections.length} sections have no heading`);

  // pictures
  let pics = 0, vids = 0;
  for (const img of document.images) {
    if (!visible(img)) continue;
    const r = img.getBoundingClientRect();
    const isSvg = /\.svg(\?|$)/i.test(img.currentSrc || img.src) || (img.currentSrc || '').startsWith('data:image/svg');
    if (!isSvg && r.width >= 120 && r.height >= 90 && img.naturalWidth >= 200) pics++;
    if (!img.hasAttribute('alt')) add('WARN', 'img-alt', `image without alt: ${(img.currentSrc || img.src).slice(-60)}`);
    if (img.complete && img.naturalWidth === 0) add('FAIL', 'img-broken', `image failed to load: ${(img.src || '').slice(-60)}`);
  }
  for (const v of document.querySelectorAll('video')) if (visible(v)) { vids++; pics++; }
  for (const el of document.querySelectorAll('*')) {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg.includes('url(') && !/svg/i.test(bg) && !bg.includes('gradient')) {
      const r = el.getBoundingClientRect();
      if (r.width >= 120 && r.height >= 90 && visible(el)) pics++;
    }
  }
  out.facts.pictures = pics; out.facts.videos = vids;
  if (pics < 2) add('FAIL', 'pictures', `${pics} real pictures on the page (floor is 4)`);
  else if (pics < 4) add('WARN', 'pictures', `${pics} real pictures on the page (floor is 4)`);

  // text elements (leaf-ish) for contrast, size, edges
  const leaves = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || seen.has(el) || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName) || !visible(el)) continue;
    seen.add(el); leaves.push(el);
  }
  const parseColor = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = ({ r, g, b }) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const bgOf = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage !== 'none') return null; // image or gradient behind: cannot judge
      const c = parseColor(cs.backgroundColor);
      if (c && c.a > 0.95) return c;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  let lowContrast = 0, tiny = 0, edge = 0;
  const lowSamples = [];
  for (const el of leaves.slice(0, 600)) {
    const cs = getComputedStyle(el);
    const fg = parseColor(cs.color), bg = bgOf(el);
    const size = parseFloat(cs.fontSize);
    if (fg && bg && fg.a > 0.5) {
      const a = lum(fg), b = lum(bg);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const large = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
      if (ratio < (large ? 3 : 4.5)) { lowContrast++; if (lowSamples.length < 3) lowSamples.push(`${text(el).slice(0, 30)} (${ratio.toFixed(1)}:1)`); }
    }
    if (size < 12 && text(el).length > 3) tiny++;
    const r = el.getBoundingClientRect();
    if (r.width < vw - 4 && (r.left < 10 || r.right > vw - 10) && text(el).length > 8 && !/^(A|BUTTON)$/.test(el.tagName)) edge++;
  }
  if (lowContrast) add(lowContrast > 5 ? 'FAIL' : 'WARN', 'contrast', `${lowContrast} text elements under WCAG contrast, e.g. ${lowSamples.join('; ')}`);
  if (tiny) add('WARN', 'tiny-text', `${tiny} text elements under 12px`);
  if (edge) add('WARN', 'text-at-edge', `${edge} text elements sit within 10px of the screen edge`);
  const paras = [...document.querySelectorAll('p,li')].filter((e) => visible(e) && text(e).length > 60);
  const small = paras.filter((p) => parseFloat(getComputedStyle(p).fontSize) < 15);
  if (paras.length && small.length / paras.length > 0.5) add('WARN', 'body-size', `running text is under 15px in ${small.length} of ${paras.length} paragraphs`);

  // content map: blank stretches and near-empty screens
  const boxes = [];
  const contentSel = 'h1,h2,h3,h4,h5,h6,p,li,a,button,img,video,canvas,svg,input,textarea,select,figure,table,blockquote,[role=img]';
  for (const el of document.querySelectorAll(contentSel)) {
    if (!visible(el)) continue;
    if (el.closest('svg') && el.tagName !== 'svg') continue;
    const r = abs(el.getBoundingClientRect());
    if (r.w * r.h < 400 || r.h > docH * 0.9) continue;
    if (['LI', 'P', 'A', 'FIGURE', 'TABLE', 'BLOCKQUOTE'].includes(el.tagName) && !text(el) && !el.querySelector('img,svg,video')) continue;
    boxes.push(r);
  }
  // text that lives in plain div/span/pre/code/td (terminals, tables, custom blocks) is content too
  for (const el of document.querySelectorAll('div,span,pre,code,td,th,dt,dd,label,summary')) {
    if (!visible(el) || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
    const r = abs(el.getBoundingClientRect());
    if (r.w * r.h >= 400 && r.h < docH * 0.9) boxes.push(r);
  }
  for (const el of document.querySelectorAll('*')) {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg.includes('url(') && !/svg/i.test(bg) && visible(el)) { const r = abs(el.getBoundingClientRect()); if (r.h < docH * 0.9) boxes.push(r); }
  }
  boxes.sort((a, b) => a.y - b.y);
  let cursor = 0, maxGap = 0, gapAt = 0;
  for (const b of boxes) {
    if (b.y > cursor && b.y - cursor > maxGap) { maxGap = b.y - cursor; gapAt = cursor; }
    cursor = Math.max(cursor, b.y + b.h);
  }
  if (docH - cursor > maxGap) { maxGap = docH - cursor; gapAt = cursor; }
  out.facts.largestGap = Math.round(maxGap);
  if (maxGap > vh * 0.9) add('FAIL', 'blank-stretch', `${Math.round(maxGap)}px with nothing in it, starting at y=${Math.round(gapAt)}`);
  else if (maxGap > vh * 0.55) add('WARN', 'blank-stretch', `${Math.round(maxGap)}px with nothing in it, starting at y=${Math.round(gapAt)}`);
  let emptyScreens = 0;
  for (let y = 0; y + vh * 0.9 <= docH; y += vh) {
    let area = 0;
    for (const b of boxes) {
      const top = Math.max(b.y, y), bot = Math.min(b.y + b.h, y + vh);
      if (bot > top) area += (bot - top) * Math.min(b.w, vw);
    }
    if (area / (vw * vh) < 0.06) emptyScreens++;
  }
  out.facts.emptyScreens = emptyScreens;
  if (emptyScreens >= 2) add('FAIL', 'empty-screens', `${emptyScreens} screens are almost empty (one deliberate rest is the limit)`);
  else if (emptyScreens === 1) add('WARN', 'empty-screens', '1 screen is almost empty: make it a deliberate rest or fill it');

  // frame: equal outer margins
  let minL = vw, maxR = 0;
  for (const el of leaves) {
    const r = el.getBoundingClientRect();
    if (r.width >= vw - 4 || text(el).length < 20) continue;
    minL = Math.min(minL, r.left); maxR = Math.max(maxR, r.right);
  }
  if (maxR > 0 && vw >= 768) {
    const ml = minL, mr = vw - maxR;
    out.facts.margins = [Math.round(ml), Math.round(mr)];
    if (Math.abs(ml - mr) > Math.max(48, vw * 0.12)) add('WARN', 'frame', `outer margins differ: ${Math.round(ml)}px left, ${Math.round(mr)}px right`);
  }

  // tells
  const caps = leaves.filter((el) => {
    const cs = getComputedStyle(el);
    return parseFloat(cs.fontSize) <= 14 && (cs.textTransform === 'uppercase' || parseFloat(cs.letterSpacing) >= 1.2) && text(el).length < 40 &&
      el.nextElementSibling && /^H[1-3]$/.test(el.nextElementSibling.tagName);
  });
  if (caps.length >= 2) add('WARN', 'eyebrow-labels', `${caps.length} small uppercase labels sit above headings`);
  const numbered = leaves.filter((el) => /^0?[1-9]$/.test(text(el)) || /^0[1-9]\s*[\/.\-]/.test(text(el)));
  if (numbered.length >= 3) add('WARN', 'numbered-markers', `${numbered.length} 01/02/03 markers: only keep them if the content is a real sequence`);
  const gradText = leaves.filter((el) => { const cs = getComputedStyle(el); return (cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text') && cs.backgroundImage.includes('gradient'); });
  if (gradText.length) add('WARN', 'gradient-text', `${gradText.length} gradient-filled text elements`);
  let gradients = 0, shadows = 0, cards = 0;
  for (const el of document.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.backgroundImage.includes('gradient') && el.getBoundingClientRect().width > 200) gradients++;
    if (cs.boxShadow !== 'none' && !/inset/.test(cs.boxShadow)) shadows++;
    if (cs.borderRadius !== '0px' && parseFloat(cs.borderRadius) >= 8 && cs.boxShadow !== 'none' && el.getBoundingClientRect().width > 200 && el.getBoundingClientRect().width < 600) cards++;
  }
  out.facts.gradients = gradients; out.facts.shadows = shadows; out.facts.cards = cards;
  if (gradients >= 3) add('WARN', 'gradients', `${gradients} large gradient fills`);
  if (shadows >= 6) add('WARN', 'resting-shadows', `${shadows} elements carry a resting shadow`);
  if (cards >= 6) add('WARN', 'card-kit', `${cards} rounded shadowed cards of similar size: the SaaS card kit`);

  // stock copy
  const STOCK = [
    /\belevate\b/i, /\bunlock\b/i, /\bseamless(ly)?\b/i, /\brevolutioni[sz]e/i, /\bempower/i, /cutting[- ]edge/i,
    /next[- ]gen(eration)?\b/i, /game[- ]chang/i, /\bsupercharge/i, /\ball[- ]in[- ]one\b/i, /to the next level/i,
    /fast[- ]paced world/i, /\bstreamline/i, /\bleverage\b/i, /\bholistic\b/i, /\bunleash/i, /crafted with (love|passion|care)/i,
    /\bworld[- ]class\b/i, /\bstate[- ]of[- ]the[- ]art\b/i, /take (it|your \w+) to the next/i, /lorem ipsum/i,
    /\btransform your\b/i, /\bwelcome to\b/i,
  ];
  const body = document.body.innerText || '';
  const hits = [...new Set(STOCK.map((re) => (body.match(re) || [])[0]).filter(Boolean))];
  if (hits.length) add(hits.includes('Lorem ipsum') || /lorem/i.test(hits.join()) ? 'FAIL' : 'WARN', 'stock-copy', `stock phrases: ${hits.slice(0, 8).join(', ')}`);

  // a11y basics
  const emptyLinks = [...document.querySelectorAll('a,button')].filter((e) => visible(e) && !text(e) && !e.getAttribute('aria-label') && !e.querySelector('img[alt]:not([alt=""])') && !e.getAttribute('title'));
  if (emptyLinks.length) add('WARN', 'empty-control', `${emptyLinks.length} links or buttons with no accessible name`);
  const reduced = [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.media && /prefers-reduced-motion/.test(r.media.mediaText)); } catch { return false; } });
  out.facts.reducedMotionRule = reduced;
  return out;
}

// ---- run ------------------------------------------------------------------------------------
const browser = findBrowser();
if (!browser) { console.error('No Chrome/Edge/Chromium found. Set CHROME=/path/to/browser.'); process.exit(2); }
const url = await resolveTarget();
const profile = mkdtempSync(join(tmpdir(), 'art-direction-'));
const proc = spawn(browser, [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
  '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', 'about:blank',
], { stdio: 'ignore' });

async function cleanup() {
  try { proc.kill(); } catch { /* already gone */ }
  server?.close();
  await new Promise((r) => setTimeout(r, 400));
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch { /* temp dir, not critical */ }
}

const results = [];
try {
  // DevToolsActivePort holds the chosen port on its first line
  let port;
  for (let i = 0; i < 100 && !port; i++) {
    await new Promise((r) => setTimeout(r, 150));
    const f = join(profile, 'DevToolsActivePort');
    if (existsSync(f)) port = readFileSync(f, 'utf8').split('\n')[0].trim();
  }
  if (!port) throw new Error('browser did not open its debugging port');
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((ok, fail) => { ws.addEventListener('open', ok); ws.addEventListener('error', fail); });
  const cdp = new Cdp(ws);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  for (const width of widths) {
    const height = width >= 1024 ? 900 : width >= 600 ? 1024 : 844;
    await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    const loaded = cdp.once('Page.loadEventFired', 30000);
    await cdp.send('Page.navigate', { url });
    await loaded;
    await new Promise((r) => setTimeout(r, 900));
    // walk the page so reveal-on-scroll content and lazy images appear, then return to the top
    await cdp.send('Runtime.evaluate', {
      awaitPromise: true,
      expression: `(async () => { const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); await new Promise(r => setTimeout(r, 400)); })()`,
    });
    const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
      expression: `(${measure.toString()})()`, returnByValue: true,
    });
    if (exceptionDetails) throw new Error(`measure failed: ${exceptionDetails.exception?.description || exceptionDetails.text}`);
    const m = result.value;
    const docH = Math.min(m.docH, 9000);
    const first = join(outDir, `${width}-first-screen.jpg`);
    const full = join(outDir, `${width}-full.jpg`);
    const shot = async (file, clip) => {
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 72, captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: clip, scale: 1 } });
      writeFileSync(file, Buffer.from(data, 'base64'));
    };
    await shot(first, height);
    await shot(full, docH);
    results.push({ width, ...m, screenshots: [first, full] });
  }
  ws.close();
} catch (err) {
  console.error(`inspect failed: ${err.message}`);
  await cleanup();
  process.exit(2);
}
await cleanup();

// ---- report ---------------------------------------------------------------------------------
let fails = 0, warns = 0;
for (const r of results) {
  console.log(`\n== ${r.width}px  (page ${r.docH}px tall, ${r.facts.pictures} pictures, largest blank ${r.facts.largestGap}px, ${r.facts.emptyScreens} empty screens)`);
  if (!r.issues.length) console.log('PASS  nothing measured against the rules');
  for (const i of r.issues) {
    console.log(`${i.level.padEnd(4)}  ${i.rule}: ${i.msg}`);
    i.level === 'FAIL' ? fails++ : warns++;
  }
  console.log(`shots  ${r.screenshots.join('  ')}`);
}
writeFileSync(join(outDir, 'report.json'), JSON.stringify({ url, results }, null, 2));
console.log(`\n${fails} FAIL, ${warns} WARN. Passing the meter is not the same as a good page: open the screenshots and critique them (references/critique.md).`);
process.exit(fails ? 1 : 0);
