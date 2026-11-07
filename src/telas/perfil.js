import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { criarRepositorioPerfil, iniciaisPerfil } from '../services/perfil';

const repositorio = criarRepositorioPerfil(AsyncStorage);

export default function Perfil() {
  const insets = useSafeAreaInsets();
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState(false);
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [ocupado, setOcupado] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const bloqueado = useRef(false);

  const leitura = useRef(0);

  const carregarPerfil = useCallback(() => {
    const versao = ++leitura.current;
    repositorio.carregar().then(dados => {
      if (versao !== leitura.current) return;
      if (!dados) { router.replace('/'); return; }
      setPerfil(dados);
      setEditando(false);
      setMensagem('');
      setErroCarga(false);
      setCarregando(false);
    }).catch(() => {
      if (versao === leitura.current) { setErroCarga(true); setCarregando(false); }
    });
  }, []);

  useFocusEffect(useCallback(() => {
    carregarPerfil();
    return () => { leitura.current++; };
  }, [carregarPerfil]));

  function iniciarEdicao() {
    if (bloqueado.current) return;
    setNome(perfil.nome);
    setTelefone(perfil.telefone);
    setMensagem('');
    setEditando(true);
  }

  async function salvar() {
    if (bloqueado.current) return;
    bloqueado.current = true;
    setOcupado('salvar');
    setMensagem('');
    try {
      const atualizado = await repositorio.salvar(perfil, { nome, telefone });
      setPerfil(atualizado);
      setEditando(false);
      setMensagem('Dados atualizados com sucesso!');
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : 'Não foi possível salvar. Tente novamente.');
    } finally {
      setOcupado(null);
      bloqueado.current = false;
    }
  }

  async function sair() {
    if (bloqueado.current) return;
    bloqueado.current = true;
    setOcupado('sair');
    setMensagem('');
    try {
      await repositorio.sair();
      router.replace('/');
    } catch {
      setMensagem('Não foi possível sair. Tente novamente.');
    } finally {
      setOcupado(null);
      bloqueado.current = false;
    }
  }

  return <View style={styles.container}>
    <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
      <MaterialCommunityIcons name="hard-hat" size={30} color="#ea580c" />
      <Text style={styles.brand}>Obra <Text style={styles.highlight}>Certa</Text></Text>
    </View>
    {carregando ? <View style={styles.feedback}>
      <ActivityIndicator size="large" color="#ea580c" /><Text>Carregando perfil...</Text>
    </View> : erroCarga ? <View style={styles.feedback}>
      <Text style={styles.title}>Meu Perfil</Text>
      <Text style={styles.subtitle}>Não foi possível carregar o perfil. Seus dados foram mantidos.</Text>
      <TouchableOpacity accessibilityRole="button" disabled={!!ocupado} style={styles.button} onPress={() => {
        setCarregando(true); carregarPerfil();
      }}><Text style={styles.buttonText}>Tentar novamente</Text></TouchableOpacity>
      <TouchableOpacity accessibilityRole="button" disabled={!!ocupado} style={styles.secondaryButton} onPress={sair}>
        <Text style={styles.secondaryText}>{ocupado === 'sair' ? 'Saindo...' : 'Voltar ao login'}</Text>
      </TouchableOpacity>
      {!!mensagem && <Text accessibilityLiveRegion="polite" style={styles.message}>{mensagem}</Text>}
    </View> : perfil && <ScrollView keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}>
      <Text style={styles.title}>Meu Perfil</Text>
      <Text style={styles.subtitle}>Gerencie suas informações e preferências do sistema.</Text>
      <View style={[styles.card, styles.badge]}>
        <View style={styles.avatar}><Text style={styles.initials}>{iniciaisPerfil(perfil.nome)}</Text></View>
        <Text style={styles.name}>{perfil.nome || 'Usuário'}</Text>
        <Text style={styles.subtitle}>Profissional da Obra</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.sectionHeading}>
          <MaterialCommunityIcons name="account-outline" size={24} color="#ea580c" />
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
        </View>
        {!!mensagem && <Text accessibilityLiveRegion="polite" style={styles.message}>{mensagem}</Text>}
        {editando ? <>
          <Text style={styles.label}>Nome completo *</Text>
          <TextInput accessibilityLabel="Nome completo" value={nome} onChangeText={setNome}
            placeholder="Ex: João da Silva" placeholderTextColor="#71717a" style={styles.input}
            editable={!ocupado} maxLength={120} autoCapitalize="words" autoComplete="name" />
          <Text style={styles.label}>WhatsApp de contato</Text>
          <TextInput accessibilityLabel="WhatsApp de contato" value={telefone} onChangeText={setTelefone}
            placeholder="(11) 90000-0000" placeholderTextColor="#71717a" style={styles.input}
            editable={!ocupado} maxLength={32} keyboardType="phone-pad" autoComplete="tel" />
          <Text style={styles.hint}>Opcional. Inclua o DDD do seu número.</Text>
          <TouchableOpacity accessibilityRole="button" disabled={!!ocupado} onPress={salvar}
            style={[styles.button, styles.saveButton, !!ocupado && styles.disabled]}>
            {ocupado === 'salvar' ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar alterações</Text>}
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" disabled={!!ocupado} style={styles.secondaryButton}
            onPress={() => { setEditando(false); setMensagem(''); }}>
            <Text style={styles.secondaryText}>Cancelar edição</Text>
          </TouchableOpacity>
        </> : <>
          <Text style={styles.label}>Nome completo</Text>
          <Text style={styles.value}>{perfil.nome || 'Usuário'}</Text>
          <Text style={styles.label}>WhatsApp</Text>
          <Text style={styles.value}>{perfil.telefone || 'Não informado'}</Text>
          <TouchableOpacity accessibilityRole="button" disabled={!!ocupado} onPress={iniciarEdicao}
            style={[styles.button, !!ocupado && styles.disabled]}><Text style={styles.buttonText}>Editar dados</Text></TouchableOpacity>
        </>}
      </View>
      <View style={styles.card}>
        <View style={styles.sectionHeading}>
          <MaterialCommunityIcons name="shield-check-outline" size={24} color="#ea580c" />
          <Text style={styles.sectionTitle}>Segurança de Acesso</Text>
        </View>
        <Text style={styles.label}>E-mail da conta</Text>
        <Text style={styles.email} selectable>{perfil.email}</Text>
        <Text style={styles.hint}>O e-mail é o utilizado no login e não pode ser alterado por aqui.</Text>
        <Text style={styles.label}>Senha de acesso</Text>
        <Text style={styles.subtitle}>Teste o fluxo de redefinição no modo demonstrativo. Sua senha não será alterada.</Text>
        <TouchableOpacity accessibilityRole="button" disabled={!!ocupado || editando}
          style={[styles.secondaryButton, (!!ocupado || editando) && styles.disabled]}
          onPress={() => router.push('/redefinir-senha')}>
          <Text style={styles.secondaryText}>Testar redefinição de senha</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>Suas informações são salvas neste aparelho. O login atual é demonstrativo.</Text>
      <TouchableOpacity accessibilityRole="button" disabled={!!ocupado} onPress={sair}
        style={[styles.logoutButton, !!ocupado && styles.disabled]}>
        <MaterialCommunityIcons name="logout" size={22} color="#b91c1c" />
        <Text style={styles.logoutText}>{ocupado === 'sair' ? 'Saindo...' : 'Sair do sistema'}</Text>
      </TouchableOpacity>
    </ScrollView>}
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  header: { backgroundColor: '#18181b', paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderBottomWidth: 4, borderBottomColor: '#ea580c' },
  brand: { color: '#fff', fontSize: 28, fontWeight: '900' },
  highlight: { color: '#ea580c' },
  content: { padding: 16, paddingBottom: 40, gap: 12, width: '100%', maxWidth: 900, alignSelf: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#18181b' },
  subtitle: { fontSize: 15, color: '#52525b', lineHeight: 22 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e4e4e7', padding: 20, gap: 10 },
  badge: { alignItems: 'center' },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#ffedd5', alignItems: 'center', justifyContent: 'center' },
  initials: { fontSize: 30, color: '#c2410c', fontWeight: '900' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#18181b', textAlign: 'center' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#18181b' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#27272a', marginTop: 8 },
  value: { fontSize: 17, color: '#18181b' },
  email: { fontSize: 16, color: '#27272a', padding: 14, borderRadius: 10, backgroundColor: '#f4f4f5' },
  hint: { fontSize: 13, color: '#71717a', lineHeight: 20 },
  input: { minHeight: 48, borderWidth: 1, borderColor: '#d4d4d8', backgroundColor: '#fafafa', color: '#18181b', borderRadius: 10, padding: 14, fontSize: 16 },
  button: { minHeight: 48, backgroundColor: '#18181b', borderRadius: 10, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  saveButton: { backgroundColor: '#047857' },
  secondaryButton: { minHeight: 48, padding: 14, borderRadius: 10, backgroundColor: '#f4f4f5', alignItems: 'center', justifyContent: 'center' },
  secondaryText: { color: '#27272a', fontWeight: 'bold', fontSize: 15 },
  disabled: { opacity: 0.5 },
  message: { color: '#9a3412', fontSize: 15, lineHeight: 22 },
  logoutButton: { minHeight: 48, padding: 16, backgroundColor: '#fef2f2', borderRadius: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', alignItems: 'center' },
  logoutText: { color: '#b91c1c', fontSize: 16, fontWeight: 'bold' },
  feedback: { flex: 1, padding: 24, gap: 16, justifyContent: 'center', alignItems: 'center' },
});
