import test from 'node:test';
import assert from 'node:assert/strict';
import { criarRepositorioObra, lerValor, resumoFinanceiro } from '../src/services/obra.js';

function memoria(extra = {}) {
  const dados = new Map(Object.entries({ '@meus_projetos': JSON.stringify([{ id: 'a', titulo: 'Obra A' }, { id: 'b', titulo: 'Obra B' }]), ...extra }));
  const armazenamento = {
    getItem: async chave => dados.get(chave) ?? null,
    setItem: async (chave, valor) => { dados.set(chave, valor); },
  };
  return { dados, armazenamento, repositorio: criarRepositorioObra(armazenamento) };
}

test('caixa soma entradas, materiais e equipe e calcula lucro em centavos sem duplicar custos', () => {
  assert.deepEqual(resumoFinanceiro([{ preco_total: 0.1 }, { preco_total: 0.2 }, { preco_total: 100 }], [
    { tipo: 'RECEBIMENTO_CLIENTE', valor: 1000 }, { tipo: 'PAGAMENTO_FUNCIONARIO', valor: 150.5 },
    { tipo: 'RECEBIMENTO', valor: 20 }, { tipo: 'PAGAMENTO', valor: 10 },
  ]), { entradas: 1020, materiais: 100.3, equipe: 160.5, lucro: 759.2 });
  assert.equal(resumoFinanceiro([{ preco_total: 200 }], []).lucro, -200);
});

test('valores brasileiros aceitam centavos, zero opcional e rejeitam inválidos', () => {
  assert.equal(lerValor('1.234,56'), 1234.56);
  assert.equal(lerValor('150.50'), 150.5);
  assert.equal(lerValor(''), 0);
  for (const valor of ['0', '', '-10', '10abc', 'Infinity', '1,234']) assert.throws(() => lerValor(valor, false));
  assert.throws(() => resumoFinanceiro([{ preco_total: Number.MAX_SAFE_INTEGER / 100 }, { preco_total: 1 }], []));
});

test('leitura mantém os registros legados e não altera o armazenamento', async () => {
  const legado = JSON.stringify([{ id: 't1', tipo: 'PAGAMENTO', valor: 80, descricao: 'Pagamento antigo' }]);
  const { dados, repositorio } = memoria({ '@caixa_a': legado });
  const obra = await repositorio.carregar('a');
  assert.equal(obra.transacoes[0].tipo, 'PAGAMENTO');
  assert.equal(resumoFinanceiro(obra.materiais, obra.transacoes).equipe, 80);
  assert.equal(dados.get('@caixa_a'), legado);
  assert.equal((await repositorio.carregar('b')).transacoes.length, 0);
  await assert.rejects(repositorio.carregar('inexistente'), /não encontrada/);
});

test('remover um profissional não apaga nem recalcula pagamentos já lançados', async () => {
  const pagamento = { id: 't1', tipo: 'PAGAMENTO_FUNCIONARIO', valor: 200, descricao: 'Diária', funcionario_id: 'p1', funcionario_nome: 'Maria' };
  const { repositorio } = memoria({ '@caixa_a': JSON.stringify([pagamento]), '@obracerta_equipe': '[]' });
  const obra = await repositorio.carregar('a');
  assert.equal(obra.transacoes[0].funcionario_nome, 'Maria');
  assert.equal(resumoFinanceiro([], obra.transacoes).equipe, 200);
});

test('dados inválidos não são apresentados como caixa zerado e gravações falhas preservam registros', async () => {
  const { armazenamento, repositorio, dados } = memoria({ '@caixa_a': '{invalido' });
  await assert.rejects(repositorio.carregar('a'));
  dados.set('@caixa_a', JSON.stringify([{ id: 'x', tipo: 'OUTRO', valor: 10, descricao: 'Inválido' }]));
  await assert.rejects(repositorio.carregar('a'));
  const antes = dados.get('@caixa_a');
  armazenamento.setItem = async () => { throw new Error('Falha de gravação'); };
  await assert.rejects(repositorio.salvar('a', 'transacoes', []));
  assert.equal(dados.get('@caixa_a'), antes);
});

test('gravação é isolada por obra e bloqueia obra excluída', async () => {
  const { repositorio, dados } = memoria();
  await repositorio.salvar('a', 'tarefas', [{ id: '1', nome: 'Teste', concluida: false }]);
  assert.equal(dados.has('@tarefas_b'), false);
  dados.set('@meus_projetos', '[]');
  await assert.rejects(repositorio.salvar('a', 'tarefas', []), /não está mais/);
  assert.equal(JSON.parse(dados.get('@tarefas_a')).length, 1);
});
