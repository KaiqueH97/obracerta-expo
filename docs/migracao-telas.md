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

## Verificações automatizadas

```sh
npm run lint
npm run typecheck
node --test tests/equipe.test.mjs
npx expo export --platform android
```

O typecheck verifica JavaScript com `checkJs`; não converte o código para TypeScript.
A validação em um aparelho físico deve ser feita pelo roteiro acima.

## Próximas etapas, com commits separados

1. Perfil.
2. Recuperar senha.
3. Redefinir senha.

As telas de senha exigem definir uma autenticação real para enviar e validar links
por e-mail; o login demonstrativo atual não oferece esse serviço.
