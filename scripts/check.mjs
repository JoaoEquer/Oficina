#!/usr/bin/env node
// Oficina — consistency check for the pack itself. Zero dependencies.
//   node scripts/check.mjs
// Checks:
//   1. every skills/<dir>/SKILL.md has frontmatter with name == dir and a description
//   2. every skill dir is listed in AGENTS.md, and the README skill count matches skills/
//   3. relative links in README.md, AGENTS.md, ROADMAP.md, docs/*.md resolve
//   4. no tracked file mentions a term from the private deny-list (see below)
//
// Deny-list: this repo is public, so the list itself cannot live here. Put one
// term (case-insensitive, plain text) per line in .oficina/forbidden-terms.txt
// (gitignored) or in the FORBIDDEN_TERMS env var (comma-separated, e.g. a CI secret).
// With no list, check 4 is skipped and says so.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (m) => errors.push(m);

// 1 + 2 — skills
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const agents = readFileSync(join(root, 'AGENTS.md'), 'utf8');
const skillsDir = join(root, 'skills');
const skills = readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory());
for (const dir of skills) {
  const file = join(skillsDir, dir, 'SKILL.md');
  if (!existsSync(file)) { fail(`skills/${dir}: SKILL.md missing`); continue; }
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) { fail(`skills/${dir}/SKILL.md: no frontmatter`); continue; }
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, '');
  const desc = fm[1].match(/^description:\s*(.+)$/m)?.[1].trim().replace(/^["']|["']$/g, '');
  if (name !== dir) fail(`skills/${dir}/SKILL.md: frontmatter name "${name}" != directory`);
  if (!desc) fail(`skills/${dir}/SKILL.md: description missing`);
  else if (desc.length > 1024) fail(`skills/${dir}/SKILL.md: description is ${desc.length} chars (max 1024)`);
  if (!agents.includes(dir)) fail(`skills/${dir}: not listed in AGENTS.md`);
}

const count = readme.match(/(\d+) skills/)?.[1];
if (count && Number(count) !== skills.length) fail(`README.md says ${count} skills, skills/ has ${skills.length}`);

// 3 — relative links
const docs = ['README.md', 'AGENTS.md', 'ROADMAP.md', ...(existsSync(join(root, 'docs'))
  ? readdirSync(join(root, 'docs')).filter((f) => f.endsWith('.md')).map((f) => `docs/${f}`) : [])]
  .filter((f) => existsSync(join(root, f)));
for (const doc of docs) {
  const text = readFileSync(join(root, doc), 'utf8').replace(/```[\s\S]*?```/g, '');
  for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    const target = m[1].split('#')[0];
    if (!target || /^[a-z]+:/i.test(target)) continue;
    if (!existsSync(resolve(root, dirname(doc), target))) fail(`${doc}: broken link -> ${m[1]}`);
  }
}

// 4 — deny-list
let terms = (process.env.FORBIDDEN_TERMS ?? '').split(',');
const local = join(root, '.oficina', 'forbidden-terms.txt');
if (existsSync(local)) terms = terms.concat(readFileSync(local, 'utf8').split('\n'));
terms = terms.map((t) => t.trim().toLowerCase()).filter(Boolean);
if (terms.length === 0) {
  console.log('[skip] deny-list: no .oficina/forbidden-terms.txt or FORBIDDEN_TERMS set');
} else {
  const files = execSync('git ls-files', { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  for (const f of files) {
    let text;
    try { text = readFileSync(join(root, f), 'utf8').toLowerCase(); } catch { continue; }
    if (text.includes('\0')) continue;
    for (const t of terms) if (text.includes(t) || f.toLowerCase().includes(t)) fail(`${f}: contains a deny-listed term`);
  }
  console.log(`[ok] deny-list: ${terms.length} terms checked against tracked files`);
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`[ok] ${skills.length} skills, ${docs.length} docs checked`);
