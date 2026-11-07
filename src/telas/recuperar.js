import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AuthLayout from '../components/AuthLayout';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [emailConfirmado, setEmailConfirmado] = useState('');
  const emailInput = useRef(null);

  function simularSolicitacao() {
    const endereco = email.trim().toLowerCase();
    if (!endereco || endereco.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(endereco)) {
      setErro('Informe um e-mail válido, como nome@exemplo.com.');
      emailInput.current?.focus();
      return;
    }
    setErro('');
    setEmailConfirmado(endereco);
  }

  return <AuthLayout>
    <View style={styles.card}>
      <View style={styles.icon}>
        <MaterialCommunityIcons name="lock-reset" size={36} color="#c2410c" />
      </View>
      <Text style={styles.title} accessibilityRole="header">Recuperar senha</Text>
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Modo demonstrativo</Text>
        <Text style={styles.noticeText}>O envio de e-mails ainda não está integrado. Nesta tela, você pode simular uma solicitação de recuperação.</Text>
      </View>

      {emailConfirmado ? <View style={styles.confirmation} accessibilityLiveRegion="polite">
        <MaterialCommunityIcons name="check-circle-outline" size={32} color="#047857" />
        <Text style={styles.confirmationTitle}>Simulação concluída</Text>
        <Text style={styles.text}>E-mail informado:</Text>
        <Text style={styles.email} selectable>{emailConfirmado}</Text>
        <Text style={styles.text}>Nenhum e-mail foi enviado e sua senha não foi alterada. Com a autenticação integrada, este passo solicitará o link para redefinir sua senha.</Text>
        <TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={() => {
          setEmailConfirmado(''); setErro('');
        }}><Text style={styles.secondaryText}>Usar outro e-mail</Text></TouchableOpacity>
      </View> : <View style={styles.form}>
        <Text style={styles.text}>Informe seu e-mail para simular o pedido de recuperação de senha.</Text>
        <Text style={styles.label}>E-mail da conta</Text>
        <TextInput ref={emailInput} style={[styles.input, !!erro && styles.inputError]}
          accessibilityLabel="E-mail da conta" accessibilityHint="Informe um e-mail válido para simular a recuperação"
          placeholder="nome@exemplo.com" placeholderTextColor="#71717a" value={email}
          onChangeText={valor => { setEmail(valor); setErro(''); }}
          keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
          autoComplete="email" maxLength={254} returnKeyType="done" onSubmitEditing={simularSolicitacao} />
        {!!erro && <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{erro}</Text>}
        <TouchableOpacity accessibilityRole="button" style={styles.button} onPress={simularSolicitacao}>
          <Text style={styles.buttonText}>Simular solicitação</Text>
        </TouchableOpacity>
      </View>}

      <View style={styles.footer}>
        <TouchableOpacity accessibilityRole="button" style={styles.backButton} onPress={() => router.navigate('/')}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#c2410c" />
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
  label: { fontSize: 15, fontWeight: 'bold', color: '#27272a', marginTop: 4 },
  input: { minHeight: 48, borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 10, padding: 14, backgroundColor: '#fafafa', color: '#18181b', fontSize: 16 },
  inputError: { borderColor: '#b91c1c' },
  error: { color: '#b91c1c', fontSize: 14, lineHeight: 21 },
  button: { minHeight: 48, padding: 16, backgroundColor: '#18181b', alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginTop: 4 },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  confirmation: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 12, padding: 16, gap: 12 },
  confirmationTitle: { fontSize: 20, fontWeight: 'bold', color: '#065f46' },
  email: { fontSize: 16, fontWeight: 'bold', color: '#18181b' },
  secondaryButton: { minHeight: 48, padding: 12, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  secondaryText: { fontSize: 15, fontWeight: 'bold', color: '#27272a', textAlign: 'center' },
  footer: { borderTopWidth: 1, borderTopColor: '#f4f4f5', paddingTop: 12 },
  backButton: { minHeight: 48, paddingVertical: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 16, color: '#c2410c', fontWeight: 'bold' },
});
