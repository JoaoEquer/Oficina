# Oficina

Pacote versionado de regras, skills e comandos que assistentes de código com IA leem para se comportar do mesmo jeito em todo projeto: 27 skills, 4 regras sempre ativas, 8 comandos, cerca de 5,7 mil linhas de Markdown.

Não é um agente nem uma biblioteca. É contexto: o que eu explicaria para o agente toda vez que abro um projeto novo (estilo da casa, baseline de segurança, memória entre sessões), escrito uma vez e instalado por plugin ou por script. Funciona com Claude Code e com qualquer ferramenta que leia `AGENTS.md` (Codex, Cursor, OpenCode, Gemini CLI).

*Oficina in English: a portable context pack of rules, skills and slash commands for AI coding assistants. The rest of this README is in Portuguese; the skills themselves are written in English.*

## O que tem dentro (saída real)

Contagem feita no clone, sem nada instalado:

```
$ (Get-ChildItem skills -Directory).Count
27
$ (Get-ChildItem commands -File).Count
8
$ (Get-ChildItem rules -File).Count
4
$ git ls-files | measure
139 arquivos versionados
```

Comandos: `/oficina:init`, `/oficina:crud`, `/oficina:review`, `/oficina:fechar-sessao`, `/oficina:audit`, `/oficina:gdd`, `/oficina:asset-forge`, `/oficina:asset`.

## Quick start

No Claude Code, dois comandos:

```
/plugin marketplace add JoaoEquer/Oficina
/plugin install oficina@oficina
```

Depois, dentro de qualquer projeto:

```
/oficina:init
```

Resultado esperado: o agente investiga o repositório (stack, estrutura, documento do modelo de dados), gera um `AGENTS.md` com as regras embutidas, mais `CLAUDE.md` e `GEMINI.md` apontando para ele, e lista como PENDENTE o que precisa de confirmação humana. Não verifiquei o plugin em uma instalação limpa para este README; o comportamento acima é o que `commands/init.md` descreve.

Para Gemini CLI, Cursor e Codex:

```
git clone https://github.com/JoaoEquer/Oficina.git
cd Oficina
.\install.ps1 -Gemini      # Windows;  ./install.sh --gemini no macOS/Linux/WSL
```

Isso copia skills e comandos para `~/.claude` e instala os comandos em TOML em `~/.gemini/commands/oficina/`. Rode `/commands reload` no Gemini depois. O instalador também tenta instalar o `rtk` (usado pela skill `token-efficiency`); se falhar, só avisa e segue.

## Como funciona

```
                  +-------------------+
                  |  repositorio      |   fonte unica
                  |  skills/ rules/   |
                  |  commands/ gemini/|
                  +---------+---------+
          plugin            |           install.ps1 / install.sh / sync
   (.claude-plugin/)        |           (copia para ~/.claude, ~/.gemini)
        +-------------------+-------------------+
        v                                       v
  Claude Code                       Gemini CLI / Cursor / Codex
  skills + /oficina:*               AGENTS.md + comandos TOML
        |                                       |
        +------------------+--------------------+
                           v
                /oficina:init no projeto alvo
        gera AGENTS.md (regras embutidas) + CLAUDE.md + GEMINI.md
```

Três tipos de peça, cada um com um critério de entrada:

- **Skill** (`skills/<nome>/SKILL.md`): fluxo com passos, decisões e armadilhas. Ex.: `rbac-design`.
- **Regra** (`rules/*.md`): curta, inegociável, vale para toda interação. Ex.: o `workspaceId` nunca vem do body. As quatro: filosofia de engenharia, git workflow, baseline de segurança, como dirigir o agente.
- **Comando** (`commands/*.md`): skill que disparo com frequência e com parâmetro. Ex.: `/oficina:crud tarefas`.

Decisões de design e o porquê:

- **Só entra o que se repetiu duas vezes num projeto real.** Uma vez é caso, duas é padrão. Evita virar catálogo genérico (inspirado no ECC, mas de propósito pequeno). O processo está em `docs/HOW-TO-GROW.md`.
- **Dois caminhos de entrada.** Caminho 1: padrões da casa, extraídos por repetição (a stack Express + Prisma com Clean Architecture manual, convenções de schema, RBAC, quebra de tarefas, docs para cliente, eficiência de tokens). Caminho 2: skills curadas de fora, adotadas depois de auditoria e só se fecham uma lacuna confirmada (`tdd`, `diagnosing-bugs`, `secrets-gitleaks`, `ci-cd-and-automation`, `security-audit` etc.). A origem de cada skill curada fica registrada no próprio `SKILL.md`.
- **Generalizar antes de gravar.** Entra o padrão, nunca o caso: sem nome de cliente, sem horas de contrato, sem "no projeto X fizemos Y".
- **Sem hook de SessionStart cobrando `/oficina:fechar-sessao`.** Uma versão antiga tinha; assumia que toda sessão termina limpa, e disparava em sessões que eu não ia fechar. Hoje o fechamento é opcional. Decisão confirmada vai direto para `OPEN_DECISIONS.md`.
- **Skills de jogo (`game-design-doc`, `game-assets`) estão marcadas como experimentais**: ainda não passaram pelo critério das duas repetições.

Trade-offs e limites:

- O conteúdo é opinativo e cobre uma stack (TypeScript, Express, Prisma, MySQL/PostgreSQL, Docker, GitHub Actions, ClickUp). Em outra stack, provavelmente não serve; o método de `HOW-TO-GROW.md` serve para montar o seu.
- A instalação por script copia arquivos; não há versionamento por projeto. Para atualizar: `/plugin marketplace update oficina` ou rodar o sync de novo.
- Não há testes automatizados do conteúdo. A validação é uso real e revisão.

## Para quem é

- Quem usa agentes de código todo dia e está cansado de repetir as mesmas instruções projeto a projeto.
- Quem trabalha em Node + TypeScript + Prisma e quer um ponto de partida opinativo para adaptar.

Para quem não é: quem quer um catálogo amplo de skills para muitas linguagens, ou um agente pronto para rodar. Aqui não tem nenhum dos dois.

## Desenvolvimento

Não há build, teste ou lint. O trabalho é editar Markdown e conferir se o resultado carrega no agente.

```
skills/            # superfície principal; uma pasta por skill, com SKILL.md
rules/             # regras sempre ativas (embutidas pelo /oficina:init)
commands/          # slash commands do Claude Code
gemini/            # os mesmos comandos em TOML para o Gemini CLI
.claude-plugin/    # manifestos de plugin e marketplace
scripts/           # sync.ps1 / sync.sh e git-hooks (pre-commit, post-commit)
examples/          # CLAUDE.md e settings.json de exemplo para um projeto
docs/              # HOW-TO-GROW.md: como o repositório cresce
AGENTS.md          # ponto de entrada para ferramentas que não são Claude
```

Hooks de git (instalados pelo `install.ps1`/`install.sh`):

- `pre-commit` bloqueia o commit se algo em `.oficina/` estiver staged. O repositório é público e essa pasta é memória local de sessão.
- `post-commit` roda `scripts/sync.ps1` (ou `sync.sh`), então skill ou comando editado já vale em `~/.claude` e `~/.gemini` sem reinstalar.

Convenções (de `rules/git-workflow.md`; o log do repo as segue): um branch por entrega (`feat/`, `fix/`, `chore/`), Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`), PRs pequenos. O histórico tem merges de branches `feat/*` em um branch de integração.

## Status

Em uso ativo; manifesto do plugin na versão 1.5.0. Problemas conhecidos:

- As skills de jogo são experimentais.
- O `AGENTS.md` lista as skills à mão e pode ficar atrás da pasta `skills/`; confira ao adicionar uma nova.

Não há roadmap registrado no repositório.

## Créditos e licença

Método inspirado em [affaan-m/ECC](https://github.com/affaan-m/ECC). Linha editorial pragmática (Fabio Akita, Augusto Galego).

MIT. Veja `LICENSE`.
