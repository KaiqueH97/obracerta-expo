import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screens = [
  ['home', 'Início', 'view-dashboard'],
  ['projetos', 'Projetos', 'folder-account'],
  ['calcular', 'Calcular', 'calculator'],
  ['equipe', 'Equipe', 'account-group'],
  ['perfil', 'Perfil', 'cog'],
];

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return <Tabs id="MenuPrincipal" screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: '#ea580c',
    tabBarInactiveTintColor: '#71717a',
    tabBarStyle: { paddingTop: 8, paddingBottom: Math.max(insets.bottom, 8), height: 64 + Math.max(insets.bottom, 8) },
    tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
  }}>
    {screens.map(([name, title, icon]) => <Tabs.Screen key={name} name={name} options={{
      title,
      tabBarIcon: ({ color }) => <MaterialCommunityIcons name={/** @type {any} */ (icon)} size={24} color={String(color)} />,
    }} />)}
  </Tabs>;
}
