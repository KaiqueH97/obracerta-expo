import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Referência visual compartilhada por todas as telas, incluindo a Home.
export const screenStyles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fafafa' },
  title: { fontSize: 28, fontWeight: '900', color: '#18181b' },
  subtitle: { fontSize: 15, lineHeight: 22, color: '#52525b' },
  picker: { minHeight: 48, width: '100%', fontSize: 16, color: '#18181b', backgroundColor: '#fafafa' },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e4e4e7', padding: 16 },
});

export function useScreenContentStyle() {
  const insets = useSafeAreaInsets();
  return [styles.content, {
    paddingLeft: Math.max(insets.left, 16),
    paddingRight: Math.max(insets.right, 16),
    paddingBottom: Math.max(insets.bottom, 40),
  }];
}

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  return <View style={[styles.header, {
    paddingTop: insets.top + 20,
    paddingLeft: Math.max(insets.left, 16),
    paddingRight: Math.max(insets.right, 16),
  }]}>
    <MaterialCommunityIcons name="hard-hat" size={32} color="#ea580c" />
    <Text style={styles.brand}>Obra <Text style={styles.highlight}>Certa</Text></Text>
  </View>;
}

const styles = StyleSheet.create({
  content: { width: '100%', maxWidth: 1200, alignSelf: 'center', padding: 16, paddingBottom: 40 },
  header: { backgroundColor: '#18181b', paddingBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, borderBottomWidth: 4, borderBottomColor: '#ea580c' },
  brand: { color: '#fff', fontSize: 28, fontWeight: '900', flexShrink: 1 },
  highlight: { color: '#ea580c' },
});
