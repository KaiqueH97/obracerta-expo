function lerLista(json, validar) {
  if (json === null) return [];
  const lista = JSON.parse(json);
  if (!Array.isArray(lista) || lista.some(item => !item || !validar(item))) {
    throw new Error('Os dados do resumo não puderam ser lidos.');
  }
  return lista;
}

// Lê apenas as obras ainda cadastradas: registros órfãos de obras excluídas
// não entram nas métricas. O adaptador é o AsyncStorage no aplicativo.
export async function carregarResumo(armazenamento) {
  const projetos = lerLista(await armazenamento.getItem('@meus_projetos'), item =>
    typeof item.id === 'string' && !!item.id && typeof item.titulo === 'string');
  if (new Set(projetos.map(item => item.id)).size !== projetos.length) {
    throw new Error('Há obras duplicadas no armazenamento.');
  }
  const chaves = projetos.flatMap(item => [`@tarefas_${item.id}`, `@materiais_${item.id}`]);
  const registros = chaves.length ? new Map(await armazenamento.multiGet(chaves)) : new Map();
  let tarefasConcluidas = 0;
  let tarefasPendentes = 0;
  let custoCentavos = 0;
  for (const projeto of projetos) {
    const tarefas = lerLista(registros.get(`@tarefas_${projeto.id}`), item => typeof item.concluida === 'boolean');
    const materiais = lerLista(registros.get(`@materiais_${projeto.id}`), item =>
      typeof item.preco_total === 'number' && Number.isFinite(item.preco_total) && item.preco_total >= 0);
    for (const tarefa of tarefas) {
      if (tarefa.concluida) tarefasConcluidas++;
      else tarefasPendentes++;
    }
    for (const material of materiais) {
      custoCentavos += Math.round(material.preco_total * 100);
      if (!Number.isSafeInteger(custoCentavos)) throw new Error('O custo total ultrapassou o limite suportado.');
    }
  }
  const dataCriacao = projeto => Date.parse(projeto.criado_em) || 0;
  return {
    obrasCadastradas: projetos.length,
    tarefasConcluidas,
    tarefasPendentes,
    custoTotal: custoCentavos / 100,
    recentes: [...projetos].sort((a, b) => dataCriacao(b) - dataCriacao(a)).slice(0, 5),
  };
}
