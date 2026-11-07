import { screenStyles } from '../ScreenLayout';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { ehEntrada, lerValor } from '../../services/obra';
import { Botao, Campo, Confirmacao, Paginacao, estilos, formatarMoeda, itensPagina, novoId } from './ui';

export default function Caixa({ transacoes, equipe, salvar, ocupado }) {
  const [tipo, setTipo] = useState('RECEBIMENTO_CLIENTE');
  const [funcionarioId, setFuncionarioId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');
  const [excluindo, setExcluindo] = useState(null);
  const [pagina, setPagina] = useState(0);
  const bloqueado = ocupado || excluindo !== null;

  async function registrar() {
    try {
      if (!descricao.trim()) throw new Error('Preencha a descrição.');
      const quantia = lerValor(valor, false);
      const profissional = equipe.find(item => item.id === funcionarioId);
      if (tipo === 'PAGAMENTO_FUNCIONARIO' && !profissional) throw new Error('Selecione o profissional da equipe.');
      const transacao = {
        id: novoId(), tipo, valor: quantia, descricao: descricao.trim(), data: new Date().toISOString(),
        funcionario_id: tipo === 'PAGAMENTO_FUNCIONARIO' ? profissional.id : null,
        funcionario_nome: tipo === 'PAGAMENTO_FUNCIONARIO' ? profissional.nome : null,
      };
      if (await salvar('transacoes', [transacao, ...transacoes])) {
        setDescricao(''); setValor(''); setFuncionarioId(''); setTipo('RECEBIMENTO_CLIENTE'); setErro(''); setPagina(0);
      }
    } catch (error) { setErro(error.message); }
  }

  return <View style={estilos.painel}>
    <Text accessibilityRole="header" style={estilos.titulo}>Caixa da Obra</Text>
    <Text style={estilos.label}>Tipo de lançamento</Text>
    <View style={estilos.seletor}><Picker style={screenStyles.picker} accessibilityLabel="Tipo de lançamento" selectedValue={tipo} enabled={!bloqueado} onValueChange={novo => {
      setTipo(novo); setFuncionarioId(''); setValor(''); setErro('');
    }}>
      <Picker.Item label="Entrada: Dinheiro do Cliente" value="RECEBIMENTO_CLIENTE" />
      <Picker.Item label="Saída: Pagamento da Equipe" value="PAGAMENTO_FUNCIONARIO" />
    </Picker></View>
    {tipo === 'PAGAMENTO_FUNCIONARIO' && <>
      <Text style={estilos.label}>Profissional</Text>
      <View style={estilos.seletor}><Picker style={screenStyles.picker} accessibilityLabel="Profissional" selectedValue={funcionarioId} enabled={!bloqueado} onValueChange={selecionado => {
        setFuncionarioId(selecionado);
        const profissional = equipe.find(item => item.id === selecionado);
        setValor(profissional?.valor_diaria == null ? '' : profissional.valor_diaria.toFixed(2).replace('.', ','));
      }}>
        <Picker.Item label="Selecione o profissional..." value="" />
        {equipe.map(item => <Picker.Item key={item.id} label={`${item.nome} — ${item.valor_diaria === null ? 'diária não informada' : formatarMoeda(item.valor_diaria)}`} value={item.id} />)}
      </Picker></View>
      <Text style={estilos.ajuda}>A diária é uma sugestão. Ajuste o valor total para adiantamentos ou vários dias.</Text>
      {!equipe.length && <>
        <Text style={estilos.texto}>Cadastre um profissional na Equipe para registrar o pagamento.</Text>
        <Botao texto="Abrir Equipe" secundario disabled={bloqueado} onPress={() => router.navigate('/equipe')} />
      </>}
    </>}
    <Campo titulo="Descrição" value={descricao} onChangeText={setDescricao} disabled={bloqueado}
      placeholder={tipo === 'RECEBIMENTO_CLIENTE' ? 'Ex: Sinal / 1ª parcela' : 'Ex: Adiantamento / 3 dias'} />
    <Campo titulo="Valor em reais" value={valor} onChangeText={setValor} disabled={bloqueado} decimal placeholder="0,00" />
    {!!erro && <Text accessibilityRole="alert" style={estilos.aviso}>{erro}</Text>}
    <Botao texto={ocupado ? 'Salvando...' : 'Lançar no Caixa'} disabled={bloqueado} onPress={registrar} />
    <Text style={estilos.subtitulo}>Histórico de movimentações</Text>
    {!transacoes.length && <Text style={estilos.texto}>Nenhuma movimentação.</Text>}
    {itensPagina(transacoes, pagina).map(item => {
      const entrada = ehEntrada(item);
      const profissional = equipe.find(pessoa => pessoa.id === item.funcionario_id);
      return <View key={item.id} style={estilos.item}>
        <View style={estilos.linha}>
          <Text style={estilos.subtitulo}>{entrada ? 'Recebimento' : profissional?.nome || item.funcionario_nome || 'Equipe / pagamento anterior'}</Text>
          <Text style={[estilos.dinheiro, !entrada && estilos.negativo]}>{entrada ? '+' : '−'} {formatarMoeda(item.valor)}</Text>
        </View>
        <Text style={estilos.texto}>{item.descricao}</Text>
        <Text style={estilos.ajuda}>{Number.isFinite(Date.parse(item.data)) ? new Date(item.data).toLocaleDateString('pt-BR') : 'Data não informada'}</Text>
        <Botao texto={`Excluir ${item.descricao}`} secundario disabled={bloqueado} onPress={() => setExcluindo(item.id)} />
        {excluindo === item.id && <Confirmacao disabled={ocupado}
          descricao={entrada ? `O recebimento de ${formatarMoeda(item.valor)} será removido. O lucro calculado diminuirá nesse valor.`
            : `O pagamento de ${formatarMoeda(item.valor)} será removido. O lucro calculado aumentará nesse valor. Isso não estorna um pagamento ao profissional.`}
          onCancel={() => setExcluindo(null)} onConfirm={async () => {
            if (await salvar('transacoes', transacoes.filter(atual => atual.id !== item.id))) setExcluindo(null);
          }} />}
      </View>;
    })}
    <Paginacao total={transacoes.length} pagina={pagina} onChange={setPagina} disabled={bloqueado} />
  </View>;
}
