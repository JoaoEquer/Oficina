---
name: client-facing-docs
description: Escrever documentação técnica voltada a cliente — documento de arquitetura, proposta, apresentação de projeto — em português claro, sem jargão, com números honestos e princípios de engenharia pragmática explícitos. Use sempre que o material for lido por cliente ou stakeholder não-técnico: doc de arquitetura, apresentação de kickoff, proposta, relatório de entrega ou e-mail de fechamento.
---

# Documentação para cliente

Documento para cliente não é documento técnico com capa bonita. É outra escrita.

## Princípios

1. **Zero jargão sem tradução.** "Monorepo" vira "repositório único". "Multi-tenant" vira "cada empresa com seus dados isolados". "CI/CD" vira "toda alteração passa por verificação automática antes de entrar no ar". Se o termo técnico precisar aparecer, a explicação em uma frase vem junto.
2. **Números honestos.** Horas, prazos e escopo refletem o contrato real — nunca uma versão parcial que "apresenta melhor". Erro de número em material apresentado é o tipo de coisa que corrói confiança e é caríssimo de corrigir depois.
3. **Escopo do documento = escopo contratado.** Fase futura, visão de produto e possibilidade comercial ficam de fora do documento do MVP (no máximo, uma nota de uma linha: "evoluções futuras dependem de novo ciclo comercial").
4. **Time real, papéis reais.** Só quem está de fato alocado, com o papel correto de cada um. Conferir antes de enviar.
5. **Princípios de engenharia explícitos.** Uma seção curta dizendo como o time decide: tecnologia comprovada acima de moda, complexidade só quando o problema exige, decisões reversíveis, prazos honestos. Cliente entende e valoriza — e o documento vira âncora quando alguém sugerir a moda da semana.

## Formatos da casa

**Documento de arquitetura/estrutura (HTML responsivo):**
- Seções: visão geral → o que o sistema faz → como está organizado (repos, módulos) → time e papéis → princípios de engenharia → cronograma/frentes de trabalho
- Linguagem corrida, tabelas só onde comparação exige
- Sem bordas decorativas Unicode e sem excesso de emoji (quebram renderização e envelhecem mal)

**Apresentação (deck HTML fullscreen):**
- Navegação por teclado (←/→) e clique, barra de progresso, contador de slide
- Um assunto por slide, frases curtas
- Exportação para PDF para distribuição por WhatsApp/e-mail (o PDF é o que circula; o HTML é o que apresenta)
- **Conferência final obrigatória**: números do deck × números do contrato, antes de apresentar

**E-mail de fechamento (semanal/entrega):**
- O que foi feito (fatos verificáveis), o que vem a seguir, pendências que dependem do cliente
- Curto: se passou de uma tela, virou relatório e ninguém lê

## Checklist antes de enviar qualquer material

- [ ] Números batem com o contrato/plano de execução
- [ ] Time e papéis conferidos
- [ ] Jargão traduzido ou eliminado
- [ ] Escopo limitado ao contratado
- [ ] Revisão de renderização no dispositivo em que o cliente vai abrir (celular, geralmente)
