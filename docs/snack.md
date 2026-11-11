# Entrega acadêmica pelo Expo Snack

## O que entregar

O recorte da disciplina é um aplicativo **frontend em JavaScript e React Native**: telas, navegação, validação dos formulários, alertas e salvamento local. Não é necessário criar servidor, API, autenticação real, envio de e-mails ou banco na nuvem.

O projeto atual já funciona sem backend. Login aceita campos preenchidos e navega para a home; cadastro grava dados locais; recuperação e redefinição são demonstrativas. Essas telas podem continuar na apresentação como exemplos de formulário e navegação. Use dados fictícios: o cadastro atual também grava a senha digitada localmente, e isso não é autenticação real.

Projetos, materiais, caixa, tarefas, equipe e perfil usam AsyncStorage. Ele cumpre o papel de armazenamento local para a demonstração, mas não é um banco relacional. Se o professor exigir especificamente SQL/SQLite, esse requisito precisará de outra implementação.

## Antes de importar

1. Acesse https://snack.expo.dev e entre na sua conta Expo para salvar e compartilhar a entrega.
2. Crie um Snack e confira quais SDKs ele oferece. O projeto deste repositório usa **SDK 58**. Se o 58 não estiver disponível, não basta copiar as versões: será necessária uma adaptação separada para o SDK oferecido.
3. Faça a adaptação numa cópia do projeto. Não substitua a versão que já funciona no Expo Go.
4. O código usa Expo Router em `src/app/`. A entrada local é `expo-router/entry`; não é um aplicativo de arquivo único. Copiar só uma tela para `App.js` deixará imports e rotas faltando.

O código oficial do Snack possui tratamento de Expo Router, mas isso não garante que a versão publicada e o SDK selecionado executem este projeto sem ajustes. A importação precisa ser testada antes da entrega.

## Arquivos e bibliotecas

Leve as pastas `src/` e `assets/`, preservando caminhos e maiúsculas/minúsculas. Confira também o `app.json`. Leve as dependências de execução do `package.json` para a configuração do Snack; deixe o Snack gerenciar React, React Native e Expo conforme o SDK escolhido.

As bibliotecas usadas incluem:

- `expo-router`, `expo-linking`, `expo-constants` e `@expo/metro-runtime`;
- `@expo/vector-icons` e `expo-font`;
- `@react-native-async-storage/async-storage`;
- `@react-native-picker/picker`;
- `react-native-safe-area-context`, `react-native-screens` e `react-native-gesture-handler`;
- as dependências `@react-navigation/*` declaradas no projeto;
- `expo-status-bar`.

Consulte a seção `dependencies` do `package.json` como lista completa e use versões compatíveis com o SDK escolhido. Não copie automaticamente versões de outro tutorial.

Não envie `node_modules/`, `.git/`, `.expo/`, `dist/`, arquivos de ambiente ou credenciais. `@expo/ngrok`, ESLint e TypeScript são ferramentas locais e não são necessários para executar as telas no Snack. A presença do TypeScript nas ferramentas de verificação não muda a linguagem das telas: os arquivos da aplicação são `.js`.

## Importação e execução

1. Abra o editor do Snack. Importe os arquivos locais pela opção de importação ou arraste os arquivos e pastas para o editor, preservando a estrutura. Se arrastar uma pasta externa adicionar um nível extra, ajuste para que `src/` e `assets/` fiquem na raiz.
2. Como alternativa, use a opção de importar repositório do GitHub, se disponível na interface. Ela importa o código publicado no GitHub, não alterações existentes apenas na sua máquina. Não é necessário publicar nada para usar a importação local.
3. Confira as dependências e o SDK na configuração do Snack. Aguarde a instalação das bibliotecas e resolva qualquer erro de versão antes de testar as telas.
4. Se aparecer `Missing required file: App.js`, crie, **na cópia do Snack**, um `App.js` na raiz com:

   ```js
   import 'expo-router/entry';
   ```

   Essa entrada é reconhecida pelo tratamento de Router no código oficial do Snack. Ainda é preciso confirmar que as rotas em `src/app/` são encontradas na versão publicada. Se aparecer erro de contexto de rotas ou tela não encontrada, a adaptação ainda não está concluída; não substitua a entrada por uma tela isolada, pois isso perde a navegação.
5. Teste a prévia Web e abra no Expo Go pelo QR Code do próprio Snack. O celular precisa de internet e de uma versão de Expo Go compatível. O servidor Metro da sua máquina não é necessário para executar um Snack.
6. Salve o Snack com um nome identificável, como `Obra Certa — Frontend`, e copie o link salvo para a entrega. Abra esse link em outra janela para verificar que aponta para a versão certa.

Este guia não representa uma versão já importada ou validada no serviço. A execução no projeto local não comprova a execução no Snack.

## O que conferir na apresentação

- Login com campos vazios exibe validação; com dados fictícios preenchidos abre a home.
- Cadastro, recuperação e redefinição demonstram formulários e mensagens, sem prometer envio de e-mail ou autenticação real.
- Criar projeto, adicionar material, lançar entrada/saída, cadastrar equipe e editar perfil atualizam as telas e os totais correspondentes.
- Recarregar o aplicativo mantém os registros locais no mesmo ambiente de execução.
- Cancelar uma ação não grava alterações; erros de preenchimento mostram mensagens compreensíveis.
- Navegação, rolagem, teclado e botões funcionam na prévia Web e no celular.

Os registros do seu computador não acompanham o código enviado. O professor começará sem os seus dados e poderá cadastrar exemplos. Os dados do navegador, da prévia e do celular não são sincronizados; limpar o armazenamento ou mudar de ambiente pode remover ou separar os registros. Não espere que o link do Snack transporte um banco já preenchido.

## Texto sugerido para a entrega

> Aplicativo Obra Certa desenvolvido em JavaScript com React Native. A entrega apresenta telas, navegação, validações, mensagens e persistência local com AsyncStorage. Login, cadastro e recuperação de senha têm finalidade demonstrativa. Não há autenticação real, servidor ou sincronização de dados entre dispositivos.

Se a entrega for por repositório, o README principal já explica a execução com `npm ci` e `npm run start:go`. O mesmo código não deve ser considerado automaticamente pronto para Snack sem testar a importação acima.

## Referências oficiais

- [Expo: ferramentas de desenvolvimento e Snack](https://docs.expo.dev/develop/tools/)
- [AsyncStorage no SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/async-storage/)
- [Entrada de Expo Router no código do Snack](https://github.com/expo/snack/blob/main/runtime/src/NativeModules/ExpoRouterEntry.tsx)
- [Importação de arquivos e diretórios no código do Snack](https://github.com/expo/snack/blob/main/website/src/client/components/Import/ImportFilesManager.tsx)
