#!/usr/bin/env node
// Registers Oficina's SessionStart hook (nudges /oficina:fechar-sessao when it looks
// behind) into ~/.claude/settings.json without disturbing anything already there.
// Idempotent - safe to run on every install.
const fs = require("fs");
const os = require("os");
const path = require("path");

const settingsPath = path.join(os.homedir(), ".claude", "settings.json");
let settings = {};
if (fs.existsSync(settingsPath)) {
  settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
}

settings.hooks = settings.hooks || {};
settings.hooks.SessionStart = settings.hooks.SessionStart || [];

const command = 'bash "$HOME/.claude/hooks/oficina-session-start.sh"';
for (const matcher of ["startup", "resume"]) {
  const already = settings.hooks.SessionStart.some(
    (entry) =>
      entry.matcher === matcher &&
      (entry.hooks || []).some((h) => (h.command || "").includes("oficina-session-start"))
  );
  if (!already) {
    settings.hooks.SessionStart.push({
      matcher,
      hooks: [{ type: "command", command }],
    });
  }
}

fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
console.log("[ok] Oficina SessionStart hook registered in ~/.claude/settings.json");
