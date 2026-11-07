import { router } from 'expo-router';
import AuthLayout from '../components/AuthLayout';
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Alert } from "react-native";
import { storage } from '../storage/storage';

// Função utilitária para os alertas funcionarem tanto no celular quanto no navegador
const mostrarAlerta = (titulo, mensagem) => {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
    return;
  }
  Alert.alert(titulo, mensagem);
};

export default function Login() {
  const [email, setEmail] = useState("user@obracerta.com");
  const [senha, setSenha] = useState("obra123");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (carregando) return;
    if (!email.trim() || !senha) {
      mostrarAlerta('Atenção', 'Por favor, preencha e-mail e senha.');
      return;
    }
    setCarregando(true);
    try {
      await storage.set('@usuario_email', email.trim());
      router.replace('/home');
    } catch {
      mostrarAlerta('Erro', 'Não foi possível realizar o login.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <AuthLayout>
      <View style={styles.card}>
        <Text style={styles.title}>Entrar na conta</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!carregando}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              placeholder="Digite sua senha"
              secureTextEntry={true}
              editable={!carregando}
            />
          </View>

          <TouchableOpacity
            style={[styles.btnSubmit, carregando && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnSubmitText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity accessibilityRole="button" disabled={carregando} onPress={() => router.push('/recuperar')}>
              <Text style={styles.linkText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>
            
            <View style={styles.registerContainer}>
              <Text style={styles.textGray}>Não tem uma conta? </Text>
              {/* Agora navega de verdade para a tela de Cadastro */}
              <TouchableOpacity onPress={() => router.push('/cadastro')}>
                <Text style={styles.linkRegister}>Cadastre-se aqui</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    color: '#18181b',
    marginBottom: 32,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    minHeight: 48,
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    fontSize: 16,
    color: '#18181b',
    backgroundColor: '#fff',
  },
  btnSubmit: {
    minHeight: 48,
    width: '100%',
    backgroundColor: '#ea580c',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnSubmitText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    color: '#6b7280',
    fontWeight: '500',
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
  textGray: {
    color: '#4b5563',
    fontSize: 16,
  },
  linkRegister: {
    color: '#ea580c',
    fontWeight: 'bold',
    fontSize: 16,
  }
});