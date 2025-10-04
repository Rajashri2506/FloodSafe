/**
 * FloodSafe - A Tech-Driven Approach to Efficient Disaster Management in India
 * 
 * Main App Component
 * 
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0066cc" />
        <RootNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;
