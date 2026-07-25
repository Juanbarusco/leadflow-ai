# Supabase — configuração da Release 0.12

A aplicação continua abrindo em modo demonstração quando as variáveis do Supabase estão vazias. Para ativar login, workspace e persistência real:

1. Crie um projeto no Supabase.
2. Abra **SQL Editor**.
3. Execute os arquivos abaixo, nesta ordem:

```text
supabase/migrations/202607240001_release_011_saas_foundation.sql
supabase/migrations/202607240002_release_012_crm_actions.sql
```

4. Em **Project Settings → API / Connect**, copie:
   - Project URL;
   - Publishable Key (ou Anon Key em projetos antigos).
5. Crie `.env.local` com:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICA
```

6. Em **Authentication → URL Configuration**, adicione:

```text
http://localhost:3000/auth/callback
```

7. Reinicie o Next.js.

## O que a migration cria

- `organizations`
- `profiles`
- `organization_members`
- `missions`
- `companies`
- `mission_companies`
- `credit_wallets`
- `credit_ledger`
- `crm_deals`
- `crm_interactions`
- `crm_tasks`

Também cria o workspace automaticamente após o cadastro, aplica RLS e separa os dados por organização.

## Teste mínimo

1. Acesse `/signup`.
2. Crie uma conta.
3. Confirme o e-mail, se a confirmação estiver ativa.
4. Entre em `/login`.
5. Execute uma missão.
6. Feche e abra o navegador.
7. Abra uma empresa e registre uma interação.
8. Confirme que a empresa aparece em `/crm` com etapa, tarefa e recomendação.
9. Feche e abra o navegador e confirme que os dados continuam disponíveis.
