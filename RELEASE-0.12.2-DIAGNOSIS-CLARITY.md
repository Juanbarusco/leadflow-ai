# Release 0.12.2 — Diagnosis Clarity

## Objetivo

Reorganizar o diagnóstico das empresas para que o usuário entenda com clareza onde cada análise começa, o que foi encontrado e qual solução pode oferecer.

## Alterações

- Removido o mosaico de diagnósticos lado a lado.
- Website, SEO local, Instagram e Google agora aparecem em blocos completos e verticais.
- Cada bloco segue a mesma ordem:
  1. O que a missão encontrou.
  2. O que está prejudicando a empresa.
  3. O que o vendedor pode oferecer.
- Adicionada navegação rápida entre os quatro canais.
- Adicionada orientação de leitura antes dos diagnósticos.
- Score e situação atual ficaram isolados no cabeçalho de cada canal.
- Melhorada a leitura em desktop e celular.
- Corrigido aviso do ESLint causado pela abertura automática do painel comercial via query string.

## Validação

- ESLint aprovado.
- TypeScript (`tsc --noEmit`) aprovado.
