# Testar no Expo Go

## Inicialização recomendada nesta rede

```sh
npm run start:go
```

Esse comando executa `expo start --go --tunnel ngrok --clear`:

- Seleciona o Expo Go.
- Usa o túnel ngrok explicitamente, instalado como dependência de desenvolvimento
  do projeto, sem instalação global.
- Limpa o cache do Metro na inicialização.

Pare o servidor anterior com Ctrl+C antes de executar o comando. Aguarde
“Tunnel ready”, mantenha o terminal aberto e escaneie o NOVO QR Code no Expo Go.
Não use a entrada antiga do histórico que apontava para `192.168.0.111`.
O celular e o computador precisam ter acesso à internet para usar o túnel.

Use uma versão do Expo Go compatível com SDK 58. O login do aplicativo continua
sendo demonstrativo; a conta da Expo é separada do login do Obra Certa.

## Diagnóstico realizado

- O celular não conseguiu abrir `http://192.168.0.111:8081/status`.
  Isso confirma falta de acesso direto ao servidor local a partir do aparelho.
- O servidor respondeu ao status e forneceu o manifesto Android corretamente no
  próprio computador. O pacote Android foi baixado localmente com HTTP 200.
- O serviço de firewall UFW está ativo. Nenhuma regra foi alterada; esse estado
  sozinho não permite atribuir a causa exclusivamente ao firewall. Isolamento
  entre clientes Wi-Fi e outras regras de rede também podem bloquear o acesso.
- O túnel padrão da Expo respondeu HTTP 403 com página de indisponibilidade do
  CDN durante o teste. Por isso o novo comando seleciona ngrok explicitamente.
- O túnel ngrok respondeu HTTP 200 ao manifesto Android e ao pacote do aplicativo.
- A dependência direta `expo-font`, requerida por `@expo/vector-icons`, foi
  adicionada com o instalador do Expo. O expo-doctor passou nos 20 testes.
- As atualizações de Expo 58.0.23, React Native 0.88.1 e Safe Area Context 5.11.1
  já aplicadas pelo usuário foram mantidas.

A validação do download pelo túnel foi feita no computador. A abertura final no
celular precisa ser confirmada ao escanear o novo QR Code.

## Alternativa por rede local

```sh
npm run start:go:lan
```

Use essa opção quando o navegador do celular conseguir abrir o endereço de
status anunciado pelo terminal. Login na Expo não libera portas do firewall
nem elimina bloqueios entre dispositivos na rede Wi-Fi.

Se o túnel falhar antes de aparecer “Tunnel ready”, confira a conexão com a
internet e a mensagem do terminal. Não é necessário alterar `updates.enabled`
no app.json para corrigir a conectividade com o servidor de desenvolvimento.
