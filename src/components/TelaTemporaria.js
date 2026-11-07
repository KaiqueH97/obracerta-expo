import { View, Text } from 'react-native';

export default function TelaTemporaria({ nome }) {
  return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Tela de {nome} em construção</Text>
  </View>;
}
