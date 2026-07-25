# LeadFlow AI 0.9.2

Correção do seletor de segmento.

## Causa

`DropdownMenuLabel` usa `MenuPrimitive.GroupLabel` do Base UI. Esse componente exige um ancestral `MenuPrimitive.Group`. Sem o grupo, o menu lançava `MenuGroupContext is missing` ao abrir e o error boundary do Next mostrava “This page couldn't load”.

## Correção

- O conteúdo do seletor de segmento agora está envolvido por `DropdownMenuGroup`.
- O menu abre e permite trocar o segmento sem exceções no navegador.
- O seletor de localização também foi testado no mesmo fluxo.

## Validação

- ESLint: aprovado.
- TypeScript (`tsc --noEmit`): aprovado.
- Teste de interação em Chromium: menu aberto, opção selecionada e modal de localização aberto sem erros de console ou exceções de página.
