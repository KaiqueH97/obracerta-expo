import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import AppHeader, { screenStyles, useScreenContentStyle } from './ScreenLayout';

export default function AuthLayout({ children }) {
  const contentStyle = useScreenContentStyle();
  return <View style={screenStyles.page}>
    <AppHeader />
    <KeyboardAvoidingView style={screenStyles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[contentStyle, styles.content]} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  </View>;
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
});
