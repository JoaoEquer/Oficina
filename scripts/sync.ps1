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

# Only refreshes an install that was explicitly opted into via install.ps1 -Gemini
# (checks for the oficina subfolder itself, not just ~/.gemini — that directory can
# exist for unrelated reasons, e.g. other tools that happen to use the same name).
$geminiCmds = Join-Path $HOME ".gemini\commands\oficina"
if (Test-Path $geminiCmds) {
    Copy-Item -Force (Join-Path $repo "gemini\commands\oficina\*") $geminiCmds
}

Write-Host "[oficina sync] ~/.claude and ~/.gemini refreshed from $repo"
