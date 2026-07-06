# AGENTS.md — Oficina

Ponto de entrada para harnesses que leem `AGENTS.md` (Codex, Cursor, OpenCode, Gemini CLI e afins).

Este repositório é um harness enxuto de padrões de trabalho para o stack **NestJS + TypeScript + Prisma + PostgreSQL**, em português.

Ao trabalhar em qualquer projeto que referencie este harness:

1. **Siga as regras sempre-ativas** em `rules/`:
   - `rules/engineering-philosophy.md` — como o time decide (pragmatismo, sem over-engineering)
   - `rules/git-workflow.md` — branches, commits, documentação desde o dia 0
   - `rules/security-baseline.md` — inegociáveis de segurança e multi-tenancy
2. **Consulte as skills** em `skills/` antes de executar tarefas dos temas cobertos:
   - `nestjs-crud-pattern` — criar qualquer módulo/domínio/rota CRUD
   - `prisma-schema-conventions` — criar/alterar schema, planejar migrations
   - `rbac-design` — permissões, papéis, controle de acesso
   - `clickup-task-breakdown` — quebrar escopo em tarefas
   - `client-facing-docs` — qualquer material que o cliente vá ler
3. **Fonte da verdade documental**: modelo de dados e escopo vêm dos documentos do projeto. Divergência é bloqueio a resolver com o tech lead, não detalhe a ignorar.
