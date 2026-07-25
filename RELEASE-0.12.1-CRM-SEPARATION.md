# Release 0.12.1 — CRM separado do relatório

## Mudanças

- Remove o painel completo do CRM de dentro do relatório da empresa.
- Mantém o relatório focado em contato, resumo, diagnóstico, oportunidades, plano e abordagem.
- O CRM continua em uma área exclusiva em `/crm`.
- Ações de WhatsApp, ligação, e-mail e “Iniciar abordagem” continuam abrindo o registro de interação em painel lateral.
- O CRM pode abrir diretamente o registro de interação de uma empresa usando `?crm=1`.
- Links do pipeline agora usam “Registrar interação”, sem depender de uma âncora removida.

## Fluxo

Missão → Relatório da empresa → Registrar interação → CRM atualizado → acompanhar pipeline em `/crm`.
