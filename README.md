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
├── commands/        # Slash commands
│   ├── init.md      # /oficina:init — configura qualquer projeto automaticamente
│   └── crud.md      # /oficina:crud <dominio> — gera um domínio CRUD no padrão da casa
├── .claude-plugin/  # Manifestos de plugin/marketplace do Claude Code
├── install.sh / install.ps1  # Instalação para harnesses não-Claude
├── examples/        # CLAUDE.md de exemplo para apontar um projeto para este harness
├── docs/
│   └── COMO-ALIMENTAR.md  # O processo de crescimento do repositório
└── AGENTS.md        # Ponto de entrada para harnesses não-Claude
```

## Instalação

### Claude Code (recomendado — plugin, zero cópia manual)

Dentro do Claude Code, dois comandos:

```
/plugin marketplace add JoaoEquer/Oficina
/plugin install oficina@oficina
```

Skills e commands carregam automaticamente (namespaçados: `/oficina:init`, `/oficina:crud`). Para atualizar quando o repositório evoluir: `/plugin marketplace update oficina`.

### Gemini CLI, Cursor, Codex e outros

```bash
git clone https://github.com/JoaoEquer/Oficina.git
cd Oficina
./install.sh --gemini     # macOS/Linux/WSL
# ou, no Windows:
.\install.ps1 -Gemini
```

Esses harnesses leem o `AGENTS.md` do projeto — que o passo abaixo gera sozinho.

## Uso num projeto (autônomo)

Entre na pasta do projeto e rode:

```
/oficina:init
```

A IA investiga o repositório (stack, estrutura, documento de modelagem), gera `AGENTS.md` com as regras completas embutidas + `CLAUDE.md` e `GEMINI.md` apontando para ele, detecta as decisões técnicas já presentes no código e lista como PENDENTE o que precisa de confirmação humana. Um comando, três harnesses configurados.

Em harness sem slash command, peça: *"configure este projeto seguindo o `commands/init.md` da Oficina"*.

Prefere fazer na mão? `examples/project-CLAUDE.md` continua disponível como modelo.

## Stack coberto

TypeScript · NestJS · Prisma · PostgreSQL · Docker · GitHub Actions · ClickUp

Se você usa outro stack, este repositório provavelmente não é para você — e está tudo bem. Faça o seu.

## Créditos

- Método e inspiração estrutural: [affaan-m/ECC](https://github.com/affaan-m/ECC)
- Filosofia de engenharia: Fabio Akita e Augusto Galego
- Padrões extraídos de projetos reais construídos na [Wibi](https://wibi.com.br)

## Licença

MIT — use, copie, adapte.
