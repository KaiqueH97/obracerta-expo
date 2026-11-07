# Migração das telas para JavaScript

Origem: `/home/kaique/obra-certa-web` (Next.js, TypeScript e Supabase).
Destino: aplicativo React Native com Expo Go. Os arquivos implementados são `.js`.

## Etapa 1 — Equipe

- Cadastro de nome, cargo e diária opcional.
- Listagem, edição, cancelamento de edição e exclusão com confirmação.
- Validação de valores brasileiros, diária zero e campo vazio.
- Persistência no AsyncStorage, na chave `@obracerta_equipe`.
- Estados de carregamento, erro, nova tentativa e lista vazia.
- Falhas ao salvar mantêm a lista e o formulário para nova tentativa.
- Dados inválidos no armazenamento bloqueiam alterações para evitar sobrescrita.

A implementação segue o armazenamento local que o app já usa em projetos.
Não consulta o Supabase nem sincroniza com o site. A equipe é local à instalação,
sem separação por conta; o login existente continua demonstrativo.

A preparação substituiu o MMKV por AsyncStorage (compatível com Expo Go) e
organizou a navegação com Expo Router em `src/app`, conforme o AGENTS.md.
Os dados anteriores do MMKV não são transferidos automaticamente.

## Como conferir no celular

1. Execute `npm start` e abra o QR Code no Expo Go compatível com o SDK 58.
2. Entre pelo login demonstrativo e abra a aba Equipe.
3. Cadastre um profissional com diária `150,50` e outro sem diária.
4. Edite nome, cargo e diária; confira também o cancelamento da edição.
5. Tente salvar sem nome e com diária inválida, como `1,2,3`.
6. Feche e reabra o app: os profissionais devem permanecer.
7. Cancele uma exclusão e depois confirme; somente a confirmação deve remover.
8. Confira se Login, Cadastro, Projetos, Calcular e detalhes continuam acessíveis.

## Etapa 2 — Perfil

- Avatar com iniciais, nome, WhatsApp e e-mail utilizado no login.
- Edição e cancelamento de nome e WhatsApp; e-mail somente para leitura.
- Nome obrigatório e validação de telefone opcional com DDD.
- Perfis salvos por e-mail na chave `@obracerta_perfil:<email normalizado>`.
- Primeiro acesso aproveita o cadastro local somente quando o e-mail corresponde.
- O perfil não copia nem exibe a senha armazenada pelo cadastro demonstrativo.
- Falhas de leitura bloqueiam a edição e oferecem nova tentativa.
- Falhas de gravação mantêm o formulário aberto para tentar novamente.
- Sair remove `@usuario_email` e retorna ao login, preservando os dados locais.
- A seção de senha permite abrir a redefinição demonstrativa (etapa 4).

A separação dos perfis por e-mail organiza os dados locais. O aplicativo continua
com login demonstrativo, sem autenticação ou sincronização com Supabase.

### Como conferir o perfil no celular

1. Abra a aba Perfil: confira o e-mail utilizado ao entrar no aplicativo.
2. Se houver cadastro com o mesmo e-mail, confira o nome inicial; caso contrário,
   o perfil começa como “Usuário”, com WhatsApp não informado.
3. Edite o nome e o WhatsApp, salve e confira as iniciais do avatar.
4. Abra a edição, altere os campos e cancele: os dados salvos devem permanecer.
5. Tente salvar nome vazio ou telefone como `123`: deve aparecer uma validação.
6. Salve um WhatsApp vazio: deve aparecer “Não informado”.
7. Feche e reabra o app, entre com o mesmo e-mail e confira o perfil salvo.
8. Saia do sistema: deve voltar ao login. Confira também o botão Voltar do Android.
9. Entre com outro e-mail: o perfil anterior não deve aparecer. Entre novamente
   com o primeiro e-mail: as informações salvas devem continuar disponíveis.
10. Confira se os registros de equipe e projetos permanecem após sair e entrar.

## Etapa 3 — Recuperar senha

- Rota `/recuperar`, acessível por “Esqueceu sua senha?” no login.
- Formulário com teclado de e-mail, validação de campo vazio e formato inválido.
- Confirmação da simulação com o e-mail normalizado, opção de usar outro e-mail
  e retorno ao login.
- Layout em JavaScript com React Native, reaproveitando o AuthLayout e suas
  áreas seguras e adaptação ao teclado.

Esta etapa é demonstrativa, como o login atual: não envia e-mail, não consulta
cadastros e não altera a senha ou os dados locais. A interface informa isso antes
e depois da simulação. A tela original usa Supabase para solicitar o link;
o envio real exige integrar autenticação e o retorno do link ao aplicativo.

### Como conferir a recuperação no celular

1. No login, toque em “Esqueceu sua senha?”: deve abrir a tela Recuperar senha.
2. Envie o campo vazio, `nome` ou `nome@`: deve aparecer um erro de validação.
3. Digite um e-mail válido com espaços nas pontas: a confirmação deve exibir
   o endereço sem espaços e em letras minúsculas.
4. Confira o aviso de simulação e a informação de que nenhum e-mail foi enviado.
5. Toque em “Usar outro e-mail” e confira se consegue editar e simular novamente.
6. Use “Voltar ao login” e confira também o botão Voltar do Android.
7. Confira o formulário com o teclado aberto e com tamanho de fonte ampliado.
8. Confira se o login e os dados de perfil, equipe e projetos continuam funcionando.

## Etapa 4 — Redefinir senha

- Rota `/redefinir-senha`, acessível após simular a recuperação e pela seção
  Segurança de Acesso do Perfil.
- Campos de nova senha e confirmação, com opção de mostrar ou ocultar.
- Validação de mínimo de 6 caracteres (como no site), rejeição de senha composta
  apenas por espaços e comparação exata com a confirmação.
- Confirmação da simulação e limpeza dos dois campos após validação.
- Retorno à recuperação ou ao login; layout reaproveita o AuthLayout.

A tela é demonstrativa: não verifica links de recuperação, não grava senhas,
não altera o cadastro e não chama o Supabase. As senhas digitadas ficam apenas
no estado temporário da tela, sem serem enviadas em parâmetros de navegação.

### Como conferir a redefinição no celular

1. Pelo login, abra Recuperar senha e simule com um e-mail válido.
2. Na confirmação, toque em “Testar redefinição de senha”.
3. Tente enviar os campos vazios, uma senha com menos de 6 caracteres ou apenas
   espaços: deve aparecer uma mensagem de validação.
4. Informe senhas diferentes: deve pedir para conferir a confirmação.
5. Confira o botão Mostrar/Ocultar senhas e a navegação entre campos pelo teclado.
6. Informe a mesma senha fictícia com pelo menos 6 caracteres nos dois campos:
   deve confirmar a simulação, sem alterar a senha de acesso.
7. Toque em “Simular novamente”: os campos devem estar vazios e ocultos.
8. Confira os retornos à recuperação, ao login e o botão Voltar do Android.
9. Entre no app e abra Perfil > Testar redefinição de senha. Confira que o botão
   fica desabilitado enquanto os dados pessoais estão em edição.
10. Confira o formulário com teclado aberto e fonte ampliada.

## Verificações automatizadas

```sh
npm run lint
npm run typecheck
node --test tests/*.test.mjs
npx expo export --platform android --platform ios
```

O typecheck verifica JavaScript com `checkJs`; não converte o código para TypeScript.
A validação em um aparelho físico deve ser feita pelos roteiros acima.

## Situação da migração

As quatro telas foram adaptadas para JavaScript e React Native: Equipe, Perfil,
Recuperar senha e Redefinir senha. Os roteiros acima permitem conferir no Expo Go.

Equipe e Perfil persistem dados locais. Login, recuperação e redefinição continuam
demonstrativos. Para autenticação real, será necessário integrar um serviço como
Supabase, envio de e-mails e validação do link de recuperação no aplicativo.
