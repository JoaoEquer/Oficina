# LLM integration

Threat model: any text the model reads can carry instructions (prompt injection). The model's output is untrusted input to whatever consumes it. The security boundary is the tools and data the model can reach, not the system prompt.

## Leads
| Pattern | Looking for |
|---|---|
| `new Anthropic\(\|new OpenAI\(\|apiKey:` in client code (React, Expo, Electron renderer) | Provider key shipped to users |
| `tools:\|tool_use\|function_call\|tool_choice` | Tools the model can invoke: list them |
| tool handlers calling `exec\|fs\.\|fetch\(\|prisma\.\w+\.(delete\|update\|create)` | Side effects reachable from model output |
| `dangerouslySetInnerHTML\|marked\(\|innerHTML` on model output | XSS through model output |
| `system:` / prompt templates with `${userInput}` / retrieved docs | Where untrusted text enters |
| `max_tokens\|rateLimit` around model routes | Cost abuse controls |
| logging of `messages\|prompt\|completion` | PII in logs and traces |

## Checks
- **Key location**: provider keys only on a server. A key in a client bundle = Critical (billing abuse, data access on the account).
- **Injection to action**: for every tool with side effects (send email, write DB, run code, fetch URL), can text from a non-owner (web page, uploaded file, other user's record, email body) cause the call? If yes and there is no human confirmation or strict allowlist = High. Tool args must be validated as if from the internet; tenant scope comes from the session, never from model output.
- **Data exfiltration**: model can fetch URLs or render images/links with model-chosen URLs = secrets/PII in the query string. Restrict domains or strip.
- **Output handling**: model output rendered as HTML/Markdown passes through a sanitizer; output parsed as JSON is schema-validated before use; never `eval`.
- **Cost/DoS**: per-user rate limit and `max_tokens` on public endpoints; no unbounded agent loops.
- **Retention**: prompts with personal data sent to providers and logs follow the privacy policy; do not log full conversations by default.

## Not a finding
- System prompt "leak" by itself: prompts are not secrets. Flag only if the prompt contains credentials or private data.
- A read-only, no-tool chatbot answering from public docs: injection there changes text, not state.
