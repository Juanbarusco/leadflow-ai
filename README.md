# LeadFlow AI

Copiloto comercial com IA para encontrar empresas, analisar presença digital, priorizar oportunidades e preparar abordagens.

## Release atual: 0.12

A aplicação possui dois níveis de execução:

- **Modo demonstração:** abre sem credenciais externas e mantém a experiência local para validação.
- **Modo SaaS:** Supabase ativa login, workspaces, RLS, persistência e CRM; Google Places ativa dados empresariais reais.

## Instalação

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

## Validação

```bash
npm run check
npm run build
```

## Ativar autenticação e banco

Siga `SUPABASE-SETUP.md` e execute as migrations, na ordem:

```text
supabase/migrations/202607240001_release_011_saas_foundation.sql
supabase/migrations/202607240002_release_012_crm_actions.sql
```

## Ativar dados reais

```env
LEADFLOW_DATA_MODE=live
GOOGLE_PLACES_API_KEY=SUA_CHAVE
GOOGLE_PLACES_MAX_RESULTS=8
GOOGLE_PLACES_ENRICH_LIMIT=8
```

## Verificação antes do lançamento

```bash
npm run launch:check
```

O comando exige Google Places, Supabase e `NEXT_PUBLIC_SITE_URL`.

## Segurança

- A chave do Google nunca recebe `NEXT_PUBLIC_`.
- A chave pública do Supabase pode ficar no navegador; o acesso aos dados é protegido por RLS.
- As missões e empresas são sempre associadas ao workspace do usuário.
- O modo demonstração não simula uma cobrança real.

Consulte `RELEASE-0.12-CRM-ACTIONS.md` e `LAUNCH-CHECKLIST.md`.
