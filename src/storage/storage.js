import AsyncStorage from '@react-native-async-storage/async-storage';

// Armazenamento local disponível no Expo Go. As operações retornam Promises.
export const storage = {
  set: (key, value) => AsyncStorage.setItem(key, String(value)),
};
