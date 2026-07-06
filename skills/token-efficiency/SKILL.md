---
name: token-efficiency
description: Reducing LLM token consumption in AI-assisted development sessions — RTK setup (CLI output compression via hook), when it pays off and complementary habits. Use when setting up a new machine or project for agent work, when sessions are hitting context limits or rate limits too fast, when API costs are a concern, or whenever the user mentions tokens, context window, RTK or session cost.
---

# Token efficiency

Tokens are the working memory of the session. Every verbose command output gets re-read on every subsequent turn, so waste compounds: a 2,000-token `git diff` costs ~20,000 tokens over the next 10 turns. Two fronts: tooling (RTK) and habits.

## RTK (Rust Token Killer)

[rtk-ai/rtk](https://github.com/rtk-ai/rtk) is an open-source CLI proxy (single Rust binary, Apache 2.0) that compresses command output before it reaches the context window — 60–90% savings on test runners, git operations and package managers. It runs locally and hooks into the agent's official extension points (Claude Code PreToolUse hook); it does not touch API traffic.

### Setup (once per machine)

```bash
# Install (official script; on Windows, native binary works since v0.37.2)
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh

# Activate for your harness — hook-only avoids extra per-turn context
rtk init -g --hook-only        # Claude Code
rtk init -g --gemini           # Gemini CLI
rtk init -g --agent cursor     # Cursor
```

Restart the agent afterwards. The hook rewrites Bash calls transparently (`git status` → `rtk git status`); the agent doesn't need to know RTK exists. Prefer `--hook-only`: the alternative injects an RTK.md into context on every turn, which spends tokens to save tokens.

### What it actually covers (calibrate expectations)

- **Big wins**: test runners showing failures only (`pytest`, `vitest`, `cargo test` — 90%+), `git diff/log/status`, package manager install noise, `tsc`/lint output grouped by file.
- **Not covered**: the agent's native Read/Grep/Glob tools bypass the Bash hook. In read/edit-heavy sessions RTK has little to intercept — that's expected, not broken.
- **Verify it's working**: `rtk gain` shows accumulated savings; `rtk discover` finds commands you ran that could have been compressed.
- **Failure safety**: when a command fails, RTK saves the full unfiltered output to disk so nothing important is lost.

## Habits that save more than any tool

- **Ask for scoped output**: `git log -n 5` beats `git log`; run the failing test file, not the whole suite.
- **Don't paste what the agent can read**: reference file paths instead of pasting file contents into the prompt.
- **One domain per session**: long mixed sessions accumulate stale context; a fresh session with a good CLAUDE.md/AGENTS.md beats a bloated one.
- **Keep context files lean**: the project's AGENTS.md is re-read constantly — it pays rent on every turn. If a section isn't changing behavior, cut it.
