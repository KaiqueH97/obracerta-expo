const CHAVE_SESSAO = '@usuario_email';
const normalizarEmail = email => email.trim().toLowerCase();

export function iniciaisPerfil(nome) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return 'OC';
  return (partes.length === 1
    ? partes[0].slice(0, 2)
    : partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

// O adaptador permite usar AsyncStorage no aplicativo e memória nas verificações.
export function criarRepositorioPerfil(armazenamento) {
  async function emailAtual() {
    const email = await armazenamento.getItem(CHAVE_SESSAO);
    return email ? normalizarEmail(email) : '';
  }

  return {
    async carregar() {
      const email = await emailAtual();
      if (!email) return null;
      const salvo = await armazenamento.getItem(`@obracerta_perfil:${email}`);
      if (salvo !== null) {
        const perfil = JSON.parse(salvo);
        if (!perfil || perfil.email !== email || typeof perfil.nome !== 'string' || typeof perfil.telefone !== 'string') {
          throw new Error('Os dados do perfil não puderam ser lidos.');
        }
        return { email, nome: perfil.nome, telefone: perfil.telefone };
      }
      const cadastro = await armazenamento.getItem('usuario');
      const usuario = cadastro ? JSON.parse(cadastro) : null;
      const mesmoEmail = usuario && typeof usuario.email === 'string' && normalizarEmail(usuario.email) === email;
      return {
        email,
        nome: mesmoEmail && typeof usuario.nome === 'string' ? usuario.nome.trim() : '',
        telefone: mesmoEmail && typeof usuario.telefone === 'string' ? usuario.telefone.trim() : '',
      };
    },
    async salvar(perfil, dados) {
      const nome = dados.nome.trim();
      const telefone = dados.telefone.trim();
      if (!nome) throw new Error('O nome não pode ficar vazio.');
      if (nome.length > 120) throw new Error('O nome deve ter até 120 caracteres.');
      if (telefone && (!/^[+\d\s().-]+$/.test(telefone) || !/^\d{10,15}$/.test(telefone.replace(/\D/g, '')))) {
        throw new Error('Informe um WhatsApp com DDD, como (11) 90000-0000, ou deixe em branco.');
      }
      if (await emailAtual() !== perfil.email) throw new Error('Seu login mudou. Abra o perfil novamente antes de salvar.');
      const atualizado = { email: perfil.email, nome, telefone };
      try {
        await armazenamento.setItem(`@obracerta_perfil:${perfil.email}`, JSON.stringify(atualizado));
      } catch {
        throw new Error('Não foi possível salvar o perfil. Confira os dados e tente novamente.');
      }
      return atualizado;
    },
    async sair() {
      await armazenamento.removeItem(CHAVE_SESSAO);
    },
  };
}
