# Orçamento e nova medição

Referência: `app/(sistema)/projetos/[id]/page.tsx` do projeto TypeScript
`/home/kaique/obra-certa-web`.

A aba Orçamento agora apresenta Lista de Materiais com nome, quantidade em
um marcador, custo registrado em reais e total dos materiais. O botão Nova
Medição aparece mesmo quando não há materiais, como no fluxo da referência.
O cadastro manual existente fica recolhido abaixo da lista e o relatório por
WhatsApp permanece disponível quando existem materiais.

## Fluxo

1. Abra uma obra e toque em Nova Medição.
2. A rota `/nova-medicao` reutiliza a calculadora em JavaScript e recebe apenas
   o identificador da obra. A obra correspondente fica selecionada para salvar.
3. Escolha superfície e material, informe medidas e preço opcional e calcule.
4. Salve o material. O aplicativo volta aos detalhes da obra escolhida e
   recarrega os registros locais, incluindo a nova medição e seu custo.
5. Voltar ao orçamento cancela a navegação sem adicionar materiais.

A calculadora continua acessível pela aba Calcular. Sua lista de obras agora
recarrega ao ganhar foco, incluindo obras recém-criadas. O salvamento verifica
se a obra ainda existe e bloqueia envios simultâneos pelo botão.

Não houve integração com Supabase: os materiais continuam nas chaves
`@materiais_<id>` do AsyncStorage, compatíveis com os registros anteriores.
A edição de materiais e a paginação do site não fazem parte desta alteração.

## Verificações

- Lint, verificação de tipos e os 12 testes existentes.
- Fluxo completo no Chrome: obra pré-selecionada, cálculo de 2 × 3 m a R$ 10/m²,
  salvamento e retorno ao orçamento com 6,60 m² e R$ 66,00 (10% de perda).
- Estado vazio, cancelamento, erro de leitura e nova tentativa.
- Larguras de 320, 390 e 1440 px sem transbordamento horizontal.
- Exportações web, Android e iOS.

No Expo Go, conferir o mesmo fluxo, o botão Voltar do Android e o formulário
com teclado aberto. O envio externo de WhatsApp não foi acionado nos testes.
