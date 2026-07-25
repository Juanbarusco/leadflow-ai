# LeadFlow AI — Release 0.9 · Copilot UX

## Objetivo

Transformar a entrada do produto em um fluxo simples, elegante e impossível de confundir: o usuário informa quem quer encontrar, escolhe onde buscar e inicia a prospecção.

## Principais mudanças

### Dashboard “Hoje”

- Dashboard reconstruída com mais espaço, tipografia forte e menos caixas.
- Resumo do dia apresentado como informação editorial, sem grade de cards comprimidos.
- Área principal de prospecção ganhou protagonismo visual.
- Pendências viraram uma lista leve e acionável.
- Empresas prioritárias usam os dados da última missão quando disponíveis.

### Centro de prospecção

- Campo principal dedicado ao objetivo comercial.
- Localização separada do texto da busca.
- Seletor de cobertura com:
  - Brasil inteiro;
  - região;
  - estado;
  - cidade e raio.
- Campo de cidade livre, permitindo Manaus, Florianópolis, São Paulo ou qualquer outra cidade.
- Raio de 10, 25, 50, 100 ou 200 km.
- Segmento selecionado separadamente.
- Sugestões rápidas de missões.
- Botão principal “Encontrar oportunidades” grande e visível.
- Página dedicada em `/prospecting`.

### Missão conectada

- A missão usa o objetivo, segmento e localização selecionados.
- Textos de execução e resumo deixaram de ser fixos em São Carlos.
- Resultados simulados agora respeitam cidade, estado, região ou Brasil inteiro.
- A última missão é salva localmente para alimentar Dashboard e Empresas.

### Empresas

- Nova página funcional em `/companies`.
- Busca por nome ou cidade.
- Filtro de prioridade.
- Abertura do relatório completo da empresa.
- Estado vazio com ação clara para iniciar a primeira prospecção.

### Navegação

- Menu reduzido às áreas que fazem sentido agora:
  - Hoje;
  - Nova prospecção;
  - Missão atual;
  - Empresas;
  - CRM com IA marcado honestamente como “Em breve”.
- Itens ativos reais por rota.
- Topbar simplificada.
- CTA “Nova prospecção” visível fora da tela de criação.

## Performance

- Nenhum `setInterval` foi adicionado à Dashboard.
- O novo centro de prospecção não possui animações contínuas.
- A Dashboard deixou de usar radar, gráficos e atualizações frequentes.

## Validação

- ESLint: aprovado sem erros ou avisos.
- TypeScript (`tsc --noEmit`): aprovado.
- Build do Next.js: não concluído neste ambiente porque o download do SWC Linux retornou HTTP 503. O erro aconteceu antes da compilação do projeto.

## Pacote

O ZIP da release não contém:

- `node_modules`;
- `.next`;
- `.git`;
- `package-lock.json`;
- `tsconfig.tsbuildinfo`.
