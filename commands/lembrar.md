---
description: Searches .oficina/memory/ and OPEN_DECISIONS.md for a keyword — cross-session recall
argument-hint: "<termo>"
---

Search past session memory for **$ARGUMENTS**.

1. If `.oficina/memory/` doesn't exist in this project, say so and stop — nothing to search yet (probably `/oficina:fechar-sessao` was never run here).
2. Search `.oficina/memory/*.md` and `OPEN_DECISIONS.md` (if present) for $ARGUMENTS, case-insensitive.
3. For each match, show the file, the dated entry it belongs to, and the matching line(s) in context — quote directly, never paraphrase.
4. If nothing matches, say so plainly. Do not guess or answer from general knowledge — this is memory recall, not free-form Q&A.

Keep the report terse: matches grouped by date, most recent first.
