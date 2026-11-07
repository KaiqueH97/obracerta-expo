import test from 'node:test';
import assert from 'node:assert/strict';
import { criarRepositorioPerfil, iniciaisPerfil } from '../src/services/perfil.js';

function armazenamentoInicial(valores = {}) {
  const dados = new Map(Object.entries(valores));
  const armazenamento = {
    getItem: async chave => dados.get(chave) ?? null,
    setItem: async (chave, valor) => { dados.set(chave, valor); },
    removeItem: async chave => { dados.delete(chave); },
  };
  return { dados, armazenamento, repositorio: criarRepositorioPerfil(armazenamento) };
}

test('perfil começa com os dados do cadastro apenas quando o e-mail corresponde ao login', async () => {
  const { repositorio, dados } = armazenamentoInicial({
    '@usuario_email': '  MARIA@example.com ',
    usuario: JSON.stringify({ nome: ' Maria Silva ', email: 'maria@example.com', senha: 'nao-copiar' }),
  });
  assert.deepEqual(await repositorio.carregar(), { nome: 'Maria Silva', telefone: '', email: 'maria@example.com' });
  dados.set('@usuario_email', 'outro@example.com');
  assert.deepEqual(await repositorio.carregar(), { nome: '', telefone: '', email: 'outro@example.com' });
});

test('salvar persiste nome e WhatsApp por e-mail sem copiar senha ou alterar o cadastro', async () => {
  const { repositorio, dados } = armazenamentoInicial({ '@usuario_email': 'maria@example.com' });
  const perfil = await repositorio.carregar();
  const salvo = await repositorio.salvar(perfil, { nome: ' Maria Silva ', telefone: ' (11) 90000-0000 ' });
  assert.deepEqual(salvo, { nome: 'Maria Silva', telefone: '(11) 90000-0000', email: 'maria@example.com' });
  assert.deepEqual(await repositorio.carregar(), salvo);
  dados.set('@usuario_email', 'outra@example.com');
  assert.equal((await repositorio.carregar()).nome, '');
  dados.set('@usuario_email', 'maria@example.com');
  assert.deepEqual(await repositorio.carregar(), salvo);
  assert.equal(dados.has('usuario'), false);
});

test('validação e troca de sessão impedem gravar dados inválidos ou em outro perfil', async () => {
  const { repositorio, dados } = armazenamentoInicial({ '@usuario_email': 'maria@example.com' });
  const perfil = await repositorio.carregar();
  await assert.rejects(repositorio.salvar(perfil, { nome: ' ', telefone: '' }), /nome/);
  await assert.rejects(repositorio.salvar(perfil, { nome: 'Maria', telefone: '123' }), /WhatsApp/);
  dados.set('@usuario_email', 'outra@example.com');
  await assert.rejects(repositorio.salvar(perfil, { nome: 'Maria', telefone: '' }), /login mudou/);
  assert.equal(dados.has('@obracerta_perfil:maria@example.com'), false);
});

test('falhas de leitura e gravação não substituem o perfil anterior', async () => {
  const antigo = JSON.stringify({ nome: 'Maria', telefone: '', email: 'maria@example.com' });
  const { repositorio, armazenamento, dados } = armazenamentoInicial({
    '@usuario_email': 'maria@example.com', '@obracerta_perfil:maria@example.com': antigo,
  });
  const perfil = await repositorio.carregar();
  armazenamento.setItem = async () => { throw new Error('Falha de armazenamento'); };
  await assert.rejects(repositorio.salvar(perfil, { nome: 'Outro nome', telefone: '' }), /Não foi possível salvar/);
  assert.equal(dados.get('@obracerta_perfil:maria@example.com'), antigo);
  dados.set('@obracerta_perfil:maria@example.com', '{invalido');
  await assert.rejects(repositorio.carregar());
  dados.set('@obracerta_perfil:maria@example.com', JSON.stringify({ nome: 'Maria', telefone: 123, email: 'maria@example.com' }));
  await assert.rejects(repositorio.carregar(), /não puderam ser lidos/);
});

test('saída remove somente o login e preserva perfil, equipe e projetos', async () => {
  const { repositorio, dados } = armazenamentoInicial({
    '@usuario_email': 'maria@example.com', '@obracerta_equipe': '[]', '@projetos': '[]',
    '@obracerta_perfil:maria@example.com': JSON.stringify({ nome: 'Maria', telefone: '', email: 'maria@example.com' }),
  });
  await repositorio.sair();
  assert.equal(await repositorio.carregar(), null);
  assert.equal(dados.has('@usuario_email'), false);
  assert.equal(dados.size, 3);
});

test('avatar usa iniciais do primeiro e último nome', () => {
  assert.equal(iniciaisPerfil('  Maria da Silva  '), 'MS');
  assert.equal(iniciaisPerfil('José'), 'JO');
  assert.equal(iniciaisPerfil(''), 'OC');
});
