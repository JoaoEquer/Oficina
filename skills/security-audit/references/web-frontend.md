# Web frontend (React / Vite / Next / plain JS)

## Leads
| Pattern | Looking for |
|---|---|
| `dangerouslySetInnerHTML\|\.innerHTML\s*=\|outerHTML\|insertAdjacentHTML\|document\.write\|v-html` | DOM XSS sinks |
| `href=\{.*\}\|window\.location\s*=\|location\.href\s*=` with user/URL data | `javascript:` URLs, open redirect |
| `VITE_\|NEXT_PUBLIC_\|REACT_APP_\|EXPO_PUBLIC_` near `SECRET\|KEY\|TOKEN\|PASSWORD` | Secret shipped in the bundle |
| `addEventListener\(['"]message` | `postMessage` handler without `event.origin` check |
| `localStorage\.setItem\(.*(token\|jwt\|session)` | Token readable by any XSS |
| `eval\(\|new Function\(\|setTimeout\(\s*['"\`]` | Code from strings |
| `target=["']_blank["']` without `rel` | Reverse tabnabbing (old browsers; Low) |
| Next: `app/api/**`, `pages/api/**`, server actions (`'use server'`) | These are backend: apply node-api.md |

## Checks
- **Bundle secrets**: any `*_PUBLIC_*`/`VITE_*` var is public by definition. A key that grants write access or paid API usage there is Critical. Publishable keys meant for the client (Stripe `pk_`, Supabase anon with RLS on, Firebase web config) are not findings, but Supabase anon key + RLS disabled is.
- **Sanitizer**: if HTML from users is rendered, a sanitizer (DOMPurify) must run on the same value right before the sink.
- **Authorization lives on the server**: hiding a button is not a control. A frontend-only check guarding an API that does not re-check = finding against the API.
- **Static sites with forms**: where does the form post? Third-party endpoint keys in the page are public.
- **Next.js**: server actions are public POST endpoints; each must check auth itself. Middleware-only auth on matcher patterns can miss routes.

## Not a finding
- `{value}` in JSX, `{{ value }}` in Vue templates.
- `innerHTML` with a constant string.
- Token in `localStorage` alone, without an XSS path: MEDIUM note at most (tradeoff, not a vuln).
