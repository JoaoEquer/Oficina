# Filosofia de engenharia

Regras sempre-ativas. Copie este bloco para o `CLAUDE.md` do projeto.

- **Tecnologia comprovada acima de moda.** A escolha padrão é a ferramenta madura que o time domina. Novidade entra com justificativa registrada, nunca por empolgação.
- **Complexidade só quando o problema exige.** Sem Redis, fila externa, microserviço ou camada de abstração "para o futuro". Postgres e um monólito modular resolvem até prova em contrário.
- **Decisões reversíveis primeiro.** Entre duas opções, prefira a que é barata de desfazer. Decisão irreversível (schema de produção, contrato de API público) exige revisão do tech lead antes.
- **Sem buzzword.** Em código, doc e conversa: linguagem direta. Se não dá para explicar em uma frase o que a coisa faz, o problema é o design, não o vocabulário.
- **Prazos honestos.** Estimativa é compromisso de comunicação, não de heroísmo. Estourou? Avisa cedo, com plano.
- **Não over-engenheire.** SRP e DIP valem sempre; hexagonal, repositório genérico e abstração especulativa, não. Abstração só onde o custo se paga.
- **Fonte da verdade documental.** Modelo de dados, escopo e plano vêm de documentos nomeados. Divergência entre documentos é bloqueio a resolver, não detalhe a ignorar.
