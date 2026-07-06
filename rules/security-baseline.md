# Linha de base de segurança

Inegociáveis em qualquer projeto do stack:

- **Identidade e tenant vêm do token, nunca do input.** `workspaceId`, `userId` e afins são extraídos do JWT/contexto autenticado. Qualquer endpoint que aceite esses campos no corpo é bug de segurança.
- **Autorização no servidor.** Guard/decorator de permissão em toda rota que não seja explicitamente pública. Front esconde botão; servidor nega ação.
- **Isolamento de tenant na camada de dados.** Toda query filtra por workspace. Revisão de PR verifica isso em cada método novo de repositório.
- **Segredos fora do repositório.** `.env` no `.gitignore`, `.env.example` com placeholders. Segredo commitado = rotacionar na hora, não só apagar do histórico.
- **Validação de entrada em toda borda** (`class-validator` + `ValidationPipe` global com `whitelist: true`).
- **Datas em UTC no banco e na API**; fuso só na apresentação.
- **Dados pessoais com LGPD em mente**: colete o mínimo, registre a finalidade, e trate exclusão de dado pessoal como requisito (única exceção aceita ao soft delete).
- **Dependências**: sem pacote obscuro por conveniência; `npm audit`/Dependabot ativos no repo.
