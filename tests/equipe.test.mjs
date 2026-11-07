import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDiaria, validarEquipe } from '../src/utils/equipe.js';

test('diárias aceitam formatos brasileiros, decimais, zero e valor não informado', () => {
  for (const [entrada, esperado] of [['150,50', 150.5], ['150.50', 150.5], ['1.234,56', 1234.56], ['1.234', 1234], ['0', 0], ['  ', null]]) {
    assert.equal(parseDiaria(entrada), esperado);
  }
});

test('diárias rejeitam valores negativos, parciais e imprecisos', () => {
  for (const entrada of ['-10', '150abc', 'NaN', 'Infinity', '1,234', '1.23.45', '1e3', '999999999999999999999']) {
    assert.throws(() => parseDiaria(entrada));
  }
});

test('leitura valida dados antes de permitir sobrescrever o armazenamento', () => {
  const profissional = { id: '1', nome: 'Carlos', cargo: 'Pedreiro', valor_diaria: 0 };
  assert.deepEqual(validarEquipe([profissional]), [profissional]);
  assert.deepEqual(validarEquipe([{ ...profissional, valor_diaria: null }]), [{ ...profissional, valor_diaria: null }]);
  for (const dados of [{}, [null], [{ nome: 'Carlos' }], [profissional, profissional], [{ ...profissional, valor_diaria: -1 }]]) {
    assert.throws(() => validarEquipe(dados));
  }
});
