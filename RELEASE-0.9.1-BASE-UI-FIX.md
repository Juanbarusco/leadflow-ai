# Release 0.9.1 — Base UI navigation fix

## Correção

- Removidas cinco composições inválidas de `Button` do Base UI com `Next.js Link`.
- Links com aparência de botão agora são elementos `<a>` semânticos estilizados com `buttonVariants`.
- Corrigidos os pontos em `Topbar`, `DailyBriefing` e no estado vazio de `Companies`.
- O seletor de segmento continua usando um `<button>` nativo e abre o menu normalmente.

## Validação

- `npm run lint`: aprovado.
- `npx tsc --noEmit`: aprovado.
- `npm run build`: não concluído neste ambiente porque o download do SWC Linux do Next.js retornou HTTP 503 antes da compilação.
