---
name: nestjs-crud-pattern
description: House pattern for building complete CRUD domains in NestJS with Prisma — controller/service/repository with dependency inversion, validated DTOs and multi-tenant isolation. Use whenever creating a new module, entity, CRUD route or domain in a NestJS backend, even if the request is just "create the X route" or "add the Y table".
---

# NestJS CRUD — house pattern

Every CRUD domain follows exactly the same shape. The project's first module is the mold; the rest copy its form. Do not invent variations.

## Per-domain structure

```
src/modules/<domain>/
├── <domain>.controller.ts   # HTTP only: receives request, returns response. Zero business logic.
├── <domain>.service.ts      # Business logic. Depends on the repository ABSTRACTION, never on Prisma directly.
├── <domain>.repository.ts   # Abstract class (contract) + Prisma implementation in the same file.
├── dto/
│   ├── create-<domain>.dto.ts
│   └── update-<domain>.dto.ts
└── <domain>.module.ts       # Wiring: binds the contract to the implementation via provider token.
```

Cross-cutting concerns (PrismaService, guards, context decorators) live in `src/shared/`.

## The repository contract (DIP in practice)

```typescript
// <domain>.repository.ts
export abstract class TaskRepository {
  abstract create(workspaceId: string, data: CreateTaskDto): Promise<Task>;
  abstract findAll(workspaceId: string): Promise<Task[]>;
  abstract findById(workspaceId: string, id: string): Promise<Task | null>;
  abstract update(workspaceId: string, id: string, data: UpdateTaskDto): Promise<Task>;
  abstract softDelete(workspaceId: string, id: string): Promise<void>;
}

@Injectable()
export class PrismaTaskRepository extends TaskRepository {
  constructor(private readonly prisma: PrismaService) { super(); }
  // ... implementation: EVERY query filters by workspaceId
}
```

```typescript
// <domain>.module.ts
@Module({
  controllers: [TaskController],
  providers: [
    TaskService,
    { provide: TaskRepository, useClass: PrismaTaskRepository },
  ],
})
export class TaskModule {}
```

The service injects `TaskRepository` (the contract). Swapping the implementation or mocking in tests becomes trivial.

## Non-negotiable rules

1. **`workspaceId` always comes from the authenticated context (JWT), never from the request body.** If Auth doesn't exist yet, use a marker constant (`FAKE_WORKSPACE_ID`) with a `// TODO: extract from JWT` comment — and register it as a visible pending item.
2. **Tenant isolation enforced at the data layer**: every repository query filters by `workspaceId`. No exceptions, not even for "internal" queries.
3. **Permissions validated on the server** (guard/decorator), never trusted to the frontend.
4. **Dates always in UTC.**
5. **DTOs with `class-validator`** and a global `ValidationPipe` enabled in `main.ts` (`whitelist: true`).
6. **Delete is soft delete** by default (`deletedAt`), unless an explicit decision says otherwise.

## SOLID, feet on the ground

- **SRP**: one responsibility per layer. The controller doesn't validate business rules; the service doesn't build SQL; the repository doesn't decide policy.
- **DIP**: service ↔ repository contract, as above.
- **OCP/ISP without excess**: do NOT create a generic `BaseRepository<T>`, do NOT build hexagonal ports/adapters, do NOT abstract what isn't needed yet. Abstraction only where the cost pays off.

## Source of truth for the model

The exact fields of each entity come from the project's data model document (UML/diagram in `docs/`). If the document doesn't exist or the entity isn't in it, **stop and ask** before inventing fields. Never run a production migration without checking the schema against the source of truth.

## Definition of done (per domain)

- [ ] Model in Prisma + migration applied (table actually created)
- [ ] Complete module: POST, GET list, GET by id, PATCH, DELETE responding
- [ ] `workspaceId` from context, filtered queries, DTOs validating
- [ ] Lint and build clean, project boots locally
- [ ] Registered in `AppModule`
- [ ] Documented: the work goes into the day's delivery log (see `git-workflow` rule)
