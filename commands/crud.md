---
description: Gera um domínio CRUD completo no padrão da casa (NestJS + Prisma, multi-tenant)
---

Crie o domínio CRUD **$ARGUMENTS** seguindo estritamente a skill `nestjs-crud-pattern` e as convenções da skill `prisma-schema-conventions`.

Passos obrigatórios, nesta ordem:

1. Localize o documento de modelagem do projeto (UML/diagrama em `docs/`). Se não encontrar ou a entidade não estiver nele, PARE e pergunte os campos — não invente.
2. Se já existir um módulo CRUD no repo, use-o como molde e mantenha o formato idêntico.
3. Modele a entidade no `schema.prisma` seguindo as convenções (workspaceId, soft delete, UTC, e as demais que se aplicarem) e gere a migration com nome descritivo.
4. Crie `src/modules/$ARGUMENTS/` completo: controller, service, repository (contrato abstrato + implementação Prisma), DTOs com class-validator, module com provider token. Registre no AppModule.
5. Valide: projeto sobe, migration aplicada, as 5 rotas respondem, lint e build limpos.
6. Escreva o registro da entrega em `docs/registro/` (o que foi feito, decisões, pendências), conforme a rule de git-workflow.

Regras invioláveis: workspaceId do contexto autenticado (nunca do corpo), toda query filtra por tenant, permissão validada no servidor, datas em UTC.
