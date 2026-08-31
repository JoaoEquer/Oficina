# Oficina — fast sync (Windows)
# Refreshes ~/.claude and ~/.gemini commands/skills from this repo's working tree.
# No RTK setup, no hook registration — that's install.ps1's job, once per machine.
# Safe to re-run anytime; called automatically by the post-commit git hook.
$repo = Split-Path -Parent $PSScriptRoot

$claudeSkills   = Join-Path $HOME ".claude\skills"
$claudeCommands = Join-Path $HOME ".claude\commands"
New-Item -ItemType Directory -Force -Path $claudeSkills, $claudeCommands | Out-Null
Copy-Item -Recurse -Force (Join-Path $repo "skills\*")      $claudeSkills
Copy-Item -Force          (Join-Path $repo "commands\*.md") $claudeCommands

$geminiRoot = Join-Path $HOME ".gemini"
if (Test-Path $geminiRoot) {
    $geminiCmds = Join-Path $geminiRoot "commands\oficina"
    New-Item -ItemType Directory -Force -Path $geminiCmds | Out-Null
    Copy-Item -Force (Join-Path $repo "gemini\commands\oficina\*") $geminiCmds
}

Write-Host "[oficina sync] ~/.claude and ~/.gemini refreshed from $repo"
