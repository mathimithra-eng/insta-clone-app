import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

import { SocialProvider } from './src/context/SocialContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <SocialProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </SocialProvider>
    </SafeAreaProvider>
  );
}
