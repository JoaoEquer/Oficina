# Node API (Express / Prisma / NestJS)

## Leads (Grep, then trace each hit)
| Pattern | Looking for |
|---|---|
| `\$queryRawUnsafe\|\$executeRawUnsafe\|Prisma\.raw\(` | SQL built from strings |
| `\$queryRaw\(` | `$queryRaw` called as a function with a built string instead of a tagged template |
| `req\.body\.(workspaceId\|tenantId\|userId\|role\|isAdmin\|ownerId)` | Identity/privilege taken from input |
| `data:\s*req\.body\|data:\s*\{\s*\.\.\.req\.body\|\.\.\.dto` into `create\|update` | Mass assignment |
| `findUnique\|findFirst\|update\|delete` with `where: { id` | IDOR: id lookup without tenant/owner filter |
| `jwt\.decode\(` | Token decoded but not verified |
| `algorithms\|ignoreExpiration` | JWT verify options weakened |
| `JWT_SECRET \|\| \|secret \|\| ['"]` | Fail-open secret fallback |
| `origin:\s*(true\|['"]\*['"])\|origin:\s*\(origin, cb\) => cb\(null, true\)` + `credentials: true` | CORS reflecting any origin with cookies |
| `child_process\|exec\(\|execSync\|spawn\(.*shell:\s*true` | Command injection |
| `path\.join\(.*req\.\|res\.sendFile\(.*req\.\|fs\.\w+\(.*req\.` | Path traversal |
| `axios\.(get\|post)\(.*req\.\|fetch\(.*req\.` | SSRF |
| `_\.merge\|lodash\.merge\|Object\.assign\(\{\}, .*req\.body\|deepmerge` | Prototype pollution |
| `new RegExp\(.*req\.` | ReDoS / regex injection |
| `res\.redirect\(.*req\.` | Open redirect |
| `err\.stack\|res\.(json\|send)\(err\)` | Stack/internal error leakage |
| `multer\|busboy\|formidable` | Upload: type, size, storage path, served back how |
| `webhook` routes | Signature verification before parsing/acting |

## Checks that need reading, not grep
- **Tenant isolation**: every repository/usecase method that touches tenant data filters by the workspace from the authenticated context. One missing filter = cross-tenant Critical. Check list, get, update, delete and nested relations (`include` pulling another tenant's rows).
- **Authorization vs authentication**: the route has auth middleware, but does it check the user may act on *this* resource and *this* action (role/permission)? Admin-only usecases reachable by any logged user = High.
- **Auth flows**: password hashing (bcrypt/argon2, not sha/md5), login rate limit or lockout, reset tokens single-use and expiring, refresh token rotation, logout invalidates server-side if sessions exist.
- **Validation at the edge**: DTO/zod/class-validator with whitelist (unknown fields stripped). Missing whitelist + spread into Prisma = mass assignment.
- **Business logic**: race conditions on balances/stock/quotas (read-then-write without transaction or atomic update), negative quantities, state transitions skipped by calling the later endpoint directly.
- **Errors**: production handler returns generic messages; stack traces only in logs.
- **Headers/transport**: `helmet` or equivalent on apps serving HTML; cookies `httpOnly`, `secure`, `sameSite`.

## Not a finding
- Prisma `$queryRaw` used as a tagged template (`` $queryRaw`... ${x}` ``): parameterized.
- `findUnique({ where: { id } })` where the repository wraps every call with a tenant-scoped client/extension: verify the wrapper, then drop.
- CORS `origin: true` on a public, cookie-less, read-only API.
