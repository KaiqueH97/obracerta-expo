// Aceita valores brasileiros (1.234,56) e decimais simples (1234.56).
export function parseDiaria(texto) {
  const valor = texto.trim();
  if (!valor) return null;
  if (!/^(?:\d+(?:[,.]\d{1,2})?|\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?)$/.test(valor)) {
    throw new Error('Informe uma diária válida, como 150,00.');
  }
  const normalizado = valor.includes(',') || /^\d{1,3}(?:\.\d{3})+$/.test(valor)
    ? valor.replace(/\./g, '').replace(',', '.') : valor;
  const numero = Number(normalizado);
  if (!Number.isFinite(numero) || numero > Number.MAX_SAFE_INTEGER / 100) {
    throw new Error('O valor da diária é muito alto.');
  }
  return Math.round(numero * 100) / 100;
}

export function validarEquipe(value) {
  if (!Array.isArray(value) || value.some(item =>
    !item || typeof item.id !== 'string' || typeof item.nome !== 'string' ||
    typeof item.cargo !== 'string' ||
    (item.valor_diaria !== null && (typeof item.valor_diaria !== 'number' ||
      !Number.isFinite(item.valor_diaria) || item.valor_diaria < 0))
  ) || new Set(value.map(item => item.id)).size !== value.length) {
    throw new Error('Os dados da equipe não puderam ser lidos.');
  }
  return value;
}
