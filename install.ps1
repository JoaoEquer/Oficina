# Oficina — Windows installer (PowerShell)
# Usage:
#   .\install.ps1           -> global install for Claude Code (skills + commands into ~/.claude)
#   .\install.ps1 -Gemini   -> also install for Gemini CLI (~/.gemini)
param([switch]$Gemini)

$ErrorActionPreference = "Stop"
$repo = $PSScriptRoot

Write-Host "Oficina - installing from $repo"

# Claude Code (manual install; prefer the plugin: /plugin marketplace add JoaoEquer/Oficina)
$claudeSkills   = Join-Path $HOME ".claude\skills"
$claudeCommands = Join-Path $HOME ".claude\commands"
New-Item -ItemType Directory -Force -Path $claudeSkills, $claudeCommands | Out-Null
Copy-Item -Recurse -Force (Join-Path $repo "skills\*")   $claudeSkills
Copy-Item -Force          (Join-Path $repo "commands\*.md") $claudeCommands
Write-Host "[ok] Claude Code: skills and commands installed into ~/.claude"

if ($Gemini) {
    $geminiDir = Join-Path $HOME ".gemini"
    $geminiCmds = Join-Path $geminiDir "commands"
    New-Item -ItemType Directory -Force -Path $geminiDir, $geminiCmds | Out-Null
    Copy-Item -Recurse -Force (Join-Path $repo "gemini\commands\*") $geminiCmds
    Copy-Item -Force (Join-Path $repo "AGENTS.md") (Join-Path $geminiDir "OFICINA.md")
    Write-Host "[ok] Gemini CLI: /oficina:init and /oficina:crud installed into ~/.gemini/commands"
    Write-Host "[ok] Gemini CLI: harness copied to ~/.gemini/OFICINA.md"
    Write-Host "     Add '@OFICINA.md' to your ~/.gemini/GEMINI.md to enable it globally."
    Write-Host "     Run /commands reload inside Gemini to pick up the new commands."
}

Write-Host ""
Write-Host "Done. To configure a project: enter the project folder and run /oficina:init (Claude Code)"
Write-Host "or ask the AI: 'configure this project following commands/init.md from Oficina'."
