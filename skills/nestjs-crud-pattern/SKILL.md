---
name: nestjs-crud-pattern
description: Padrão da casa para criar domínios CRUD completos em NestJS com Prisma — controller/service/repository com inversão de dependência, DTOs validados e isolamento multi-tenant. Use sempre que for criar um novo módulo, entidade, rota CRUD ou domínio em um backend NestJS, mesmo que o pedido seja só "criar a rota de X" ou "adicionar a tabela Y".
---

# CRUD NestJS — padrão da casa

Todo domínio CRUD segue exatamente o mesmo formato. O primeiro módulo do projeto é o molde; os seguintes copiam a forma. Não invente variações.

## Estrutura por domínio

```
src/modules/<dominio>/
├── <dominio>.controller.ts   # Só HTTP: recebe request, devolve response. Zero regra de negócio.
├── <dominio>.service.ts      # Regra de negócio. Depende da ABSTRAÇÃO do repositório, nunca do Prisma direto.
├── <dominio>.repository.ts   # Classe abstrata (contrato) + implementação Prisma no mesmo arquivo.
├── dto/
│   ├── create-<dominio>.dto.ts
│   └── update-<dominio>.dto.ts
└── <dominio>.module.ts       # Fiação: amarra o contrato à implementação por provider token.
```

Cross-cutting (PrismaService, guards, decorators de contexto) fica em `src/shared/`.

## O contrato de repositório (DIP na prática)

```typescript
// <dominio>.repository.ts
export abstract class TarefaRepository {
  abstract create(workspaceId: string, data: CreateTarefaDto): Promise<Tarefa>;
  abstract findAll(workspaceId: string): Promise<Tarefa[]>;
  abstract findById(workspaceId: string, id: string): Promise<Tarefa | null>;
  abstract update(workspaceId: string, id: string, data: UpdateTarefaDto): Promise<Tarefa>;
  abstract softDelete(workspaceId: string, id: string): Promise<void>;
}

@Injectable()
export class PrismaTarefaRepository extends TarefaRepository {
  constructor(private readonly prisma: PrismaService) { super(); }
  // ... implementação: TODA query filtra por workspaceId
}
```

```typescript
// <dominio>.module.ts
@Module({
  controllers: [TarefaController],
  providers: [
    TarefaService,
    { provide: TarefaRepository, useClass: PrismaTarefaRepository },
  ],
})
export class TarefaModule {}
```

O service injeta `TarefaRepository` (o contrato). Trocar a implementação ou mockar em teste vira trivial.

## Regras invioláveis

1. **`workspaceId` sempre vem do contexto autenticado (JWT), nunca do corpo da requisição.** Se o Auth ainda não existe, use uma constante marcadora (`FAKE_WORKSPACE_ID`) com comentário `// TODO: extrair do JWT` — e registre isso como pendência visível.
2. **Isolamento de tenant garantido na camada de dados**: toda query do repositório filtra por `workspaceId`. Sem exceção, nem em query "interna".
3. **Permissões validadas no servidor** (guard/decorator), nunca confiadas ao front.
4. **Datas sempre em UTC.**
5. **DTOs com `class-validator`** e `ValidationPipe` global ligado no `main.ts` (`whitelist: true`).
6. **Delete é soft delete** por padrão (`deletedAt`), salvo decisão explícita em contrário.

## SOLID com pé no chão

- **SRP**: uma responsabilidade por camada. Controller não valida negócio; service não monta SQL; repository não decide regra.
- **DIP**: service ↔ contrato de repositório, como acima.
- **OCP/ISP sem exagero**: NÃO crie repositório genérico `BaseRepository<T>`, NÃO monte ports/adapters hexagonais, NÃO abstraia o que ainda não precisa. Abstração só onde o custo se paga.

## Fonte da verdade do modelo

Os campos exatos de cada entidade vêm do documento de modelagem do projeto (UML/diagrama em `docs/`). Se o documento não existir ou a entidade não estiver nele, **pare e pergunte** antes de inventar campos. Nunca rode migration de produção sem bater o schema contra a fonte da verdade.

## Definição de pronto (por domínio)

- [ ] Modelo no Prisma + migration aplicada (tabela criada de verdade)
- [ ] Módulo completo: POST, GET lista, GET por id, PATCH, DELETE respondendo
- [ ] `workspaceId` do contexto, queries filtradas, DTOs validando
- [ ] Lint e build limpos, projeto sobe local
- [ ] Registrado no `AppModule`
- [ ] Documentado: o que foi feito entra no registro de entrega do dia (ver rule `git-workflow`)
