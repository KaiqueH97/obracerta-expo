import { router } from 'expo-router';
import AuthLayout from '../components/AuthLayout';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { storage } from '../storage/storage';

// Função utilitária para os alertas funcionarem tanto no celular quanto no navegador
const mostrarAlerta = (titulo, mensagem) => {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
    return;
  }
  Alert.alert(titulo, mensagem);
};

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      mostrarAlerta('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const dadosUsuario = {
      nome: nome,
      email: email,
      senha: senha
    };

    try {
      await storage.set('usuario', JSON.stringify(dadosUsuario));
    } catch {
      mostrarAlerta('Erro', 'Não foi possível salvar o cadastro. Tente novamente.');
      return;
    }

    mostrarAlerta('Sucesso', 'Conta criada com sucesso!');
    
    // Limpa os campos após o cadastro
    setNome('');
    setEmail('');
    setSenha('');
    
    // Redireciona para a tela de Login
    router.replace('/');
  };

  return (
    <AuthLayout>
      <View style={styles.card}>
        <Text style={styles.titulo}>Criar Conta</Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome completo"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
          <Text style={styles.textoBotao}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/')} style={styles.linkContainer}>
          <Text style={styles.textoLink}>Já tem uma conta? <Text style={styles.textoLinkBold}>Faça Login</Text></Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
  titulo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#18181b',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    color: '#18181b',
  },
  botao: {
    minHeight: 48,
    backgroundColor: '#ea580c',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotao: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  textoLink: {
    color: '#4b5563',
  },
  textoLinkBold: {
    color: '#c2410c',
    fontWeight: 'bold',
  },
});