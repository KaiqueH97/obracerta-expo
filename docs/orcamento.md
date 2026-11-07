# Detalhes da obra em JavaScript

Referência: `app/(sistema)/projetos/[id]/page.tsx` e seus componentes de caixa,
checklist e cotação no projeto `/home/kaique/obra-certa-web`.

A página foi adaptada para React Native, JavaScript e Expo Go, com persistência
local no AsyncStorage. Não consulta nem altera o Supabase do site.

## Acompanhamento financeiro

Os quatro indicadores consideram todos os registros da obra, incluindo os que
não estão na página atualmente visível:

- Entradas: recebimentos do cliente.
- Materiais: soma dos custos registrados no orçamento.
- Equipe: pagamentos lançados para os profissionais.
- Lucro atual: entradas menos materiais menos pagamentos da equipe.

Os cálculos acumulam centavos. Não somam a diária do cadastro de profissionais
como despesa automática: somente pagamentos registrados entram no custo da equipe.
As diárias sugerem o valor do formulário e podem ser ajustadas para vários dias
ou adiantamentos.

Os tipos antigos `RECEBIMENTO` e `PAGAMENTO` continuam sendo lidos, sem regravar
ou apagar o histórico. Os pagamentos antigos sem profissional também entram no
total Equipe e recebem indicação de pagamento anterior no histórico. A página
informa isso quando existem esses registros. Não há dupla cobrança dos materiais
no caixa: seu custo vem diretamente do orçamento.

## Orçamento

- Lista com nome, quantidade e custo, além de edição explícita dos três campos.
- Exclusão com confirmação e atualização dos indicadores após salvar.
- Inclusão exclusivamente pela Nova Medição; cadastro manual removido.
- Calculadora recebe a obra selecionada e retorna aos detalhes após salvar.
- Cotação completa, incluindo todos os materiais e contato do perfil local,
  quando disponível; texto selecionável e abertura opcional no WhatsApp.

## Caixa e checklist

- Tipos Entrada: Dinheiro do Cliente e Saída: Pagamento da Equipe.
- Seletor de profissionais da tela Equipe, com sugestão da diária.
- Descrição obrigatória, valor positivo e validação de moeda brasileira.
- Histórico com descrição, profissional, valor, sinal e data, quando registrada.
- Exclusão confirma o efeito no lucro; remover o registro não estorna um pagamento.
- O nome do profissional é preservado no lançamento para consulta após sua exclusão
  da equipe. Mudanças de diária não alteram pagamentos anteriores.
- Checklist permite adicionar tarefas e alternar conclusão.
- Materiais, caixa e tarefas têm paginação local de 20 registros.

## Dados e responsividade

As chaves anteriores `@materiais_<id>`, `@caixa_<id>` e `@tarefas_<id>` são
preservadas. A leitura valida os registros e a existência da obra. Falhas de leitura
não aparecem como totais zerados; há nova tentativa. A interface só aplica mudanças
depois da gravação e bloqueia envios simultâneos.

Mobile e tablet usam abas. Desktop mostra os três painéis lado a lado, como na
referência. O layout ajusta as colunas dos indicadores à largura e à escala de fonte.

## Validação realizada

- Lint, verificação de tipos e 18 testes automatizados, incluindo cálculo do lucro,
  centavos, tipos antigos, falhas de leitura/gravação e isolamento entre obras.
- Chrome: entrada de R$ 1.000 somada a R$ 500 anteriores, R$ 100 de materiais e
  pagamento de diária de R$ 150 resultaram em lucro de R$ 1.250.
- Cadastro de pagamento exige profissional e sugere a diária. Exclusão e cancelamento,
  edição do custo do material, checklist e cotação completa foram conferidos.
- Paginação do caixa com 21 registros e layouts de 320, 390, 768 e 1440 pixels
  sem transbordamento horizontal ou controles fora da tela.
- Exportações web, Android e iOS.

## Como conferir no Expo Go

1. Cadastre um profissional na Equipe com diária de R$ 150.
2. Abra uma obra e confira os quatro indicadores; não deve haver inclusão manual.
3. Faça uma Nova Medição, salve e confira os materiais ao retornar.
4. Em Caixa, registre uma entrada do cliente com descrição e valor.
5. Escolha Pagamento da Equipe, selecione o profissional, confira a diária sugerida
   e registre o pagamento. Verifique o lucro no topo.
6. Tente registrar sem descrição, sem profissional ou com valor zero/negativo.
7. Cancele uma exclusão e depois confirme: os totais só devem mudar ao confirmar.
8. Edite nome, quantidade e custo de um material e confira o indicador Materiais.
9. Adicione e conclua uma tarefa; volte à Home e confira suas contagens.
10. Reabra a obra e confira a persistência. Teste fonte ampliada e teclado aberto.

A interface nativa ainda deve ser conferida em aparelho físico. A abertura externa
do WhatsApp não foi acionada nos testes.
