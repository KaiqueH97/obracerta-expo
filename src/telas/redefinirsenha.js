import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AuthLayout from '../components/AuthLayout';

export default function RedefinirSenha() {
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [concluido, setConcluido] = useState(false);
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const senhaInput = useRef(null);
  const confirmacaoInput = useRef(null);

  function simularRedefinicao() {
    if (!senha.trim() || senha.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres e não pode conter apenas espaços.');
      senhaInput.current?.focus();
      return;
    }
    if (senha !== confirmacao) {
      setErro('As senhas não coincidem. Confira a confirmação.');
      confirmacaoInput.current?.focus();
      return;
    }
    setSenha('');
    setConfirmacao('');
    setMostrarSenhas(false);
    setErro('');
    setConcluido(true);
  }

  return <AuthLayout>
    <View style={styles.card}>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="lock-check-outline" size={36} color="#c2410c" />
      </View>
      <Text style={styles.title} accessibilityRole="header">Redefinir senha</Text>
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Modo demonstrativo</Text>
        <Text style={styles.noticeText}>Esta tela simula a redefinição. Nenhuma senha será salva ou alterada. Use uma senha fictícia para testar.</Text>
      </View>

      {concluido ? <View style={styles.confirmation} accessibilityLiveRegion="polite">
        <MaterialCommunityIcons name="check-circle-outline" size={32} color="#047857" />
        <Text style={styles.confirmationTitle}>Simulação concluída</Text>
        <Text style={styles.text}>A nova senha e a confirmação passaram pela validação. Sua senha de acesso não foi alterada.</Text>
        <Text style={styles.text}>Os campos foram limpos. Para alterar uma senha de verdade, será necessário integrar a autenticação.</Text>
        <TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={() => setConcluido(false)}>
          <Text style={styles.secondaryText}>Simular novamente</Text>
        </TouchableOpacity>
      </View> : <View style={styles.form}>
        <Text style={styles.text}>Digite uma nova senha e repita no campo de confirmação.</Text>
        <Text style={styles.hint}>Use pelo menos 6 caracteres.</Text>
        <Text style={styles.label}>Nova senha</Text>
        <TextInput ref={senhaInput} accessibilityLabel="Nova senha" accessibilityHint="Use pelo menos 6 caracteres"
          style={styles.input} placeholder="Digite uma senha fictícia" placeholderTextColor="#71717a"
          value={senha} onChangeText={valor => { setSenha(valor); setErro(''); }}
          secureTextEntry={!mostrarSenhas} autoCapitalize="none" autoCorrect={false} autoComplete="off"
          returnKeyType="next" onSubmitEditing={() => confirmacaoInput.current?.focus()} />
        <Text style={styles.label}>Confirmar nova senha</Text>
        <TextInput ref={confirmacaoInput} accessibilityLabel="Confirmar nova senha" style={styles.input}
          placeholder="Repita a nova senha" placeholderTextColor="#71717a"
          value={confirmacao} onChangeText={valor => { setConfirmacao(valor); setErro(''); }}
          secureTextEntry={!mostrarSenhas} autoCapitalize="none" autoCorrect={false} autoComplete="off"
          returnKeyType="done" onSubmitEditing={simularRedefinicao} />
        <TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={() => setMostrarSenhas(valor => !valor)}>
          <Text style={styles.secondaryText}>{mostrarSenhas ? 'Ocultar senhas' : 'Mostrar senhas'}</Text>
        </TouchableOpacity>
        {!!erro && <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{erro}</Text>}
        <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={simularRedefinicao}>
          <Text style={styles.buttonText}>Simular redefinição</Text>
        </TouchableOpacity>
      </View>}

      <View style={styles.footer}>
        <TouchableOpacity accessibilityRole="button" style={styles.backButton} onPress={() => router.navigate('/recuperar')}>
          <Text style={styles.backText}>Voltar à recuperação</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={styles.backButton} onPress={() => router.navigate('/')}>
          <Text style={styles.backText}>Voltar ao login</Text>
        </TouchableOpacity>
      </View>
    </View>
  </AuthLayout>;
}

const styles = StyleSheet.create({
  card: { width: '100%', maxWidth: 440, padding: 24, gap: 20, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e4e4e7' },
  icon: { alignSelf: 'center', backgroundColor: '#ffedd5', borderRadius: 16, padding: 14 },
  title: { fontSize: 28, fontWeight: '900', color: '#18181b', textAlign: 'center' },
  notice: { backgroundColor: '#fff7ed', borderWidth: 1, borderColor: '#fed7aa', borderRadius: 12, padding: 16, gap: 6 },
  noticeTitle: { fontSize: 15, fontWeight: 'bold', color: '#9a3412' },
  noticeText: { fontSize: 14, lineHeight: 21, color: '#9a3412' },
  form: { gap: 12 },
  text: { fontSize: 15, lineHeight: 23, color: '#52525b' },
  hint: { fontSize: 13, lineHeight: 20, color: '#71717a' },
  label: { fontSize: 15, fontWeight: 'bold', color: '#27272a', marginTop: 4 },
  input: { minHeight: 48, borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 10, padding: 14, backgroundColor: '#fafafa', color: '#18181b', fontSize: 16 },
  error: { color: '#b91c1c', fontSize: 14, lineHeight: 21 },
  button: { minHeight: 48, padding: 16, backgroundColor: '#18181b', alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginTop: 4 },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  confirmation: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 12, padding: 16, gap: 12 },
  confirmationTitle: { fontSize: 20, fontWeight: 'bold', color: '#065f46' },
  secondaryButton: { minHeight: 48, padding: 12, borderRadius: 10, backgroundColor: '#f4f4f5', alignItems: 'center', justifyContent: 'center' },
  secondaryText: { fontSize: 15, fontWeight: 'bold', color: '#27272a', textAlign: 'center' },
  footer: { borderTopWidth: 1, borderTopColor: '#f4f4f5', paddingTop: 12, gap: 4 },
  backButton: { minHeight: 48, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 16, color: '#c2410c', fontWeight: 'bold', textAlign: 'center' },
});
