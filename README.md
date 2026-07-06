# Oficina

**Harness de trabalho para desenvolvimento assistido por IA — pragmático, enxuto e em português.**

Padrões reais extraídos de projetos reais (SaaS multi-tenant, painéis administrativos com RBAC, gestão de tarefas operacionais), construídos com NestJS + TypeScript + Prisma + PostgreSQL. Nada aqui é teórico: toda skill, regra e comando nasceu de um problema que apareceu em produção ou em entrega de cliente.

Funciona com **Claude Code** e qualquer harness que leia `AGENTS.md` (Codex, Cursor, OpenCode, Gemini CLI).

## Filosofia

Inspirado no método do [ECC](https://github.com/affaan-m/ECC) — usar, extrair o padrão, transformar em skill, reutilizar — mas deliberadamente **pequeno**. Aqui não tem 270 skills para 12 linguagens. Tem o que eu uso de verdade, para o stack que eu uso de verdade. A regra de crescimento é uma só:

> **Só entra no repositório o que já se repetiu pelo menos duas vezes em projeto real.**

A linha editorial segue a escola pragmática brasileira (Fabio Akita, Augusto Galego): tecnologia comprovada acima de moda, complexidade só quando o problema exige, decisões reversíveis, sem buzzword.

## Estrutura

```
oficina/
├── skills/          # Padrões de trabalho reutilizáveis (superfície principal)
│   ├── nestjs-crud-pattern/        # CRUD NestJS: controller/service/repository com DIP
│   ├── prisma-schema-conventions/  # Convenções de modelagem multi-tenant no Prisma
│   ├── rbac-design/                # Desenho de RBAC: papéis + permissões granulares
│   ├── clickup-task-breakdown/     # De documento de escopo a tarefas estruturadas
│   └── client-facing-docs/         # Documentação técnica para cliente, sem jargão
├── rules/           # Regras sempre-ativas (copiar para o CLAUDE.md ou rules do harness)
│   ├── engineering-philosophy.md
│   ├── git-workflow.md
│   └── security-baseline.md
├── commands/        # Slash commands para Claude Code
│   └── crud.md      # /crud <dominio> — gera um domínio CRUD completo no padrão da casa
├── examples/        # CLAUDE.md de exemplo para apontar um projeto para este harness
├── docs/
│   └── COMO-ALIMENTAR.md  # O processo de crescimento do repositório
└── AGENTS.md        # Ponto de entrada para harnesses não-Claude
```

## Instalação

Sem instalador, sem mágica. É `git clone` e cópia do que você quer — de propósito, para você saber exatamente o que está entrando no seu ambiente.

```bash
git clone https://github.com/JoaoEquer/Oficina.git
cd Oficina

# Skills (Claude Code carrega filhos diretos de ~/.claude/skills)
mkdir -p ~/.claude/skills
cp -r skills/* ~/.claude/skills/

# Commands
mkdir -p ~/.claude/commands
cp commands/*.md ~/.claude/commands/
```

As **rules** não se copiam para uma pasta: elas viram texto dentro do `CLAUDE.md` do seu projeto (ou do seu `~/.claude/CLAUDE.md` se quiser em tudo). Veja `examples/project-CLAUDE.md` para o formato.

## Uso num projeto novo

1. Copie `examples/project-CLAUDE.md` para a raiz do projeto como `CLAUDE.md`.
2. Ajuste as seções marcadas com `<AJUSTAR>`.
3. Pronto — o agente passa a seguir a filosofia, as regras de segurança e a conhecer as skills.

## Stack coberto

TypeScript · NestJS · Prisma · PostgreSQL · Docker · GitHub Actions · ClickUp

Se você usa outro stack, este repositório provavelmente não é para você — e está tudo bem. Faça o seu.

## Créditos

- Método e inspiração estrutural: [affaan-m/ECC](https://github.com/affaan-m/ECC)
- Filosofia de engenharia: Fabio Akita e Augusto Galego
- Padrões extraídos de projetos reais construídos na [Wibi](https://wibi.com.br)

## Licença

MIT — use, copie, adapte.
