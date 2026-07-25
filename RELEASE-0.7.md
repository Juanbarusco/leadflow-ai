# LeadFlow AI — Release 0.7

## Entrega principal

A 0.7 transforma o dashboard em um cockpit comercial mais completo, com hierarquia executiva e leitura rápida.

### Novo painel executivo
- Receita potencial consolidada.
- Evolução visual de oportunidades em 12 semanas.
- Ticket médio e taxa de conversão.
- Próximas ações recomendadas pela IA.
- Indicadores de leads críticos, confiança e receita provável.

### Pipeline inteligente
- Visão em quatro estágios: descobertos, em contato, proposta e fechamento.
- Cards comerciais com score, segmento e próxima etapa.
- Receita potencial por coluna.

### Performance e estabilidade
- Menor frequência de atualização do Mission Control.
- Transição de progresso suavizada por CSS.
- Menos re-renderizações durante a execução.
- Configuração local do VS Code para reconhecer as diretivas do Tailwind CSS 4 sem alertas falsos.

### Validação
- ESLint: aprovado sem erros.
- TypeScript (`tsc --noEmit`): aprovado.
- Build: código chegou à etapa de compilação, mas o ambiente de entrega não conseguiu baixar o pacote SWC por erro HTTP 503.
