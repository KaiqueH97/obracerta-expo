import test from 'node:test';
import assert from 'node:assert/strict';
import { carregarResumo } from '../src/services/home.js';

function memoria(dados) {
  return {
    getItem: async chave => dados[chave] === undefined ? null : JSON.stringify(dados[chave]),
    multiGet: async chaves => chaves.map(chave => [chave, dados[chave] === undefined ? null : JSON.stringify(dados[chave])]),
  };
}

test('sem obras mostra zeros e não soma registros de obras excluídas', async () => {
  assert.deepEqual(await carregarResumo(memoria({ '@materiais_excluida': [{ preco_total: 500 }] })), {
    obrasCadastradas: 0, tarefasConcluidas: 0, tarefasPendentes: 0, custoTotal: 0, recentes: [],
  });
});

test('agrega tarefas e materiais das obras existentes e ordena os cinco projetos recentes', async () => {
  const projetos = Array.from({ length: 6 }, (_, i) => ({ id: String(i), titulo: `Obra ${i}`, criado_em: `2026-01-0${i + 1}T12:00:00Z` }));
  const dados = {
    '@meus_projetos': projetos,
    '@tarefas_0': [{ concluida: true }, { concluida: false }],
    '@tarefas_1': [{ concluida: true }],
    '@materiais_0': [{ preco_total: 0.1 }, { preco_total: 0.2 }],
    '@materiais_1': [{ preco_total: 150 }],
    '@materiais_excluida': [{ preco_total: 9999 }],
  };
  const resumo = await carregarResumo(memoria(dados));
  assert.equal(resumo.obrasCadastradas, 6);
  assert.equal(resumo.tarefasConcluidas, 2);
  assert.equal(resumo.tarefasPendentes, 1);
  assert.equal(resumo.custoTotal, 150.3);
  assert.deepEqual(resumo.recentes.map(item => item.id), ['5', '4', '3', '2', '1']);
  dados['@tarefas_0'][1].concluida = true;
  assert.equal((await carregarResumo(memoria(dados))).tarefasPendentes, 0);
});

test('dados inválidos ou falhas de leitura geram erro, sem apresentar totais incompletos', async () => {
  const projeto = { id: '1', titulo: 'Obra' };
  for (const dados of [
    { '@meus_projetos': {} },
    { '@meus_projetos': [projeto, projeto] },
    { '@meus_projetos': [projeto], '@tarefas_1': [{ concluida: 'sim' }] },
    { '@meus_projetos': [projeto], '@materiais_1': [{ preco_total: null }] },
  ]) await assert.rejects(carregarResumo(memoria(dados)));
  await assert.rejects(carregarResumo({ getItem: async () => { throw new Error('Falha'); } }));
});
