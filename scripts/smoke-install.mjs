#!/usr/bin/env node
// Oficina — installer smoke test. Zero dependencies.
//   node scripts/smoke-install.mjs
// Copies the repo (without .git, so no git hooks are touched) to a temp dir, runs the
// installer for this OS with HOME pointed at another temp dir and a stub `rtk` on PATH
// (no network), then asserts the expected files landed.
import { mkdtempSync, cpSync, existsSync, readdirSync, writeFileSync, chmodSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve, delimiter } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tmp = mkdtempSync(join(tmpdir(), 'oficina-smoke-'));
const repoCopy = join(tmp, 'repo');
const home = join(tmp, 'home');
const bin = join(tmp, 'bin');
mkdirSync(home); mkdirSync(bin);
cpSync(root, repoCopy, { recursive: true, filter: (p) => !/[\\/](\.git|node_modules|\.oficina|\.playwright-cli)([\\/]|$)/.test(p) });

const win = process.platform === 'win32';
if (win) writeFileSync(join(bin, 'rtk.cmd'), '@echo off\r\nexit /b 0\r\n');
else { writeFileSync(join(bin, 'rtk'), '#!/bin/sh\nexit 0\n'); chmodSync(join(bin, 'rtk'), 0o755); }

const env = { ...process.env, HOME: home, USERPROFILE: home, PATH: bin + delimiter + process.env.PATH };
const run = (cmd, args) => spawnSync(cmd, args, { env, cwd: repoCopy, encoding: 'utf8' });
const r = win
  ? run('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', join(repoCopy, 'install.ps1'), '-Gemini'])
  : run('bash', [join(repoCopy, 'install.sh'), '--gemini']);

const errors = [];
if (r.status !== 0) errors.push(`installer exited ${r.status}\n${r.stdout}\n${r.stderr}`);
const skillDirs = readdirSync(join(root, 'skills'), { withFileTypes: true }).filter((d) => d.isDirectory());
for (const d of skillDirs) {
  if (!existsSync(join(home, '.claude', 'skills', d.name, 'SKILL.md'))) errors.push(`missing ~/.claude/skills/${d.name}/SKILL.md`);
}
for (const c of readdirSync(join(root, 'commands')).filter((f) => f.endsWith('.md'))) {
  if (!existsSync(join(home, '.claude', 'commands', c))) errors.push(`missing ~/.claude/commands/${c}`);
}
if (!existsSync(join(home, '.gemini', 'OFICINA.md'))) errors.push('missing ~/.gemini/OFICINA.md');
if (!existsSync(join(home, '.gemini', 'commands'))) errors.push('missing ~/.gemini/commands');

rmSync(tmp, { recursive: true, force: true });
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`[ok] installer (${win ? 'install.ps1' : 'install.sh'}): ${skillDirs.length} skills, commands and gemini files installed`);
