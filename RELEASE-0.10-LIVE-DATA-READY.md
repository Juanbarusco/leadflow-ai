# Release 0.10 — Live Data Ready

Esta versão deixa o fluxo de prospecção pronto para operar com Google Places sem exigir pagamento durante o desenvolvimento.

## Funcionamento atual

- Sem `GOOGLE_PLACES_API_KEY`: o sistema usa modo demonstração claramente identificado.
- Com a chave configurada: o backend troca automaticamente para Google Places.
- A chave nunca é enviada ao navegador.
- A busca e o enriquecimento passam por uma rota interna do Next.js.
- O relatório suporta telefone, WhatsApp, endereço, Maps, website, avaliação e horários.
- Dados ausentes são exibidos como não informados; a produção não inventa contatos.

## Estratégia de custo

1. Text Search busca apenas identificação e localização.
2. Place Details enriquece somente a quantidade configurada em `GOOGLE_PLACES_ENRICH_LIMIT`.
3. As máscaras de campo evitam solicitar todos os dados disponíveis.
4. A quantidade por missão é limitada por variáveis de ambiente.

## Ativação no lançamento

1. Ative Places API (New) e faturamento no Google Cloud.
2. Crie uma chave restrita à Places API (New).
3. Configure `GOOGLE_PLACES_API_KEY` no ambiente da hospedagem.
4. Use `LEADFLOW_DATA_MODE=live`.
5. Execute `npm run launch:check`.
6. Faça uma missão de teste antes de liberar usuários.

## Rotas

- `POST /api/missions`: executa a missão no servidor.
- `GET /api/system/status`: informa o modo ativo sem revelar segredos.
