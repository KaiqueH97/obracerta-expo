# Obra Certa

Aplicativo de gestão de obras desenvolvido em **JavaScript, React Native e Expo SDK 58**,
com execução no **Expo Go** e no navegador. Permite cadastrar projetos e profissionais,
calcular materiais, acompanhar o caixa e organizar tarefas.

## 1. Preparar o computador

O projeto pode ser executado em Linux, Windows ou macOS.

| Ferramenta | Para que serve | Instalação |
| --- | --- | --- |
| Node.js 24, versão 24.3.0 ou superior da série 24 | Executar JavaScript e as ferramentas do projeto | [Download do Node.js](https://nodejs.org/en/download) |
| npm e npx | Instalar bibliotecas e executar comandos | Acompanham a instalação do Node.js |
| Git | Baixar e atualizar o repositório | [Download do Git](https://git-scm.com/downloads) |
| Navegador atualizado | Testar a versão web | Chrome, Firefox, Edge ou Safari |
| Editor de código, opcional | Abrir e editar os arquivos | Por exemplo, VS Code |

Ambiente utilizado na validação: **Node.js 24.13.1 e npm 11.8.0**. As dependências
atuais também aceitam Node.js 22 a partir de 22.13.0. Para seguir este guia, prefira
Node.js 24; versões antigas, como Node.js 18 ou 20, não atendem aos requisitos atuais.

Depois de instalar as ferramentas, abra um novo terminal e confira:

```sh
node --version
npm --version
npx --version
git --version
```

Se algum comando não for encontrado, confira a instalação e reabra o terminal.

Se você **já utiliza o gerenciador nvm**, pode selecionar o Node.js assim:

```sh
nvm install 24
nvm use 24
```

O uso do nvm é opcional. Não é necessário instalar Expo CLI globalmente, Android
Studio, Java/JDK ou Xcode para testar este projeto em um celular físico com Expo Go.

## 2. Preparar o celular

1. Instale o **Expo Go** no Android ou iPhone.
2. Utilize uma versão compatível com **Expo SDK 58**. Confira as opções no
   [site oficial de download do Expo Go](https://expo.dev/go).
3. Tenha conexão com a internet no computador e no celular para utilizar o túnel.

A conta da Expo e o login do Obra Certa são coisas diferentes. No iPhone físico,
a documentação da Expo exige a mesma conta na CLI e no Expo Go. Se aparecer uma
solicitação de autenticação, entre com a mesma conta nos dois lugares.

## 3. Baixar o projeto

No terminal, entre na pasta em que deseja guardar o projeto e execute:

```sh
git clone https://github.com/KaiqueH97/obracerta-expo.git
cd obracerta-expo
```

Se o repositório solicitar autenticação, use uma conta com acesso a ele.
Também é possível baixar o ZIP pelo GitHub, extrair os arquivos e abrir um
terminal dentro da pasta extraída.

**Se o projeto já está neste computador**, não precisa clonar outra vez. Por exemplo:

```sh
cd /home/kaique/obracerta-expo
```

Esse caminho é específico da máquina de desenvolvimento; em outro computador,
utilize o caminho onde você salvou o projeto.

## 4. Instalar as bibliotecas

Dentro da pasta que contém `package.json` e `package-lock.json`, execute:

```sh
npm ci
```

Esse comando instala **todas as dependências do projeto**, incluindo as ferramentas
de desenvolvimento, usando as versões registradas no `package-lock.json`. Não é
necessário instalar ou executar cada biblioteca separadamente.

Execute a instalação na primeira utilização e novamente quando receber uma
atualização que altere as dependências. A conexão com a internet é necessária
para baixar os pacotes. Não use `npm ci --omit=dev`: o túnel ngrok e as ferramentas
de verificação estão nas dependências de desenvolvimento.

### Bibliotecas utilizadas

| Biblioteca ou grupo | Função |
| --- | --- |
| `expo`, `react`, `react-native` | Base do aplicativo; atualmente Expo 58, React 19.3 e React Native 0.88.1 |
| `expo-router`, `expo-linking`, `expo-constants` | Rotas e integração com o ambiente Expo |
| `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`, `@react-navigation/stack` | Dependências de navegação presentes no projeto; as telas utilizam Expo Router |
| `@react-native-async-storage/async-storage` | Salvar dados localmente no aparelho ou navegador |
| `@react-native-picker/picker` | Seletores de projetos, materiais e profissionais |
| `@expo/vector-icons`, `expo-font` | Ícones e fontes |
| `react-native-safe-area-context` | Respeitar áreas do sistema, como recortes e barra de status |
| `react-native-screens`, `react-native-gesture-handler` | Suporte às telas e gestos de navegação |
| `react-dom`, `react-native-web`, `@expo/metro-runtime` | Execução no navegador e suporte ao Metro |
| `expo-status-bar` | Biblioteca de controle da barra de status disponível no projeto |
| `@expo/ngrok` | Túnel de desenvolvimento para conectar o Expo Go pela internet |
| `eslint`, `eslint-config-expo`, `typescript` | Verificações de código; TypeScript é ferramenta de análise dos arquivos JavaScript |


## 5. Entrar na conta da Expo, quando necessário

Na pasta do projeto, execute:

```sh
npx expo login
```

Siga as perguntas do terminal. Para conferir a conta conectada:

```sh
npx expo whoami
```

No Expo Go, entre com a mesma conta se o aplicativo solicitar. Fazer login não
libera portas do firewall nem corrige sozinho um bloqueio da rede Wi-Fi.

## 6. Rodar no celular pelo túnel — recomendado nesta rede

Se houver outro servidor aberto, interrompa-o com **Ctrl+C**. Em seguida, execute:

```sh
npm run start:go
```

O comando já está configurado no projeto e equivale a:

```sh
npx expo start --go --tunnel ngrok --clear
```

1. Aguarde aparecer **Tunnel ready** e o QR Code.
2. No Android, abra o Expo Go e use a opção de escanear QR Code.
3. No iPhone, escaneie pela câmera e abra o link no Expo Go.
4. Use o **novo QR Code**; não abra uma entrada antiga do histórico.
5. Mantenha o terminal e o computador ligados enquanto testa o aplicativo.

O ngrok é instalado pelo `npm ci`, sem instalação global. O túnel permite testar
quando o celular não consegue acessar diretamente o computador na rede local;
não é necessário que os dispositivos estejam na mesma rede, mas ambos precisam
ter acesso à internet. O túnel pode ser mais lento e depende da disponibilidade
do serviço externo.

Para encerrar o servidor, pressione **Ctrl+C** no terminal.

## 7. Alternativa: rodar pela mesma rede Wi-Fi

Se a rede permitir comunicação direta entre celular e computador, execute:

```sh
npm run start:go:lan
```

Esse comando equivale a:

```sh
npx expo start --go --lan --clear
```

Deixe os dois dispositivos na mesma rede e escaneie o QR Code. Não utilize uma
rede de convidados ou com isolamento entre aparelhos.

Para verificar a conexão, abra no navegador do celular:

```text
http://IP_DO_COMPUTADOR:8081/status
```

Substitua `IP_DO_COMPUTADOR` pelo endereço exibido no terminal e use a porta
anunciada, caso seja diferente de 8081. O resultado esperado é:

```text
packager-status:running
```

Se não abrir, utilize `npm run start:go`. Estar na mesma rede Wi-Fi não garante
que o firewall ou o roteador permita a conexão.

## 8. Rodar no navegador

Na pasta do projeto, execute:

```sh
npm run web
```

Abra o endereço web exibido no terminal. Se o navegador não abrir automaticamente,
copie esse endereço e abra manualmente. Mantenha o servidor rodando durante os testes.

## 9. Entrar no Obra Certa e testar

O login do aplicativo é **demonstrativo**, sem validação de credenciais em um servidor.
A tela já vem preenchida com:

```text
E-mail: user@obracerta.com
Senha: obra123
```

Toque em **Entrar**. Não é necessário criar um banco de dados, configurar Supabase,
preencher um arquivo `.env` ou fornecer chaves de API para executar a versão atual.

Sugestão de teste:

1. Cadastre uma obra em **Projetos**.
2. Cadastre um profissional e sua diária em **Equipe**.
3. Abra a obra e use **Nova Medição** para calcular e salvar materiais.
4. Na aba **Caixa**, registre uma entrada do cliente e um pagamento da equipe.
5. Confira os indicadores de entradas, materiais, equipe e lucro.
6. Adicione tarefas ao checklist e confira o resumo na **Home**.
7. Edite o **Perfil** e confira se os dados permanecem após reabrir o aplicativo.

Recuperação e redefinição de senha também são demonstrativas: não enviam e-mails
nem alteram uma senha real. Utilize dados fictícios nos testes.

Os dados são locais: o navegador e o celular **não compartilham os mesmos registros**.
Não há sincronização com o projeto web original ou separação de obras por login.
Limpar os dados do aplicativo/navegador pode remover os registros salvos.

## 10. Comandos de verificação e manutenção

| Comando | Finalidade |
| --- | --- |
| `npm run lint` | Verificar o código com ESLint |
| `npm run typecheck` | Analisar os arquivos JavaScript com `checkJs`, sem convertê-los para TypeScript |
| `node --test tests/*.test.mjs` | Executar os testes automatizados |
| `npx expo-doctor` | Diagnosticar configuração e dependências |
| `npx expo install --check` | Conferir se as versões estão compatíveis com o Expo |
| `npx expo export --platform android --platform ios --platform web` | Gerar os pacotes JavaScript e assets; não gera APK/IPA |

Se a verificação indicar versões incompatíveis, o ajuste pode ser feito com:

```sh
npx expo install --fix
```

Esse comando altera as dependências e o arquivo de versões. Não é necessário
executá-lo a cada inicialização. Depois de atualizar, rode lint, typecheck e
expo-doctor antes de testar novamente.

Para adicionar uma nova biblioteca ao projeto, utilize o instalador do Expo:

```sh
npx expo install nome-do-pacote
```

A compatibilidade da biblioteca com Expo Go deve ser conferida antes da inclusão.

## 11. Problemas comuns

| Sintoma | O que conferir |
| --- | --- |
| `node` ou `npm` não encontrado | Instale o Node.js e reabra o terminal |
| `Unsupported engine` / `EBADENGINE` | Confira `node --version` e utilize uma versão compatível, como Node.js 24.13.1 |
| Erro no `npm ci` dizendo que o lock está inconsistente | Confira se `package.json` e `package-lock.json` vieram da mesma revisão do repositório |
| `Failed to download remote update` | Confira se o terminal está rodando; tente `npm run start:go` e escaneie o QR Code novo |
| O celular não abre o endereço local de status | Utilize o túnel; verifique rede, firewall e isolamento de clientes do roteador |
| O túnel não chega a `Tunnel ready` | Confira a internet e a mensagem do terminal; o serviço externo pode estar indisponível |
| Projeto incompatível com Expo Go | Confira se a versão instalada no celular suporta SDK 58 |
| Porta ocupada | Encerre o servidor anterior com Ctrl+C ou aceite a porta alternativa oferecida pela CLI |
| Alterações não aparecem | Pare o servidor, execute novamente `npm run start:go` e abra o QR Code novo |
| O terminal mostra `Stopped server` | O servidor foi encerrado; execute o comando de inicialização novamente |

## Estrutura e documentação complementar

```text
src/app/              Rotas do Expo Router
src/telas/            Telas em JavaScript
src/components/       Componentes e layout compartilhado
src/hooks/            Hooks, incluindo adaptação à largura e escala de fonte
src/services/         Regras de leitura e gravação dos dados locais
src/storage/          Adaptador de armazenamento
tests/                Testes automatizados
docs/                 Guias de funcionalidades e validação
```

- [Entrega frontend pelo Expo Snack](docs/snack.md)
- [Conexão e diagnóstico do Expo Go](docs/expo-go.md)
- [Migração das telas](docs/migracao-telas.md)
- [Home com dados locais](docs/home.md)
- [Orçamento, caixa e detalhes da obra](docs/orcamento.md)
- [Padrão visual e responsividade](docs/padrao-visual.md)

Referências oficiais: [requisitos do Expo](https://docs.expo.dev/get-started/create-a-project/),
[iniciar o desenvolvimento](https://docs.expo.dev/get-started/start-developing/) e
[documentação do SDK 58](https://docs.expo.dev/versions/v58.0.0/).
