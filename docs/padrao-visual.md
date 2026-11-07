# Padrão visual e responsividade

A Home é a referência para todas as telas. O componente
`src/components/ScreenLayout.js` centraliza:

- Cabeçalho preto com capacete, marca Obra Certa e borda laranja.
- Fundo claro, títulos de 28 px, subtítulos e cartões com borda e raio de 16 px.
- Área de conteúdo com largura máxima de 1200 px, centralizada na web.
- Margens mínimas de 16 px, respeitando as áreas seguras do aparelho.
- Seletores e controles com altura mínima de 48 px.

Home, Projetos, Calculadora, Equipe, Perfil, detalhes da obra e nova medição usam
o mesmo cabeçalho e a mesma largura de conteúdo. Os formulários de Login, Cadastro,
Recuperar senha e Redefinir senha compartilham o cabeçalho, mas mantêm largura
máxima de 440 px para leitura confortável. Os formulários de acesso têm rolagem
e adaptação ao teclado pelo KeyboardAvoidingView no iOS.

Cartões mantêm a organização apropriada a cada tela. Nos detalhes, por exemplo,
os três painéis continuam lado a lado em desktop e em abas nas telas menores.
Os breakpoints compartilhados consideram largura e escala de fonte do sistema.
Não houve alteração nas regras de negócio ou no formato dos dados locais.

## Conferência

As 11 rotas foram verificadas no Chrome com larguras de 320, 390, 768 e 1440 px
(44 combinações), com nomes longos e valores elevados. A verificação confirmou
cabeçalho comum, ausência de rolagem horizontal e controles dentro da tela.
Botões com nomes longos de materiais agora quebram linha dentro do cartão.

O fluxo de nova medição foi reconferido, incluindo cálculo, obra selecionada,
salvamento e retorno aos detalhes. Lint, verificação de tipos, os 18 testes
existentes e exportações web, Android e iOS também foram executados.

## No Expo Go

1. Abra todas as abas e compare cabeçalho, margens, títulos e cartões.
2. Confira Projetos e Calculadora, inclusive edição de obra e resultado do cálculo.
3. Abra uma obra e confira indicadores, orçamento, caixa e checklist.
4. Aumente a fonte do sistema e gire o aparelho: textos devem quebrar sem esconder
   controles nem sobrepor elementos.
5. Abra os formulários com o teclado visível e confira a rolagem até os botões.
6. Confira Login, Cadastro, Recuperar senha e Redefinir senha.

A conferência visual nativa, teclado e fonte ampliada em aparelho físico ainda
precisa ser feita pelo roteiro acima.
