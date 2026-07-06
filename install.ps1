# Oficina — instalador para Windows (PowerShell)
# Uso:
#   .\install.ps1           -> instala global para Claude Code (skills + commands em ~/.claude)
#   .\install.ps1 -Gemini   -> tambem instala para Gemini CLI (~/.gemini)
param([switch]$Gemini)

$ErrorActionPreference = "Stop"
$repo = $PSScriptRoot

Write-Host "Oficina - instalando a partir de $repo"

# Claude Code (instalacao manual; se preferir, use o plugin: /plugin marketplace add JoaoEquer/Oficina)
$claudeSkills   = Join-Path $HOME ".claude\skills"
$claudeCommands = Join-Path $HOME ".claude\commands"
New-Item -ItemType Directory -Force -Path $claudeSkills, $claudeCommands | Out-Null
Copy-Item -Recurse -Force (Join-Path $repo "skills\*")   $claudeSkills
Copy-Item -Force          (Join-Path $repo "commands\*.md") $claudeCommands
Write-Host "[ok] Claude Code: skills e commands instalados em ~/.claude"

if ($Gemini) {
    $geminiDir = Join-Path $HOME ".gemini"
    New-Item -ItemType Directory -Force -Path $geminiDir | Out-Null
    Copy-Item -Force (Join-Path $repo "AGENTS.md") (Join-Path $geminiDir "OFICINA.md")
    Write-Host "[ok] Gemini CLI: harness copiado para ~/.gemini/OFICINA.md"
    Write-Host "     Adicione '@OFICINA.md' ao seu ~/.gemini/GEMINI.md para ativar globalmente."
}

Write-Host ""
Write-Host "Pronto. Para configurar um projeto: entre na pasta do projeto e rode /oficina:init (Claude Code)"
Write-Host "ou peca a IA: 'configure este projeto seguindo commands/init.md da Oficina'."
