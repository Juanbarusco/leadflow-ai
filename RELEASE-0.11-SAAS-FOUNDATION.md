# Release 0.11 — SaaS Foundation

## Implementado

- Login, cadastro, recuperação e redefinição de senha.
- Supabase SSR com cookies.
- `proxy.ts` para proteção otimista das rotas no Next.js 16.
- Workspace criado automaticamente para novos usuários.
- Perfis, organizações e membros com RLS.
- Persistência de missões e empresas.
- Recuperação da última missão após nova sessão.
- Relatório capaz de abrir uma empresa persistida no banco.
- Perfil real no topo com menu de conta, cobrança, ajuda e logout.
- Configurações funcionais para perfil, empresa e padrões de prospecção.
- Página de plano e créditos com regras transparentes e status real da cobrança.
- Central de ajuda inicial.
- Correção da navegação fixa do relatório abaixo da barra superior.
- Landing direcionada para login e cadastro.
- Modo demonstração preservado quando o Supabase não estiver configurado.

## Preparado, mas ainda não ativado

- Cobrança recorrente e compra de créditos.
- Débito/reserva/estorno de créditos.
- CRM com IA.
- Chamados de suporte e painel administrativo.

## Validação

```bash
npm run lint
npx tsc --noEmit
```

O build depende do binário SWC da plataforma. Caso o download externo esteja indisponível, execute o build localmente após `npm install`.
