---
name: clickup-task-breakdown
description: Transformar documentos de escopo (modelagem/UML, proposta funcional, plano de execução) em tarefas estruturadas no ClickUp — módulos como tarefas-pai, subtarefas com "como fazer", dependências e importação por CSV. Use sempre que precisar criar tarefas, quebrar escopo em atividades, organizar backlog, planejar sprint ou estruturar um plano de execução em ferramenta de gestão.
---

# De documento de escopo a tarefas ClickUp

Processo para converter os documentos de planejamento de um projeto em um backlog executável, sem inventar escopo.

## Regra número 1: fonte da verdade

As tarefas nascem **exclusivamente** dos documentos-fonte do projeto — tipicamente três:

1. **Modelagem de dados** (UML/diagrama de entidades)
2. **Proposta funcional** (o que o sistema faz, na visão de produto)
3. **Plano de execução** (módulos, horas, sequência)

Se algo não está em nenhum documento, não vira tarefa — vira **pergunta** para o tech lead. Gerar tarefa de escopo imaginado é o erro mais caro desse processo.

## Estrutura

- **Tarefa-pai = módulo do plano de execução.** Um para um. Se o plano tem 7 módulos, são 7 tarefas-pai.
- **Subtarefa = entrega verificável dentro do módulo** (3 a 6 por módulo é o normal). "Verificável" = dá para olhar e dizer se está pronto.
- Cada subtarefa carrega:
  - **Título**: verbo no infinitivo + objeto ("Implementar CRUD de tarefas", "Configurar pipeline de CI")
  - **Descrição "como fazer"**: 3–8 linhas aterradas nas decisões técnicas travadas do projeto — não um tutorial genérico
  - **Estimativa** herdada/rateada das horas do módulo no plano
  - **Responsável** quando a alocação do time já é conhecida

## Sequenciamento e dependências

Monte o grafo de dependências entre módulos ANTES de distribuir trabalho (ex.: `Setup → Auth → domínios em paralelo → dashboards → QA`). No ClickUp, use relações *waiting on* entre tarefas-pai; dentro do módulo, a ordem das subtarefas já expressa a sequência.

Entregue junto um **guia de sequenciamento** de meia página: a ordem, o porquê, e onde o time pode paralelizar.

## Importação

Para volume (20+ tarefas), gere CSV no formato do Spreadsheet Importer do ClickUp:

```csv
Task Name,Parent Task,Description,Time Estimate,Assignee
"Módulo A — Autenticação e estrutura organizacional",,"...",30h,
"Implementar login com JWT","Módulo A — Autenticação e estrutura organizacional","Como fazer: ...",8h,João
```

Cuidados que já causaram retrabalho:
- `Parent Task` referencia o **nome exato** da tarefa-pai (case-sensitive)
- Descrições com vírgula/quebra de linha entre aspas duplas
- Estimativas no formato que o importador aceita (`8h`, não `8 horas`)
- Sem caracteres decorativos Unicode (bordas, emojis em excesso) — quebram renderização em vários lugares

## Checklist de qualidade antes de entregar

- [ ] Toda tarefa rastreia para um trecho de documento-fonte
- [ ] Nenhum módulo do plano ficou sem tarefa-pai
- [ ] Toda subtarefa tem "como fazer" aterrado nas decisões do projeto
- [ ] Soma das estimativas bate com as horas do plano de execução (divergência = sinalizar, não esconder)
- [ ] Guia de sequenciamento entregue junto
