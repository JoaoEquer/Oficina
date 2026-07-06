# Como alimentar a Oficina

O valor deste repositório não está no que ele tem hoje — está no processo que decide o que entra. O ECC chegou a 260+ skills porque cobre 12 linguagens e centenas de contribuidores. A Oficina cobre **um stack e um jeito de trabalhar**; o objetivo é ficar entre 5 e 15 skills, sempre.

## O ciclo (roda depois de cada projeto/entrega relevante)

```
trabalhar → notar repetição → generalizar → registrar → usar → refinar
```

### 1. Notar a repetição

O gatilho para criar/atualizar uma skill é sempre o mesmo: **"eu já expliquei isso para o agente (ou para mim mesmo) pelo menos duas vezes"**. Exemplos de sinais:

- Você colou o mesmo trecho de prompt em dois projetos diferentes
- O agente errou do mesmo jeito duas vezes e você corrigiu igual
- Uma decisão técnica de um projeto se aplicou sem mudança no seguinte

Uma vez = caso. Duas vezes = padrão. Três vezes sem skill = desperdício.

### 2. Generalizar antes de registrar

O que entra é o **padrão**, nunca o caso:

- ❌ Nome de cliente, horas de contrato, nome de colega, detalhe comercial
- ❌ "No projeto X fizemos Y" — isso é história, não instrução
- ✅ A regra, o porquê em uma frase, o exemplo de código mínimo, as armadilhas conhecidas

Teste rápido: *uma pessoa de fora da empresa consegue usar essa skill sem contexto adicional?* Se não, generalize mais.

### 3. Registrar no formato certo

**Vira skill** quando é um fluxo de trabalho com passos, decisões e armadilhas (ex.: desenhar RBAC).
**Vira rule** quando é inegociável e curto, algo que vale em toda interação (ex.: "workspaceId nunca vem do corpo").
**Vira command** quando é uma skill que você dispara com frequência com um parâmetro (ex.: `/crud tarefas`).
**Não vira nada** quando só aconteceu uma vez — anota num rascunho pessoal e espera a segunda ocorrência.

Convenções de nomenclatura (não desviar):

| Item | Formato | Exemplo |
|---|---|---|
| Pasta de skill | `kebab-case`, substantivo-padrão | `rbac-design` |
| Arquivo da skill | sempre `SKILL.md` | — |
| Frontmatter | `name` = nome da pasta; `description` = o que faz + QUANDO usar (seja "insistente" no quando — é o mecanismo de disparo) | — |
| Rule | `kebab-case.md`, tema | `security-baseline.md` |
| Command | `kebab-case.md`, verbo | `crud.md` |
| Corpo | português; código e identificadores em inglês quando fizer sentido no código | — |

Anatomia de skill (limites que funcionam):

- `SKILL.md` com menos de 500 linhas; ideal 60–150
- Se crescer, quebrar material de apoio em `references/` dentro da pasta da skill
- Descrição do frontmatter carrega TODO o "quando usar" — o corpo é só o "como"

### 4. Usar e refinar

Skill que ninguém dispara em 2–3 meses é candidata a remoção ou a reescrever a `description` (o problema geralmente é o disparo, não o conteúdo). Uma revisão trimestral de 30 minutos resolve: o que disparou? o que errou? o que faltou?

## O que a Oficina NUNCA deve virar

- Coleção de skills para linguagens que você não usa
- Espelho de outro harness ("o ECC tem, então eu preciso ter")
- Depósito de contexto de cliente (isso mora no `CLAUDE.md` privado de cada projeto)
- Repositório com instalador complexo — se `cp -r` não resolve, está grande demais

## Divisão público × privado

| Vai na Oficina (pública) | Fica no projeto (privado) |
|---|---|
| Padrão de CRUD, convenções de schema | Schema real do cliente |
| Processo de desenho de RBAC | A matriz de permissões do cliente |
| Formato de quebra de tarefas | As tarefas e horas do contrato |
| Estilo de doc para cliente | O documento do cliente |
| Filosofia e regras de segurança | Credenciais, URLs, nomes |
