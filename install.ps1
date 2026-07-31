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

# RTK (token-efficiency skill) - best-effort, never blocks the rest of the install.
# No official Windows one-liner exists upstream; this mirrors their documented
# manual method (download release zip, extract onto PATH).
try {
    if (Get-Command rtk -ErrorAction SilentlyContinue) {
        Write-Host "[ok] rtk already installed"
    } else {
        Write-Host "Installing rtk (token-efficiency)..."
        $rtkBin = Join-Path $HOME ".local\bin"
        New-Item -ItemType Directory -Force -Path $rtkBin | Out-Null
        $release = Invoke-RestMethod -Uri "https://api.github.com/repos/rtk-ai/rtk/releases/latest"
        $asset = $release.assets | Where-Object { $_.name -eq "rtk-x86_64-pc-windows-msvc.zip" }
        $zipPath = Join-Path $env:TEMP "rtk.zip"
        Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zipPath
        Expand-Archive -Path $zipPath -DestinationPath $rtkBin -Force
        Remove-Item $zipPath -Force
        $userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
        if ($userPath -notlike "*$rtkBin*") {
            [Environment]::SetEnvironmentVariable("PATH", "$rtkBin;$userPath", "User")
        }
        $env:PATH = "$rtkBin;$env:PATH"
        Write-Host "[ok] rtk installed to $rtkBin"
    }
    if (Get-Command rtk -ErrorAction SilentlyContinue) {
        rtk init -g --hook-only
    } else {
        Write-Host "[warn] rtk not on PATH - skipping rtk init"
    }
} catch {
    Write-Host "[warn] rtk setup failed - skipping RTK setup (see https://github.com/rtk-ai/rtk): $_"
}

# SessionStart hook - nudges /oficina:fechar-sessao when a project's memory log
# looks behind its commits. Read-only, prints nothing when there's nothing to say.
try {
    $claudeHooks = Join-Path $HOME ".claude\hooks"
    New-Item -ItemType Directory -Force -Path $claudeHooks | Out-Null
    Copy-Item -Force (Join-Path $repo "hooks\session-start.sh") (Join-Path $claudeHooks "oficina-session-start.sh")
    if (Get-Command node -ErrorAction SilentlyContinue) {
        node (Join-Path $repo "hooks\register-session-start.js")
    } else {
        Write-Host "[warn] node not found - hook script copied but not registered in settings.json (needs Node to merge JSON safely)"
    }
} catch {
    Write-Host "[warn] could not set up SessionStart hook - skipping: $_"
}

if ($Gemini) {
    $geminiDir = Join-Path $HOME ".gemini"
    $geminiCmds = Join-Path $geminiDir "commands"
    New-Item -ItemType Directory -Force -Path $geminiDir, $geminiCmds | Out-Null
    Copy-Item -Recurse -Force (Join-Path $repo "gemini\commands\*") $geminiCmds
    Copy-Item -Force (Join-Path $repo "AGENTS.md") (Join-Path $geminiDir "OFICINA.md")
    Write-Host "[ok] Gemini CLI: /oficina:init, /oficina:crud and /oficina:review installed into ~/.gemini/commands"
    Write-Host "[ok] Gemini CLI: harness copied to ~/.gemini/OFICINA.md"
    Write-Host "     Add '@OFICINA.md' to your ~/.gemini/GEMINI.md to enable it globally."
    Write-Host "     Run /commands reload inside Gemini to pick up the new commands."
}

Write-Host ""
Write-Host "Done. To configure a project: enter the project folder and run /oficina:init (Claude Code)"
Write-Host "or ask the AI: 'configure this project following commands/init.md from Oficina'."
