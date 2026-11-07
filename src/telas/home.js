import AppHeader, { useScreenContentStyle, screenStyles } from '../components/ScreenLayout';
import { router, useFocusEffect } from 'expo-router';
import useResponsiveLayout from '../hooks/useResponsiveLayout';
import React, { useCallback, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { carregarResumo } from '../services/home';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Home() {
  const contentStyle = useScreenContentStyle();
  const { compact, wide, desktop } = useResponsiveLayout();
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const leitura = useRef(0);
  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const atualizar = useCallback(() => {
    const versao = ++leitura.current;
    setCarregando(true);
    setErro(false);
    carregarResumo(AsyncStorage).then(dados => {
      if (versao !== leitura.current) return;
      setResumo(dados);
      setCarregando(false);
    }).catch(() => {
      if (versao !== leitura.current) return;
      setErro(true);
      setCarregando(false);
    });
  }, []);

  useFocusEffect(useCallback(() => {
    atualizar();
    return () => { leitura.current++; };
  }, [atualizar]));

  return (
    <View style={styles.container}>

      <AppHeader />
      <ScrollView style={styles.scrollArea} contentContainerStyle={contentStyle}
        keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
        {/* Saudação */}
        <View style={styles.greeting}>
          <Text style={styles.title}>Resumo da Obra</Text>
          <Text style={styles.subtitle}>Acompanhe suas obras, tarefas e materiais cadastrados.</Text>
        </View>

        {/* ACESSO RÁPIDO */}
        <View style={[styles.quickAccess, wide && { flexDirection: 'row' }]}>
          <TouchableOpacity accessibilityRole="button"
            style={[styles.btnAction, wide && { flex: 1 }, { backgroundColor: '#ea580c' }]}
            onPress={() => router.navigate('/calcular')}
          >
            {/* Ícone de Calculadora adicionado aqui */}
            <MaterialCommunityIcons name="calculator" size={24} color="#fff" />
            <Text style={styles.btnText}>Nova Medição</Text>
          </TouchableOpacity>

          <TouchableOpacity accessibilityRole="button"
            style={[styles.btnAction, wide && { flex: 1 }, { backgroundColor: '#27272a' }]}
            onPress={() => router.navigate('/projetos')}
          >
            <MaterialCommunityIcons name="folder-account" size={24} color="#fff" />
            <Text style={styles.btnText}>Meus Projetos</Text>
          </TouchableOpacity>
        </View>

        {carregando ? <View style={styles.feedback}>
          <ActivityIndicator color="#ea580c" size="large" />
          <Text style={styles.subtitle}>Carregando resumo...</Text>
        </View> : erro ? <View style={styles.feedback}>
          <Text accessibilityRole="alert" style={styles.subtitle}>Não foi possível carregar o resumo. Tente novamente.</Text>
          <TouchableOpacity accessibilityRole="button" style={styles.retryButton} onPress={atualizar}>
            <Text style={styles.btnText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View> : resumo && <>
        {/* CARDS DE MÉTRICAS */}
        <View style={styles.gridContainer}>
          <View style={[styles.card, { width: !wide ? '100%' : desktop ? '23.5%' : '48%' }]}>
            <View style={[styles.iconBox, { backgroundColor: '#dbeafe' }]}>
              <MaterialCommunityIcons name="domain" size={24} color="#2563eb" />
            </View>
            <Text style={styles.cardLabel}>Obras cadastradas</Text>
            <Text style={styles.cardValue}>{resumo.obrasCadastradas}</Text>
          </View>

          <View style={[styles.card, { width: !wide ? '100%' : desktop ? '23.5%' : '48%' }]}>
            <View style={[styles.iconBox, { backgroundColor: '#d1fae5' }]}>
              <MaterialCommunityIcons name="check-decagram" size={24} color="#059669" />
            </View>
            <Text style={styles.cardLabel}>Tarefas concluídas</Text>
            <Text style={styles.cardValue}>{resumo.tarefasConcluidas}</Text>
          </View>

          <View style={[styles.card, { width: !wide ? '100%' : desktop ? '23.5%' : '48%' }]}>
            <View style={[styles.iconBox, { backgroundColor: '#ffedd5' }]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#ea580c" />
            </View>
            <Text style={styles.cardLabel}>Tarefas pendentes</Text>
            <Text style={[styles.cardValue, { color: '#ea580c' }]}>{resumo.tarefasPendentes}</Text>
          </View>

          <View style={[styles.card, { width: !wide ? '100%' : desktop ? '23.5%' : '48%' }]}>
            <View style={[styles.iconBox, { backgroundColor: '#f3e8ff' }]}>
              <MaterialCommunityIcons name="currency-usd" size={24} color="#9333ea" />
            </View>
            <Text style={styles.cardLabel}>Custo Materiais</Text>
            <Text style={styles.cardValue}>{moeda.format(resumo.custoTotal)}</Text>
          </View>
        </View>

        {/* LISTA DE PROJETOS RECENTES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Projetos Recentes</Text>
            <TouchableOpacity accessibilityRole="button" style={styles.linkButton} onPress={() => router.navigate('/projetos')}>
              <Text style={styles.linkText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {resumo.recentes.length === 0 && <View style={styles.emptyState}>
            <MaterialCommunityIcons name="folder-plus-outline" size={40} color="#71717a" />
            <Text style={styles.sectionTitle}>Nenhuma obra cadastrada</Text>
            <Text style={styles.subtitle}>Crie seu primeiro projeto para acompanhar o resumo aqui.</Text>
            <TouchableOpacity accessibilityRole="button" style={styles.retryButton} onPress={() => router.navigate('/projetos')}>
              <Text style={styles.btnText}>Criar projeto</Text>
            </TouchableOpacity>
          </View>}
          {resumo.recentes.map((projeto) => (
            <View key={projeto.id} style={[styles.projectItem, compact && styles.projectItemCompact]}>
              <View style={styles.projectInfo}>
                <Text style={styles.projectName}>{projeto.titulo}</Text>
                <Text style={styles.subtitle}>{Number.isFinite(Date.parse(projeto.criado_em))
                  ? `Criado em ${new Date(projeto.criado_em).toLocaleDateString('pt-BR')}` : 'Data não informada'}</Text>
              </View>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Abrir ${projeto.titulo}`} style={styles.openBtn}
                onPress={() => router.push({ pathname: '/projeto-detalhes', params: { id: projeto.id, titulo: projeto.titulo } })}>
                <Text style={styles.openBtnText}>Abrir</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color="#ea580c" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        </>}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  feedback: { padding: 24, alignItems: 'center', gap: 16 },
  retryButton: { minHeight: 48, padding: 16, borderRadius: 12, backgroundColor: '#18181b', alignItems: 'center', justifyContent: 'center' },
  linkButton: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 8 },
  emptyState: { paddingVertical: 16, gap: 12, alignItems: 'center' },
  projectItemCompact: { flexDirection: 'column', alignItems: 'stretch' },
  container: {
    ...screenStyles.page,
  },
  scrollArea: { flex: 1 },
  greeting: {
    marginBottom: 24,
  },
  title: screenStyles.title,
  subtitle: { ...screenStyles.subtitle, marginTop: 4 },
  quickAccess: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  btnAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
  },
  btnText: {
    flexShrink: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: { ...screenStyles.card, width: '48%', marginBottom: 16, elevation: 1 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: '#52525b',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#18181b',
    marginTop: 4,
  },
  section: screenStyles.card,
  sectionHeader: {
    flexWrap: 'wrap',
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18181b',
  },
  linkText: {
    color: '#ea580c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
  },
  projectInfo: {
    minWidth: 0,
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181b',
    marginBottom: 4,
  },
  openBtn: {
    minHeight: 48,
    paddingHorizontal: 12,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  openBtnText: {
    color: '#ea580c',
    fontWeight: '600',
    fontSize: 14,
  }
});
