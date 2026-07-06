---
name: prisma-schema-conventions
description: Convenções de modelagem de dados em Prisma + PostgreSQL para sistemas multi-tenant — isolamento por workspace, criticidade numérica, recorrência idempotente, versionamento de documentos por linhagem e auditoria desacoplada via fila no próprio Postgres. Use sempre que for criar ou alterar schema.prisma, desenhar entidades novas, planejar migrations ou discutir modelagem de dados em qualquer projeto do stack.
---

# Convenções de schema Prisma

Decisões de modelagem travadas por experiência em produção. Elas valem para qualquer entidade nova, salvo decisão explícita e registrada em contrário.

## 1. Multi-tenancy: `workspaceId` em toda entidade

Toda entidade de negócio carrega `workspaceId` (isolamento no nível de linha, single database). O isolamento é garantido na camada de dados — toda query filtra por workspace — e o id vem sempre do contexto autenticado, nunca de input do cliente.

```prisma
model Tarefa {
  id          String   @id @default(uuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  // ...
  @@index([workspaceId])
}
```

**Ponto de atenção**: confirme cedo com o arquiteto se o projeto é de fato multi-tenant. Divergência entre documento de modelagem (single-tenant) e documento comercial (multi-tenant) é um erro clássico — resolva ANTES da primeira migration de produção, não depois.

## 2. Criticidade / prioridade: escala numérica, nunca boolean

`criticidade Int` (ex.: 1–5). Boolean ("crítico sim/não") não sobrevive à primeira reunião em que o cliente pede "média prioridade". Se o documento de modelagem mostrar boolean em uma entidade e inteiro em outra, trate como inconsistência a resolver — modele como `Int` e sinalize.

## 3. Recorrência idempotente

Tarefa/evento recorrente é gerado a partir de um template, com **chave única composta (templateId + data alvo)**:

```prisma
model Tarefa {
  // ...
  templateId String?
  dataAlvo   DateTime?
  @@unique([templateId, dataAlvo])
}
```

O gerador de recorrência pode rodar quantas vezes for (cron duplicado, retry, reprocessamento) sem criar duplicata. Idempotência por design, não por lógica de aplicação.

## 4. Documento versionado por linhagem

Nada de sobrescrever arquivo. Cada versão é uma linha nova, agrupada por id de linhagem:

```prisma
model Documento {
  id         String  @id @default(uuid())
  linhagemId String              // agrupa todas as versões do "mesmo" documento
  versao     Int
  ativo      Boolean @default(true) // só uma versão ativa por linhagem
  // ...
  @@unique([linhagemId, versao])
}
```

## 5. Auditoria desacoplada (fila no próprio Postgres)

Auditoria não pode deixar a operação principal lenta nem derrubá-la se falhar. O padrão: a transação de negócio grava um evento numa tabela-fila (`AuditoriaFila`); um worker separado consome a fila e materializa o registro de auditoria. **Sem Redis, sem fila externa** — Postgres dá conta até prova em contrário (regra da complexidade justificada).

## 6. Datas em UTC, sempre

Banco em UTC, conversão de fuso só na borda (apresentação). `DateTime` do Prisma já é UTC-friendly; o pecado é o código de aplicação criar datas em fuso local.

## 7. Soft delete por padrão

`deletedAt DateTime?` nas entidades de negócio. Hard delete só com decisão registrada (ex.: exigência de LGPD para dados pessoais).

## Antes de qualquer migration de produção

Checklist obrigatório:

- [ ] Schema batido contra o documento de modelagem (fonte da verdade)
- [ ] Divergências entre documentos resolvidas com o arquiteto e registradas
- [ ] Multi-tenancy confirmada (item 1)
- [ ] Tipos de campos ambíguos confirmados (item 2)
- [ ] Migration revisada (nome descritivo, sem `migrate dev` acumulado virando lixo)
