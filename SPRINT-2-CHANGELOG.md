# Sprint 2 — Refatoração da Mission

## Entregue

- Extração da execução da missão para `useMissionExecution`.
- Extração e persistência das preferências para `useMissionPreferences`.
- Centralização de configurações, atividades e estágios em `lib/mission/config.ts`.
- Centralização de tipos em `lib/mission/types.ts`.
- Centralização de formatadores, URLs externas e áudio em `lib/mission/utils.ts`.
- Extração do overlay ao vivo, preferências, métricas e notificações para `MissionRuntime.tsx`.
- Redução da `MissionPage` de 1.147 para aproximadamente 390 linhas.
- Preservação do comportamento visual e funcional existente.

## Validação

- TypeScript: aprovado com `tsc --noEmit`.
- ESLint: aprovado sem erros ou avisos.
- Build Next.js: iniciado, mas o ambiente não conseguiu baixar o pacote SWC por erro HTTP 503. Não foi identificado erro de código antes da falha externa.

## Teste manual recomendado

1. Abrir `/mission`.
2. Confirmar que o modo ao vivo abre normalmente.
3. Testar velocidades lenta, normal e rápida.
4. Ativar/desativar som, animações, tela cheia e pensamento da IA.
5. Aguardar liberação gradual dos leads.
6. Confirmar toast de novo lead e conclusão.
7. Testar site, Instagram, Maps e geração de abordagem.
8. Reiniciar a missão e confirmar que todos os estados voltam ao início.
