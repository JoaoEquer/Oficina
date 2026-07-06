# CLAUDE.md — <AJUSTAR: nome do projeto>

## Contexto

<AJUSTAR: uma frase sobre o que o sistema faz e para quem.>

Stack: NestJS + TypeScript + Prisma + PostgreSQL · Docker + GitHub Actions · <AJUSTAR: extras (GCS, SSE, JWT...)>

Papéis: <AJUSTAR: tech lead, dev(s)>. Fonte da verdade do modelo de dados: `docs/<AJUSTAR: nome do documento de modelagem>`.

## Harness

Este projeto segue o harness **Oficina** (https://github.com/JoaoEquer/Oficina).

Regras sempre-ativas (resumo — texto completo no harness):

- Pragmatismo: tecnologia comprovada, complexidade só quando o problema exige, decisões reversíveis, sem buzzword, sem over-engineering.
- Git: branch por entrega, commits convencionais, PR pequeno, tudo documentado desde o dia 0 em `docs/registro/`.
- Segurança: identidade/tenant do token (nunca do corpo), autorização no servidor, toda query filtra por workspace, segredos fora do repo, datas em UTC, validação em toda borda.

Skills instaladas relevantes: `nestjs-crud-pattern`, `prisma-schema-conventions`, `rbac-design`, `clickup-task-breakdown`, `client-facing-docs`.

## Decisões travadas deste projeto

<AJUSTAR: liste aqui as decisões específicas, ex.:>
- Multi-tenant por workspaceId em toda entidade
- Criticidade em escala numérica 1–5
- Recorrência idempotente (templateId + dataAlvo únicos)
- Auditoria via fila no Postgres, consumida por worker

## Pendências conhecidas

<AJUSTAR: ex.: workspaceId provisório até módulo de Auth; decisões aguardando revisão do tech lead.>
