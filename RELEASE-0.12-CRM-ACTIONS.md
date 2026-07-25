# Release 0.12 — CRM Actions

## Implementado

- CRM com IA liberado no menu e em `/crm`.
- Pipeline funcional com etapas, potencial, próxima ação e probabilidade.
- Alteração manual de etapa diretamente no pipeline e no relatório.
- “Iniciar abordagem” abre um painel comercial real.
- Abordagens editáveis para WhatsApp, e-mail, ligação, reunião e anotação.
- Abertura de WhatsApp com mensagem preenchida.
- Abertura do cliente de e-mail com assunto e corpo preenchidos.
- Ligação pelo protocolo `tel:` quando há telefone.
- Registro do resultado de cada contato.
- Histórico de interações por empresa.
- Identificação de objeções por IA comercial baseada no acontecimento registrado.
- Atualização automática da etapa, probabilidade e próxima melhor ação.
- Criação automática de follow-up após cada interação relevante.
- Criação manual e conclusão de tarefas.
- Modo demonstração persistido no `localStorage`.
- Persistência real no Supabase quando configurado.
- RLS para negócios, interações e tarefas.
- Botões de contato do relatório integrados ao fluxo de registro.

## Migration

Execute depois da migration 0.11:

```text
supabase/migrations/202607240002_release_012_crm_actions.sql
```

Ela cria:

- `crm_deals`
- `crm_interactions`
- `crm_tasks`

## Como testar

1. Execute uma missão.
2. Abra o relatório de uma empresa.
3. Clique em **Iniciar abordagem**.
4. Abra o canal desejado.
5. Registre o resultado da conversa.
6. Confira a recomendação da IA, a tarefa criada e a etapa atualizada.
7. Abra `/crm` e confirme que a empresa aparece no pipeline.

## Ainda não ativado

- Envio automático por WhatsApp Business API.
- Caixa de e-mail integrada.
- Telefonia integrada.
- IA generativa externa para recomendações livres.
- Cobrança e desconto de créditos.
- Automação de mensagens sem confirmação humana.

A Release 0.12 utiliza regras comerciais determinísticas para que o CRM funcione sem uma chave adicional de IA. A camada generativa poderá ser conectada depois sem alterar o histórico ou o modelo de dados.

## Validação

```bash
npm run lint
npx tsc --noEmit
```

O `next build` depende do download do SWC compatível com a plataforma.
