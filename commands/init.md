---
description: Configura o projeto atual com o harness Oficina — gera CLAUDE.md, AGENTS.md e GEMINI.md automaticamente, aterrados no que o projeto realmente é
argument-hint: "[descrição opcional do projeto]"
---

Configure o projeto atual com o harness **Oficina** (https://github.com/JoaoEquer/Oficina). Seu objetivo é que, ao final, qualquer IA (Claude Code, Gemini, Cursor, Codex) aberta neste projeto trabalhe automaticamente no padrão da casa.

## Passo 1 — Entenda o projeto ANTES de gerar qualquer coisa

Investigue o repositório atual:

- Leia `package.json`, `README.md` e a estrutura de pastas
- Identifique: nome do projeto, stack real (NestJS? Prisma? qual banco?), se já existe módulo CRUD que sirva de molde, e onde está o documento de modelagem (procure em `docs/`)
- Se o usuário passou descrição em `$ARGUMENTS`, use como contexto principal

Se não conseguir identificar o essencial (nome, propósito, se é multi-tenant), **pergunte ao usuário** — no máximo 3 perguntas objetivas. Não invente contexto.

## Passo 2 — Obtenha o conteúdo das regras

Leia os três arquivos de regras do harness. Tente nesta ordem:

1. Do diretório do plugin instalado (você está rodando de dentro dele): `rules/engineering-philosophy.md`, `rules/git-workflow.md`, `rules/security-baseline.md`
2. Se não encontrar, busque do repositório público:
   - https://raw.githubusercontent.com/JoaoEquer/Oficina/main/rules/engineering-philosophy.md
   - https://raw.githubusercontent.com/JoaoEquer/Oficina/main/rules/git-workflow.md
   - https://raw.githubusercontent.com/JoaoEquer/Oficina/main/rules/security-baseline.md

## Passo 3 — Gere o AGENTS.md na raiz do projeto

O `AGENTS.md` é o arquivo canônico (lido por Gemini CLI, Codex, Cursor e outros). Estrutura:

```markdown
# AGENTS.md — <nome do projeto>

## Contexto
<1-2 frases: o que o sistema faz, para quem, stack real detectada>

Fonte da verdade do modelo de dados: <caminho do documento de modelagem, ou "PENDENTE — perguntar ao tech lead">

## Harness
Este projeto segue o harness Oficina (https://github.com/JoaoEquer/Oficina).

### Regras sempre-ativas
<cole aqui o CONTEÚDO COMPLETO dos três arquivos de regras, cada um sob um subtítulo>

### Skills
Antes de executar tarefas destes temas, consulte a skill correspondente em
https://github.com/JoaoEquer/Oficina/tree/main/skills (ou na instalação local):
- nestjs-crud-pattern — criar qualquer módulo/domínio/rota CRUD
- prisma-schema-conventions — criar/alterar schema, planejar migrations
- rbac-design — permissões, papéis, controle de acesso
- clickup-task-breakdown — quebrar escopo em tarefas
- client-facing-docs — qualquer material que o cliente vá ler

## Decisões travadas deste projeto
<liste as que você detectou no código/docs; marque as não-confirmadas como PENDENTE>

## Pendências conhecidas
<o que precisa de confirmação humana antes de virar produção>
```

## Passo 4 — Gere os apontadores

- `CLAUDE.md` na raiz, com o conteúdo exatamente: `@AGENTS.md` (Claude Code importa o arquivo)
- `GEMINI.md` na raiz, com o conteúdo exatamente: `@AGENTS.md` (Gemini CLI importa o arquivo)
- Se já existir `CLAUDE.md`, `GEMINI.md` ou `AGENTS.md` no projeto, **não sobrescreva sem mostrar o diff e pedir confirmação**.

## Passo 5 — Relate

Mostre ao usuário: os arquivos criados, as decisões detectadas automaticamente, e a lista de PENDENTEs que precisam de resposta humana. Não faça commit — deixe o usuário revisar primeiro.
