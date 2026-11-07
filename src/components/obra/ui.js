import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TAMANHO_PAGINA } from '../../services/obra';

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const formatarMoeda = valor => moeda.format(valor);
export const novoId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function Botao({ texto, onPress, disabled = false, secundario = false, perigo = false }) {
  return <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={onPress}
    style={[estilos.botao, secundario && estilos.secundario, perigo && estilos.perigo, disabled && estilos.desabilitado]}>
    <Text style={[estilos.textoBotao, secundario && estilos.textoSecundario]}>{texto}</Text>
  </TouchableOpacity>;
}

export function Campo({ titulo, value, onChangeText, disabled = false, decimal = false, placeholder = '' }) {
  return <View style={estilos.campo}>
    <Text style={estilos.label}>{titulo}</Text>
    <TextInput accessibilityLabel={titulo} value={value} onChangeText={onChangeText} editable={!disabled}
      keyboardType={decimal ? 'decimal-pad' : 'default'} style={estilos.input} maxLength={decimal ? 20 : 200}
      placeholder={placeholder} placeholderTextColor="#71717a" />
  </View>;
}

export function Confirmacao({ descricao, onConfirm, onCancel, disabled }) {
  return <View style={estilos.confirmacao}>
    <Text style={estilos.titulo}>Confirmar exclusão?</Text>
    <Text style={estilos.texto}>{descricao}</Text>
    <Botao texto="Confirmar exclusão" perigo disabled={disabled} onPress={onConfirm} />
    <Botao texto="Cancelar" secundario disabled={disabled} onPress={onCancel} />
  </View>;
}

export function Paginacao({ total, pagina, onChange, disabled = false }) {
  const ultima = Math.max(0, Math.ceil(total / TAMANHO_PAGINA) - 1);
  const atual = Math.min(pagina, ultima);
  return <View style={estilos.paginacao}>
    <Text accessibilityLiveRegion="polite" style={estilos.ajuda}>
      {total ? `${atual * TAMANHO_PAGINA + 1}–${Math.min((atual + 1) * TAMANHO_PAGINA, total)} de ${total}` : '0 registros'}
    </Text>
    <View style={estilos.acoes}>
      <Botao texto="Anterior" secundario disabled={disabled || atual === 0} onPress={() => onChange(atual - 1)} />
      <Botao texto="Próxima" secundario disabled={disabled || atual === ultima} onPress={() => onChange(atual + 1)} />
    </View>
  </View>;
}

export function itensPagina(itens, pagina) {
  const atual = Math.min(pagina, Math.max(0, Math.ceil(itens.length / TAMANHO_PAGINA) - 1));
  return itens.slice(atual * TAMANHO_PAGINA, (atual + 1) * TAMANHO_PAGINA);
}

export const estilos = StyleSheet.create({
  painel: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e4e4e7', gap: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#18181b' },
  subtitulo: { fontSize: 17, fontWeight: 'bold', color: '#18181b' },
  texto: { fontSize: 15, color: '#3f3f46', lineHeight: 22 },
  ajuda: { fontSize: 13, color: '#52525b', lineHeight: 20 },
  input: { minHeight: 48, borderWidth: 1, borderColor: '#d4d4d8', backgroundColor: '#fafafa', padding: 12, borderRadius: 10, color: '#18181b', fontSize: 16 },
  campo: { gap: 8 },
  label: { color: '#27272a', fontSize: 14, fontWeight: 'bold' },
  botao: { minHeight: 48, padding: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#18181b' },
  secundario: { backgroundColor: '#f4f4f5' },
  perigo: { backgroundColor: '#b91c1c' },
  textoBotao: { color: '#fff', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
  textoSecundario: { color: '#9a3412' },
  desabilitado: { opacity: 0.5 },
  item: { paddingVertical: 16, gap: 12, borderTopWidth: 1, borderColor: '#e4e4e7' },
  acoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  linha: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  badge: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#ffedd5' },
  quantidade: { fontSize: 13, fontWeight: 'bold', color: '#9a3412' },
  dinheiro: { fontSize: 18, fontWeight: 'bold', color: '#047857', flexShrink: 1 },
  negativo: { color: '#b91c1c' },
  aviso: { color: '#9a3412', backgroundColor: '#fff7ed', padding: 12, borderRadius: 10, fontSize: 15, lineHeight: 22 },
  confirmacao: { padding: 12, gap: 12, borderRadius: 12, backgroundColor: '#fef2f2' },
  paginacao: { gap: 12, borderTopWidth: 1, borderColor: '#e4e4e7', paddingTop: 16 },
  seletor: { borderWidth: 1, borderColor: '#d4d4d8', borderRadius: 10, overflow: 'hidden', backgroundColor: '#fafafa' },
});
