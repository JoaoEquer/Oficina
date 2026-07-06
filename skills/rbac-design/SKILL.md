---
name: rbac-design
description: Desenho de controle de acesso baseado em papéis (RBAC) com papéis + permissões granulares — matriz papel × domínio, modelagem N:N no banco e processo de aprovação antes da implementação. Use sempre que o projeto envolver permissões, papéis de usuário, controle de acesso, painel administrativo ou perguntas do tipo "quem pode fazer o quê" no sistema.
---

# Desenho de RBAC

RBAC mal desenhado é retrabalho garantido. Este é o processo e o modelo que funcionam.

## O modelo: papéis + permissões granulares (não papéis puros)

Papel puro ("admin pode tudo, editor pode editar") quebra na primeira exceção real. O modelo da casa:

- **Permissão** = ação atômica sobre um domínio (ex.: `tarefa:criar`, `documento:aprovar`, `relatorio:exportar`).
- **Papel** = conjunto nomeado de permissões (N:N papel ↔ permissão).
- **Usuário** recebe papéis (N:N usuário ↔ papel), e o sistema resolve o conjunto efetivo de permissões.

```prisma
model Papel {
  id          String  @id @default(uuid())
  workspaceId String
  nome        String
  permissoes  PapelPermissao[]
}

model Permissao {
  id      String @id @default(uuid())
  dominio String   // ex.: "tarefa", "documento", "relatorio"
  acao    String   // ex.: "criar", "ler", "editar", "aprovar", "excluir"
  papeis  PapelPermissao[]
  @@unique([dominio, acao])
}

model PapelPermissao {
  papelId     String
  permissaoId String
  papel       Papel     @relation(fields: [papelId], references: [id])
  permissao   Permissao @relation(fields: [permissaoId], references: [id])
  @@id([papelId, permissaoId])
}
```

Checagem no servidor via guard/decorator (`@RequirePermission('documento:aprovar')`). O front só usa permissões para esconder botão — nunca como controle real.

## O processo: matriz antes de código

**Não implemente RBAC direto no código.** O fluxo correto:

1. **Levante os domínios** do sistema (as "áreas": tarefas, documentos, usuários, relatórios, configurações...). Sistemas médios têm entre 8 e 15 domínios.
2. **Levante os papéis** reais da operação do cliente (não os que você imagina). Normalmente 5 a 8 papéis bastam; mais que isso é cheiro de papéis que deviam ser permissões avulsas.
3. **Monte a matriz papel × domínio** num documento legível (tabela: linhas = papéis, colunas = domínios, células = ações permitidas).
4. **Submeta à aprovação** do arquiteto/tech lead e, se fizer sentido, do cliente. A matriz é barata de mudar; código e migration não são.
5. **Só depois da aprovação**, implemente — e verifique o codebase real antes, se a implementação for em sistema existente (não implemente contra um codebase imaginado).

## Armadilhas conhecidas

- **Permissão implícita**: "todo mundo pode ler" não documentado vira furo de segurança quando o requisito muda. Toda permissão é explícita na matriz.
- **Papel-Deus crescente**: o papel "admin" que acumula tudo. Aceitável, mas registre que ele é super-usuário por design.
- **RBAC sem tenant**: em sistema multi-tenant, papel e atribuição pertencem ao workspace (`workspaceId` no `Papel`). Papéis globais só se a decisão for registrada.
- **Granularidade prematura**: comece com ações padrão (criar/ler/editar/excluir + as 2–3 ações de negócio específicas do domínio, como "aprovar"). Não invente 40 ações por domínio no dia 1.
