import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseDiaria, validarEquipe } from '../utils/equipe';

const CHAVE_EQUIPE = '@obracerta_equipe';
async function lerEquipe() {
  const dados = await AsyncStorage.getItem(CHAVE_EQUIPE);
  return dados ? validarEquipe(JSON.parse(dados)) : [];
}

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Equipe() {
  const insets = useSafeAreaInsets();
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [diaria, setDiaria] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [excluindoId, setExcluindoId] = useState(null);
  const bloqueado = useRef(false);
  const lista = useRef(null);
  const nomeInput = useRef(null);

  async function carregarEquipe() {
    try {
      setFuncionarios(await lerEquipe());
      setErroCarga(false);
    } catch {
      setErroCarga(true);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    let ativo = true;
    lerEquipe().then(dados => {
      if (ativo) { setFuncionarios(dados); setCarregando(false); }
    }).catch(() => {
      if (ativo) { setErroCarga(true); setCarregando(false); }
    });
    return () => { ativo = false; };
  }, []);

  function limparFormulario() {
    setNome('');
    setCargo('');
    setDiaria('');
    setEditandoId(null);
  }

  async function persistir(proximos, sucesso) {
    if (bloqueado.current) return false;
    bloqueado.current = true;
    setSalvando(true);
    setMensagem('');
    try {
      await AsyncStorage.setItem(CHAVE_EQUIPE, JSON.stringify(proximos));
      setFuncionarios(proximos);
      setMensagem(sucesso);
      return true;
    } catch {
      setMensagem('Não foi possível salvar. Seus dados foram mantidos. Tente novamente.');
      return false;
    } finally {
      bloqueado.current = false;
      setSalvando(false);
    }
  }

  async function salvar() {
    if (bloqueado.current || carregando || erroCarga || excluindoId) return;
    if (!nome.trim()) {
      setMensagem('O nome do profissional é obrigatório.');
      nomeInput.current?.focus();
      return;
    }
    let valor;
    try { valor = parseDiaria(diaria); }
    catch (error) { setMensagem(error.message); return; }
    const profissional = {
      id: editandoId || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      nome: nome.trim(), cargo: cargo.trim() || 'Profissional da Obra', valor_diaria: valor,
    };
    const proximos = editandoId
      ? funcionarios.map(item => item.id === editandoId ? profissional : item)
      : [profissional, ...funcionarios];
    if (await persistir(proximos, editandoId ? 'Profissional atualizado!' : 'Profissional cadastrado!')) {
      limparFormulario();
    }
  }

  function editar(item) {
    setEditandoId(item.id);
    setNome(item.nome);
    setCargo(item.cargo);
    setDiaria(item.valor_diaria === null ? '' : item.valor_diaria.toFixed(2).replace('.', ','));
    setMensagem('');
    lista.current?.scrollToOffset({ offset: 0, animated: true });
    nomeInput.current?.focus();
  }

  const desabilitado = salvando || excluindoId !== null;
  const cabecalho = <View style={styles.section}>
    <Text style={styles.title}>Minha Equipe</Text>
    <Text style={styles.subtitle}>Gerencie os profissionais e o valor das diárias.</Text>
    <Text style={styles.local}>Os dados são salvos neste aparelho.</Text>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{editandoId ? 'Editar profissional' : 'Novo Profissional'}</Text>
      <Text style={styles.label}>Nome *</Text>
      <TextInput ref={nomeInput} accessibilityLabel="Nome do profissional" style={styles.input}
        placeholder="Ex: Carlos Silva" placeholderTextColor="#71717a" value={nome} onChangeText={setNome}
        editable={!desabilitado} maxLength={120} autoCapitalize="words" />
      <Text style={styles.label}>Cargo / Especialidade</Text>
      <TextInput accessibilityLabel="Cargo ou especialidade" style={styles.input}
        placeholder="Ex: Pedreiro, Pintor..." placeholderTextColor="#71717a" value={cargo}
        onChangeText={setCargo} editable={!desabilitado} maxLength={100} />
      <Text style={styles.label}>Valor da diária (R$)</Text>
      <TextInput accessibilityLabel="Valor da diária em reais" style={styles.input}
        placeholder="150,00" placeholderTextColor="#71717a" value={diaria} onChangeText={setDiaria}
        editable={!desabilitado} keyboardType="decimal-pad" maxLength={20} />
      <Text style={styles.local}>Deixe em branco se a diária ainda não foi definida.</Text>
      <TouchableOpacity accessibilityRole="button" disabled={desabilitado} onPress={salvar}
        style={[styles.button, desabilitado && styles.disabled]}>
        {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>
          {editandoId ? 'Salvar alterações' : 'Cadastrar na Equipe'}
        </Text>}
      </TouchableOpacity>
      {editandoId && <TouchableOpacity accessibilityRole="button" disabled={desabilitado}
        style={styles.secondaryButton} onPress={() => { limparFormulario(); setMensagem(''); }}>
        <Text style={styles.secondaryText}>Cancelar edição</Text>
      </TouchableOpacity>}
      {!!mensagem && <Text accessibilityLiveRegion="polite" style={styles.message}>{mensagem}</Text>}
    </View>
    <Text style={styles.sectionTitle}>Profissionais cadastrados ({funcionarios.length})</Text>
  </View>;

  return <View style={styles.container}>
    <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
      <MaterialCommunityIcons name="hard-hat" size={30} color="#ea580c" />
      <Text style={styles.brand}>Obra <Text style={styles.highlight}>Certa</Text></Text>
    </View>
    {carregando ? <View style={styles.feedback}>
      <ActivityIndicator size="large" color="#ea580c" /><Text>Carregando equipe...</Text>
    </View> : erroCarga ? <View style={styles.feedback}>
      <Text style={styles.sectionTitle}>Minha Equipe</Text>
      <Text style={styles.subtitle}>Não foi possível carregar a equipe. Tente novamente.</Text>
      <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={() => { setCarregando(true); setErroCarga(false); carregarEquipe(); }}>
        <Text style={styles.buttonText}>Tentar novamente</Text>
      </TouchableOpacity>
    </View> : <FlatList ref={lista} data={funcionarios} keyExtractor={item => item.id}
      keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content} ListHeaderComponent={cabecalho}
      ListEmptyComponent={<View style={styles.card}>
        <MaterialCommunityIcons name="account-group-outline" size={40} color="#71717a" />
        <Text style={styles.sectionTitle}>Nenhum profissional na sua equipe.</Text>
        <Text style={styles.subtitle}>Use o formulário acima para começar.</Text>
      </View>}
      renderItem={({ item }) => <View style={styles.card}>
        <Text style={styles.name}>{item.nome}</Text>
        <Text style={styles.subtitle}>{item.cargo}</Text>
        <Text style={styles.label}>Diária</Text>
        <Text style={styles.money}>{item.valor_diaria === null ? 'Não informada' : moeda.format(item.valor_diaria)}</Text>
        {excluindoId === item.id ? <View style={styles.confirmation}>
          <Text style={styles.sectionTitle}>Excluir {item.nome}?</Text>
          <Text style={styles.subtitle}>O profissional será removido da equipe deste aparelho.</Text>
          <TouchableOpacity accessibilityRole="button" disabled={salvando} style={[styles.button, styles.danger]}
            onPress={async () => {
              if (await persistir(funcionarios.filter(pessoa => pessoa.id !== item.id), 'Profissional removido.')) {
                setExcluindoId(null);
              }
            }}><Text style={styles.buttonText}>{salvando ? 'Removendo...' : 'Confirmar exclusão'}</Text></TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" disabled={salvando} style={styles.secondaryButton}
            onPress={() => setExcluindoId(null)}><Text style={styles.secondaryText}>Cancelar</Text></TouchableOpacity>
        </View> : <View style={styles.actions}>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Editar ${item.nome}`}
            disabled={salvando || !!editandoId || !!excluindoId}
            style={[styles.secondaryButton, (salvando || !!editandoId || !!excluindoId) && styles.disabled]}
            onPress={() => editar(item)}><Text style={styles.secondaryText}>Editar</Text></TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Excluir ${item.nome}`}
            disabled={salvando || !!editandoId || !!excluindoId}
            style={[styles.secondaryButton, (salvando || !!editandoId || !!excluindoId) && styles.disabled]}
            onPress={() => { setExcluindoId(item.id); setMensagem(''); }}>
            <Text style={styles.dangerText}>Excluir</Text>
          </TouchableOpacity>
        </View>}
      </View>} />}
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { backgroundColor: '#18181b', paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderBottomWidth: 4, borderBottomColor: '#ea580c' },
  brand: { color: '#fff', fontSize: 28, fontWeight: '900' },
  highlight: { color: '#ea580c' },
  content: { padding: 16, paddingBottom: 40, width: '100%', maxWidth: 900, alignSelf: 'center' },
  section: { gap: 12 },
  title: { fontSize: 28, fontWeight: '900', color: '#18181b' },
  subtitle: { fontSize: 15, color: '#52525b', lineHeight: 22 },
  local: { fontSize: 13, color: '#71717a', lineHeight: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e4e4e7', padding: 20, marginVertical: 8, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#18181b' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#27272a', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#d4d4d8', backgroundColor: '#fafafa', color: '#18181b', borderRadius: 10, padding: 14, fontSize: 16, minHeight: 48 },
  button: { backgroundColor: '#18181b', borderRadius: 10, padding: 16, alignItems: 'center', justifyContent: 'center', minHeight: 48, marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  secondaryButton: { padding: 14, minHeight: 48, borderRadius: 10, backgroundColor: '#f4f4f5', alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: '#27272a', fontWeight: 'bold', fontSize: 15 },
  disabled: { opacity: 0.5 },
  message: { color: '#9a3412', fontSize: 15, lineHeight: 22, marginTop: 8 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#18181b' },
  money: { fontSize: 20, color: '#047857', fontWeight: 'bold' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  confirmation: { gap: 8, marginTop: 12, borderTopWidth: 1, borderColor: '#e4e4e7', paddingTop: 16 },
  danger: { backgroundColor: '#b91c1c' },
  dangerText: { color: '#b91c1c', fontWeight: 'bold', fontSize: 15 },
  feedback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
});
