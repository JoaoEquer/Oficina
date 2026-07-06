# Fluxo de Git e documentação desde o dia 0

- **Branch por entrega**: `feat/<dominio>`, `fix/<assunto>`, `chore/<assunto>`. Nada direto na `main` depois do setup inicial.
- **Commits convencionais** (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`), mensagem no imperativo, descrevendo o *porquê* quando não for óbvio.
- **Documentado desde o dia 0**: todo dia/entrega gera um registro curto do que foi feito (o que, por quê, pendências), armazenado na pasta de documentação do projeto (`docs/registro/` no repo e/ou o Drive combinado com o cliente). O registro alimenta o e-mail de fechamento — nunca escreva o fechamento de memória.
- **PR pequeno**: um domínio/assunto por PR. PR que mistura schema + três domínios + refactor não recebe revisão de verdade.
- **Migration com nome descritivo** e revisada antes de merge; migration de produção só depois do checklist da skill `prisma-schema-conventions`.
- **README do repo sempre atualizado** com: como subir local, variáveis de ambiente (`.env.example` obrigatório) e estrutura de pastas.
