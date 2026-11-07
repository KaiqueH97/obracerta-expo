import AppHeader, { useScreenContentStyle, screenStyles } from '../components/ScreenLayout';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useResponsiveLayout from '../hooks/useResponsiveLayout';
import { criarRepositorioObra, resumoFinanceiro } from '../services/obra';
import { criarRepositorioPerfil } from '../services/perfil';
import Materiais from '../components/obra/Materiais';
import Caixa from '../components/obra/Caixa';
import Tarefas from '../components/obra/Tarefas';
import { Botao, estilos, formatarMoeda } from '../components/obra/ui';

const repositorio = criarRepositorioObra(AsyncStorage);
const perfis = criarRepositorioPerfil(AsyncStorage);
const abas = [['materiais', 'Orçamento'], ['transacoes', 'Caixa'], ['tarefas', 'Tarefas']];

export default function ProjetoDetalhes() {
  const { id } = useLocalSearchParams();
  return <Detalhes key={String(id)} id={typeof id === 'string' ? id : ''} />;
}

function Detalhes({ id }) {
  const contentStyle = useScreenContentStyle();
  const { wide, desktop } = useResponsiveLayout();
  const [dados, setDados] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [aba, setAba] = useState('materiais');
  const [cotacao, setCotacao] = useState('');
  const leitura = useRef(0);
  const envio = useRef(false);

  const carregar = useCallback(() => {
    const versao = ++leitura.current;
    setCarregando(true); setErro(''); setCotacao(''); setMensagem('');
    Promise.all([repositorio.carregar(id), perfis.carregar().catch(() => null)]).then(([obra, usuario]) => {
      if (versao !== leitura.current) return;
      setDados(obra); setPerfil(usuario); setCarregando(false);
    }).catch(error => {
      if (versao !== leitura.current) return;
      setErro(error instanceof Error && error.message.startsWith('Obra não encontrada')
        ? error.message : 'Não foi possível carregar esta obra. Tente novamente.');
      setCarregando(false);
    });
  }, [id]);

  useFocusEffect(useCallback(() => {
    carregar();
    return () => { leitura.current++; };
  }, [carregar]));

  async function salvar(tipo, registros) {
    if (envio.current || carregando || erro || !dados) return false;
    envio.current = true; setOcupado(true); setMensagem('');
    try {
      const atualizado = { ...dados, [tipo]: registros };
      resumoFinanceiro(atualizado.materiais, atualizado.transacoes);
      await repositorio.salvar(id, tipo, registros);
      setDados(atualizado); setCotacao(''); setMensagem('Alterações salvas.');
      return true;
    } catch (error) {
      setMensagem(error instanceof Error && error.message.includes('obra não está')
        ? error.message : 'Não foi possível salvar. Os dados exibidos foram mantidos. Tente novamente.');
      return false;
    } finally { envio.current = false; setOcupado(false); }
  }

  if (carregando || erro || !dados) return <View style={screenStyles.page}><AppHeader /><View style={styles.feedback}>
    <Text style={estilos.titulo}>Detalhes da Obra</Text>
    {carregando ? <ActivityIndicator size="large" color="#ea580c" /> : <>
      <Text accessibilityRole="alert" style={estilos.texto}>{erro}</Text>
      <Botao texto="Tentar novamente" onPress={carregar} />
    </>}
    <Botao texto="Voltar aos projetos" secundario onPress={() => router.navigate('/projetos')} />
  </View></View>;

  const resumo = resumoFinanceiro(dados.materiais, dados.transacoes);
  const indicadores = [
    ['Entradas', resumo.entradas, '#047857'], ['Materiais', resumo.materiais, '#c2410c'],
    ['Equipe', resumo.equipe, '#1d4ed8'], ['Lucro atual', resumo.lucro, resumo.lucro < 0 ? '#b91c1c' : '#047857'],
  ];
  function prepararCotacao() {
    const texto = [`Obra Certa — Cotação de materiais`, `Obra: ${dados.projeto.titulo}`];
    if (perfil?.nome) texto.push(`Profissional: ${perfil.nome}`);
    if (perfil?.telefone) texto.push(`Contato: ${perfil.telefone}`);
    texto.push('', ...dados.materiais.map(item => `• ${item.nome} — ${item.quantidade}`));
    setCotacao(texto.join('\n'));
  }

  return <View style={screenStyles.page}><AppHeader />
    <ScrollView style={styles.container} contentContainerStyle={[contentStyle, { gap: 16 }]}
      keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
    <View style={styles.header}>
      <Botao texto="← Projetos" secundario disabled={ocupado} onPress={() => router.navigate('/projetos')} />
      <View style={styles.headerText}>
        <Text accessibilityRole="header" style={styles.title}>{dados.projeto.titulo}</Text>
        <Text style={estilos.ajuda}>Gestão de materiais, tarefas e caixa.</Text>
      </View>
    </View>
    <View style={styles.indicadores}>
      {indicadores.map(([titulo, valor, cor]) => <View key={titulo} style={[styles.indicador, { width: desktop ? '23.5%' : wide ? '48%' : '100%' }]}>
        <Text style={estilos.label}>{titulo}</Text>
        <Text style={[styles.valor, { color: String(cor) }]}>{formatarMoeda(valor)}</Text>
      </View>)}
    </View>
    <Text style={estilos.ajuda}>Lucro atual = entradas − materiais − pagamentos da equipe.</Text>
    {dados.transacoes.some(item => item.tipo === 'PAGAMENTO') && <Text style={estilos.ajuda}>Pagamentos anteriores sem profissional vinculado também estão incluídos no total da Equipe.</Text>}
    {!!mensagem && <Text accessibilityLiveRegion="polite" style={estilos.aviso}>{mensagem}</Text>}
    {!!dados.materiais.length && <View style={estilos.painel}>
      <Botao texto="Preparar cotação completa" secundario disabled={ocupado} onPress={prepararCotacao} />
      {!!cotacao && <>
        <Text style={estilos.ajuda}>{dados.materiais.length} {dados.materiais.length === 1 ? 'material na cotação.' : 'materiais na cotação.'}</Text>
        <Text selectable style={estilos.texto}>{cotacao}</Text>
        <Botao texto="Abrir cotação no WhatsApp" disabled={ocupado} onPress={() => {
          Linking.openURL(`https://wa.me/?text=${encodeURIComponent(cotacao)}`).catch(() => setMensagem('Não foi possível abrir o WhatsApp. Você pode copiar a cotação acima.'));
        }} />
      </>}
    </View>}
    {!desktop && <View style={styles.abas}>
      {abas.map(([chave, titulo]) => <View style={styles.aba} key={chave}>
        <Botao texto={titulo} secundario={aba !== chave} disabled={ocupado} onPress={() => setAba(chave)} />
      </View>)}
    </View>}
    <View style={[styles.paineis, desktop && { flexDirection: 'row', alignItems: 'flex-start' }]}>
      {(desktop || aba === 'materiais') && <View style={[styles.coluna, desktop && { flex: 1 }]}>
        <Materiais id={id} materiais={dados.materiais} salvar={salvar} ocupado={ocupado} />
      </View>}
      {(desktop || aba === 'transacoes') && <View style={[styles.coluna, desktop && { flex: 1 }]}>
        <Caixa transacoes={dados.transacoes} equipe={dados.equipe} salvar={salvar} ocupado={ocupado} />
      </View>}
      {(desktop || aba === 'tarefas') && <View style={[styles.coluna, desktop && { flex: 1 }]}>
        <Tarefas tarefas={dados.tarefas} salvar={salvar} ocupado={ocupado} />
      </View>}
    </View>
    <View style={styles.rodape}><MaterialCommunityIcons name="hard-hat" size={20} color="#ea580c" /><Text style={estilos.ajuda}>Obra Certa</Text></View>
  </ScrollView></View>;
}

const styles = StyleSheet.create({
  container: screenStyles.page,
  feedback: { flex: 1, justifyContent: 'center', padding: 24, gap: 20, backgroundColor: '#fafafa' },
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 8 },
  headerText: { flexGrow: 1, flexShrink: 1, gap: 6 },
  title: screenStyles.title,
  indicadores: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  indicador: { backgroundColor: '#fff', borderRadius: 12, padding: 16, gap: 10, borderWidth: 1, borderColor: '#e4e4e7' },
  valor: { fontSize: 22, fontWeight: '900' },
  abas: { flexDirection: 'row', gap: 8 },
  aba: { flex: 1, minWidth: 0 },
  paineis: { gap: 16 },
  coluna: { minWidth: 0, width: '100%' },
  rodape: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 16 },
});
