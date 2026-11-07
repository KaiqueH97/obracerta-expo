export const TAMANHO_PAGINA = 20;
export const ehEntrada = item => ['RECEBIMENTO', 'RECEBIMENTO_CLIENTE'].includes(item.tipo);
const numeroValido = valor => typeof valor === 'number' && Number.isFinite(valor) && valor >= 0 && valor <= Number.MAX_SAFE_INTEGER / 100;
const idValido = item => typeof item.id === 'string' && !!item.id;

export function lerValor(texto, permitirZero = true) {
  const valor = texto.trim();
  if (!valor && permitirZero) return 0;
  if (!/^(?:\d+(?:[,.]\d{1,2})?|\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?)$/.test(valor)) {
    throw new Error('Informe um valor válido, como 150,00.');
  }
  const normalizado = valor.includes(',') || /^\d{1,3}(?:\.\d{3})+$/.test(valor)
    ? valor.replace(/\./g, '').replace(',', '.') : valor;
  const numero = Number(normalizado);
  if (!numeroValido(numero) || (!permitirZero && numero === 0)) throw new Error('Informe um valor maior que zero e dentro do limite suportado.');
  return Math.round(numero * 100) / 100;
}

export function resumoFinanceiro(materiais, transacoes) {
  const soma = (itens, campo) => {
    const centavos = itens.reduce((total, item) => total + Math.round(item[campo] * 100), 0);
    if (!Number.isSafeInteger(centavos)) throw new Error('O total ultrapassou o limite suportado.');
    return centavos;
  };
  const entradas = soma(transacoes.filter(ehEntrada), 'valor');
  const equipe = soma(transacoes.filter(item => !ehEntrada(item)), 'valor');
  const custoMateriais = soma(materiais, 'preco_total');
  const lucro = entradas - custoMateriais - equipe;
  if (!Number.isSafeInteger(lucro)) throw new Error('O lucro ultrapassou o limite suportado.');
  return { entradas: entradas / 100, materiais: custoMateriais / 100, equipe: equipe / 100, lucro: lucro / 100 };
}

function lista(json, validar) {
  const dados = json === null ? [] : JSON.parse(json);
  if (!Array.isArray(dados) || dados.some(item => !item || !idValido(item) || !validar(item)) ||
    new Set(dados.map(item => item.id)).size !== dados.length) {
    throw new Error('Há registros inválidos nesta obra. Não foi possível carregar os dados.');
  }
  return dados;
}

export function criarRepositorioObra(armazenamento) {
  return {
    async carregar(id) {
      const obras = lista(await armazenamento.getItem('@meus_projetos'), item => typeof item.titulo === 'string');
      const projeto = obras.find(item => item.id === id);
      if (!projeto) throw new Error('Obra não encontrada. Volte à lista de projetos.');
      const chaves = [`@materiais_${id}`, `@caixa_${id}`, `@tarefas_${id}`, '@obracerta_equipe'];
      const dados = await Promise.all(chaves.map(chave => armazenamento.getItem(chave)));
      const materiais = lista(dados[0], item => typeof item.nome === 'string' && typeof item.quantidade === 'string' && numeroValido(item.preco_total));
      const transacoes = lista(dados[1], item => ['RECEBIMENTO', 'PAGAMENTO', 'RECEBIMENTO_CLIENTE', 'PAGAMENTO_FUNCIONARIO'].includes(item.tipo) &&
        typeof item.descricao === 'string' && numeroValido(item.valor));
      const tarefas = lista(dados[2], item => typeof item.nome === 'string' && typeof item.concluida === 'boolean');
      const equipe = lista(dados[3], item => typeof item.nome === 'string' && (item.valor_diaria === null || numeroValido(item.valor_diaria)));
      resumoFinanceiro(materiais, transacoes);
      return { projeto, materiais, transacoes, tarefas, equipe };
    },
    async salvar(id, tipo, registros) {
      const prefixos = { materiais: '@materiais_', transacoes: '@caixa_', tarefas: '@tarefas_' };
      if (!prefixos[tipo]) throw new Error('Tipo de registro inválido.');
      const obras = lista(await armazenamento.getItem('@meus_projetos'), item => typeof item.titulo === 'string');
      if (!obras.some(item => item.id === id)) throw new Error('Esta obra não está mais disponível.');
      await armazenamento.setItem(`${prefixos[tipo]}${id}`, JSON.stringify(registros));
    },
  };
}
