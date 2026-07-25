# Checklist de lançamento — LeadFlow AI

## Código

- [ ] `npm install`
- [ ] `npm run check`
- [ ] `npm run build`
- [ ] Testar desktop e celular.

## Supabase

- [ ] Criar projeto.
- [ ] Executar `supabase/migrations/202607240001_release_011_saas_foundation.sql`.
- [ ] Executar `supabase/migrations/202607240002_release_012_crm_actions.sql`.
- [ ] Configurar URL e Publishable Key.
- [ ] Configurar callback `/auth/callback`.
- [ ] Testar cadastro, confirmação, login, recuperação e logout.
- [ ] Confirmar RLS com duas contas diferentes.
- [ ] Confirmar persistência de missões e empresas.
- [ ] Registrar uma interação e confirmar etapa, tarefa e histórico no CRM.
- [ ] Confirmar RLS de negócios, interações e tarefas com duas contas.

## Google Places

- [ ] Ativar faturamento apenas na homologação final.
- [ ] Ativar Places API (New).
- [ ] Criar e restringir a chave do backend.
- [ ] Configurar orçamento e cotas.
- [ ] Definir `LEADFLOW_DATA_MODE=live`.

## Produto

- [ ] Testar configurações e perfil.
- [ ] Testar navegação fixa do relatório.
- [ ] Confirmar que dados ausentes exibem “Não informado”.
- [ ] Confirmar que o modo demonstração não aparece em produção.
- [ ] Testar WhatsApp, e-mail, ligação e registro de interação.
- [ ] Confirmar pipeline e conclusão de tarefas.
- [ ] Concluir cobrança, créditos, suporte e páginas legais antes da venda pública.

## Comando final

```bash
npm run launch:check
```
