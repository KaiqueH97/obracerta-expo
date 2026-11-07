import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { lerValor } from '../../services/obra';
import { Botao, Campo, Confirmacao, Paginacao, estilos, formatarMoeda, itensPagina } from './ui';

export default function Materiais({ id, materiais, salvar, ocupado }) {
  const [pagina, setPagina] = useState(0);
  const [editando, setEditando] = useState(null);
  const [excluindo, setExcluindo] = useState(null);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [preco, setPreco] = useState('');
  const [erro, setErro] = useState('');
  const bloqueado = ocupado || editando !== null || excluindo !== null;

  async function salvarEdicao() {
    try {
      if (!nome.trim() || !quantidade.trim()) throw new Error('Preencha o nome e a quantidade.');
      const valor = lerValor(preco);
      if (await salvar('materiais', materiais.map(item => item.id === editando
        ? { ...item, nome: nome.trim(), quantidade: quantidade.trim(), preco_total: valor } : item))) {
        setEditando(null); setErro('');
      }
    } catch (error) { setErro(error.message); }
  }

  return <View style={estilos.painel}>
    <Text accessibilityRole="header" style={estilos.titulo}>Lista de Materiais</Text>
    {!!erro && <Text accessibilityRole="alert" style={estilos.aviso}>{erro}</Text>}
    {!materiais.length && <Text style={estilos.texto}>Nenhum material adicionado. Use Nova Medição para começar.</Text>}
    {itensPagina(materiais, pagina).map(item => <View key={item.id} style={estilos.item}>
      {editando === item.id ? <>
        <Campo titulo="Nome do material" value={nome} onChangeText={setNome} disabled={ocupado} />
        <Campo titulo="Quantidade" value={quantidade} onChangeText={setQuantidade} disabled={ocupado} />
        <Campo titulo="Custo registrado (R$)" value={preco} onChangeText={setPreco} disabled={ocupado} decimal />
        <Botao texto={ocupado ? 'Salvando...' : 'Salvar material'} disabled={ocupado} onPress={salvarEdicao} />
        <Botao texto="Cancelar edição" secundario disabled={ocupado} onPress={() => { setEditando(null); setErro(''); }} />
      </> : <>
        <Text style={estilos.subtitulo}>{item.nome}</Text>
        <View style={estilos.badge}><Text style={estilos.quantidade}>{item.quantidade}</Text></View>
        <View style={estilos.linha}>
          <Text style={estilos.ajuda}>Custo registrado</Text>
          <Text style={estilos.dinheiro}>{formatarMoeda(item.preco_total)}</Text>
        </View>
        <View style={estilos.acoes}>
          <Botao texto={`Editar ${item.nome}`} secundario disabled={bloqueado} onPress={() => {
            setEditando(item.id); setNome(item.nome); setQuantidade(item.quantidade);
            setPreco(item.preco_total.toFixed(2).replace('.', ',')); setErro('');
          }} />
          <Botao texto={`Excluir ${item.nome}`} secundario disabled={bloqueado} onPress={() => { setExcluindo(item.id); setErro(''); }} />
        </View>
      </>}
      {excluindo === item.id && <Confirmacao descricao={`O material ${item.nome} e seu custo serão removidos deste orçamento.`}
        disabled={ocupado} onCancel={() => setExcluindo(null)} onConfirm={async () => {
          if (await salvar('materiais', materiais.filter(atual => atual.id !== item.id))) setExcluindo(null);
        }} />}
    </View>)}
    <Paginacao total={materiais.length} pagina={pagina} onChange={setPagina} disabled={bloqueado} />
    <Botao texto="Nova Medição" secundario disabled={bloqueado} onPress={() => router.push({ pathname: '/nova-medicao', params: { projetoId: id } })} />
  </View>;
}
