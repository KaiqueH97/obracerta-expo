# Home com dados do aplicativo

O resumo usa o AsyncStorage já utilizado nas demais telas:

- Obras cadastradas: quantidade de registros de `@meus_projetos`. Não há campo
  de status de obra no aplicativo, por isso não se usa mais “Obras ativas”.
- Tarefas concluídas e pendentes: campo booleano `concluida` em `@tarefas_<id>`.
- Custo dos materiais: soma de `preco_total` em `@materiais_<id>`, acumulada em
  centavos. Inclui os materiais adicionados pela calculadora e pelos detalhes.
- Projetos recentes: até cinco obras, ordenadas por `criado_em`, com botão para
  abrir seus detalhes. Datas ausentes aparecem como “Data não informada”.

A leitura inclui somente obras ainda cadastradas. Dados órfãos de obras excluídas
não entram nas métricas. Nenhum registro é alterado pela Home.
O resumo é atualizado sempre que a aba ganha foco e mostra carregamento, estado
vazio ou erro com nova tentativa, sem apresentar totais parciais como completos.

Os dados são locais à instalação/navegador, sem sincronização entre web, Expo Go
ou Supabase. O armazenamento de obras atual continua compartilhado entre os
logins demonstrativos do mesmo dispositivo.

## Layout

- Uma coluna de cartões no celular, duas a partir de 768 e quatro a partir de
  1024 pixels de largura ajustada à escala de fonte.
- Conteúdo centralizado com largura máxima de 1200 pixels na web.
- Ações rápidas lado a lado em telas largas e empilhadas nas estreitas.
- Títulos longos podem quebrar linha. Em telas compactas, o botão Abrir fica
  abaixo das informações da obra. Áreas de toque de pelo menos 48 pixels.
- Áreas seguras laterais respeitadas e conteúdo com rolagem vertical.

## Validação realizada

- Lint e verificação de tipos em JavaScript.
- 12 testes existentes e de agregação, incluindo arredondamento, ordenação,
  ausência de dados, registros inválidos e obras excluídas.
- Exportações web, Android e iOS.
- Chrome headless em 320, 390, 768 e 1440 pixels: sem rolagem horizontal nem
  botões fora da largura da tela, usando título longo e custo de R$ 1.234.567.890,12.
- Estados vazio, erro e nova tentativa; abertura dos detalhes e atualização do
  resumo após alterar tarefas e retornar à Home.

A conferência em aparelho físico ainda deve ser feita no Expo Go.

## Como conferir

1. Execute `npm start` para Expo Go ou `npm run web` para navegador.
2. Sem obras, confira cartões zerados e o convite para criar um projeto.
3. Crie duas obras. Em uma delas, adicione materiais de R$ 100,50 e R$ 20,00,
   duas tarefas e marque uma como concluída.
4. Volte para Início: devem aparecer 2 obras, 1 tarefa concluída, 1 pendente e
   custo de R$ 120,50 (se não houver outros registros).
5. Use Abrir no projeto recente, conclua a outra tarefa e volte para Início:
   o resumo deve atualizar para 2 concluídas e nenhuma pendente.
6. Renomeie/exclua uma obra e confira o resumo ao voltar para Início.
7. Confira rotação do celular e fonte ampliada; na web, redimensione a janela.
